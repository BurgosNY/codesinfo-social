import http from 'node:http';
import { createHash, webcrypto } from 'node:crypto';
import worker from '../dist/server/index.js';
if (!globalThis.crypto) globalThis.crypto = webcrypto;
// Local-only approximation of the R2 operations used by these prototypes.
// Volatile: restart clears all state. Never expose this server publicly.
const objects = new Map();
const bucket = {
 async get(key) { const o=objects.get(key); if(!o)return null; return {etag:o.etag, json:async()=>JSON.parse(o.body), text:async()=>o.body}; },
 async put(key,value,options={}) {
  const old=objects.get(key);const c=options.onlyIf;
  const matches=c instanceof Headers?c.get('If-Match'):c?.etagMatches;
  const excludes=c instanceof Headers?c.get('If-None-Match'):c?.etagDoesNotMatch;
  if(matches && old?.etag!==matches)return null;
  if(excludes==='*' && old)return null;
  const body=String(value),etag=createHash('sha256').update(body).digest('hex');
  objects.set(key,{body,etag});return {etag};
 }
};
const port=Number(process.env.PORT||8787);
http.createServer(async(req,res)=>{
 try {
  const chunks=[];let size=0;for await (const c of req){size+=c.length;if(size>1000000){res.writeHead(413);res.end('Request too large');return;}chunks.push(c);}
  const url=`http://localhost:${port}${req.url}`;
  const init={method:req.method,headers:req.headers};if(!['GET','HEAD'].includes(req.method))init.body=Buffer.concat(chunks);
  const env={...process.env,BUCKET:bucket};
  const response=await worker.fetch(new Request(url,init),env);
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch(error){console.error(error.message);res.writeHead(500);res.end('Erro local. Consulte o terminal.');}
}).listen(port,'127.0.0.1',()=>console.log(`Abra http://localhost:${port}. Servidor local; dados em memória.`));

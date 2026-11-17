from pathlib import Path
import json,base64,mimetypes
p=Path(__file__).resolve().parent.parent
assets={('/'+str(f.relative_to(p/'public'))):[mimetypes.guess_type(f)[0] or 'application/octet-stream',base64.b64encode(f.read_bytes()).decode()] for f in (p/'public').rglob('*') if f.is_file()}
(p/'worker/index.js').write_text('const assets='+json.dumps(assets)+';\n'+(p/'worker/handler.js').read_text())

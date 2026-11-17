# Reaproveitamento de conteúdo

Extração de reportagens, sugestões editoriais e peças para redes sociais, com narração opcional. O exemplo salvo é identificado como demonstração.

Projeto criado na oficina Codesinfo · REC’n’Play, Recife, 13 de novembro de 2026.

- [Demonstração da oficina](https://codesinfo-social.burgos.chatgpt.site/)
- Slug preservado: `codesinfo-social`.
- Esta cópia é independente do ambiente de hospedagem original. Não contém chaves de API nem o histórico privado de desenvolvimento.

## Instalação e execução

Requisitos: Node.js 22 ou superior; Git. Não há dependências npm para executar localmente. Para o build, também Python 3 e Bash.

```sh
git clone https://github.com/BurgosNY/codesinfo-social.git
cd codesinfo-social
cp .env.example .env
# Edite .env com seus próprios valores antes de usar IA
npm run build
npm start
```

Abra http://localhost:8787. Para trocar a porta: `PORT=8788 npm start`. O servidor escuta apenas em 127.0.0.1. A interface abre sem chave; funções de IA exigem configuração.

## Chaves e custos

- `OPENAI_API_KEY`: sua chave pessoal de API, obtida no painel do provedor. Uma assinatura do ChatGPT não inclui automaticamente créditos de API.
- `OPENAI_MODEL`: modelo disponível na sua conta que suporte os recursos utilizados. O padrão sugerido é `gpt-4.1`; confira disponibilidade e custo antes de executar.

As chaves são lidas no servidor, não colocadas no HTML. Não publique `.env`, não compartilhe credenciais e configure limites de gasto no provedor. Usar IA transmite o texto selecionado ao provedor; só envie conteúdo que você pode compartilhar.

## Usar outro motor de IA

**OpenAI pode ser substituída**, mas este código não promete compatibilidade automática ao trocar apenas a chave. O adaptador está em `worker/handler.js`. Ele chama `/v1/responses` e extrai blocos `output_text`; ajuste URL, autenticação, formato de entrada e extração da resposta para o provedor escolhido. Preserve o contrato JSON esperado pela interface e os testes. Um servidor que ofereça apenas `/chat/completions` não é substituto direto. Modelos locais também podem ser integrados com um adaptador equivalente.

Narração é uma integração separada, em `speech()`, com `/v1/audio/speech` e o modelo `gpt-4o-mini-tts`. Trocar o motor de texto não troca o de voz: configure outro serviço de TTS, preserve o retorno de áudio, ou desative o botão.

## Armazenamento e hospedagem

O adaptador local simula as operações R2 usadas pelo projeto **em memória**. Reiniciar apaga esse estado; dados de navegador continuam sujeitos a limpeza do navegador. Não é um banco de produção nem uma cópia dos dados compartilhados da oficina.

O build gera `dist/server/index.js`, um módulo Worker com `fetch(request, env)`. Para hospedar em Cloudflare Workers, crie sua própria configuração e um bucket R2 ligado como `BUCKET` nos projetos que o usam. Defina os segredos no provedor de hospedagem. **Não exponha o servidor local na internet**: antes de produção, implemente autenticação por usuário, limites de uso persistentes, política de privacidade e controle de custos. O código de oficina e limites locais não substituem essas proteções. Nenhum deploy automático está configurado.

## Limites e uso editorial

Protótipo de oficina, não produto auditado para produção. Revise resultados, datas, contexto e fontes antes de publicar. Demonstrações históricas não indicam que a informação continua atual. Marcas e materiais de terceiros mantêm seus direitos; consulte `ASSETS.md`.

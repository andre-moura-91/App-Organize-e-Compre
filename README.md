# Organize & Compre

Aplicação web para organizar listas de compras. O projeto oferece telas de cadastro e login com sessão no servidor, além das páginas de listas e perfil.

## Tecnologias

- HTML, CSS e JavaScript
- Vite para desenvolvimento e build das páginas
- Node.js, Express e PostgreSQL para autenticação
- Senhas protegidas com `scrypt`; sessões armazenadas no PostgreSQL em cookies `HttpOnly`

## Requisitos

- Node.js 20 ou superior
- Docker Desktop com Docker Compose, ou uma instância PostgreSQL acessível

## Desenvolvimento local no Windows

1. Instale as dependências:

   ```powershell
   npm install
   ```

2. Crie a configuração local:

   ```powershell
   Copy-Item .env.example .env
   node --input-type=module -e "import { randomBytes } from 'node:crypto'; console.log(randomBytes(48).toString('base64url'))"
   ```

   Copie o valor impresso pelo segundo comando, abra `.env` e substitua o valor de `SESSION_SECRET`. Não envie o arquivo `.env` ao Git.

3. Inicie o PostgreSQL local com Docker:

   ```powershell
   docker compose up -d db
   ```

   O PostgreSQL do contêiner fica disponível em `127.0.0.1:5433` para não conflitar com uma instalação local que use a porta padrão `5432`. Confirme com `docker compose ps db` que o serviço está como `healthy` antes de continuar. O usuário, a senha e o banco de desenvolvimento são definidos no `.env`. Se alterar a senha, atualize também `DATABASE_URL`. Não reutilize essas credenciais em produção.

   Se for usar uma instância PostgreSQL já existente, pule o comando do Docker e configure `DATABASE_URL` no `.env` com os dados dessa instância; o banco indicado precisa existir.

4. Inicie o backend e o Vite:

   ```powershell
   npm run dev
   ```

   Abra `http://127.0.0.1:5173`. O backend cria a tabela de usuários ao iniciar; o armazenamento de sessões também é criado automaticamente.

## Build e produção

```powershell
npm test
npm run lint
npm run build
npm start
```

`npm start` serve as páginas compiladas em `dist` junto com a API. Em produção, configure `NODE_ENV=production`, `DATABASE_URL`, `SESSION_SECRET`, `APP_ORIGIN` com a origem HTTPS pública e `HOST=0.0.0.0` conforme a plataforma. Use HTTPS atrás de um proxy confiável para que os cookies seguros sejam enviados corretamente. Não exponha o PostgreSQL à internet.

## Autenticação e limites atuais

- Cadastro exige senha de pelo menos 12 caracteres; senhas não são gravadas no navegador. O e-mail ainda não é confirmado, então configure verificação de endereço antes de usar em produção.
- Login e cadastro usam consultas parametrizadas, proteção CSRF, limitação de tentativas e sessões `HttpOnly`, `SameSite=Lax`.
- A recuperação de senha por e-mail e o login social estão desativados até que um serviço de e-mail/provedor OAuth seja configurado. A interface informa essa limitação, sem fingir que enviou um e-mail ou autenticou com terceiros.
- As listas ainda são armazenadas no navegador e não são sincronizadas nem isoladas por conta. Não use dados sensíveis nelas. A autenticação não substitui HTTPS, configuração segura do servidor, backups e monitoramento.

## Testes

`npm test` executa testes de hashing e fluxos HTTP de cadastro, login, sessão, CSRF e logout usando armazenamento em memória de teste. Os testes não requerem uma instância PostgreSQL.

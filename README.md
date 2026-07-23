# Province Registry API

API RESTful para gestão de utilizadores, províncias e municípios de Angola, desenvolvida
como teste técnico para a vaga de Backend Developer (Node.js / TypeScript).

Permite registo e autenticação de utilizadores (JWT), CRUD de utilizadores, províncias e
municípios, garantindo que cada município pertence sempre à província correta.

## Roles

Existem dois papéis: `user` e `admin`.

- **user** (papel por omissão, atribuído por `/auth/register`): só pode consultar/atualizar/apagar
  a **própria** conta e apenas ler províncias e municípios.
- **admin**: pode criar/atualizar/apagar qualquer utilizador (incluindo definir o role de outros
  em `POST /users`) e é o único que pode escrever (criar/atualizar/apagar) províncias e municípios.

Um utilizador comum nunca consegue alterar o próprio `role` — esse campo só é aceite quando quem
faz o pedido já é admin.

## Tecnologias

- Node.js + TypeScript
- Express.js
- MongoDB + Mongoose
- JWT (`jsonwebtoken`) para autenticação
- Zod para validação
- bcryptjs para hash de password
- Swagger/OpenAPI (`swagger-jsdoc` + `swagger-ui-express`)
- Vitest para testes

## Estrutura do projeto

```
src/
├── shared/       → env, conexão à BD, middlewares, erros
├── modules/
│   ├── auth/         → login e emissão de JWT
│   ├── user/          → utilizadores
│   ├── province/      → províncias
│   └── municipality/  → municípios
├── app.ts        → configuração do Express
└── server.ts     → ponto de entrada
```

Cada módulo segue `domain → application → infrastructure → http`, isolando as regras de
negócio (`application`) de Express e Mongoose.

## Como instalar

```bash
git clone https://github.com/nuelst/province-registry-api.git
cd province-registry-api
npm install
cp .env.example .env
```

## Variáveis de ambiente

| Variável         | Descrição                          | Exemplo                                       |
| ---------------- | ---------------------------------- | --------------------------------------------- |
| `PORT`           | Porta do servidor HTTP             | `3000`                                        |
| `NODE_ENV`       | Ambiente de execução               | `development` \| `production` \| `test`       |
| `MONGO_URI`      | String de conexão do MongoDB       | `mongodb://localhost:27017/province-registry` |
| `JWT_SECRET`     | Segredo para assinar os tokens JWT | `um-segredo-forte-e-aleatorio`                |
| `JWT_EXPIRES_IN` | Tempo de expiração do token        | `1d`                                          |
| `ADMIN_EMAIL`    | Email do admin criado pelo `seed:admin` (opcional, só o script) | `admin@email.com`         |
| `ADMIN_PASSWORD` | Password do admin criado pelo `seed:admin` (opcional, só o script) | `password123`           |
| `ADMIN_NAME`     | Nome do admin criado pelo `seed:admin` (opcional, default `Administrador`) | `Administrador`  |

Para gerar um `JWT_SECRET` aleatório:

```bash
openssl rand -hex 32
# ou, sem depender do OpenSSL:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Como executar

```bash
# Subir o MongoDB (ou usar docker compose up -d mongo)
npm run dev          # desenvolvimento, com hot-reload

npm run build         # build de produção
npm start
```

Servidor disponível em `http://localhost:3000`:

- Health check: `GET /health`
- Documentação Swagger: `GET /doc`

Também é possível subir tudo (API + MongoDB) com:

```bash
docker compose up
```

### Bootstrap do primeiro admin

Como `/auth/register` só cria utilizadores com `role: user` e criar/gerir províncias e
municípios passou a exigir `role: admin`, é preciso um primeiro admin para desbloquear o resto.
Defina `ADMIN_EMAIL` e `ADMIN_PASSWORD` no `.env` e corra:

```bash
npm run seed:admin
```

O script é idempotente (não faz nada se o email já existir) e, se a base de dados estiver
completamente vazia, cria também uma província e um município por omissão para que o registo de
novos utilizadores tenha para onde apontar.

## Como testar

```bash
npm test
```

Os testes cobrem os casos de uso da camada `application` com repositórios mockados
(não requerem MongoDB a correr), com foco na regra de negócio que garante que o
município selecionado pertence à província informada.

## Paginação e filtros

Os três endpoints de listagem (`GET /users`, `GET /provinces`, `GET /municipalities`) suportam
paginação **opcional**: sem `page`/`limit` devolvem sempre o array completo (comportamento atual,
usado por exemplo pelos dropdowns de registo). Com `page` e/ou `limit`, devolvem um envelope
`{ data, page, limit, total, totalPages }`. Os filtros aplicam-se sempre, com ou sem paginação.

| Endpoint               | Filtros                          |
| ----------------------- | --------------------------------- |
| `GET /users`            | `province`, `municipality`, `role` |
| `GET /provinces`        | `name` (pesquisa parcial)          |
| `GET /municipalities`   | `province`, `name` (pesquisa parcial) |

Exemplos:

```
GET /api/users?role=admin
GET /api/provinces?name=lua&page=1&limit=10
GET /api/municipalities?province=<id>&page=2
```

## Documentação Swagger

- Produção: https://province-registry-api.up.railway.app/doc/
- Local: após correr o projeto, em `http://localhost:3000/doc`

## Autor

**Manuel**

- GitHub: [@nuelst](https://github.com/nuelst)
- LinkedIn: [in/nuelst](https://www.linkedin.com/in/nuelst/)

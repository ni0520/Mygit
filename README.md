# Haikus for Codespaces

This is a quick node project template for demoing Codespaces. It is based on the [Azure node sample](https://github.com/Azure-Samples/nodejs-docs-hello-world).

Point your browser to [Quickstart for GitHub Codespaces](https://docs.github.com/en/codespaces/getting-started/quickstart) for a tour of using Codespaces with this repo.

## Local development

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Available scripts

- `npm start`: Start the production server.
- `npm run dev`: Start with `nodemon`.
- `npm test`: Run API tests.
- `npm run lint`: Run ESLint checks.
- `npm run format`: Run Prettier formatting checks.

## Health check

The app exposes `GET /healthz` and returns:

```json
{ "status": "ok" }
```

## Security notes

- Haiku text in templates is rendered using escaped output (`<%= ... %>`) to reduce XSS risk.
- If data sources change from static JSON to user-provided input, perform server-side sanitization/validation before rendering.

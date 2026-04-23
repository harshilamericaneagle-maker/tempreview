# ReviewHub Monorepo

ReviewHub is a multi-tenant, AI-powered review management SaaS.

## Workspace

- `apps/web` - Next.js web application
- `apps/worker` - BullMQ worker process
- `packages/*` - shared packages (`db`, `ai`, `integrations`, `ui`, `config`, `tsconfig`)

## Scripts

```bash
corepack pnpm install
corepack pnpm dev
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
```

## Current Status

Initial monorepo scaffold complete. Feature implementation continues in subsequent commits.

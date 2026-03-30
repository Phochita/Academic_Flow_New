Drizzle tooling lives in this folder.

What stays the same:
- Runtime database client: `server/src/db/index.ts`
- Schema files: `server/src/db/schema/*.ts`
- Frontend and backend application code

What is isolated here:
- Drizzle config: `server/drizzle/drizzle.config.ts`
- Generated migrations: `server/drizzle/migrations`

Main commands:
- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:push`
- `npm run db:studio`

Environment:
- `DATABASE_URL` for the app
- `DRIZZLE_DATABASE_URL` optional override for Drizzle commands

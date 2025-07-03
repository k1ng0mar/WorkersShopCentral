# WorkersShop

Food loan prototype for Nigerian federal workers. Register with a phone
number and IPPIS ID, order from a food catalog, and track repayment through
salary deductions.

## Stack

- React 18 and TypeScript, Vite for the frontend
- Express backend
- TanStack Query for data, Wouter for routing, Zod for validation
- Tailwind and shadcn/ui components

## Running it

```
npm install
npm run dev      # http://localhost:5000
```

## Status

The prototype keeps all state in memory (`server/storage.ts`). There is no
database connection yet; `shared/schema.ts` and `drizzle.config.ts` are the
planned Postgres shape, unused at runtime.

## Layout

- `client/src/pages` screens (landing, register, login, dashboard, malls, states)
- `client/src/components` app components, including the food menu and receipts
- `server` Express routes and the in-memory store
- `shared` schema and the Nigerian states list

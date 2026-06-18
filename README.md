# Veilo Backend

Express + MongoDB API for the Veilo Bitcoin mixer site. It stores mixes, exposes
the mixing status that the frontend transaction page polls, and provides an admin
API. The blockchain side (detecting deposits, confirmations, running the mix, and
moving funds) is a separate service — this API only stores and serves the status
that the blockchain service writes.

## Requirements

- Node.js 18+
- MongoDB (local or a connection string, e.g. MongoDB Atlas)

## Setup

```bash
cd backend
npm install
cp .env.example .env      # then edit the values
npm run seed:admin        # creates the admin login from ADMIN_EMAIL / ADMIN_PASSWORD
npm run dev               # http://localhost:5000
```

## Environment

See `.env.example`. Key values:

- `MONGO_URI` — MongoDB connection string
- `CORS_ORIGIN` — the frontend origin (e.g. `http://localhost:3000`)
- `JWT_SECRET` — secret for admin auth tokens
- `SERVICE_API_KEY` — shared key the blockchain service sends to write status updates
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — initial admin credentials
- `ENABLE_MOCK_DEPOSIT` / `MOCK_DEPOSIT_ADDRESS` — when `true`, new mixes get a
  placeholder deposit address so the frontend works end-to-end before the
  blockchain service is connected. Set to `false` in production.

## API

Base URL: `/api`

### Public (used by the website)

- `GET /health`
- `GET /config` — fee, limits, delay options
- `POST /mixes` — body `{ "addresses": ["bc1..."], "delay": "2h" }` → creates a mix
- `GET /mixes/:id` — full mix (accepts the Mongo id or the reference)
- `GET /mixes/:id/status` — `{ reference, status, expiresAt }` (the tx page polls this)

### Service (blockchain worker only — header `x-service-key`)

- `PATCH /service/mixes/:id/status` — body `{ "status": "confirming" }`
- `PATCH /service/mixes/:id/deposit-address` — body `{ "depositAddress": "bc1..." }`

### Admin (header `Authorization: Bearer <token>`)

- `POST /admin/login` — `{ email, password }` → `{ token }`
- `GET /admin/mixes?status=&page=&limit=`
- `GET /admin/mixes/:id`
- `PATCH /admin/mixes/:id` — `{ status }`
- `GET /admin/stats`

## Mixing status values

`awaiting_deposit → confirming → mixing → sent` (plus `expired`).

The frontend reads the current value; the blockchain service is what advances it
by calling the service endpoints above.

## Scope

In scope: API, database, status storage/serving, admin, auth.
Out of scope: blockchain/transaction handling (deposit detection, confirmations,
CoinJoin/mixing, wallet operations, moving funds).

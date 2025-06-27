# Checkout Kata Monorepo

A **fully-working supermarket checkout** that scans items in any order, applies
bundle/offer prices, shows savings and exposes a REST API.

| Layer        | Stack & tooling                                                                                     |
| ------------ | --------------------------------------------------------------------------------------------------- |
| **DB**       | `better-sqlite3` (embedded, zero‑config) – seeded at start‑up                                       |
| **Backend**  | Node 22 · TypeScript · Express 4 · _SRP_ folder layout · Jest + Supertest                           |
| **Frontend** | React 18 · Vite 6 · TypeScript · CSS Modules · React Icons · Testing‑Library (+ SWC/Jest)           |
| **Dev DX**   | Single **package.json**, `concurrently` for parallel watch, `tsx` hot‑reload, SWC for fast TS tests |

---

## 1 Quick start

```bash
nvm use              # to ensure using the intended node version
npm install          # install backend & frontend deps
npm run seed         # create SQLite DB and seed 4 demo rows
npm run dev          # backend  ➜ http://localhost:3001
                     # frontend ➜ http://localhost:5173
```

_Open <http://localhost:5173> and start clicking the fruit cards 🍌._

---

## 2 Project structure

```text
.
├── backend
│   ├── app.ts               # Express routes → /products, /health
│   ├── server.ts            # boot & error handling
│   ├── models/              # Product model (better-sqlite3 typed)
│   ├── controllers/         # “one route, one fn” SRP controllers
│   ├── db/                  # connection + schema bootstrap
│   └── tests/               # Jest + Supertest
├── frontend
│   ├── presentation/
│   │   ├── components/      # Product card, Receipt, Summary
│   │   └── views/           # <Checkout/> page
│   ├── services/            # api.ts ↔ backend, useProducts.ts hook
│   └── __tests__/           # hook tests (React 18, jsdom, SWC)
├── scripts/seed.js          # idempotent DB seeding
├── jest.backend.config.js   # ts-jest, Node env + TextEncoder polyfill
├── jest.frontend.config.js  # SWC, jsdom, CSS stubs
└── tsconfig.json            # strict settings shared by both sides
```

---

## 3 Checkout algorithm in a nutshell

```text
scan(sku):
  cart[sku] += 1
  totals := reduce(cart):
      if product has offer_n:
          bundles = qty // offer_n
          singles = qty %  offer_n
          discounted = bundles*offer_price + singles*unit_price
          saved      = qty*unit_price - discounted
      else …
```

_O(n) lookup per scan, O(1) reduction at 'Pay'. Fine for typical basket sizes and easier to read._

---

## 4 Scripts

| command                 | description                                                  |
| ----------------------- | ------------------------------------------------------------ |
| **`npm run dev`**       | `tsx` watches **backend** & Vite dev‑server for **frontend** |
| **`npm run build`**     | Type‑checks, emits `dist/`, Vite SSG build                   |
| **`npm test`**          | Runs **both** Jest projects (backend & frontend)             |
| `npm run test:backend`  | backend tests only (Node env, ts‑jest)                       |
| `npm run test:frontend` | frontend tests only (jsdom, SWC)                             |
| `npm run seed`          | (re)creates DB and seeds demo rows                           |

---

## 5 Accessibility & UX highlights

- semantic HTML (`<ul role="list">`, `.sr-only` helper)
- keyboard focus‑ring, hover & active motion
- responsive grid (1‑4 cols), receipt scroll on small screens
- live savings announced via `aria-live="polite"`

---

## 6 Testing strategy

- **Unit** – pricing maths via `useProducts` hook tests (bundle edge‑cases)
- **Integration** – REST `/products` returns seeded rows (backend test)
- **Future** – add Playwright happy‑path e2e

---

## 7 Roadmap / improvement ideas

| Category            | Idea                                                                                                                       |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Static analysis** | Add ESLint flat‑config + Prettier                                                                                          |
| **Persistence**     | Move to **PostgreSQL + Prisma** for multi‑user concurrency                                                                 |
| **Features**        | Admin auth + catalogue CRUD                                                                                                |
| **e2e**             | Playwright: scan → total → pay                                                                                             |
| **Performance**     | Switch to O (1) running-total pricing (update totals inside `scan`) or, at larger scale, push pricing to a backend service |
| **CI/CD**           | GitHub Actions: lint → type‑check → test → Docker build                                                                    |
| **I18n**            | Use `Intl.NumberFormat` for currency display                                                                               |

---

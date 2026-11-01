This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## API Endpoints

Planned route handlers (`src/app/api/.../route.js`) to make StudioSpace a fullstack app. Each endpoint maps to existing UI surface (auth pages, wishlist hearts, register-host imgbb TODO, booking modal, dashboard).

### Auth — powers `/login`, `/register`, `/forgot-password`, login-to-book flow

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Create account (name, email, password, role: creator/host) |
| POST | `/api/auth/login` | Sign in, set session cookie |
| POST | `/api/auth/logout` | Clear session |
| GET | `/api/auth/me` | Current user (navbar/avatar, auth guards) |
| POST | `/api/auth/forgot-password` | Send password-reset email (fixes the one dead link) |
| POST | `/api/auth/reset-password` | Reset with token |

Use a session cookie (e.g. `iron-session` or custom signed cookie) rather than localStorage tokens — the login-gated behavior (booking, wishlist, dashboard) redirects back naturally with cookies + middleware.

### Studios

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/studios` | List with query params: `q`, `category`, `location`, `minPrice`, `maxPrice`, `amenities`, `sort` (search/sort/filter bar), `page`, `limit` |
| GET | `/api/studios/[slug]` | Detail page data (gallery, amenities, rating summary, host info) |
| POST | `/api/studios` | Create listing — matches the `/register-host` form fields |
| PATCH | `/api/studios/[id]` | Edit listing (owner only) |
| DELETE | `/api/studios/[id]` | Delete listing (owner only) |

### Wishlist — the heart button on studio cards

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/wishlist` | Current user's saved studios |
| POST | `/api/wishlist` | `{ studioId }` — toggle or add ("Log in to save" toast when signed out) |
| DELETE | `/api/wishlist/[studioId]` | Remove |

### Booking — the core transaction

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/studios/[id]/availability?date=YYYY-MM-DD` | Booked time slots for a day (booking modal date/time picker + conflict checks) |
| POST | `/api/bookings` | Create booking — server re-checks overlap, computes total from hourly price |
| GET | `/api/bookings` | My bookings; `?role=host` for incoming bookings on my listings |
| GET | `/api/bookings/[id]` | Single booking detail |
| PATCH | `/api/bookings/[id]` | Status transitions: creator cancels; host confirms/declines (dashboard status pills) |

Optional: add Stripe Checkout via `POST /api/bookings/[id]/pay`.

### Reviews — ratings shown on cards need a source

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/studios/[id]/reviews` | List reviews for a studio |
| POST | `/api/studios/[id]/reviews` | Create review — require a completed booking by that user |

### Host / Dashboard

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/host/listings` | My listings with booking counts |
| GET | `/api/host/stats` | Earnings summary, upcoming bookings (dashboard cards) |

### Supporting

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/uploads` | Server-side proxy to imgbb — keeps the imgbb API key off the client (register-host TODO) |
| POST | `/api/newsletter` | Footer "Join" form — store subscriber, skip if already exists |
| PATCH | `/api/users/me` | Update profile (name, avatar) |

### Implementation notes

- All endpoints are Next.js route handlers (`route.js` files) — no separate server.
- Build once: a `requireUser()` helper, request validation (zod), and a consistent error shape (`400/401/403/404` JSON).
- The mock data in `src/lib/studios.js` becomes the DB seed data.

**Suggested build order:** auth → studios CRUD → bookings → wishlist/reviews → uploads/newsletter. Auth goes first because login-gated behavior (booking, wishlist, dashboard) depends on it.

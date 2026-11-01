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

## API Endpoints

Contract for turning StudioSpace into a fullstack app. **All endpoints now live in the Express API at `studiospace_back_end`** (port `3001`, shared Mongo database + session cookie with the front end).

```bash
cd ../studiospace_back_end
npm run seed   # one-time: pushes src/lib/studios.js catalog into Mongo
npm run dev    # API on http://localhost:3001 (nodemon watch)
```

### Auth — ✅ LIVE via Better Auth (still served by Next.js route handlers)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/sign-up/email` | Register (name, email, password, `image` = photo URL) — already wired |
| POST | `/api/auth/sign-in/email` | Login, sets session cookie — already wired |
| POST | `/api/auth/sign-out` | Clear session — already wired |
| GET | `/api/auth/get-session` | Current user + session — already wired (navbar, avatar, auth guard) |
| POST | `/api/auth/sign-in/social` | Google OAuth (`/api/auth/callback/google` auto) — needs GOOGLE_CLIENT_ID/SECRET |
| POST | `/api/auth/forgot-password` | Reset email (needs an SMTP/mail provider configured in Better Auth) |

### Studios

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/studios` | List with `q`, `category`, `location`, `minPrice`, `maxPrice`, `amenities`, `sort`, `page`, `limit` (explore page) |
| GET | `/api/studios/[slug]` | Detail page data (gallery, amenities, reviews summary, host) |
| POST | `/api/studios` | Create listing (host only; `/register-host` form) |
| PATCH | `/api/studios/[id]` | Edit listing (owner only; dashboard "Update") |
| DELETE | `/api/studios/[id]` | Delete listing (owner only; dashboard delete dialog) |
| GET | `/api/studios/[id]/availability?date=YYYY-MM-DD` | Booked slots for a day (booking modal date/time conflict checks) |
| GET | `/api/studios/[id]/reviews` | Reviews for a studio |

### Wishlist — replaces the localStorage store in `src/lib/wishlist.js`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/wishlist` | Current user's saved studios (dashboard "Saved studios" stat) |
| POST | `/api/wishlist` | `{ studioId }` — toggle (heart buttons everywhere) |
| DELETE | `/api/wishlist/[studioId]` | Remove |

### Booking — the core transaction

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/bookings` | Create booking (studio modal → server re-checks overlap, computes total = hours × price + deposit) |
| GET | `/api/bookings` | Current user's bookings (`?role=host` for incoming) — powers `/dashboard/bookings` |
| PATCH | `/api/bookings/[id]` | Status transitions: creator cancels; host confirms/declines ("Cancel Booking") |
| GET | `/api/bookings/[id]/receipt` | Invoice/receipt download ("Invoice" button) |

### Reviews

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/studios/[id]/reviews` | Create review — require a completed booking by that user |

### Host / Dashboard

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/host/listings` | Host's own listings for `/dashboard/listings` |
| GET | `/api/host/stats` | Listings count + pending/confirmed bookings for `/dashboard` stat cards |

### Profile & Supporting

| Method | Endpoint | Purpose |
|--------|----------|---------|
| PATCH | `/api/users/me` | Update profile (name, avatar image) |
| POST | `/api/uploads` | Server-side proxy to imgbb (keeps API key off the client; register-host TODO) |
| POST | `/api/newsletter` | Footer "Join" form — store subscriber, skip duplicates |

### Implementation notes

- **Auth split**: Better Auth (Next.js route handlers) still owns sign-up/sign-in/sign-out/session — the Express API *reads the same cookie* (`better-auth.session_token`) and looks the token up in Better Auth's `session` collection, so one sign-in covers both servers.
- **Verified live** against Atlas: studios list/detail/availability, full booking lifecycle (pending → confirmed → completed, overlap `409`, min-hours `400`), reviews gated by completed bookings, wishlist toggle, host listings/stats, owner-only PATCH/DELETE (`403` otherwise), newsletter dedupe, uploads `503` until `IMGBB_API_KEY` is set.
- **Error shape** everywhere: `res.json({ error })` with `400/401/403/404/409/502/503`.
- **Front-end swap points** as endpoints get consumed: `src/lib/wishlist.js` (→ wishlist API), bookings mock `INITIAL_BOOKINGS` (→ bookings API), `removedSlugs` in `/dashboard/listings` (→ DELETE), client `.txt` receipt (→ receipt endpoint), notes to call `http://localhost:3001` with `credentials: "include"`.
- **Mongo collections**: API owns `studio`, `booking`, `review`, `wishlist`, `newsletterSubscriber`; Better Auth owns `user`/`session`/`account`. `src/lib/studios.js` doubles as the seed.
- **Re-seed any time** with `npm run seed` in `studiospace_back_end` (upserts by slug, safe to re-run).

**UI mock data lives in:** `src/lib/studios.js` (becomes the DB seed).

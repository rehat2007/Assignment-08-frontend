<div align="center">

# StudioSpace

**Book the room your next shoot deserves.**

A studio-rental marketplace for photographers, filmmakers, podcasters, and music producers — discover verified spaces, check real hourly availability, and book in a few clicks.

[Live app](https://studiospace-theta.vercel.app) · [Deployment guide](docs/DEPLOYMENT.md) · [API reference](docs/API.md)

[![Next.js](https://img.shields.io/badge/Next.js-16.4-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.7-7C3AED)](https://better-auth.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)

</div>

---

## Overview

StudioSpace connects creative professionals with hourly studio space. Hosts publish photo studios, film stages, podcast lounges, music rooms, and workshop spaces; customers search by category, compare hourly rates, and request bookings against live availability.

This repository contains the **Next.js frontend**. Authentication, studios, bookings, reviews, wishlists, uploads, and newsletter endpoints live in the companion Express API ([`../studiospace_back_end`](../studiospace_back_end)), which shares the same MongoDB database and Better Auth session cookie. Browser requests are proxied through Next.js so the session cookie works across domains.

## Technologies used

| Layer | Stack |
| --- | --- |
| **Framework** | Next.js 16.4 (App Router, Turbopack, React Compiler), Node >= 20.9 |
| **UI** | React 19, Tailwind CSS v4 (CSS-first theme), shadcn `base-nova` + Base UI primitives, Lucide icons, Sonner toasts |
| **Forms & motion** | React Hook Form, Embla Carousel |
| **Auth** | Better Auth 1.7 — email/password and Google OAuth, MongoDB adapter |
| **Data** | MongoDB 7 shared with the Express REST API |
| **Tooling** | ESLint 9, npm, Vercel |

## Key features

### 1. Studio discovery that actually narrows things down

Browse every space in one grid with debounced keyword search, category filters (photo, film, podcast, music, workshop), rating/price sorting, and pagination — all served from the API rather than a static catalog.

### 2. Live hourly availability and conflict-safe booking

Pick a date and 24-hour time range in the booking dialog. The app checks availability before submission, enforces the studio's minimum hours, surfaces `409` conflicts inline, and confirms successful requests with a toast. Customers can download a plain-text receipt for any booking.

### 3. Two-sided booking dashboards

One dashboard serves both sides of the marketplace. Customers track pending, confirmed, completed, and cancelled bookings; hosts switch to **Incoming requests** to confirm, decline, or complete bookings for their listings.

### 4. Full host listing management

Hosts create and edit studios with category, location, price, capacity, amenities, and description — including direct image upload with size validation — then manage or delete listings from a dedicated dashboard.

### 5. Accounts, wishlists, reviews, and more

Better Auth powers email/password sign-up and Google sign-in with protected routes and post-login redirects. Signed-in users can save studios to a wishlist, leave star ratings and reviews, and update their profile; guests can subscribe to the newsletter. The whole UI supports light/dark themes with top-center toast feedback on every important action.

## Quick start

### 1. Run the API first

The frontend renders without it, but studios and bookings need the Express API and seeded data:

```bash
cd ../studiospace_back_end
npm install
npm run seed:demo
npm run dev          # http://localhost:3001
```

### 2. Configure the frontend

```bash
npm install
```

Create `.env` in this directory:

```ini
# Shared database (must match the API's database)
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/studiospace
DB_NAME=studiospace

# Better Auth
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=<random 32-byte base64 string>

# Google OAuth (optional — email/password works without it)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Local API proxy, required for `npm run dev`
API_PROXY_TARGET=http://localhost:3001
```

Generate a secret with:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

> **Dev note:** with neither `API_PROXY_TARGET` nor an absolute `NEXT_PUBLIC_API_URL`, browser calls to `/api/proxy` return 404 in development. Rewrites are generated at build time, so restart the dev server after changing the target.

### 3. Start the app

```bash
npm run dev          # http://localhost:3000
```

### Demo accounts

Seeded by `npm run seed:demo` in the backend. Password for all: `Studio123`.

| Role | Email |
| --- | --- |
| Host | `host@studiospace.dev` |
| Customer | `customer@studiospace.dev` |
| Reviewer | `maya@studiospace.dev` |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server with Turbopack on port 3000 |
| `npm run build` | Production build (works without a database) |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint (Next 16 removed `next lint`; no separate typecheck/test script) |

## Project structure

```text
studiospace_front_end/
├─ public/images/            Hero and auth photography
├─ src/
│  ├─ app/
│  │  ├─ api/auth/[...all]/  Better Auth route handler
│  │  ├─ dashboard/          Overview, listings, bookings
│  │  ├─ login/ register/    Auth pages
│  │  ├─ register-host/      Create / edit a studio
│  │  └─ studios/            Browse and studio detail
│  ├─ components/            Navbar, hero, cards, dialogs, forms, UI primitives
│  └─ lib/                   API client, auth, formatting, wishlist, guards
├─ docs/                     Deployment guide and API reference
├─ next.config.mjs           Turbopack, proxy rewrite, React Compiler
└─ package.json
```

## Environment variables

| Variable | Scope | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Server | MongoDB connection string for Better Auth |
| `DB_NAME` | Server | Database name (defaults to `studiospace`) |
| `BETTER_AUTH_URL` | Server | Exact frontend origin, no trailing slash |
| `BETTER_AUTH_SECRET` | Server | Signing secret for sessions |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Server | Google OAuth credentials |
| `API_PROXY_TARGET` | Build + server | Origin of the Express API used by the `/api/proxy` rewrite and server components |
| `NEXT_PUBLIC_API_URL` | Build (browser) | Absolute API origin; overrides the proxy in the browser |
| `NEXT_PUBLIC_APP_URL` | Build (browser) | Canonical app origin used by the auth client |

`NEXT_PUBLIC_*` values are baked in at build time. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Google OAuth, Vercel, and MongoDB Atlas setup, and [docs/API.md](docs/API.md) for the endpoint contract.

## License

Built as a learning project. Photography in `public/images/` comes from [Unsplash](https://unsplash.com) under the Unsplash License.

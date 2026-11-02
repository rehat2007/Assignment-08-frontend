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

---

## 1. Enable Google social login — step by step

The UI is already wired: `/login` renders **Continue with Google**
(`src/components/auth/login-card.jsx`) and calls
`authClient.signIn.social({ provider: "google" })`. The server already registers
the provider in `src/lib/auth.js`. You only need Google credentials, the right
URLs, and a production-safe auth-client URL.

### 1.1 Create the Google OAuth client

1. Open <https://console.cloud.google.com> and create (or select) a project.
2. Go to **APIs & Services → OAuth consent screen** (on newer consoles this is
   under **Google Auth Platform**).
   - User type: **External** (choose **Internal** only for a Google Workspace org).
   - Fill in **App name**, **User support email** and **Developer contact email**.
   - Add scopes `openid`, `.../auth/userinfo.email`, `.../auth/userinfo.profile`.
   - While the app is in **Testing**, add every Google account you will test with
     under **Test users**, otherwise Google returns “Access blocked”.
   - **Publish** the app when it should be available to the public.
3. Go to **APIs & Services → Credentials → Create credentials → OAuth client ID**.
4. Application type: **Web application**. Give it a name (e.g. StudioSpace web).
5. Under **Authorized JavaScript origins**, add exactly:
   - `http://localhost:3000`
   - `https://YOUR_FRONTEND_DOMAIN` (for example `https://app.example.com`) — no trailing slash
6. Under **Authorized redirect URIs**, add exactly:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://YOUR_FRONTEND_DOMAIN/api/auth/callback/google`

   The `/api/auth/callback/google` path is Better Auth's callback route; it must
   match character for character (scheme, host, no trailing slash).
7. Click **Create**, then copy the **Client ID** and **Client secret**.

### 1.2 Add the variables to `studiospace_front_end/.env`

```ini
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=<random 32-byte base64 string>
GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxx
```

Generate the secret with:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

- `BETTER_AUTH_URL` must be the exact front-end origin: no trailing slash, no path.
- `.env` is gitignored. Add the same keys to Vercel later (Section 2).
- Restart `npm run dev` — environment variables are read when the server starts.

### 1.3 Remove the hard-coded localhost URL from the auth client

`src/lib/auth-client.js` currently hard-codes `http://localhost:3000`, which
breaks sign-in on the deployed site. Replace its contents with:

```js
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
});
```

Then add one more line to `.env`:

```ini
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

In production this becomes `NEXT_PUBLIC_APP_URL=https://YOUR_FRONTEND_DOMAIN`.
`NEXT_PUBLIC_*` values are bundled at build time, so **redeploy after changing
them**. (Alternatively, delete the `baseURL` option entirely — the client then
infers the current browser origin.)

### 1.4 Test the flow

1. Start the front end with `npm run dev` (the Express API is not needed just
   for signing in).
2. Open `http://localhost:3000/login` and click **Continue with Google**.
3. Choose an account → you should return to `/` with a
   `better-auth.session_token` cookie and your Google name/avatar in the navbar.
4. Check `/dashboard` and a protected API call while signed in; then sign out
   and confirm `/dashboard` redirects to `/login`.
5. If an email/password account already exists with the same **verified** Google
   email, Better Auth links the Google account to it. Otherwise a new user is
   created in the `user` collection. Demo accounts from `npm run seed:demo` have
   `emailVerified: true`, but their emails use `@studiospace.dev`, so they are
   separate from a real Google account.

Optional: the Google button sends users to `/` after login. To honor a guest
redirect intent, pass the saved URL:

```js
callbackURL: takeNextUrl() ?? "/",
```

### 1.5 Google login troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `redirect_uri_mismatch` | Redirect URI differs (http/https, port, trailing slash, `www`) | Copy the exact URL from the browser console into Google → Authorized redirect URIs |
| `Access blocked: app has not completed verification` | App is in Testing and the account is not a test user | Add the account under **Test users**, or publish the app |
| `invalid_client` | Wrong/expired client secret | Re-copy both values into `.env` and restart |
| Button does nothing / asks for localhost | `src/lib/auth-client.js` still hard-codes localhost | Apply step 1.3 and redeploy |
| Sign-in succeeds, then API returns `401` | Google sets the cookie on the front-end origin; the API must receive it | Keep the apps on one parent domain (Section 2.5) or proxy the API (Section 2.6) |
| Works locally, fails on Vercel | `BETTER_AUTH_URL`, Google URIs, or `NEXT_PUBLIC_APP_URL` still point at localhost | Update all three to the production domain and redeploy |

---

## 2. Deploy on Vercel — step by step

This repository contains **two apps** plus a managed database:

| Part | Folder | Where it goes |
|---|---|---|
| Next.js app (pages + Better Auth) | `studiospace_front_end/` | Vercel |
| Express API | `studiospace_back_end/` | Vercel (optional) or Railway/Render (recommended) |
| MongoDB Atlas | external | Stays on Atlas |

The frontend and API share one session cookie. Cookies are scoped to a domain,
not a port, so read **2.0** before choosing domains.

### 2.0 Choose the domains first (cookie decision)

- **Recommended:** custom domains under one parent:
  `https://app.example.com` (frontend) and `https://api.example.com` (API).
  Both are same-site subdomains; add a domain-scoped cookie (step 2.5).
- **Avoid** `front.vercel.app` + `back.vercel.app`: `vercel.app` is on the
  Public Suffix List, so browsers will not share cookies between those
  subdomains. If you must stay on `*.vercel.app`, use the proxy in step 2.6.
- The API must be HTTPS in production. Better Auth then issues the
  `__Secure-better-auth.session_token` cookie; the Express `src/auth.js` already
  matches both the plain and `__Secure-` variants.

### 2.1 Put both apps in GitHub

Vercel deploys from Git. The workspace root is not a git repository and only
`studiospace_front_end/` has one, so the least destructive setup is:

1. Push the existing frontend repository to GitHub (root = `studiospace_front_end`).
2. Create a second repository for `studiospace_back_end` and push it separately.

That gives two Vercel projects with no monorepo root-directory configuration.
If you prefer one monorepo, create a new repository at the workspace root,
remove the nested `studiospace_front_end/.git` folder first, then commit both
apps — and set **Root Directory** per Vercel project.

Never commit `.env` files; both apps already ignore them.

### 2.2 Prepare MongoDB Atlas

1. **Database Access** → create (or reuse) a user with read/write access to the
   `studiospace` database.
2. **Network Access** → allow `0.0.0.0/0`. Vercel and most PaaS providers use
   dynamic egress IPs, so IP allow-listing is not practical. Protect the DB with
   a strong password instead.
3. Copy the **non-SRV** `mongodb://` connection string (the `mongodb+srv://`
   form fails from this project's environment).
4. Confirm the database name: the Next.js app uses the name in the URI path
   (`client.db()`), while Express uses `DB_NAME` or falls back to `studiospace`.
   Set `DB_NAME=studiospace` on the API to keep both on the same database.

### 2.3 Deploy the Express API first

#### Option A — Railway / Render (recommended)

A normal long-running Node process fits this API best (one Mongo client,
non-serverless uploads up to 40 MB, no cold starts).

1. Create a **New Web Service** and connect the backend repository.
2. Settings:
   - Root Directory: repository root (contains `package.json`)
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Node version: 20 or newer
3. Environment variables:

   | Key | Value |
   |---|---|
   | `MONGODB_URI` | Atlas `mongodb://` URI |
   | `CORS_ORIGIN` | `https://app.example.com` (exact front-end origin, comma-separated for more) |
   | `DB_NAME` | `studiospace` (optional but explicit) |
   | `IMGBB_API_KEY` | optional — enables `/api/uploads` |

   Do **not** set `PORT`; the platform injects it and `index.js` already reads
   `process.env.PORT`.
4. Deploy, then add the custom domain `api.example.com`.
5. Verify:
   - `https://api.example.com/api/health` → `{"ok":true,...}`
   - `https://api.example.com/api/wishlist` → `401`

#### Option B — Vercel serverless function (optional)

Use this only if both apps must live on Vercel. It requires a small refactor so
the Express app can be imported by a serverless entry point instead of calling
`listen()` itself.

1. Move the app setup into a new `studiospace_back_end/src/app.js`:
   - Everything currently in `index.js` **except** `app.listen(...)` and the
     `SIGINT`/`SIGTERM` handlers.
   - Keep `await connect()` and `export default app;`.
2. Reduce `studiospace_back_end/index.js` to the local server entry:

   ```js
   import app from "./src/app.js";

   const PORT = Number(process.env.PORT) || 3001;
   const server = app.listen(PORT, () => {
     console.log(`StudioSpace API listening on http://localhost:${PORT}`);
   });

   for (const signal of ["SIGINT", "SIGTERM"]) {
     process.on(signal, () => server.close(() => process.exit(0)));
   }
   ```

3. Add `studiospace_back_end/api/index.js`:

   ```js
   import app from "../src/app.js";

   export default app;
   ```

4. Add `studiospace_back_end/vercel.json`:

   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/api" }]
   }
   ```

5. Import the backend repository as a **second Vercel project**, root at the
   repository root, Framework Preset **Other**. Add the same environment
   variables as Option A (no `PORT`). Deploy, then add `api.example.com`.
6. Verify the two health checks from Option A.

Caveats:

- Vercel's request body limit is **4.5 MB**, below the API's 40 MB JSON limit, so
  large image uploads through `/api/uploads` will fail. Host the API on
  Railway/Render if uploads matter.
- Serverless instances cold-start and each opens a Mongo connection; the module
  cache in `src/db.js` reuses it while the instance stays warm, but keep the
  function region close to the Atlas region.
- Re-run the deploy after changing `vercel.json` or environment variables.

### 2.4 Deploy the Next.js frontend on Vercel

1. Vercel dashboard → **Add New → Project** → import the frontend repository.
2. Framework preset: **Next.js** (auto-detected). Build command `npm run build`,
   install command `npm install`, Node 20 or newer.
3. Add these **Production** environment variables (and Preview only if you use
   preview deployments with Google login):

   | Key | Value |
   |---|---|
   | `MONGODB_URI` | Atlas `mongodb://` URI (same DB as the API) |
   | `BETTER_AUTH_SECRET` | random 32-byte base64 string |
   | `BETTER_AUTH_URL` | `https://app.example.com` |
   | `NEXT_PUBLIC_APP_URL` | `https://app.example.com` |
   | `NEXT_PUBLIC_API_URL` | `https://api.example.com` |
   | `GOOGLE_CLIENT_ID` | from Google Cloud Console |
   | `GOOGLE_CLIENT_SECRET` | from Google Cloud Console |
   | `COOKIE_DOMAIN` | `.example.com` — only when using step 2.5 |

   `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` must be identical.
4. Deploy. The generated `*.vercel.app` URL is useful for the first smoke test.
5. **Settings → Domains** → add `app.example.com` and create the DNS record
   Vercel shows. Wait for the certificate to become active.
6. Re-check the environment variables now that the final domain is known, then
   **Redeploy** (NEXT_PUBLIC values are baked into the build).

### 2.5 Share the session cookie across subdomains

If the frontend is `app.example.com` and the API is `api.example.com`, the
cookie is host-only unless you scope it to the parent domain. Update
`src/lib/auth.js`:

```js
export const auth = betterAuth({
  // ...existing options
  trustedOrigins: [process.env.BETTER_AUTH_URL],
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: process.env.COOKIE_DOMAIN ?? ".example.com",
    },
  },
});
```

Set `COOKIE_DOMAIN=.example.com` on Vercel and redeploy. Notes:

- Use the registrable parent domain with a leading dot (`.example.com`), not
  `app.example.com`.
- Keep both apps on HTTPS; production cookies are `Secure`.
- The Express session reader (`src/auth.js`) searches cookie names containing
  `session_token`, so it accepts the scoped and `__Secure-` variants unchanged.
- Without this step, login succeeds but every API call returns `401`.

### 2.6 Alternative: proxy the API through Next.js (one origin)

Use this when custom domains are not possible (for example, two
`*.vercel.app` projects).

1. Add a rewrite to `next.config.mjs`:

   ```js
   async rewrites() {
     return [
       {
         source: "/api/proxy/:path*",
         destination: `${process.env.API_PROXY_TARGET}/api/:path*`,
       },
     ];
   }
   ```

2. On Vercel add `API_PROXY_TARGET=https://your-api.vercel.app` (server-only)
   and set `NEXT_PUBLIC_API_URL=https://your-frontend.vercel.app/api/proxy`.
3. Redeploy. The browser now calls the frontend origin, so the auth cookie is
   always sent and CORS is not involved. Keep `CORS_ORIGIN` on the API anyway.
4. Server components also call `apiFetch`; they will fetch the public proxy URL.
   That works, but adds one network hop — acceptable for a demo.

### 2.7 Seed the deployed database

Seed once against the production Atlas database. From `studiospace_back_end`,
with the production `MONGODB_URI` in `.env` (or via your host's shell):

```bash
npm run seed       # catalog + sample reviews only
npm run seed:demo  # catalog + demo accounts/bookings/reviews/wishlist
```

`seed:demo` creates accounts with a known password (`Studio123`). For a public
site, use `npm run seed` and create real accounts, or change/remove the demo
users afterwards.

### 2.8 Post-deploy verification checklist

| Check | Expected |
|---|---|
| `GET https://api.example.com/api/health` | `{"ok":true,...}` |
| `GET https://api.example.com/api/wishlist` while signed out | `401` |
| `https://app.example.com/` | 8 studios load (from the API) |
| Sign in as `host@studiospace.dev` / `Studio123` | Navbar shows Nadia Karim |
| `/dashboard` | 4 listings, 7 bookings |
| Booking flow | Availability loads, create → `201`, overlap → `409`, receipt downloads |
| Wishlist heart / newsletter / profile edit | Persist after reload |
| Google **Continue with Google** | Returns to `/` signed in |
| DevTools → Application → Cookies | `better-auth.session_token` (or `__Secure-…`), `Secure`, domain `.example.com` when using 2.5 |

### 2.9 Vercel / deployment troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| CORS error in the browser | `CORS_ORIGIN` does not exactly match the front-end origin | Set the scheme + host + port exactly, redeploy the API |
| API works in a tab, all calls `401` in the app | Cookie is not sent cross-origin | Use step 2.5 (parent-domain cookie) or 2.6 (proxy) |
| `BETTER_AUTH_URL` mismatch / unexpected redirect | Env var still points at localhost or the `.vercel.app` URL | Set it to the final frontend origin and redeploy |
| Session disappears after redeploy | `BETTER_AUTH_SECRET` changed between deployments | Keep one stable secret in Vercel |
| Google `redirect_uri_mismatch` | Production URI missing in Google Console | Add `https://app.example.com/api/auth/callback/google` |
| Google login fails only on preview URLs | Preview domains change every deploy | Use the production domain for Google login (Google has no wildcard redirect URIs) |
| Mongo connection timeout on Vercel | Atlas Network Access blocks the provider | Allow `0.0.0.0/0` or the provider's egress range |
| Build fails on Vercel | Missing env var or Node version too old | Add all env vars, set Node 20+, check the build log |
| Uploads return `503` | `IMGBB_API_KEY` is empty | Add the key on the API host and restart/redeploy |
| API cold-start latency (Option B) | Serverless function spins down | Use Option A, or set the function region near Atlas |

---

## API Endpoints

Contract for turning StudioSpace into a fullstack app. **All endpoints now live in the Express API at `studiospace_back_end`** (port `3001`, shared Mongo database + session cookie with the front end).

```bash
cd ../studiospace_back_end
npm run seed:demo  # catalog + demo accounts, listings, bookings, reviews, wishlist
npm run dev        # API on http://localhost:3001 (nodemon watch)
```

Demo logins (password `Studio123`): `host@studiospace.dev`,
`customer@studiospace.dev`, `maya@studiospace.dev`. The login page lists them.
Use plain `npm run seed` if you only want the catalog.

### Auth — ✅ LIVE via Better Auth (still served by Next.js route handlers)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/sign-up/email` | Register (name, email, password, `image` = photo URL) — already wired |
| POST | `/api/auth/sign-in/email` | Login, sets session cookie — already wired |
| POST | `/api/auth/sign-out` | Clear session — already wired |
| GET | `/api/auth/get-session` | Current user + session — already wired (navbar, avatar, auth guard) |
| POST | `/api/auth/sign-in/social` | Google OAuth (callback `/api/auth/callback/google`) — setup in Section 1 |
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

### Wishlist — API-backed store in `src/lib/wishlist.js`

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
| POST | `/api/uploads` | Server-side proxy to imgbb (keeps API key off the client; used by the register-host image picker) |
| POST | `/api/newsletter` | Footer "Join" form — store subscriber, skip duplicates |

### Implementation notes

- **Auth split**: Better Auth (Next.js route handlers) still owns sign-up/sign-in/sign-out/session — the Express API *reads the same cookie* (`better-auth.session_token`) and looks the token up in Better Auth's `session` collection, so one sign-in covers both servers.
- **Verified live** against Atlas: studios list/detail/availability, full booking lifecycle (pending → confirmed → completed, overlap `409`, min-hours `400`), reviews gated by completed bookings, wishlist toggle, host listings/stats, owner-only PATCH/DELETE (`403` otherwise), newsletter dedupe, uploads `503` until `IMGBB_API_KEY` is set.
- **Error shape** everywhere: `res.json({ error })` with `400/401/403/404/409/502/503`.
- **Front-end wiring** (all mocks are now API-backed): `src/lib/api.js` (`apiFetch` + `API_BASE`), `src/lib/wishlist.js`, `src/lib/format.js`, `src/components/{studios-browser,studio-card,studio-detail,booking-dialog,review-form,featured-studios,newsletter-form,user-menu}.jsx`, and the `/studios`, `/studios/[id]`, `/dashboard/*`, `/register-host` pages. Server components fetch through `apiFetch`; client components always send `credentials: "include"` so the Better Auth cookie reaches `:3001`.
- **Auth-gated UI**: hearts and "Book now" send guests to `/login` with `setNextUrl`, `/dashboard/*` and `/register-host` use `useAuthGuard`, and profile edits refetch the Better Auth session after `PATCH /api/users/me`.
- **Mongo collections**: API owns `studio`, `booking`, `review`, `wishlist`, `newsletterSubscriber`; Better Auth owns `user`/`session`/`account`. `src/lib/studios.js` doubles as the seed.
- **Re-seed any time** with `npm run seed` in `studiospace_back_end` (upserts by slug, safe to re-run), or `npm run seed:demo` for the full demo dataset.

**Catalog fallback:** `src/lib/studios.js` stays as the seed source and for `categoryLabel()` / `STUDIO_CATEGORIES`; pages read studios from the API, not this file.

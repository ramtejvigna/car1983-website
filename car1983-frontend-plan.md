# car1983 — Frontend Monorepo Plan
**Version:** 1.0  
**Stack:** Next.js 16.2.1 · Turborepo · pnpm · shadcn/ui · AWS Amplify  
**Apps:** public, rider, driver, admin  
**Last Updated:** May 2026

---

## Table of Contents

1. [Repository Structure](#1-repository-structure)
2. [Package Boundaries](#2-package-boundaries)
3. [Next.js 16 Breaking Changes to Know](#3-nextjs-16-breaking-changes-to-know)
4. [Amplify Configuration](#4-amplify-configuration)
5. [Auth Strategy](#5-auth-strategy)
6. [State Management](#6-state-management)
7. [Data Fetching Rules](#7-data-fetching-rules)
8. [shadcn/ui in Monorepo](#8-shadcnui-in-monorepo)
9. [OpenAPI → TypeScript Client](#9-openapi--typescript-client)
10. [Subdomain & Cloudflare Config](#10-subdomain--cloudflare-config)
11. [CI/CD Pipeline](#11-cicd-pipeline)
12. [Implementation Phases](#12-implementation-phases)
13. [Open Decisions](#13-open-decisions)

---

## 1. Repository Structure

```
car1983-web/                              ← single Git repo
├── apps/
│   ├── public/                           → car1983.com
│   ├── rider/                            → app.car1983.com
│   ├── driver/                           → driver.car1983.com
│   └── admin/                            → admin.car1983.com
│
├── packages/
│   ├── ui/                               → @car1983/ui
│   ├── api-client/                       → @car1983/api-client
│   ├── auth-rider/                       → @car1983/auth-rider
│   ├── auth-driver/                      → @car1983/auth-driver
│   ├── types/                            → @car1983/types
│   ├── utils/                            → @car1983/utils
│   └── config/                           → @car1983/config
│
├── .npmrc                                ← CRITICAL for Amplify (see section 4)
├── turbo.json
├── pnpm-workspace.yaml
└── package.json

```

**Why auth is split into two packages:**  
Riders use phone OTP — a short stateless flow. Drivers go through multi-step onboarding (documents, vehicle info, background check status) with persistent step state, different endpoints, and different JWT claims. Sharing one auth package means either the rider package pulls in driver onboarding code it doesn't need, or you fight the abstraction every time flows diverge. Two packages, zero coupling, clean boundaries. They can share token storage primitives from `@car1983/utils` without sharing business logic.

---

## 2. Package Boundaries

### `@car1983/ui`
shadcn/ui base components only. Button, Input, Modal, Card, Badge, Table, Toast, Skeleton, Avatar, Tabs, Dropdown.

**Hard rule:** This package never imports from `@car1983/api-client`, `@car1983/auth-rider`, or `@car1983/auth-driver`. Zero business logic. Zero API calls. Purely visual primitives. If a component needs data, it receives it as props.

### `@car1983/api-client`
Auto-generated from your NestJS OpenAPI spec using `orval`. Never hand-edited. Contains:
- Typed fetch functions per endpoint
- Axios instance with interceptors (auth header injection, 401 handling)
- All request/response types as TypeScript interfaces
- TanStack Query hooks auto-generated per endpoint

When your backend API changes: regenerate, commit, fix type errors in CI. This is your contract enforcement mechanism.

### `@car1983/auth-rider`
- Phone OTP request + verify flow
- JWT storage (httpOnly cookie via Next.js Server Action — never localStorage)
- Token refresh logic
- `useRiderSession()` hook — returns current rider, loading state, sign-out
- `RiderAuthGuard` server component — redirects unauthenticated requests

### `@car1983/auth-driver`
- Phone OTP request + verify (same mechanism as rider at the transport layer)
- Multi-step onboarding state — which steps are complete, which are pending
- Driver approval status polling
- `useDriverSession()` hook — returns driver, onboarding status, loading state, sign-out
- `DriverAuthGuard` server component
- Onboarding step progress utilities (not UI — just logic and state)

### `@car1983/types`
Pure TypeScript interfaces mirroring your backend contracts. No functions, no classes, no imports from other packages. Examples:

```typescript
export interface Trip { ... }
export interface Driver { ... }
export interface Rider { ... }
export interface FareEstimate { ... }
export interface PaymentIntent { ... }
export type TripStatus = 'REQUESTED' | 'MATCHED' | 'STARTED' | 'COMPLETED' | 'CANCELLED'
export type DriverStatus = 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED'
```

### `@car1983/utils`
Stateless pure functions. No side effects. Examples:
- `formatCents(1099)` → `'$10.99'`
- `formatDistance(1234)` → `'1.2 mi'`
- `formatDuration(360)` → `'6 min'`
- `formatPhone('+14155552671')` → `'(415) 555-2671'`
- `formatRelativeTime(date)` → `'2 min ago'`
- `maskEmail('john@example.com')` → `'jo**@example.com'`
- Token storage primitives (set/get/clear cookie helpers)

### `@car1983/config`
Shared tooling configuration extended by every app:
- `tsconfig.base.json` — base TypeScript config
- `eslint.config.base.js` — shared ESLint rules
- `tailwind.config.base.ts` — design tokens (colors, spacing, fonts, border radius)
- `prettier.config.js` — shared formatting

---

## 3. Next.js 16 Breaking Changes to Know

These will burn you if you don't know them before starting.

### `middleware.ts` → `proxy.ts`
Next.js 16 renames `middleware.ts` to `proxy.ts`. The edge runtime is NOT supported in `proxy.ts` — only Node.js runtime. If you need edge runtime (geolocation, A/B testing), keep using `middleware.ts` (still works, just deprecated). For your admin IP restriction, use `proxy.ts` on Node.js runtime.

```typescript
// apps/admin/proxy.ts  (NOT middleware.ts)
export function proxy(request: NextRequest) {
  const allowedIPs = process.env.ADMIN_ALLOWED_IPS?.split(',') ?? []
  const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0]
  if (!allowedIPs.includes(clientIP ?? '')) {
    return new Response('Forbidden', { status: 403 })
  }
}
```

### Async params and searchParams
Page props are now async in Next.js 16. Every page component must await params:

```typescript
// Next.js 16 — required
export default async function TripPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params
}
```

### Caching is now opt-in
Next.js 16 removes implicit caching on `fetch`. Everything is dynamic by default. To cache, use the `"use cache"` directive explicitly:

```typescript
"use cache"
export async function getPricingZones() {
  // this result is cached
}
```

This is a significant mindset shift from Next.js 15. Plan your caching strategy before building, not after.

### React Compiler is stable
Next.js 16 ships with React Compiler stable (not enabled by default). Enable it in `next.config.ts`:

```typescript
const nextConfig = {
  reactCompiler: true,  // automatic memoization — remove your manual useMemo/useCallback
}
```

Enable this from day one. It eliminates an entire category of performance bugs.

### `next lint` removed
The `next lint` command is removed. Use ESLint directly: `eslint .` or via Turborepo task.

### Node.js minimum: 20.9.0
Amplify build container must use Node.js 20.9.0+. Set this explicitly in your Amplify build settings — the default container may use an older version.

---

## 4. Amplify Configuration

### The `.npmrc` File — Non-Negotiable

Create this at the repo root before anything else. Without it, pnpm + Turborepo on Amplify produces cryptic module resolution errors:

```ini
# .npmrc — repo root
node-linker=hoisted
strict-peer-dependencies=false
auto-install-peers=true
shamefully-hoist=true
```

`node-linker=hoisted` is what makes Amplify's build environment able to resolve packages correctly. pnpm's default isolated linker doesn't work with Amplify's build container.

### Amplify Setup: 4 Projects, 1 Repo

Create 4 separate Amplify apps in the console, all connected to the same GitHub repo. Each app sets `AMPLIFY_MONOREPO_APP_ROOT` to its subdirectory.

| Amplify App | `AMPLIFY_MONOREPO_APP_ROOT` | Domain |
|---|---|---|
| car1983-public | `apps/public` | `car1983.com` |
| car1983-rider | `apps/rider` | `app.car1983.com` |
| car1983-driver | `apps/driver` | `driver.car1983.com` |
| car1983-admin | `apps/admin` | `admin.car1983.com` |

### `amplify.yml` — One Per App

Each app in `apps/{app}/amplify.yml`. The root `amplify.yml` is not used.

```yaml
# apps/rider/amplify.yml
version: 1
applications:
  - appRoot: apps/rider
    frontend:
      phases:
        preBuild:
          commands:
            - nvm use 22
            - npm install -g pnpm@latest
            - cd ../..
            - pnpm install --frozen-lockfile
        build:
          commands:
            - cd ../..
            - npx turbo run build --filter=rider
      artifacts:
        baseDirectory: apps/rider/.next
        files:
          - '**/*'
      cache:
        paths:
          - .next/cache/**/*
          - node_modules/**/*
          - apps/rider/node_modules/**/*
          - packages/*/node_modules/**/*
```

**Key points in this config:**
- Install pnpm in preBuild — it's not in Amplify's default container
- Run `pnpm install` from repo root (not from app directory) — needed for workspace resolution
- Run `turbo build --filter={app}` — Turborepo builds only the target app and its dependencies
- Cache `node_modules` aggressively — pnpm install from scratch on every build is slow
- `baseDirectory: apps/rider/.next` — tells Amplify where the Next.js output is

### Environment Variables Per App in Amplify

Set these in Amplify Console → App Settings → Environment variables:

```
# All apps
NEXT_PUBLIC_API_URL=https://api.car1983.com/v1
NODE_ENV=production

# Rider app
NEXT_PUBLIC_GOOGLE_MAPS_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...

# Admin app
ADMIN_ALLOWED_IPS=x.x.x.x,y.y.y.y    (server-side only, no NEXT_PUBLIC_ prefix)
ADMIN_JWT_SECRET=...

# Driver app
NEXT_PUBLIC_GOOGLE_MAPS_KEY=...
```

**`NEXT_PUBLIC_` prefix:** Anything with this prefix is bundled into the client JS and visible to everyone. Never put secrets here. API URLs, map keys (restricted), Stripe publishable key — fine. JWT secrets, admin IPs, internal service URLs — never.

### Affected-Only Builds

By default, every push triggers all 4 Amplify apps to rebuild. Add a change detection script to skip unnecessary builds:

```bash
# In preBuild, before installing — check if this app's files changed
CHANGED=$(git diff --name-only HEAD~1 HEAD)
if echo "$CHANGED" | grep -qE '^(apps/rider|packages/)'; then
  echo "Changes detected for rider — building"
else
  echo "No relevant changes — exiting"
  exit 0
fi
```

This prevents `apps/public` from rebuilding when you only changed `apps/admin`.

---

## 5. Auth Strategy

### Why Separate Packages (Detailed)

| | Rider | Driver |
|---|---|---|
| Flow | Phone OTP → verified → active | Phone OTP → onboarding steps → pending → approved → active |
| JWT claims | `userId`, `userType: RIDER`, `rideCount` | `userId`, `userType: DRIVER`, `onboardingStep`, `approvalStatus` |
| Auth states | authenticated / unauthenticated | unauthenticated / onboarding / pending-approval / active / rejected |
| Guards | Redirect to `/login` if no session | Redirect based on onboarding step — different page per step |
| Storage | httpOnly cookie | httpOnly cookie |
| Token refresh | Silent background refresh | Silent background refresh |

### Token Storage — httpOnly Cookie via Server Actions

Never store JWTs in localStorage. XSS attacks read localStorage trivially. httpOnly cookies are inaccessible to JavaScript — only the browser sends them automatically.

The flow:
```
User submits OTP
    │
    ▼
Server Action (runs on server, not client)
    │  calls auth-service API
    ▼
Receives JWT from backend
    │
    ▼
Sets httpOnly cookie via response headers
    │  (JavaScript cannot read this cookie)
    ▼
Client sees authenticated state via session query
```

### Rider Auth Flow (Simple)

```
/login → enter phone → OTP sent → enter OTP → verify → 
  success → set httpOnly cookie → redirect to /
  failure → show error → retry
```

States: `unauthenticated` | `authenticated`

### Driver Auth Flow (Multi-Step Onboarding)

```
/login → enter phone → OTP → verify →
  NEW driver → redirect to /onboarding/step-1
  EXISTING driver (approved) → redirect to /dashboard
  EXISTING driver (pending) → redirect to /onboarding/pending
  EXISTING driver (rejected) → redirect to /onboarding/rejected
```

Onboarding steps (persisted in your DB, not client state):
```
Step 1: Personal info
Step 2: Driver's license upload
Step 3: Vehicle info
Step 4: Vehicle insurance upload
Step 5: Vehicle registration upload
Step 6: Profile photo
Step 7: Background check consent
Step 8: Stripe Express onboarding (prefilled)
Step 9: Review & submit
→ Status: PENDING (ops reviews)
→ Status: APPROVED or REJECTED (notification sent)
```

`DriverAuthGuard` reads the driver's `onboardingStep` from the JWT claims and redirects to the correct step page. A driver who completed step 3 but navigated to `/dashboard` gets redirected to `/onboarding/step-4` automatically.

### Session Query Pattern

Both auth packages expose a `getSession()` server function and a client-side `useSession()` hook backed by TanStack Query. This is the single source of truth for auth state across the app:

```typescript
// Server Component — use directly
const session = await getRiderSession()
if (!session) redirect('/login')

// Client Component — use hook
const { data: session, isLoading } = useRiderSession()
```

---

## 6. State Management

### Decision: Each App Owns Its Own Stores

No shared Zustand stores across apps. The reasoning: rider, driver, and admin have fundamentally different state shapes. A shared store would either be a dumping ground or so generic it's useless. Each app defines its own stores for what it needs.

`@car1983/utils` provides Zustand store factory helpers and middleware — not stores themselves.

### Zustand Usage Per App

**rider app stores:**
- `useTripStore` — current trip state (requested, matched, in-progress), driver info, ETA
- `useMapStore` — map viewport, selected pickup/dropoff pins, map loaded state
- `useBookingStore` — fare estimate, selected vehicle type, promo code applied

**driver app stores:**
- `useTripStore` — incoming trip requests, current active trip, earnings today
- `useOnlineStore` — driver online/offline toggle, current location broadcasting state

**admin app stores:**
- `useFiltersStore` — table filters, pagination state, date range (shared across admin pages)
- Nothing else — admin is mostly server-rendered tables, minimal client state needed

**public site:** No Zustand. Purely server-rendered. No client state needed.

### When to Use TanStack Query vs Zustand

This distinction must be explicit or developers will put everything in Zustand:

| Use TanStack Query | Use Zustand |
|---|---|
| Server data (trips, profile, earnings) | UI state (modal open, selected tab) |
| Data that can go stale | State that doesn't come from the server |
| Anything that needs a loading/error state | Ephemeral interaction state |
| Data shared between multiple components | Local component coordination |

In practice: most data in your apps is server data — use TanStack Query. Zustand is for the map viewport, the booking flow step, the driver online toggle. Keep Zustand stores small and UI-focused.

---

## 7. Data Fetching Rules

Clear rules prevent a codebase where some features use Server Components, some use TanStack Query, and some use both for the same data.

| Scenario | Tool | Why |
|---|---|---|
| Public/SEO pages (landing, about) | Server Components + `fetch` with `"use cache"` | No JS bundle cost, fully cacheable |
| Authenticated data (trip history, profile) | TanStack Query | Client-side cache, background refetch, optimistic updates |
| Real-time trip status | WebSocket + `queryClient.setQueryData()` | Push updates into TanStack Query cache directly |
| Forms and mutations (book trip, update profile, cancel trip) | Server Actions | Type-safe, no API route needed, works without JS |
| Admin tables (paginated, filtered) | TanStack Query with server-side pagination params | Consistent loading states, easy filter integration |
| One-time server data (pricing zones, vehicle types) | Server Component → pass as props | Static-ish data, no need for client fetching |

### The WebSocket + TanStack Query Pattern (Important)

For your rider app, trip status updates arrive via WebSocket. Don't maintain a separate WebSocket state alongside TanStack Query — push WebSocket updates directly into the query cache:

```typescript
// When WebSocket receives trip update
socket.on('trip:updated', (trip) => {
  queryClient.setQueryData(['trip', trip.id], trip)
  // All components subscribed to this query update automatically
})
```

This means your UI components only need `useQuery(['trip', tripId])` — they don't care if the data came from an HTTP fetch or a WebSocket push. One source of truth.

---

## 8. shadcn/ui in Monorepo

### Components Live in `packages/ui` Only

shadcn components are installed into `packages/ui`, not into individual apps. The shadcn CLI installs to the app directory by default — override this with `components.json` in `packages/ui`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@car1983/ui/components",
    "utils": "@car1983/ui/lib/utils"
  }
}
```

### Tailwind Content Paths — Critical

Every app's `tailwind.config.ts` must scan `packages/ui` source files. Without this, Tailwind purges the classes used by shared components and they render unstyled — a silent bug that only shows in production builds:

```typescript
// apps/rider/tailwind.config.ts
import baseConfig from '@car1983/config/tailwind'

export default {
  ...baseConfig,
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',  // ← critical
    '../../packages/auth-rider/src/**/*.{ts,tsx}',
  ],
}
```

### Design Token Approach

All colors, spacing, and typography decisions live in `@car1983/config/tailwind.ts` as CSS variables. Each app extends this base config. This means a brand color change is one file edit, not four.

```typescript
// packages/config/tailwind.ts
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'hsl(var(--brand-primary))',
          secondary: 'hsl(var(--brand-secondary))',
        },
        rider: {
          accent: 'hsl(var(--rider-accent))',  // rider-specific accent
        },
        driver: {
          accent: 'hsl(var(--driver-accent))',  // driver-specific accent
        }
      }
    }
  }
}
```

Rider and driver apps can have slightly different accent colors while sharing the base brand palette.

---

## 9. OpenAPI → TypeScript Client

### Tool: `orval`

`orval` generates typed API functions and TanStack Query hooks from your NestJS OpenAPI spec. Unlike `openapi-typescript` (which only generates types), orval generates the actual fetch functions and hooks.

### Generation Flow

```
NestJS Swagger endpoint (swagger.json)
    │  npm run generate:api
    ▼
orval reads spec
    │
    ▼
packages/api-client/src/
  ├── auth.ts          (generated fetch functions for auth endpoints)
  ├── trips.ts
  ├── payments.ts
  ├── location.ts
  ├── pricing.ts
  ├── drivers.ts
  ├── riders.ts
  └── model/           (all DTOs as TypeScript types)
      ├── trip.ts
      ├── driver.ts
      └── ...
```

### `orval.config.ts` in `packages/api-client`

```typescript
export default defineConfig({
  car1983: {
    input: 'https://api.car1983.com/docs-json',  // your NestJS swagger JSON endpoint
    output: {
      mode: 'tags-split',           // one file per controller tag
      target: './src',
      schemas: './src/model',
      client: 'react-query',        // generates TanStack Query hooks
      httpClient: 'axios',
      baseUrl: process.env.NEXT_PUBLIC_API_URL,
    }
  }
})
```

### Usage in Apps

```typescript
// Auto-generated — never write this by hand
import { useGetTripById, useGetRiderProfile } from '@car1983/api-client'

// In a component
const { data: trip, isLoading } = useGetTripById(tripId)
```

### Turborepo Pipeline Integration

Add `generate:api` to your turbo pipeline so it always runs before build:

```json
// turbo.json
{
  "tasks": {
    "generate:api": {
      "cache": false,
      "outputs": ["packages/api-client/src/**"]
    },
    "build": {
      "dependsOn": ["^build", "generate:api"]
    }
  }
}
```

---

## 10. Subdomain & Cloudflare Config

| App | URL | Cloudflare Mode | Special Rules |
|---|---|---|---|
| Public | `car1983.com` + `www.car1983.com` | Proxied (orange) | Page cache rules for static assets |
| Rider | `app.car1983.com` | Proxied (orange) | WAF on — blocks scrapers and bots |
| Driver | `driver.car1983.com` | Proxied (orange) | WAF on |
| Admin | `admin.car1983.com` | Proxied (orange) | Cloudflare firewall: block all IPs not in allowlist |

### Admin IP Restriction (Two Layers)

**Layer 1 — Cloudflare firewall rule (first line of defense):**
```
(ip.src ne x.x.x.x and ip.src ne y.y.y.y) and http.host eq "admin.car1983.com"
→ Action: Block
```
Requests from non-allowlisted IPs never reach Amplify. Zero cost, zero server load.

**Layer 2 — `proxy.ts` in admin app (defense in depth):**
```typescript
// apps/admin/proxy.ts
export function proxy(request: NextRequest) {
  const allowed = process.env.ADMIN_ALLOWED_IPS?.split(',') ?? []
  const ip = request.headers.get('cf-connecting-ip')  // Cloudflare's real IP header
  if (!allowed.includes(ip ?? '')) {
    return new Response('Forbidden', { status: 403 })
  }
}
```

Use `cf-connecting-ip` header (Cloudflare's real client IP header) not `x-forwarded-for` — Cloudflare sets the former reliably.

---

## 11. CI/CD Pipeline

### GitHub Actions Workflow

One workflow file handles all apps with affected detection:

```
Push to main or staging branch
    │
    ▼
Detect changed packages (git diff)
    │
    ├── packages/ui changed?        → all 4 apps flag as affected
    ├── packages/api-client changed? → all 4 apps flag as affected
    ├── apps/rider changed?          → rider flagged
    ├── apps/driver changed?         → driver flagged
    └── apps/admin changed?          → admin flagged
    │
    ▼
Lint + TypeCheck (Turborepo affected only)
    │
    ▼
Build (Turborepo affected only)
    │
    ▼
Amplify notified via webhook → deploys affected apps
```

### Branch → Environment Mapping

| Branch | Environment | URL Pattern |
|---|---|---|
| `main` | Production | `app.car1983.com`, `driver.car1983.com`, etc. |
| `staging` | Staging | Amplify preview URL per app |
| `feature/*` | PR preview | Amplify auto-preview per PR |

Amplify creates preview URLs automatically per PR — every PR gets a live preview of the changed app at a unique Amplify URL. No extra configuration needed.

### `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "typecheck": {
      "dependsOn": ["^typecheck"],
      "outputs": []
    },
    "generate:api": {
      "cache": false,
      "outputs": ["packages/api-client/src/**"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

### `pnpm-workspace.yaml`

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

---

## 12. Implementation Phases

### Phase 1 — Foundation (Week 1)
1. Initialize repo with Turborepo + pnpm workspaces
2. Create `.npmrc` with Amplify-required config
3. Create `packages/config` — base TypeScript, ESLint, Tailwind configs
4. Create `packages/types` — initial shared interfaces from backend contracts
5. Create `packages/utils` — formatCents, formatDistance, formatDuration, token helpers
6. Create `packages/ui` — shadcn setup, Button, Input, Card, Modal, Toast
7. Scaffold all 4 apps with `create-next-app` — App Router, TypeScript, Tailwind
8. Wire apps to extend `@car1983/config` base configs
9. Verify `turbo build` runs cleanly across all apps
10. Connect all 4 apps to Amplify console — verify one test deploy works

### Phase 2 — API Client & Auth (Week 2)
11. Set up `packages/api-client` with orval + NestJS OpenAPI spec
12. Configure Axios instance with interceptors in api-client
13. Generate initial client — verify types match backend
14. Build `@car1983/auth-rider` — OTP flow, session management, httpOnly cookie
15. Build `@car1983/auth-driver` — OTP flow, onboarding step state, guards
16. Add `RiderAuthGuard` and `DriverAuthGuard` server components
17. Test auth flows end-to-end in rider and driver apps

### Phase 3 — Public Site (Week 2–3)
18. Build landing page — hero, how it works, download app CTAs, city coverage
19. Build marketing pages — about, safety, driver signup CTA
20. SEO setup — metadata, OG images, sitemap, robots.txt
21. Performance audit — Lighthouse score target 95+
22. Deploy to `car1983.com` via Amplify

### Phase 4 — Rider App (Week 3–4)
23. Map integration — Google Maps JS API, pickup/dropoff pin selection
24. Fare estimate flow — address autocomplete → route preview → fare display
25. Trip booking flow — confirm → waiting → matched → in-progress → completed
26. Real-time trip status via WebSocket + TanStack Query
27. Trip history page
28. Wallet and payment methods page
29. Profile and settings
30. Notifications inbox

### Phase 5 — Driver App (Week 4–5)
31. Multi-step onboarding UI (steps 1–9)
32. Stripe Express onboarding redirect (step 8)
33. Driver dashboard — online/offline toggle, incoming trip requests
34. Trip accept/reject flow with countdown timer
35. Navigation view (trip in progress)
36. Earnings dashboard — today, week, month
37. Documents and vehicle info management

### Phase 6 — Admin App (Week 5–6)
38. AdminJS setup + Prisma adapter for `admin_db`
39. Custom pages: live surge dashboard, dispute queue, reconciliation report
40. Driver approval workflow — review documents, approve/reject
41. Promo code management
42. Rate card management (pricing zones, multipliers)
43. User management (rider and driver search, account actions)
44. IP restriction via `proxy.ts` + Cloudflare firewall rule

### Phase 7 — Polish & Production (Week 6–7)
45. Error boundaries in all apps
46. Loading skeletons for all data-fetching UI
47. Offline detection + graceful degradation
48. Mobile responsiveness audit across all apps
49. Security headers in `next.config.ts` (CSP, HSTS, X-Frame-Options)
50. Final Amplify production deployment + custom domain setup in Cloudflare

---

## 13. Open Decisions

| Decision | Status | Notes |
|---|---|---|
| Apple Pay / Google Pay on rider web | Deferred | Stripe Payment Element supports both — add when ready |
| i18n / localization | Not planned for launch | Design `@car1983/utils` date/currency formatters with locale param from day one |
| Push notifications on web | Deferred | Web Push API available but complex — mobile app covers this at launch |
| PWA for rider web | Deferred | Service worker, offline mode — consider after launch based on usage |
| Storybook for `@car1983/ui` | Recommended | Invaluable once the team grows — skip for now |
| E2E testing (Playwright) | Phase 2 | Critical paths: rider booking flow, driver onboarding, admin approval |
| Bundle analyzer | Built into Next.js 16.1 | Run `ANALYZE=true next build` — use before first production deploy |
| Remote Turborepo cache | Deferred | Self-host with `turborepo-remote-cache` on a t3.nano when CI build times grow |

---

*This document covers frontend architecture, monorepo structure, and deployment strategy only.*  
*UI design, component implementation, and page-level architecture are out of scope here.*

*Review after Phase 2 completion — auth and API client decisions may surface adjustments needed.*

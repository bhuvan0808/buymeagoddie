# BuyMeAGoddie

A creator payment profile platform. Creators get a beautiful support page; supporters pay them **directly** over their country's instant payment rail (UPI for India at launch). The platform **never** receives, holds, or routes money.

```
Supporter ──(UPI deep link / QR)──▶ Creator's bank
                 ▲
                 │  BuyMeAGoddie only renders the page.
```

## Stack

- **Frontend:** Next.js 15 (App Router, Server Components, Server Actions), React 19, TypeScript (strict), Tailwind CSS v4
- **UI:** shadcn-style primitives on Radix UI, Lucide icons, glassmorphism design system
- **Motion:** Framer Motion, GSAP-ready, Lenis smooth scrolling
- **3D:** Three.js via React Three Fiber + Drei (hero scene)
- **Forms:** React Hook Form + Zod (client and server validation share schemas)
- **Backend:** Supabase — Auth (Google, email/password, magic link), Postgres with RLS, Storage (avatars)
- **Deploy:** Vercel (frontend) + Supabase (backend)

## Getting started

1. **Install**

   ```bash
   npm install
   ```

2. **Create a Supabase project** at [supabase.com](https://supabase.com/dashboard), then:
   - Run the migration in `supabase/migrations/00001_initial_schema.sql` (SQL Editor → paste → run), or `npx supabase db push` if using the CLI.
   - Enable **Google** under Auth → Providers (add your OAuth client), keep **Email** enabled.
   - Set Auth → URL Configuration → Site URL to your domain (or `http://localhost:3000`) and add `/auth/callback` to redirect URLs.

3. **Environment** — copy `.env.example` to `.env.local` and fill in:

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Run**

   ```bash
   npm run dev
   ```

## Architecture

```
src/
  app/                    # Routes only — thin, compose features
    (marketing)/          # Landing, legal, comparisons (public shell)
    (auth)/               # Login / signup / password flows (glass card shell)
    auth/callback/        # OAuth + email link exchange
    onboarding/           # 4-step wizard
    dashboard/            # Creator dashboard (protected by middleware)
    [username]/           # Public creator pages
  components/
    ui/                   # Primitives (button, card, dialog, …)
    shared/               # Logo, reveal animations, copy button, …
    three/                # R3F hero scene
    layout/, providers/
  features/               # Feature-first domain logic
    payments/             # ⭐ Generic rail registry — UPI active, Pix/PayNow/… declared
    marketing/            # Landing sections + FAQ/comparison content
    auth/                 # Server actions + forms
    onboarding/           # Wizard + availability checks
    dashboard/            # Queries + mutation actions + forms
    profile/              # Shared ProfileCard (demo, previews, live page)
  lib/                    # supabase clients, validation, constants, seo
  types/                  # Database row types
supabase/migrations/      # SQL schema, RLS policies, triggers, storage
```

### The payments abstraction

Every rail is a `PaymentMethodDefinition` (`src/features/payments/types.ts`): identifier validation + deep-link builder + presets + currency. Adding Pix later means writing one file in `features/payments/providers/` and flipping its status — no schema or UI changes. The DB already stores `provider` + `identifier` generically.

### Security posture

- **We only store the public payment identifier** (UPI ID) — never PINs, OTPs, or bank credentials.
- Row Level Security on all tables; users can only write their own rows.
- All mutations go through Server Actions with Zod validation; DB constraints mirror app rules (username format, reserved names, URL https-only).
- Middleware refreshes sessions and enforces auth boundaries; security headers set in `next.config.ts`.

## Scripts

- `npm run dev` — develop
- `npm run build` — production build
- `npm run lint` — ESLint

<div align="center">

# 💜 BuyMeAGoddie

**Receive support directly with UPI. No gateway. No fees. No middleman.**

[![Live](https://img.shields.io/badge/live-buymeagoddie.vercel.app-8b5cf6)](https://buymeagoddie.vercel.app)
[![GitHub stars](https://img.shields.io/github/stars/bhuvan0808/buymeagoddie?style=flat&color=f5c451)](https://github.com/bhuvan0808/buymeagoddie/stargazers)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-d946ef.svg)](#-contributing)

[Live site](https://buymeagoddie.vercel.app) · [Report a bug](https://github.com/bhuvan0808/buymeagoddie/issues/new) · [Request a feature](https://github.com/bhuvan0808/buymeagoddie/issues/new)

</div>

---

BuyMeAGoddie is an open-source creator payment profile platform. Creators get a beautiful support page; supporters pay them **directly** over their country's instant payment rail (UPI for India at launch). The platform **never** receives, holds, or routes money — and it's **free forever**, because the money physically can't pass through us.

```
Supporter ──(UPI deep link / QR)──▶ Creator's bank account
                    ▲
                    │  BuyMeAGoddie only renders the page.
```

## ✨ Features

- 🎨 Premium creator pages — glassmorphism, 4 themes, dark/light mode, 3D animated landing
- ⚡ One-tap UPI payments — `upi://pay` deep links open GPay / PhonePe / Paytm / BHIM pre-filled
- 📱 QR codes everywhere — scan-to-pay for desktop supporters, page QR for posters & streams
- 🔗 One link for every bio — Instagram, YouTube, LinkedIn, GitHub
- 🌍 Built multi-rail from day one — Pix, PayNow, PromptPay, QRIS, SEPA Instant & Aani slot in without schema changes
- 🆓 Zero platform fees, zero transaction fees, free forever

## 🛠 Tech stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router, Server Components, Server Actions), React 19, strict TypeScript |
| Styling | Tailwind CSS v4, shadcn-style primitives on Radix UI, Lucide icons |
| Motion & 3D | Framer Motion, Lenis smooth scroll, Three.js via React Three Fiber + Drei |
| Forms & validation | React Hook Form + Zod (schemas shared client/server) |
| Backend | Supabase — Auth (Google, email/password, magic link), Postgres + RLS, Storage |
| Hosting | Vercel |

## 🚀 Getting started

**Prerequisites:** Node 20+, npm, and a free [Supabase](https://supabase.com) account.

```bash
# 1. Clone (or fork first if you plan to contribute)
git clone https://github.com/bhuvan0808/buymeagoddie.git
cd buymeagoddie
npm install

# 2. Set up the database
#    Create a Supabase project, open its SQL Editor, and run the contents of:
#    supabase/migrations/00001_initial_schema.sql

# 3. Configure environment
cp .env.example .env.local
#    Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
#    (Supabase Dashboard → Project Settings → API)

# 4. Run
npm run dev        # http://localhost:3000
```

For auth flows to round-trip locally, add `http://localhost:3000/auth/callback` to Supabase → Auth → URL Configuration → Redirect URLs.

## 🗂 Project structure

```
src/
  app/                  # Routes only — thin, compose features
    (marketing)/        # Landing, legal, comparisons
    (auth)/             # Login / signup / password flows
    onboarding/         # 4-step creator wizard
    dashboard/          # Creator dashboard (auth-protected)
    [username]/         # Public creator pages
  features/             # Feature-first domain logic
    payments/           # ⭐ Generic rail registry — start here
    marketing/ auth/ onboarding/ dashboard/ profile/
  components/           # ui/ primitives, shared/, three/, layout/
  lib/                  # supabase clients, validation, constants, seo
supabase/migrations/    # SQL schema, RLS policies, triggers
```

## 🤝 Contributing

Contributions of every size are welcome — bug fixes, UI polish, docs, translations, and above all **new payment rails**. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide. Short version:

1. **Fork** the repo and create a branch: `git checkout -b feat/pix-support` (use `feat/`, `fix/`, `docs/` prefixes).
2. **Make your change.** Keep routes thin, domain logic in `src/features/*`, validate all input with Zod on the server, no magic strings, no duplicated code.
3. **Check it passes:** `npm run build && npm run lint` — both must be clean.
4. **Open a PR** against `main` with a clear description (screenshots for UI changes). Every PR needs **at least one approving review** before it can merge.

### Adding a payment rail (most-wanted contribution 🌟)

The entire abstraction is one interface — `PaymentMethodDefinition` in [`src/features/payments/types.ts`](src/features/payments/types.ts):

1. Create `src/features/payments/providers/<rail>.ts` implementing identifier validation + the deep-link/QR payload builder (link the rail's official spec).
2. Replace the `comingSoon(...)` stub in [`registry.ts`](src/features/payments/registry.ts) with your implementation.
3. Add the provider to the `provider_known` DB constraint in a new migration file.

No UI changes needed — country selection, onboarding, profile pages, and QR codes pick the new rail up automatically.

### Ground rules

- 🚫 Never add code that asks for or stores UPI PINs, OTPs, bank passwords, or card numbers. We only ever store **public** payment identifiers.
- 🚫 No code paths where the platform touches money. Supporter → creator, always.
- 🔒 Security issues: **don't** open a public issue — email security@buymeagoddie.com.

## 📄 License

[MIT](LICENSE) © Bhuvan Boddu and BuyMeAGoddie contributors.

If this project helps you, ⭐ star the repo — or tap the 💜 button on the site and send a goddie.

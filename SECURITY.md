# Security Policy

## Reporting a Vulnerability

Please do **not** open a public issue for security vulnerabilities.

Email **bhuvanboddu08@gmail.com** with:

- A description of the vulnerability and its impact
- Steps to reproduce
- Any suggested fix, if you have one

You'll get a response within 72 hours. We ask for reasonable time to ship a
fix before public disclosure, and we'll credit you in the fix's release notes
unless you prefer otherwise.

## Scope

BuyMeAGoddie never processes, holds, or routes money — payments happen
directly between supporters and creators via UPI deep links. The most
security-sensitive areas of this codebase are:

- Row Level Security policies (`supabase/migrations/`)
- Server actions and input validation (`src/features/*/actions.ts`, `src/lib/validation/`)
- Payment deep-link construction (`src/features/payments/`)
- Auth flows (`src/features/auth/`, `src/app/auth/`)

## Hard rules

- The platform must never ask for or store UPI PINs, OTPs, bank passwords,
  or card details — only public payment identifiers.
- No code path may place the platform inside the money flow.

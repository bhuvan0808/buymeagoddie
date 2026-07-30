# Contributing to BuyMeAGoddie

Thanks for wanting to help! BuyMeAGoddie is a zero-fee creator support platform, and contributions of every size are welcome — bug fixes, new payment rails, UI polish, docs.

## Getting set up

1. Fork and clone the repo, then `npm install`.
2. Create a free [Supabase](https://supabase.com) project and run `supabase/migrations/00001_initial_schema.sql` in the SQL Editor.
3. Copy `.env.example` to `.env.local` and fill in your Supabase URL + publishable (anon) key.
4. `npm run dev` and open http://localhost:3000.

## Before opening a PR

- Branch from `main` with a descriptive name: `feat/...`, `fix/...`, or `docs/...`.
- `npm run build` and `npm run lint` must both pass.
- PRs target `main` and require **at least one approving review** before merge (enforced by branch protection).
- Include screenshots or a short clip for any UI change.
- Keep the architecture: routes in `src/app` stay thin; domain logic lives in `src/features/*`; no duplicated code, no magic strings.
- All user input must be validated with Zod on the server and constrained in the database.
- **Never** introduce code that asks for or stores UPI PINs, OTPs, bank passwords, or card details. The platform only ever stores public payment identifiers.

## Adding a new payment rail (Pix, PayNow, …)

This is the most-wanted kind of contribution:

1. Create `src/features/payments/providers/<rail>.ts` implementing `PaymentMethodDefinition` (validation + deep-link/QR payload builder).
2. Replace the `comingSoon(...)` stub in `src/features/payments/registry.ts` with your implementation.
3. Add the provider value to the `provider_known` check constraint in a new SQL migration.
4. Include links to the rail's official spec in your PR description.

## Reporting issues

Use [GitHub Issues](https://github.com/bhuvan0808/buymeagoddie/issues). For security vulnerabilities, please do **not** open a public issue — email security@buymeagoddie.com instead.

# job-exit (utodom.hu)

A platform for sharing upcoming job openings before they are officially posted: people who are
leaving a job publish the position they vacate, and job seekers can apply before the employer
advertises it.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- PostgreSQL via Prisma
- Passwordless login (magic links), transactional email via Resend
- Bilingual UI (Hungarian / English) under `/hu` and `/en`

## Local setup

```bash
cp .env.example .env        # fill in DATABASE_URL etc.
npm install
npx prisma migrate dev
npm run db:seed             # tech tags + cities
npm run dev
```

Without `RESEND_API_KEY` set, emails (login links, notifications) are printed to the server log
instead of being sent.

## Scripts

| command | purpose |
| --- | --- |
| `npm run dev` | dev server |
| `npm run build` | production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:seed` | seed tech tags and cities |

## Scheduled jobs

`GET /api/cron` (authorised with `CRON_SECRET`) sends closing reminders, auto-closes listings
30 days after the last working day, and sends saved-search digests. On Vercel it is scheduled
daily by `vercel.json`.

## Environment variables

See `.env.example`: `DATABASE_URL`, `APP_URL`, `ADMIN_EMAILS`, `RESEND_API_KEY`, `EMAIL_FROM`,
`CRON_SECRET`.

<div align="center">
  <h1>APAN Apparel — Storefront</h1>
  <p><em>Next.js e-commerce storefront for a premium apparel brand</em></p>
</div>

A production-grade, mobile-first e-commerce storefront built with **Next.js**, **TypeScript**, and **Tailwind CSS**. It delivers a complete shopping experience — browsing, cart, checkout, accounts, and a full admin dashboard — powered by a REST API backend built with NestJS and PostgreSQL.

## Highlights

- **Full shopping flow**: product catalog with categories, brands, and collections; guest and authenticated carts; order placement and tracking.
- **Role-based access**: USER / ADMIN roles with protected routes, authentication via JWT, and profile management.
- **Admin dashboard**: manage products, variants, and stock levels; track stock movements; create purchase orders and manage suppliers; update site settings.
- **Modern UI**: responsive mobile-first design, animated components with `motion`, image-optimized product galleries, and a polished cart experience.
- **Server-state management**: TanStack Query for caching and data fetching; Zustand for lightweight client state.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 15 (App Router, RSC) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Data fetching | TanStack Query |
| State management | Zustand |
| Forms | React Hook Form + Zod |
| Auth | JWT (via backend) |
| Deployment | Vercel |

## Getting Started

**Prerequisites:** Node.js 18+, and a running instance of the [Apan-Backend](https://github.com/AK-Tanha/Apan-Backend) (or the deployed API).

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the API URL in `.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
   To use the deployed backend: `NEXT_PUBLIC_API_URL=https://apan-backend.vercel.app`

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

## Scripts

```bash
npm run dev     # start the dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # run ESLint
```

## Architecture

```
app/          Next.js App Router — storefront, auth, account, admin routes
components/   Reusable UI and feature components
context/      React providers (cart, query client)
hooks/        TanStack Query hooks, one per resource
lib/          API client, shared types and utilities
stores/       Zustand stores (auth, cart drawer, orders)
```

The frontend is fully decoupled from the backend, communicating over a typed REST API client (`lib/api-client.ts`) with automatic JWT attachment and centralized error handling.

## Related

- **Backend API**: [AK-Tanha/Apan-Backend](https://github.com/AK-Tanha/Apan-Backend) — NestJS + Prisma + PostgreSQL
- **Live storefront**: https://apontraders.vercel.app
- **Live API**: https://apan-backend.vercel.app
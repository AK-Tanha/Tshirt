<div align="center">
<img width="1200" height="475" alt="APAN Apparel" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# APAN Apparel — Storefront (Tshirt)

Next.js storefront for the APAN Apparel / Court Classic online store. It consumes the REST API from the [Apan-Backend](https://github.com/AK-Tanha/Apan-Backend) repo to display products, manage carts, place orders, and run the admin dashboard.

## Features

- Public storefront with products, categories, brands, and collections
- Shopping cart (guest + logged-in users)
- User accounts with authentication (JWT) and role-based access (USER / ADMIN)
- Admin dashboard for managing products, inventory, stock movements, suppliers, purchase orders, site settings, and users
- Responsive Tailwind CSS UI with animated components

## Tech Stack

- [Next.js](https://nextjs.org/) 15 (App Router)
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [TanStack Query](https://tanstack.com/query) for server-state management
- [Zustand](https://zustand.docs.pmnd.rs/) for client-state management
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

## Getting Started

**Prerequisites:** Node.js, and a running [Apan-Backend](https://github.com/AK-Tanha/Apan-Backend) instance (or the deployed API).

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure the API URL in `.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
   To use the deployed backend, set `NEXT_PUBLIC_API_URL=https://apan-backend.vercel.app` instead.

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

## Project Structure

- `app/` — Next.js App Router routes (storefront, auth, account, admin)
- `components/` — UI and feature components
- `context/` — React context providers (cart, query client)
- `hooks/` — TanStack Query hooks per resource
- `lib/` — API client, types, and shared utilities
- `stores/` — Zustand stores (auth, cart drawer, orders)

## Deployed

- Storefront: https://apontraders.vercel.app
- API: https://apan-backend.vercel.app
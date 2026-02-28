Admin Dashboard
===============

This folder scaffolds a modern admin dashboard for the bridal showroom.

Features scaffolded:
- Admin layout with responsive sidebar and topbar
- Products CRUD UI (Server Action placeholder for creation)
- Collections, Homepage editor
- WhatsApp and SEO settings
- Image preview before upload

How to use
----------

1. Start the dev server: `npm run dev` or `pnpm dev`.
2. Visit `/admin` to access the dashboard.

Notes
-----
- Server actions in `app/actions/products.ts` are placeholders — wire them to your DB and storage.
- Authentication hooks are left intentionally minimal — integrate your Auth provider in `app/admin/layout.tsx` or `Topbar`.

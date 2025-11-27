# Components Catalog (Overview)

This document highlights key components and where to find them.

## UI system

The project contains a lightweight UI library in `src/components/ui` with components such as `Button`, `Input`, `Card`, `Modal`, and `Toast`.

Use these components consistently to keep UI consistent and accessible.

## Auth components

- `src/components/auth/login-form.tsx` — Handles sign-in form and validation
- `src/components/auth/register-form.tsx` — Signup form
- `src/components/AuthProvider.tsx` — Session wrapper around the app

## Feed components

- `src/components/feed/Feed.tsx` — Shows list of posts
- `src/components/feed/CreatePost.tsx` — Create new post UI
- `src/components/feed/PostCard.tsx` — Displays a post
- `src/components/feed/Stories.tsx` — Stories UI

## Layout

- `src/components/layout/Navbar.tsx` — Main navigation
- `src/components/layout/CommonLayout.tsx` — Wrapper used across pages
- `src/components/layout/AdminLayout.tsx` — Admin-specific layout

## Dashboard

- `src/pages/dashboard/...` — Dashboard pages and sub-views
- `src/components/ui/table.tsx` — Table component used for admin pages

## Design systems & utilities

- Use `src/components/ui/` for composable UI
- Use `src/lib/navigation-data.ts` for site links/navigation
- For custom UI patterns, create components under `src/components` and export them from index files to keep imports simple.

---

Tips:

- Keep components small and singular in responsibility.
- Prefer React Query or RTK Query for server interactions at the component level.

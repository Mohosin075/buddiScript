# BuddiScript Frontend — Architecture

This document provides a high-level overview of the application's architecture, data flow, and major components.

## 1. High-level architecture

- The frontend is a single-page app built with React + TypeScript and bootstrapped using Vite.
- Routing is managed by React Router DOM.
- Application state is normalized and handled via Redux Toolkit and RTK Query for data fetching.
- Socket.IO is used for real-time notifications and events.
- The global API client is implemented with Axios. Interceptors manage authentication tokens, token refresh, and session expiry.

## 2. Directory & structure

- `src/main.tsx` — Application entry point
- `src/routes/` — Router configuration and protected route logic
- `src/pages/` — Page-level components (Auth, Dashboard, Profile, Posts)
- `src/components/` — Reusable UI components grouped by feature
- `src/lib/` — Helpers and configuration: `Base_URL.ts`, `authToken.ts`, and axios instances
- `src/redux/` — Store configuration, slices, RTK Query endpoints
- `src/hooks/` — Reusable hooks
- `src/layout/` — Common layout components and wrappers

## 3. Data flow

- Components call RTK Query services or action creators to interact with the backend.
- RTK Query abstracts repeated fetch, cache, and invalidation logic.
- The Axios instance handles attaching tokens and retry logic for token refresh.
- Socket events update local state (via dispatch) or show UI notifications.

## 4. Authentication & API security

- Auth routes return access and refresh tokens. On the frontend, these are stored either in HTTP-only cookies (recommended in production) or a token store.
- Axios interceptors attach tokens to the `Authorization` header when using bearer tokens, or rely on `withCredentials` for cookie-based sessions.
- On 401 responses, the refresh workflow will attempt to refresh the token and retry the failed request; if refresh fails, the app logs the user out.

## 5. Real-time

- Socket.IO connects with auth data and listens to events like `notification`, `post:update`, `chat:message`.
- The client emits events for actions like creating posts or sending chat messages.

## 6. Testing & debugging

- Use `npm run dev` for local dev with hot reload.
- Lint and formatting commands are included to keep code clean.

---

For implementation details, refer to the `src/redux`, `src/lib`, and `src/components` folders.

# BuddiScript — Frontend

Welcome to the BuddiScript frontend repository: a modular, production-ready React + TypeScript application designed to work with the BuddiScript API. This project prioritizes scalability, developer experience, and maintainable architecture by leveraging Vite, Redux Toolkit, RTK Query, TailwindCSS, and modern React practices.

---

## 🎯 Overview

The frontend handles all user interactions, authentication flows, content creation and consumption (posts, comments, likes), and real-time updates. It is built to connect to a BuddiScript backend (local or deployed) through a reusable API module and uses Socket.IO for live updates.

---

## ⚙️ Core Features

- 🔐 Authentication flows: Login, Signup, OTP verification, Google OAuth, and Password Reset
- 👤 User profiles with image uploads and profile settings
- 📝 Content creation & consumption: posts, comments, likes, and shares
- 📡 Real-time updates & notifications via Socket.IO
- 🧭 Dynamic routing using React Router DOM
- 🎛 State management with Redux Toolkit and RTK Query
- 🎨 Styling with TailwindCSS and reusable UI components
- 🧩 A modular folder structure and reusable utilities
- 🛠 Global API layer with Axios, token management, and interceptors

---

## 🧰 Tech Stack

- React + TypeScript
- Vite
- Redux Toolkit + RTK Query
- React Router DOM
- TailwindCSS
- Axios for the API layer
- Socket.IO Client for real-time features
- React Hook Form + Zod (optional for validations)
- Sonner / Toast for notification UI

---

## 🗂️ Repo structure

Below is a simplified view of the main project folders (complete structure under `src/`):

```
src/
  assets/           # static assets
  components/       # shared components (ui + feature)
  hooks/            # shared hooks
  layout/           # layout components
  pages/            # top-level routes (auth, dashboard, posts etc.)
  redux/            # store, slices, persistence
  routes/           # router setup + protection logic
  lib/              # small utilities and config (axios, base URLs, tokens)
  utils/            # small helpers
  main.tsx
```

---

## 📦 Requirements

- Node.js 18+ (or latest LTS)
- A running BuddiScript backend (or use a remote backend)
- A browser for frontend development

---

## 🚀 Getting started (quick)

1. Install dependencies:

```powershell
npm install
```

2. Create a `.env` file in the root (example variables below):

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Notes:

- Use `VITE_API_BASE_URL` for the API base URL (backend default: :5000/api/v1)
- Ensure `VITE_SOCKET_URL` is the Socket server URL (use same host as API for local dev)

> **Note:** The frontend URL must be added under **Authorized JavaScript Origins** in the Google OAuth console.

---

## 🧪 Scripts

- `npm run dev` - Start the dev server
- `npm run build` - Build production assets
- `npm run preview` - Preview a production build
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier

---

## 🧭 Routing overview

Example page routes:

```
/
/auth/login
/auth/signup
/auth/verify
/dashboard
/profile
/settings
/posts/:id
```

Protected routes (dashboard, profile) are enforced using HOCs or route guards in `src/routes/*`.

---

## 🔐 Authentication flow

1. Client → Backend auth API (Login/Signup/OTP)
2. Server returns `accessToken` and `refreshToken` in a secure mechanism (HTTP-only cookies or tokens)
3. The Axios instance attaches tokens for protected requests
4. Token refresh is handled by interceptors upon 401/expired token responses

Security highlights:

- Prefer HTTP-only cookies in production to protect from XSS
- Use refresh tokens and token rotate patterns if supported by the backend

---

## 📡 Socket.IO integration

Socket is configured through `VITE_SOCKET_URL` and authenticated via the same access token (usually as a bearer token in the `auth` setup). Socket.io events are used for real-time notifications and updates in-app.

Example:

```ts
const socket = io(import.meta.env.VITE_SOCKET_URL, {
  auth: { token: `Bearer ${token}` },
});
```

---

## 🧩 State management

Redux store is configured with slices for auth, user, posts, comments, etc., and RTK Query services for data fetching (API endpoints). See `src/redux/` for more details.

---

## 🎨 Styling

The project uses TailwindCSS for responsive utility-driven styling and a shared UI component library in `src/components/ui/`.

---

## 🔗 API integration

The global Axios instance and interceptors are configured under `src/lib/` (or `src/services`). It handles attaching tokens to requests, refreshing tokens, and automatic logout for invalid sessions.

Example concept:

```ts
axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});
```

---

## 🚀 Deployment

### Vercel / Netlify

1. `npm run build`
2. Deploy `dist/` or connect to repo in Vercel and set environment variables

### Nginx

1. Build with `npm run build`
2. Copy the `dist` folder to the server's web root (e.g., `/usr/share/nginx/html`)
3. Configure `try_files $uri $uri/ /index.html` for SPA routing

---

## 📁 Important files

- `src/main.tsx` — Bootstraps the React app
- `src/routes/index.tsx` — Router & route guards
- `src/redux/store.ts` — Redux store configuration
- `src/redux/api` — RTK Query services
- `src/lib/` — API base URL, token helpers, axios instance
- `src/components/AuthProvider.tsx` — Authentication wrapper
- `src/layout/` — layouts used across pages
- `src/pages/` — top-level pages

---

---

---

## ✅ What we added

- A clearer, more detailed README with all the key sections developers expect (Getting Started, environment variables, folder structure, architecture, routing, auth, socket config, and deployment).
- Next steps: See the `docs` folder which contains more technical details and contribution guidelines.

---

If you want this turned into a PDF, DOCX or a fully styled HTML documentation site, I can generate that as well.

---

## 📚 Additional documentation

More in-depth docs are available in the `docs/` folder:

- `docs/ARCHITECTURE.md` — Architecture, data flow, and design decisions
- `docs/COMPONENTS.md` — A small components catalog and locations
- `docs/DEPLOYMENT.md` — Deployment instructions for Vercel, Netlify, Nginx, Docker
- `docs/CONTRIBUTING.md` — How to contribute and the repository workflow
- `docs/ENVIRONMENT.md` — Environment variables and their definitions

---

Happy hacking! ⚡

---

If you want this turned into a **PDF, DOCX, or fully styled HTML documentation site**, just let me know!

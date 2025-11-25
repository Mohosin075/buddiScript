# **BuddiScript Frontend**

A polished, scalable frontend stack tailored for modern social/content-driven applications. Built with **React**, **TypeScript**, **Vite**, **Redux Toolkit**, and **TailwindCSS**, the BuddiScript Frontend is engineered for high performance, modularity, and seamless integration with the BuddiScript backend.

---

## 🎯 **Overview**

The BuddiScript Frontend delivers a production-grade UI layer featuring authentication flows, profile management, content rendering, real-time socket connectivity, and responsive layouts. Designed to plug directly into the BuddiScript server.

---

## ⚙️ **Core Features**

* 🔐 **Auth Flows**: Login, Signup, OTP Verification, Google OAuth, Password Reset
* 👤 **User Profile Management** with image uploads
* 📝 **Content Rendering** for posts, comments, likes, shares
* 📡 **Real-Time Socket.IO Events**
* 🧭 **Dynamic Routing** via React Router
* 🎛 **State Management** with Redux Toolkit + RTK Query
* 🎨 **TailwindCSS** for styling
* 🧩 **Modular Folder Structure** following scalable app patterns
* 🛠️ **Global Interceptors** for protected routes

---

## 🧰 **Tech Stack**

* **React** + **TypeScript**
* **Vite**
* **Redux Toolkit**, **RTK Query**
* **React Router DOM**
* **TailwindCSS**
* **Axios** (API layer)
* **Socket.IO Client**
* **React Hook Form** + Zod (optional)
* **Sonner / Toast** for notifications

---

## 🗂️ **Recommended Folder Structure**

```
src/
  assets/
  components/
  hooks/
  layouts/
  pages/
  redux/
    slices/
    store.ts
  routes/
  services/
  utils/
```

---

## 📦 **Requirements**

* Node.js 18+
* Vite-compatible environment
* BuddiScript backend running locally or remote

---

## 🚀 **Getting Started**

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Create `.env`

Your `.env` should include the following:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000

# Google OAuth (frontend web client)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

> **Note:** The frontend URL must be added under **Authorized JavaScript Origins** in the Google OAuth console.

---

## 🧪 **Scripts**

* `npm run dev` — Development mode
* `npm run build` — Build for production
* `npm run preview` — Preview production build locally
* `npm run lint` — ESLint check
* `npm run format` — Format with Prettier

---

## 🧭 **Routing Overview**

Example routes:

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

---

## 🔐 **Authentication Flow**

1. **Login / Signup → Backend Auth API**
2. Server returns **accessToken + refreshToken**
3. Tokens stored in **httpOnly cookies** or **local storage** (based on setup)
4. Protected routes validated via Axios interceptors

---

## 📡 **Socket.IO Integration**

```ts
const socket = io(import.meta.env.VITE_SOCKET_URL, {
  auth: {
    token: `Bearer ${token}`,
  },
});
```

Used for:

* Live notifications
* Real-time updates

---

## 🧩 **State Management (Redux Toolkit)**

Configured in `redux/store.ts` with:

* Auth slice
* User slice
* Post slice
* Notification slice
* RTK Query API services

---

## 🎨 **Styling (TailwindCSS)**

Responsive UI with:

* Utility classes
* Custom themes
* Reusable components via shadcn or custom UI kit

---

## 🔗 **API Layer Using Axios**

Global Axios instance:

```ts
axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});
```

Interceptors:

* Add tokens
* Handle expiration
* Auto-refresh logic

---

## 🧑‍💻 **Deployment**

### Vercel / Netlify / Firebase Hosting

Simply run:

```bash
npm run build
```

Then deploy the `dist/` folder.

### Nginx

Serve from `/usr/share/nginx/html`.

---

## 📁 **Key Frontend Files**

* `src/main.tsx` — App bootstrap
* `src/routes/index.tsx` — Router setup
* `src/redux/store.ts` — Global state
* `src/services/api.ts` — API config
* `src/components/AuthProvider` — Token/session management

---

## 📜 **License**

**ISC License**

---

If you want this turned into a **PDF, DOCX, or fully styled HTML documentation site**, just let me know!

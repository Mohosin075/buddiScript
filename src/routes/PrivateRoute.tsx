/* eslint-disable @typescript-eslint/no-unused-vars */
// import Cookies from "js-cookie";
import type { ReactNode } from "react";
import { Navigate } from "react-router";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  // Check multiple possible persistence locations for a token
  const token = localStorage.getItem("token");

  if (token) return children;

  // Fallback: some flows store auth as `buddiAuth` with shape { user, token }
  const stored = localStorage.getItem("buddiAuth");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.token) return children;
    } catch (err) {
      // ignore parse error
    }
  }

  // Not authenticated -> redirect to login
  return <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;

// import Cookies from "js-cookie";
import type { ReactNode } from "react";
import { Navigate } from "react-router";

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const role = localStorage.getItem("userRole");

  if (role && role.toLowerCase() === "admin") {
    return children;
  }

  // Redirect to home if not authorized
  return <Navigate to="/" replace />;
};

export default AdminRoute;

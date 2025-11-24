// import Cookies from "js-cookie";
import type { ReactNode } from "react";
import { Navigate } from "react-router";

const UserRoute = ({ children }: { children: ReactNode }) => {
  const role = localStorage.getItem("userRole");

  if (role && role.toLowerCase() === "user") {
    return children;
  }

  // Redirect to home if not authorized
  return <Navigate to="/" replace />;
};

export default UserRoute;

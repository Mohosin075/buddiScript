import App from "@/App";
import AdminLayout from "@/components/layout/AdminLayout";
import ForgotPasswordPage from "@/pages/auth/ForgotPassword";
import LoginPage from "@/pages/auth/Login";
import OtpPage from "@/pages/auth/OtpPage";
import SignupPage from "@/pages/auth/Signup";
import AdminDashboardPage from "@/pages/dashboard/admin/AdminDashboardPage";
import AdminUsersPage from "@/pages/dashboard/admin/UserPage";
import ProfilePage from "@/pages/dashboard/user/Profile";
import Home from "@/pages/Home";
import { createBrowserRouter } from "react-router";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";
import UserRoute from "./UserRoute";
import NotFoundPage from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    Component: App,

    path: "/",
    children: [
      {
        index: true,
        Component: Home,
        path: "/",
      }
    ],
  },
  {
    Component: AdminLayout,
    path: "dashboard",
    children: [
      {
        Component: () => (
          <PrivateRoute>
            <UserRoute>
              <ProfilePage />
            </UserRoute>
          </PrivateRoute>
        ),
        path: "user/profile",
      },
      {
        Component: () => (
          <PrivateRoute>
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          </PrivateRoute>
        ),
        path: "admin",
      },
      {
        Component: () => (
          <PrivateRoute>
            <AdminRoute>
              <AdminUsersPage />
            </AdminRoute>
          </PrivateRoute>
        ),

        path: "admin/users",
      },

    ],
  },
  {
    Component: SignupPage,
    path: "auth/signup",
  },
  {
    Component: LoginPage,
    path: "auth/login",
  },
  {
    Component: ForgotPasswordPage,
    path: "auth/forgot-password",
  },
  {
    Component: OtpPage,
    path: "auth/otp-verification",
  },
  {
    Component: NotFoundPage,
    path: "*",
  },
]);

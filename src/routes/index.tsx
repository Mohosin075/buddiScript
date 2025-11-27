import App from "@/App";
import AdminLayout from "@/components/layout/AdminLayout";
import ForgotPasswordPage from "@/pages/auth/ForgotPassword";
import LoginPage from "@/pages/auth/Login";
import OtpPage from "@/pages/auth/OtpPage";
import SignupPage from "@/pages/auth/Signup";
import AdminDashboardPage from "@/pages/dashboard/admin/AdminDashboardPage";
import AdminUsersPage from "@/pages/dashboard/admin/UserPage";
import Home from "@/pages/Home";
import { createBrowserRouter } from "react-router";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";
import NotFoundPage from "@/pages/NotFoundPage";
import ProfilePage from "@/pages/dashboard/user/Profile";
import FriendPage from "@/pages/Friend";
import NotificationPage from "@/pages/Notification";
import MessagePage from "@/pages/Message";
import ResetPasswordPage from "@/pages/auth/ResetPassword";

export const router = createBrowserRouter([
  {
    Component: App,

    path: "/",
    children: [
      {
        index: true,
        Component: () => (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
        path: "/",
      },
      {
        Component: () => (
          <PrivateRoute>
            {/* <UserRoute> */}
            <ProfilePage />
            {/* </UserRoute> */}
          </PrivateRoute>
        ),
        path: "/profile",
      },
      {
        Component: () => (
          <PrivateRoute>
            <FriendPage />
          </PrivateRoute>
        ),
        path: "/friend",
      },
      {
        Component: () => (
          <PrivateRoute>
            <NotificationPage />
          </PrivateRoute>
        ),
        path: "/notification",
      },
      {
        Component: () => (
          <PrivateRoute>
            <MessagePage />
          </PrivateRoute>
        ),
        path: "/message",
      },
    ],
  },
  {
    Component: AdminLayout,
    path: "dashboard",
    children: [
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
    Component: ResetPasswordPage,
    path: "auth/reset-password",
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

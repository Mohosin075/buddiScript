/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from "react";
import { useAppDispatch } from "./hooks";
import { setCredentials } from "./slices/authSlice";

export function useAuthPersistence() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check for stored auth data on app load
    const storedAuth = localStorage.getItem("buddiAuth");
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        if (authData.token && authData.user) {
          dispatch(setCredentials(authData));
        }
      } catch (error) {
        // Clear invalid stored data
        localStorage.removeItem("buddiAuth");
      }
    }
    else {
      // Fallback: some parts of the app store token and userData separately
      const token = localStorage.getItem("token");
      const userDataStr = localStorage.getItem("userData");

      if (token && userDataStr) {
        try {
          const user = JSON.parse(userDataStr);
          dispatch(
            setCredentials({
              user: { data: user } as any,
              token,
            })
          );
        } catch (err) {
          // If parsing fails, clear the invalid item
          localStorage.removeItem("userData");
        }
      }
    }
  }, [dispatch]);
}

// Helper function to persist auth data
export function persistAuthData(authData: { user: any; token: string }) {
  localStorage.setItem("buddiAuth", JSON.stringify(authData));
  // Also set token and userData for parts of the app that read them directly
  try {
    const userData = authData.user?.data ?? authData.user;
    if (authData.token) localStorage.setItem("token", authData.token);
    if (userData) localStorage.setItem("userData", JSON.stringify(userData));
    if (userData?.role) localStorage.setItem("userRole", userData.role);
  } catch (err) {
    // ignore
  }
}

// Helper function to clear auth data
export function clearAuthData() {
  localStorage.removeItem("buddiAuth");
  localStorage.removeItem("token");
  localStorage.removeItem("userData");
  localStorage.removeItem("userRole");
  localStorage.removeItem("isAuthenticated");
}

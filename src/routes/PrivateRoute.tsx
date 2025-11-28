/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useState, useEffect } from "react";
import Spinner from "@/components/shared/Spinner";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import type { RootState } from "@/redux/store";

// Helper function to get from localStorage
const getFromLocalStorage = (key: string): string | undefined => {
  try {
    return localStorage.getItem(key) || undefined;
  } catch {
    return undefined;
  }
};

// Token retrieval function (same as yours)
const getAuthToken = (state: RootState) => {
  const fromState = state?.auth?.token as string | undefined;
  if (fromState) return fromState;

  const fromCookie = Cookies.get("token");
  if (fromCookie) return fromCookie;

  const fromLS = getFromLocalStorage("token");
  if (fromLS) return fromLS;

  return undefined;
};

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Get token from Redux state
  const tokenFromState = useSelector((state: RootState) => getAuthToken(state));

  useEffect(() => {
    checkAuthentication();
  }, [tokenFromState]); // Re-check when tokenFromState changes

  const checkAuthentication = () => {
    // Priority 1: Check Redux state first (most reliable for current session)
    if (tokenFromState) {
      setIsAuthenticated(true);
      setIsChecking(false);
      return;
    }

    // Priority 2: Check localStorage as fallback
    const stored = localStorage.getItem("token");

    if (stored) {
      try {
        // Handle both JSON format and plain string tokens
        const parsed = JSON.parse(stored);
        const token = parsed?.token || parsed;

        if (token && typeof token === "string" && token.length > 0) {
          setIsAuthenticated(true);
          setIsChecking(false);
          return;
        }
      } catch (err) {
        // If it's not JSON, use as plain string
        if (stored && stored.length > 0) {
          setIsAuthenticated(true);
          setIsChecking(false);
          return;
        }
      }
    }

    // Not authenticated
    setIsAuthenticated(false);
    setIsChecking(false);
  };

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size={48} />
      </div>
    );
  }

  // Redirect if not authenticated, render children if authenticated
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/auth/login" replace />
  );
};

export default PrivateRoute;

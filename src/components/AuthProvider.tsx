import { ReactNode } from "react";
import { useAuthPersistence } from "@/redux/auth-persistence";

/**
 * AuthProvider wraps the app and ensures auth data is restored from localStorage on mount.
 * This component must wrap the RouterProvider to work correctly.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // This hook restores auth state from localStorage on component mount
  useAuthPersistence();

  return <>{children}</>;
}

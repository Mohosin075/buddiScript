/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RootState } from "@/redux/store";
import Cookies from "js-cookie";

const getFromLocalStorage = (key: string) => {
  if (typeof window === "undefined") return undefined;
  try {
    return window.localStorage.getItem(key) ?? undefined;
  } catch {
    return undefined;
  }
};

export const getAuthToken = (state: RootState) => {
  // Priority 1: Get from Redux state
  const fromState = (state as any)?.auth?.token as string | undefined;
  if (fromState) {
    console.log("[getAuthToken] Token from Redux state:", fromState.slice(0, 20) + "...");
    return fromState;
  }

  // Priority 2: Get from cookies
  const fromCookie = Cookies.get("token") || Cookies.get("authToken");
  if (fromCookie) {
    console.log("[getAuthToken] Token from cookies:", fromCookie.slice(0, 20) + "...");
    return fromCookie;
  }

  // Priority 3: Get from localStorage (token key used by login flow)
  const fromLS = getFromLocalStorage("token");
  if (fromLS) {
    console.log("[getAuthToken] Token from localStorage (token):", fromLS.slice(0, 20) + "...");
    return fromLS;
  }

  // Priority 4: Fallback to authToken key
  const fromAuthTokenLS = getFromLocalStorage("authToken");
  if (fromAuthTokenLS) {
    console.log("[getAuthToken] Token from localStorage (authToken):", fromAuthTokenLS.slice(0, 20) + "...");
    return fromAuthTokenLS;
  }

  console.log("[getAuthToken] No token found!");
  return undefined;
};

export const asBearer = (token?: string) =>
  token?.startsWith("Bearer ") ? token : token ? `Bearer ${token}` : undefined;

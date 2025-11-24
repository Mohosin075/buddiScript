/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";

// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/redux/api/authApi";
import { setCredentials } from "@/redux/slices/authSlice";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import HelmetTitle from "@/components/layout/HelmetTitle";

import Cookies from "js-cookie";
import { BASE_URL } from "@/lib/Base_URL";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log({ email, password });

    // Proceed only if both email and password are filled
    if (!email || !password) return; // Return early if validation fails

    try {
      const result = await login({ email, password }).unwrap();

      console.log({ result });

      // Dispatch credentials to Redux store
      dispatch(
        setCredentials({
          user: result.data.user,
          token: result.data.accessToken,
        })
      );

      const userData = {
        id: result?.data?.id,
        email: result?.data.email,
        name: result?.data.name,
        contact: result?.data.contact,
        location: result?.data.location,
        role: result?.data.role,
        token: result?.data.accessToken,
      };

      console.log("User Data:", userData);

      // Store in localStorage for persistence
      Cookies.set("token", userData.token);
      Cookies.set("isAuthenticated", "true");

      localStorage.setItem("token", result?.data.accessToken);
      localStorage.setItem("userRole", result?.data.role);
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("isAuthenticated", "true");

      // Redirect based on role
      switch (result.data.role) {
        case "user":
          navigate("/");
          toast.success(`Welcome Back! ${result.data?.name}`);
          break;
        case "admin":
          navigate("/dashboard/admin");
          toast.success(`Welcome Back! ${result.data?.name}`);
          break;
        default:
          navigate("/");
      }
    } catch (error: any) {
      console.log(error);
      console.error("Login failed:", error?.data?.message || error.message);
      toast.error(error?.data?.message || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/auth/google`;
  };

  // const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    console.log("URL Params:", urlParams);

    const accessToken = urlParams.get("accessToken");
    const refreshToken = urlParams.get("refreshToken");
    const role = urlParams.get("role");

    console.log({ accessToken, refreshToken, role });

    if (accessToken && refreshToken && role) {
      // persist tokens
      Cookies.set("token", accessToken);
      Cookies.set("isAuthenticated", "true");

      localStorage.setItem("token", accessToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userRole", role);
      localStorage.setItem("isAuthenticated", "true");

      // Fetch the user profile from the API using the access token,
      // then populate redux state the same way `handleLogin` does.
      (async () => {
        try {
          const res = await fetch(`${BASE_URL}/user/profile`, {
            headers: {
              authorization: `Bearer ${accessToken}`,
              "content-type": "application/json",
            },
          });

          if (!res.ok) {
            console.error("Failed to fetch profile", await res.text());
          } else {
            const profile = await res.json(); // expected { data: { ...user } }

            // Dispatch credentials to redux in the same shape as handleLogin
            dispatch(
              setCredentials({
                user: profile as any,
                token: accessToken,
              })
            );

            // Normalize and store a lightweight userData object
            const u = profile?.data || {};
            const userData = {
              id: u.id || u._id || "",
              email: u.email,
              name: u.name,
              contact: u.contact,
              location: u.location,
              role: u.role || role,
              token: accessToken,
            };

            localStorage.setItem("userData", JSON.stringify(userData));

            toast.success("Google Login Successful!");
          }
        } catch (err) {
          console.error("Error fetching profile after Google login", err);
        } finally {
          // navigate and clean URL regardless of profile fetch success
          if (role === "admin") navigate("/dashboard/admin");
          else navigate("/");

          window.history.replaceState({}, document.title, "/");
        }
      })();
    }
  }, [navigate, dispatch]);

  // const demoCredentials = [
  //   { role: "user", email: "user@gmail.com", password: "demo1234" },
  //   { role: "agent", email: "agent@gmail.com", password: "demo1234" },
  //   { role: "admin", email: "admin@gmail.com", password: "demo1234" },
  // ];

  // const fillDemoCredentials = (demoRole: string) => {
  //   const creds = demoCredentials.find((c) => c.role === demoRole);
  //   if (creds) {
  //     setEmail(creds.email);
  //     setPassword(creds.password);
  //   }
  // };

  useEffect(() => {
    console.log("Checking authentication status...");
    if (
      localStorage.getItem("isAuthenticated") === "true" ||
      Cookies.get("isAuthenticated") === "true"
    ) {
      console.log("User is already authenticated, redirecting...");
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <HelmetTitle title="Login" />
      <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-center gap-5 md:gap-0">
        {/* Left Side - Image */}
        <div className="md:flex flex-1 max-w-3xl justify-center">
          <img
            src="/images/login.png"
            alt="Login Illustration"
            className="w-full h-auto max-w-md object-contain"
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 max-w-sm w-full">
          <Card className="w-full">
            <CardHeader className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <img src="/images/logo.svg" alt="logo" className="h-8" />
              </div>
              <CardDescription className="text-lg font-medium text-foreground">
                Welcome Back
              </CardDescription>
              <CardTitle className="text-2xl font-bold">
                Login to your account
              </CardTitle>
              <Button
                variant="outline"
                size="lg"
                className="w-full mt-2 gap-3"
                onClick={handleGoogleLogin}
              >
                <img
                  src="/images/google.svg"
                  alt="Google"
                  className="h-5 w-5"
                />
                <span>Sign in with Google</span>
              </Button>
            </CardHeader>

            <CardContent>
              <div className="my-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="text-gray-500 text-sm">OR</span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !email || !password}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <div className="text-center text-sm">
                <Link
                  to="/auth/forgot-password"
                  className="text-primary hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/auth/signup"
                  className="text-primary hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

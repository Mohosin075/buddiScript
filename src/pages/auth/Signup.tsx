/* eslint-disable @typescript-eslint/no-explicit-any */
import HelmetTitle from "@/components/layout/HelmetTitle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkEmailProvider } from "@/lib/checkEmailProvider";
import { useRegisterMutation } from "@/redux/api/authApi";
import { setCredentials } from "@/redux/slices/authSlice";
import Cookies from "js-cookie";
import { Eye, EyeOff } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useNavigate();
  const dispatch = useDispatch();
  const [registerUser] = useRegisterMutation();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const isValidTLD = checkEmailProvider(formData.email);

    console.log(isValidTLD);
    if (!isValidTLD) {
      setError(
        "Invalid email provider. For example, 'gmail.com', 'yahoo.com', 'outlook.com', 'protonmail.com', 'icloud.com', 'hotmail.com', 'aol.com', 'mail.com', 'yandex.com'"
      );
      toast.error("Invalid email domain. Please use a valid top-level domain.");
      return;
    }
    setIsLoading(true);

    try {
      const res = await registerUser({
        email: formData.email,
        password: formData.password,
        role: "USER", // Default role
        name: "",
        contact: "",
        location: "",
      }).unwrap();
      // Save credentials
      if (res?.success) {
        Cookies.set("email", res.data.email);
        router(`/auth/otp-verification/?redirect=login`);
        toast.success("Registration successful and OTP sent to your email");
        dispatch(setCredentials(res.data));

        setError("");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      localStorage.getItem("isAuthenticated") === "true" ||
      Cookies.get("isAuthenticated") === "true"
    ) {
      router("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <HelmetTitle title="Signup" />
      <div className="w-full max-w-9xl flex flex-col md:flex-row items-center justify-center gap-5 md:gap-0">
        {/* Left Side - Image */}
        <div className="md:flex flex-1 max-w-3xl justify-center">
          <img
            src="/images/registration1.png"
            alt="Signup Illustration"
            className="w-full object-contain"
          />
        </div>

        {/* Right Side - Signup Form */}
        <div className="flex-1 max-w-sm w-full">
          <Card className="w-full">
            <CardHeader className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <img src="/images/logo.svg" alt="logo" className="h-8" />
              </div>
              <CardDescription className="text-lg text-foreground">
                Get Started Now
              </CardDescription>
              <CardTitle className="text-2xl font-bold">Registration</CardTitle>
              <Button variant="outline" size="lg" className="w-full mt-2 gap-3">
                <img
                  src="/images/google.svg"
                  alt="Google"
                  className="h-5 w-5"
                />
                <span>Sign up with Google</span>
              </Button>
            </CardHeader>

            <CardContent>
              <div className="my-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="text-gray-500 text-sm">OR</span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>
              <form onSubmit={handleSignup} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className=""
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                    />
                    {error && (
                      <span className="text-red-500 text-xs">{error}</span>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className=""
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      required
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

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className=""
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <div className="text-center text-sm text-muted-foreground w-full">
                Already have an account?{" "}
                <Link to="/auth/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

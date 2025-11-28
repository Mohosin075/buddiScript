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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import { Eye, EyeOff, ArrowLeft, KeyRound, Mail } from "lucide-react";
import type React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import PageContainer from "@/components/shared/PageContainer";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [resetPassword] = useResetPasswordMutation();

  // Get email from URL parameters
  const userEmail = searchParams.get("email");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!userEmail) {
      toast.error(
        "Email not found. Please restart the password reset process."
      );
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    const token = localStorage.getItem("token") || undefined;

    try {
      // Call reset password API with the correct structure that backend expects
      const result = await resetPassword({
        email: userEmail,
        newPassword: formData.newPassword, // Changed from 'password' to 'newPassword'
        confirmPassword: formData.confirmPassword, // Add confirmPassword
        token: token, // Include token if needed
      }).unwrap();

      console.log({ result });

      toast.success(
        "Password reset successfully! You can now login with your new password."
      );

      // Redirect to login page after successful reset
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (error: any) {
      console.log({ error });
      if (error?.status === 400) {
        toast.error(
          error?.data?.message ||
            "Invalid password reset request. Please start over."
        );
        // navigate("/auth/otp-verification/?status=not-verified");
      }
      toast.error(
        error?.data?.message || "Failed to reset password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if user has a valid email for password reset
    if (!userEmail) {
      toast.error("Invalid password reset request. Please start over.");
      navigate("/auth/forgot-password");
      return;
    }

    // Redirect if already authenticated
    if (localStorage.getItem("isAuthenticated") === "true") {
      navigate("/");
    }
  }, [navigate, userEmail]);

  return (
    <PageContainer centered>
      <HelmetTitle title="Reset Password" />
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center">
          <img src="/images/logo.svg" alt="logo" className="h-8" />
        </div>

        {/* Reset Password Form */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-2">
              <KeyRound className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Reset Your Password</CardTitle>
            <CardDescription>
              Create a new password for your account.
            </CardDescription>
            {userEmail && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
                <Mail className="h-4 w-4" />
                <span>
                  Resetting password for:{" "}
                  <span className="font-medium">{userEmail}</span>
                </span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="pl-10 pr-10"
                    value={formData.newPassword}
                    onChange={(e) =>
                      handleInputChange("newPassword", e.target.value)
                    }
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters long
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm New Password
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="pl-10 pr-10"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
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
                disabled={
                  isLoading ||
                  !formData.newPassword ||
                  !formData.confirmPassword
                }
              >
                {isLoading ? "Resetting Password..." : "Reset Password"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-center text-sm text-muted-foreground w-full">
              <Link
                to="/auth/login"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to login
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Password Strength Tips */}
        <Card className="bg-muted/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Password Tips</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Use at least 8 characters</li>
              <li>• Include numbers and symbols</li>
              <li>• Avoid common words or phrases</li>
              <li>• Don't reuse old passwords</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

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
import { useVerifyOtpMutation } from "@/redux/api/authApi";
import Cookies from "js-cookie";
import { Key } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

export default function OtpPage() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userEmail = Cookies.get("email");

  console.log(userEmail);

  const queryParams = new URLSearchParams(location.search);

  // Get the value of the "redirect" parameter
  const redirect = queryParams.get("redirect");
  console.log(redirect);
  const [verifyOtp] = useVerifyOtpMutation();

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }

    try {
      setIsLoading(true);
      const result = await verifyOtp({
        email: userEmail as string,
        oneTimeCode: otp,
      }).unwrap();

      if (result.success) {
        toast.success("OTP verified successfully!");
        if (redirect === "login") {
          navigate("/auth/login");
        } else if (redirect === "reset-password") {
          // Pass email to change password page
          navigate(
            `/auth/reset-password?email=${encodeURIComponent(
              userEmail as string
            )}`
          );
        }
      } else {
        toast.error("Invalid OTP, please try again.");
      }
    } catch (error) {
      console.log({ error });
      toast.error("An error occurred during OTP verification.");
      console.error("OTP verification failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      localStorage.getItem("isAuthenticated") === "true" ||
      Cookies.get("isAuthenticated") === "true"
    ) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <HelmetTitle title="OTP Verification" />
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center">
          <img src="/images/logo.svg" alt="logo" className="h-8" />
        </div>

        {/* OTP Form */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Enter OTP</CardTitle>
            <CardDescription>
              We sent a One-Time Password (OTP) to your email address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <Label htmlFor="otp" className="mb-3">
                  One-Time Password (OTP)
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    className="pl-10"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !otp} // Button disabled if OTP is empty
              >
                {isLoading ? "Verifying OTP..." : "Verify OTP"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex-col space-y-4">
            <div className="text-center text-sm">
              <Link
                to="/auth/resend-otp"
                className="text-primary hover:underline"
              >
                Resend OTP
              </Link>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Having trouble?{" "}
              <Link to="/auth/support" className="text-primary hover:underline">
                Contact Support
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket, Sparkles, Loader2, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "שגיאה בהתחברות");
        setIsLoading(false);
        return;
      }

      // Wait a bit for cookie to be set
      await new Promise(resolve => setTimeout(resolve, 200));
      window.location.href = "/app/dashboard";
    } catch (err) {
      setError("שגיאה בהתחברות. נסה שנית.");
      setIsLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!email) {
      setError("הזן כתובת מייל");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "שגיאה בשליחת קוד");
        return;
      }

      setOtpSent(true);
      setError("");
    } catch (err) {
      setError("שגיאה בשליחת קוד. נסה שנית.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "קוד שגוי או פג תוקף");
        setIsLoading(false);
        return;
      }

      // Wait a bit for cookie to be set
      await new Promise(resolve => setTimeout(resolve, 200));

      // Check if user needs to set password OR requested password reset
      if (data.needsPassword || isResettingPassword) {
        const mode = isResettingPassword ? "reset" : "new";
        window.location.href = `/app/set-password?email=${encodeURIComponent(email)}&mode=${mode}`;
      } else {
        window.location.href = "/app/dashboard";
      }
    } catch (err) {
      setError("שגיאה בהתחברות. נסה שנית.");
      setIsLoading(false);
    }
  };

  const [activeTab, setActiveTab] = useState("password");

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      dir="rtl"
    >
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="relative">
              <Rocket className="h-8 w-8 text-primary" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 animate-pulse" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              PagePilot
            </span>
          </Link>
        </div>

        {/* Login Card */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">התחברות</CardTitle>
            <CardDescription>
              התחבר עם סיסמה או קבל קוד למייל
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="password" className="gap-2">
                  <Lock className="h-4 w-4" />
                  סיסמה
                </TabsTrigger>
                <TabsTrigger value="otp" className="gap-2">
                  <Mail className="h-4 w-4" />
                  קוד למייל
                </TabsTrigger>
              </TabsList>

              {/* Password Login */}
              <TabsContent value="password">
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-password">אימייל</Label>
                    <Input
                      id="email-password"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">סיסמה</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      dir="ltr"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        מתחבר...
                      </>
                    ) : (
                      "התחבר"
                    )}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("otp");
                        setIsResettingPassword(true);
                      }}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      שכחתי סיסמה
                    </button>
                  </div>
                </form>
              </TabsContent>

              {/* OTP Login */}
              <TabsContent value="otp">
                {!otpSent ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-otp">אימייל</Label>
                      <Input
                        id="email-otp"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        dir="ltr"
                      />
                    </div>

                    <Button
                      onClick={handleSendOTP}
                      className="w-full gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          שולח קוד...
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4" />
                          שלח קוד למייל
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleOTPLogin} className="space-y-4">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm text-green-700 dark:text-green-300 text-center">
                      קוד נשלח ל-{email}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="otp">קוד כניסה</Label>
                      <Input
                        id="otp"
                        placeholder="הזן את הקוד"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.toUpperCase())}
                        required
                        disabled={isLoading}
                        dir="ltr"
                        className="text-center text-lg font-mono tracking-wider"
                        maxLength={8}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          מתחבר...
                        </>
                      ) : (
                        "התחבר"
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-sm"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp("");
                      }}
                    >
                      שלח קוד מחדש
                    </Button>
                  </form>
                )}
              </TabsContent>
            </Tabs>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back to home */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            חזור לדף הבית
          </Link>
        </div>
      </div>
    </div>
  );
}

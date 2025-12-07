"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Rocket, Sparkles, Loader2, Lock, CheckCircle2 } from "lucide-react";

export default function SetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const mode = searchParams.get("mode");
  const isReset = mode === "reset";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push("/app/login");
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("הסיסמה חייבת להכיל לפחות 8 תווים");
      return;
    }

    const strength = calculateStrength(password);
    if (strength < 3) {
      setError("הסיסמה חלשה מדי. אנא בחר סיסמה חזקה יותר (שילוב של אותיות, מספרים ותווים מיוחדים)");
      return;
    }

    if (password !== confirmPassword) {
      setError("הסיסמאות לא תואמות");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "שגיאה בהגדרת סיסמה");
        return;
      }

      // Redirect to dashboard
      router.push("/app/dashboard");
      router.refresh();
    } catch (err) {
      setError("שגיאה בהגדרת סיסמה. נסה שנית.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950"
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

        {/* Set Password Card */}
        <Card className="border-blue-200 dark:border-blue-800 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-2">
              <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl">הגדר סיסמה</CardTitle>
            <CardDescription>
              {isReset ? "הגדר סיסמה חדשה לחשבון שלך" : "בחר סיסמה חזקה לחשבון שלך"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">
                      {isReset ? "אימות זהות הושלם בהצלחה" : "החשבון שלך נוצר בהצלחה!"}
                    </p>
                    <p className="text-xs mt-1">{email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">סיסמה חדשה</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="לפחות 8 תווים"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  dir="ltr"
                  minLength={8}
                />
                
                {/* Strength Meter */}
                {password.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex gap-1 h-1.5">
                      {[1, 2, 3, 4].map((level) => {
                        const strength = calculateStrength(password);
                        let color = "bg-slate-200 dark:bg-slate-700";
                        if (strength >= level) {
                          if (strength <= 1) color = "bg-red-500";
                          else if (strength === 2) color = "bg-orange-500";
                          else if (strength === 3) color = "bg-yellow-500";
                          else color = "bg-green-500";
                        }
                        return (
                          <div
                            key={level}
                            className={`flex-1 rounded-full transition-colors duration-300 ${color}`}
                          />
                        );
                      })}
                    </div>
                    <p className="text-xs text-right text-muted-foreground">
                      {getStrengthLabel(calculateStrength(password))}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">אימות סיסמה</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="הזן את הסיסמה שוב"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  dir="ltr"
                  minLength={6}
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    שומר...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    שמור סיסמה והמשך
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-400">
              <p className="font-medium mb-1">טיפים לסיסמה חזקה:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>לפחות 8 תווים</li>
                <li>שילוב של אותיות ומספרים</li>
                <li>תווים מיוחדים (@, #, $ וכו')</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper functions
function calculateStrength(password: string): number {
  let score = 0;
  if (!password) return 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1; // Uppercase
  if (/[^A-Za-z0-9]/.test(password)) score += 1; // Special char

  return Math.min(score, 4);
}

function getStrengthLabel(score: number): string {
  switch (score) {
    case 0:
    case 1:
      return "חלשה";
    case 2:
      return "בינונית";
    case 3:
      return "טובה";
    case 4:
      return "חזקה מאוד";
    default:
      return "";
  }
}

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
import { Rocket, Sparkles, Loader2, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    tenantSlug: "",
    tenantName: "",
    ownerEmail: "",
    ownerPassword: "",
    ownerName: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<{
    publicUrl: string;
    dashboardUrl: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "שגיאה בהרשמה");
        return;
      }

      // Show success message with URLs
      setSuccess({
        publicUrl: data.publicUrl,
        dashboardUrl: data.dashboardUrl,
      });

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push(data.dashboardUrl);
        router.refresh();
      }, 3000);
    } catch (err) {
      setError("שגיאה בהרשמה. נסה שנית.");
    } finally {
      setIsLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950"
        dir="rtl"
      >
        <Card className="w-full max-w-md border-green-200 dark:border-green-800">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl text-green-800 dark:text-green-200">
              החשבון נוצר בהצלחה! 🎉
            </CardTitle>
            <CardDescription className="text-base">
              מעביר אותך לדשבורד...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg space-y-2">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                הנתיבים שלך:
              </p>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="text-green-700 dark:text-green-300">דשבורד: </span>
                  <code className="bg-white dark:bg-slate-800 px-2 py-1 rounded text-xs">
                    {success.dashboardUrl}
                  </code>
                </div>
                <div>
                  <span className="text-green-700 dark:text-green-300">דף ציבורי: </span>
                  <code className="bg-white dark:bg-slate-800 px-2 py-1 rounded text-xs">
                    {success.publicUrl}
                  </code>
                </div>
              </div>
            </div>
            <Button
              onClick={() => router.push(success.dashboardUrl)}
              className="w-full"
            >
              עבור לדשבורד עכשיו
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

        {/* Register Card */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">הרשמה</CardTitle>
            <CardDescription>
              צור חשבון חדש ותתחיל לבנות דפי נחיתה
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tenantName">שם העסק</Label>
                <Input
                  id="tenantName"
                  placeholder="לדוגמה: Hermes Finance"
                  value={formData.tenantName}
                  onChange={(e) =>
                    setFormData({ ...formData, tenantName: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenantSlug">
                  כתובת ייחודית (slug)
                  <span className="text-xs text-muted-foreground mr-2">
                    יופיע ב-URL: /l/[slug]
                  </span>
                </Label>
                <Input
                  id="tenantSlug"
                  placeholder="hermesfinance"
                  value={formData.tenantSlug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tenantSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                    })
                  }
                  required
                  disabled={isLoading}
                  dir="ltr"
                  className="font-mono"
                />
                {formData.tenantSlug && (
                  <p className="text-xs text-muted-foreground">
                    הדף הציבורי שלך יהיה: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">/l/{formData.tenantSlug}</code>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerName">השם שלך</Label>
                <Input
                  id="ownerName"
                  placeholder="שם מלא"
                  value={formData.ownerName}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerName: e.target.value })
                  }
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerEmail">אימייל</Label>
                <Input
                  id="ownerEmail"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.ownerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerEmail: e.target.value })
                  }
                  required
                  disabled={isLoading}
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerPassword">סיסמה</Label>
                <Input
                  id="ownerPassword"
                  type="password"
                  placeholder="לפחות 6 תווים"
                  value={formData.ownerPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerPassword: e.target.value })
                  }
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
                    יוצר חשבון...
                  </>
                ) : (
                  "צור חשבון"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                כבר יש לך חשבון?{" "}
                <Link
                  href="/app/login"
                  className="text-primary hover:underline font-medium"
                >
                  התחבר כאן
                </Link>
              </p>
            </div>
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

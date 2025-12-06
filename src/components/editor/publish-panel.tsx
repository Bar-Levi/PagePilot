"use client";

import React, { useState, useMemo } from "react";
import { useEditorStore } from "@/hooks/use-editor-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Rocket,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Settings,
  BarChart3,
  Eye,
  FileSpreadsheet,
  Copy,
  Check,
} from "lucide-react";
import type { PageComponent, PageMissingDataAlert } from "@/components/landing-page/types";

// ============================================================================
// Missing Data Detection
// ============================================================================

function detectMissingData(pageJson: PageComponent): PageMissingDataAlert[] {
  const alerts: PageMissingDataAlert[] = [];

  function traverseComponent(component: PageComponent, path: string = "") {
    const componentPath = path ? `${path} > ${component.type}` : component.type;

    // Check for missing images
    if (component.props && "src" in component.props) {
      const src = (component.props as any).src;
      if (!src || src === "" || src.includes("placeholder") || src.includes("via.placeholder")) {
        alerts.push({
          sectionId: component.id,
          sectionType: component.type,
          field: "image",
          message: `תמונה חסרה ב-${component.type}`,
          severity: "warning",
        });
      }
    }

    // Check for missing hero content
    if (component.type === "Hero" || component.type === "Container") {
      const props = component.props as any;
      if (props?.style?.background?.includes("gradient") || props?.style?.padding?.includes("96px")) {
        // Likely a hero section - check for content
        const hasHeading = component.children?.some(
          (c) => c.type === "RichText" || c.type === "Heading"
        );
        if (!hasHeading) {
          alerts.push({
            sectionId: component.id,
            sectionType: "Hero",
            field: "headline",
            message: "כותרת ראשית חסרה",
            severity: "critical",
          });
        }
      }
    }

    // Check for empty testimonials
    if (component.type === "TestimonialsGrid" || component.type === "Testimonials") {
      const props = component.props as any;
      if (!props?.testimonials || props.testimonials.length === 0) {
        alerts.push({
          sectionId: component.id,
          sectionType: component.type,
          field: "testimonials",
          message: "אין המלצות להצגה",
          severity: "warning",
        });
      }
    }

    // Check for empty FAQ
    if (component.type === "FAQAccordion" || component.type === "FAQ") {
      const props = component.props as any;
      if (!props?.items && !props?.questions || 
          (props?.items?.length === 0) || 
          (props?.questions?.length === 0)) {
        alerts.push({
          sectionId: component.id,
          sectionType: component.type,
          field: "faqItems",
          message: "אין שאלות נפוצות להצגה",
          severity: "warning",
        });
      }
    }

    // Check for missing CTA button
    if (component.type === "Button") {
      const props = component.props as any;
      if (!props?.text || props.text.trim() === "") {
        alerts.push({
          sectionId: component.id,
          sectionType: "CTA",
          field: "buttonText",
          message: "טקסט כפתור חסר",
          severity: "critical",
        });
      }
      if (!props?.href || props.href === "#") {
        alerts.push({
          sectionId: component.id,
          sectionType: "CTA",
          field: "buttonLink",
          message: "קישור כפתור לא הוגדר",
          severity: "warning",
        });
      }
    }

    // Traverse children
    if (component.children) {
      component.children.forEach((child) => traverseComponent(child, componentPath));
    }
  }

  traverseComponent(pageJson);
  return alerts;
}

// ============================================================================
// Publish Panel Component
// ============================================================================

export function PublishPanel() {
  const { pageJson, selectedId, select } = useEditorStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showBlockedDialog, setShowBlockedDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Integration settings (mock for now)
  const [integrations, setIntegrations] = useState({
    googleAnalytics: "",
    microsoftClarity: "",
    sheetsWebhook: "",
  });

  // Detect missing data
  const missingDataAlerts = useMemo(() => {
    return detectMissingData(pageJson as PageComponent);
  }, [pageJson]);

  const criticalAlerts = missingDataAlerts.filter((a) => a.severity === "critical");
  const warningAlerts = missingDataAlerts.filter((a) => a.severity === "warning");
  const canPublish = criticalAlerts.length === 0;

  // Mock published URL
  const mockPublishedUrl = "https://your-page.pagepilot.app/abc123";

  const handlePublish = () => {
    if (!canPublish) {
      setShowBlockedDialog(true);
      return;
    }
    // Mock publish success
    setShowSuccessDialog(true);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(mockPublishedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoToSection = (sectionId: string) => {
    select(sectionId);
    setIsOpen(false);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="sm"
            className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          >
            <Rocket className="h-4 w-4" />
            פרסם
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]" dir="rtl">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-right">
              <Rocket className="h-5 w-5 text-emerald-500" />
              פרסום דף הנחיתה
            </SheetTitle>
            <SheetDescription className="text-right">
              בדוק את הדף שלך ופרסם אותו בלחיצה אחת
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-220px)] mt-6 pr-4">
            {/* Status Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                סטטוס הדף
              </h3>
              
              {missingDataAlerts.length === 0 ? (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="font-medium text-emerald-700 dark:text-emerald-400">
                      הדף מוכן לפרסום!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      כל התוכן קיים ותקין
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Critical Alerts */}
                  {criticalAlerts.length > 0 && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <span className="font-medium text-red-700 dark:text-red-400">
                          חסרים פריטים קריטיים ({criticalAlerts.length})
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        יש להשלים את הפריטים הבאים לפני הפרסום:
                      </p>
                      <ul className="space-y-2">
                        {criticalAlerts.map((alert, idx) => (
                          <li
                            key={idx}
                            className="flex items-center justify-between p-2 rounded bg-background/50 hover:bg-background transition-colors cursor-pointer"
                            onClick={() => handleGoToSection(alert.sectionId)}
                          >
                            <span className="text-sm">{alert.message}</span>
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              עבור לסקשן
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Warning Alerts */}
                  {warningAlerts.length > 0 && (
                    <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <span className="font-medium text-amber-700 dark:text-amber-400">
                          אזהרות ({warningAlerts.length})
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        מומלץ לתקן לפני הפרסום, אך אפשר להמשיך:
                      </p>
                      <ul className="space-y-2">
                        {warningAlerts.map((alert, idx) => (
                          <li
                            key={idx}
                            className="flex items-center justify-between p-2 rounded bg-background/50 hover:bg-background transition-colors cursor-pointer"
                            onClick={() => handleGoToSection(alert.sectionId)}
                          >
                            <span className="text-sm">{alert.message}</span>
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              עבור לסקשן
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* Integrations Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                אינטגרציות
              </h3>
              
              <div className="space-y-4">
                {/* Google Analytics */}
                <div className="space-y-2">
                  <Label htmlFor="ga-id" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-500" />
                    Google Analytics 4
                  </Label>
                  <Input
                    id="ga-id"
                    placeholder="G-XXXXXXXXXX"
                    value={integrations.googleAnalytics}
                    onChange={(e) =>
                      setIntegrations((prev) => ({
                        ...prev,
                        googleAnalytics: e.target.value,
                      }))
                    }
                    className="text-left"
                    dir="ltr"
                  />
                </div>

                {/* Microsoft Clarity */}
                <div className="space-y-2">
                  <Label htmlFor="clarity-id" className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-purple-500" />
                    Microsoft Clarity
                  </Label>
                  <Input
                    id="clarity-id"
                    placeholder="Project ID"
                    value={integrations.microsoftClarity}
                    onChange={(e) =>
                      setIntegrations((prev) => ({
                        ...prev,
                        microsoftClarity: e.target.value,
                      }))
                    }
                    className="text-left"
                    dir="ltr"
                  />
                </div>

                {/* Google Sheets Webhook */}
                <div className="space-y-2">
                  <Label htmlFor="sheets-webhook" className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-green-500" />
                    Google Sheets Webhook
                  </Label>
                  <Input
                    id="sheets-webhook"
                    placeholder="https://script.google.com/..."
                    value={integrations.sheetsWebhook}
                    onChange={(e) =>
                      setIntegrations((prev) => ({
                        ...prev,
                        sheetsWebhook: e.target.value,
                      }))
                    }
                    className="text-left"
                    dir="ltr"
                  />
                  <p className="text-xs text-muted-foreground">
                    נתוני הטפסים בדף יישלחו אוטומטית לגיליון
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>

          <SheetFooter className="mt-4">
            <Button
              onClick={handlePublish}
              className={`w-full gap-2 ${
                canPublish
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!canPublish}
            >
              <Rocket className="h-4 w-4" />
              {canPublish ? "פרסם עכשיו" : "השלם פריטים חסרים"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Blocked Dialog */}
      <AlertDialog open={showBlockedDialog} onOpenChange={setShowBlockedDialog}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-right">
              <AlertCircle className="h-5 w-5 text-red-500" />
              לא ניתן לפרסם
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              יש להשלים את כל הפריטים הקריטיים לפני שניתן לפרסם את הדף.
              <br />
              <br />
              נמצאו {criticalAlerts.length} פריטים קריטיים שחסרים.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogAction onClick={() => setShowBlockedDialog(false)}>
              הבנתי
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-right">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              הדף פורסם בהצלחה! 🎉
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right space-y-4">
              <p>דף הנחיתה שלך זמין כעת בכתובת:</p>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                <Input
                  value={mockPublishedUrl}
                  readOnly
                  className="text-left text-sm"
                  dir="ltr"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyUrl}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                * זוהי סימולציה - בגרסה המלאה הדף יפורסם לענן
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogAction
              onClick={() => setShowSuccessDialog(false)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500"
            >
              סגור
            </AlertDialogAction>
            <AlertDialogCancel asChild>
              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                פתח בחלון חדש
              </Button>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

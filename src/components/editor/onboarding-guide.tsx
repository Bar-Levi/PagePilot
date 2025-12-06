"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  MousePointer, 
  GripVertical, 
  Rocket,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface OnboardingStep {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    icon: <MousePointer className="w-6 h-6" />,
    title: "בחר סקשן לעריכה",
    description: "לחץ על סקשן בסיידבר השמאלי או ישירות על הדף כדי לבחור ולערוך אותו",
  },
  {
    icon: <GripVertical className="w-6 h-6" />,
    title: "גרור לשינוי סדר",
    description: "החזק וגרור את הידית ליד כל סקשן כדי לשנות את הסדר בדף",
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "פרסם בלחיצה",
    description: "כשהדף מוכן, לחץ על כפתור הפרסום הירוק כדי להעלות אותו לאוויר",
  },
];

// ============================================================================
// Onboarding Guide Component
// ============================================================================

const ONBOARDING_KEY = "pagepilot_onboarding_completed";

export function OnboardingGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompleted = localStorage.getItem(ONBOARDING_KEY);
    if (!hasCompleted) {
      // Wait a bit before showing the guide
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-center">
            ברוכים הבאים ל-PagePilot! 🚀
          </DialogTitle>
          <DialogDescription className="text-center">
            הנה מדריך קצר שיעזור לך להתחיל
          </DialogDescription>
        </DialogHeader>

        {/* Steps Progress */}
        <div className="flex justify-center gap-2 py-2">
          {onboardingSteps.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                idx === currentStep
                  ? "w-8 bg-blue-500"
                  : idx < currentStep
                    ? "bg-blue-500"
                    : "bg-slate-200 dark:bg-slate-700"
              )}
            />
          ))}
        </div>

        {/* Current Step */}
        <div className="py-8 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
            {currentStepData.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {currentStep + 1}. {currentStepData.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {currentStepData.description}
            </p>
          </div>
        </div>

        <DialogFooter className="flex-row-reverse sm:justify-between gap-2">
          <Button onClick={handleNext} className="gap-2">
            {currentStep < onboardingSteps.length - 1 ? (
              <>
                הבא
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              "התחל לעבוד!"
            )}
          </Button>
          <Button variant="ghost" onClick={handleSkip}>
            דלג
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Onboarding Reset Button (for testing)
// ============================================================================

export function ResetOnboardingButton() {
  const handleReset = () => {
    localStorage.removeItem(ONBOARDING_KEY);
    window.location.reload();
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleReset}>
      הצג מדריך שוב
    </Button>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, Sparkles, Brain, Layout, PenTool, Palette, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface GenerationStep {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const steps: GenerationStep[] = [
  {
    id: "strategy",
    name: "סוכן אסטרטגיה",
    description: "מגדיר את האסטרטגיה וההבטחה העיקרית",
    icon: <Brain className="w-5 h-5" />,
  },
  {
    id: "structure",
    name: "סוכן מבנה",
    description: "מתכנן את מבנה הדף והסקשנים",
    icon: <Layout className="w-5 h-5" />,
  },
  {
    id: "rag",
    name: "איסוף הקשר",
    description: "מעבד את המסמכים והמידע העסקי",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    id: "copy",
    name: "סוכן תוכן",
    description: "כותב את כל הטקסטים בהתבסס על המסמכים",
    icon: <PenTool className="w-5 h-5" />,
  },
  {
    id: "design",
    name: "סוכן עיצוב",
    description: "מתכנן את העיצוב והפריסה",
    icon: <Palette className="w-5 h-5" />,
  },
  {
    id: "analytics",
    name: "סוכן אנליטיקס",
    description: "מגדיר אירועי מעקב מומלצים",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    id: "build",
    name: "בניית הדף",
    description: "מרכיב את כל הרכיבים לדף מושלם",
    icon: <CheckCircle2 className="w-5 h-5" />,
  },
];

export function GenerationProgress() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Reset on mount
    setCurrentStepIndex(0);
    setCompletedSteps(new Set());

    // Simulate progress by moving through steps
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          // Mark current step as completed
          setCompletedSteps((prevCompleted) => {
            const newCompleted = new Set(prevCompleted);
            newCompleted.add(steps[prev].id);
            return newCompleted;
          });
          return prev + 1;
        }
        // If we're at the last step, mark it as completed
        if (prev === steps.length - 1) {
          setCompletedSteps((prevCompleted) => {
            const newCompleted = new Set(prevCompleted);
            newCompleted.add(steps[prev].id);
            return newCompleted;
          });
        }
        return prev;
      });
    }, 4000); // Move to next step every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  const currentStep = steps[currentStepIndex];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" dir="rtl">
      <div className="w-full max-w-2xl mx-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 mb-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            הסוכנים עובדים על הדף שלך
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            זה עשוי לקחת כמה רגעים...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2" dir="rtl">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {currentStep.name}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center" dir="rtl">
            {currentStep.description}
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-3" dir="rtl">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(step.id);
            const isCurrent = index === currentStepIndex;
            const isPending = index > currentStepIndex;

            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-lg transition-all duration-300",
                  isCurrent && "bg-primary/10 border-2 border-primary",
                  isCompleted && "bg-green-50 dark:bg-green-900/20",
                  isPending && "bg-slate-50 dark:bg-slate-700/50 opacity-60"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 flex-shrink-0",
                    isCompleted && "bg-green-500 text-white",
                    isCurrent && "bg-primary text-white animate-pulse",
                    isPending && "bg-slate-200 dark:bg-slate-600 text-slate-400"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="flex-1 text-right">
                  <div
                    className={cn(
                      "font-medium",
                      isCompleted && "text-green-700 dark:text-green-400",
                      isCurrent && "text-primary",
                      isPending && "text-slate-400"
                    )}
                  >
                    {step.name}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {step.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Animated dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}


"use client";

import { useEffect, useState } from "react";
import { 
  CheckCircle2, 
  Sparkles, 
  Brain, 
  Layout, 
  PenTool, 
  Palette, 
  BarChart3,
  Lightbulb,
  Rocket,
  Zap,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GenerationStep {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const steps: GenerationStep[] = [
  { id: "strategy", name: "אסטרטגיה", description: "מגדיר את ההבטחה העיקרית", icon: <Brain className="w-5 h-5" /> },
  { id: "structure", name: "מבנה", description: "מתכנן את הסקשנים", icon: <Layout className="w-5 h-5" /> },
  { id: "rag", name: "הקשר", description: "מעבד את המידע", icon: <Sparkles className="w-5 h-5" /> },
  { id: "copy", name: "תוכן", description: "כותב טקסטים", icon: <PenTool className="w-5 h-5" /> },
  { id: "design", name: "עיצוב", description: "מעצב את הדף", icon: <Palette className="w-5 h-5" /> },
  { id: "analytics", name: "אנליטיקס", description: "מגדיר מעקב", icon: <BarChart3 className="w-5 h-5" /> },
  { id: "build", name: "בנייה", description: "מרכיב הכל", icon: <CheckCircle2 className="w-5 h-5" /> },
];

const tips = [
  "דפי נחיתה עם כותרת ברורה ממירים 80% יותר",
  "CTA בצבע בולט מגדיל המרות ב-32%",
  "המלצות של לקוחות מעלות אמון ב-72%",
  "טופס עם פחות מ-3 שדות ממיר פי 2",
  "רוב הגולשים מחליטים תוך 8 שניות",
];

export function GenerationProgress() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    setCurrentStepIndex(0);
    setCompletedSteps(new Set());

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          setCompletedSteps((prevCompleted) => new Set([...prevCompleted, steps[prev].id]));
          return prev + 1;
        }
        if (prev === steps.length - 1) {
          setCompletedSteps((prevCompleted) => new Set([...prevCompleted, steps[prev].id]));
        }
        return prev;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 4000);
    return () => clearInterval(tipInterval);
  }, []);

  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  const currentStep = steps[currentStepIndex];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900" dir="rtl">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-spin-fast {
          animation: spin-slow 1s linear infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}} />
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* Main content */}
      <div className="relative w-full max-w-2xl mx-4">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
          
          {/* Header with spinner */}
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6 bg-indigo-500/10 rounded-full ring-4 ring-indigo-500/20">
              <Loader2 className="w-24 h-24 text-indigo-500 animate-spin-slow absolute opacity-50" />
              <Rocket className="w-10 h-10 text-indigo-400 z-10" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">
              בונים את הדף שלך
            </h2>
            <p className="text-slate-400 animate-pulse">
              {currentStep.description}...
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-white">{currentStep.name}</span>
              <span className="text-sm font-bold text-indigo-400">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 w-full h-full animate-shimmer" />
              </div>
            </div>
          </div>

          {/* Steps timeline */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.has(step.id);
              const isCurrent = index === currentStepIndex;
              const isPending = index > currentStepIndex;

              return (
                <div key={step.id} className="flex flex-col items-center relative">
                  {/* Connection line */}
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "absolute top-5 -left-[50%] w-full h-0.5 -z-10",
                      index < currentStepIndex ? "bg-indigo-500" : "bg-slate-700"
                    )} />
                  )}
                  
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                    isCompleted && "bg-indigo-500 text-white",
                    isCurrent && "bg-indigo-500/20 text-indigo-400 ring-2 ring-indigo-500",
                    isPending && "bg-slate-700 text-slate-500"
                  )}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 animate-spin-fast text-indigo-400" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span className={cn(
                    "text-xs mt-2 font-medium",
                    isCompleted && "text-indigo-400",
                    isCurrent && "text-white",
                    isPending && "text-slate-500"
                  )}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Tip */}
          <div className="bg-slate-700/50 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-amber-400 font-medium mb-1">הידעת?</p>
              <p className="text-sm text-slate-300">{tips[currentTip]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

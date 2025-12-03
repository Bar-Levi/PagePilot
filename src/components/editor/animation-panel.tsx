"use client";

import React, { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Sparkles, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AnimationConfig,
  AnimationType,
  AnimationTrigger,
  animationPresets,
  easingOptions,
  getAnimationCSS,
  getInitialStyles,
  animationKeyframes,
  defaultAnimationConfig,
} from "@/lib/animations";

type AnimationPanelProps = {
  config: AnimationConfig;
  onChange: (config: AnimationConfig) => void;
};

export function AnimationPanel({ config, onChange }: AnimationPanelProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const currentConfig = { ...defaultAnimationConfig, ...config };

  const handleChange = (key: keyof AnimationConfig, value: any) => {
    onChange({ ...currentConfig, [key]: value });
  };

  // Play animation preview
  const playPreview = () => {
    if (!previewRef.current || currentConfig.type === "none") return;

    setIsPlaying(true);
    const element = previewRef.current;

    // Reset
    element.style.animation = "none";
    element.offsetHeight; // Trigger reflow

    // Apply animation
    element.style.animation = getAnimationCSS(currentConfig);

    // Reset after animation
    setTimeout(() => {
      setIsPlaying(false);
    }, (currentConfig.duration || 600) + (currentConfig.delay || 0) + 100);
  };

  // Inject keyframes
  useEffect(() => {
    if (currentConfig.type === "none") return;

    const styleId = `animation-keyframes-${currentConfig.type}`;
    let styleEl = document.getElementById(styleId);

    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      styleEl.textContent = animationKeyframes[currentConfig.type];
      document.head.appendChild(styleEl);
    }
  }, [currentConfig.type]);

  return (
    <div className="space-y-4">
      {/* Animation Type */}
      <div className="space-y-2">
        <Label className="text-xs font-medium flex items-center gap-2">
          <Sparkles className="w-3 h-3" />
          סוג אנימציה
        </Label>
        <div className="grid grid-cols-4 gap-1">
          {animationPresets.slice(0, 8).map((preset) => (
            <button
              key={preset.type}
              className={cn(
                "p-2 text-center rounded border transition-colors",
                currentConfig.type === preset.type
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                  : "border-slate-200 dark:border-slate-700 hover:border-blue-300"
              )}
              onClick={() => handleChange("type", preset.type)}
              title={preset.labelHe}
            >
              <span className="text-lg">{preset.preview}</span>
              <span className="block text-[10px] text-slate-500 truncate">
                {preset.labelHe}
              </span>
            </button>
          ))}
        </div>

        <Select
          value={currentConfig.type}
          onValueChange={(v) => handleChange("type", v as AnimationType)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="בחר אנימציה" />
          </SelectTrigger>
          <SelectContent>
            {animationPresets.map((preset) => (
              <SelectItem key={preset.type} value={preset.type}>
                <span className="flex items-center gap-2">
                  <span>{preset.preview}</span>
                  <span>{preset.labelHe}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">תצוגה מקדימה</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={playPreview}
            disabled={currentConfig.type === "none" || isPlaying}
          >
            <Play className="w-3 h-3 mr-1" />
            הפעל
          </Button>
        </div>
        <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
          <div
            ref={previewRef}
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg flex items-center justify-center"
            style={
              currentConfig.type !== "none" && !isPlaying
                ? getInitialStyles(currentConfig)
                : {}
            }
          >
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Trigger */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">טריגר</Label>
        <Select
          value={currentConfig.trigger}
          onValueChange={(v) => handleChange("trigger", v as AnimationTrigger)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="onLoad">בטעינה</SelectItem>
            <SelectItem value="onScroll">בגלילה (נכנס לתצוגה)</SelectItem>
            <SelectItem value="onHover">בריחוף</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-xs font-medium">משך</Label>
          <span className="text-xs text-slate-500">
            {currentConfig.duration}ms
          </span>
        </div>
        <Slider
          value={[currentConfig.duration || 600]}
          onValueChange={(v) => handleChange("duration", v[0])}
          min={100}
          max={2000}
          step={50}
        />
      </div>

      {/* Delay */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-xs font-medium">השהייה</Label>
          <span className="text-xs text-slate-500">
            {currentConfig.delay}ms
          </span>
        </div>
        <Slider
          value={[currentConfig.delay || 0]}
          onValueChange={(v) => handleChange("delay", v[0])}
          min={0}
          max={2000}
          step={50}
        />
      </div>

      {/* Easing */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">עקומת מהירות</Label>
        <Select
          value={currentConfig.easing}
          onValueChange={(v) => handleChange("easing", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {easingOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Scroll Threshold (only for onScroll trigger) */}
      {currentConfig.trigger === "onScroll" && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-xs font-medium">סף גלילה</Label>
            <span className="text-xs text-slate-500">
              {Math.round((currentConfig.threshold || 0.2) * 100)}%
            </span>
          </div>
          <Slider
            value={[(currentConfig.threshold || 0.2) * 100]}
            onValueChange={(v) => handleChange("threshold", v[0] / 100)}
            min={0}
            max={100}
            step={5}
          />
          <p className="text-xs text-slate-500">
            כמה אחוז מהרכיב צריך להיות גלוי כדי להפעיל את האנימציה
          </p>
        </div>
      )}

      {/* Repeat */}
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">חזרה אינסופית</Label>
        <Switch
          checked={currentConfig.repeat || false}
          onCheckedChange={(v) => handleChange("repeat", v)}
        />
      </div>

      {/* Reset Button */}
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => onChange(defaultAnimationConfig)}
      >
        <RotateCcw className="w-3 h-3 mr-2" />
        אפס אנימציה
      </Button>
    </div>
  );
}


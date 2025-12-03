"use client";

import React, { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  ArrowUpRight,
  ArrowUpLeft,
  ArrowDownRight,
  ArrowDownLeft,
  RotateCcw,
  Check
} from "lucide-react";

type ColorPickerProps = {
  value: string;
  onChange: (value: string) => void;
  showGradient?: boolean;
  showOpacity?: boolean;
};

// ============================================================================
// Color Palettes - תבניות צבעים מוכנות
// ============================================================================

const colorPalettes = {
  basic: {
    name: "בסיסי",
    colors: [
      "#000000", "#1a1a1a", "#333333", "#4d4d4d", "#666666", "#808080",
      "#999999", "#b3b3b3", "#cccccc", "#e6e6e6", "#f2f2f2", "#ffffff",
    ],
  },
  vibrant: {
    name: "חי",
    colors: [
      "#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6", "#06b6d4",
      "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899",
    ],
  },
  pastel: {
    name: "פסטל",
    colors: [
      "#fecaca", "#fed7aa", "#fef08a", "#bbf7d0", "#99f6e4", "#a5f3fc",
      "#bfdbfe", "#c7d2fe", "#ddd6fe", "#e9d5ff", "#f5d0fe", "#fbcfe8",
    ],
  },
  dark: {
    name: "כהה",
    colors: [
      "#7f1d1d", "#7c2d12", "#713f12", "#14532d", "#134e4a", "#164e63",
      "#1e3a8a", "#312e81", "#4c1d95", "#581c87", "#701a75", "#831843",
    ],
  },
  nature: {
    name: "טבע",
    colors: [
      "#84cc16", "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9",
      "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#f43f5e",
    ],
  },
  business: {
    name: "עסקי",
    colors: [
      "#0f172a", "#1e293b", "#334155", "#475569", "#64748b", "#94a3b8",
      "#1e40af", "#1d4ed8", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd",
    ],
  },
};

// ============================================================================
// Gradient Directions - כיווני גרדיאנט
// ============================================================================

type GradientDirection = {
  label: string;
  value: number;
  icon: React.ReactNode;
};

const gradientDirections: GradientDirection[] = [
  { label: "למעלה", value: 0, icon: <ArrowUp className="w-4 h-4" /> },
  { label: "למעלה ימינה", value: 45, icon: <ArrowUpRight className="w-4 h-4" /> },
  { label: "ימינה", value: 90, icon: <ArrowRight className="w-4 h-4" /> },
  { label: "למטה ימינה", value: 135, icon: <ArrowDownRight className="w-4 h-4" /> },
  { label: "למטה", value: 180, icon: <ArrowDown className="w-4 h-4" /> },
  { label: "למטה שמאלה", value: 225, icon: <ArrowDownLeft className="w-4 h-4" /> },
  { label: "שמאלה", value: 270, icon: <ArrowLeft className="w-4 h-4" /> },
  { label: "למעלה שמאלה", value: 315, icon: <ArrowUpLeft className="w-4 h-4" /> },
];

// ============================================================================
// Gradient Presets - תבניות גרדיאנט מוכנות
// ============================================================================

const gradientPresets = [
  { name: "שקיעה", start: "#f97316", end: "#ec4899", angle: 135 },
  { name: "אוקיינוס", start: "#06b6d4", end: "#3b82f6", angle: 135 },
  { name: "יער", start: "#22c55e", end: "#14b8a6", angle: 135 },
  { name: "סגול", start: "#8b5cf6", end: "#ec4899", angle: 135 },
  { name: "לילה", start: "#1e3a8a", end: "#581c87", angle: 135 },
  { name: "זהב", start: "#eab308", end: "#f97316", angle: 135 },
  { name: "ורוד", start: "#f472b6", end: "#c084fc", angle: 135 },
  { name: "ים", start: "#0ea5e9", end: "#22d3ee", angle: 135 },
];

// ============================================================================
// Main Component
// ============================================================================

export function ColorPicker({
  value,
  onChange,
  showGradient = true,
  showOpacity = true,
}: ColorPickerProps) {
  // Parse initial value
  const isGradient = value?.includes("gradient");
  
  const [tab, setTab] = useState<"solid" | "gradient">(isGradient ? "gradient" : "solid");
  const [selectedPalette, setSelectedPalette] = useState<keyof typeof colorPalettes>("vibrant");
  const [selectedColor, setSelectedColor] = useState(isGradient ? "#3b82f6" : (value || "#3b82f6"));
  const [opacity, setOpacity] = useState(100);
  
  // Gradient state
  const [gradientStart, setGradientStart] = useState("#667eea");
  const [gradientEnd, setGradientEnd] = useState("#764ba2");
  const [gradientAngle, setGradientAngle] = useState(135);

  // Parse existing gradient value
  useEffect(() => {
    if (value?.includes("linear-gradient")) {
      const match = value.match(/linear-gradient\((\d+)deg,\s*([^,]+),\s*([^)]+)\)/);
      if (match) {
        setGradientAngle(parseInt(match[1]));
        setGradientStart(match[2].trim().split(" ")[0]);
        setGradientEnd(match[3].trim().split(" ")[0]);
      }
    } else if (value && !value.includes("gradient")) {
      setSelectedColor(value);
    }
  }, [value]);

  // Generate gradient string
  const gradientValue = useMemo(() => {
    return `linear-gradient(${gradientAngle}deg, ${gradientStart} 0%, ${gradientEnd} 100%)`;
  }, [gradientStart, gradientEnd, gradientAngle]);

  // Handle solid color selection
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    const finalColor = showOpacity && opacity < 100 ? hexToRgba(color, opacity) : color;
    onChange(finalColor);
  };

  // Handle opacity change
  const handleOpacityChange = (value: number[]) => {
    setOpacity(value[0]);
    const finalColor = value[0] < 100 ? hexToRgba(selectedColor, value[0]) : selectedColor;
    onChange(finalColor);
  };

  // Handle gradient apply
  const handleApplyGradient = () => {
    onChange(gradientValue);
  };

  // Handle gradient preset selection
  const handleGradientPreset = (preset: typeof gradientPresets[0]) => {
    setGradientStart(preset.start);
    setGradientEnd(preset.end);
    setGradientAngle(preset.angle);
    onChange(`linear-gradient(${preset.angle}deg, ${preset.start} 0%, ${preset.end} 100%)`);
  };

  // Handle direction change
  const handleDirectionChange = (angle: number) => {
    setGradientAngle(angle);
    onChange(`linear-gradient(${angle}deg, ${gradientStart} 0%, ${gradientEnd} 100%)`);
  };

  // Parse hex to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 h-9"
        >
          <div
            className="w-5 h-5 rounded border border-slate-300 shadow-sm"
            style={{ background: value || "#ffffff" }}
          />
          <span className="truncate text-xs">
            {isGradient ? "גרדיאנט" : (value || "בחר צבע")}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Tabs value={tab} onValueChange={(v) => setTab(v as "solid" | "gradient")}>
          <TabsList className="grid w-full grid-cols-2 rounded-none border-b">
            <TabsTrigger value="solid" className="rounded-none">צבע אחיד</TabsTrigger>
            {showGradient && <TabsTrigger value="gradient" className="rounded-none">גרדיאנט</TabsTrigger>}
          </TabsList>

          {/* ============================================ */}
          {/* Solid Color Tab */}
          {/* ============================================ */}
          <TabsContent value="solid" className="p-3 space-y-4">
            {/* Color Preview */}
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg border border-slate-300 shadow-inner"
                style={{ backgroundColor: selectedColor }}
              />
              <div className="flex-1">
                <Label className="text-xs text-slate-500">צבע נבחר</Label>
                <p className="font-mono text-sm">{selectedColor}</p>
              </div>
              {selectedColor === value && (
                <Check className="w-5 h-5 text-green-500" />
              )}
            </div>

            {/* Palette Selector */}
            <div className="space-y-2">
              <Label className="text-xs">תבנית צבעים</Label>
              <div className="flex flex-wrap gap-1">
                {Object.entries(colorPalettes).map(([key, palette]) => (
                  <Button
                    key={key}
                    variant={selectedPalette === key ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs px-2"
                    onClick={() => setSelectedPalette(key as keyof typeof colorPalettes)}
                  >
                    {palette.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Grid */}
            <div className="space-y-2">
              <Label className="text-xs">בחר צבע</Label>
              <div className="grid grid-cols-6 gap-1.5">
                {colorPalettes[selectedPalette].colors.map((color) => (
                  <button
                    key={color}
                    className={cn(
                      "w-9 h-9 rounded-lg border-2 transition-all hover:scale-110",
                      selectedColor === color 
                        ? "border-blue-500 ring-2 ring-blue-200" 
                        : "border-transparent hover:border-slate-300"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Opacity */}
            {showOpacity && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs">שקיפות</Label>
                  <span className="text-xs text-slate-500">{opacity}%</span>
                </div>
                <Slider
                  value={[opacity]}
                  onValueChange={handleOpacityChange}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
            )}

            {/* Reset Button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => onChange("")}
            >
              <RotateCcw className="w-3 h-3 mr-2" />
              איפוס
            </Button>
          </TabsContent>

          {/* ============================================ */}
          {/* Gradient Tab */}
          {/* ============================================ */}
          {showGradient && (
            <TabsContent value="gradient" className="p-3 space-y-4">
              {/* Gradient Preview */}
              <div
                className="w-full h-20 rounded-lg border border-slate-300 shadow-inner"
                style={{ background: gradientValue }}
              />

              {/* Gradient Presets */}
              <div className="space-y-2">
                <Label className="text-xs">תבניות גרדיאנט</Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {gradientPresets.map((preset) => (
                    <button
                      key={preset.name}
                      className={cn(
                        "h-10 rounded-lg border-2 transition-all hover:scale-105",
                        gradientStart === preset.start && gradientEnd === preset.end
                          ? "border-blue-500"
                          : "border-transparent"
                      )}
                      style={{
                        background: `linear-gradient(${preset.angle}deg, ${preset.start}, ${preset.end})`,
                      }}
                      onClick={() => handleGradientPreset(preset)}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="grid grid-cols-2 gap-3">
                {/* Start Color */}
                <div className="space-y-2">
                  <Label className="text-xs">צבע התחלה</Label>
                  <div className="grid grid-cols-4 gap-1">
                    {colorPalettes.vibrant.colors.slice(0, 8).map((color) => (
                      <button
                        key={`start-${color}`}
                        className={cn(
                          "w-7 h-7 rounded border-2 transition-all",
                          gradientStart === color
                            ? "border-blue-500"
                            : "border-transparent hover:border-slate-300"
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setGradientStart(color);
                          onChange(`linear-gradient(${gradientAngle}deg, ${color} 0%, ${gradientEnd} 100%)`);
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* End Color */}
                <div className="space-y-2">
                  <Label className="text-xs">צבע סיום</Label>
                  <div className="grid grid-cols-4 gap-1">
                    {colorPalettes.vibrant.colors.slice(0, 8).map((color) => (
                      <button
                        key={`end-${color}`}
                        className={cn(
                          "w-7 h-7 rounded border-2 transition-all",
                          gradientEnd === color
                            ? "border-blue-500"
                            : "border-transparent hover:border-slate-300"
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setGradientEnd(color);
                          onChange(`linear-gradient(${gradientAngle}deg, ${gradientStart} 0%, ${color} 100%)`);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Direction Selection */}
              <div className="space-y-2">
                <Label className="text-xs">כיוון הגרדיאנט</Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {gradientDirections.map((direction) => (
                    <Button
                      key={direction.value}
                      variant={gradientAngle === direction.value ? "default" : "outline"}
                      size="sm"
                      className="h-9 flex flex-col gap-0.5 p-1"
                      onClick={() => handleDirectionChange(direction.value)}
                      title={direction.label}
                    >
                      {direction.icon}
                      <span className="text-[10px]">{direction.value}°</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <Button
                className="w-full"
                onClick={handleApplyGradient}
              >
                <Check className="w-4 h-4 mr-2" />
                החל גרדיאנט
              </Button>
            </TabsContent>
          )}
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}

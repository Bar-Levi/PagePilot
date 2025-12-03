"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  CaseSensitive,
  CaseUpper,
  CaseLower,
} from "lucide-react";
import { ColorPicker } from "./color-picker";

// Popular Google Fonts
const googleFonts = [
  { name: "Heebo", category: "sans-serif", hebrew: true },
  { name: "Assistant", category: "sans-serif", hebrew: true },
  { name: "Rubik", category: "sans-serif", hebrew: true },
  { name: "Open Sans", category: "sans-serif", hebrew: true },
  { name: "Noto Sans Hebrew", category: "sans-serif", hebrew: true },
  { name: "Inter", category: "sans-serif", hebrew: false },
  { name: "Roboto", category: "sans-serif", hebrew: false },
  { name: "Poppins", category: "sans-serif", hebrew: false },
  { name: "Montserrat", category: "sans-serif", hebrew: false },
  { name: "Playfair Display", category: "serif", hebrew: false },
  { name: "Lora", category: "serif", hebrew: false },
  { name: "Merriweather", category: "serif", hebrew: false },
  { name: "Space Grotesk", category: "sans-serif", hebrew: false },
  { name: "DM Sans", category: "sans-serif", hebrew: false },
  { name: "Outfit", category: "sans-serif", hebrew: false },
];

const fontWeights = [
  { value: "100", label: "Thin" },
  { value: "200", label: "Extra Light" },
  { value: "300", label: "Light" },
  { value: "400", label: "Regular" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semi Bold" },
  { value: "700", label: "Bold" },
  { value: "800", label: "Extra Bold" },
  { value: "900", label: "Black" },
];

type TypographyPanelProps = {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: string;
  textTransform?: string;
  color?: string;
  onChange: (key: string, value: any) => void;
};

export function TypographyPanel({
  fontFamily = "Heebo",
  fontSize = 16,
  fontWeight = "400",
  lineHeight = 1.5,
  letterSpacing = 0,
  textAlign = "right",
  textTransform = "none",
  color = "#000000",
  onChange,
}: TypographyPanelProps) {
  const [showAllFonts, setShowAllFonts] = useState(false);

  const hebrewFonts = googleFonts.filter((f) => f.hebrew);
  const displayFonts = showAllFonts ? googleFonts : hebrewFonts;

  return (
    <div className="space-y-4">
      {/* Font Family */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">גופן</Label>
        <Select value={fontFamily} onValueChange={(v) => onChange("fontFamily", v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="בחר גופן" />
          </SelectTrigger>
          <SelectContent>
            {displayFonts.map((font) => (
              <SelectItem
                key={font.name}
                value={font.name}
                style={{ fontFamily: font.name }}
              >
                <span className="flex items-center gap-2">
                  {font.name}
                  {font.hebrew && (
                    <span className="text-xs text-blue-500">עברית</span>
                  )}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="link"
          size="sm"
          className="text-xs p-0 h-auto"
          onClick={() => setShowAllFonts(!showAllFonts)}
        >
          {showAllFonts ? "הצג רק גופני עברית" : "הצג את כל הגופנים"}
        </Button>
      </div>

      {/* Font Size & Weight */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-medium">גודל</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={fontSize}
              onChange={(e) => onChange("fontSize", parseInt(e.target.value))}
              className="w-full"
              min={8}
              max={120}
            />
            <span className="text-xs text-slate-500">px</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">משקל</Label>
          <Select value={fontWeight} onValueChange={(v) => onChange("fontWeight", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontWeights.map((weight) => (
                <SelectItem key={weight.value} value={weight.value}>
                  {weight.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Font Size Slider */}
      <div className="space-y-2">
        <Slider
          value={[fontSize]}
          onValueChange={(v) => onChange("fontSize", v[0])}
          min={8}
          max={120}
          step={1}
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>8px</span>
          <span>120px</span>
        </div>
      </div>

      {/* Line Height & Letter Spacing */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-medium">גובה שורה</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={lineHeight}
              onChange={(e) => onChange("lineHeight", parseFloat(e.target.value))}
              className="w-full"
              min={0.5}
              max={3}
              step={0.1}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">ריווח אותיות</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={letterSpacing}
              onChange={(e) => onChange("letterSpacing", parseFloat(e.target.value))}
              className="w-full"
              min={-5}
              max={20}
              step={0.5}
            />
            <span className="text-xs text-slate-500">px</span>
          </div>
        </div>
      </div>

      {/* Text Align */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">יישור</Label>
        <div className="flex gap-1">
          {[
            { value: "right", icon: AlignRight },
            { value: "center", icon: AlignCenter },
            { value: "left", icon: AlignLeft },
            { value: "justify", icon: AlignJustify },
          ].map(({ value, icon: Icon }) => (
            <Button
              key={value}
              variant={textAlign === value ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => onChange("textAlign", value)}
            >
              <Icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </div>

      {/* Text Transform */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">טרנספורמציה</Label>
        <div className="flex gap-1">
          {[
            { value: "none", icon: CaseSensitive, label: "רגיל" },
            { value: "uppercase", icon: CaseUpper, label: "גדול" },
            { value: "lowercase", icon: CaseLower, label: "קטן" },
            { value: "capitalize", icon: Type, label: "ראשי" },
          ].map(({ value, icon: Icon, label }) => (
            <Button
              key={value}
              variant={textTransform === value ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => onChange("textTransform", value)}
              title={label}
            >
              <Icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </div>

      {/* Text Color */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">צבע טקסט</Label>
        <ColorPicker
          value={color}
          onChange={(v) => onChange("color", v)}
          showGradient={false}
        />
      </div>

      {/* Preview */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <p
          style={{
            fontFamily,
            fontSize: `${fontSize}px`,
            fontWeight,
            lineHeight,
            letterSpacing: `${letterSpacing}px`,
            textAlign: textAlign as any,
            textTransform: textTransform as any,
            color,
          }}
        >
          טקסט לדוגמה - Sample Text
        </p>
      </div>
    </div>
  );
}


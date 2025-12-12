"use client";

import React, { useState } from "react";
import { Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// ============================================================================
// Settings Field Types
// ============================================================================

export type SettingsField = 
  | { type: "color"; key: string; label: string; defaultValue?: string }
  | { type: "text"; key: string; label: string; placeholder?: string }
  | { type: "number"; key: string; label: string; min?: number; max?: number }
  | { type: "select"; key: string; label: string; options: { value: string; label: string }[] }
  | { type: "toggle"; key: string; label: string };

// ============================================================================
// Settings Modal Props
// ============================================================================

type SettingsModalProps = {
  title?: string;
  fields: SettingsField[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  children?: React.ReactNode;
};

// ============================================================================
// Settings Trigger (Gear Icon)
// ============================================================================

export function SettingsTrigger({ 
  onClick, 
  className 
}: { 
  onClick?: () => void; 
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "absolute top-2 left-2 z-20",
        "w-8 h-8 rounded-full",
        "bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm",
        "border border-slate-200 dark:border-slate-700",
        "shadow-lg hover:shadow-xl",
        "flex items-center justify-center",
        "text-slate-600 dark:text-slate-300",
        "hover:text-blue-600 dark:hover:text-blue-400",
        "hover:bg-blue-50 dark:hover:bg-blue-900/30",
        "transition-all duration-200",
        "hover:scale-110",
        "opacity-0 group-hover:opacity-100",
        className
      )}
      title="הגדרות רכיב"
    >
      <Settings className="w-4 h-4" />
    </button>
  );
}

// ============================================================================
// Settings Popover Component
// ============================================================================

export function SettingsPopover({
  title = "הגדרות רכיב",
  fields,
  values,
  onChange,
  children,
}: SettingsModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "absolute top-2 left-2 z-20",
            "w-8 h-8 rounded-full",
            "bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm",
            "border border-slate-200 dark:border-slate-700",
            "shadow-lg hover:shadow-xl",
            "flex items-center justify-center",
            "text-slate-600 dark:text-slate-300",
            "hover:text-blue-600 dark:hover:text-blue-400",
            "hover:bg-blue-50 dark:hover:bg-blue-900/30",
            "transition-all duration-200",
            "hover:scale-110",
            "opacity-0 group-hover:opacity-100"
          )}
          title="הגדרות רכיב"
        >
          <Settings className="w-4 h-4" />
        </button>
      </PopoverTrigger>

      <PopoverContent 
        className="w-80 p-0" 
        align="start" 
        side="left"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <Settings className="w-4 h-4" />
            {title}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => setOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Fields */}
        <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto" dir="rtl">
          {fields.map((field) => (
            <SettingsFieldRenderer
              key={field.key}
              field={field}
              value={values[field.key]}
              onChange={(val) => onChange(field.key, val)}
            />
          ))}
        </div>

        {/* Additional content (children) */}
        {children && (
          <div className="px-4 pb-4">
            {children}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

// ============================================================================
// Settings Field Renderer
// ============================================================================

function SettingsFieldRenderer({
  field,
  value,
  onChange,
}: {
  field: SettingsField;
  value: any;
  onChange: (value: any) => void;
}) {
  switch (field.type) {
    case "color":
      return (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {field.label}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value || field.defaultValue || "#000000"}
              onChange={(e) => onChange(e.target.value)}
              className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer"
            />
            <input
              type="text"
              value={value || field.defaultValue || ""}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 font-mono"
              placeholder="#000000"
              dir="ltr"
            />
          </div>
        </div>
      );

    case "text":
      return (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {field.label}
          </label>
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
            placeholder={field.placeholder}
          />
        </div>
      );

    case "number":
      return (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {field.label}
          </label>
          <input
            type="number"
            value={value || 0}
            onChange={(e) => onChange(parseInt(e.target.value))}
            min={field.min}
            max={field.max}
            className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
            dir="ltr"
          />
        </div>
      );

    case "select":
      return (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {field.label}
          </label>
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
          >
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );

    case "toggle":
      return (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {field.label}
          </span>
        </label>
      );

    default:
      return null;
  }
}

export default SettingsPopover;

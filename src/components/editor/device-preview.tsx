"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Monitor, Tablet, Smartphone, Maximize2 } from "lucide-react";

export type DeviceType = "desktop" | "tablet" | "mobile" | "fullscreen";

type DevicePreviewProps = {
  device: DeviceType;
  onChange: (device: DeviceType) => void;
};

// Device dimensions
export const deviceDimensions: Record<DeviceType, { width: number; label: string }> = {
  desktop: { width: 1200, label: "Desktop (1200px)" },
  tablet: { width: 768, label: "Tablet (768px)" },
  mobile: { width: 375, label: "Mobile (375px)" },
  fullscreen: { width: 0, label: "מסך מלא" },
};

export function DevicePreviewToggle({ device, onChange }: DevicePreviewProps) {
  const devices: Array<{
    type: DeviceType;
    icon: React.ReactNode;
    label: string;
  }> = [
    { type: "desktop", icon: <Monitor className="w-4 h-4" />, label: "Desktop" },
    { type: "tablet", icon: <Tablet className="w-4 h-4" />, label: "Tablet" },
    { type: "mobile", icon: <Smartphone className="w-4 h-4" />, label: "Mobile" },
    { type: "fullscreen", icon: <Maximize2 className="w-4 h-4" />, label: "מסך מלא" },
  ];

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
        {devices.map(({ type, icon, label }) => (
          <Tooltip key={type}>
            <TooltipTrigger asChild>
              <Button
                variant={device === type ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "h-8 w-8 p-0",
                  device === type && "bg-white dark:bg-slate-700 shadow-sm"
                )}
                onClick={() => onChange(type)}
              >
                {icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
              {type !== "fullscreen" && (
                <p className="text-xs text-slate-500">
                  {deviceDimensions[type].width}px
                </p>
              )}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

// Canvas wrapper with device preview
type DevicePreviewWrapperProps = {
  device: DeviceType;
  children: React.ReactNode;
};

export function DevicePreviewWrapper({
  device,
  children,
}: DevicePreviewWrapperProps) {
  const isFullscreen = device === "fullscreen";
  const width = deviceDimensions[device].width;

  if (isFullscreen) {
    return <>{children}</>;
  }

  return (
    <div className="flex justify-center py-8 px-4 min-h-full">
      {/* Device Frame */}
      <div
        className={cn(
          "relative bg-white dark:bg-slate-800 shadow-2xl transition-all duration-300",
          device === "mobile" && "rounded-[32px] border-[12px] border-slate-900",
          device === "tablet" && "rounded-[24px] border-[16px] border-slate-900",
          device === "desktop" && "rounded-lg border border-slate-200 dark:border-slate-700"
        )}
        style={{
          width: `${width}px`,
          maxWidth: "100%",
        }}
      >
        {/* Mobile Notch */}
        {device === "mobile" && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-b-2xl z-10" />
        )}

        {/* Tablet Home Button */}
        {device === "tablet" && (
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-slate-800 rounded-full border-2 border-slate-700" />
        )}

        {/* Desktop Browser Chrome */}
        {device === "desktop" && (
          <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 mx-4">
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-md px-3 flex items-center">
                <span className="text-xs text-slate-500">
                  https://your-landing-page.com
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div
          className={cn(
            "overflow-auto",
            device === "mobile" && "pt-6",
            device === "desktop" && "max-h-[calc(100vh-200px)]"
          )}
          style={{
            height: device === "mobile" ? "667px" : device === "tablet" ? "1024px" : "auto",
            maxHeight: device === "desktop" ? "calc(100vh - 200px)" : undefined,
          }}
        >
          {children}
        </div>
      </div>

      {/* Device Label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900/80 text-white text-xs rounded-full">
        {deviceDimensions[device].label}
      </div>
    </div>
  );
}

// Preview Mode (full page preview without editor UI)
type PreviewModeProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function PreviewMode({ isOpen, onClose, children }: PreviewModeProps) {
  const [device, setDevice] = React.useState<DeviceType>("desktop");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900">
      {/* Preview Toolbar */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-4">
          <span className="text-white font-medium">תצוגה מקדימה</span>
          <DevicePreviewToggle device={device} onChange={setDevice} />
        </div>

        <Button variant="ghost" size="sm" onClick={onClose} className="text-white">
          סגור תצוגה מקדימה
        </Button>
      </div>

      {/* Preview Content */}
      <div className="pt-14 h-full overflow-auto bg-slate-100 dark:bg-slate-900">
        <DevicePreviewWrapper device={device}>
          {children}
        </DevicePreviewWrapper>
      </div>
    </div>
  );
}


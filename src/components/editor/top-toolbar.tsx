"use client";

import React from "react";
import {
  useEditorStore,
  useCanUndo,
  useCanRedo,
} from "@/hooks/use-editor-store";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Undo2,
  Redo2,
  Download,
  Upload,
  Sparkles,
  Rocket,
  Eye,
  Save,
} from "lucide-react";
import { TemplatesGallery } from "./templates-gallery";

type TopToolbarProps = {
  children?: React.ReactNode;
};

export function TopToolbar({ children }: TopToolbarProps) {
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const pageJson = useEditorStore((s) => s.pageJson);
  const setPageJson = useEditorStore((s) => s.setPageJson);
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const handleExport = () => {
    const json = JSON.stringify(pageJson, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "landing-page.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        try {
          const json = JSON.parse(text);
          setPageJson(json);
        } catch (err) {
          console.error("Invalid JSON file");
        }
      }
    };
    input.click();
  };

  return (
    <TooltipProvider>
      <header className="h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 shrink-0">
        {/* Left - Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PagePilot
            </h1>
          </div>
        </div>

        {/* Center - Main Actions */}
        <div className="flex items-center gap-1">
          {/* Undo/Redo */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={undo}
                disabled={!canUndo}
                className="h-9 w-9"
              >
                <Undo2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>בטל (Ctrl+Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={redo}
                disabled={!canRedo}
                className="h-9 w-9"
              >
                <Redo2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>בצע שוב (Ctrl+Y)</TooltipContent>
          </Tooltip>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2" />

          {/* Device Preview (passed from parent) */}
          {children}

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2" />

          {/* Templates Gallery */}
          <TemplatesGallery />

          {/* AI Generate */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">AI יצירה</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>צור דף עם AI</TooltipContent>
          </Tooltip>
        </div>

        {/* Right - Export/Import */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleImport}>
                <Upload className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>ייבא JSON</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleExport}>
                <Download className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>ייצא JSON</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Eye className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>תצוגה מקדימה</TooltipContent>
          </Tooltip>

          <Button variant="default" size="sm" className="gap-2 ml-2">
            <Save className="w-4 h-4" />
            <span>שמור</span>
          </Button>
        </div>
      </header>
    </TooltipProvider>
  );
}


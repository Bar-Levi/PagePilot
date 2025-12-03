"use client";
import {
  Blocks,
  Layers,
  Palette,
  Settings,
  Sparkles,
  PencilRuler,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComponentPalette } from "./component-palette";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { AiCopywritingPanel } from "./ai-copywriting-panel";
import { PropsEditorPanel } from "./props-editor-panel";
import type { PageComponent } from "../landing-page/types";
import { useEffect, useState } from "react";

type EditorSidebarProps = {
  selectedComponent: PageComponent | null;
};

export function EditorSidebar({ selectedComponent }: EditorSidebarProps) {
  const [activeTab, setActiveTab] = useState("components");

  // Auto-switch to props tab when component is selected
  useEffect(() => {
    if (selectedComponent && activeTab === "components") {
      setActiveTab("props");
    }
  }, [selectedComponent, activeTab]);
  return (
    <aside className="flex flex-col h-full">
      {/* Modern Header */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Blocks className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Components
          </h2>
        </div>
      </div>

      {/* Modern Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("components")}
              className={`flex-1 flex flex-col items-center gap-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                activeTab === "components"
                  ? "bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Blocks className="w-4 h-4" />
              Add
            </button>
            <button
              onClick={() => setActiveTab("props")}
              disabled={!selectedComponent}
              className={`flex-1 flex flex-col items-center gap-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                activeTab === "props" && selectedComponent
                  ? "bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400"
                  : selectedComponent
                  ? "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  : "text-slate-400 dark:text-slate-500 cursor-not-allowed"
              }`}
            >
              <PencilRuler className="w-4 h-4" />
              Props
            </button>
            <button
              onClick={() => setActiveTab("ai-copy")}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                activeTab === "ai-copy"
                  ? "bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              AI
            </button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <TabsContent value="components">
            <ComponentPalette />
          </TabsContent>
          <TabsContent value="props">
            <PropsEditorPanel selectedComponent={selectedComponent} />
          </TabsContent>
          <TabsContent value="ai-copy">
            <AiCopywritingPanel />
          </TabsContent>
          <TabsContent value="style">
            <div className="p-4 text-center text-sm text-muted-foreground">
              Style customization coming soon.
            </div>
          </TabsContent>
          <TabsContent value="settings">
            <div className="p-4 text-center text-sm text-muted-foreground">
              Page settings coming soon.
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </aside>
  );
}

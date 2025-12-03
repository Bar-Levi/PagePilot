"use client";

import React, { useEffect, useState } from "react";
import { useEditorStore } from "@/hooks/use-editor-store";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { Canvas } from "./canvas";
import { ComponentPaletteV2 } from "./component-palette-v2";
import { PropertiesPanel } from "./properties-panel";
import { TopToolbar } from "./top-toolbar";
import { RichTextToolbar } from "./richtext-toolbar";
import { LayersPanel } from "./layers-panel";
import { QuickActions } from "./quick-actions";
import { DeviceSelector } from "./device-selector";
import { DevicePreviewToggle, DevicePreviewWrapper, type DeviceType } from "./device-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, Grid3X3 } from "lucide-react";
import type { PageComponent } from "@/components/landing-page/types";
import { BusinessInputForm } from "./business-input-form";

// Default page structure for demo (no longer used - kept for reference)
const defaultPageStructure: PageComponent = {
  id: "page-root",
  type: "Page",
  props: {},
  children: [
    {
      id: "hero-section",
      type: "Container",
      props: {
        style: {
          padding: "96px 32px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 24,
        },
      },
      children: [
        {
          id: "hero-title",
          type: "RichText",
          props: {
            html: '<span style="font-size: 48px; font-weight: 700; color: white;">ברוכים הבאים ל-PagePilot</span>',
            align: "center",
          },
        },
        {
          id: "hero-subtitle",
          type: "RichText",
          props: {
            html: '<span style="font-size: 20px; color: rgba(255,255,255,0.9);">בנה דפי נחיתה מדהימים בקלות עם עורך הגרירה והשחרור שלנו</span>',
            align: "center",
          },
        },
        {
          id: "hero-cta",
          type: "Button",
          props: {
            text: "התחל עכשיו",
            href: "#features",
            variant: "default",
            size: "lg",
          },
        },
      ],
    },
    {
      id: "features-section",
      type: "Container",
      props: {
        style: {
          padding: "64px 32px",
          background: "#ffffff",
          flexDirection: "column",
          alignItems: "center",
          gap: 48,
        },
      },
      children: [
        {
          id: "features-title",
          type: "RichText",
          props: {
            html: '<span style="font-size: 36px; font-weight: 700; color: #1a1a1a;">למה לבחור בנו?</span>',
            align: "center",
          },
        },
        {
          id: "features-grid",
          type: "Container",
          props: {
            style: {
              flexDirection: "row",
              gap: 32,
              justifyContent: "center",
              alignItems: "stretch",
            },
          },
          children: [
            {
              id: "feature-1",
              type: "Container",
              props: {
                style: {
                  padding: "24px",
                  background: "#f8fafc",
                  radius: "12px",
                  flexDirection: "column",
                  gap: 12,
                  maxWidth: "300px",
                },
              },
              children: [
                {
                  id: "feature-1-title",
                  type: "RichText",
                  props: {
                    html: '<span style="font-size: 20px; font-weight: 600; color: #1a1a1a;">עריכה קלה</span>',
                    align: "center",
                  },
                },
                {
                  id: "feature-1-desc",
                  type: "RichText",
                  props: {
                    html: '<span style="font-size: 16px; color: #64748b;">גרור ושחרר רכיבים, ערוך טקסט ישירות על הדף</span>',
                    align: "center",
                  },
                },
              ],
            },
            {
              id: "feature-2",
              type: "Container",
              props: {
                style: {
                  padding: "24px",
                  background: "#f8fafc",
                  radius: "12px",
                  flexDirection: "column",
                  gap: 12,
                  maxWidth: "300px",
                },
              },
              children: [
                {
                  id: "feature-2-title",
                  type: "RichText",
                  props: {
                    html: '<span style="font-size: 20px; font-weight: 600; color: #1a1a1a;">AI חכם</span>',
                    align: "center",
                  },
                },
                {
                  id: "feature-2-desc",
                  type: "RichText",
                  props: {
                    html: '<span style="font-size: 16px; color: #64748b;">ה-AI שלנו יוצר תוכן מותאם אישית לעסק שלך</span>',
                    align: "center",
                  },
                },
              ],
            },
            {
              id: "feature-3",
              type: "Container",
              props: {
                style: {
                  padding: "24px",
                  background: "#f8fafc",
                  radius: "12px",
                  flexDirection: "column",
                  gap: 12,
                  maxWidth: "300px",
                },
              },
              children: [
                {
                  id: "feature-3-title",
                  type: "RichText",
                  props: {
                    html: '<span style="font-size: 20px; font-weight: 600; color: #1a1a1a;">עיצוב מקצועי</span>',
                    align: "center",
                  },
                },
                {
                  id: "feature-3-desc",
                  type: "RichText",
                  props: {
                    html: '<span style="font-size: 16px; color: #64748b;">תבניות מעוצבות מראש לכל סוג עסק</span>',
                    align: "center",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "cta-section",
      type: "Container",
      props: {
        style: {
          padding: "64px 32px",
          background: "#1a1a1a",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        },
      },
      children: [
        {
          id: "cta-title",
          type: "RichText",
          props: {
            html: '<span style="font-size: 32px; font-weight: 700; color: white;">מוכנים להתחיל?</span>',
            align: "center",
          },
        },
        {
          id: "cta-button",
          type: "Button",
          props: {
            text: "צור דף נחיתה חינם",
            href: "#signup",
            variant: "default",
            size: "lg",
          },
        },
      ],
    },
  ],
};

export function EditorLayout() {
  const setPageJson = useEditorStore((s) => s.setPageJson);
  const pageJson = useEditorStore((s) => s.pageJson);
  const selectedId = useEditorStore((s) => s.selectedId);
  const getComponentById = useEditorStore((s) => s.getComponentById);
  const [leftTab, setLeftTab] = useState<"components" | "layers">("components");
  const [devicePreview, setDevicePreview] = useState<DeviceType>("fullscreen");

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  // Check if page is empty
  const isEmpty = !pageJson.children || pageJson.children.length === 0;

  const selectedComponent = selectedId ? getComponentById(selectedId) : null;
  const isRichTextSelected = selectedComponent?.type === "RichText";

  // If page is empty, show the business input form
  if (isEmpty) {
    return <BusinessInputForm />;
  }

  // Otherwise, show the editor
  return (
    <div className="flex flex-col h-screen w-screen bg-slate-100 dark:bg-slate-900 overflow-hidden">
      {/* Top Toolbar */}
      <TopToolbar>
        {/* Device Preview Selector */}
        <DeviceSelector />
      </TopToolbar>

      {/* RichText Toolbar (shown when RichText is selected) */}
      {isRichTextSelected && <RichTextToolbar />}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Component Palette & Layers */}
        <aside className="w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
          <Tabs value={leftTab} onValueChange={(v) => setLeftTab(v as any)} className="flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-2 m-2 mb-0">
              <TabsTrigger value="components" className="flex items-center gap-1.5">
                <Grid3X3 className="w-4 h-4" />
                רכיבים
              </TabsTrigger>
              <TabsTrigger value="layers" className="flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                שכבות
              </TabsTrigger>
            </TabsList>
            <TabsContent value="components" className="flex-1 overflow-hidden m-0">
              <ComponentPaletteV2 />
            </TabsContent>
            <TabsContent value="layers" className="flex-1 overflow-hidden m-0">
              <LayersPanel />
            </TabsContent>
          </Tabs>
        </aside>

        {/* Center - Canvas */}
        <main className="flex-1 overflow-auto bg-slate-200 dark:bg-slate-900 relative">
          <DevicePreviewWrapper device={devicePreview}>
            <Canvas />
          </DevicePreviewWrapper>
        </main>

        {/* Right Sidebar - Properties Panel */}
        <aside className="w-80 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 overflow-y-auto">
          <PropertiesPanel />
        </aside>
      </div>

      {/* Quick Actions Bar (floating at bottom) */}
      <QuickActions />
    </div>
  );
}


"use client";

import React from "react";
import { useEditorStore, useSelectedComponent } from "@/hooks/use-editor-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Settings, Palette, Layout, Type, Link, Image } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function PropertiesPanel() {
  const selectedComponent = useSelectedComponent();
  const updateProps = useEditorStore((s) => s.updateProps);

  if (!selectedComponent) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <Settings className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
          אין רכיב נבחר
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          לחץ על רכיב בקנבס כדי לערוך את המאפיינים שלו
        </p>
      </div>
    );
  }

  const handlePropChange = (key: string, value: any) => {
    updateProps(selectedComponent.id, { [key]: value });
  };

  const handleStyleChange = (key: string, value: any) => {
    const currentStyle = (selectedComponent.props as any).style || {};
    updateProps(selectedComponent.id, {
      style: { ...currentStyle, [key]: value },
    });
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            <h2 className="font-semibold text-slate-700 dark:text-slate-300">
              מאפיינים
            </h2>
          </div>
          <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-400">
            {selectedComponent.type}
          </span>
        </div>

        {/* Component ID */}
        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-800 p-2 rounded">
          ID: {selectedComponent.id}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">תוכן</TabsTrigger>
            <TabsTrigger value="style">עיצוב</TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4 mt-4">
            {renderContentProps(selectedComponent, handlePropChange)}
          </TabsContent>

          {/* Style Tab */}
          <TabsContent value="style" className="space-y-4 mt-4">
            {renderStyleProps(selectedComponent, handleStyleChange)}
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}

// ============================================================================
// Content Props Renderer
// ============================================================================

function renderContentProps(
  component: any,
  onChange: (key: string, value: any) => void
) {
  const props = component.props;

  switch (component.type) {
    case "RichText":
      return (
        <>
          <PropertyGroup title="טקסט" icon={<Type className="w-4 h-4" />}>
            <div className="space-y-2">
              <Label>יישור</Label>
              <Select
                value={props.align || "right"}
                onValueChange={(v) => onChange("align", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="right">ימין</SelectItem>
                  <SelectItem value="center">מרכז</SelectItem>
                  <SelectItem value="left">שמאל</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </PropertyGroup>
          <PropertyGroup title="HTML" icon={<Type className="w-4 h-4" />}>
            <Textarea
              value={props.html || ""}
              onChange={(e) => onChange("html", e.target.value)}
              rows={6}
              className="font-mono text-xs"
              dir="ltr"
            />
          </PropertyGroup>
        </>
      );

    case "Button":
      return (
        <>
          <PropertyGroup title="כפתור" icon={<Type className="w-4 h-4" />}>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>טקסט</Label>
                <Input
                  value={props.text || ""}
                  onChange={(e) => onChange("text", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>קישור</Label>
                <Input
                  value={props.href || ""}
                  onChange={(e) => onChange("href", e.target.value)}
                  placeholder="https://..."
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label>סגנון</Label>
                <Select
                  value={props.variant || "default"}
                  onValueChange={(v) => onChange("variant", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">ראשי</SelectItem>
                    <SelectItem value="secondary">משני</SelectItem>
                    <SelectItem value="outline">מתאר</SelectItem>
                    <SelectItem value="ghost">שקוף</SelectItem>
                    <SelectItem value="link">קישור</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>גודל</Label>
                <Select
                  value={props.size || "default"}
                  onValueChange={(v) => onChange("size", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">קטן</SelectItem>
                    <SelectItem value="default">רגיל</SelectItem>
                    <SelectItem value="lg">גדול</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PropertyGroup>
        </>
      );

    case "Image":
      return (
        <>
          <PropertyGroup title="תמונה" icon={<Image className="w-4 h-4" />}>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>כתובת (URL)</Label>
                <Input
                  value={props.src || ""}
                  onChange={(e) => onChange("src", e.target.value)}
                  placeholder="https://..."
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label>טקסט חלופי</Label>
                <Input
                  value={props.alt || ""}
                  onChange={(e) => onChange("alt", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>יישור</Label>
                <Select
                  value={props.alignment || "center"}
                  onValueChange={(v) => onChange("alignment", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">שמאל</SelectItem>
                    <SelectItem value="center">מרכז</SelectItem>
                    <SelectItem value="right">ימין</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>עיגול פינות</Label>
                <Input
                  value={props.rounded || ""}
                  onChange={(e) => onChange("rounded", e.target.value)}
                  placeholder="8px או 1rem"
                />
              </div>
            </div>
          </PropertyGroup>
        </>
      );

    case "Video":
      return (
        <>
          <PropertyGroup title="וידאו" icon={<Type className="w-4 h-4" />}>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>YouTube ID</Label>
                <Input
                  value={props.youtubeId || ""}
                  onChange={(e) => onChange("youtubeId", e.target.value)}
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label>יחס תצוגה</Label>
                <Select
                  value={props.ratio || "16:9"}
                  onValueChange={(v) => onChange("ratio", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:9">16:9</SelectItem>
                    <SelectItem value="4:3">4:3</SelectItem>
                    <SelectItem value="1:1">1:1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label>הפעלה אוטומטית</Label>
                <Switch
                  checked={props.autoplay || false}
                  onCheckedChange={(v) => onChange("autoplay", v)}
                />
              </div>
            </div>
          </PropertyGroup>
        </>
      );

    case "Container":
      return (
        <>
          <PropertyGroup title="מיכל" icon={<Layout className="w-4 h-4" />}>
            <p className="text-sm text-slate-500">
              מיכל זה מכיל {component.children?.length || 0} רכיבים
            </p>
          </PropertyGroup>
        </>
      );

    default:
      return (
        <div className="text-sm text-slate-500 text-center py-4">
          אין מאפייני תוכן עבור רכיב זה
        </div>
      );
  }
}

// ============================================================================
// Style Props Renderer
// ============================================================================

function renderStyleProps(
  component: any,
  onChange: (key: string, value: any) => void
) {
  const style = component.props?.style || {};

  if (component.type === "Container") {
    return (
      <>
        <PropertyGroup title="פריסה" icon={<Layout className="w-4 h-4" />}>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>כיוון</Label>
              <Select
                value={style.flexDirection || "column"}
                onValueChange={(v) => onChange("flexDirection", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="row">שורה (אופקי)</SelectItem>
                  <SelectItem value="column">עמודה (אנכי)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>יישור פריטים</Label>
              <Select
                value={style.alignItems || "stretch"}
                onValueChange={(v) => onChange("alignItems", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flex-start">התחלה</SelectItem>
                  <SelectItem value="center">מרכז</SelectItem>
                  <SelectItem value="flex-end">סוף</SelectItem>
                  <SelectItem value="stretch">מתיחה</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>יישור תוכן</Label>
              <Select
                value={style.justifyContent || "flex-start"}
                onValueChange={(v) => onChange("justifyContent", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flex-start">התחלה</SelectItem>
                  <SelectItem value="center">מרכז</SelectItem>
                  <SelectItem value="flex-end">סוף</SelectItem>
                  <SelectItem value="space-between">פיזור שווה</SelectItem>
                  <SelectItem value="space-around">פיזור סביב</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>רווח בין פריטים (gap)</Label>
              <Input
                value={style.gap || ""}
                onChange={(e) =>
                  onChange("gap", parseInt(e.target.value) || e.target.value)
                }
                placeholder="16"
              />
            </div>
          </div>
        </PropertyGroup>

        <PropertyGroup title="מרווחים" icon={<Palette className="w-4 h-4" />}>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Padding</Label>
              <Input
                value={style.padding || ""}
                onChange={(e) => onChange("padding", e.target.value)}
                placeholder="32px או 16px 24px"
              />
            </div>
          </div>
        </PropertyGroup>

        <PropertyGroup title="רקע" icon={<Palette className="w-4 h-4" />}>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>צבע/גרדיאנט</Label>
              <Input
                value={style.background || ""}
                onChange={(e) => onChange("background", e.target.value)}
                placeholder="#ffffff או linear-gradient(...)"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label>עיגול פינות</Label>
              <Input
                value={style.radius || ""}
                onChange={(e) => onChange("radius", e.target.value)}
                placeholder="8px"
              />
            </div>
          </div>
        </PropertyGroup>

        <PropertyGroup title="גודל" icon={<Layout className="w-4 h-4" />}>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>רוחב</Label>
              <Input
                value={style.width || ""}
                onChange={(e) => onChange("width", e.target.value)}
                placeholder="100% או 500px"
              />
            </div>
            <div className="space-y-2">
              <Label>רוחב מקסימלי</Label>
              <Input
                value={style.maxWidth || ""}
                onChange={(e) => onChange("maxWidth", e.target.value)}
                placeholder="1200px"
              />
            </div>
          </div>
        </PropertyGroup>
      </>
    );
  }

  return (
    <div className="text-sm text-slate-500 text-center py-4">
      מאפייני עיצוב זמינים רק עבור מיכלים (Containers)
    </div>
  );
}

// ============================================================================
// Property Group Component
// ============================================================================

function PropertyGroup({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        {icon}
        {title}
      </div>
      <div className="pl-6">{children}</div>
    </div>
  );
}


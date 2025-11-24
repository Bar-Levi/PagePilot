"use client";
import { Blocks, Layers, Palette, Settings } from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ComponentPalette } from "./component-palette";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

export function EditorSidebar() {
  return (
    <aside className="w-[300px] bg-background border-r flex flex-col">
      <div className="p-4">
        <h2 className="text-xl font-semibold font-headline">PagePilot</h2>
      </div>
      <Separator />
      <Tabs defaultValue="components" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 rounded-none h-auto p-2">
          <TabsTrigger value="components" className="flex flex-col gap-1 h-14">
            <Blocks className="w-5 h-5" />
            <span className="text-xs">Add</span>
          </TabsTrigger>
          <TabsTrigger value="layers" className="flex flex-col gap-1 h-14" disabled>
            <Layers className="w-5 h-5" />
            <span className="text-xs">Layers</span>
          </TabsTrigger>
          <TabsTrigger value="style" className="flex flex-col gap-1 h-14" disabled>
            <Palette className="w-5 h-5" />
            <span className="text-xs">Style</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex flex-col gap-1 h-14" disabled>
            <Settings className="w-5 h-5" />
            <span className="text-xs">Settings</span>
          </TabsTrigger>
        </TabsList>
        <ScrollArea className="flex-1">
          <TabsContent value="components">
            <ComponentPalette />
          </TabsContent>
          <TabsContent value="layers">
            <div className="p-4 text-center text-sm text-muted-foreground">
              Layer management coming soon.
            </div>
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

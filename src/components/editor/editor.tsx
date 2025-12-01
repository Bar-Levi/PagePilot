
"use client";

import type { PageData, PageComponent } from "../landing-page/types";
import { EditorSidebar } from "./editor-sidebar";
import { Canvas } from "./canvas";
import { Rocket, Download, Settings, Share2, Undo, Redo } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useHistoryState } from "@/hooks/use-history-state";
import { EditorStateProvider } from "@/hooks/use-editor-state.tsx";
import { RichTextToolbar } from "./rich-text-toolbar";

const defaultPageData: PageData = {
  pageStructure: [
    // Hero Section Container
    {
      id: "hero-section",
      type: "Container",
      props: {
        style: {
          padding: "96px 32px",
          background: "hsl(var(--background))",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 24,
        }
      },
      children: [
        {
          id: "hero-headline",
          type: "RichText",
          props: {
            align: "center",
            html: `<span style="font-size: 52px; font-weight: bold;">צעצועים שמחים לכלבים מאושרים</span>`,
          },
        },
        {
          id: "hero-subheadline",
          type: "RichText",
          props: {
            align: "center",
            html: `<span style="font-size: 20px; color: hsl(var(--muted-foreground));">צעצועים אקולוגיים בעבודת יד, כי לחבר הכי טוב שלך מגיע את הטוב ביותר.</span>`,
          },
        },
        {
          id: "hero-cta-button",
          type: "Button",
          props: {
            text: "קנו עכשיו",
            href: "#pricing",
            size: "lg",
          },
        },
      ],
    },
    // Feature Section Container
    {
      id: "feature-section",
      type: "Container",
      props: {
        style: {
          padding: "64px 32px",
          alignItems: "center",
          gap: 48,
          maxWidth: "1100px"
        }
      },
      children: [
        {
          id: "feature-text-container",
          type: "Container",
          props: { style: { flexDirection: "column", gap: 16, alignItems: "flex-start", justifyContent: "center" } },
          children: [
            { id: "feature-headline", type: "RichText", props: { align: 'left', html: `<span style="font-size: 36px; font-weight: bold;">עבודת יד, מחומרים טבעיים</span>` } },
            { id: "feature-text", type: "RichText", props: { align: 'left', html: `<span style="font-size: 18px; color: hsl(var(--muted-foreground));">כל צעצוע מיוצר באהבה מחומרים ממוחזרים ועמידים, בטוחים לכלב שלך וידידותיים לסביבה. אנחנו מאמינים שגם לכלבים מגיע ליהנות ממוצרים איכותיים שמכבדים את כדור הארץ.</span>` } },
          ]
        },
        {
          id: "feature-image",
          type: "Image",
          props: {
            src: "https://picsum.photos/seed/eco-toys/600/400",
            alt: "צעצועים אקולוגיים לכלבים",
            width: "100%",
            rounded: "1rem"
          }
        }
      ]
    }
  ],
};

export function Editor() {
  
  return (
    <EditorStateProvider initialPageData={defaultPageData}>
      <EditorInternal />
    </EditorStateProvider>
  )
}


function EditorInternal() {
  const { pageData, selectedComponent, selectComponent, undo, redo, canUndo, canRedo } = useHistoryState();

  return (
    <TooltipProvider>
      <div className="flex h-screen w-screen bg-muted/40">
        <EditorSidebar selectedComponent={selectedComponent ?? null} />
        <main className="flex-1 flex flex-col h-screen">
          <header className="h-16 bg-background border-b flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <Rocket className="w-5 h-5 text-primary" />
                </Link>
              </Button>
              <h1 className="text-lg font-semibold">Editor</h1>
            </div>
            <div className="flex items-center gap-2">
               <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={undo} disabled={!canUndo}>
                    <Undo className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Undo (Ctrl+Z)</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={redo} disabled={!canRedo}>
                    <Redo className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Redo (Ctrl+Y)</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Download className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export HTML + Tailwind (Coming Soon)</p>
                </TooltipContent>
              </Tooltip>
               <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" disabled>
                    <Settings className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Analytics Integration (Coming Soon)</p>
                </TooltipContent>
              </Tooltip>
               <Button disabled>
                <Share2 className="w-4 h-4 mr-2"/>
                Deploy
              </Button>
            </div>
          </header>
          <RichTextToolbar />
          <div className="flex-1 overflow-auto">
            <Canvas
              pageData={pageData}
              isLoading={false}
              selectedComponentId={selectedComponent?.id ?? null}
              onSelectComponent={selectComponent}
            />
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}

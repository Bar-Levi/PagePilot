
"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateLandingPage } from "@/ai/flows/generate-landing-page-from-prompt";
import type { PageData } from "../landing-page/types";
import { OnboardingModal } from "./onboarding-modal";
import { EditorSidebar } from "./editor-sidebar";
import { Canvas } from "./canvas";
import { Rocket, Download, Settings, Code, Share2 } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export function Editor() {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async (formData: {
    businessDescription: string;
    targetAudience: string;
    tone: string;
  }) => {
    setIsLoading(true);
    setPageData(null);
    try {
      const result = await generateLandingPage(formData);
      
      let pageStructureString = result.pageStructure;
      
      // Handle cases where the response is wrapped in markdown
      if (pageStructureString.startsWith("```json")) {
        pageStructureString = pageStructureString.substring(7, pageStructureString.length - 3).trim();
      }

      let parsedData;
      try {
        parsedData = JSON.parse(pageStructureString);
      } catch (e) {
        console.error("Initial JSON parsing failed, attempting to fix...", e);
        // Attempt to fix common AI JSON errors, like trailing commas
        const fixedJsonString = pageStructureString.replace(/,\s*([}\]])/g, '$1');
        try {
          parsedData = JSON.parse(fixedJsonString);
        } catch (finalError) {
          console.error("Could not fix JSON:", finalError);
          throw new Error("Invalid JSON response from AI.");
        }
      }

      // The AI sometimes wraps the response in another pageStructure object.
      if (parsedData.pageStructure) {
        parsedData = { pageStructure: parsedData.pageStructure };
      }
      
      // The AI can also return an array directly, so we wrap it.
      if (Array.isArray(parsedData)) {
        parsedData = { pageStructure: parsedData };
      }
      
      // The AI can also return an array in the pageStructure property
      if (Array.isArray(parsedData.pageStructure)) {
        setPageData({ pageStructure: parsedData.pageStructure });
      } else {
         throw new Error("Invalid page structure format from AI.");
      }
      
      toast({
        title: "הדף נוצר!",
        description: "דף הנחיתה החדש שלך מוכן.",
      });
    } catch (error) {
      console.error("Failed to generate or parse page data:", error);
      toast({
        variant: "destructive",
        title: "יצירה נכשלה",
        description:
          "הייתה שגיאה ביצירת הדף שלך. אנא נסה שוב.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = (newStructure: PageData) => {
    setPageData(newStructure);
  };
  
  const handleLoadingComplete = () => {
    // This function is no longer strictly necessary but kept for potential future use.
  }

  if (!pageData && !isLoading) {
    return <OnboardingModal onGenerate={handleGenerate} isGenerating={isLoading} />;
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen w-screen bg-muted/40">
        <EditorSidebar />
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
                  <Button variant="outline" size="icon">
                    <Download className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export Code (Coming Soon)</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Page Settings (Coming Soon)</p>
                </TooltipContent>
              </Tooltip>
               <Button>
                <Share2 className="w-4 h-4 mr-2"/>
                Publish
              </Button>
            </div>
          </header>
          <div className="flex-1 overflow-auto">
            <Canvas
              pageData={pageData}
              isLoading={isLoading}
              onUpdate={handleUpdate}
              onLoadingComplete={handleLoadingComplete}
            />
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}

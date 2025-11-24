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
    try {
      const result = await generateLandingPage(formData);
      // The AI returns a string, so we need to parse it.
      // A try-catch block is essential here in a real app.
      const parsedData = JSON.parse(result.pageStructure);
      setPageData(parsedData);
      toast({
        title: "Page Generated!",
        description: "Your new landing page is ready.",
      });
    } catch (error) {
      console.error("Failed to generate or parse page data:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description:
          "There was an error generating your page. Please try again.",
      });
      setIsLoading(false); // Ensure loading is stopped on error
    } 
    // Do not set isLoading to false in the finally block if parsing is successful,
    // as the canvas will take over the loading state indication.
  };

  const handleUpdate = (newStructure: PageData) => {
    setPageData(newStructure);
  };
  
  const handleLoadingComplete = () => {
    setIsLoading(false);
  }

  if (!pageData && !isLoading) {
    return <OnboardingModal onGenerate={handleGenerate} />;
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

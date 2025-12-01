
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

const defaultPageData: PageData = {
  "pageStructure": [
    {
      "type": "hero",
      "headline": "צעצועים שמחים לכלבים מאושרים",
      "subheadline": "צעצועים אקולוגיים בעבודת יד, כי לחבר הכי טוב שלך מגיע את הטוב ביותר.",
      "cta": { "text": "קנו עכשיו", "href": "#pricing" },
      "image": { "src": "https://picsum.photos/seed/dog-hero/1200/800", "alt": "כלב שמח משחק עם צעצוע" }
    },
    {
      "type": "text-image",
      "headline": "עבודת יד, מחומרים טבעיים",
      "text": "כל צעצוע מיוצר באהבה מחומרים ממוחזרים ועמידים, בטוחים לכלב שלך וידידותיים לסביבה. אנחנו מאמינים שגם לכלבים מגיע ליהנות ממוצרים איכותיים שמכבדים את כדור הארץ.",
      "image": { "src": "https://picsum.photos/seed/eco-toys/600/400", "alt": "צעצועים אקולוגיים לכלבים" },
      "imagePosition": "right"
    },
    {
      "type": "testimonials",
      "headline": "מה לקוחות מספרים עלינו",
      "testimonials": [
        {
          "quote": "הכלב שלי לא עוזב את הבובה החדשה! סוף סוף צעצוע שהוא לא מצליח להרוס תוך חמש דקות. מומלץ בחום!",
          "author": "דנה כהן",
          "role": "אמא של לוקי",
          "avatar": { "src": "https://picsum.photos/seed/avatar1/100/100", "alt": "דנה כהן" }
        },
        {
          "quote": "שירות מעולה ומוצרים איכותיים. מרגישים שהושקעה מחשבה בכל פרט. אני בהחלט אזמין שוב.",
          "author": "אביב לוי",
          "role": "אבא של רקס",
          "avatar": { "src": "https://picsum.photos/seed/avatar2/100/100", "alt": "אביב לוי" }
        }
      ]
    },
    {
      "type": "faq",
      "headline": "שאלות נפוצות",
      "questions": [
        { "question": "האם הצעצועים בטוחים לכלבים קטנים?", "answer": "בהחלט. כל החומרים שלנו טבעיים ולא רעילים, והצעצועים מגיעים בגדלים שונים המותאמים לגזעים קטנים וגדולים." },
        { "question": "איך מנקים את הצעצועים?", "answer": "את רוב הצעצועים שלנו ניתן לכבס במכונה בתוכנית עדינה. הוראות ניקוי מפורטות מצורפות לכל מוצר." },
        { "question": "מהי מדיניות המשלוחים שלכם?", "answer": "אנחנו מציעים משלוח מהיר לכל חלקי הארץ תוך 3-5 ימי עסקים." }
      ]
    },
    {
      "type": "cta",
      "headline": "פנקו את הכלב שלכם עוד היום!",
      "subheadline": "הצטרפו למאות בעלי כלבים שכבר בחרו בטוב ביותר עבור חיות המחמד שלהם.",
      "cta": { "text": "לכל הצעצועים", "href": "#" }
    }
  ]
};

export function Editor() {
  const [pageData, setPageData] = useState<PageData | null>(defaultPageData);
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
        // Attempt to fix common AI JSON errors, like trailing commas
        const fixedJsonString = pageStructureString
          .replace(/,\s*([}\]])/g, '$1') // Remove trailing commas
          .replace(/(\r\n|\n|\r)/gm, ""); // Remove newlines

        parsedData = JSON.parse(fixedJsonString);
      } catch (e) {
        console.error("Could not parse JSON:", e);
        throw new Error("Invalid JSON response from AI.");
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
    // Set isGenerating to false since we are not using the modal for generation in this flow.
    return <OnboardingModal onGenerate={handleGenerate} isGenerating={false} />;
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

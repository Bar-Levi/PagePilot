
"use client";

import type { PageData } from "../landing-page/types";
import { EditorSidebar } from "./editor-sidebar";
import { Canvas } from "./canvas";
import { Rocket, Download, Settings, Share2, Undo, Redo } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useHistoryState } from "@/hooks/use-history-state";

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
      "type": "richtext",
      "align": "center",
      "spacing": 8,
      "content": [
        { "text": "ברוכים הבאים לעולם של ", "size": 20 },
        { "text": "צעצועי כלבים", "size": 20, "bold": true, "color": "hsl(var(--primary))" },
        { "text": " שעשויים באהבה ודאגה לסביבה!", "size": 20 }
      ]
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
  const { state: pageData, setState: setPageData, undo, redo, canUndo, canRedo } = useHistoryState<PageData | null>(defaultPageData);
  
  const handleUpdate = (newStructure: PageData) => {
    setPageData(newStructure);
  };
  
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
          <div className="flex-1 overflow-auto">
            <Canvas
              pageData={pageData}
              isLoading={false}
              onUpdate={handleUpdate}
            />
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}

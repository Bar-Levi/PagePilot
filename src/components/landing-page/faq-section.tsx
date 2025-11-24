import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqSectionData } from "./types";

export function FaqSection({ headline, questions }: FaqSectionData) {
  const defaultQuestions = [
      { question: "Is it easy to use?", answer: "Yes, our platform is designed to be intuitive and user-friendly, allowing you to get started in minutes." },
      { question: "Can I customize the design?", answer: "Absolutely! You have full control over colors, fonts, and layouts to match your brand." },
      { question: "Do you offer a free trial?", answer: "We offer a free plan that includes all the basic features. You can upgrade anytime for more advanced capabilities." },
      { question: "What is your refund policy?", answer: "We offer a 30-day money-back guarantee on all our paid plans. No questions asked." },
  ];

  const displayQuestions = questions && questions.length > 0 ? questions : defaultQuestions;

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container max-w-3xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">
            {headline || "Frequently Asked Questions"}
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {displayQuestions.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg font-medium text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

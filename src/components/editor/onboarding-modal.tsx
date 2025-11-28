"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Rocket } from "lucide-react";

const formSchema = z.object({
  businessDescription: z.string().min(10, {
    message: "אנא ספק תיאור מפורט (לפחות 10 תווים).",
  }),
  targetAudience: z.string().min(5, {
    message: "אנא תאר את קהל היעד שלך.",
  }),
  tone: z.string().min(3, {
    message: "אנא תאר את הטון הרצוי.",
  }),
});

type OnboardingModalProps = {
  onGenerate: (data: z.infer<typeof formSchema>) => Promise<void>;
  isGenerating: boolean;
};

export function OnboardingModal({ onGenerate, isGenerating }: OnboardingModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessDescription: "",
      targetAudience: "",
      tone: "מקצועי",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await onGenerate(values);
  }

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[525px]" dir="rtl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline flex items-center gap-2">
                <Rocket className="w-6 h-6 text-primary" /> בואו נבנה את הדף שלכם
              </DialogTitle>
              <DialogDescription>
                ספרו לנו על העסק שלכם, וה-AI שלנו ייצור טיוטה ראשונית מרשימה.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="businessDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>תיאור העסק</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="לדוגמה: חנות אונליין שמוכרת צעצועים אקולוגיים בעבודת יד לכלבים."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>קהל יעד</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="לדוגמה: בעלי כלבים באזורים עירוניים."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>טון המותג</FormLabel>
                    <FormControl>
                      <Input placeholder="לדוגמה: שובב וידידותי" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isGenerating} className="w-full">
                {isGenerating ? (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                ) : (
                  "צרו את הדף שלי"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

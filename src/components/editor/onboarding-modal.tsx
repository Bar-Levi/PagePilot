"use client";

import { useState } from "react";
import { useForm, zodResolver } from "@hookform/resolvers/zod";
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
  businessDescription: z.string().min(20, {
    message: "Please provide a detailed description (at least 20 characters).",
  }),
  targetAudience: z.string().min(5, {
    message: "Please describe your target audience.",
  }),
  tone: z.string().min(3, {
    message: "Please describe the desired tone.",
  }),
});

type OnboardingModalProps = {
  onGenerate: (data: z.infer<typeof formSchema>) => Promise<void>;
};

export function OnboardingModal({ onGenerate }: OnboardingModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessDescription: "",
      targetAudience: "",
      tone: "Professional",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    await onGenerate(values);
    // No need to set isGenerating to false here, the parent component will unmount this modal.
  }

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[525px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline flex items-center gap-2">
                <Rocket className="w-6 h-6 text-primary" /> Let's Build Your Page
              </DialogTitle>
              <DialogDescription>
                Tell us about your business, and our AI will create a stunning
                first draft.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="businessDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., An online store that sells eco-friendly, handmade dog toys."
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
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Dog owners in urban areas."
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
                    <FormLabel>Brand Tone</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Playful and friendly" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isGenerating} className="w-full">
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Generate My Page"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { suggestAICopywritingImprovements } from '@/ai/flows/suggest-ai-copywriting-improvements';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const formSchema = z.object({
  businessType: z.string().min(3, 'Please enter a business type.'),
  targetAudience: z.string().min(3, 'Please enter a target audience.'),
  currentTitle: z.string().optional(),
  currentCTA: z.string().optional(),
  currentValueProposition: z.string().optional(),
  currentBenefitStatements: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AiCopywritingPanel() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessType: '',
      targetAudience: '',
      currentTitle: '',
      currentCTA: '',
      currentValueProposition: '',
      currentBenefitStatements: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await suggestAICopywritingImprovements(values);
      setSuggestions(result);
      toast({
        title: 'Suggestions Ready!',
        description: 'AI has generated some copywriting ideas for you.',
      });
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to Get Suggestions',
        description: 'There was an error generating suggestions. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4 space-y-6" dir="rtl">
      <div>
        <h3 className="text-md font-medium">AI Copywriting Assistant</h3>
        <p className="text-sm text-muted-foreground">
          Get AI-powered suggestions to improve your landing page copy.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="businessType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>סוג העסק</FormLabel>
                <FormControl>
                  <Input placeholder="לדוגמה: חנות אונליין לחיות מחמד" {...field} />
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
                  <Input placeholder="לדוגמה: בעלי כלבים וחתולים" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currentTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>כותרת נוכחית (אופציונלי)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currentCTA"
            render={({ field }) => (
              <FormItem>
                <FormLabel>קריאה לפעולה נוכחית (אופציונלי)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currentValueProposition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>הצעת ערך נוכחית (אופציונלי)</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Get Suggestions
              </>
            )}
          </Button>
        </form>
      </Form>

      {suggestions && (
        <div className="space-y-4">
            <h4 className="text-lg font-semibold">הצעות מה-AI</h4>
            {suggestions.improvedTitle && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">כותרת משופרת</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{suggestions.improvedTitle}</p>
                    </CardContent>
                </Card>
            )}
            {suggestions.improvedCTA && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">קריאה לפעולה משופרת</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{suggestions.improvedCTA}</p>
                    </CardContent>
                </Card>
            )}
            {suggestions.improvedValueProposition && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">הצעת ערך משופרת</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{suggestions.improvedValueProposition}</p>
                    </CardContent>
                </Card>
            )}
            {suggestions.reasoning && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">הסבר</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{suggestions.reasoning}</p>
                    </CardContent>
                </Card>
            )}
        </div>
      )}
    </div>
  );
}

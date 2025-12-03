"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Rocket, Plus, X, Zap } from "lucide-react";
import { BusinessContextUpload } from "./business-context-upload";
import { GenerationProgress } from "./generation-progress";
import { useToast } from "@/hooks/use-toast";
import { useEditorStore } from "@/hooks/use-editor-store";
import { useState } from "react";

const businessInputSchema = z.object({
  businessName: z.string().min(2, {
    message: "שם העסק חייב להכיל לפחות 2 תווים",
  }),
  businessType: z.string().min(3, {
    message: "אנא תאר את סוג העסק",
  }),
  audience: z.string().min(5, {
    message: "אנא תאר את קהל היעד",
  }),
  mainGoal: z.enum(["leads", "sales", "booking", "newsletter"], {
    required_error: "אנא בחר מטרה עיקרית",
  }),
  tone: z.enum(["professional", "friendly", "youthful", "luxury"], {
    required_error: "אנא בחר טון",
  }),
  pains: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  proofPoints: z.array(z.string()).optional(),
  specialOffer: z.string().optional(),
  businessContext: z.string().optional(),
});

type BusinessInputFormData = z.infer<typeof businessInputSchema>;

export function BusinessInputForm() {
  const { toast } = useToast();
  const setPageJson = useEditorStore((s) => s.setPageJson);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pains, setPains] = useState<string[]>([]);
  const [currentPain, setCurrentPain] = useState("");
  const [benefits, setBenefits] = useState<string[]>([]);
  const [currentBenefit, setCurrentBenefit] = useState("");
  const [proofPoints, setProofPoints] = useState<string[]>([]);
  const [currentProofPoint, setCurrentProofPoint] = useState("");

  const form = useForm<BusinessInputFormData>({
    resolver: zodResolver(businessInputSchema),
    defaultValues: {
      businessName: "",
      businessType: "",
      audience: "",
      mainGoal: "leads",
      tone: "professional",
      pains: [],
      benefits: [],
      proofPoints: [],
      specialOffer: "",
      businessContext: "",
    },
  });

  const addPain = () => {
    if (currentPain.trim()) {
      const newPains = [...pains, currentPain.trim()];
      setPains(newPains);
      form.setValue("pains", newPains);
      setCurrentPain("");
    }
  };

  const removePain = (index: number) => {
    const newPains = pains.filter((_, i) => i !== index);
    setPains(newPains);
    form.setValue("pains", newPains);
  };

  const addBenefit = () => {
    if (currentBenefit.trim()) {
      const newBenefits = [...benefits, currentBenefit.trim()];
      setBenefits(newBenefits);
      form.setValue("benefits", newBenefits);
      setCurrentBenefit("");
    }
  };

  const removeBenefit = (index: number) => {
    const newBenefits = benefits.filter((_, i) => i !== index);
    setBenefits(newBenefits);
    form.setValue("benefits", newBenefits);
  };

  const addProofPoint = () => {
    if (currentProofPoint.trim()) {
      const newProofPoints = [...proofPoints, currentProofPoint.trim()];
      setProofPoints(newProofPoints);
      form.setValue("proofPoints", newProofPoints);
      setCurrentProofPoint("");
    }
  };

  const removeProofPoint = (index: number) => {
    const newProofPoints = proofPoints.filter((_, i) => i !== index);
    setProofPoints(newProofPoints);
    form.setValue("proofPoints", newProofPoints);
  };

  const handleAutoFill = () => {
    // Fill all fields with realistic data for Hermes Finance
    form.setValue("businessName", "Hermes Finance");
    form.setValue("businessType", "חברת יעוץ פיננסי המתמחה בסיוע לצעירים בגילאי 20-30 בניהול כספים, השקעות, תכנון פיננסי וחיסכון. אנו מספקים כלים, הדרכות וייעוץ אישי כדי לעזור לצעירים להשיג עצמאות פיננסית ולבנות עתיד כלכלי יציב.");
    form.setValue("audience", "צעירים בגילאי 20-30 שמתחילים את דרכם המקצועית, רוצים ללמוד לנהל כספים נכון, לחסוך לעתיד, להשקיע בחכמה ולבנות בסיס פיננסי איתן. אנשים שמחפשים הדרכה מקצועית וכלים פרקטיים לניהול כספים.");
    
    // Set dropdowns
    form.setValue("mainGoal", "leads");
    form.setValue("tone", "professional");
    
    // Fill pains
    const autoPains = [
      "קושי בניהול תקציב חודשי וניפוץ על הוצאות מיותרות",
      "חוסר ידע בהשקעות וחשש מהתחלת השקעה",
      "חוסר הבנה במוצרים פיננסיים (פנסיה, ביטוח, משכנתא)",
      "קושי לחסוך כסף בגלל הכנסה נמוכה או הוצאות גבוהות",
      "חוסר מודעות לחשיבות תכנון פיננסי לטווח ארוך"
    ];
    setPains(autoPains);
    form.setValue("pains", autoPains);
    
    // Fill benefits
    const autoBenefits = [
      "ייעוץ פיננסי מותאם אישית לצעירים - ללא עמלות נסתרות",
      "כלים דיגיטליים לניהול תקציב ועקבות אחר הוצאות",
      "הדרכות מעשיות על השקעות, חיסכון ותכנון פיננסי",
      "ליווי צמוד בבניית תוכנית פיננסית לטווח קצר וארוך",
      "גישה למומחים פיננסיים ללא עלות גבוהה"
    ];
    setBenefits(autoBenefits);
    form.setValue("benefits", autoBenefits);
    
    // Fill proof points
    const autoProofPoints = [
      "מעל 5,000 צעירים כבר השתמשו בשירותים שלנו",
      "95% מהלקוחות מדווחים על שיפור בהבנה הפיננסית",
      "ממוצע חיסכון של 15% מההכנסה לאחר 3 חודשים",
      "דירוג 4.8/5 מהלקוחות בפלטפורמות הביקורות"
    ];
    setProofPoints(autoProofPoints);
    form.setValue("proofPoints", autoProofPoints);
    
    // Fill special offer
    form.setValue("specialOffer", "ייעוץ ראשוני חינם + גישה חינמית לכלים הדיגיטליים למשך 30 יום");
    
    // Fill business context
    const businessContext = `Hermes Finance - חברת יעוץ פיננסי לצעירים

על החברה:
Hermes Finance היא חברת יעוץ פיננסי המתמחה בסיוע לצעירים בגילאי 20-30 בניהול כספים נכון. החברה הוקמה מתוך הבנה שצעירים רבים מתחילים את דרכם המקצועית ללא ידע מספק בניהול כספים, השקעות ותכנון פיננסי.

השירותים שלנו:
- ייעוץ פיננסי אישי - פגישות אחד על אחד עם יועצים מקצועיים
- כלים דיגיטליים לניהול תקציב - אפליקציה לניהול הוצאות והכנסות
- הדרכות וסדנאות - על השקעות, חיסכון, פנסיה וביטוח
- תוכניות חיסכון מותאמות - עזרה בבניית תוכנית חיסכון לטווח קצר וארוך
- ליווי בהשקעות ראשונות - הדרכה צעד אחר צעד להשקעה ראשונה

קהל היעד:
צעירים בגילאי 20-30 שמתחילים את דרכם המקצועית, רוצים ללמוד לנהל כספים נכון, לחסוך לעתיד, להשקיע בחכמה ולבנות בסיס פיננסי איתן.

הערכים שלנו:
- שקיפות מלאה - ללא עמלות נסתרות או תנאים קטנים
- התאמה אישית - כל תוכנית מותאמת למצב האישי של הלקוח
- חינוך פיננסי - לא רק ייעוץ אלא גם לימוד והדרכה
- נגישות - מחירים הוגנים לצעירים, ללא דמי ניהול גבוהים

הצלחות:
- מעל 5,000 צעירים כבר השתמשו בשירותים שלנו
- 95% מהלקוחות מדווחים על שיפור בהבנה הפיננסית
- ממוצע חיסכון של 15% מההכנסה לאחר 3 חודשים
- דירוג 4.8/5 מהלקוחות בפלטפורמות הביקורות`;
    
    form.setValue("businessContext", businessContext);
    
    toast({
      title: "הטופס מולא אוטומטית",
      description: "כל השדות מולאו עם נתוני Hermes Finance. אתה יכול לערוך אותם לפי הצורך.",
    });
  };

  async function onSubmit(values: BusinessInputFormData) {
    setIsGenerating(true);
    
    try {
      const response = await fetch("/api/generate-page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          pains: pains,
          benefits: benefits,
          proofPoints: proofPoints.length > 0 ? proofPoints : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate page");
      }

      const result = await response.json();
      
      // Log the final page JSON for debugging
      console.log("🎉 Page generated successfully!");
      console.log("📄 Final Page JSON:", JSON.stringify(result.page, null, 2));
      console.log("📊 Analytics:", JSON.stringify(result.analytics, null, 2));
      console.log("📈 Page has", result.page.children?.length || 0, "sections");
      
      setPageJson(result.page);
      
      toast({
        title: "הדף נוצר בהצלחה!",
        description: `הדף מוכן לעריכה עם ${result.page.children?.length || 0} סקשנים. הסוכנים יצרו עבורך דף מותאם אישית.`,
      });
    } catch (error: any) {
      console.error("Error generating page:", error);
      toast({
        variant: "destructive",
        title: "שגיאה ביצירת הדף",
        description: error.message || "לא ניתן ליצור את הדף. נסה שוב.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      {/* Loading Indicator */}
      {isGenerating && <GenerationProgress />}
      
      <div className="w-full max-w-4xl">
        <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 mb-4">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              בואו נבנה את דף הנחיתה שלכם
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              מלאו את הפרטים הבאים כדי שהסוכנים שלנו ייצרו עבורכם דף מותאם אישית
            </p>
            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleAutoFill}
                className="gap-2"
              >
                <Zap className="w-4 h-4" />
                מילוי אוטומטי (Hermes Finance)
              </Button>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
              {/* Disable form when generating */}
              {isGenerating && (
                <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm z-10 rounded-2xl" />
              )}
              {/* מידע בסיסי */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white border-b pb-2">
                  מידע בסיסי
                </h2>
                
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>שם העסק *</FormLabel>
                      <FormControl>
                        <Input placeholder="לדוגמה: חנות צעצועים לכלבים" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>סוג העסק *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="תאר את סוג העסק שלך (לדוגמה: חנות אונליין שמוכרת צעצועים אקולוגיים בעבודת יד לכלבים)"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        תיאור מפורט יעזור לסוכנים להבין את העסק שלך
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="audience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>קהל יעד *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="תאר את קהל היעד שלך (לדוגמה: בעלי כלבים באזורים עירוניים שאכפת להם מהסביבה)"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* מטרה וטון */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white border-b pb-2">
                  מטרה וטון
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="mainGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>מטרה עיקרית *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="בחר מטרה" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="leads">יצירת לידים</SelectItem>
                            <SelectItem value="sales">מכירות ישירות</SelectItem>
                            <SelectItem value="booking">תיאום פגישות</SelectItem>
                            <SelectItem value="newsletter">הרשמה לניוזלטר</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>טון המותג *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="בחר טון" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="professional">מקצועי</SelectItem>
                            <SelectItem value="friendly">ידידותי</SelectItem>
                            <SelectItem value="youthful">צעיר</SelectItem>
                            <SelectItem value="luxury">יוקרתי</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* כאבים */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white border-b pb-2">
                  כאבים של קהל היעד
                </h2>
                <FormDescription>
                  מה הבעיות העיקריות שקהל היעד שלך מתמודד איתן?
                </FormDescription>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="לדוגמה: קשה למצוא מוצרים איכותיים"
                    value={currentPain}
                    onChange={(e) => setCurrentPain(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addPain();
                      }
                    }}
                  />
                  <Button type="button" onClick={addPain} size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {pains.length > 0 && (
                  <div className="space-y-2">
                    {pains.map((pain, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded-md"
                      >
                        <span className="text-sm">{pain}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePain(index)}
                          className="h-6 w-6"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* יתרונות */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white border-b pb-2">
                  יתרונות והבטחות
                </h2>
                <FormDescription>
                  מה היתרונות העיקריים שהעסק שלך מציע?
                </FormDescription>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="לדוגמה: חוסך זמן ומאמץ"
                    value={currentBenefit}
                    onChange={(e) => setCurrentBenefit(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addBenefit();
                      }
                    }}
                  />
                  <Button type="button" onClick={addBenefit} size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {benefits.length > 0 && (
                  <div className="space-y-2">
                    {benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded-md"
                      >
                        <span className="text-sm">{benefit}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBenefit(index)}
                          className="h-6 w-6"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* נקודות הוכחה */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white border-b pb-2">
                  נקודות הוכחה (אופציונלי)
                </h2>
                <FormDescription>
                  המלצות, סטטיסטיקות, או מקרי בוחן שמחזקים את האמינות
                </FormDescription>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="לדוגמה: 95% מהלקוחות מרוצים"
                    value={currentProofPoint}
                    onChange={(e) => setCurrentProofPoint(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addProofPoint();
                      }
                    }}
                  />
                  <Button type="button" onClick={addProofPoint} size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {proofPoints.length > 0 && (
                  <div className="space-y-2">
                    {proofPoints.map((point, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded-md"
                      >
                        <span className="text-sm">{point}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeProofPoint(index)}
                          className="h-6 w-6"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* הצעה מיוחדת */}
              <FormField
                control={form.control}
                name="specialOffer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>הצעה מיוחדת (אופציונלי)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="לדוגמה: 20% הנחה לשבוע הראשון"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      אם יש לך הצעה מיוחדת או מבצע, הזן אותו כאן
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* הקשר עסקי - RAG */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white border-b pb-2">
                  מסמכים והקשר עסקי (RAG)
                </h2>
                <FormDescription>
                  העלה מסמכים או הזן מידע נוסף. הסוכן לכתיבת תוכן ישתמש רק במידע הזה!
                </FormDescription>
                <BusinessContextUpload
                  onContextChange={(context) =>
                    form.setValue("businessContext", context)
                  }
                  currentContext={form.watch("businessContext")}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                      הסוכנים עובדים על הדף שלך...
                    </>
                  ) : (
                    <>
                      <Rocket className="ml-2 h-5 w-5" />
                      צרו את הדף שלי עם AI
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}


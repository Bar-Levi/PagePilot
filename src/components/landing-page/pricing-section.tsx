import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import type { PricingSectionData } from "./types";
import { cn } from "@/lib/utils";

export function PricingSection({ headline, plans, onUpdate }: PricingSectionData & { onUpdate: (d: Partial<PricingSectionData>) => void }) {
    const defaultPlans = [
    { name: "Starter", price: "0", frequency: "month", features: ["1 Landing Page", "AI Generation", "Basic Analytics"], cta: { text: "Start for Free", href: "#" } },
    { name: "Pro", price: "29", frequency: "month", features: ["10 Landing Pages", "AI Copywriting", "Advanced Analytics", "Custom Domain"], cta: { text: "Get Started", href: "#" }, isFeatured: true },
    { name: "Business", price: "79", frequency: "month", features: ["Unlimited Pages", "Team Collaboration", "API Access", "Priority Support"], cta: { text: "Contact Us", href: "#" } },
  ];

  const displayPlans = plans && plans.length > 0 ? plans : defaultPlans;

  const handlePlanUpdate = (planIndex: number, field: 'name' | 'price' | 'frequency' | 'ctaText', value: string) => {
    const updatedPlans = [...displayPlans];
    if (field === 'ctaText') {
      updatedPlans[planIndex].cta.text = value;
    } else {
      (updatedPlans[planIndex] as any)[field] = value;
    }
    onUpdate({ plans: updatedPlans });
  };
  
  const handleFeatureUpdate = (planIndex: number, featureIndex: number, value: string) => {
    const updatedPlans = [...displayPlans];
    updatedPlans[planIndex].features[featureIndex] = value;
    onUpdate({ plans: updatedPlans });
  };


  return (
    <section className="py-24 md:py-32 bg-secondary">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 
            className="text-3xl md:text-4xl font-bold font-headline"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate({ headline: e.currentTarget.textContent || "" })}
          >
            {headline || "Pricing Plans for Every Need"}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {displayPlans.map((plan, index) => (
            <Card key={index} className={cn("flex flex-col", plan.isFeatured && "border-primary ring-2 ring-primary shadow-lg")}>
              {plan.isFeatured && <Badge className="absolute -top-3 right-4">Most Popular</Badge>}
              <CardHeader>
                <CardTitle 
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handlePlanUpdate(index, 'name', e.currentTarget.textContent || "")}
                >
                  {plan.name}
                </CardTitle>
                <CardDescription>
                  <span 
                    className="text-4xl font-bold"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handlePlanUpdate(index, 'price', e.currentTarget.textContent || "")}
                  >
                    ${plan.price}
                  </span>
                  <span 
                    className="text-muted-foreground"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handlePlanUpdate(index, 'frequency', (e.currentTarget.textContent || "").replace('/', ''))}
                  >
                    /{plan.frequency}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleFeatureUpdate(index, i, e.currentTarget.textContent || "")}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant={plan.isFeatured ? "default" : "outline"}>
                  <Link href={plan.cta.href}>
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handlePlanUpdate(index, 'ctaText', e.currentTarget.textContent || "")}
                    >
                      {plan.cta.text}
                    </span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

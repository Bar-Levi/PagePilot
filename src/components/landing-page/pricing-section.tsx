import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import type { PricingSectionData } from "./types";
import { cn } from "@/lib/utils";

export function PricingSection({ headline, plans }: PricingSectionData) {
    const defaultPlans = [
    { name: "Starter", price: "0", frequency: "month", features: ["1 Landing Page", "AI Generation", "Basic Analytics"], cta: { text: "Start for Free", href: "#" } },
    { name: "Pro", price: "29", frequency: "month", features: ["10 Landing Pages", "AI Copywriting", "Advanced Analytics", "Custom Domain"], cta: { text: "Get Started", href: "#" }, isFeatured: true },
    { name: "Business", price: "79", frequency: "month", features: ["Unlimited Pages", "Team Collaboration", "API Access", "Priority Support"], cta: { text: "Contact Us", href: "#" } },
  ];

  const displayPlans = plans && plans.length > 0 ? plans : defaultPlans;

  return (
    <section className="py-24 md:py-32 bg-secondary">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">
            {headline || "Pricing Plans for Every Need"}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {displayPlans.map((plan, index) => (
            <Card key={index} className={cn("flex flex-col", plan.isFeatured && "border-primary ring-2 ring-primary shadow-lg")}>
              {plan.isFeatured && <Badge className="absolute -top-3 right-4">Most Popular</Badge>}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.frequency}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant={plan.isFeatured ? "default" : "outline"}>
                  <Link href={plan.cta.href}>{plan.cta.text}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

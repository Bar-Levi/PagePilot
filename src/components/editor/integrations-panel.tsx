"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  BarChart3,
  Eye,
  FileSpreadsheet,
  ChevronDown,
  Check,
  HelpCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PageIntegrations } from "@/components/landing-page/types";

interface IntegrationsPanelProps {
  integrations: PageIntegrations;
  onChange: (integrations: PageIntegrations) => void;
}

export function IntegrationsPanel({ integrations, onChange }: IntegrationsPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  
  const [gaEnabled, setGaEnabled] = useState(!!integrations.googleAnalytics);
  const [clarityEnabled, setClarityEnabled] = useState(!!integrations.microsoftClarity);
  const [sheetsEnabled, setSheetsEnabled] = useState(!!integrations.sheetsWebhook);

  const handleChange = (field: keyof PageIntegrations, value: string) => {
    onChange({
      ...integrations,
      [field]: value || undefined,
    });
  };

  return (
    <TooltipProvider>
      <div className="border rounded-lg bg-card" dir="rtl">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">אינטגרציות</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="px-4 pb-4 space-y-4">
              <Separator />

              {/* Google Analytics */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    <Label htmlFor="ga-toggle" className="font-medium cursor-pointer">
                      Google Analytics 4
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[200px]">
                        מעקב אחר צפיות, התנהגות משתמשים והמרות בדף
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Switch
                    id="ga-toggle"
                    checked={gaEnabled}
                    onCheckedChange={(checked) => {
                      setGaEnabled(checked);
                      if (!checked) handleChange("googleAnalytics", "");
                    }}
                  />
                </div>
                {gaEnabled && (
                  <div className="pr-6 space-y-2">
                    <Input
                      placeholder="G-XXXXXXXXXX"
                      value={integrations.googleAnalytics || ""}
                      onChange={(e) => handleChange("googleAnalytics", e.target.value)}
                      className="text-left font-mono text-sm"
                      dir="ltr"
                    />
                    <p className="text-xs text-muted-foreground">
                      הזן את ה-Measurement ID מ-Google Analytics
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Microsoft Clarity */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-purple-500" />
                    <Label htmlFor="clarity-toggle" className="font-medium cursor-pointer">
                      Microsoft Clarity
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[200px]">
                        הקלטות מסך, מפות חום וניתוח התנהגות משתמשים
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Switch
                    id="clarity-toggle"
                    checked={clarityEnabled}
                    onCheckedChange={(checked) => {
                      setClarityEnabled(checked);
                      if (!checked) handleChange("microsoftClarity", "");
                    }}
                  />
                </div>
                {clarityEnabled && (
                  <div className="pr-6 space-y-2">
                    <Input
                      placeholder="Project ID"
                      value={integrations.microsoftClarity || ""}
                      onChange={(e) => handleChange("microsoftClarity", e.target.value)}
                      className="text-left font-mono text-sm"
                      dir="ltr"
                    />
                    <p className="text-xs text-muted-foreground">
                      הזן את ה-Project ID מ-Clarity
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Google Sheets Webhook */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-green-500" />
                    <Label htmlFor="sheets-toggle" className="font-medium cursor-pointer">
                      Google Sheets
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[200px]">
                        שליחת לידים מהטפסים ישירות לגיליון Google Sheets
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Switch
                    id="sheets-toggle"
                    checked={sheetsEnabled}
                    onCheckedChange={(checked) => {
                      setSheetsEnabled(checked);
                      if (!checked) handleChange("sheetsWebhook", "");
                    }}
                  />
                </div>
                {sheetsEnabled && (
                  <div className="pr-6 space-y-2">
                    <Input
                      placeholder="https://script.google.com/macros/s/..."
                      value={integrations.sheetsWebhook || ""}
                      onChange={(e) => handleChange("sheetsWebhook", e.target.value)}
                      className="text-left font-mono text-xs"
                      dir="ltr"
                    />
                    <p className="text-xs text-muted-foreground">
                      הזן את כתובת ה-Web App URL מ-Apps Script
                    </p>
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                      איך מגדירים Google Sheets Webhook?
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </TooltipProvider>
  );
}

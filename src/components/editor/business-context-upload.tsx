"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BusinessContextUploadProps {
  onContextChange: (context: string) => void;
  currentContext?: string;
}

export function BusinessContextUpload({
  onContextChange,
  currentContext = "",
}: BusinessContextUploadProps) {
  const [textContext, setTextContext] = useState(currentContext);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;

      const newFiles = Array.from(files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);

      // Process files to extract text
      setIsProcessing(true);
      try {
        const extractedTexts: string[] = [];

        for (const file of newFiles) {
          const text = await extractTextFromFile(file);
          extractedTexts.push(`=== ${file.name} ===\n${text}\n`);
        }

        const combinedText = extractedTexts.join("\n");
        const updatedContext =
          textContext + (textContext ? "\n\n" : "") + combinedText;
        setTextContext(updatedContext);
        onContextChange(updatedContext);

        toast({
          title: "קבצים עובדו בהצלחה",
          description: `${newFiles.length} קובץ/ים נוספו להקשר העסקי.`,
        });
      } catch (error) {
        console.error("Error processing files:", error);
        toast({
          variant: "destructive",
          title: "שגיאה בעיבוד קבצים",
          description: "חלק מהקבצים לא ניתן היה לעבד. נסה שוב.",
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [textContext, onContextChange, toast]
  );

  const extractTextFromFile = async (file: File): Promise<string> => {
    const fileType = file.type;

    if (fileType === "text/plain") {
      return await file.text();
    }

    if (fileType === "application/pdf") {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const { default: pdfParse } = await import("pdf-parse");
        const data = await pdfParse(Buffer.from(arrayBuffer));
        return data.text;
      } catch (error) {
        console.error("Error parsing PDF:", error);
        throw new Error(
          "לא ניתן לפרסר קובץ PDF. נסה שוב או הדבק את התוכן כטקסט."
        );
      }
    }

    if (fileType.includes("word") || fileType.includes("document")) {
      throw new Error(
        "עיבוד קבצי Word עדיין לא מיושם. אנא הדבק את התוכן כטקסט או המר ל-PDF."
      );
    }

    // For unknown types, try to read as text
    try {
      return await file.text();
    } catch {
      throw new Error(
        `סוג קובץ לא נתמך: ${fileType}. אנא השתמש בקבצי TXT או PDF.`
      );
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTextChange = (value: string) => {
    setTextContext(value);
    onContextChange(value);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          מסמכים והקשר עסקי
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4" dir="rtl">
        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            מידע טקסטואלי
          </label>
          <Textarea
            placeholder="הדבק או הקלד מידע על העסק שלך, מוצרים, שירותים, נקודות מכירה ייחודיות, פרטים על קהל היעד וכו'. ה-AI ישתמש בזה כדי ליצור דף נחיתה מותאם אישית."
            value={textContext}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={6}
            className="resize-none"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">
            העלאת מסמכים
          </label>
          <div className="flex items-center gap-2">
            <input
              type="file"
              multiple
              accept=".txt,.pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={isProcessing}
            />
            <label htmlFor="file-upload">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                disabled={isProcessing}
                asChild
              >
                <span>
                  <Upload className="w-4 h-4 ml-2" />
                  {isProcessing ? "מעבד..." : "העלה קבצים"}
                </span>
              </Button>
            </label>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            נתמך: קבצי TXT ו-PDF. תמיכה בקבצי Word בקרוב.
          </p>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">
              קבצים שהועלו
            </label>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Context Summary */}
        {textContext && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>הקשר מוכן:</strong> {textContext.length.toLocaleString()} תווים של
              מידע עסקי ישמשו להתאמה אישית של דף הנחיתה שלך.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import React, { useState, useCallback } from "react";
import { useEditorStore } from "@/hooks/use-editor-store";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Upload,
  XCircle,
  Loader2,
  Sparkles,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  extractTextFromFile,
  isValidFileType,
  getFileTypeLabel,
  formatFileSize,
} from "@/lib/document-processor";
import { cn } from "@/lib/utils";

type UploadedFile = {
  name: string;
  content: string;
  type: string;
  size: number;
};

type BusinessContextPanelProps = {
  onContextReady?: (context: string) => void;
};

export function BusinessContextPanel({
  onContextReady,
}: BusinessContextPanelProps) {
  const { toast } = useToast();
  const businessContext = useEditorStore((s) => s.businessContext);
  const setBusinessContext = useEditorStore((s) => s.setBusinessContext);

  const [textContext, setTextContext] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle text input change
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newText = e.target.value;
      setTextContext(newText);
      updateCombinedContext(newText, uploadedFiles);
    },
    [uploadedFiles]
  );

  // Handle file upload
  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      // Validate files
      const invalidFiles = files.filter((f) => !isValidFileType(f));
      if (invalidFiles.length > 0) {
        toast({
          variant: "destructive",
          title: "סוג קובץ לא נתמך",
          description: `הקבצים הבאים אינם נתמכים: ${invalidFiles.map((f) => f.name).join(", ")}`,
        });
        return;
      }

      setIsProcessing(true);

      try {
        const newUploadedFiles: UploadedFile[] = [];

        for (const file of files) {
          try {
            const content = await extractTextFromFile(file);
            newUploadedFiles.push({
              name: file.name,
              content,
              type: getFileTypeLabel(file),
              size: file.size,
            });
          } catch (error) {
            console.error(`Failed to process ${file.name}:`, error);
            toast({
              variant: "destructive",
              title: "שגיאה בעיבוד קובץ",
              description: `לא ניתן לעבד את הקובץ ${file.name}`,
            });
          }
        }

        const updatedFiles = [...uploadedFiles, ...newUploadedFiles];
        setUploadedFiles(updatedFiles);
        updateCombinedContext(textContext, updatedFiles);

        if (newUploadedFiles.length > 0) {
          toast({
            title: "קבצים נוספו בהצלחה",
            description: `${newUploadedFiles.length} קבצים עובדו ונוספו להקשר העסקי`,
          });
        }
      } finally {
        setIsProcessing(false);
        // Clear input
        e.target.value = "";
      }
    },
    [uploadedFiles, textContext, toast]
  );

  // Remove uploaded file
  const removeFile = useCallback(
    (fileName: string) => {
      const updatedFiles = uploadedFiles.filter((f) => f.name !== fileName);
      setUploadedFiles(updatedFiles);
      updateCombinedContext(textContext, updatedFiles);
    },
    [uploadedFiles, textContext]
  );

  // Update combined context
  const updateCombinedContext = useCallback(
    (text: string, files: UploadedFile[]) => {
      const parts: string[] = [];

      if (text.trim()) {
        parts.push(text.trim());
      }

      for (const file of files) {
        parts.push(`=== ${file.name} ===\n${file.content}`);
      }

      const combined = parts.join("\n\n---\n\n");
      setBusinessContext(combined);

      if (onContextReady) {
        onContextReady(combined);
      }
    },
    [setBusinessContext, onContextReady]
  );

  const hasContext = textContext.trim() || uploadedFiles.length > 0;
  const totalCharacters =
    textContext.length +
    uploadedFiles.reduce((sum, f) => sum + f.content.length, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
        <Building2 className="w-5 h-5" />
        <h3 className="font-semibold">הקשר עסקי (RAG)</h3>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        הוסף מידע על העסק שלך כדי ש-AI ייצור תוכן מותאם אישית
      </p>

      {/* Text Input */}
      <div className="space-y-2">
        <Label htmlFor="business-context">מידע טקסטואלי</Label>
        <Textarea
          id="business-context"
          placeholder="תאר את העסק שלך, המוצרים/שירותים, קהל היעד, ערכים ייחודיים..."
          value={textContext}
          onChange={handleTextChange}
          rows={5}
          className="resize-none"
        />
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label>העלאת קבצים</Label>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept=".txt,.pdf,.docx,.md,.json,.html"
            multiple
            onChange={handleFileUpload}
            disabled={isProcessing}
            className="hidden"
            id="file-upload"
          />
          <Label
            htmlFor="file-upload"
            className={cn(
              "flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer",
              "bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700",
              "border-slate-200 dark:border-slate-700",
              "transition-colors",
              isProcessing && "opacity-50 cursor-not-allowed"
            )}
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span className="text-sm">
              {isProcessing ? "מעבד..." : "בחר קבצים"}
            </span>
          </Label>
          <span className="text-xs text-slate-500">
            PDF, TXT, DOCX, MD, JSON, HTML
          </span>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <Label>קבצים שהועלו ({uploadedFiles.length})</Label>
          <ScrollArea className="h-32 rounded-md border">
            <div className="p-2 space-y-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-slate-500">
                        {file.type} • {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file.name)}
                    className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Status */}
      {hasContext && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <div className="flex-1">
            <p className="text-sm text-green-700 dark:text-green-300 font-medium">
              הקשר עסקי מוכן
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              {totalCharacters.toLocaleString()} תווים •{" "}
              {uploadedFiles.length > 0 && `${uploadedFiles.length} קבצים`}
            </p>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <Button className="w-full gap-2" disabled={!hasContext}>
        <Sparkles className="w-4 h-4" />
        צור דף נחיתה עם AI
      </Button>
    </div>
  );
}


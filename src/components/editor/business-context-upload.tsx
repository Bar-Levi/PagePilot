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
          title: "Files processed successfully",
          description: `${newFiles.length} file(s) added to business context.`,
        });
      } catch (error) {
        console.error("Error processing files:", error);
        toast({
          variant: "destructive",
          title: "Error processing files",
          description: "Some files could not be processed. Please try again.",
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
          "Failed to parse PDF file. Please try again or paste the content as text."
        );
      }
    }

    if (fileType.includes("word") || fileType.includes("document")) {
      throw new Error(
        "Word document processing not implemented yet. Please paste the content as text or convert to PDF."
      );
    }

    // For unknown types, try to read as text
    try {
      return await file.text();
    } catch {
      throw new Error(
        `Unsupported file type: ${fileType}. Please use TXT or PDF files.`
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
          Business Context & Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Business Information (Text)
          </label>
          <Textarea
            placeholder="Paste or type information about your business, products, services, unique selling points, target audience details, etc. The AI will use this to create a highly personalized landing page."
            value={textContext}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={6}
            className="resize-none"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Upload Documents
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
                  <Upload className="w-4 h-4 mr-2" />
                  {isProcessing ? "Processing..." : "Upload Files"}
                </span>
              </Button>
            </label>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Supported: TXT and PDF files. Word documents support coming soon.
          </p>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Uploaded Files
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
              <strong>Context ready:</strong> {textContext.length} characters of
              business information will be used to personalize your landing
              page.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import React, { useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNewEditorContext } from "@/hooks/use-new-editor-context";

export function GlobalRichTextToolbar() {
  const { selectedComponent, updateComponentProps } = useNewEditorContext();
  const [linkUrl, setLinkUrl] = useState("");

  const isRichTextSelected = selectedComponent?.type === "RichText";

  if (!isRichTextSelected) {
    return null;
  }

  const applyFormatting = (styleType: string, value?: any) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    // Ensure the selection is within a RichText element
    const richTextElement =
      range.commonAncestorContainer.nodeType === Node.TEXT_NODE
        ? range.commonAncestorContainer.parentElement?.closest(
            '[data-component-type="RichText"]'
          )
        : (range.commonAncestorContainer as Element).closest?.(
            '[data-component-type="RichText"]'
          );

    if (!richTextElement) return;

    // Create a span element with the appropriate styles
    const span = document.createElement("span");

    switch (styleType) {
      case "bold":
        span.style.fontWeight = "700";
        break;
      case "italic":
        span.style.fontStyle = "italic";
        break;
      case "underline":
        span.style.textDecoration = "underline";
        break;
      case "fontSize":
        span.style.fontSize = `${value}px`;
        break;
      case "color":
        span.style.color = value;
        break;
      case "link":
        if (value) {
          const link = document.createElement("a");
          link.href = value;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          range.surroundContents(link);
          return;
        }
        break;
    }

    if (styleType !== "link") {
      try {
        range.surroundContents(span);
      } catch (e) {
        // If surroundContents fails, wrap the content manually
        const contents = range.extractContents();
        span.appendChild(contents);
        range.insertNode(span);
      }
    }

    // Update the component's HTML in the JSON model
    const html = richTextElement.innerHTML;
    updateComponentProps(selectedComponent.id, { html });

    // Clear selection
    selection.removeAllRanges();
  };

  const applyAlignment = (alignment: "left" | "center" | "right") => {
    updateComponentProps(selectedComponent.id, { align: alignment });
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkUrl.trim()) {
      applyFormatting("link", linkUrl.trim());
      setLinkUrl("");
    }
  };

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center gap-1 p-2 max-w-screen-xl mx-auto">
        {/* Bold */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => applyFormatting("bold")}
          className="h-8 w-8 p-0"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </Button>

        {/* Italic */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => applyFormatting("italic")}
          className="h-8 w-8 p-0"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </Button>

        {/* Underline */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => applyFormatting("underline")}
          className="h-8 w-8 p-0"
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Alignment */}
        <Button
          variant={
            selectedComponent.props.align === "left" ? "default" : "ghost"
          }
          size="sm"
          onClick={() => applyAlignment("left")}
          className="h-8 w-8 p-0"
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </Button>

        <Button
          variant={
            selectedComponent.props.align === "center" ? "default" : "ghost"
          }
          size="sm"
          onClick={() => applyAlignment("center")}
          className="h-8 w-8 p-0"
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </Button>

        <Button
          variant={
            selectedComponent.props.align === "right" ? "default" : "ghost"
          }
          size="sm"
          onClick={() => applyAlignment("right")}
          className="h-8 w-8 p-0"
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Font Size */}
        <div className="flex items-center gap-1">
          <Type className="w-4 h-4 text-gray-500" />
          <Input
            type="number"
            defaultValue="16"
            onChange={(e) => {
              const size = parseInt(e.target.value);
              if (size > 0) {
                applyFormatting("fontSize", size);
              }
            }}
            className="w-16 h-7 text-xs"
            min="8"
            max="72"
            title="Font Size"
          />
        </div>

        {/* Color Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Text Color"
            >
              <div
                className="w-4 h-4 rounded border border-gray-300"
                style={{ backgroundColor: "#000000" }}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" side="bottom" align="start">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Text Color</Label>
              <Input
                type="color"
                defaultValue="#000000"
                onChange={(e) => applyFormatting("color", e.target.value)}
                className="w-full h-10"
              />
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Link */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Insert Link"
            >
              <Link className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" side="bottom" align="start">
            <form onSubmit={handleLinkSubmit} className="space-y-2">
              <Label className="text-sm font-medium">Link URL</Label>
              <Input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-48"
              />
              <Button type="submit" size="sm" className="w-full">
                Insert Link
              </Button>
            </form>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

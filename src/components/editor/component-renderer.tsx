"use client";

import React from "react";
import type { PageComponent } from "@/components/landing-page/types";
import { useEditorStore } from "@/hooks/use-editor-store";
import { cn } from "@/lib/utils";
import NextImage from "next/image";
import NextLink from "next/link";
import { Button as ShadcnButton } from "@/components/ui/button";
import { cleanAllHTML } from "@/lib/richtext-helpers";

// ============================================================================
// Component Renderers
// ============================================================================

type ComponentRendererProps = {
  node: PageComponent;
  isEditing: boolean;
};

export function ComponentRenderer({ node, isEditing }: ComponentRendererProps) {
  switch (node.type) {
    case "Page":
      return <PageRenderer node={node} />;
    case "Container":
      return <ContainerRenderer node={node} />;
    case "RichText":
      return <RichTextRenderer node={node} isEditing={isEditing} />;
    case "Button":
      return <ButtonRenderer node={node} isEditing={isEditing} />;
    case "Image":
      return <ImageRenderer node={node} isEditing={isEditing} />;
    case "Video":
      return <VideoRenderer node={node} />;
    case "TextContainer":
      return <TextContainerRenderer node={node} />;
    case "TextSpan":
      return <TextSpanRenderer node={node} />;
    case "Divider":
      return <DividerRenderer node={node} />;
    default:
      return <UnknownRenderer node={node} />;
  }
}

// ============================================================================
// Page Renderer (root container)
// ============================================================================

function PageRenderer({ node }: { node: PageComponent }) {
  return (
    <div className="min-h-screen" data-component-id={node.id}>
      {/* Children are rendered by renderNode in canvas */}
    </div>
  );
}

// ============================================================================
// Container Renderer
// ============================================================================

function ContainerRenderer({ node }: { node: PageComponent }) {
  const props = node.props as any;
  const style = props.style || {};

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: style.flexDirection || "column",
    alignItems: style.alignItems || "stretch",
    justifyContent: style.justifyContent || "flex-start",
    gap: typeof style.gap === "number" ? `${style.gap}px` : style.gap,
    padding:
      typeof style.padding === "number" ? `${style.padding}px` : style.padding,
    background: style.background,
    borderRadius:
      typeof style.radius === "number" ? `${style.radius}px` : style.radius,
    border: style.border,
    width: style.width || "100%",
    maxWidth: style.maxWidth,
  };

  return (
    <div style={containerStyle} data-component-id={node.id}>
      {/* Children are rendered by renderNode */}
    </div>
  );
}

// ============================================================================
// RichText Renderer
// ============================================================================

function RichTextRenderer({
  node,
  isEditing,
}: {
  node: PageComponent;
  isEditing: boolean;
}) {
  const props = node.props as any;
  const updateProps = useEditorStore((s) => s.updateProps);
  const setActiveRichTextElement = useEditorStore(
    (s) => s.setActiveRichTextElement
  );
  const selectedId = useEditorStore((s) => s.selectedId);
  const divRef = React.useRef<HTMLDivElement>(null);

  const handleInput = () => {
    if (divRef.current) {
      updateProps(node.id, { html: divRef.current.innerHTML });
    }
  };

  const handleFocus = () => {
    if (divRef.current) {
      setActiveRichTextElement(divRef.current);
    }
  };

  const handleClick = () => {
    // When clicking on RichText (even without editing), set active element
    // This allows alignment to work without needing to select text
    if (divRef.current) {
      setActiveRichTextElement(divRef.current);
    }
  };

  const handleBlur = () => {
    // Keep the element reference for toolbar actions
  };

  React.useEffect(() => {
    // Set active element when component is selected (for alignment controls)
    if (divRef.current && selectedId === node.id) {
      setActiveRichTextElement(divRef.current);
    }
  }, [selectedId, node.id, setActiveRichTextElement]);

  React.useEffect(() => {
    if (divRef.current && isEditing) {
      setActiveRichTextElement(divRef.current);
    }
  }, [isEditing, setActiveRichTextElement]);

  // Clean HTML when it changes (normalize all spans and styles)
  React.useEffect(() => {
    if (divRef.current && props.html) {
      const cleaned = cleanAllHTML(props.html);
      if (cleaned !== divRef.current.innerHTML) {
        divRef.current.innerHTML = cleaned;
        // Update the store with cleaned HTML
        updateProps(node.id, { html: cleaned });
      }
    }
  }, [props.html, node.id, updateProps]);

  const style: React.CSSProperties = {
    textAlign: props.align || "left",
    outline: "none",
    minHeight: "1em",
    cursor: isEditing ? "text" : "default",
  };

  if (isEditing) {
    return (
      <div
        ref={divRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleClick}
        style={style}
        dangerouslySetInnerHTML={{ __html: props.html || "" }}
        data-component-id={node.id}
        className="focus:outline-none"
      />
    );
  }

  return (
    <div
      ref={divRef}
      onClick={handleClick}
      style={style}
      dangerouslySetInnerHTML={{ __html: props.html || "" }}
      data-component-id={node.id}
    />
  );
}

// ============================================================================
// Button Renderer
// ============================================================================

function ButtonRenderer({
  node,
  isEditing,
}: {
  node: PageComponent;
  isEditing: boolean;
}) {
  const props = node.props as any;
  const updateProps = useEditorStore((s) => s.updateProps);

  if (isEditing) {
    return (
      <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border">
        <div>
          <label className="block text-sm font-medium mb-1">טקסט הכפתור</label>
          <input
            type="text"
            value={props.text || ""}
            onChange={(e) => updateProps(node.id, { text: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm"
            placeholder="הזן טקסט..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">קישור (URL)</label>
          <input
            type="url"
            value={props.href || ""}
            onChange={(e) => updateProps(node.id, { href: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm"
            placeholder="https://..."
          />
        </div>
      </div>
    );
  }

  const buttonStyle: React.CSSProperties = {
    borderRadius: props.radius,
    fontWeight: props.fontWeight,
    padding: props.padding,
  };

  return (
    <ShadcnButton
      variant={props.variant || "default"}
      size={props.size || "default"}
      style={buttonStyle}
      asChild
      data-component-id={node.id}
    >
      <NextLink href={props.href || "#"} onClick={(e) => e.preventDefault()}>
        {props.text || "כפתור"}
      </NextLink>
    </ShadcnButton>
  );
}

// ============================================================================
// Image Renderer
// ============================================================================

function ImageRenderer({
  node,
  isEditing,
}: {
  node: PageComponent;
  isEditing: boolean;
}) {
  const props = node.props as any;
  const updateProps = useEditorStore((s) => s.updateProps);

  if (isEditing) {
    return (
      <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border">
        <div>
          <label className="block text-sm font-medium mb-1">כתובת תמונה</label>
          <input
            type="url"
            value={props.src || ""}
            onChange={(e) => updateProps(node.id, { src: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">טקסט חלופי</label>
          <input
            type="text"
            value={props.alt || ""}
            onChange={(e) => updateProps(node.id, { alt: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm"
            placeholder="תיאור התמונה..."
          />
        </div>
        {props.src && (
          <div className="mt-2">
            <NextImage
              src={props.src}
              alt={props.alt || "Preview"}
              width={200}
              height={150}
              className="rounded object-cover"
            />
          </div>
        )}
      </div>
    );
  }

  const alignmentClass = {
    left: "mr-auto",
    center: "mx-auto",
    right: "ml-auto",
  }[props.alignment || "center"];

  const imageStyle: React.CSSProperties = {
    width: typeof props.width === "number" ? `${props.width}px` : props.width,
    maxWidth:
      typeof props.maxWidth === "number"
        ? `${props.maxWidth}px`
        : props.maxWidth,
    borderRadius: props.rounded,
    boxShadow: props.shadow,
  };

  return (
    <div className={cn(alignmentClass)} data-component-id={node.id}>
      <div style={imageStyle} className="relative aspect-video">
        <NextImage
          src={props.src || "https://picsum.photos/seed/placeholder/600/400"}
          alt={props.alt || "Image"}
          fill
          className="object-cover rounded"
        />
      </div>
    </div>
  );
}

// ============================================================================
// Video Renderer
// ============================================================================

function VideoRenderer({ node }: { node: PageComponent }) {
  const props = node.props as any;

  const ratioClass = {
    "16:9": "aspect-video",
    "4:3": "aspect-[4/3]",
    "1:1": "aspect-square",
  }[props.ratio || "16:9"];

  const alignmentClass = {
    left: "mr-auto",
    center: "mx-auto",
    right: "ml-auto",
  }[props.alignment || "center"];

  return (
    <div
      className={cn("w-full max-w-2xl", alignmentClass)}
      data-component-id={node.id}
    >
      <div className={cn("relative", ratioClass)}>
        <iframe
          src={`https://www.youtube.com/embed/${props.youtubeId || "dQw4w9WgXcQ"}?autoplay=${props.autoplay ? 1 : 0}&controls=${props.controls !== false ? 1 : 0}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full rounded"
        />
      </div>
    </div>
  );
}

// ============================================================================
// TextContainer Renderer
// ============================================================================

function TextContainerRenderer({ node }: { node: PageComponent }) {
  const props = node.props as any;

  return (
    <div
      className={cn("w-full", `text-${props.align || "left"}`)}
      data-component-id={node.id}
    >
      {/* Children rendered by renderNode */}
    </div>
  );
}

// ============================================================================
// TextSpan Renderer
// ============================================================================

function TextSpanRenderer({ node }: { node: PageComponent }) {
  const props = node.props as any;

  const style: React.CSSProperties = {
    fontWeight: props.bold ? "bold" : "normal",
    fontStyle: props.italic ? "italic" : "normal",
    textDecoration: props.underline ? "underline" : "none",
    color: props.color,
    fontSize: props.size ? `${props.size}px` : undefined,
  };

  const content = <span style={style}>{props.text}</span>;

  if (props.link) {
    return (
      <a
        href={props.link}
        target="_blank"
        rel="noopener noreferrer"
        data-component-id={node.id}
      >
        {content}
      </a>
    );
  }

  return <span data-component-id={node.id}>{content}</span>;
}

// ============================================================================
// Divider Renderer
// ============================================================================

function DividerRenderer({ node }: { node: PageComponent }) {
  const props = node.props as any;

  const style: React.CSSProperties = {
    height: props.thickness ? `${props.thickness}px` : "1px",
    backgroundColor: props.color || "#e2e8f0",
    margin: props.spacing ? `${props.spacing}px 0` : "16px 0",
  };

  return <hr style={style} data-component-id={node.id} />;
}

// ============================================================================
// Unknown Component Renderer
// ============================================================================

function UnknownRenderer({ node }: { node: PageComponent }) {
  return (
    <div
      className="p-4 border-2 border-dashed border-red-300 rounded bg-red-50 text-red-600"
      data-component-id={node.id}
    >
      <p className="font-semibold">Unknown Component: {node.type}</p>
      <p className="text-sm">ID: {node.id}</p>
    </div>
  );
}


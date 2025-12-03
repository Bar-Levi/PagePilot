"use client";

import React from "react";
import type { PageComponent } from "@/components/landing-page/types";
import { useEditorStore } from "@/hooks/use-editor-store";
import { cn } from "@/lib/utils";
import NextImage from "next/image";
import NextLink from "next/link";
import { Button as ShadcnButton } from "@/components/ui/button";
import { cleanAllHTML } from "@/lib/richtext-helpers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    case "Section":
      return <SectionRenderer node={node} />;
    case "Container":
      return <ContainerRenderer node={node} />;
    case "Heading":
      return <HeadingRenderer node={node} />;
    case "Text":
      return <TextRenderer node={node} />;
    case "Grid":
      return <GridRenderer node={node} />;
    case "Card":
      return <CardRenderer node={node} />;
    case "TestimonialsGrid":
      return <TestimonialsGridRenderer node={node} />;
    case "FAQAccordion":
      return <FAQAccordionRenderer node={node} />;
    case "Steps":
      return <StepsRenderer node={node} />;
    case "StatsGrid":
      return <StatsGridRenderer node={node} />;
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
    case "FAQ":
      return <FAQRenderer node={node} isEditing={isEditing} />;
    case "Accordion":
      return <AccordionRenderer node={node} isEditing={isEditing} />;
    case "ImageText":
      return <ImageTextRenderer node={node} isEditing={isEditing} />;
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
// Section Renderer
// ============================================================================

function SectionRenderer({ node }: { node: PageComponent }) {
  const props = node.props as any;
  
  return (
    <section
      id={props.id}
      className={props.className}
      style={props.style}
      data-component-id={node.id}
    >
      {/* Children are rendered by renderNode */}
    </section>
  );
}

// ============================================================================
// Heading Renderer
// ============================================================================

function HeadingRenderer({ node }: { node: PageComponent }) {
  const props = node.props as any;
  const Tag = `h${props.level || 2}` as keyof JSX.IntrinsicElements;
  
  return React.createElement(
    Tag,
    {
      style: { ...props.style, textAlign: 'right', direction: 'rtl' },
      'data-component-id': node.id,
    },
    props.text || ''
  );
}

// ============================================================================
// Text Renderer
// ============================================================================

function TextRenderer({ node }: { node: PageComponent }) {
  const props = node.props as any;
  
  return (
    <p
      style={{ ...props.style, textAlign: 'right', direction: 'rtl' }}
      data-component-id={node.id}
    >
      {props.text || ''}
    </p>
  );
}

// ============================================================================
// Grid Renderer
// ============================================================================

function GridRenderer({ node }: { node: PageComponent }) {
  const props = node.props as any;
  
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${props.columns || 3}, 1fr)`,
    gap: props.gap || '1rem',
    ...props.style,
  };
  
  return (
    <div
      style={gridStyle}
      data-component-id={node.id}
    >
      {/* Children are rendered by renderNode */}
    </div>
  );
}

// ============================================================================
// Card Renderer (Simple)
// ============================================================================

function CardRenderer({ node }: { node: PageComponent }) {
  const props = node.props as any;
  
  return (
    <div
      style={props.style}
      data-component-id={node.id}
    >
      {/* Children are rendered by renderNode */}
    </div>
  );
}

// ============================================================================
// TestimonialsGrid Renderer
// ============================================================================

function TestimonialsGridRenderer({ node }: { node: PageComponent }) {
  const props = node.props as any;
  const testimonials = props.testimonials || [];
  const accentColor = props.accentColor || '#1A537D';
  
  // Helper to extract text and author from testimonial
  const getTestimonialData = (item: any): { text: string; author?: string } => {
    if (typeof item === 'string') {
      return { text: item };
    }
    if (item && typeof item === 'object') {
      if ('quote' in item) {
        return { text: item.quote || '', author: item.author };
      }
      if ('text' in item) {
        return { text: item.text || '' };
      }
      // Fallback for any other object structure
      return { text: JSON.stringify(item) };
    }
    return { text: String(item) };
  };
  
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
      }}
      data-component-id={node.id}
    >
      {testimonials.map((testimonial: any, index: number) => {
        const { text, author } = getTestimonialData(testimonial);
        return (
          <div
            key={index}
            style={{
              backgroundColor: '#FFFFFF',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderLeft: `4px solid ${accentColor}`,
            }}
          >
            <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#333', marginBottom: author ? '1rem' : '0', textAlign: 'right', direction: 'rtl' }}>
              "{text}"
            </p>
            {author && (
              <p style={{ fontSize: '0.875rem', color: '#666', fontWeight: '600', textAlign: 'right', direction: 'rtl' }}>
                — {author}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// FAQAccordion Renderer
// ============================================================================

function FAQAccordionRenderer({ node }: { node: PageComponent }) {
  const props = node.props as any;
  const items = props.items || [];
  const accentColor = props.accentColor || '#1A537D';
  
  // Parse FAQ items - handle both string format and object format
  const parsedItems = items.map((item: any) => {
    if (typeof item === 'string') {
      const parts = item.split(' ת: ');
      const question = parts[0]?.replace('ש: ', '') || '';
      const answer = parts[1] || '';
      return { question, answer };
    }
    // Already an object with question/answer
    if (item && typeof item === 'object') {
      return {
        question: item.question || '',
        answer: item.answer || ''
      };
    }
    return { question: String(item), answer: '' };
  });
  
  return (
    <Accordion type="single" collapsible className="w-full" data-component-id={node.id}>
      {parsedItems.map((item: any, index: number) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger 
            className="text-right"
            style={{ backgroundColor: accentColor + '10' }}
          >
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-right">
            <p>{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

// ============================================================================
// Steps Renderer
// ============================================================================

function StepsRenderer({ node }: { node: PageComponent }) {
  const props = node.props as any;
  const items = props.items || [];
  const accentColor = props.accentColor || '#1A537D';
  
  // Helper to extract text from item
  const getText = (item: any): string => {
    if (typeof item === 'string') {
      return item;
    }
    if (item && typeof item === 'object' && 'text' in item) {
      return item.text;
    }
    return String(item);
  };
  
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        direction: 'rtl',
      }}
      data-component-id={node.id}
    >
      {items.map((item: any, index: number) => (
        <div
          key={index}
          style={{
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              minWidth: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: accentColor,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              flexShrink: 0,
            }}
          >
            {index + 1}
          </div>
          <div style={{ flex: 1, paddingTop: '0.5rem' }}>
            <p style={{ fontSize: '1.125rem', lineHeight: '1.6', color: '#333', textAlign: 'right', direction: 'rtl' }}>
              {getText(item)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// StatsGrid Renderer
// ============================================================================

function StatsGridRenderer({ node }: { node: PageComponent }) {
  const props = node.props as any;
  const stats = props.stats || [];
  const textColor = props.textColor || '#FFFFFF';
  
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem',
        textAlign: 'center',
        direction: 'rtl',
      }}
      data-component-id={node.id}
    >
      {stats.map((stat: { label: string; value: string }, index: number) => (
        <div key={index}>
          <div
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: textColor,
              marginBottom: '0.5rem',
            }}
          >
            {stat.value}
          </div>
          <div
            style={{
              fontSize: '1.125rem',
              color: textColor,
              opacity: 0.9,
              direction: 'rtl',
            }}
          >
            {stat.label}
          </div>
        </div>
      ))}
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

  const alignment = (props.alignment || "center") as
    | "left"
    | "center"
    | "right";
  const alignmentClass = {
    left: "mr-auto",
    center: "mx-auto",
    right: "ml-auto",
  }[alignment];

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

  const ratio = (props.ratio || "16:9") as "16:9" | "4:3" | "1:1";
  const ratioClass = {
    "16:9": "aspect-video",
    "4:3": "aspect-[4/3]",
    "1:1": "aspect-square",
  }[ratio];

  const alignment = (props.alignment || "center") as
    | "left"
    | "center"
    | "right";
  const alignmentClass = {
    left: "mr-auto",
    center: "mx-auto",
    right: "ml-auto",
  }[alignment];

  return (
    <div
      className={cn("w-full max-w-2xl", alignmentClass)}
      data-component-id={node.id}
    >
      <div className={cn("relative", ratioClass)}>
        <iframe
          src={`https://www.youtube.com/embed/${
            props.youtubeId || "dQw4w9WgXcQ"
          }?autoplay=${props.autoplay ? 1 : 0}&controls=${
            props.controls !== false ? 1 : 0
          }`}
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
// FAQ Renderer
// ============================================================================

function FAQRenderer({
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
      <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border">
        <div>
          <label className="block text-sm font-medium mb-2">
            כותרת (אופציונלי)
          </label>
          <input
            type="text"
            value={props.headline || ""}
            onChange={(e) => updateProps(node.id, { headline: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm"
            placeholder="שאלות נפוצות..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            שאלות ותשובות
          </label>
          <div className="space-y-3">
            {(props.questions || []).map((item: any, index: number) => (
              <div key={index} className="p-3 border rounded-md space-y-2">
                <input
                  type="text"
                  value={item.question || ""}
                  onChange={(e) => {
                    const newQuestions = [...(props.questions || [])];
                    newQuestions[index] = { ...item, question: e.target.value };
                    updateProps(node.id, { questions: newQuestions });
                  }}
                  className="w-full px-2 py-1 border rounded text-sm"
                  placeholder="שאלה..."
                />
                <textarea
                  value={item.answer || ""}
                  onChange={(e) => {
                    const newQuestions = [...(props.questions || [])];
                    newQuestions[index] = { ...item, answer: e.target.value };
                    updateProps(node.id, { questions: newQuestions });
                  }}
                  className="w-full px-2 py-1 border rounded text-sm"
                  placeholder="תשובה..."
                  rows={3}
                />
                <button
                  onClick={() => {
                    const newQuestions = (props.questions || []).filter(
                      (_: any, i: number) => i !== index
                    );
                    updateProps(node.id, { questions: newQuestions });
                  }}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  מחק
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newQuestions = [
                  ...(props.questions || []),
                  { question: "", answer: "" },
                ];
                updateProps(node.id, { questions: newQuestions });
              }}
              className="text-sm text-primary hover:underline"
            >
              + הוסף שאלה
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" data-component-id={node.id}>
      {props.headline && (
        <h2 className="text-2xl font-bold mb-6 text-center">
          {props.headline}
        </h2>
      )}
      <Accordion type="single" collapsible className="w-full">
        {(props.questions || []).map((item: any, index: number) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-right">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-right">
              <div dangerouslySetInnerHTML={{ __html: item.answer || "" }} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

// ============================================================================
// Accordion Renderer (generic accordion component)
// ============================================================================

function AccordionRenderer({
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
      <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border">
        <div>
          <label className="block text-sm font-medium mb-2">פריטים</label>
          <div className="space-y-3">
            {(props.items || []).map((item: any, index: number) => (
              <div key={index} className="p-3 border rounded-md space-y-2">
                <input
                  type="text"
                  value={item.title || ""}
                  onChange={(e) => {
                    const newItems = [...(props.items || [])];
                    newItems[index] = { ...item, title: e.target.value };
                    updateProps(node.id, { items: newItems });
                  }}
                  className="w-full px-2 py-1 border rounded text-sm"
                  placeholder="כותרת..."
                />
                <textarea
                  value={item.content || ""}
                  onChange={(e) => {
                    const newItems = [...(props.items || [])];
                    newItems[index] = { ...item, content: e.target.value };
                    updateProps(node.id, { items: newItems });
                  }}
                  className="w-full px-2 py-1 border rounded text-sm"
                  placeholder="תוכן..."
                  rows={3}
                />
                <button
                  onClick={() => {
                    const newItems = (props.items || []).filter(
                      (_: any, i: number) => i !== index
                    );
                    updateProps(node.id, { items: newItems });
                  }}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  מחק
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newItems = [
                  ...(props.items || []),
                  { title: "", content: "" },
                ];
                updateProps(node.id, { items: newItems });
              }}
              className="text-sm text-primary hover:underline"
            >
              + הוסף פריט
            </button>
          </div>
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={props.allowMultiple || false}
              onChange={(e) =>
                updateProps(node.id, { allowMultiple: e.target.checked })
              }
            />
            אפשר פתיחה של מספר פריטים בו-זמנית
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" data-component-id={node.id}>
      <Accordion
        type={props.allowMultiple ? "multiple" : "single"}
        collapsible
        className="w-full"
      >
        {(props.items || []).map((item: any, index: number) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-right">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="text-right">
              <div dangerouslySetInnerHTML={{ __html: item.content || "" }} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

// ============================================================================
// ImageText Renderer (תמונה + טקסט עם אפשרות להחלפת סדר)
// ============================================================================

function ImageTextRenderer({
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
      <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border">
        <div>
          <label className="block text-sm font-medium mb-2">כתובת תמונה</label>
          <input
            type="url"
            value={props.imageSrc || ""}
            onChange={(e) => updateProps(node.id, { imageSrc: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            טקסט חלופי לתמונה
          </label>
          <input
            type="text"
            value={props.imageAlt || ""}
            onChange={(e) => updateProps(node.id, { imageAlt: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm"
            placeholder="תיאור התמונה..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">טקסט (HTML)</label>
          <textarea
            value={props.text || ""}
            onChange={(e) => updateProps(node.id, { text: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm"
            placeholder="הזן טקסט..."
            rows={5}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">מיקום התמונה</label>
          <select
            value={props.imagePosition || "right"}
            onChange={(e) =>
              updateProps(node.id, {
                imagePosition: e.target.value as "left" | "right",
              })
            }
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            <option value="right">ימין</option>
            <option value="left">שמאל</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            רוחב התמונה (%)
          </label>
          <input
            type="number"
            min="10"
            max="90"
            value={typeof props.imageWidth === "number" ? props.imageWidth : 50}
            onChange={(e) =>
              updateProps(node.id, { imageWidth: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            רווח בין התמונה לטקסט (px)
          </label>
          <input
            type="number"
            min="0"
            value={props.gap || 24}
            onChange={(e) =>
              updateProps(node.id, { gap: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">יישור אנכי</label>
          <select
            value={props.alignment || "center"}
            onChange={(e) =>
              updateProps(node.id, {
                alignment: e.target.value as "top" | "center" | "bottom",
              })
            }
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            <option value="top">למעלה</option>
            <option value="center">מרכז</option>
            <option value="bottom">למטה</option>
          </select>
        </div>
      </div>
    );
  }

  const imagePosition = props.imagePosition || "right";
  const imageWidth =
    typeof props.imageWidth === "number" ? props.imageWidth : 50;
  const textWidth = 100 - imageWidth;
  const gap = props.gap || 24;
  const alignment = props.alignment || "center";

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: imagePosition === "right" ? "row" : "row-reverse",
    gap: `${gap}px`,
    alignItems:
      alignment === "top"
        ? "flex-start"
        : alignment === "bottom"
        ? "flex-end"
        : "center",
    backgroundColor: props.backgroundColor,
    padding: props.padding || "24px",
  };

  const imageStyle: React.CSSProperties = {
    width: `${imageWidth}%`,
    flexShrink: 0,
  };

  const textStyle: React.CSSProperties = {
    width: `${textWidth}%`,
  };

  return (
    <div style={containerStyle} data-component-id={node.id}>
      <div style={imageStyle}>
        <div className="relative aspect-video w-full">
          <NextImage
            src={
              props.imageSrc || "https://picsum.photos/seed/placeholder/600/400"
            }
            alt={props.imageAlt || "Image"}
            fill
            className="object-cover rounded"
          />
        </div>
      </div>
      <div style={textStyle} className="flex items-center">
        <div
          className="w-full"
          dangerouslySetInnerHTML={{ __html: props.text || "" }}
        />
      </div>
    </div>
  );
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

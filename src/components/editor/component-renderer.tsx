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
import { SettingsPopover, type SettingsField } from "./SettingsPopover";

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
    case "ImageCarouselSection":
      return <ImageCarouselSectionRenderer node={node} isEditing={isEditing} />;
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
  const updateProps = useEditorStore((s) => s.updateProps);
  const style = props.style || {};

  // Settings fields
  const containerFields: SettingsField[] = [
    { type: "color", key: "backgroundColor", label: "צבע רקע", defaultValue: "#FFFFFF" },
    { type: "number", key: "padding", label: "מרווח פנימי (px)", min: 0, max: 100 },
    { type: "number", key: "gap", label: "רווח בין אלמנטים (px)", min: 0, max: 60 },
    { type: "text", key: "borderRadius", label: "עיגול פינות", placeholder: "8px או 16px" },
    { 
      type: "select", 
      key: "layout", 
      label: "כיוון", 
      options: [
        { value: "column", label: "אנכי (עמודה)" },
        { value: "row", label: "אופקי (שורה)" },
      ]
    },
  ];

  // Handle onChange to update style object
  const handleChange = (key: string, value: any) => {
    if (key === "backgroundColor") {
      updateProps(node.id, { style: { ...style, background: value } });
    } else if (key === "padding" || key === "gap") {
      updateProps(node.id, { style: { ...style, [key]: value } });
    } else if (key === "borderRadius") {
      updateProps(node.id, { style: { ...style, radius: value } });
    } else if (key === "layout") {
      updateProps(node.id, { layout: value, style: { ...style, flexDirection: value } });
    }
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: style.flexDirection || props.layout || "column",
    alignItems: style.alignItems || "stretch",
    justifyContent: style.justifyContent || "flex-start",
    gap: typeof style.gap === "number" ? `${style.gap}px` : style.gap,
    padding: typeof style.padding === "number" ? `${style.padding}px` : style.padding,
    background: style.background,
    borderRadius: typeof style.radius === "number" ? `${style.radius}px` : style.radius,
    border: style.border,
    width: style.width || "100%",
    maxWidth: style.maxWidth,
  };

  // Create values object for popover
  const settingsValues = {
    backgroundColor: style.background,
    padding: style.padding,
    gap: style.gap,
    borderRadius: style.radius,
    layout: style.flexDirection || props.layout || "column",
  };

  return (
    <div className="relative group" style={containerStyle} data-component-id={node.id}>
      {/* Settings Gear Icon */}
      <SettingsPopover
        title="הגדרות מיכל"
        fields={containerFields}
        values={settingsValues}
        onChange={handleChange}
      />
      {/* Children are rendered by renderNode */}
    </div>
  );
}

// ============================================================================
// Section Renderer
// ============================================================================

function SectionRenderer({ node }: { node: PageComponent }) {
  const props = node.props as any;
  const updateProps = useEditorStore((s) => s.updateProps);

  // Settings fields
  const sectionFields: SettingsField[] = [
    { type: "color", key: "backgroundColor", label: "צבע רקע", defaultValue: "transparent" },
    { type: "text", key: "padding", label: "מרווח פנימי", placeholder: "2rem או 32px" },
  ];
  
  const sectionStyle: React.CSSProperties = {
    ...props.style,
    backgroundColor: props.backgroundColor,
    padding: props.padding,
  };
  
  return (
    <section
      id={props.id}
      className={cn("relative group", props.className)}
      style={sectionStyle}
      data-component-id={node.id}
    >
      <SettingsPopover
        title="הגדרות סקשן"
        fields={sectionFields}
        values={props}
        onChange={(key, value) => updateProps(node.id, { [key]: value })}
      />
      {/* Children are rendered by renderNode */}
    </section>
  );
}

// ============================================================================
// Heading Renderer
// ============================================================================

function HeadingRenderer({ node }: { node: PageComponent }) {
  const props = node.props as any;
  const updateProps = useEditorStore((s) => s.updateProps);
  const Tag = `h${props.level || 2}` as keyof JSX.IntrinsicElements;
  
  // Settings fields
  const headingFields: SettingsField[] = [
    { type: "text", key: "text", label: "טקסט", placeholder: "כותרת..." },
    { type: "color", key: "backgroundColor", label: "צבע רקע", defaultValue: "transparent" },
    { type: "color", key: "color", label: "צבע טקסט", defaultValue: "#1F2937" },
    { 
      type: "select", 
      key: "level", 
      label: "גודל", 
      options: [
        { value: "1", label: "H1 - גדול מאוד" },
        { value: "2", label: "H2 - גדול" },
        { value: "3", label: "H3 - בינוני" },
        { value: "4", label: "H4 - קטן" },
      ]
    },
  ];
  
  const headingStyle: React.CSSProperties = {
    ...props.style,
    backgroundColor: props.backgroundColor,
    color: props.color || '#1F2937',
    textAlign: 'right',
    direction: 'rtl',
  };
  
  return (
    <div className="relative group" data-component-id={node.id}>
      {/* Settings Gear Icon */}
      <SettingsPopover
        title="הגדרות כותרת"
        fields={headingFields}
        values={props}
        onChange={(key, value) => updateProps(node.id, { [key]: value })}
      />
      
      {React.createElement(Tag, { style: headingStyle }, props.text || '')}
    </div>
  );
}

// ============================================================================
// Text Renderer
// ============================================================================

function TextRenderer({ node }: { node: PageComponent }) {
  const props = node.props as any;
  const updateProps = useEditorStore((s) => s.updateProps);

  // Settings fields
  const textFields: SettingsField[] = [
    { type: "text", key: "text", label: "טקסט", placeholder: "הקלד טקסט..." },
    { type: "color", key: "backgroundColor", label: "צבע רקע", defaultValue: "transparent" },
    { type: "color", key: "color", label: "צבע טקסט", defaultValue: "#333333" },
  ];
  
  const textStyle: React.CSSProperties = {
    ...props.style,
    backgroundColor: props.backgroundColor,
    color: props.color || '#333333',
    textAlign: 'right',
    direction: 'rtl',
  };
  
  return (
    <div className="relative group" data-component-id={node.id}>
      <SettingsPopover
        title="הגדרות טקסט"
        fields={textFields}
        values={props}
        onChange={(key, value) => updateProps(node.id, { [key]: value })}
      />
      <p style={textStyle}>{props.text || ''}</p>
    </div>
  );
}

// ============================================================================
// Grid Renderer
// ============================================================================

function GridRenderer({ node }: { node: PageComponent }) {
  const props = node.props as any;
  const updateProps = useEditorStore((s) => s.updateProps);

  // Settings fields
  const gridFields: SettingsField[] = [
    { type: "color", key: "backgroundColor", label: "צבע רקע", defaultValue: "transparent" },
    { type: "number", key: "columns", label: "מספר עמודות", min: 1, max: 6 },
    { type: "text", key: "gap", label: "מרווח", placeholder: "1rem או 16px" },
  ];
  
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${props.columns || 3}, 1fr)`,
    gap: props.gap || '1rem',
    backgroundColor: props.backgroundColor,
    ...props.style,
  };
  
  return (
    <div className="relative group" style={gridStyle} data-component-id={node.id}>
      <SettingsPopover
        title="הגדרות רשת"
        fields={gridFields}
        values={props}
        onChange={(key, value) => updateProps(node.id, { [key]: value })}
      />
      {/* Children are rendered by renderNode */}
    </div>
  );
}

// ============================================================================
// Card Renderer (Simple)
// ============================================================================

function CardRenderer({ node }: { node: PageComponent }) {
  const props = node.props as any;
  const updateProps = useEditorStore((s) => s.updateProps);

  // Card settings fields
  const cardFields: SettingsField[] = [
    { type: "text", key: "title", label: "כותרת", placeholder: "כותרת הכרטיס..." },
    { type: "text", key: "description", label: "תיאור", placeholder: "תיאור קצר..." },
    { type: "text", key: "image", label: "קישור תמונה", placeholder: "https://..." },
    { type: "color", key: "backgroundColor", label: "צבע רקע", defaultValue: "#FFFFFF" },
    { type: "color", key: "titleColor", label: "צבע כותרת", defaultValue: "#1F2937" },
    { type: "color", key: "textColor", label: "צבע טקסט", defaultValue: "#6B7280" },
    { type: "color", key: "borderColor", label: "צבע מסגרת", defaultValue: "#E5E7EB" },
  ];

  const cardStyle: React.CSSProperties = {
    backgroundColor: props.backgroundColor || "#FFFFFF",
    borderColor: props.borderColor || "#E5E7EB",
    border: `1px solid ${props.borderColor || "#E5E7EB"}`,
    borderRadius: "12px",
    overflow: "hidden",
    ...props.style,
  };
  
  return (
    <div
      className="relative group"
      style={cardStyle}
      data-component-id={node.id}
    >
      {/* Settings Gear Icon */}
      <SettingsPopover
        title="הגדרות כרטיס"
        fields={cardFields}
        values={props}
        onChange={(key, value) => updateProps(node.id, { [key]: value })}
      />
      
      {/* Card Image */}
      {props.image && (
        <div className="aspect-video relative">
          <NextImage
            src={props.image}
            alt={props.imageAlt || "Card image"}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      {/* Card Content */}
      <div className="p-4">
        {props.title && (
          <h3 
            className="text-lg font-semibold mb-2"
            style={{ color: props.titleColor || "#1F2937" }}
          >
            {props.title}
          </h3>
        )}
        {props.description && (
          <p 
            className="text-sm"
            style={{ color: props.textColor || "#6B7280" }}
          >
            {props.description}
          </p>
        )}
        {/* Children are rendered by renderNode */}
      </div>
    </div>
  );
}

// ============================================================================
// TestimonialsGrid Renderer
// ============================================================================

function TestimonialsGridRenderer({ node }: { node: PageComponent }) {
  const props = node.props as any;
  const updateProps = useEditorStore((s) => s.updateProps);
  const testimonials = props.testimonials || [];
  const accentColor = props.accentColor || '#1A537D';
  const cardBackground = props.cardBackground || '#FFFFFF';
  const textColor = props.textColor || '#333333';
  const authorColor = props.authorColor || '#666666';
  
  // Settings fields
  const testimonialFields: SettingsField[] = [
    { type: "color", key: "accentColor", label: "צבע דגש", defaultValue: "#1A537D" },
    { type: "color", key: "cardBackground", label: "צבע רקע כרטיס", defaultValue: "#FFFFFF" },
    { type: "color", key: "textColor", label: "צבע טקסט", defaultValue: "#333333" },
    { type: "color", key: "authorColor", label: "צבע שם המחבר", defaultValue: "#666666" },
  ];
  
  // Helper to extract text and author from testimonial
  const getTestimonialData = (item: any): { text: string; author?: string } => {
    if (typeof item === 'string') return { text: item };
    if (item && typeof item === 'object') {
      if ('quote' in item) return { text: item.quote || '', author: item.author };
      if ('text' in item) return { text: item.text || '' };
      return { text: JSON.stringify(item) };
    }
    return { text: String(item) };
  };
  
  return (
    <div className="relative group" data-component-id={node.id}>
      {/* Settings Gear Icon */}
      <SettingsPopover
        title="הגדרות המלצות"
        fields={testimonialFields}
        values={props}
        onChange={(key, value) => updateProps(node.id, { [key]: value })}
      />
      
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
        }}
      >
        {testimonials.map((testimonial: any, index: number) => {
          const { text, author } = getTestimonialData(testimonial);
          return (
            <div
              key={index}
              style={{
                backgroundColor: cardBackground,
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderLeft: `4px solid ${accentColor}`,
              }}
            >
              <p style={{ fontSize: '1rem', lineHeight: '1.6', color: textColor, marginBottom: author ? '1rem' : '0', textAlign: 'right', direction: 'rtl' }}>
                "{text}"
              </p>
              {author && (
                <p style={{ fontSize: '0.875rem', color: authorColor, fontWeight: '600', textAlign: 'right', direction: 'rtl' }}>
                  — {author}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// FAQAccordion Renderer
// ============================================================================

function FAQAccordionRenderer({ node }: { node: PageComponent }) {
  const props = node.props as any;
  const updateProps = useEditorStore((s) => s.updateProps);
  const items = props.items || [];
  const accentColor = props.accentColor || '#1A537D';
  const backgroundColor = props.backgroundColor || '#F8FAFC';
  const textColor = props.textColor || '#1F2937';
  
  // Settings fields
  const faqFields: SettingsField[] = [
    { type: "color", key: "accentColor", label: "צבע דגש", defaultValue: "#1A537D" },
    { type: "color", key: "backgroundColor", label: "צבע רקע", defaultValue: "#F8FAFC" },
    { type: "color", key: "textColor", label: "צבע טקסט", defaultValue: "#1F2937" },
  ];
  
  // Parse FAQ items
  const parsedItems = items.map((item: any) => {
    if (typeof item === 'string') {
      const parts = item.split(' ת: ');
      return { question: parts[0]?.replace('ש: ', '') || '', answer: parts[1] || '' };
    }
    if (item && typeof item === 'object') {
      return { question: item.question || '', answer: item.answer || '' };
    }
    return { question: String(item), answer: '' };
  });
  
  return (
    <div className="relative group" data-component-id={node.id}>
      {/* Settings Gear Icon */}
      <SettingsPopover
        title="הגדרות שאלות ותשובות"
        fields={faqFields}
        values={props}
        onChange={(key, value) => updateProps(node.id, { [key]: value })}
      />
      
      <Accordion type="single" collapsible className="w-full">
        {parsedItems.map((item: any, index: number) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger 
              className="text-right"
              style={{ backgroundColor: backgroundColor, color: textColor }}
            >
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-right" style={{ color: textColor }}>
              <p>{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

// ============================================================================
// Steps Renderer
// ============================================================================

function StepsRenderer({ node }: { node: PageComponent }) {
  const props = node.props as any;
  const updateProps = useEditorStore((s) => s.updateProps);
  const items = props.items || [];
  const accentColor = props.accentColor || '#1A537D';
  const textColor = props.textColor || '#333333';
  const numberColor = props.numberColor || '#FFFFFF';
  
  // Settings fields
  const stepsFields: SettingsField[] = [
    { type: "color", key: "accentColor", label: "צבע עיגול מספר", defaultValue: "#1A537D" },
    { type: "color", key: "textColor", label: "צבע טקסט", defaultValue: "#333333" },
    { type: "color", key: "numberColor", label: "צבע מספר", defaultValue: "#FFFFFF" },
  ];
  
  const getText = (item: any): string => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object' && 'text' in item) return item.text;
    return String(item);
  };
  
  return (
    <div className="relative group" data-component-id={node.id}>
      {/* Settings Gear Icon */}
      <SettingsPopover
        title="הגדרות שלבים"
        fields={stepsFields}
        values={props}
        onChange={(key, value) => updateProps(node.id, { [key]: value })}
      />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', direction: 'rtl' }}>
        {items.map((item: any, index: number) => (
          <div key={index} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div
              style={{
                minWidth: '48px', height: '48px', borderRadius: '50%',
                backgroundColor: accentColor, color: numberColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.25rem', fontWeight: 'bold', flexShrink: 0,
              }}
            >
              {index + 1}
            </div>
            <div style={{ flex: 1, paddingTop: '0.5rem' }}>
              <p style={{ fontSize: '1.125rem', lineHeight: '1.6', color: textColor, textAlign: 'right', direction: 'rtl' }}>
                {getText(item)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// StatsGrid Renderer
// ============================================================================

function StatsGridRenderer({ node }: { node: PageComponent }) {
  const props = node.props as any;
  const updateProps = useEditorStore((s) => s.updateProps);
  const stats = props.stats || [];
  const valueColor = props.valueColor || '#FFFFFF';
  const labelColor = props.labelColor || '#FFFFFF';
  
  // Settings fields
  const statsFields: SettingsField[] = [
    { type: "color", key: "valueColor", label: "צבע מספרים", defaultValue: "#FFFFFF" },
    { type: "color", key: "labelColor", label: "צבע תוויות", defaultValue: "#FFFFFF" },
  ];
  
  return (
    <div className="relative group" data-component-id={node.id}>
      {/* Settings Gear Icon */}
      <SettingsPopover
        title="הגדרות סטטיסטיקות"
        fields={statsFields}
        values={props}
        onChange={(key, value) => updateProps(node.id, { [key]: value })}
      />
      
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          textAlign: 'center',
          direction: 'rtl',
        }}
      >
        {stats.map((stat: { label: string; value: string }, index: number) => (
          <div key={index}>
            <div
              style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: valueColor,
                marginBottom: '0.5rem',
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: '1.125rem',
                color: labelColor,
                opacity: 0.9,
                direction: 'rtl',
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
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

  // Button settings fields
  const buttonFields: SettingsField[] = [
    { type: "text", key: "text", label: "טקסט הכפתור", placeholder: "לחץ כאן..." },
    { type: "text", key: "href", label: "קישור (URL)", placeholder: "https://..." },
    { type: "color", key: "backgroundColor", label: "צבע רקע", defaultValue: "#3B82F6" },
    { type: "color", key: "textColor", label: "צבע טקסט", defaultValue: "#FFFFFF" },
    { type: "color", key: "borderColor", label: "צבע מסגרת", defaultValue: "#3B82F6" },
    { 
      type: "select", 
      key: "size", 
      label: "גודל", 
      options: [
        { value: "sm", label: "קטן" },
        { value: "default", label: "רגיל" },
        { value: "lg", label: "גדול" },
      ]
    },
    { 
      type: "select", 
      key: "variant", 
      label: "סגנון", 
      options: [
        { value: "default", label: "רגיל" },
        { value: "outline", label: "מסגרת בלבד" },
        { value: "secondary", label: "משני" },
        { value: "ghost", label: "שקוף" },
      ]
    },
  ];

  // Custom button styling based on props
  const buttonStyle: React.CSSProperties = {
    borderRadius: props.radius || "8px",
    fontWeight: props.fontWeight || 600,
    padding: props.padding,
    backgroundColor: props.backgroundColor,
    color: props.textColor,
    borderColor: props.borderColor,
    border: props.borderColor ? `2px solid ${props.borderColor}` : undefined,
  };

  // When in editing mode - show full form (old behavior)
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
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">צבע רקע</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={props.backgroundColor || "#3B82F6"}
                onChange={(e) => updateProps(node.id, { backgroundColor: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">צבע טקסט</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={props.textColor || "#FFFFFF"}
                onChange={(e) => updateProps(node.id, { textColor: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">צבע מסגרת</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={props.borderColor || "#3B82F6"}
                onChange={(e) => updateProps(node.id, { borderColor: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal view - button with settings gear icon
  return (
    <div className="relative group inline-block" data-component-id={node.id}>
      {/* Settings Gear Icon */}
      <SettingsPopover
        title="הגדרות כפתור"
        fields={buttonFields}
        values={props}
        onChange={(key, value) => updateProps(node.id, { [key]: value })}
      />
      
      {/* The Button */}
      <ShadcnButton
        variant={props.variant || "default"}
        size={props.size || "default"}
        style={buttonStyle}
        asChild
      >
        <NextLink href={props.href || "#"} onClick={(e) => e.preventDefault()}>
          {props.text || "כפתור"}
        </NextLink>
      </ShadcnButton>
    </div>
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

  // Settings fields
  const imageFields: SettingsField[] = [
    { type: "text", key: "src", label: "כתובת תמונה", placeholder: "https://..." },
    { type: "text", key: "alt", label: "טקסט חלופי", placeholder: "תיאור התמונה..." },
    { type: "color", key: "backgroundColor", label: "צבע רקע", defaultValue: "transparent" },
    { 
      type: "select", 
      key: "alignment", 
      label: "יישור", 
      options: [
        { value: "left", label: "שמאל" },
        { value: "center", label: "מרכז" },
        { value: "right", label: "ימין" },
      ]
    },
    { type: "text", key: "rounded", label: "עיגול פינות", placeholder: "8px או 50%" },
  ];

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

  const alignment = (props.alignment || "center") as "left" | "center" | "right";
  const alignmentClass = { left: "mr-auto", center: "mx-auto", right: "ml-auto" }[alignment];

  const imageStyle: React.CSSProperties = {
    width: typeof props.width === "number" ? `${props.width}px` : props.width,
    maxWidth: typeof props.maxWidth === "number" ? `${props.maxWidth}px` : props.maxWidth,
    borderRadius: props.rounded || "8px",
    boxShadow: props.shadow,
  };

  return (
    <div className={cn("relative group", alignmentClass)} data-component-id={node.id}>
      {/* Settings Gear Icon */}
      <SettingsPopover
        title="הגדרות תמונה"
        fields={imageFields}
        values={props}
        onChange={(key, value) => updateProps(node.id, { [key]: value })}
      />
      
      <div style={imageStyle} className="relative aspect-video">
        <NextImage
          src={props.src || "https://picsum.photos/seed/placeholder/600/400"}
          alt={props.alt || "Image"}
          fill
          className="object-cover rounded"
          style={{ borderRadius: props.rounded || "8px" }}
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
  const updateProps = useEditorStore((s) => s.updateProps);

  // Settings fields
  const videoFields: SettingsField[] = [
    { type: "text", key: "youtubeId", label: "YouTube ID", placeholder: "dQw4w9WgXcQ" },
    { 
      type: "select", 
      key: "ratio", 
      label: "יחס מסך", 
      options: [
        { value: "16:9", label: "16:9 (וידאו)" },
        { value: "4:3", label: "4:3" },
        { value: "1:1", label: "1:1 (ריבוע)" },
      ]
    },
    { 
      type: "select", 
      key: "alignment", 
      label: "יישור", 
      options: [
        { value: "left", label: "שמאל" },
        { value: "center", label: "מרכז" },
        { value: "right", label: "ימין" },
      ]
    },
    { type: "toggle", key: "autoplay", label: "נגן אוטומטי" },
    { type: "toggle", key: "controls", label: "הצג בקרים" },
  ];

  const ratio = (props.ratio || "16:9") as "16:9" | "4:3" | "1:1";
  const ratioClass = { "16:9": "aspect-video", "4:3": "aspect-[4/3]", "1:1": "aspect-square" }[ratio];
  const alignment = (props.alignment || "center") as "left" | "center" | "right";
  const alignmentClass = { left: "mr-auto", center: "mx-auto", right: "ml-auto" }[alignment];

  return (
    <div className={cn("relative group w-full max-w-2xl", alignmentClass)} data-component-id={node.id}>
      {/* Settings Gear Icon */}
      <SettingsPopover
        title="הגדרות וידאו"
        fields={videoFields}
        values={{ ...props, controls: props.controls !== false }}
        onChange={(key, value) => updateProps(node.id, { [key]: value })}
      />
      
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
  const updateProps = useEditorStore((s) => s.updateProps);

  // Settings fields
  const dividerFields: SettingsField[] = [
    { type: "color", key: "color", label: "צבע", defaultValue: "#e2e8f0" },
    { type: "number", key: "thickness", label: "עובי (px)", min: 1, max: 10 },
    { type: "number", key: "spacing", label: "מרווח (px)", min: 0, max: 100 },
  ];

  const style: React.CSSProperties = {
    height: props.thickness ? `${props.thickness}px` : "1px",
    backgroundColor: props.color || "#e2e8f0",
    margin: props.spacing ? `${props.spacing}px 0` : "16px 0",
    border: "none",
  };

  return (
    <div className="relative group" data-component-id={node.id}>
      {/* Settings Gear Icon */}
      <SettingsPopover
        title="הגדרות קו מפריד"
        fields={dividerFields}
        values={props}
        onChange={(key, value) => updateProps(node.id, { [key]: value })}
      />
      <hr style={style} />
    </div>
  );
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
// ImageCarouselSection Renderer
// ============================================================================

function ImageCarouselSectionRenderer({
  node,
  isEditing,
}: {
  node: PageComponent;
  isEditing: boolean;
}) {
  const props = node.props as any;
  const updateProps = useEditorStore((s) => s.updateProps);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const images = props.images || [];
  const totalImages = images.length;

  const goToNext = () => {
    if (totalImages <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  };

  const goToPrev = () => {
    if (totalImages <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  if (isEditing) {
    return (
      <div className="space-y-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border">
        {/* Content Section */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm border-b pb-2">תוכן</h4>
          
          <div>
            <label className="block text-sm font-medium mb-1">כותרת</label>
            <input
              type="text"
              value={props.headline || ""}
              onChange={(e) => updateProps(node.id, { headline: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="כותרת הסקשן..."
              dir="rtl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">תיאור (אופציונלי)</label>
            <textarea
              value={props.description || ""}
              onChange={(e) => updateProps(node.id, { description: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="תיאור מתחת לקרוסלה..."
              rows={2}
              dir="rtl"
            />
          </div>
        </div>

        {/* Images Management */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm border-b pb-2">תמונות ({images.length})</h4>
          
          {images.map((image: any, index: number) => (
            <div key={index} className="p-3 border rounded-md space-y-2 bg-white dark:bg-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">תמונה {index + 1}</span>
                <button
                  onClick={() => {
                    const newImages = images.filter((_: any, i: number) => i !== index);
                    updateProps(node.id, { images: newImages });
                  }}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  מחק
                </button>
              </div>
              
              <input
                type="url"
                value={image.src || ""}
                onChange={(e) => {
                  const newImages = [...images];
                  newImages[index] = { ...image, src: e.target.value };
                  updateProps(node.id, { images: newImages });
                }}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="כתובת התמונה (URL)..."
              />
              
              <input
                type="text"
                value={image.alt || ""}
                onChange={(e) => {
                  const newImages = [...images];
                  newImages[index] = { ...image, alt: e.target.value };
                  updateProps(node.id, { images: newImages });
                }}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="טקסט חלופי..."
                dir="rtl"
              />
              
              <input
                type="text"
                value={image.caption || ""}
                onChange={(e) => {
                  const newImages = [...images];
                  newImages[index] = { ...image, caption: e.target.value };
                  updateProps(node.id, { images: newImages });
                }}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="כיתוב (אופציונלי)..."
                dir="rtl"
              />

              {image.src && (
                <div className="mt-2">
                  <NextImage
                    src={image.src}
                    alt={image.alt || "Preview"}
                    width={200}
                    height={112}
                    className="rounded object-cover"
                  />
                </div>
              )}
            </div>
          ))}
          
          <button
            onClick={() => {
              const newImages = [...images, { src: "", alt: "", caption: "" }];
              updateProps(node.id, { images: newImages });
            }}
            className="text-sm text-primary hover:underline"
          >
            + הוסף תמונה
          </button>
        </div>

        {/* Colors Section */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm border-b pb-2">צבעים</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">רקע</label>
              <input
                type="color"
                value={props.backgroundColor || "#0A1628"}
                onChange={(e) => updateProps(node.id, { backgroundColor: e.target.value })}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium mb-1">כותרת</label>
              <input
                type="color"
                value={props.headlineColor || "#FFFFFF"}
                onChange={(e) => updateProps(node.id, { headlineColor: e.target.value })}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium mb-1">קו תחתון</label>
              <input
                type="color"
                value={props.underlineColor || "#00D4AA"}
                onChange={(e) => updateProps(node.id, { underlineColor: e.target.value })}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium mb-1">צבע דגש</label>
              <input
                type="color"
                value={props.accentColor || "#00D4AA"}
                onChange={(e) => updateProps(node.id, { accentColor: e.target.value })}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm border-b pb-2">הגדרות</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={props.autoplay || false}
                onChange={(e) => updateProps(node.id, { autoplay: e.target.checked })}
              />
              הפעלה אוטומטית
            </label>
            
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={props.showDots !== false}
                onChange={(e) => updateProps(node.id, { showDots: e.target.checked })}
              />
              הצג נקודות
            </label>
            
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={props.showArrows !== false}
                onChange={(e) => updateProps(node.id, { showArrows: e.target.checked })}
              />
              הצג חיצים
            </label>
            
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={props.showCounter !== false}
                onChange={(e) => updateProps(node.id, { showCounter: e.target.checked })}
              />
              הצג מונה
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">יחס תמונה</label>
            <select
              value={props.aspectRatio || "16:9"}
              onChange={(e) => updateProps(node.id, { aspectRatio: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="16:9">16:9 (רחב)</option>
              <option value="4:3">4:3 (קלאסי)</option>
              <option value="1:1">1:1 (ריבועי)</option>
              <option value="21:9">21:9 (סינמטי)</option>
              <option value="auto">אוטומטי</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">התאמת תמונה</label>
            <select
              value={props.imageObjectFit || "contain"}
              onChange={(e) => updateProps(node.id, { imageObjectFit: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="contain">התאם לגודל (Contain)</option>
              <option value="cover">כסה (Cover)</option>
              <option value="fill">מלא (Fill)</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  // VIEW MODE - Render the actual carousel
  const backgroundColor = props.backgroundColor || "#0A1628";
  const headlineColor = props.headlineColor || "#FFFFFF";
  const underlineColor = props.underlineColor || "#00D4AA";
  const accentColor = props.accentColor || "#00D4AA";
  const aspectRatio = props.aspectRatio || "16:9";
  const imageObjectFit = props.imageObjectFit || "contain";
  const showDots = props.showDots !== false;
  const showArrows = props.showArrows !== false;
  const showCounter = props.showCounter !== false;
  
  const currentImage = images[currentIndex];

  const getAspectRatioStyle = (): React.CSSProperties => {
    switch (aspectRatio) {
      case "16:9": return { aspectRatio: "16/9" };
      case "4:3": return { aspectRatio: "4/3" };
      case "1:1": return { aspectRatio: "1/1" };
      case "21:9": return { aspectRatio: "21/9" };
      default: return { minHeight: "400px" };
    }
  };

  return (
    <div
      data-component-id={node.id}
      style={{
        backgroundColor,
        padding: "60px 24px",
        direction: "rtl",
      }}
    >
      {/* Headline */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h2
          style={{
            fontSize: "clamp(24px, 4vw, 40px)",
            fontWeight: 700,
            color: headlineColor,
            margin: 0,
            marginBottom: "16px",
          }}
        >
          {props.headline || "כותרת הקרוסלה"}
        </h2>
        <div
          style={{
            width: "80px",
            height: "4px",
            backgroundColor: underlineColor,
            margin: "0 auto",
            borderRadius: "2px",
          }}
        />
      </div>

      {/* Carousel */}
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {totalImages > 0 ? (
          <div
            style={{
              position: "relative",
              width: "100%",
              ...getAspectRatioStyle(),
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <NextImage
              src={currentImage?.src || "/placeholder.png"}
              alt={currentImage?.alt || "תמונה"}
              fill
              style={{ objectFit: imageObjectFit as any }}
            />
          </div>
        ) : (
          <div
            style={{
              ...getAspectRatioStyle(),
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            הוסף תמונות
          </div>
        )}

        {/* Navigation */}
        {totalImages > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            {showArrows && (
              <button
                onClick={goToPrev}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                ›
              </button>
            )}

            {showDots && (
              <div style={{ display: "flex", gap: "8px" }}>
                {images.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    style={{
                      width: index === currentIndex ? "24px" : "8px",
                      height: "8px",
                      borderRadius: "4px",
                      backgroundColor: index === currentIndex ? accentColor : "rgba(255,255,255,0.3)",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                  />
                ))}
              </div>
            )}

            {showArrows && (
              <button
                onClick={goToNext}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                ‹
              </button>
            )}
          </div>
        )}

        {/* Counter */}
        {showCounter && totalImages > 1 && (
          <div
            style={{
              textAlign: "center",
              marginTop: "12px",
              color: accentColor,
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {currentIndex + 1} / {totalImages}
          </div>
        )}
      </div>

      {/* Description */}
      {props.description && (
        <p
          style={{
            maxWidth: "700px",
            margin: "32px auto 0",
            fontSize: "16px",
            lineHeight: 1.7,
            color: props.descriptionColor || "#94A3B8",
            textAlign: "center",
          }}
        >
          {props.description}
        </p>
      )}
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

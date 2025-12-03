"use client";

import React from "react";
import type { PageComponent, ContainerProps } from "@/components/landing-page/types";
import { useEditorStore } from "@/hooks/use-editor-store";
import { EditableWrapper } from "./editable-wrapper";
import { ComponentRenderer } from "./component-renderer";
import { DropZone, ContainerDropZone } from "./drop-zone";
import { cn } from "@/lib/utils";

// ============================================================================
// Render Node Function
// ============================================================================

type RenderNodeProps = {
  node: PageComponent;
  parentId: string | null;
};

export function RenderNode({ node, parentId }: RenderNodeProps) {
  const editingId = useEditorStore((s) => s.editingId);
  const isEditing = editingId === node.id;

  // For Page node, render children with drop zones
  if (node.type === "Page") {
    return (
      <div className="min-h-screen group" data-component-id={node.id}>
        {/* Drop zone at the beginning */}
        <DropZone parentId={node.id} index={0} />
        
        {node.children?.map((child, index) => (
          <React.Fragment key={child.id}>
            <RenderNode node={child} parentId={node.id} />
            {/* Drop zone after each child */}
            <DropZone parentId={node.id} index={index + 1} />
          </React.Fragment>
        ))}
        
        {/* Show placeholder if empty */}
        {(!node.children || node.children.length === 0) && (
          <ContainerDropZone containerId={node.id} isEmpty />
        )}
      </div>
    );
  }

  // For Container-like components, render with children and drop zones
  if (
    node.type === "Container" ||
    node.type === "TextContainer" ||
    node.type === "Form" ||
    node.type === "Section" ||
    node.type === "Grid" ||
    node.type === "Card"
  ) {
    return (
      <EditableWrapper node={node} parentId={parentId}>
        <ContainerWithChildren node={node} isEditing={isEditing} />
      </EditableWrapper>
    );
  }

  // For all other components, wrap in EditableWrapper
  return (
    <EditableWrapper node={node} parentId={parentId}>
      <ComponentRenderer node={node} isEditing={isEditing} />
    </EditableWrapper>
  );
}

// ============================================================================
// Container With Children - Now with Layout Support
// ============================================================================

function ContainerWithChildren({
  node,
  isEditing,
}: {
  node: PageComponent;
  isEditing: boolean;
}) {
  const props = node.props as ContainerProps;
  const style = props.style || {};
  
  // Get layout from props.layout first, then fall back to style.flexDirection
  const layout = props.layout || style.flexDirection || "column";
  const isHorizontal = layout === "row";

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: layout,
    alignItems: style.alignItems || (isHorizontal ? "center" : "stretch"),
    justifyContent: style.justifyContent || "flex-start",
    gap: typeof style.gap === "number" ? `${style.gap}px` : (style.gap || "16px"),
    padding:
      typeof style.padding === "number" ? `${style.padding}px` : style.padding,
    background: style.background,
    borderRadius:
      typeof style.radius === "number" ? `${style.radius}px` : style.radius,
    border: style.border,
    width: style.width || "100%",
    maxWidth: (props as any).maxWidth || style.maxWidth,
    textAlign: (props as any).textAlign || style.textAlign,
    minHeight: style.minHeight || (isHorizontal ? "auto" : undefined),
    flex: style.flex,
    flexWrap: isHorizontal ? "wrap" : undefined,
    margin: ((props as any).maxWidth || style.maxWidth) ? "0 auto" : undefined,
  };

  // TextContainer specific styles
  if (node.type === "TextContainer") {
    return (
      <div
        style={{ textAlign: (props as any).align || "left", width: "100%" }}
        data-component-id={node.id}
        className="group"
      >
        <DropZone parentId={node.id} index={0} />
        {node.children?.map((child, index) => (
          <React.Fragment key={child.id}>
            <RenderNode node={child} parentId={node.id} />
            <DropZone parentId={node.id} index={index + 1} />
          </React.Fragment>
        ))}
        {(!node.children || node.children.length === 0) && (
          <ContainerDropZone containerId={node.id} isEmpty />
        )}
      </div>
    );
  }

  // Section specific rendering
  if (node.type === "Section") {
    const sectionProps = props as any;
    return (
      <section
        id={sectionProps.id}
        className={cn("group", sectionProps.className)}
        style={sectionProps.style}
        data-component-id={node.id}
      >
        <DropZone parentId={node.id} index={0} />
        {node.children?.map((child, index) => (
          <React.Fragment key={child.id}>
            <RenderNode node={child} parentId={node.id} />
            <DropZone parentId={node.id} index={index + 1} />
          </React.Fragment>
        ))}
        {(!node.children || node.children.length === 0) && (
          <ContainerDropZone containerId={node.id} isEmpty />
        )}
      </section>
    );
  }

  // Grid specific rendering
  if (node.type === "Grid") {
    const gridProps = props as any;
    const gridStyle: React.CSSProperties = {
      display: 'grid',
      gridTemplateColumns: `repeat(${gridProps.columns || 3}, 1fr)`,
      gap: gridProps.gap || '1rem',
      ...gridProps.style,
    };
    
    return (
      <div
        style={gridStyle}
        data-component-id={node.id}
        className="group"
      >
        <DropZone parentId={node.id} index={0} />
        {node.children?.map((child, index) => (
          <React.Fragment key={child.id}>
            <RenderNode node={child} parentId={node.id} />
            <DropZone parentId={node.id} index={index + 1} />
          </React.Fragment>
        ))}
        {(!node.children || node.children.length === 0) && (
          <ContainerDropZone containerId={node.id} isEmpty />
        )}
      </div>
    );
  }

  // Card specific rendering (simple container)
  if (node.type === "Card") {
    const cardProps = props as any;
    return (
      <div
        style={cardProps.style}
        data-component-id={node.id}
        className="group"
      >
        <DropZone parentId={node.id} index={0} />
        {node.children?.map((child, index) => (
          <React.Fragment key={child.id}>
            <RenderNode node={child} parentId={node.id} />
            <DropZone parentId={node.id} index={index + 1} />
          </React.Fragment>
        ))}
        {(!node.children || node.children.length === 0) && (
          <ContainerDropZone containerId={node.id} isEmpty />
        )}
      </div>
    );
  }

  // Regular Container with drop zones
  return (
    <div 
      style={containerStyle} 
      data-component-id={node.id} 
      data-layout={layout}
      className={cn(
        "group relative transition-all duration-200",
        // Visual indicator for layout direction
        isHorizontal && "flex-row",
        !isHorizontal && "flex-col"
      )}
    >
      {/* Layout indicator badge (shown when empty or few children) */}
      {node.children && node.children.length <= 1 && (
        <div className="absolute -top-5 right-2 text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          {isHorizontal ? "← שורה →" : "↑ עמודה ↓"}
        </div>
      )}

      {/* Drop zone at the beginning */}
      <DropZone 
        parentId={node.id} 
        index={0} 
        orientation={isHorizontal ? "horizontal" : "vertical"} 
      />
      
      {node.children?.map((child, index) => (
        <React.Fragment key={child.id}>
          {/* Child component with flex item styling */}
          <div 
            className={cn(
              "relative",
              isHorizontal && "flex-shrink-0"
            )}
            style={{
              flex: isHorizontal ? "0 0 auto" : undefined,
            }}
          >
            <RenderNode node={child} parentId={node.id} />
          </div>
          {/* Drop zone after each child */}
          <DropZone 
            parentId={node.id} 
            index={index + 1} 
            orientation={isHorizontal ? "horizontal" : "vertical"} 
          />
        </React.Fragment>
      ))}
      
      {/* Show empty placeholder if no children */}
      {(!node.children || node.children.length === 0) && (
        <ContainerDropZone containerId={node.id} isEmpty />
      )}
    </div>
  );
}

// ============================================================================
// Export helper for Canvas
// ============================================================================

export function renderPage(pageJson: PageComponent) {
  return <RenderNode node={pageJson} parentId={null} />;
}

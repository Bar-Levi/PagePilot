
"use client";

import React from "react";
import type { PageComponent, PageData } from "./types";

// Import the new atomic components
import { Container } from "./atomic/Container";
import { RichText } from "./atomic/RichText";
import { ImageComponent } from "./atomic/Image";
import { ButtonComponent } from "./atomic/Button";

// Map component types to the actual component implementations
const componentMap: { [key: string]: React.ComponentType<any> } = {
  Container: Container,
  RichText: RichText,
  Image: ImageComponent,
  Button: ButtonComponent,
  Video: (props: any) => <div>Video Component (Not Implemented): {props.youtubeId}</div>,
  Input: (props: any) => <input placeholder={props.placeholder} />,
  Checkbox: (props: any) => <div><input type="checkbox" /> {props.label}</div>,
  Divider: (props: any) => <hr />,
  Carousel: (props: any) => <div>Carousel Component (Not Implemented)</div>,
  Form: (props: any) => <form>{props.children}</form>,
};

const RenderComponent = ({ component }: { component: PageComponent }): React.ReactElement | null => {
  const Component = componentMap[component.type];

  if (!Component) {
    console.warn(`Component of type "${component.type}" not found.`, component);
    return (
      <div className="py-12 bg-destructive/10 text-center">
        <p className="text-destructive font-semibold">
          Error: Component type "{component.type}" is not supported.
        </p>
      </div>
    );
  }

  // For containers, we need to recursively render children
  if (component.type === "Container" && component.children) {
    return (
      <Component {...component.props} id={component.id}>
        {component.children.map((child) => (
          <RenderComponent key={child.id} component={child} />
        ))}
      </Component>
    );
  }
  
  // For atomic components without children
  return <Component {...component.props} />;
};


type ComponentRendererProps = {
  pageData: PageData | null;
  onUpdate: (pageData: PageData) => void;
};

export function ComponentRenderer({ pageData, onUpdate }: ComponentRendererProps) {
  if (!pageData || !pageData.pageStructure || !Array.isArray(pageData.pageStructure)) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">No page structure found.</p>
      </div>
    );
  }

  // The onUpdate function will be used later for inline editing.
  // For now, we are just focusing on rendering.

  return (
    <>
      {pageData.pageStructure.map((component) => (
        <RenderComponent key={component.id} component={component} />
      ))}
    </>
  );
}

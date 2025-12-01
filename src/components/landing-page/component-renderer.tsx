
"use client";

import React from "react";
import type { PageComponent, PageData } from "./types";

// NOTE: These are placeholder components. We will create the real ones in the next steps.
const componentMap: { [key: string]: React.ComponentType<any> } = {
  RichText: (props: any) => <div>RichText Component: {JSON.stringify(props.content)}</div>,
  Image: (props: any) => <img src={props.src} alt={props.alt} style={{ maxWidth: '100%' }} />,
  Button: (props: any) => <button>{props.text}</button>,
  Video: (props: any) => <div>Video Component: {props.youtubeId}</div>,
  Input: (props: any) => <input placeholder={props.placeholder} />,
  Checkbox: (props: any) => <div><input type="checkbox" /> {props.label}</div>,
  Divider: (props: any) => <hr />,
  Carousel: (props: any) => <div>Carousel Component</div>,
  Form: (props: any) => <form>{props.children}</form>,
  Container: (props: any) => (
    <div style={props.style} data-container-id={props.id}>
      {props.children}
    </div>
  ),
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
  
  // For atomic components
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

  // The onUpdate function will need to be adapted later to handle updates to the new structure.
  // For now, we are just focusing on rendering.

  return (
    <>
      {pageData.pageStructure.map((component) => (
        <RenderComponent key={component.id} component={component} />
      ))}
    </>
  );
}

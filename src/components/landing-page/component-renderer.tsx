
"use client";

import React from "react";
import type { PageComponent, PageData } from "./types";

// Import the new atomic components
import { Container } from "./atomic/Container";
import { RichText } from "./atomic/RichText";
import { ImageComponent } from "./atomic/Image";
import { ButtonComponent } from "./atomic/Button";
import { EditableComponentWrapper } from "../editor/editable-component-wrapper";

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

type RenderComponentProps = {
  component: PageComponent;
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
};


const RenderComponent = ({ component, selectedComponentId, onSelectComponent }: RenderComponentProps): React.ReactElement | null => {
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

  const isSelected = selectedComponentId === component.id;

  const renderedComponent = (
    (component.type === "Container" && component.children) ? (
      <Component {...component.props} id={component.id}>
        {component.children.map((child) => (
          <RenderComponent 
            key={child.id} 
            component={child} 
            selectedComponentId={selectedComponentId}
            onSelectComponent={onSelectComponent}
            />
        ))}
      </Component>
    ) : (
      <Component {...component.props} id={component.id} />
    )
  );

  return (
    <EditableComponentWrapper
      component={component}
      isSelected={isSelected}
      onSelect={onSelectComponent}
    >
      {renderedComponent}
    </EditableComponentWrapper>
  );
};


type ComponentRendererProps = {
  pageData: PageData | null;
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
};

export function ComponentRenderer({ pageData, selectedComponentId, onSelectComponent }: ComponentRendererProps) {
  if (!pageData || !pageData.pageStructure || !Array.isArray(pageData.pageStructure)) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">No page structure found.</p>
      </div>
    );
  }

  return (
    <>
      {pageData.pageStructure.map((component) => (
        <RenderComponent 
          key={component.id} 
          component={component} 
          selectedComponentId={selectedComponentId}
          onSelectComponent={onSelectComponent}
        />
      ))}
    </>
  );
}

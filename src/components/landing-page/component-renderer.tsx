

"use client";

import React from "react";
import type { PageComponent, PageData } from "./types";

// Import the atomic components
import { Container } from "./atomic/Container";
import { TextContainer } from "./atomic/TextContainer";
import { TextSpan } from "./atomic/TextSpan";
import { RichText } from "./atomic/RichText";
import { ImageComponent } from "./atomic/Image";
import { ButtonComponent } from "./atomic/Button";
import { Section } from "./atomic/Section";
import { Heading } from "./atomic/Heading";
import { Text } from "./atomic/Text";
import { Grid } from "./atomic/Grid";
import { SimpleCard } from "./atomic/SimpleCard";
import { TestimonialsGrid } from "./atomic/TestimonialsGrid";
import { FAQAccordion } from "./atomic/FAQAccordion";
import { Steps } from "./atomic/Steps";
import { StatsGrid } from "./atomic/StatsGrid";
// Professional landing page components
import { AuthorityBio } from "./atomic/AuthorityBio";
import { DisqualificationCard } from "./atomic/DisqualificationCard";
import { ValueStack } from "./atomic/ValueStack";
import { GuaranteeSection } from "./atomic/GuaranteeSection";
import { AlertBanner } from "./atomic/AlertBanner";
import { PainPointCard } from "./atomic/PainPointCard";
import { StepsRoadmap } from "./atomic/StepsRoadmap";
import { EditableComponentWrapper } from "../editor/editable-component-wrapper";

// Map component types to the actual component implementations
const componentMap: { [key: string]: React.ComponentType<any> } = {
  // Layout components
  Section: Section,
  Container: Container,
  Grid: Grid,
  
  // Text components
  Heading: Heading,
  Text: Text,
  TextContainer: TextContainer,
  TextSpan: TextSpan,
  RichText: RichText,
  
  // Interactive components
  Button: ButtonComponent,
  Card: SimpleCard,
  
  // Specialized components
  TestimonialsGrid: TestimonialsGrid,
  FAQAccordion: FAQAccordion,
  Steps: Steps,
  StatsGrid: StatsGrid,
  
  // Media components
  Image: ImageComponent,
  Video: (props: any) => <div>Video Component (Not Implemented): {props.youtubeId}</div>,
  
  // Form components
  Input: (props: any) => <input placeholder={props.placeholder} />,
  Checkbox: (props: any) => <div><input type="checkbox" /> {props.label}</div>,
  Form: (props: any) => <form>{props.children}</form>,
  
  // Utility components
  Divider: (props: any) => <hr />,
  Carousel: (props: any) => <div>Carousel Component (Not Implemented)</div>,
  
  // Professional landing page components
  AuthorityBio: AuthorityBio,
  DisqualificationCard: DisqualificationCard,
  ValueStack: ValueStack,
  GuaranteeSection: GuaranteeSection,
  AlertBanner: AlertBanner,
  PainPointCard: PainPointCard,
  StepsRoadmap: StepsRoadmap,
};

type RenderComponentProps = {
  component: PageComponent;
  selectedComponentIds: string[];
  onSelectComponent: (id: string | null, multiSelect?: boolean) => void;
  onUpdateComponent?: (id: string, props: any) => void;
  onSelectRichText?: (id: string, type: string, element: HTMLDivElement) => void;
};


const RenderComponent = ({ component, selectedComponentIds, onSelectComponent, onUpdateComponent, onSelectRichText }: RenderComponentProps): React.ReactElement | null => {
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

  const isSelected = selectedComponentIds.includes(component.id);

  const renderedComponent = (
    (component.children && component.children.length > 0) ? (
      <Component {...component.props} id={component.id}>
        {component.children.map((child) => (
          <RenderComponent
            key={child.id}
            component={child}
            selectedComponentIds={selectedComponentIds}
            onSelectComponent={onSelectComponent}
            onUpdateComponent={onUpdateComponent}
            onSelectRichText={onSelectRichText}
            />
        ))}
      </Component>
    ) : component.type === 'RichText' ? (
      <Component
        {...component.props}
        id={component.id}
        onChange={(html: string) => {
          onUpdateComponent?.(component.id, { html });
        }}
        onSelect={onSelectRichText}
      />
    ) : (
      <Component {...component.props} id={component.id} />
    )
  );

  const handleRichTextChange = (html: string) => {
    // This will be passed down to the RichText component
    // The actual update will happen in the RichText component via props
  };

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
  selectedComponentIds: string[];
  onSelectComponent: (id: string | null, multiSelect?: boolean) => void;
  onUpdateComponent?: (id: string, props: any) => void;
  onSelectRichText?: (id: string, type: string, element: HTMLDivElement) => void;
};

export function ComponentRenderer({ pageData, selectedComponentIds, onSelectComponent, onUpdateComponent, onSelectRichText }: ComponentRendererProps) {
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
          selectedComponentIds={selectedComponentIds}
          onSelectComponent={onSelectComponent}
          onUpdateComponent={onUpdateComponent}
        />
      ))}
    </>
  );
}

"use client";

import type { PageComponent } from "../landing-page/types";
import { useNewEditorContext } from "@/hooks/use-new-editor-context";
import { PropertyEditor } from "./property-editors";
import { getComponentProperties } from "./component-property-registry";
import { ScrollArea } from "../ui/scroll-area";

type PropsEditorPanelProps = {
  selectedComponent: PageComponent | null;
};

export function PropsEditorPanel({ selectedComponent }: PropsEditorPanelProps) {
  const { updateComponentProps } = useNewEditorContext();

  const handlePropertyChange = (propertyKey: string, value: any) => {
    if (!selectedComponent) return;

    const newProps = {
      ...selectedComponent.props,
      [propertyKey]: value,
    };

    updateComponentProps(selectedComponent.id, newProps);
  };

  if (!selectedComponent) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground" dir="rtl">
        בחר רכיב מהדף כדי לערוך את המאפיינים שלו.
      </div>
    );
  }

  const propertyConfigs = getComponentProperties(selectedComponent.type);

  // For RichText, exclude the html property since it's edited inline
  const filteredConfigs =
    selectedComponent.type === "RichText"
      ? propertyConfigs.filter((config) => config.key !== "html")
      : propertyConfigs;

  return (
    <div className="p-4 space-y-4" dir="rtl">
      <div>
        <h3 className="text-md font-medium">עריכת רכיב</h3>
        <p className="text-sm text-muted-foreground">
          סוג: {selectedComponent.type}
        </p>
        {selectedComponent.type === "RichText" && (
          <p className="text-xs text-blue-600 mt-1">
            💡 הטקסט נערך ישירות על הדף באמצעות סרגל הכלים העליון
          </p>
        )}
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {filteredConfigs.length > 0 ? (
            filteredConfigs.map((config) => (
              <PropertyEditor
                key={config.key}
                component={selectedComponent}
                config={config}
                value={selectedComponent.props[config.key]}
                onChange={(value) => handlePropertyChange(config.key, value)}
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              אין מאפיינים זמינים לעריכה עבור רכיב זה.
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

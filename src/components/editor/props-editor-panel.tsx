
"use client";

import type { PageComponent } from "../landing-page/types";

type PropsEditorPanelProps = {
  selectedComponent: PageComponent | null;
};

export function PropsEditorPanel({ selectedComponent }: PropsEditorPanelProps) {
  if (!selectedComponent) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground" dir="rtl">
        בחר רכיב מהדף כדי לערוך את המאפיינים שלו.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4" dir="rtl">
        <div>
            <h3 className="text-md font-medium">עריכת רכיב</h3>
            <p className="text-sm text-muted-foreground">סוג: {selectedComponent.type}</p>
        </div>
        
        <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto">
            {JSON.stringify(selectedComponent.props, null, 2)}
        </pre>
        <p className="text-xs text-muted-foreground text-center mt-4">עריכת מאפיינים תתווסף בקרוב!</p>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/hooks/use-editor-store";
import { EditorLayout } from "./editor-layout";
import type { PageComponent } from "@/components/landing-page/types";

interface EditorWrapperProps {
  initialConfig?: PageComponent;
  landingPageId?: string;
  tenantId: string;
}

export function EditorWrapper({ initialConfig, landingPageId, tenantId }: EditorWrapperProps) {
  const setPageJson = useEditorStore((s) => s.setPageJson);

  useEffect(() => {
    // Load initial config if provided
    if (initialConfig) {
      console.log("📄 Loading existing page config into editor");
      setPageJson(initialConfig);
    }
  }, [initialConfig, setPageJson]);

  return <EditorLayout />;
}

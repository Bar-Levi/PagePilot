
"use client";

import { cn } from "@/lib/utils";
import type { PageComponent } from "../landing-page/types";

type EditableComponentWrapperProps = {
  children: React.ReactNode;
  component: PageComponent;
  isSelected: boolean;
  onSelect: (id: string | null) => void;
};

export function EditableComponentWrapper({
  children,
  component,
  isSelected,
  onSelect,
}: EditableComponentWrapperProps) {
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(component.id);
  };

  return (
    <div
      className={cn(
        "relative outline-dashed outline-1 outline-transparent hover:outline-blue-500",
        isSelected && "outline-blue-500 outline-2"
      )}
      onClick={handleSelect}
    >
      {isSelected && (
        <div className="absolute -top-5 left-0 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-t-md pointer-events-none">
          {component.type}
        </div>
      )}
      {children}
    </div>
  );
}

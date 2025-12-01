
"use client";

import type { PageData } from "../landing-page/types";
import { ComponentRenderer } from "../landing-page/component-renderer";
import { Skeleton } from "../ui/skeleton";

type CanvasProps = {
  pageData: PageData | null;
  isLoading: boolean;
  onUpdate: (data: PageData) => void;
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
};

function LoadingSkeleton() {
  return (
    <div className="p-8 space-y-12">
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3 mx-auto" />
        <div className="grid md:grid-cols-3 gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}

export function Canvas({
  pageData,
  isLoading,
  onUpdate,
  selectedComponentId,
  onSelectComponent,
}: CanvasProps) {

  return (
    <div className="bg-background w-full min-h-full" onClick={() => onSelectComponent(null)}>
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <LoadingSkeleton />
        ) : pageData?.pageStructure ? (
          <ComponentRenderer 
            pageData={pageData} 
            onUpdate={onUpdate}
            selectedComponentId={selectedComponentId}
            onSelectComponent={onSelectComponent}
           />
        ) : (
          <div className="flex items-center justify-center h-[80vh]">
            <p className="text-muted-foreground">
              Something went wrong. Please regenerate the page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

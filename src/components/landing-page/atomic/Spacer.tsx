"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type SpacerProps = {
  height?: number;
  showLine?: boolean;
  lineColor?: string;
  lineWidth?: string;
  lineStyle?: "solid" | "dashed" | "dotted";
};

export function SpacerComponent({
  height = 48,
  showLine = false,
  lineColor = "#e2e8f0",
  lineWidth = "100%",
  lineStyle = "solid",
}: SpacerProps & { id?: string; onClick?: () => void }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ height: `${height}px` }}
    >
      {showLine && (
        <div
          className="absolute"
          style={{
            width: lineWidth,
            height: "1px",
            backgroundColor: lineColor,
            borderTop: lineStyle !== "solid" ? `1px ${lineStyle} ${lineColor}` : undefined,
          }}
        />
      )}
    </div>
  );
}


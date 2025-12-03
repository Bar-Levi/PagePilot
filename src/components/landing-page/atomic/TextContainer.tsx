"use client";
import React from "react";
import type { TextContainerProps } from "../types";
import { cn } from "@/lib/utils";

export const TextContainer: React.FC<
  TextContainerProps & {
    children: React.ReactNode;
    id: string;
    onClick?: () => void;
  }
> = ({ align = "left", children, id, onClick }) => {
  return (
    <div
      data-component-id={id}
      data-component-type="TextContainer"
      className={cn("w-full", `text-${align}`, onClick ? "cursor-pointer" : "")}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

"use client";

import React, { useState, useRef, useEffect } from "react";
import type { PageComponent } from "../landing-page/types";
import { useNewEditorContext } from "@/hooks/use-new-editor-context";

type InlineTextEditorProps = {
  component: PageComponent;
};

export function InlineTextEditor({ component }: InlineTextEditorProps) {
  const { updateComponentProps, editMode, setEditMode } = useNewEditorContext();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(component.props.text || "");
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editMode === "text-edit") {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    if (isEditing) {
      setIsEditing(false);
      if (value !== component.props.text) {
        updateComponentProps(component.id, { text: value });
      }
      setEditMode("select");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setValue(component.props.text || "");
      setIsEditing(false);
      setEditMode("select");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const style = {
    fontWeight: component.props.bold ? "bold" : "normal",
    fontStyle: component.props.italic ? "italic" : "normal",
    textDecoration: component.props.underline ? "underline" : "none",
    color: component.props.color,
    fontSize: component.props.size ? `${component.props.size}px` : undefined,
    lineHeight: "1.2",
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="absolute inset-0 w-full h-full bg-transparent border-none outline-none text-inherit font-inherit resize-none"
        style={{
          ...style,
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          padding: "2px 4px",
          borderRadius: "2px",
          minWidth: "50px",
        }}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <span
      ref={spanRef}
      onDoubleClick={handleDoubleClick}
      style={style}
      className={editMode === "text-edit" ? "cursor-text" : "cursor-pointer"}
    >
      {component.props.text || "Click to edit text"}
    </span>
  );
}

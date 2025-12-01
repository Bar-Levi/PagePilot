
"use client";

import type { PageComponent, PageData, RichTextNode } from "../landing-page/types";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEditorState } from "@/hooks/use-editor-state.tsx";
import { useEffect } from "react";

type PropsEditorPanelProps = {
  selectedComponent: PageComponent | null;
};

// Define schemas for different component props for validation
const RichTextPropsSchema = z.object({
  content: z.array(z.object({
    text: z.string(),
    bold: z.boolean().optional(),
    size: z.number().optional(),
  })),
  align: z.enum(["left", "right", "center", "justify"]).optional(),
});


export function PropsEditorPanel({ selectedComponent }: PropsEditorPanelProps) {
    const { updateComponentProps } = useEditorState();
    
    // We use a generic form and then cast the values based on component type
    const { register, control, handleSubmit, watch, reset } = useForm();
    
    // Reset form when selected component changes
    useEffect(() => {
        if (selectedComponent) {
            reset(selectedComponent.props);
        }
    }, [selectedComponent, reset]);

    const handlePropsChange = (data: any) => {
        if (!selectedComponent) return;
        
        // This is a simple deep merge, good enough for now
        const newProps = { ...selectedComponent.props, ...data };

        updateComponentProps(selectedComponent.id, newProps);
    };

    if (!selectedComponent) {
        return (
            <div className="p-4 text-center text-sm text-muted-foreground" dir="rtl">
                בחר רכיב מהדף כדי לערוך את המאפיינים שלו.
            </div>
        );
    }

    const renderFormFields = () => {
        switch (selectedComponent.type) {
            case "Image":
                 return (
                    <div className="space-y-2">
                        <Label htmlFor="src">כתובת תמונה (URL)</Label>
                        <Input
                            {...register("src")}
                            defaultValue={selectedComponent.props.src}
                            onBlur={handleSubmit(handlePropsChange)}
                        />
                        <p className="text-xs text-muted-foreground mt-2">שינויים נוספים יתווספו בקרוב.</p>
                    </div>
                );
            case "Button":
                 return (
                    <div className="space-y-2">
                        <Label htmlFor="text">טקסט כפתור</Label>
                        <Input
                            {...register("text")}
                            defaultValue={selectedComponent.props.text}
                            onBlur={handleSubmit(handlePropsChange)}
                        />
                        <Label htmlFor="href">קישור (Href)</Label>
                        <Input
                            {...register("href")}
                            defaultValue={selectedComponent.props.href}
                            onBlur={handleSubmit(handlePropsChange)}
                        />
                         <p className="text-xs text-muted-foreground mt-2">שינויים נוספים יתווספו בקרוב.</p>
                    </div>
                );
            case "Container":
                 return (
                    <div className="space-y-2">
                        <Label>עריכת Container</Label>
                        <p className="text-xs text-muted-foreground">עריכת מאפייני סגנון (Style) תתווסף בקרוב.</p>
                         <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto mt-2">
                            {JSON.stringify(selectedComponent.props.style, null, 2)}
                        </pre>
                    </div>
                 );
            default:
                return <p className="text-sm text-muted-foreground">אין מאפיינים שניתן לערוך עבור רכיב זה כרגע.</p>;
        }
    };

    return (
        <div className="p-4 space-y-4" dir="rtl">
            <div>
                <h3 className="text-md font-medium">עריכת רכיב</h3>
                <p className="text-sm text-muted-foreground">סוג: {selectedComponent.type}</p>
            </div>
            
            <form className="space-y-4">
                {renderFormFields()}
            </form>
        </div>
    );
}

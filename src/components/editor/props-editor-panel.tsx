
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

export function PropsEditorPanel({ selectedComponent }: PropsEditorPanelProps) {
    const { updateComponentProps } = useEditorState();
    
    // We use a generic form and then cast the values based on component type
    const { register, control, handleSubmit, watch, reset } = useForm();
    
    // Reset form when selected component changes
    useEffect(() => {
        if (selectedComponent) {
            reset(selectedComponent.props);
        } else {
            reset({});
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
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="src">כתובת תמונה (URL)</Label>
                            <Input
                                {...register("src")}
                                onBlur={handleSubmit(handlePropsChange)}
                            />
                        </div>
                         <div>
                            <Label htmlFor="alt">טקסט חלופי (Alt)</Label>
                            <Input
                                {...register("alt")}
                                onBlur={handleSubmit(handlePropsChange)}
                            />
                        </div>
                    </div>
                );
            case "Button":
                 return (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="text">טקסט כפתור</Label>
                            <Input
                                {...register("text")}
                                onBlur={handleSubmit(handlePropsChange)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="href">קישור (Href)</Label>
                            <Input
                                {...register("href")}
                                onBlur={handleSubmit(handlePropsChange)}
                            />
                        </div>
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
             case "RichText":
                 return <p className="text-sm text-muted-foreground" dir="rtl">עריכת תוכן ועיצוב טקסט מתבצעת ישירות על הדף באמצעות סרגל הכלים העליון.</p>;
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
            
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                {renderFormFields()}
            </form>
        </div>
    );
}


'use client';

import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { useEditorState } from '@/hooks/use-editor-state.tsx';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useEffect, useState } from 'react';

export function RichTextToolbar() {
  const { selectedComponent, textActionHandlers } = useEditorState();
  const [activeStyles, setActiveStyles] = useState<Record<string, any>>({});
  
  const isVisible = selectedComponent?.type === 'RichText';

  // This effect updates the toolbar's state based on the current selection.
  useEffect(() => {
    const updateToolbarState = () => {
      if (isVisible && textActionHandlers.current?.getActiveStyles) {
        setActiveStyles(textActionHandlers.current.getActiveStyles() || {});
      } else {
        setActiveStyles({});
      }
    };
    
    // Update when component selection changes
    updateToolbarState();

    // Also update when the text selection inside the editor changes
    document.addEventListener('selectionchange', updateToolbarState);
    return () => {
      document.removeEventListener('selectionchange', updateToolbarState);
    };
  }, [isVisible, selectedComponent, textActionHandlers]);

  const applyStyle = textActionHandlers.current?.applyStyle;

  const handleFormat = (style: 'bold' | 'italic' | 'underline') => (e: React.MouseEvent) => {
    e.preventDefault();
    applyStyle?.(style);
  };

  const handleAlign = (align: 'left' | 'center' | 'right') => (e: React.MouseEvent) => {
    e.preventDefault();
    applyStyle?.('align', align);
  };
  
  const handleStyleChange = (style: 'color' | 'size', value: string | number) => {
      if (!applyStyle) return;
      
      if (style === 'color') {
          applyStyle('foreColor', value);
      }
      if (style === 'size' && typeof value === 'number' && value > 0) {
          applyStyle('fontSize', value);
      }
  };

  if (!isVisible) {
    return (
       <div className="h-[57px] border-b bg-background flex items-center p-2">
         <p className="text-sm text-muted-foreground px-2">Select a text component to see formatting options</p>
       </div>
    );
  }

  return (
    <div
      className={cn(
        'border-b bg-background flex items-center p-2 gap-2 z-10'
      )}
      onMouseDown={(e) => e.preventDefault()}
    >
      <Button variant="ghost" size="icon" className={cn("hover:bg-muted", activeStyles.bold && "bg-muted")} onClick={handleFormat('bold')}>
        <Bold className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" className={cn("hover:bg-muted", activeStyles.italic && "bg-muted")} onClick={handleFormat('italic')}>
        <Italic className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" className={cn("hover:bg-muted", activeStyles.underline && "bg-muted")} onClick={handleFormat('underline')}>
        <Underline className="w-4 h-4" />
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <Button variant="ghost" size="icon" className={cn("hover:bg-muted", activeStyles.align === 'left' && "bg-muted")} onClick={handleAlign('left')}>
        <AlignLeft className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" className={cn("hover:bg-muted", activeStyles.align === 'center' && "bg-muted")} onClick={handleAlign('center')}>
        <AlignCenter className="w-4 h-4" />
      </Button>
       <Button variant="ghost" size="icon" className={cn("hover:bg-muted", activeStyles.align === 'right' && "bg-muted")} onClick={handleAlign('right')}>
        <AlignRight className="w-4 h-4" />
      </Button>
      <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-2">
            <Label htmlFor="font-size" className="text-sm">Size</Label>
            <Input 
                type="number" 
                id="font-size" 
                className="w-20 h-8"
                value={activeStyles.size || ''}
                onChange={(e) => handleStyleChange('size', parseInt(e.target.value, 10))}
                onBlur={() => {
                  if (activeStyles.size) {
                    handleStyleChange('size', activeStyles.size);
                  }
                }}
            />
        </div>
        <div className="flex items-center gap-2">
            <Label htmlFor="font-color" className="text-sm">Color</Label>
            <Input 
                type="color" 
                id="font-color" 
                className="w-8 h-8 p-1"
                value={activeStyles.color || '#000000'}
                onChange={(e) => handleStyleChange('color', e.target.value)}
            />
        </div>
    </div>
  );
}

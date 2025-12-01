
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
  const { selectedComponent, applyStyle, getActiveStyles } = useEditorState();
  const [activeStyles, setActiveStyles] = useState<Record<string, any>>({});

  const isVisible = selectedComponent?.type === 'RichText';

  useEffect(() => {
    if (isVisible && getActiveStyles) {
      const update = () => setActiveStyles(getActiveStyles() || {});
      
      // Initial update
      update();
      
      // Subsequent updates on selection change
      document.addEventListener('selectionchange', update);
      return () => {
        document.removeEventListener('selectionchange', update);
      };
    } else {
      setActiveStyles({});
    }
  }, [isVisible, getActiveStyles, selectedComponent]);
  
  const handleFormat = (style: 'bold' | 'italic' | 'underline') => (e: React.MouseEvent) => {
    e.preventDefault();
    applyStyle?.(style);
  };

  const handleAlign = (align: 'left' | 'center' | 'right') => (e: React.MouseEvent) => {
    e.preventDefault();
    applyStyle?.('align', align);
  };
  
  const handleStyleChange = (style: 'color' | 'size', value: string | number) => {
    applyStyle?.(style, value);
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
      <Button variant="ghost" size="icon" className={cn("hover
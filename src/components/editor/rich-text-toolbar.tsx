
'use client';

import { Bold, Italic, Underline } from 'lucide-react';
import { useEditorState } from '@/hooks/use-editor-state.tsx';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

export function RichTextToolbar() {
  const { selectedComponent } = useEditorState();
  
  const handleFormat = (command: string) => (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent editor from losing focus
    document.execCommand(command, false);
  };
  
  const isVisible = selectedComponent?.type === 'RichText';

  if (!isVisible) {
    return (
       <div className="h-[57px] border-b bg-background flex items-center p-2">
         <p className="text-sm text-muted-foreground px-2">Select a component to see its options</p>
       </div>
    )
  }

  return (
    <div
      className={cn(
        'border-b bg-background flex items-center p-2 gap-1 z-10'
      )}
      onMouseDown={(e) => e.preventDefault()} // Prevent editor from losing focus on toolbar click
    >
      <Button variant="ghost" size="icon" className="hover:bg-muted" onClick={handleFormat('bold')}>
        <Bold className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" className="hover:bg-muted" onClick={handleFormat('italic')}>
        <Italic className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" className="hover:bg-muted" onClick={handleFormat('underline')}>
        <Underline className="w-4 h-4" />
      </Button>
    </div>
  );
}

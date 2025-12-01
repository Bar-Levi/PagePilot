
'use client';

import { Bold, Italic, Underline } from 'lucide-react';
import { useEditorState } from '@/hooks/use-editor-state.tsx';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useState, useRef } from 'react';

export function RichTextToolbar() {
  const { selectedComponentId, selectedComponent } = useEditorState();
  const [position, setPosition] = useState({ top: -9999, left: -9999 });
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculatePosition = () => {
      if (selectedComponent?.type !== 'RichText' || !selectedComponentId) {
        setPosition({ top: -9999, left: -9999 });
        return;
      }
      
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
          const componentEl = document.querySelector(`[data-component-id="${selectedComponentId}"]`);
          if (componentEl) {
              const rect = componentEl.getBoundingClientRect();
              const toolbarWidth = toolbarRef.current?.offsetWidth || 0;
              setPosition({
                  top: rect.top - 60,
                  left: rect.left + (rect.width / 2) - (toolbarWidth / 2)
              });
          }
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const toolbarWidth = toolbarRef.current?.offsetWidth || 0;
      
      setPosition({
        top: rect.top - 60, // Position above the selection
        left: rect.left + (rect.width / 2) - (toolbarWidth / 2),
      });
    };

    calculatePosition();
    
    document.addEventListener('selectionchange', calculatePosition);
    window.addEventListener('resize', calculatePosition);
    
    return () => {
      document.removeEventListener('selectionchange', calculatePosition);
      window.removeEventListener('resize', calculatePosition);
    };

  }, [selectedComponentId, selectedComponent?.type]);
  
  const handleFormat = (command: string) => (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent editor from losing focus
    document.execCommand(command, false);
  };
  
  const isVisible = selectedComponent?.type === 'RichText' && position.top > -9999;

  return (
    <div
      ref={toolbarRef}
      className={cn(
        'fixed bg-neutral-900 text-white rounded-lg shadow-xl p-1 flex gap-1 z-50 transition-opacity duration-150',
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      onMouseDown={(e) => e.preventDefault()} // Prevent editor from losing focus on toolbar click
    >
      <Button variant="ghost" size="icon" className="text-white hover:bg-neutral-700 hover:text-white" onClick={handleFormat('bold')}>
        <Bold className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" className="text-white hover:bg-neutral-700 hover:text-white" onClick={handleFormat('italic')}>
        <Italic className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" className="text-white hover:bg-neutral-700 hover:text-white" onClick={handleFormat('underline')}>
        <Underline className="w-4 h-4" />
      </Button>
    </div>
  );
}

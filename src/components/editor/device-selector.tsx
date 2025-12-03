"use client";

import React from 'react';
import { useEditorStore } from '@/hooks/use-editor-store';
import { Monitor, Laptop, Tablet, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const devices = [
  { id: 'desktop' as const, label: 'Desktop', icon: Monitor, width: '100%' },
  { id: 'laptop' as const, label: 'Laptop', icon: Laptop, width: '1440px' },
  { id: 'tablet' as const, label: 'Tablet', icon: Tablet, width: '768px' },
  { id: 'mobile' as const, label: 'Mobile', icon: Smartphone, width: '375px' },
];

export function DeviceSelector() {
  const devicePreview = useEditorStore((s) => s.devicePreview);
  const setDevicePreview = useEditorStore((s) => s.setDevicePreview);

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-1 shadow-sm">
        {devices.map((device) => {
          const Icon = device.icon;
          const isActive = devicePreview === device.id;
          
          return (
            <Tooltip key={device.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0",
                    isActive && "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                  )}
                  onClick={() => setDevicePreview(device.id)}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {device.label}
                  {device.width !== '100%' && ` (${device.width})`}
                </p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

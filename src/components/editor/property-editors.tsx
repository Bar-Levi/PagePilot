"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { PageComponent } from '../landing-page/types';

export type PropertyEditorConfig = {
  key: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'color' | 'url' | 'image';
  label: string;
  options?: string[];
  min?: number;
  max?: number;
  placeholder?: string;
};

type PropertyEditorProps = {
  component: PageComponent;
  config: PropertyEditorConfig;
  value: any;
  onChange: (value: any) => void;
};

export function PropertyEditor({ component, config, value, onChange }: PropertyEditorProps) {
  const handleChange = (newValue: any) => {
    onChange(newValue);
  };

  switch (config.type) {
    case 'text':
      return (
        <div className="space-y-2">
          <Label htmlFor={config.key}>{config.label}</Label>
          <Input
            id={config.key}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={config.placeholder}
          />
        </div>
      );

    case 'textarea':
      return (
        <div className="space-y-2">
          <Label htmlFor={config.key}>{config.label}</Label>
          <Textarea
            id={config.key}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={config.placeholder}
            rows={3}
          />
        </div>
      );

    case 'number':
      return (
        <div className="space-y-2">
          <Label htmlFor={config.key}>{config.label}</Label>
          <Input
            id={config.key}
            type="number"
            value={value || ''}
            onChange={(e) => handleChange(parseFloat(e.target.value) || 0)}
            min={config.min}
            max={config.max}
            placeholder={config.placeholder}
          />
        </div>
      );

    case 'boolean':
      return (
        <div className="flex items-center space-x-2">
          <Switch
            id={config.key}
            checked={value || false}
            onCheckedChange={handleChange}
          />
          <Label htmlFor={config.key}>{config.label}</Label>
        </div>
      );

    case 'select':
      return (
        <div className="space-y-2">
          <Label htmlFor={config.key}>{config.label}</Label>
          <Select value={value || ''} onValueChange={handleChange}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${config.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {config.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case 'color':
      return (
        <div className="space-y-2">
          <Label htmlFor={config.key}>{config.label}</Label>
          <div className="flex items-center space-x-2">
            <Input
              id={config.key}
              type="color"
              value={value || '#000000'}
              onChange={(e) => handleChange(e.target.value)}
              className="w-12 h-8 p-1"
            />
            <Input
              value={value || '#000000'}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        </div>
      );

    case 'url':
      return (
        <div className="space-y-2">
          <Label htmlFor={config.key}>{config.label}</Label>
          <Input
            id={config.key}
            type="url"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={config.placeholder || 'https://example.com'}
          />
        </div>
      );

    case 'image':
      return (
        <div className="space-y-2">
          <Label htmlFor={config.key}>{config.label}</Label>
          <div className="space-y-2">
            <Input
              id={config.key}
              type="url"
              value={value || ''}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            {value && (
              <div className="border rounded p-2">
                <img
                  src={value}
                  alt="Preview"
                  className="max-w-full max-h-32 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>
      );

    default:
      return (
        <div className="space-y-2">
          <Label>{config.label}</Label>
          <Input
            value={String(value || '')}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Unknown property type"
          />
        </div>
      );
  }
}

import type { PropertyEditorConfig } from './property-editors';

export const componentPropertyRegistry: Record<string, PropertyEditorConfig[]> = {
  Container: [
    {
      key: 'style',
      type: 'textarea' as const,
      label: 'Style (JSON)',
      placeholder: '{"padding": "16px", "background": "#fff"}'
    }
  ],
  TextContainer: [
    {
      key: 'align',
      type: 'select' as const,
      label: 'Alignment',
      options: ['left', 'center', 'right', 'justify']
    }
  ],
  TextSpan: [
    {
      key: 'text',
      type: 'textarea' as const,
      label: 'Text Content',
      placeholder: 'Enter your text here...'
    },
    {
      key: 'size',
      type: 'number' as const,
      label: 'Font Size (px)',
      min: 8,
      max: 72
    },
    {
      key: 'color',
      type: 'color' as const,
      label: 'Text Color'
    },
    {
      key: 'bold',
      type: 'boolean' as const,
      label: 'Bold'
    },
    {
      key: 'italic',
      type: 'boolean' as const,
      label: 'Italic'
    },
    {
      key: 'underline',
      type: 'boolean' as const,
      label: 'Underline'
    },
    {
      key: 'link',
      type: 'url' as const,
      label: 'Link URL'
    }
  ],
  Image: [
    {
      key: 'src',
      type: 'image' as const,
      label: 'Image URL'
    },
    {
      key: 'alt',
      type: 'text' as const,
      label: 'Alt Text',
      placeholder: 'Describe the image for accessibility'
    },
    {
      key: 'width',
      type: 'text' as const,
      label: 'Width',
      placeholder: '100% or 300px'
    },
    {
      key: 'rounded',
      type: 'select' as const,
      label: 'Border Radius',
      options: ['none', 'sm', 'md', 'lg', 'full']
    }
  ],
  Button: [
    {
      key: 'text',
      type: 'text' as const,
      label: 'Button Text',
      placeholder: 'Click me!'
    },
    {
      key: 'href',
      type: 'url' as const,
      label: 'Link URL',
      placeholder: '#section or https://example.com'
    },
    {
      key: 'variant',
      type: 'select' as const,
      label: 'Style Variant',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']
    },
    {
      key: 'size',
      type: 'select' as const,
      label: 'Size',
      options: ['default', 'sm', 'lg', 'icon']
    }
  ],
  Video: [
    {
      key: 'youtubeId',
      type: 'text' as const,
      label: 'YouTube Video ID',
      placeholder: 'dQw4w9WgXcQ'
    },
    {
      key: 'autoplay',
      type: 'boolean' as const,
      label: 'Autoplay'
    },
    {
      key: 'controls',
      type: 'boolean' as const,
      label: 'Show Controls'
    },
    {
      key: 'ratio',
      type: 'select' as const,
      label: 'Aspect Ratio',
      options: ['16:9', '4:3', '1:1']
    }
  ],
  Input: [
    {
      key: 'label',
      type: 'text' as const,
      label: 'Label',
      placeholder: 'Your Name'
    },
    {
      key: 'placeholder',
      type: 'text' as const,
      label: 'Placeholder',
      placeholder: 'Enter your name...'
    },
    {
      key: 'name',
      type: 'text' as const,
      label: 'Field Name',
      placeholder: 'name'
    },
    {
      key: 'required',
      type: 'boolean' as const,
      label: 'Required'
    }
  ],
  Checkbox: [
    {
      key: 'label',
      type: 'text' as const,
      label: 'Label',
      placeholder: 'I agree to the terms'
    },
    {
      key: 'name',
      type: 'text' as const,
      label: 'Field Name',
      placeholder: 'agree'
    },
    {
      key: 'required',
      type: 'boolean' as const,
      label: 'Required'
    }
  ],
  Divider: [
    {
      key: 'thickness',
      type: 'number' as const,
      label: 'Thickness (px)',
      min: 1,
      max: 10
    },
    {
      key: 'color',
      type: 'color' as const,
      label: 'Color'
    }
  ],
  Carousel: [
    // Items are handled as children components
  ],
  RichText: [
    {
      key: 'align',
      type: 'select' as const,
      label: 'Text Alignment',
      options: ['left', 'center', 'right']
    }
    // HTML content is edited inline, not through properties panel
  ],
  Form: [
    // Form properties are handled through children
  ]
};

export function getComponentProperties(componentType: string): PropertyEditorConfig[] {
  return componentPropertyRegistry[componentType] || [];
}

/**
 * RichText HTML manipulation helpers
 * 
 * These functions work with semantic HTML tags (<strong>, <em>, <u>)
 * and normalize the HTML to avoid nested/empty tags.
 */

/**
 * Check if a node or its ancestors have bold formatting
 */
export function isBold(node: Node | null): boolean {
  if (!node) return false;
  
  // Check if node itself is <strong> or <b>
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    if (el.tagName === 'STRONG' || el.tagName === 'B') {
      return true;
    }
    // Check inline style
    if (el.style.fontWeight === 'bold' || 
        el.style.fontWeight === '700' ||
        parseInt(el.style.fontWeight) >= 700) {
      return true;
    }
  }
  
  // Check parent
  if (node.parentElement) {
    const parent = node.parentElement;
    if (parent.tagName === 'STRONG' || parent.tagName === 'B') {
      return true;
    }
    if (parent.style.fontWeight === 'bold' || 
        parent.style.fontWeight === '700' ||
        parseInt(parent.style.fontWeight) >= 700) {
      return true;
    }
  }
  
  return false;
}

/**
 * Find the closest bold ancestor (strong or b tag, or element with bold style)
 */
export function findBoldAncestor(node: Node | null): HTMLElement | null {
  if (!node) return null;
  
  let current: Node | null = node;
  
  while (current && current !== document.body) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const el = current as HTMLElement;
      
      // Check for <strong> or <b> tag
      if (el.tagName === 'STRONG' || el.tagName === 'B') {
        return el;
      }
      
      // Check for inline style
      const fontWeight = el.style.fontWeight;
      if (fontWeight === 'bold' || 
          fontWeight === '700' ||
          (fontWeight && parseInt(fontWeight) >= 700)) {
        return el;
      }
    }
    
    current = current.parentNode;
  }
  
  return null;
}

/**
 * Unwrap a bold element, moving its children to its parent
 */
export function unwrapBold(element: HTMLElement): void {
  const parent = element.parentNode;
  if (!parent) return;
  
  // Move all children before the element
  while (element.firstChild) {
    parent.insertBefore(element.firstChild, element);
  }
  
  // Remove the empty element
  parent.removeChild(element);
}

/**
 * Wrap a range of nodes with a <strong> tag
 */
export function wrapWithStrong(range: Range): HTMLElement {
  const strong = document.createElement('strong');
  
  try {
    const contents = range.extractContents();
    strong.appendChild(contents);
    range.insertNode(strong);
    
    // Restore selection inside the strong tag
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(strong);
      selection.addRange(newRange);
    }
  } catch (e) {
    console.error('Failed to wrap with strong:', e);
  }
  
  return strong;
}

/**
 * Normalize HTML by:
 * - Merging adjacent <strong> tags
 * - Removing nested <strong> inside another <strong>
 * - Removing empty <strong> tags
 */
export function normalizeBoldHTML(element: HTMLElement): void {
  // Remove empty strong/b tags
  const emptyBoldTags = element.querySelectorAll('strong:empty, b:empty');
  emptyBoldTags.forEach(tag => {
    const parent = tag.parentNode;
    if (parent) {
      parent.removeChild(tag);
    }
  });
  
  // Merge adjacent strong/b tags
  const allBoldTags = element.querySelectorAll('strong, b');
  allBoldTags.forEach(tag => {
    const nextSibling = tag.nextSibling;
    
    // Check if next sibling is also a bold tag
    if (nextSibling && 
        nextSibling.nodeType === Node.ELEMENT_NODE &&
        ((nextSibling as HTMLElement).tagName === 'STRONG' || 
         (nextSibling as HTMLElement).tagName === 'B')) {
      const nextBold = nextSibling as HTMLElement;
      
      // Move all children from nextBold into current tag
      while (nextBold.firstChild) {
        tag.appendChild(nextBold.firstChild);
      }
      
      // Remove the now-empty nextBold tag
      const parent = nextBold.parentNode;
      if (parent) {
        parent.removeChild(nextBold);
      }
    }
  });
  
  // Remove nested strong/b tags
  const boldTags = element.querySelectorAll('strong, b');
  boldTags.forEach(tag => {
    // Check if this tag is inside another bold tag
    let parent = tag.parentElement;
    while (parent && parent !== element) {
      if (parent.tagName === 'STRONG' || parent.tagName === 'B') {
        // This is nested - unwrap the inner one
        unwrapBold(tag as HTMLElement);
        return;
      }
      parent = parent.parentElement;
    }
  });
  
  // Also handle inline styles - convert to <strong> tags
  const styleBoldElements = element.querySelectorAll('[style*="font-weight"]');
  styleBoldElements.forEach(el => {
    const fontWeight = el.style.fontWeight;
    if (fontWeight === 'bold' || 
        fontWeight === '700' ||
        (fontWeight && parseInt(fontWeight) >= 700)) {
      
      // Create a strong tag
      const strong = document.createElement('strong');
      
      // Move all children
      while (el.firstChild) {
        strong.appendChild(el.firstChild);
      }
      
      // Remove font-weight from style
      el.style.removeProperty('font-weight');
      
      // If no other styles, replace el with strong
      if (!el.style.cssText.trim()) {
        const parent = el.parentNode;
        if (parent) {
          parent.replaceChild(strong, el);
        }
      } else {
        // Keep the element but wrap its content
        el.appendChild(strong);
      }
    }
  });
}

/**
 * Split a text node at the given offset
 */
function splitTextNode(node: Text, offset: number): Text | null {
  if (node.nodeType !== Node.TEXT_NODE) return null;
  if (offset === 0) return node;
  if (offset >= node.textContent!.length) return null;
  
  return node.splitText(offset);
}

/**
 * Split an element at the given offset, creating a new element after it
 */
function splitElementAtOffset(element: HTMLElement, offset: number): HTMLElement | null {
  const children = Array.from(element.childNodes);
  let currentOffset = 0;
  
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const childLength = child.textContent?.length || 0;
    
    if (currentOffset + childLength >= offset) {
      // Split at this child
      if (child.nodeType === Node.TEXT_NODE) {
        const textNode = child as Text;
        const splitOffset = offset - currentOffset;
        const newText = splitTextNode(textNode, splitOffset);
        
        // Create a new element with the remaining content
        const newElement = element.cloneNode(false) as HTMLElement;
        if (newText) {
          newElement.appendChild(newText.cloneNode(true));
        }
        for (let j = i + 1; j < children.length; j++) {
          newElement.appendChild(children[j].cloneNode(true));
        }
        
        // Remove the split part from original
        if (newText) {
          textNode.textContent = textNode.textContent!.substring(0, splitOffset);
        }
        for (let j = i + 1; j < children.length; j++) {
          element.removeChild(children[j]);
        }
        
        return newElement;
      }
    }
    
    currentOffset += childLength;
  }
  
  return null;
}

/**
 * Toggle bold on a selection range
 * Returns the new range that should be selected after the operation
 */
export function toggleBoldOnRange(
  range: Range,
  container: HTMLElement
): Range | null {
  const selection = window.getSelection();
  if (!selection) return null;
  
  // Save the selection boundaries before modifying DOM
  const startContainer = range.startContainer;
  const startOffset = range.startOffset;
  const endContainer = range.endContainer;
  const endOffset = range.endOffset;
  
  // Check if selection is already bold
  const isCurrentlyBold = isBold(range.commonAncestorContainer);
  
  if (isCurrentlyBold) {
    // Remove bold - need to handle partial selection within bold text
    
    // Find the bold ancestor
    const boldAncestor = findBoldAncestor(range.commonAncestorContainer);
    
    if (boldAncestor) {
      // Check if the selection is entirely within the bold element
      const boldRange = document.createRange();
      boldRange.selectNodeContents(boldAncestor);
      
      const selectionStart = range.compareBoundaryPoints(Range.START_TO_START, boldRange);
      const selectionEnd = range.compareBoundaryPoints(Range.END_TO_END, boldRange);
      
      // Check if selection starts/ends at boundaries of bold element
      const startsAtBoldStart = selectionStart === 0;
      const endsAtBoldEnd = selectionEnd === 0;
      
      if (!startsAtBoldStart || !endsAtBoldEnd) {
        // Partial selection - need to split the bold element
        // Save the selected text before modifying DOM
        const selectedText = range.toString();
        
        // Create ranges for before, selected, and after parts
        const beforeRange = document.createRange();
        beforeRange.setStart(boldAncestor, 0);
        beforeRange.setEnd(range.startContainer, range.startOffset);
        
        const afterRange = document.createRange();
        afterRange.setStart(range.endContainer, range.endOffset);
        afterRange.setEnd(boldAncestor, boldAncestor.childNodes.length);
        
        // Clone contents (don't extract yet to preserve DOM structure)
        const beforeContent = beforeRange.cloneContents();
        const selectedContent = range.cloneContents();
        const afterContent = afterRange.cloneContents();
        
        // Unwrap bold from selected content
        const unwrapBoldInFragment = (fragment: DocumentFragment) => {
          const boldTags = fragment.querySelectorAll('strong, b');
          boldTags.forEach(tag => {
            unwrapBold(tag as HTMLElement);
          });
          
          const styleTags = fragment.querySelectorAll('[style*="font-weight"]');
          styleTags.forEach(tag => {
            const el = tag as HTMLElement;
            el.style.removeProperty('font-weight');
            if (!el.style.cssText.trim() && el.tagName !== 'SPAN') {
              unwrapBold(el);
            }
          });
        };
        
        unwrapBoldInFragment(selectedContent);
        
        // Now extract and replace
        const parent = boldAncestor.parentNode;
        if (!parent) return null;
        
        // Extract all content from bold element
        const allContent = document.createRange();
        allContent.selectNodeContents(boldAncestor);
        allContent.extractContents(); // This removes all children from boldAncestor
        
        // Reconstruct: [bold]before[/bold] [normal]selected[/normal] [bold]after[/bold]
        const insertBefore = boldAncestor;
        
        // Insert before part (keep it bold) if it has content
        if (beforeContent.textContent && beforeContent.textContent.trim()) {
          const beforeStrong = document.createElement('strong');
          while (beforeContent.firstChild) {
            beforeStrong.appendChild(beforeContent.firstChild);
          }
          parent.insertBefore(beforeStrong, insertBefore);
        }
        
        // Insert selected part (unwrapped, not bold)
        if (selectedContent.textContent) {
          while (selectedContent.firstChild) {
            parent.insertBefore(selectedContent.firstChild, insertBefore);
          }
        }
        
        // Insert after part (keep it bold) if it has content
        if (afterContent.textContent && afterContent.textContent.trim()) {
          const afterStrong = document.createElement('strong');
          while (afterContent.firstChild) {
            afterStrong.appendChild(afterContent.firstChild);
          }
          parent.insertBefore(afterStrong, insertBefore);
        }
        
        // Remove the now-empty bold element
        parent.removeChild(boldAncestor);
        
        // Normalize
        normalizeBoldHTML(container);
        
        // Restore selection on the unwrapped content by finding the text
        const newRange = document.createRange();
        try {
          if (selectedText) {
            const walker = document.createTreeWalker(
              container,
              NodeFilter.SHOW_TEXT,
              null
            );
            
            let node: Node | null;
            while ((node = walker.nextNode())) {
              const text = node.textContent || '';
              const index = text.indexOf(selectedText);
              if (index !== -1) {
                newRange.setStart(node, index);
                newRange.setEnd(node, index + selectedText.length);
                break;
              }
            }
          }
        } catch (e) {
          console.error('Failed to restore selection:', e);
          return null;
        }
        
        return newRange;
      } else {
        // Entire bold element is selected - just unwrap it
        const contents = range.extractContents();
        
        const unwrapBoldInFragment = (fragment: DocumentFragment) => {
          const boldTags = fragment.querySelectorAll('strong, b');
          boldTags.forEach(tag => {
            unwrapBold(tag as HTMLElement);
          });
          
          const styleTags = fragment.querySelectorAll('[style*="font-weight"]');
          styleTags.forEach(tag => {
            const el = tag as HTMLElement;
            el.style.removeProperty('font-weight');
            if (!el.style.cssText.trim() && el.tagName !== 'SPAN') {
              unwrapBold(el);
            }
          });
        };
        
        unwrapBoldInFragment(contents);
        range.insertNode(contents);
        normalizeBoldHTML(container);
        
        // Restore selection
        const newRange = document.createRange();
        try {
          const insertedNodes = Array.from(contents.childNodes);
          if (insertedNodes.length > 0) {
            newRange.setStartBefore(insertedNodes[0]);
            newRange.setEndAfter(insertedNodes[insertedNodes.length - 1]);
          }
        } catch (e) {
          console.error('Failed to restore selection:', e);
          return null;
        }
        
        return newRange;
      }
    } else {
      // No bold ancestor found, but isBold returned true - might be inline style
      // Extract and remove bold style
      const contents = range.extractContents();
      
      const styleTags = contents.querySelectorAll('[style*="font-weight"]');
      styleTags.forEach(tag => {
        const el = tag as HTMLElement;
        el.style.removeProperty('font-weight');
      });
      
      range.insertNode(contents);
      normalizeBoldHTML(container);
      
      // Restore selection
      const newRange = document.createRange();
      try {
        const insertedNodes = Array.from(contents.childNodes);
        if (insertedNodes.length > 0) {
          newRange.setStartBefore(insertedNodes[0]);
          newRange.setEndAfter(insertedNodes[insertedNodes.length - 1]);
        }
      } catch (e) {
        return null;
      }
      
      return newRange;
    }
  } else {
    // Apply bold - wrap selection with <strong>
    const strong = wrapWithStrong(range);
    normalizeBoldHTML(container);
    
    // Restore selection inside the strong tag
    const newRange = document.createRange();
    try {
      newRange.selectNodeContents(strong);
    } catch (e) {
      console.error('Failed to restore selection:', e);
      return null;
    }
    
    return newRange;
  }
}

/**
 * Clean HTML string by normalizing bold tags
 */
export function cleanBoldHTML(html: string): string {
  // Create a temporary container
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Normalize
  normalizeBoldHTML(temp);
  
  // Return cleaned HTML
  return temp.innerHTML;
}

/**
 * Remove font-size from a fragment (unwrap spans that only have font-size)
 */
function removeFontSizeFromFragment(fragment: DocumentFragment): void {
  const elementsWithFontSize = fragment.querySelectorAll('[style*="font-size"]');
  
  elementsWithFontSize.forEach(el => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.removeProperty('font-size');
    
    // If no other styles, unwrap the span
    if (!htmlEl.style.cssText.trim() && htmlEl.tagName === 'SPAN') {
      const parent = htmlEl.parentNode;
      if (parent) {
        while (htmlEl.firstChild) {
          parent.insertBefore(htmlEl.firstChild, htmlEl);
        }
        parent.removeChild(htmlEl);
      }
    }
  });
}

/**
 * Apply font-size to a selection range
 * Removes all existing font-size styles from the selection and applies a uniform size
 * Returns the new range that should be selected after the operation
 */
export function applyFontSizeToRange(
  range: Range,
  container: HTMLElement,
  fontSize: string
): Range | null {
  const selection = window.getSelection();
  if (!selection) return null;
  
  // Save the selected text before modifying DOM
  const selectedText = range.toString();
  
  // Extract the selected content
  const selectedContent = range.extractContents();
  
  // Remove all font-size styles from the extracted content
  removeFontSizeFromFragment(selectedContent);
  
  // Create a span with the new font-size
  const span = document.createElement('span');
  span.style.fontSize = fontSize;
  
  // Wrap the content with the span
  while (selectedContent.firstChild) {
    span.appendChild(selectedContent.firstChild);
  }
  
  // Insert the wrapped content back
  range.insertNode(span);
  
  // Normalize: merge adjacent spans with same font-size
  normalizeFontSizeHTML(container);
  
  // Restore selection on the wrapped content
  const newRange = document.createRange();
  try {
    newRange.selectNodeContents(span);
  } catch (e) {
    console.error('Failed to restore selection:', e);
    // Fallback: find by text content
    if (selectedText) {
      const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const text = node.textContent || '';
        const index = text.indexOf(selectedText);
        if (index !== -1) {
          newRange.setStart(node, index);
          newRange.setEnd(node, index + selectedText.length);
          break;
        }
      }
    }
  }
  
  return newRange;
}

/**
 * Normalize font-size HTML by merging adjacent spans with the same font-size
 */
export function normalizeFontSizeHTML(element: HTMLElement): void {
  // Find all spans with font-size
  const spansWithFontSize = element.querySelectorAll('span[style*="font-size"]');
  
  spansWithFontSize.forEach(span => {
    const htmlSpan = span as HTMLElement;
    const fontSize = htmlSpan.style.fontSize;
    
    // Check if next sibling is also a span with the same font-size
    let nextSibling = htmlSpan.nextSibling;
    while (nextSibling) {
      if (nextSibling.nodeType === Node.ELEMENT_NODE) {
        const nextEl = nextSibling as HTMLElement;
        
        // Check if it's a span with the same font-size
        if (nextEl.tagName === 'SPAN' && nextEl.style.fontSize === fontSize) {
          // Merge: move all children from nextEl into current span
          while (nextEl.firstChild) {
            htmlSpan.appendChild(nextEl.firstChild);
          }
          
          // Remove the now-empty nextEl
          const parent = nextEl.parentNode;
          if (parent) {
            parent.removeChild(nextEl);
          }
          
          // Check the next sibling again (might be another matching span)
          nextSibling = htmlSpan.nextSibling;
        } else {
          break;
        }
      } else if (nextSibling.nodeType === Node.TEXT_NODE) {
        // If there's only whitespace between spans, skip it
        const text = nextSibling.textContent || '';
        if (text.trim() === '') {
          nextSibling = nextSibling.nextSibling;
        } else {
          break;
        }
      } else {
        break;
      }
    }
  });
  
  // Also merge spans that are children of each other with same font-size
  const allSpans = element.querySelectorAll('span[style*="font-size"]');
  allSpans.forEach(span => {
    const htmlSpan = span as HTMLElement;
    const fontSize = htmlSpan.style.fontSize;
    
    // Check if parent is also a span with the same font-size
    const parent = htmlSpan.parentElement;
    if (parent && 
        parent.tagName === 'SPAN' && 
        parent.style.fontSize === fontSize) {
      // Unwrap: move children to parent
      while (htmlSpan.firstChild) {
        parent.insertBefore(htmlSpan.firstChild, htmlSpan);
      }
      parent.removeChild(htmlSpan);
    }
  });
}

/**
 * Compare two style strings and check if they're equivalent
 */
function stylesAreEquivalent(style1: string, style2: string): boolean {
  if (!style1 && !style2) return true;
  if (!style1 || !style2) return false;
  
  // Parse styles into objects
  const parseStyle = (style: string): Record<string, string> => {
    const result: Record<string, string> = {};
    style.split(';').forEach(decl => {
      const [prop, value] = decl.split(':').map(s => s.trim());
      if (prop && value) {
        result[prop] = value;
      }
    });
    return result;
  };
  
  const s1 = parseStyle(style1);
  const s2 = parseStyle(style2);
  
  if (Object.keys(s1).length !== Object.keys(s2).length) return false;
  
  for (const key in s1) {
    if (s1[key] !== s2[key]) return false;
  }
  
  return true;
}

/**
 * Parse style string into properties object
 */
function parseStyleProperties(style: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!style) return result;
  
  style.split(';').forEach(decl => {
    const [prop, value] = decl.split(':').map(s => s.trim());
    if (prop && value) {
      // Convert kebab-case to camelCase for comparison
      const camelProp = prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelProp] = value;
    }
  });
  
  return result;
}

/**
 * Unwrap a span element, moving its children to its parent
 */
function unwrapSpan(element: HTMLElement): void {
  const parent = element.parentNode;
  if (!parent) return;
  
  // Move all children before the element
  while (element.firstChild) {
    parent.insertBefore(element.firstChild, element);
  }
  
  // Remove the empty element
  parent.removeChild(element);
}

/**
 * Comprehensive HTML normalization:
 * - Removes empty spans
 * - Merges adjacent spans with identical styles
 * - Removes nested spans with duplicate/conflicting styles
 * - Consolidates multiple style properties into single spans
 */
export function normalizeAllHTML(element: HTMLElement): void {
  // Run multiple passes to ensure complete normalization
  let changed = true;
  let passes = 0;
  const maxPasses = 5; // Prevent infinite loops
  
  while (changed && passes < maxPasses) {
    changed = false;
    passes++;
    
    // First, normalize bold (this handles <strong> tags)
    normalizeBoldHTML(element);
    
    // Remove empty spans
    const emptySpans = Array.from(element.querySelectorAll('span:empty'));
    if (emptySpans.length > 0) {
      changed = true;
      emptySpans.forEach(span => {
        const parent = span.parentNode;
        if (parent) {
          parent.removeChild(span);
        }
      });
    }
    
    // Remove spans with only whitespace
    const allSpans = Array.from(element.querySelectorAll('span'));
    allSpans.forEach(span => {
      const text = span.textContent || '';
      if (text.trim() === '' && span.children.length === 0) {
        unwrapSpan(span);
        changed = true;
      }
    });
  
    
    // Merge adjacent spans with identical styles
    const spans = Array.from(element.querySelectorAll('span[style]'));
    for (const span of spans) {
      const htmlSpan = span as HTMLElement;
      const spanStyle = htmlSpan.style.cssText;
      
      if (!spanStyle) {
        // No style - unwrap
        unwrapSpan(htmlSpan);
        changed = true;
        continue;
      }
    
    // Check next sibling
    let nextSibling = htmlSpan.nextSibling;
    while (nextSibling) {
      if (nextSibling.nodeType === Node.TEXT_NODE) {
        const text = nextSibling.textContent || '';
        if (text.trim() === '') {
          // Skip whitespace
          nextSibling = nextSibling.nextSibling;
        } else {
          break;
        }
      } else if (nextSibling.nodeType === Node.ELEMENT_NODE) {
        const nextEl = nextSibling as HTMLElement;
        if (nextEl.tagName === 'SPAN' && nextEl.style.cssText) {
          if (stylesAreEquivalent(spanStyle, nextEl.style.cssText)) {
            // Merge: move all children from nextEl into current span
            while (nextEl.firstChild) {
              htmlSpan.appendChild(nextEl.firstChild);
            }
            
            // Remove the now-empty nextEl
            const parent = nextEl.parentNode;
            if (parent) {
              parent.removeChild(nextEl);
              changed = true;
            }
            
            // Check the next sibling again
            nextSibling = htmlSpan.nextSibling;
          } else {
            break;
          }
        } else {
          break;
        }
      } else {
        break;
      }
    }
    }
    
    // Remove nested spans with duplicate/conflicting styles
    const nestedSpans = Array.from(element.querySelectorAll('span[style]'));
    for (const span of nestedSpans) {
    const htmlSpan = span as HTMLElement;
    const spanStyle = htmlSpan.style.cssText;
    
    // Check if parent is also a span with style
    let parent = htmlSpan.parentElement;
    while (parent && parent !== element) {
      if (parent.tagName === 'SPAN' && parent.style.cssText) {
        const parentStyle = parent.style.cssText;
        
        // Check for duplicate properties
        const spanProps = parseStyleProperties(spanStyle);
        const parentProps = parseStyleProperties(parentStyle);
        
        // If all span properties exist in parent with same values, unwrap
        let allMatch = true;
        for (const prop in spanProps) {
          if (parentProps[prop] !== spanProps[prop]) {
            allMatch = false;
            break;
          }
        }
        
        if (allMatch && Object.keys(spanProps).length > 0) {
          // All properties are duplicated in parent - unwrap
          unwrapSpan(htmlSpan);
          changed = true;
          return;
        }
        
        // If styles are identical, unwrap inner
        if (stylesAreEquivalent(spanStyle, parentStyle)) {
          unwrapSpan(htmlSpan);
          changed = true;
          return;
        }
      }
      
      parent = parent.parentElement;
    }
    }
    
    // Consolidate: if a span has multiple style properties, try to merge with parent if possible
    const complexSpans = Array.from(element.querySelectorAll('span[style]'));
    for (const span of complexSpans) {
    const htmlSpan = span as HTMLElement;
    const spanStyle = htmlSpan.style.cssText;
    const spanProps = parseStyleProperties(spanStyle);
    
    // Check parent
    const parent = htmlSpan.parentElement;
    if (parent && parent.tagName === 'SPAN' && parent.style.cssText) {
      const parentStyle = parent.style.cssText;
      const parentProps = parseStyleProperties(parentStyle);
      
      // Check if we can merge: if parent has some properties and span has others
      const spanOnlyProps: Record<string, string> = {};
      let canMerge = true;
      
      for (const prop in spanProps) {
        if (parentProps[prop]) {
          // Property exists in both - must match
          if (parentProps[prop] !== spanProps[prop]) {
            canMerge = false;
            break;
          }
        } else {
          // Property only in span - can be merged
          spanOnlyProps[prop] = spanProps[prop];
        }
      }
      
      if (canMerge && Object.keys(spanOnlyProps).length > 0) {
        // Move span-only properties to parent and unwrap
        for (const prop in spanOnlyProps) {
          // Convert camelCase back to kebab-case for CSS
          const kebabProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
          parent.style.setProperty(kebabProp, spanOnlyProps[prop]);
        }
        unwrapSpan(htmlSpan);
        changed = true;
      }
    }
    }
  }
}

/**
 * Clean HTML string by normalizing all spans and styles
 */
export function cleanAllHTML(html: string): string {
  // Create a temporary container
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Normalize
  normalizeAllHTML(temp);
  
  // Return cleaned HTML
  return temp.innerHTML;
}


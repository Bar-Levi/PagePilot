/**
 * =================================================================
 * JSON UTILITIES FOR PAGE BUILDER
 * =================================================================
 * Utility functions for manipulating the page JSON tree.
 * All functions are pure and return new objects (immutable).
 */

import type { PageComponent, ContainerProps } from "@/components/landing-page/types";

// ============================================================================
// Types
// ============================================================================

export type RelativePosition = "above" | "below" | "left" | "right";

export type InsertResult = {
  updatedTree: PageComponent;
  insertedId: string;
};

// ============================================================================
// Core Tree Operations
// ============================================================================

/**
 * Deep clone a node and all its children
 */
export function cloneNode(node: PageComponent): PageComponent {
  return JSON.parse(JSON.stringify(node));
}

/**
 * Generate a unique ID for a new component
 */
export function generateId(type: string): string {
  return `${type.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Find a node by ID in the tree
 */
export function findNodeById(
  root: PageComponent,
  id: string
): PageComponent | null {
  if (root.id === id) return root;
  if (root.children) {
    for (const child of root.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Find the parent of a node by ID
 */
export function findParentById(
  root: PageComponent,
  targetId: string,
  parent: PageComponent | null = null
): PageComponent | null {
  if (root.id === targetId) return parent;
  if (root.children) {
    for (const child of root.children) {
      const found = findParentById(child, targetId, root);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Find the index of a child within its parent
 */
export function findChildIndex(parent: PageComponent, childId: string): number {
  if (!parent.children) return -1;
  return parent.children.findIndex((c) => c.id === childId);
}

/**
 * Check if a node is a descendant of another node
 */
export function isDescendantOf(
  root: PageComponent,
  ancestorId: string,
  descendantId: string
): boolean {
  const ancestor = findNodeById(root, ancestorId);
  if (!ancestor) return false;

  const checkChildren = (node: PageComponent): boolean => {
    if (node.id === descendantId) return true;
    if (node.children) {
      return node.children.some((child) => checkChildren(child));
    }
    return false;
  };

  return checkChildren(ancestor);
}

// ============================================================================
// Layout Utilities
// ============================================================================

/**
 * Determine the required layout based on position
 */
export function getRequiredLayout(position: RelativePosition): "row" | "column" {
  if (position === "left" || position === "right") {
    return "row";
  }
  return "column";
}

/**
 * Get the effective layout of a container
 */
export function getContainerLayout(container: PageComponent): "row" | "column" {
  const props = container.props as ContainerProps;
  // Check layout prop first, then fall back to style.flexDirection
  return props.layout || props.style?.flexDirection || "column";
}

/**
 * Update container layout based on the insertion position
 */
export function updateContainerLayoutForPosition(
  container: PageComponent,
  position: RelativePosition
): PageComponent {
  const requiredLayout = getRequiredLayout(position);
  const currentLayout = getContainerLayout(container);

  // If layout matches, no change needed
  if (currentLayout === requiredLayout) {
    return container;
  }

  // Update the layout
  const props = container.props as ContainerProps;
  return {
    ...container,
    props: {
      ...props,
      layout: requiredLayout,
      style: {
        ...props.style,
        flexDirection: requiredLayout,
      },
    },
  };
}

// ============================================================================
// Insert Operations
// ============================================================================

/**
 * Calculate the insert index based on position
 */
export function getInsertIndex(
  currentIndex: number,
  position: RelativePosition
): number {
  // "above" and "left" insert before (same index)
  // "below" and "right" insert after (index + 1)
  if (position === "above" || position === "left") {
    return currentIndex;
  }
  return currentIndex + 1;
}

/**
 * Insert a component relative to a target component
 * This is the main function for adding components
 */
export function insertComponentRelativeTo(
  root: PageComponent,
  targetId: string,
  position: RelativePosition,
  newComponent: PageComponent
): InsertResult | null {
  // Find the parent of the target
  const parent = findParentById(root, targetId);
  if (!parent || !parent.children) {
    return null;
  }

  // Find the index of the target within the parent
  const targetIndex = findChildIndex(parent, targetId);
  if (targetIndex === -1) {
    return null;
  }

  // Calculate insert index
  const insertIndex = getInsertIndex(targetIndex, position);

  // Clone the tree for immutability
  const updatedTree = cloneNode(root);

  // Find the parent in the cloned tree
  const clonedParent = findNodeById(updatedTree, parent.id);
  if (!clonedParent || !clonedParent.children) {
    return null;
  }

  // Update parent layout if needed
  const updatedParent = updateContainerLayoutForPosition(clonedParent, position);
  
  // Apply layout changes to the cloned parent
  Object.assign(clonedParent, updatedParent);

  // Insert the new component
  clonedParent.children.splice(insertIndex, 0, newComponent);

  return {
    updatedTree,
    insertedId: newComponent.id,
  };
}

/**
 * Insert a component as the first child of a container
 */
export function insertAsFirstChild(
  root: PageComponent,
  containerId: string,
  newComponent: PageComponent
): InsertResult | null {
  const updatedTree = cloneNode(root);
  const container = findNodeById(updatedTree, containerId);

  if (!container) {
    return null;
  }

  // Initialize children array if needed
  if (!container.children) {
    container.children = [];
  }

  // Insert at the beginning
  container.children.unshift(newComponent);

  return {
    updatedTree,
    insertedId: newComponent.id,
  };
}

/**
 * Insert a component as the last child of a container
 */
export function insertAsLastChild(
  root: PageComponent,
  containerId: string,
  newComponent: PageComponent
): InsertResult | null {
  const updatedTree = cloneNode(root);
  const container = findNodeById(updatedTree, containerId);

  if (!container) {
    return null;
  }

  // Initialize children array if needed
  if (!container.children) {
    container.children = [];
  }

  // Insert at the end
  container.children.push(newComponent);

  return {
    updatedTree,
    insertedId: newComponent.id,
  };
}

// ============================================================================
// Update Operations
// ============================================================================

/**
 * Update a node's props in the tree
 */
export function updateNodeProps(
  root: PageComponent,
  nodeId: string,
  newProps: Partial<PageComponent["props"]>
): PageComponent {
  const updatedTree = cloneNode(root);
  const node = findNodeById(updatedTree, nodeId);

  if (node) {
    node.props = { ...node.props, ...newProps };
  }

  return updatedTree;
}

/**
 * Update a container's layout
 */
export function updateContainerLayout(
  root: PageComponent,
  containerId: string,
  layout: "row" | "column"
): PageComponent {
  const updatedTree = cloneNode(root);
  const container = findNodeById(updatedTree, containerId);

  if (container) {
    const props = container.props as ContainerProps;
    container.props = {
      ...props,
      layout,
      style: {
        ...props.style,
        flexDirection: layout,
      },
    };
  }

  return updatedTree;
}

// ============================================================================
// Delete Operations
// ============================================================================

/**
 * Delete a node from the tree
 */
export function deleteNode(
  root: PageComponent,
  nodeId: string
): PageComponent | null {
  // Can't delete the root
  if (root.id === nodeId) {
    return null;
  }

  const updatedTree = cloneNode(root);

  const deleteRecursive = (node: PageComponent): boolean => {
    if (!node.children) return false;

    const index = node.children.findIndex((c) => c.id === nodeId);
    if (index !== -1) {
      node.children.splice(index, 1);
      return true;
    }

    for (const child of node.children) {
      if (deleteRecursive(child)) {
        return true;
      }
    }

    return false;
  };

  deleteRecursive(updatedTree);
  return updatedTree;
}

// ============================================================================
// Move Operations
// ============================================================================

/**
 * Move a node to a new position
 */
export function moveNode(
  root: PageComponent,
  nodeId: string,
  newParentId: string,
  newIndex: number
): PageComponent | null {
  // Find the node to move
  const nodeToMove = findNodeById(root, nodeId);
  if (!nodeToMove) return null;

  // Check for circular reference
  if (isDescendantOf(root, nodeId, newParentId)) {
    return null;
  }

  // First, delete the node from its current position
  let updatedTree = deleteNode(root, nodeId);
  if (!updatedTree) return null;

  // Then, insert it at the new position
  const newParent = findNodeById(updatedTree, newParentId);
  if (!newParent) return null;

  if (!newParent.children) {
    newParent.children = [];
  }

  // Ensure index is within bounds
  const safeIndex = Math.min(Math.max(0, newIndex), newParent.children.length);
  newParent.children.splice(safeIndex, 0, cloneNode(nodeToMove));

  return updatedTree;
}

/**
 * Reorder children within a container
 */
export function reorderChildren(
  root: PageComponent,
  parentId: string,
  newOrder: string[]
): PageComponent {
  const updatedTree = cloneNode(root);
  const parent = findNodeById(updatedTree, parentId);

  if (parent && parent.children) {
    const childMap = new Map(parent.children.map((c) => [c.id, c]));
    parent.children = newOrder
      .map((id) => childMap.get(id))
      .filter((c): c is PageComponent => c !== undefined);
  }

  return updatedTree;
}

// ============================================================================
// Component Factory
// ============================================================================

/**
 * Create a new component with default props
 */
export function createComponent(
  type: PageComponent["type"],
  overrides?: Partial<PageComponent>
): PageComponent {
  const id = generateId(type);

  const defaults: Record<string, () => PageComponent> = {
    Container: () => ({
      id,
      type: "Container",
      props: {
        layout: "column",
        style: {
          padding: "24px",
          gap: 16,
          flexDirection: "column",
        },
      },
      children: [],
    }),

    RichText: () => ({
      id,
      type: "RichText",
      props: {
        html: '<span style="font-size: 16px;">טקסט חדש</span>',
        align: "right",
      },
    }),

    Button: () => ({
      id,
      type: "Button",
      props: {
        text: "כפתור",
        href: "#",
        variant: "default",
        size: "default",
      },
    }),

    Image: () => ({
      id,
      type: "Image",
      props: {
        src: "https://picsum.photos/seed/new/600/400",
        alt: "תמונה",
        alignment: "center",
      },
    }),

    Video: () => ({
      id,
      type: "Video",
      props: {
        youtubeId: "dQw4w9WgXcQ",
        ratio: "16:9",
        alignment: "center",
      },
    }),

    Divider: () => ({
      id,
      type: "Divider",
      props: {
        thickness: 1,
        color: "#e2e8f0",
        spacing: 24,
      },
    }),

    Spacer: () => ({
      id,
      type: "Spacer",
      props: {
        height: 32,
      },
    }),

    Heading: () => ({
      id,
      type: "Heading",
      props: {
        text: "כותרת",
        level: 2,
        align: "right",
      },
    }),

    Card: () => ({
      id,
      type: "Card",
      props: {
        title: "כותרת כרטיס",
        description: "תיאור קצר",
        buttonText: "קרא עוד",
        buttonLink: "#",
        shadow: "md",
      },
    }),
  };

  const factory = defaults[type];
  if (factory) {
    const component = factory();
    if (overrides) {
      return {
        ...component,
        ...overrides,
        props: { ...component.props, ...overrides.props },
      };
    }
    return component;
  }

  // Fallback for unknown types
  return {
    id,
    type,
    props: {},
    ...overrides,
  };
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Check if a component can have children
 */
export function canHaveChildren(type: PageComponent["type"]): boolean {
  const containerTypes = [
    "Page",
    "Container",
    "TextContainer",
    "Form",
    "Row",
    "Card",
  ];
  return containerTypes.includes(type);
}

/**
 * Validate the tree structure
 */
export function validateTree(root: PageComponent): boolean {
  const ids = new Set<string>();

  const validate = (node: PageComponent): boolean => {
    // Check for duplicate IDs
    if (ids.has(node.id)) {
      console.error(`Duplicate ID found: ${node.id}`);
      return false;
    }
    ids.add(node.id);

    // Validate children
    if (node.children) {
      for (const child of node.children) {
        if (!validate(child)) {
          return false;
        }
      }
    }

    return true;
  };

  return validate(root);
}


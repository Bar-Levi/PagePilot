import type { PageData, PageComponent } from '@/components/landing-page/types';

export abstract class EditCommand {
  abstract execute(): void;
  abstract undo(): void;
  abstract redo(): void;
  abstract get description(): string;
}

export class UpdateComponentPropsCommand extends EditCommand {
  private oldProps: any;
  private newProps: any;

  constructor(
    private componentId: string,
    oldProps: any,
    newProps: any,
    private updateFn: (id: string, props: any) => void
  ) {
    super();
    this.oldProps = { ...oldProps };
    this.newProps = { ...newProps };
  }

  execute() {
    this.updateFn(this.componentId, this.newProps);
  }

  undo() {
    this.updateFn(this.componentId, this.oldProps);
  }

  redo() {
    this.execute();
  }

  get description() {
    return `Update ${this.componentId} properties`;
  }
}

export class UpdateComponentTextCommand extends EditCommand {
  constructor(
    private componentId: string,
    private oldText: string,
    private newText: string,
    private updateFn: (id: string, text: string) => void
  ) {
    super();
  }

  execute() {
    this.updateFn(this.componentId, this.newText);
  }

  undo() {
    this.updateFn(this.componentId, this.oldText);
  }

  redo() {
    this.execute();
  }

  get description() {
    return `Update text for ${this.componentId}`;
  }
}

export class AddComponentCommand extends EditCommand {
  constructor(
    private parentId: string | null,
    private component: PageComponent,
    private addFn: (parentId: string | null, component: PageComponent) => void,
    private removeFn: (id: string) => void
  ) {
    super();
  }

  execute() {
    this.addFn(this.parentId, this.component);
  }

  undo() {
    this.removeFn(this.component.id);
  }

  redo() {
    this.execute();
  }

  get description() {
    return `Add ${this.component.type} component`;
  }
}

export class RemoveComponentCommand extends EditCommand {
  private componentData: PageComponent;
  private parentId: string | null;

  constructor(
    component: PageComponent,
    parentId: string | null,
    private addFn: (parentId: string | null, component: PageComponent) => void,
    private removeFn: (id: string) => void
  ) {
    super();
    this.componentData = { ...component };
    this.parentId = parentId;
  }

  execute() {
    this.removeFn(this.componentData.id);
  }

  undo() {
    this.addFn(this.parentId, this.componentData);
  }

  redo() {
    this.execute();
  }

  get description() {
    return `Remove ${this.componentData.type} component`;
  }
}

export class MoveComponentCommand extends EditCommand {
  constructor(
    private componentId: string,
    private fromParentId: string | null,
    private toParentId: string | null,
    private fromIndex: number,
    private toIndex: number,
    private moveFn: (id: string, fromParent: string | null, toParent: string | null, fromIndex: number, toIndex: number) => void
  ) {
    super();
  }

  execute() {
    this.moveFn(this.componentId, this.fromParentId, this.toParentId, this.fromIndex, this.toIndex);
  }

  undo() {
    this.moveFn(this.componentId, this.toParentId, this.fromParentId, this.toIndex, this.fromIndex);
  }

  redo() {
    this.execute();
  }

  get description() {
    return `Move component ${this.componentId}`;
  }
}

export class ReorderComponentCommand extends EditCommand {
  constructor(
    private componentId: string,
    private parentId: string | null,
    private fromIndex: number,
    private toIndex: number,
    private reorderFn: (parentId: string | null, fromIndex: number, toIndex: number) => void
  ) {
    super();
  }

  execute() {
    this.reorderFn(this.parentId, this.fromIndex, this.toIndex);
  }

  undo() {
    this.reorderFn(this.parentId, this.toIndex, this.fromIndex);
  }

  redo() {
    this.execute();
  }

  get description() {
    return `Reorder component in ${this.parentId || 'root'}`;
  }
}

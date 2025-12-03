import { EditCommand } from './commands';

export class CommandManager {
  private undoStack: EditCommand[] = [];
  private redoStack: EditCommand[] = [];
  private listeners: Set<() => void> = new Set();

  execute(command: EditCommand) {
    command.execute();
    this.undoStack.push(command);
    this.redoStack = []; // Clear redo stack when new command is executed
    this.notifyListeners();
  }

  undo() {
    const command = this.undoStack.pop();
    if (command) {
      command.undo();
      this.redoStack.push(command);
      this.notifyListeners();
    }
  }

  redo() {
    const command = this.redoStack.pop();
    if (command) {
      command.redo();
      this.undoStack.push(command);
      this.notifyListeners();
    }
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  getUndoDescription(): string | null {
    const command = this.undoStack[this.undoStack.length - 1];
    return command ? command.description : null;
  }

  getRedoDescription(): string | null {
    const command = this.redoStack[this.redoStack.length - 1];
    return command ? command.description : null;
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
    this.notifyListeners();
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Batch commands together
  executeBatch(commands: EditCommand[]) {
    commands.forEach(command => command.execute());
    this.undoStack.push(...commands);
    this.redoStack = [];
    this.notifyListeners();
  }

  // Undo batch commands
  undoBatch(count: number) {
    const commands = this.undoStack.splice(-count, count);
    commands.reverse().forEach(command => command.undo());
    this.redoStack.push(...commands);
    this.notifyListeners();
  }
}

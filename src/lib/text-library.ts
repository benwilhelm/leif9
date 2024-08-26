type T = Record<string, string>;
type Handler = (val: string) => void;

export class TextLibrary {
  private handlers: Partial<Record<keyof T, Handler[]>> = {};

  constructor(private textLookup: T) {}

  get(key: keyof T) {
    return this.textLookup[key];
  }

  set(key: keyof T, val: string) {
    this.textLookup[key] = val 
    this.emitChange(key)
  }

  subscribe(key: keyof T, handler: Handler) {
    const handlers = this.handlers[key] ?? []
    handlers.push(handler);
    this.handlers[key] = handlers
  }

  unsubscribe(key: keyof T, handler: Handler) {
    const handlers = this.handlers[key] ?? [];
    this.handlers[key] = handlers.filter((h) => h !== handler);
  }

  private emitChange(key: keyof T) {
    const handlers = this.handlers[key] ?? [];
    handlers.forEach((handler) => handler(this.textLookup[key]));
  }
}

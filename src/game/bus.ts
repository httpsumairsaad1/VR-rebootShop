/** Tiny event bus shared by all systems (keeps systems decoupled). */
type Handler = (payload: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
const handlers = new Map<string, Set<Handler>>();
export const bus = {
  on(event: string, fn: Handler): () => void {
    let set = handlers.get(event);
    if (!set) handlers.set(event, (set = new Set()));
    set.add(fn);
    return () => set!.delete(fn);
  },
  emit(event: string, payload?: unknown): void {
    handlers.get(event)?.forEach((fn) => { try { fn(payload); } catch (e) { console.error(`bus handler for "${event}" failed`, e); } });
  },
};

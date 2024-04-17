export interface Watcher {
  type: string;
  term: string;
}

export interface State {
  initialized: boolean;
  watchers: Watcher[];
}

export type Action =
  | { type: "initialized"; watchers?: Watcher[] }
  | { type: "add-watcher" | "delete-watcher"; watcher: Watcher }
  | { type: "update-watches"; watchers: Watcher[] };

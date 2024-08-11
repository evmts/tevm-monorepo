import type { State } from './State.js';
import type { Dispatchers } from './dispatchers.js';
/**
 * Type of zustand store for create-evmts-app cli
 */
export type Store = State & Dispatchers;
/**
 * Zustand React wrapper around the flux store
 */
export declare const useStore: (initialState: State) => Store;
//# sourceMappingURL=Store.d.ts.map
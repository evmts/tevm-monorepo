import type { Store } from './Store.js';
import { type Reducers } from './reducers.js';
/**
 * Zustand set function
 */
type Set = (partial: Store | Partial<Store> | ((state: Store) => Store | Partial<Store>), replace?: boolean | undefined) => void;
/**
 * Type of dispatches UI can make to the store
 * Simply just a function that takes the reducer payload as it's only argument
 */
export type Dispatchers = {
    [TName in keyof Reducers]: (payload: Parameters<Reducers[TName]>[0]) => void;
};
/**
 * Creates a new zustand store from an initial state
 */
export declare const createDispatchers: (set: Set) => Dispatchers;
export {};
//# sourceMappingURL=dispatchers.d.ts.map
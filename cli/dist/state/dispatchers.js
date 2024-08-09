import { reducers } from './reducers.js';
/**
 * Creates a new zustand store from an initial state
 */
export const createDispatchers = (set) => {
    return Object.fromEntries(Object.entries(reducers).map(([key, reducer]) => [
        key,
        (payload) => {
            set((state) => reducer(payload, state));
        },
    ]));
};

import { reducers } from './reducers.js';
import { useState } from 'react';
import { create } from 'zustand';
/**
 * Creates a new zustand store from an initial state
 */
const createStore = (initialState) => {
    return create((set) => {
        const dispatchers = Object.fromEntries(Object.entries(reducers).map(([key, reducer]) => [
            key,
            (payload) => {
                set((state) => reducer(payload, state));
            },
        ]));
        return { ...initialState, ...dispatchers };
    });
};
/**
 * Zustand React wrapper around the flux store
 */
export const useStore = (initialState) => {
    const [useZustandStore] = useState(() => createStore(initialState));
    return useZustandStore();
};

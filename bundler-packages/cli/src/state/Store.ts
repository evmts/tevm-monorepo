import type { State } from './State.js'
import type { Dispatchers } from './dispatchers.js'
import { reducers } from './reducers.js'
import { useState } from 'react'
import { create } from 'zustand'

/**
 * Type of zustand store for create-evmts-app cli
 */
export type Store = State & Dispatchers

/**
 * Creates a new zustand store from an initial state
 */
const createStore = (initialState: State) => {
	return create<Store>((set) => {
		const dispatchers = Object.fromEntries(
			Object.entries(reducers).map(([key, reducer]) => [
				key,
				(payload: any) => {
					set((state) => reducer(payload, state))
				},
			]),
		) as Dispatchers
		return { ...initialState, ...dispatchers }
	})
}

/**
 * Zustand React wrapper around the flux store
 */
export const useStore = (initialState: State) => {
	const [useZustandStore] = useState(() => createStore(initialState))
	return useZustandStore()
}

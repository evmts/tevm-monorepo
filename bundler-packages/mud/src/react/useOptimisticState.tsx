import type { State, StoreConfig } from '@latticexyz/stash/internal'
import { useDebugValue, useEffect, useRef, useState } from 'react'
import { deepEqual } from '../internal/deepEqual.js'
import { useOptimisticWrapper } from './useOptimisticWrapper.js'

export const useOptimisticState = <Tconfig extends StoreConfig, T>(
	/**
	 * Selector to pick values from state.
	 * This selector receives the promise returned by getOptimisticState().
	 * If T is the data resolved from the promise, this selector function should be async
	 * or return a Promise<T>.
	 */
	selector: (state: State<Tconfig>) => Promise<T>,
	/**
	 * Optional equality function.
	 */
	opts?: {
		isEqual: (a: T | undefined, b: T | undefined) => boolean
	},
): T | undefined => {
	const { isEqual } = opts ?? { isEqual: (a, b) => deepEqual(a, b) }
	const wrapper = useOptimisticWrapper<Tconfig>()
	const [selectedState, setSelectedState] = useState<T | undefined>(undefined)

	// Store selector in a ref to avoid issues if its identity changes across re-renders,
	// which would otherwise cause the useEffect to re-run unnecessarily.
	const selectorRef = useRef(selector)
	useEffect(() => {
		selectorRef.current = selector
	}, [selector])

	// Ref to store the last successfully selected state to compare against new selections.
	const lastSelectedStateRef = useRef<T | undefined>(undefined)

	useEffect(() => {
		if (!wrapper) return
		let isMounted = true
		const { getOptimisticState, subscribeOptimisticState } = wrapper

		const fetchDataAndUpdate = async () => {
			try {
				// Call the provided selector with the promise from getOptimisticState.
				// Await the result, as the selector might be async or return a promise for T.
				const newSlice = await selectorRef.current(await getOptimisticState())

				if (isMounted) {
					// Only update React's state (and trigger re-render) if the new slice
					// is actually different from the last one.
					if (!isEqual(lastSelectedStateRef.current, newSlice)) {
						setSelectedState(newSlice)
						lastSelectedStateRef.current = newSlice
					}
				}
			} catch (error) {
				if (isMounted) {
					console.error('Error in useOptimisticState while fetching/selecting state:', error)
					// Optionally, you could set an error state here or clear the existing state.
					// For example:
					// setSelectedState(undefined);
					// lastSelectedStateRef.current = undefined;
				}
			}
		}

		fetchDataAndUpdate() // Perform initial fetch and selection.

		// Subscribe to changes in the optimistic state.
		// When the underlying store signals a change, re-fetch and re-select.
		const unsubscribe = subscribeOptimisticState({
			subscriber: () => {
				fetchDataAndUpdate()
			},
		})

		return () => {
			isMounted = false
			unsubscribe()
		}
	}, [wrapper?.getOptimisticState, wrapper?.subscribeOptimisticState])

	useDebugValue(selectedState)
	return selectedState
}

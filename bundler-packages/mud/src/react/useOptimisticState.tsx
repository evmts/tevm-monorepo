import type { State, StoreConfig } from '@latticexyz/stash/internal'
import { useDebugValue, useSyncExternalStore } from 'react'
import { deepEqual } from '../internal/utils/deepEqual.js'
import { memoize } from '../internal/utils/memoize.js'
import { useOptimisticWrapper } from './useOptimisticWrapper.js'

export type UseOptimisticStateOptions<T> = {
	/**
	 * Optional equality function.
	 * Must be a stable function, otherwise you may end up with this hook rerendering infinitely.
	 * @default deepEqual
	 */
	isEqual?: (a: T, b: T) => boolean
}

export const useOptimisticState = <TConfig extends StoreConfig, T>(
	/**
	 * Selector to pick values from state.
	 * Be aware of the stability of both the `selector` and the return value, otherwise you may end up with unnecessary re-renders.
	 */
	selector: (state: State<TConfig>) => T,
	/**
	 * Optional equality function.
	 */
	opts: UseOptimisticStateOptions<T> = {},
): T | undefined => {
	const { isEqual = deepEqual } = opts
	const wrapper = useOptimisticWrapper<TConfig>()

	const slice = useSyncExternalStore(
		(subscriber) => {
			if (!wrapper) return () => {}
			return wrapper.subscribeOptimisticState({ subscriber })
		},
		wrapper ? memoize(() => selector(wrapper.getOptimisticState()), isEqual) : () => undefined,
	)

	useDebugValue(slice)
	return slice
}

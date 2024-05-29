import type { BaseState } from '../BaseState.js'
import type { StateManager } from '../StateManager.js'

export type StateAction<T extends keyof StateManager> = (
	baseState: BaseState,
	skipFetchingFromFork?: boolean,
) => StateManager[T]

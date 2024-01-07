import type { TevmState } from '../../Tevm.js'
import type { TevmStateManager } from '../../stateManager/TevmStateManager.js'

export type RunDumpStateHandlerGeneric = (
	stateManager: TevmStateManager,
) => Promise<TevmState>

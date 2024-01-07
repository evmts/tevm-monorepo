import { TevmStateManager } from '@tevm/state'
import type { TevmState } from '../../Tevm.js'

export type RunDumpStateHandlerGeneric = (
	stateManager: TevmStateManager,
) => Promise<TevmState>

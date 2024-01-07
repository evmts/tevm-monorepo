import type { Tevm, TevmState } from '../../Tevm.js'

export type RunDumpStateHandlerGeneric = (evm: Tevm) => Promise<TevmState>

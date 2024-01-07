import type { Tevm, TevmState } from '../../Tevm.js'

export type RunLoadStateActionHandler = (
	evm: Tevm,
	tevmState: TevmState,
) => Promise<void>

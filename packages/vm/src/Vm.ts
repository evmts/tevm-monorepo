import type { BuildBlock } from './actions/buildBlock.js'
import type { RunBlock } from './actions/runBlock.js'
import type { RunTx } from './actions/runTx.js'
import type { BaseVm } from './BaseVm.js'

export type Vm = BaseVm & {
	deepCopy: () => Promise<Vm>
	buildBlock: BuildBlock
	runBlock: RunBlock
	runTx: RunTx
}

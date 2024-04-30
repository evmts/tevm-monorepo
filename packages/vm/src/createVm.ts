import type { CreateVmOptions } from './CreateVmOptions.js'
import { TevmVm } from './TevmVm.js'

export const createVm = async ({ stateManager, evm, blockchain, common }: CreateVmOptions): Promise<TevmVm> => {
	return TevmVm.create({
		stateManager,
		evm,
		activatePrecompiles: true,
		blockchain,
		common,
		setHardfork: false,
		profilerOpts: {
			reportAfterTx: true,
			reportAfterBlock: false,
		},
	})
}

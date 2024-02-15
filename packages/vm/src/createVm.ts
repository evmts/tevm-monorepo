import type { CreateVmOptions } from './CreateVmOptions.js'
import { TevmVm } from './TevmVm.js'
import {
	ForkStateManager,
	NormalStateManager,
	ProxyStateManager,
} from '@tevm/state'

export const createVm = async ({
	stateManager,
	evm,
	blockchain,
	common,
}: CreateVmOptions): Promise<TevmVm> => {
	const vm = await TevmVm.create({
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

	// TODO move me to the @tevm/vm package
	const originalDeepCopy = vm.deepCopy.bind(vm)
	vm.deepCopy = async (...args) => {
		const newVm = await originalDeepCopy(...args)
		const originalRunCall = newVm.evm.runCall.bind(newVm.evm)
		newVm.evm.runCall = async (...args) => {
			if (
				newVm.evm.stateManager instanceof NormalStateManager ||
				newVm.evm.stateManager instanceof ForkStateManager
			) {
				return originalRunCall(...args)
			}
			if (!(newVm.evm.stateManager instanceof ProxyStateManager)) {
				throw new Error('Unknown state manager in shallow copy')
			}
			await newVm.evm.stateManager.lock()
			try {
				const res = await originalRunCall(...args)
				return res
			} finally {
				await newVm.evm.stateManager.unlock()
			}
		}
		return newVm
	}

	return vm
}

import { VM } from '@ethereumjs/vm'
import type { TevmBlockchain } from '@tevm/blockchain'
import type { TevmCommon } from '@tevm/common'
import { Evm, createEvm } from '@tevm/evm'
import { type TevmStateManager } from '@tevm/state'

export class TevmVm extends VM {
	declare evm: Evm
	declare blockchain: TevmBlockchain
	declare common: TevmCommon
	/**
	 * VM async constructor. Creates engine instance and initializes it.
	 *
	 * @param opts VM engine constructor options
	 */
	static override async create(
		opts: Parameters<typeof VM.create>[0] = {},
	): Promise<TevmVm> {
		const vm = new TevmVm(opts)
		const genesisStateOpts =
			opts.stateManager === undefined && opts.genesisState === undefined
				? { genesisState: {} }
				: undefined
		await vm.init({ ...genesisStateOpts, ...opts })
		return vm
	}

	declare stateManager: TevmStateManager

	public deepCopy = async (): Promise<TevmVm> => {
		const common = this.common.copy()
		common.setHardfork(this.common.hardfork())

		// TODO we should deep copy once @tevm/blockchain is merged
		const blockchain = this.blockchain.shallowCopy()
		if (!('deepCopy' in this.stateManager)) {
			throw new Error(
				'StateManager does not support deepCopy. Was a Tevm state manager used?',
			)
		}
		const stateManager = await (
			this.stateManager as TevmStateManager
		).deepCopy()

		const evmCopy = createEvm({
			blockchain,
			common,
			stateManager,
			allowUnlimitedContractSize: this.evm.allowUnlimitedContractSize ?? false,
			customPrecompiles: (this.evm as any)._customPrecompiles,
			// customPredeploys isn't needed because it will be copied along in stateManager.deepCopy
			// customPredeploys,
			profiler:
				Boolean((this.evm as any).optsCached?.profiler?.enabled) ?? false,
		})
		return TevmVm.create({
			stateManager,
			blockchain: this.blockchain,
			activatePrecompiles: true,
			common,
			evm: evmCopy,
			setHardfork: this._setHardfork,
			...(this._opts.profilerOpts
				? { profilerOpts: this._opts.profilerOpts }
				: {}),
		})
	}
}

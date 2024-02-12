import { EVM } from '@ethereumjs/evm'
import { VM } from '@ethereumjs/vm'
import {
	ForkStateManager,
	NormalStateManager,
	ProxyStateManager,
} from '@tevm/state'

type TevmStateManager =
	| NormalStateManager
	| ForkStateManager
	| ProxyStateManager

export class TevmVm extends VM {
	/**
	 * VM async constructor. Creates engine instance and initializes it.
	 *
	 * @param opts VM engine constructor options
	 */
	static override async create(opts: Parameters<typeof VM.create>[0] = {}): Promise<TevmVm> {
		const vm = new TevmVm(opts)
		const genesisStateOpts =
			opts.stateManager === undefined && opts.genesisState === undefined
				? { genesisState: {} }
				: undefined
		await vm.init({ ...genesisStateOpts, ...opts })
		return vm
	}

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
		const evmOpts = {
			...(this.evm as any)._optsCached,
			common,
			blockchain,
			stateManager,
		}
		// TODO use TevmEvm
		const evmCopy = new EVM(evmOpts)
		return TevmVm.create({
			stateManager,
			blockchain: this.blockchain,
			common,
			evm: evmCopy,
			setHardfork: this._setHardfork,
			...(this._opts.profilerOpts
				? { profilerOpts: this._opts.profilerOpts }
				: {}),
		})
	}
}

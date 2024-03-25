import { VM } from '@ethereumjs/vm'
import { type TevmBlockchain, createBlockchain } from '@tevm/blockchain'
import { Common } from '@tevm/common'
import { Evm, createEvm, getActivePrecompiles } from '@tevm/evm'
import { type TevmStateManager, createTevmStateManager } from '@tevm/state'
import { EthjsAccount, EthjsAddress, hexToBytes } from '@tevm/utils'

export class TevmVm extends VM {
	declare evm: Evm
	declare blockchain: TevmBlockchain
	declare common: Common
	/**
	 * VM async constructor. Creates engine instance and initializes it.
	 *
	 * @param opts VM engine constructor options
	 */
	static override async create(
		opts: Parameters<typeof VM.create>[0] = {},
	): Promise<TevmVm> {
		// Save if a `StateManager` was passed (for activatePrecompiles)
		const didPassStateManager = opts.stateManager !== undefined

		// Add common, SM, blockchain, EVM here
		if (opts.common === undefined) {
			opts.common = new Common({ chain: 1, eips: [1559, 4895] })
		}

		if (opts.stateManager === undefined) {
			opts.stateManager = createTevmStateManager({ common: opts.common })
		}

		if (opts.blockchain === undefined) {
			opts.blockchain = await createBlockchain({ common: opts.common })
		}

		const genesisState = opts.genesisState ?? {}
		if (opts.genesisState !== undefined) {
			await opts.stateManager.generateCanonicalGenesis(genesisState)
		}

		if (opts.profilerOpts !== undefined) {
			const profilerOpts = opts.profilerOpts
			if (
				profilerOpts.reportAfterBlock === true &&
				profilerOpts.reportAfterTx === true
			) {
				throw new Error(
					'Cannot have `reportProfilerAfterBlock` and `reportProfilerAfterTx` set to `true` at the same time',
				)
			}
		}

		if (opts.evm === undefined) {
			let enableProfiler = false
			if (
				opts.profilerOpts?.reportAfterBlock === true ||
				opts.profilerOpts?.reportAfterTx === true
			) {
				enableProfiler = true
			}
			opts.evm = await Evm.create({
				common: opts.common,
				stateManager: opts.stateManager,
				blockchain: opts.blockchain,
				profiler: {
					enabled: enableProfiler,
				},
			})
		}

		if (opts.activatePrecompiles === true && !didPassStateManager) {
			await opts.evm.journal.checkpoint()
			// put 1 wei in each of the precompiles in order to make the accounts non-empty and thus not have them deduct `callNewAccount` gas.
			for (const [addressStr] of getActivePrecompiles(opts.common)) {
				const address = new EthjsAddress(hexToBytes(`0x${addressStr}`))
				let account = await opts.evm.stateManager.getAccount(address)
				// Only do this if it is not overridden in genesis
				// Note: in the case that custom genesis has storage fields, this is preserved
				if (account === undefined) {
					account = new EthjsAccount()
					const newAccount = EthjsAccount.fromAccountData({
						balance: 1,
						storageRoot: account.storageRoot,
					})
					await opts.evm.stateManager.putAccount(address, newAccount)
				}
			}
			await opts.evm.journal.commit()
		}

		return new TevmVm(opts)
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

		const evmCopy = await createEvm({
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

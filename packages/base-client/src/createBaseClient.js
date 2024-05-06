import { ReceiptsManager, createChain, createMapDb } from '@tevm/blockchain'
import { Common } from '@tevm/common'
import {} from '@tevm/errors'
import { createEvm } from '@tevm/evm'
import { createLogger } from '@tevm/logger'
import { createStateManager, dumpCanonicalGenesis, getForkBlockTag } from '@tevm/state'
import { TxPool } from '@tevm/txpool'
import { EthjsAccount, EthjsAddress, hexToBigInt, numberToHex, parseEther, toHex } from '@tevm/utils'
import { createVm } from '@tevm/vm'
import { DEFAULT_CHAIN_ID } from './DEFAULT_CHAIN_ID.js'
import { addPredeploy } from './addPredeploy.js'
import { getChainId } from './getChainId.js'

/**
 * These are the same accounts hardhat and anvil start with 10000 eth
 * Also including zer address
 * @type {ReadonlyArray<import('@tevm/utils').Address>}
 */
const INITIAL_ACCOUNTS = [
	`0x${'00'.repeat(20)}`,
	'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
	'0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
	'0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
	'0x90F79bf6EB2c4f870365E785982E1f101E93b906',
	'0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
	'0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
	'0x976EA74026E726554dB657fA54763abd0C3a0aa9',
	'0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
	'0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
	'0xa0Ee7A142d267C1f36714E4a8F75612F20a79720',
]

// TODO the common code is not very good and should be moved to common package
// it has rotted from a previous implementation where the chainId was not used by vm

/**
 * Creates the base instance of a memory client
 * @param {import('./BaseClientOptions.js').BaseClientOptions} [options]
 * @returns {import('./BaseClient.js').BaseClient}
 * @example
 * ```ts
 *  ```
 */
export const createBaseClient = (options = {}) => {
	/**
	 * @param {number} chainId
	 */
	const createCommon = (chainId) => {
		return Common.custom(
			{
				name: 'TevmCustom',
				chainId,
				networkId: 10,
			},
			{
				hardfork: options.hardfork ?? 'cancun',
				baseChain: 1,
				eips: [...(options.eips ?? []), 1559, 4895, 4844, 4788],
			},
		)
	}

	/**
	 * @returns {import('@tevm/state').StateOptions }
	 */
	const getStateManagerOpts = () => {
		/**
		 * @type {import('@tevm/state').StateOptions['onCommit']}
		 */
		const onCommit = (stateManager) => {
			if (!options.persister) {
				throw new Error('No persister provided')
			}
			dumpCanonicalGenesis(stateManager)().then((state) => {
				/**
				 * @type {import('@tevm/state').ParameterizedTevmState}
				 */
				const parsedState = {}

				for (const [k, v] of Object.entries(state)) {
					const { nonce, balance, storageRoot, codeHash } = v
					parsedState[k] = {
						...v,
						nonce: toHex(nonce),
						balance: toHex(balance),
						storageRoot: storageRoot,
						codeHash: codeHash,
					}
				}
				options.persister?.persistTevmState(parsedState)
			})
		}
		if (options.fork?.url) {
			return {
				fork: {
					...options.fork,
					...(options.persister ? { onCommit } : {}),
				},
			}
		}
		// handle normal mode
		if (options.persister) {
			return {
				onCommit: /** @type any*/ (onCommit),
			}
		}
		return {}
	}
	const stateManager = createStateManager(getStateManagerOpts())

	/**
	 * Create the extend function in a generic way
	 * @param {import('./BaseClient.js').BaseClient} client
	 * @returns {import('./BaseClient.js').BaseClient['extend']}
	 */
	const extend = (client) => (extension) => {
		Object.assign(client, extension(client))
		return /** @type {any}*/ (client)
	}

	const initChainId = async () => {
		if (options.chainId) {
			return options.chainId
		}
		const url = options.fork?.url
		if (url) {
			const id = await getChainId(url)
			return id
		}
		return DEFAULT_CHAIN_ID
	}

	const initVm = async () => {
		// Handle initializing the state from the persisted state
		/**
		 * @type {Promise<any>}
		 */
		let statePromise = Promise.resolve()
		const restoredState = options.persister?.restoreState()
		if (restoredState) {
			/**
			 * @type {import('@tevm/state').TevmState}
			 */
			const parsedState = {}
			for (const [k, v] of Object.entries(restoredState)) {
				const { nonce, balance, storageRoot, codeHash } = v
				parsedState[k] = {
					...v,
					nonce: hexToBigInt(nonce),
					balance: hexToBigInt(balance),
					storageRoot: storageRoot,
					codeHash: codeHash,
				}
			}
			// We might want to double check we aren't forking here
			// TODO we should be storing blockchain state too
			statePromise = stateManager.generateCanonicalGenesis(parsedState)
		} else {
			statePromise = Promise.all(
				INITIAL_ACCOUNTS.map((address) =>
					stateManager.putAccount(EthjsAddress.fromString(address), new EthjsAccount(0n, parseEther('1000'))),
				),
			)
		}

		const blockTag = (() => {
			const blockTag = /** @type {import('@tevm/state').StateManager}*/ getForkBlockTag(stateManager) || {
				blockTag: 'latest',
			}
			if ('blockNumber' in blockTag && blockTag.blockNumber !== undefined) {
				return numberToHex(blockTag.blockNumber)
			}
			if ('blockTag' in blockTag && blockTag.blockTag !== undefined) {
				return blockTag.blockTag
			}
			return 'latest'
		})()
		const common = createCommon(await initChainId())
		const blockchain = await createChain({
			common,
			...(options.fork?.url !== undefined
				? {
						fork: {
							url: options.fork.url,
							blockTag: blockTag.startsWith('0x')
								? hexToBigInt(/** @type {import('@tevm/utils').Hex}*/ (blockTag))
								: /** @type {import('@tevm/utils').BlockTag}*/ (blockTag),
						},
					}
				: {}),
		})
		const evm = await createEvm({
			common,
			stateManager,
			blockchain,
			allowUnlimitedContractSize: options.allowUnlimitedContractSize ?? false,
			customPrecompiles: options.customPrecompiles ?? [],
			profiler: options.profiler ?? false,
		})
		const vm = createVm({
			stateManager,
			evm,
			blockchain,
			common,
		})

		/**
		 * Add custom predeploys
		 */
		if (options.customPredeploys) {
			await Promise.all(
				options.customPredeploys.map((predeploy) => {
					addPredeploy({
						vm,
						address: predeploy.address,
						deployedBytecode: predeploy.contract.deployedBytecode,
					})
				}),
			)
		}

		await Promise.all([statePromise, blockchain.ready(), vm.ready()])

		const headBlock = await blockchain.getCanonicalHeadBlock()
		const initialState = await vm.stateManager.dumpCanonicalGenesis()
		vm.stateManager.saveStateRoot(headBlock.header.stateRoot, initialState)
		vm.stateManager._currentStateRoot = headBlock.header.stateRoot

		return vm
	}

	const vmPromise = initVm()
	const txPoolPromise = vmPromise.then((vm) => new TxPool({ vm }))
	const receiptManagerPromise = vmPromise.then((vm) => {
		return new ReceiptsManager(createMapDb({ cache: new Map() }), vm.blockchain)
	})

	/**
	 * Create and return the baseClient
	 * It will be syncronously created but some functionality
	 * will be asyncronously blocked by initialization of vm and chainId
	 * @type {import('./BaseClient.js').BaseClient}
	 */
	const baseClient = {
		logger: createLogger({
			name: 'TevmClient',
			level: options.loggingLevel ?? 'warn',
		}),
		getReceiptsManager: () => {
			return receiptManagerPromise
		},
		getTxPool: () => {
			return txPoolPromise
		},
		getVm: () => vmPromise,
		miningConfig: options.miningConfig ?? { type: 'auto' },
		mode: options.fork?.url ? 'fork' : 'normal',
		...(options.fork?.url ? { forkUrl: options.fork.url } : { forkUrl: options.fork?.url }),
		extend: (extension) => extend(baseClient)(extension),
		ready: async () => {
			await vmPromise
			return true
		},
	}

	return baseClient
}

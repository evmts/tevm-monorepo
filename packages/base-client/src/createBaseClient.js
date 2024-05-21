import { createChain } from '@tevm/blockchain'
import { createCommon } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createLogger } from '@tevm/logger'
import { ReceiptsManager, createMapDb } from '@tevm/receipt-manager'
import { createStateManager } from '@tevm/state'
import { TxPool } from '@tevm/txpool'
import { KECCAK256_RLP, bytesToHex, hexToBigInt, keccak256 } from '@tevm/utils'
import { createVm } from '@tevm/vm'
import { DEFAULT_CHAIN_ID } from './DEFAULT_CHAIN_ID.js'
import { GENESIS_STATE } from './GENESIS_STATE.js'
import { getBlockNumber } from './getBlockNumber.js'
import { getChainId } from './getChainId.js'
import { statePersister } from './statePersister.js'
import { mainnet, tevmDevnet } from '@tevm/chains'

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
	const loggingLevel = options.loggingLevel ?? 'warn'
	const logger = createLogger({
		name: 'TevmClient',
		level: loggingLevel,
	})

	/**
	 * @returns {Promise<import('@tevm/state').StateOptions>}
	 */
	const getStateManagerOpts = async () => {
		if (options.fork?.url) {
			// if the user passed in latest we must use an explicit block tag
			const blockTag = await blockTagPromise
			return {
				loggingLevel,
				fork: {
					...options.fork,
					blockTag,
					...(options.persister ? { onCommit: statePersister(options.persister, logger) } : {}),
				},
			}
		}
		// handle normal mode
		return {
			loggingLevel,
			...(options.fork?.url ? options.fork : {}),
			...(options.persister !== undefined ? { onCommit: statePersister(options.persister, logger) } : {}),
		}
	}

	/**
	 * Create the extend function in a generic way
	 * @param {import('./BaseClient.js').BaseClient} client
	 * @returns {import('./BaseClient.js').BaseClient['extend']}
	 */
	const extend = (client) => (extension) => {
		Object.assign(client, extension(client))
		return /** @type {any}*/ (client)
	}

	const chainIdPromise = (async () => {
		if (options.chain) {
			return options.chain.id
		}
		const url = options.fork?.url
		if (url) {
			const id = await getChainId(url)
			return id
		}
		return DEFAULT_CHAIN_ID
	})().then((chainId) => {
		logger.debug({ chainId }, 'Creating client with chainId')
		return BigInt(chainId)
	})

	const blockTagPromise = (async () => {
		if (options.fork === undefined) {
			// this is ultimately unused
			return 0n
		}
		// TODO handle other moving block tags like `safe`
		// we need to fetch the latest block number and return that otherwise we may have inconsistencies from block number changing
		if (options.fork.blockTag === undefined || options.fork.blockTag === 'latest') {
			const latestBlockNumber = await getBlockNumber(options.fork.url)
			logger.debug({ latestBlockNumber }, 'fetched fork block number from provided forkurl')
			return latestBlockNumber
		}
		return options.fork.blockTag
	})()

	const commonPromise = chainIdPromise.then((chainId) => {
		// TODO we will eventually want to be setting common hardfork based on chain id and block number
		// ethereumjs does this for mainnet but we forgo all this functionality
		if (options.chain) {
			return options.chain
		}
		if (!options.fork?.url) {
			return tevmDevnet
		}
		const common = createCommon({
			chainId,
			hardfork: 'cancun',
			loggingLevel,
			eips: options.eips ?? [],
		})
		/**
		 * @type {import('@tevm/chains').TevmChain}
		 */
		const resolvedChain = Object.assign(common, {
			...mainnet,
			id: Number(chainId),
		})
		return resolvedChain
	})

	const blockchainPromise = Promise.all([commonPromise, blockTagPromise]).then(([common, blockTag]) => {
		return createChain({
			loggingLevel,
			common,
			...(options.fork?.url !== undefined
				? {
						fork: {
							url: options.fork.url,
							blockTag,
						},
					}
				: {}),
		})
	})

	const stateManagerPromise = blockchainPromise
		.then(async (blockchain) => {
			// wait for blockchain to initialize so we have the correct state root
			await blockchain.ready()
			return blockchain
		})
		.then((chain) => chain.getCanonicalHeadBlock())
		.then(async (headBlock) => {
			const stateRootHex = bytesToHex(headBlock.header.stateRoot)
			const restoredState = options.persister?.restoreState()
			if (restoredState) {
				logger.debug(restoredState, 'Restoring persisted state...')
				logger.warn(
					'State persistence is an experimental feature. It currently does not persist the blockchain state only the EVM state.',
				)
				/**
				 * @type {import('@tevm/state').TevmState}
				 */
				const parsedState = {}
				for (const [k, v] of Object.entries(restoredState)) {
					const { nonce, balance, storageRoot, codeHash } = v
					parsedState[/** @type {import('@tevm/utils').Address}*/ (k)] = {
						...v,
						nonce: hexToBigInt(nonce),
						balance: hexToBigInt(balance),
						storageRoot: storageRoot,
						codeHash: codeHash,
					}
				}
				// We might want to double check we aren't forking and overwriting this somehow
				// TODO we should be storing blockchain state too
				return createStateManager({
					genesisState: parsedState,
					currentStateRoot: bytesToHex(headBlock.header.stateRoot),
					stateRoots: new Map([[stateRootHex, parsedState]]),
					...(await getStateManagerOpts()),
				})
			}
			const genesisState = {
				...GENESIS_STATE,
				// add predeploys to genesis state
				...Object.fromEntries(
					(options.customPredeploys ?? []).map((predeploy) => [
						predeploy.address,
						{
							nonce: 0n,
							deployedBytecode: predeploy.contract.deployedBytecode,
							// TODO this is definitely wrong but should work
							storageRoot: bytesToHex(KECCAK256_RLP),
							codeHash: keccak256(predeploy.contract.deployedBytecode),
						},
					]),
				),
			}
			return createStateManager({
				...(await getStateManagerOpts()),
				currentStateRoot: stateRootHex,
				stateRoots: new Map([[bytesToHex(headBlock.header.stateRoot), genesisState]]),
				genesisState,
			})
		})

	const evmPromise = Promise.all([commonPromise, stateManagerPromise, blockchainPromise]).then(
		([common, stateManager, blockchain]) => {
			return createEvm({
				common,
				stateManager,
				blockchain,
				allowUnlimitedContractSize: options.allowUnlimitedContractSize ?? false,
				customPrecompiles: options.customPrecompiles ?? [],
				profiler: options.profiler ?? false,
				loggingLevel,
			})
		},
	)

	const vmPromise = evmPromise.then((evm) => {
		const vm = createVm({
			stateManager: evm.stateManager,
			evm: evm,
			// TODO this inherited type is wrong thus we need to cast this
			blockchain: /** @type {import('@tevm/blockchain').Chain} */ (evm.blockchain),
			common: evm.common,
		})
		return vm
	})

	const txPoolPromise = vmPromise.then((vm) => new TxPool({ vm }))
	const receiptManagerPromise = vmPromise.then((vm) => {
		logger.debug('initializing receipts manager...')
		return new ReceiptsManager(createMapDb({ cache: new Map() }), vm.blockchain)
	})

	/**
	 * @returns {Promise<true>}
	 */
	const ready = async () => {
		await blockchainPromise.then((b) => b.ready())
		await stateManagerPromise.then((b) => b.ready())
		await vmPromise.then((vm) => vm.ready())
		return true
	}

	/**
	 * Create and return the baseClient
	 * It will be syncronously created but some functionality
	 * will be asyncronously blocked by initialization of vm and chainId
	 * @type {import('./BaseClient.js').BaseClient}
	 */
	const baseClient = {
		getChain() {
			return commonPromise
		},
		logger,
		getReceiptsManager: async () => {
			await ready()
			return receiptManagerPromise
		},
		getTxPool: async () => {
			await ready()
			return txPoolPromise
		},
		getVm: async () => {
			await ready()
			return vmPromise
		},
		miningConfig: options.miningConfig ?? { type: 'auto' },
		mode: options.fork?.url ? 'fork' : 'normal',
		...(options.fork?.url ? { forkUrl: options.fork.url } : {}),
		extend: (extension) => extend(baseClient)(extension),
		ready,
	}
	return baseClient
}

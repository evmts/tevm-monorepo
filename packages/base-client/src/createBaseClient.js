import { createChain } from '@tevm/blockchain'
import { createCommon, tevmDefault } from '@tevm/common'
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
	console.time('baseClient-ready')
	/**
	 * @type {import('@tevm/utils').Address | undefined}
	 */
	let impersonatedAccount = undefined
	/**
	 * @param {import('@tevm/utils').Address | undefined} address
	 * returns {void}
	 */
	const setImpersonatedAccount = (address) => {
		impersonatedAccount = address
	}

	const loggingLevel = options.loggingLevel ?? 'warn'
	const logger = createLogger({
		name: 'TevmClient',
		level: loggingLevel,
	})

	/**
	 * @returns {Promise<import('@tevm/state').StateOptions>}
	 */
	const getStateManagerOpts = async () => {
		if (options.fork?.transport) {
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
			...(options.fork?.transport ? options.fork : {}),
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

	console.time('chainIdPromise-ready')
	const chainIdPromise = (async () => {
		if (options?.common) {
			return options?.common.id
		}
		const forkTransport = options?.fork?.transport
		if (forkTransport) {
			const id = await getChainId(forkTransport)
			return id
		}
		return DEFAULT_CHAIN_ID
	})().then((chainId) => {
		logger.debug({ chainId }, 'Creating client with chainId')
		console.timeEnd('chainIdPromise-ready')
		return BigInt(chainId)
	})

	console.time('blockTagPromise-ready')
	const blockTagPromise = (async () => {
		if (options.fork === undefined) {
			// this is ultimately unused
			return 0n
		}
		// TODO handle other moving block tags like `safe`
		// we need to fetch the latest block number and return that otherwise we may have inconsistencies from block number changing
		if (options.fork.blockTag === undefined || options.fork.blockTag === 'latest') {
			const latestBlockNumber = await getBlockNumber(options.fork.transport)
			logger.debug({ latestBlockNumber }, 'fetched fork block number from provided forkurl')
			return latestBlockNumber
		}
		return options.fork.blockTag
	})().then((blockTag) => {
		console.timeEnd('blockTagPromise-ready')
		console.time('blockchain-ready')
		return blockTag
	})

	console.time('chainCommonPromise-ready')
	const chainCommonPromise = chainIdPromise
		.then((chainId) => {
			if (options.common) {
				return createCommon({
					...options.common,
					id: Number(chainId),
					loggingLevel: options.loggingLevel ?? 'warn',
					hardfork: /** @type {import('@tevm/common').Hardfork}*/ (options.common.ethjsCommon.hardfork()) ?? 'cancun',
					eips: options.common.ethjsCommon.eips(),
					customCrypto: options.common.ethjsCommon.customCrypto,
				})
			}
			return createCommon({
				...tevmDefault,
				id: Number(chainId),
				loggingLevel: options.loggingLevel ?? 'warn',
				hardfork: 'cancun',
				eips: [],
			})
		})
		.then((common) => {
			// ALWAYS Copy common so we don't modify the global instances since it's stateful!
			const copy = common.copy()
			console.timeEnd('chainCommonPromise-ready')
			return copy
		})

	const blockchainPromise = Promise.all([chainCommonPromise, blockTagPromise]).then(([common, blockTag]) => {
		return createChain({
			loggingLevel,
			common,
			...(options.fork?.transport !== undefined
				? {
						fork: {
							transport: options.fork.transport,
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
			console.time('stateManager-genesis')
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
				const manager = createStateManager({
					genesisState: parsedState,
					currentStateRoot: bytesToHex(headBlock.header.stateRoot),
					stateRoots: new Map([[stateRootHex, parsedState]]),
					...(await getStateManagerOpts()),
				})
				await manager.ready()
				return manager
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
			console.timeEnd('stateManager-genesis')
			const opts = await getStateManagerOpts()
			console.time('stateManager-ready')
			return createStateManager({
				...opts,
				currentStateRoot: stateRootHex,
				stateRoots: new Map([[bytesToHex(headBlock.header.stateRoot), genesisState]]),
				genesisState,
			})
		})

	const evmPromise = Promise.all([chainCommonPromise, stateManagerPromise, blockchainPromise]).then(
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

	const vmPromise = Promise.all([evmPromise, chainCommonPromise]).then(([evm, common]) => {
		const vm = createVm({
			stateManager: evm.stateManager,
			evm: evm,
			// TODO this inherited type is wrong thus we need to cast this
			blockchain: /** @type {import('@tevm/blockchain').Chain} */ (evm.blockchain),
			common,
		})
		return vm
	})

	const txPoolPromise = vmPromise.then((vm) => new TxPool({ vm }))
	const receiptManagerPromise = vmPromise.then((vm) => {
		logger.debug('initializing receipts manager...')
		return new ReceiptsManager(createMapDb({ cache: new Map() }), vm.blockchain)
	})

	const readyPromise = (async () => {
		console.log('calling ready...')
		await blockchainPromise.then((b) => b.ready())
		console.log('blockchain...')
		await stateManagerPromise.then((b) => b.ready())
		console.log('stateManager...')
		await vmPromise.then((vm) => vm.ready())
		console.log('vm...')
		return /** @type {true}*/ (true)
	})()
	blockchainPromise.then(() => {
		console.timeEnd('blockchain-ready')
	})
	stateManagerPromise.then(() => {
		console.timeEnd('stateManager-ready')
		console.time('vm-ready')
	})
	vmPromise.then(() => {
		console.timeEnd('vm-ready')
		console.time('vm-ready-lag')
	})
	readyPromise.then(() => {
		console.timeEnd('vm-ready-lag')
		console.timeEnd('baseClient-ready')
	})

	/**
	 * Create and return the baseClient
	 * It will be syncronously created but some functionality
	 * will be asyncronously blocked by initialization of vm and chainId
	 * @type {import('./BaseClient.js').BaseClient}
	 */
	const baseClient = {
		logger,
		getReceiptsManager: async () => {
			await readyPromise
			return receiptManagerPromise
		},
		getTxPool: async () => {
			await readyPromise
			return txPoolPromise
		},
		getVm: async () => {
			await readyPromise
			return vmPromise
		},
		miningConfig: options.miningConfig ?? { type: 'auto' },
		mode: options.fork?.transport ? 'fork' : 'normal',
		...(options.fork?.transport ? { forkTransport: options.fork.transport } : {}),
		extend: (extension) => extend(baseClient)(extension),
		ready: () => readyPromise,
		impersonatedAccount,
		setImpersonatedAccount,
	}
	return baseClient
}

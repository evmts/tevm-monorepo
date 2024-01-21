import { TevmEvm } from './TevmEvm.js'
import { processRequest } from './processRequest.js'
import { Block } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import { Common, Hardfork } from '@ethereumjs/common'
import { genesisStateRoot } from '@ethereumjs/trie'
import { MapDB } from '@ethereumjs/util'
import { VM } from '@ethereumjs/vm'
import {
	blockNumberHandler,
	callHandler,
	chainIdHandler,
	contractHandler,
	dumpStateHandler,
	gasPriceHandler,
	getAccountHandler,
	getBalanceHandler,
	getCodeHandler,
	getStorageAtHandler,
	loadStateHandler,
	scriptHandler,
	setAccountHandler,
} from '@tevm/actions'
import { DefaultTevmStateManager, TevmStateManager } from '@tevm/state'
import { createPublicClient, http } from 'viem'

/**
 * A local EVM instance running in JavaScript. Similar to Anvil in your browser
 * @param {import('./CreateEVMOptions.js').CreateEVMOptions} [options]
 * @returns {Promise<import('./MemoryTevm.js').MemoryTevm>}
 * @example
 * ```ts
 * import { createMemoryTevm } from "tevm"
 * import { createPublicClient, http } from "viem"
 * import { MyERC721 } from './MyERC721.sol'
 *
 * const tevm = createMemoryTevm({
 * 	fork: {
 * 	  url: "https://mainnet.optimism.io",
 * 	},
 * })
 *
 * const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',

 * await tevm.runContractCall(
 *   MyERC721.write.mint({
 *     caller: address,
 *   }),
 * )
 *
 * const balance = await tevm.runContractCall(
 *  MyERC721.read.balanceOf({
 *  caller: address,
 *  }),
 *  )
 *  console.log(balance) // 1n
 *  ```
 */
export const createMemoryTevm = async (options = {}) => {
	/**
	 * @type {TevmStateManager | DefaultTevmStateManager}
	 */
	let stateManager
	const common = new Common({
		chain: 1,
		hardfork: Hardfork.Shanghai,
		eips: [1559, 4895],
	})

	let chainId = 420n

	// ethereumjs throws an error for most chain ids
	if (options.fork?.url) {
		// TODO we should be using tevm/jsonrpc package instead of viem
		const client = createPublicClient({
			transport: http(options.fork.url),
		})
		const blockTagPromise = options.fork.blockTag
			? Promise.resolve(options.fork.blockTag)
			: client.getBlockNumber()
		const chainIdPromise = client.getChainId()
		const [blockTag, _chainId] = await Promise.all([
			blockTagPromise,
			chainIdPromise,
		])
		chainId = BigInt(_chainId)
		stateManager = new TevmStateManager({ rpcUrl: options.fork.url, blockTag })
	} else {
		stateManager = new DefaultTevmStateManager()
	}

	/**
	 * @type {import('@ethereumjs/util').GenesisState}
	 */
	const genesisState = {}

	const genesisBlock = Block.fromBlockData(
		{
			header: common.genesis(),
			...(common.isActivatedEIP(4895)
				? {
						withdrawals:
							/** @type {Array<import('@ethereumjs/util').WithdrawalData>}*/ ([]),
				  }
				: {}),
		},
		{ common, setHardfork: false, skipConsensusFormatValidation: true },
	)

	/**
	 * @type {Map<string | number | Uint8Array, string | Uint8Array | import('@ethereumjs/util').DBObject>}
	 */
	const mapDb = new Map()
	const db = new MapDB(mapDb)

	const stateRoot = await genesisStateRoot(genesisState)

	// We might need to update this instead of naively using a blank blockchain
	const blockchain = await Blockchain.create({
		genesisState,
		hardforkByHeadBlockNumber: false,
		db,
		common,
		validateBlocks: false,
		validateConsensus: false,
		genesisBlock,
		genesisStateRoot: stateRoot,
		// using ethereumjs defaults for this and disabling it
		// consensus,
	})

	const evm = new TevmEvm({
		common,
		stateManager,
		blockchain,
		allowUnlimitedContractSize: options.allowUnlimitedContractSize ?? false,
		allowUnlimitedInitCodeSize: false,
		customOpcodes: [],
		// TODO uncomment the mapping once we make the api correct
		customPrecompiles: options.customPrecompiles ?? [], // : customPrecompiles.map(p => ({ ...p, address: new EthjsAddress(hexToBytes(p.address)) })),
		profiler: {
			enabled: true,
		},
	})

	const vm = await VM.create({
		stateManager,
		evm,
		activatePrecompiles: true,
		blockchain,
		common,
		genesisState,
		setHardfork: false,
		profilerOpts: {
			reportAfterTx: true,
			reportAfterBlock: false,
		},
	})

	/**
	 * @type {import('./MemoryTevm.js').MemoryTevm}
	 */
	const tevm = {
		_evm: evm,
		_vm: vm,
		// we currently don't want to proxy any requests
		// because this causes confusing behavior with tevm
		// that we want to avoid or abstract away before enabling
		// This means tevm will throw an error on all non natively supported
		// requests
		request: processRequest(vm /*, options.fork?.url*/),
		script: scriptHandler(evm),
		getAccount: getAccountHandler(evm),
		setAccount: setAccountHandler(evm),
		call: callHandler(evm),
		contract: contractHandler(evm),
		dumpState: dumpStateHandler(evm.stateManager),
		loadState: loadStateHandler(evm.stateManager),
		eth: {
			blockNumber: blockNumberHandler(blockchain),
			chainId: chainIdHandler(chainId),
			gasPrice: gasPriceHandler({
				forkUrl: options.fork?.url,
				blockchain,
			}),
			getBalance: getBalanceHandler({
				forkUrl: options.fork?.url,
				stateManager,
			}),
			getCode: getCodeHandler({
				stateManager,
				forkUrl: options.fork?.url,
			}),
			getStorageAt: getStorageAtHandler({
				stateManager,
				forkUrl: options.fork?.url,
			}),
		},
		...(options.fork?.url
			? { forkUrl: options.fork.url }
			: { forkUrl: options.fork?.url }),
	}

	await Promise.all(
		options.customPredeploys?.map((predeploy) => {
			tevm.setAccount({
				address: predeploy.address,
				deployedBytecode: predeploy.contract.deployedBytecode,
			})
		}) || [],
	)

	return tevm
}

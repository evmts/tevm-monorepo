import { WrappedEvm } from './WrappedEvm.js'
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
	ethCallHandler,
	gasPriceHandler,
	getAccountHandler,
	getBalanceHandler,
	getCodeHandler,
	getStorageAtHandler,
	loadStateHandler,
	scriptHandler,
	setAccountHandler,
	testAccounts,
} from '@tevm/actions'
import { requestBulkProcedure, requestProcedure } from '@tevm/procedures'
import {
	ForkStateManager,
	NormalStateManager,
	ProxyStateManager,
} from '@tevm/state'
import { createPublicClient, http, parseEther } from 'viem'

/**
 * A local EVM instance running in JavaScript. Similar to Anvil in your browser
 * @param {import('./CreateEVMOptions.js').CreateEVMOptions} [options]
 * @returns {Promise<import('./MemoryClient.js').MemoryClient>}
 * @example
 * ```ts
 * import { createMemoryClient } from "tevm"
 * import { createPublicClient, http } from "viem"
 * import { MyERC721 } from './MyERC721.sol'
 *
 * const tevm = createMemoryClient({
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
export const createMemoryClient = async (options = {}) => {
	if (options.fork?.url && options.proxy?.url) {
		throw new Error(
			'Unable to initialize MemoryClient. Cannot use both fork and proxy options at the same time!',
		)
	}

	/**
	 * @type {NormalStateManager | ForkStateManager | ProxyStateManager}
	 */
	let stateManager
	const common = new Common({
		chain: 1,
		hardfork: options.hardfork ?? Hardfork.Shanghai,
		eips: /**@type number[]*/ (options.eips ?? [1559, 4895]),
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
		stateManager = new ForkStateManager({ url: options.fork.url, blockTag })
	} else {
		stateManager = new NormalStateManager()
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

	const evm = new WrappedEvm({
		common,
		stateManager,
		blockchain,
		allowUnlimitedContractSize: options.allowUnlimitedContractSize ?? false,
		allowUnlimitedInitCodeSize: false,
		customOpcodes: [],
		// TODO uncomment the mapping once we make the api correct
		customPrecompiles: options.customPrecompiles ?? [], // : customPrecompiles.map(p => ({ ...p, address: new EthjsAddress(hexToBytes(p.address)) })),
		profiler: {
			enabled: options.profiler ?? false,
		},
	})

	// We need to make sure that we lock the state manager when a call is ran
	// Ideally we move and unit test logic like this to a new @tevm/evm package in future
	const originalRunCall = evm.runCall.bind(evm)
	evm.runCall = async (...args) => {
		if (
			stateManager instanceof NormalStateManager ||
			stateManager instanceof ForkStateManager
		) {
			return originalRunCall(...args)
		}
		const proxyStateManager = stateManager
		proxyStateManager.lock()
		try {
			const res = await originalRunCall(...args)
			return res
		} finally {
			proxyStateManager.unlock()
		}
	}

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
	 * @type {import('./MemoryClient.js').MemoryClient}
	 */
	const tevm = {
		mode: options.fork?.url ? 'fork' : options.proxy?.url ? 'proxy' : 'normal',

		_evm: evm,
		_vm: vm,
		// we currently don't want to proxy any requests
		// because this causes confusing behavior with tevm
		// that we want to avoid or abstract away before enabling
		// This means tevm will throw an error on all non natively supported
		// requests
		request: requestProcedure(vm),
		requestBulk: requestBulkProcedure(vm),
		script: scriptHandler(vm),
		getAccount: getAccountHandler(evm),
		setAccount: setAccountHandler(evm),
		call: callHandler(vm),
		contract: contractHandler(vm),
		dumpState: dumpStateHandler(evm.stateManager),
		loadState: loadStateHandler(evm.stateManager),
		accounts: testAccounts,
		eth: {
			blockNumber: blockNumberHandler(blockchain),
			call: ethCallHandler(vm),
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

	// add custom predeploys
	await Promise.all(
		options.customPredeploys?.map((predeploy) => {
			tevm.setAccount({
				address: predeploy.address,
				deployedBytecode: predeploy.contract.deployedBytecode,
			})
		}) || [],
	)

	// add test accounts
	await Promise.all(
		testAccounts.map((account) => {
			return tevm.setAccount({
				balance: parseEther('1000'),
				address: account.address,
			})
		}),
	)

	return tevm
}

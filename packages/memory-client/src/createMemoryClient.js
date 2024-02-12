import { WrappedEvm } from './WrappedEvm.js'
import { Block } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import { Common, Hardfork } from '@ethereumjs/common'
import { genesisStateRoot } from '@ethereumjs/trie'
import { MapDB } from '@ethereumjs/util'
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
import { TevmVm } from '@tevm/vm'
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
	} else if (options.proxy?.url) {
		stateManager = new ProxyStateManager({ url: options.proxy.url })
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

	const vm = await TevmVm.create({
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

	// TODO move me to the @tevm/evm package
	// We need to make sure that we lock the state manager when a call is ran
	// Ideally we move and unit test logic like this to a new @tevm/evm package in future
	const originalRunCall = vm.evm.runCall.bind(vm.evm)
	vm.evm.runCall = async (...args) => {
		if (
			vm.stateManager instanceof NormalStateManager ||
			vm.stateManager instanceof ForkStateManager
		) {
			return originalRunCall(...args)
		}
		if (!(vm.stateManager instanceof ProxyStateManager)) {
			throw new Error('Unknown state manager')
		}
		await vm.stateManager.lock()
		try {
			const res = await originalRunCall(...args)
			return res
		} finally {
			await vm.stateManager.unlock()
		}
	}

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

	/**
	 * @type {import('./MemoryClient.js').MemoryClient}
	 */
	const tevm = {
		mode: options.fork?.url ? 'fork' : options.proxy?.url ? 'proxy' : 'normal',
		_vm: vm,
		// we currently don't want to proxy any requests
		// because this causes confusing behavior with tevm
		// that we want to avoid or abstract away before enabling
		// This means tevm will throw an error on all non natively supported
		// requests
		request: requestProcedure(vm),
		requestBulk: requestBulkProcedure(vm),
		script: scriptHandler(vm),
		getAccount: getAccountHandler(vm),
		setAccount: setAccountHandler(vm),
		call: callHandler(vm),
		contract: contractHandler(vm),
		dumpState: dumpStateHandler(vm),
		loadState: loadStateHandler(vm),
		accounts: testAccounts,
		eth: {
			blockNumber: blockNumberHandler(vm),
			call: ethCallHandler(vm),
			chainId: chainIdHandler(chainId),
			gasPrice: gasPriceHandler({
				forkUrl: options.fork?.url,
				vm,
			}),
			getBalance: getBalanceHandler({
				forkUrl: options.fork?.url,
				vm,
			}),
			getCode: getCodeHandler({
				vm,
				forkUrl: options.fork?.url,
			}),
			getStorageAt: getStorageAtHandler({
				vm,
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

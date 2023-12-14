import { createHttpHandler as _createHttpHandler } from './jsonrpc/createHttpHandler.js'
import { createJsonrpcClient as _createJsonrpcClient } from './jsonrpc/createJsonrpcClient.js'
import {
	putAccountHandler,
	putContractCodeHandler,
	runCallHandler,
	runContractCallHandler,
	runScriptHandler,
} from './jsonrpc/index.js'
import { ViemStateManager } from './stateManager/ViemStateManager.js'
import { Common, Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { createPublicClient, http } from 'viem'

/**
 * A local EVM instance running in JavaScript. Similar to Anvil in your browser
 * @param {import('./Tevm.js').CreateEVMOptions} [options]
 * @returns {Promise<import('./Tevm.js').Tevm>}
 * @example
 * ```ts
 * import { Tevm } from "tevm"
 * import { createPublicClient, http } from "viem"
 * import { MyERC721 } from './MyERC721.sol'
 *
 * const tevm = Tevm.create({
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
export const createTevm = async (options = {}) => {
	const { EVM: _EVM } = await import('@ethereumjs/evm')

	/**
	 * @type {DefaultStateManager | ViemStateManager}
	 */
	let stateManager
	// ethereumjs throws an error for most chain ids
	if (options.fork?.url) {
		const client = createPublicClient({
			transport: http(options.fork.url),
		})
		const blockTag = options.fork.blockTag ?? (await client.getBlockNumber())
		stateManager = new ViemStateManager({ client, blockTag })
	} else {
		stateManager = new DefaultStateManager()
	}

	const chainId = 1
	const hardfork = Hardfork.Shanghai
	const common = new Common({ chain: chainId, hardfork })

	const evm = new _EVM({
		common,
		stateManager,
		// blockchain, // Always running the EVM statelessly so not including blockchain
		allowUnlimitedContractSize: false,
		allowUnlimitedInitCodeSize: false,
		customOpcodes: [],
		// TODO uncomment the mapping once we make the api correct
		customPrecompiles: options.customPrecompiles ?? [], // : customPrecompiles.map(p => ({ ...p, address: new EthjsAddress(hexToBytes(p.address)) })),
		profiler: {
			enabled: false,
		},
	})

	/**
	 * @type {import('./Tevm.js').Tevm['request']}
	 */
	const request = (request) => {
		return createJsonrpcClient()(request)
	}

	/**
	 * @type {import('./Tevm.js').Tevm['createJsonrpcClient']}
	 */
	const createJsonrpcClient = () => {
		return _createJsonrpcClient(tevm)
	}

	/**
	 * @type {import('./Tevm.js').Tevm['createHttpHandler']}
	 */
	const createHttpHandler = () => {
		return _createHttpHandler(tevm)
	}

	/**
	 * Runs a script or contract that is not deployed to the chain
	 * The recomended way to use a script is with an Tevm import
	 * @type {import('./Tevm.js').Tevm['runScript']}
	 * @example
	 * ```ts
	 * // Scripts require bytecode
	 * import { MyContractOrScript } from './MyContractOrScript.sol' with {
	 *   tevm: 'bytecode'
	 * }
	 * tevm.runScript(
	 *   MyContractOrScript.script.run()
	 * )
	 * ```
	 * Scripts can also be called directly via passing in args
	 * @example
	 * ```ts
	 * tevm.runScript({
	 *   bytecode,
	 *   abi,
	 *   functionName: 'run',
	 * })
	 * ```
	 */
	const runScript = async (action) => {
		return runScriptHandler(tevm, action)
	}

	/**
	 * Puts an account with ether balance into the state
	 * @type {import('./Tevm.js').Tevm['putAccount']}
	 * @example
	 * ```ts
	 * tevm.putAccount({
	 * 	address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
	 * 	balance: 100n,
	 * })
	 * ```
	 */
	const putAccount = async (action) => {
		return putAccountHandler(tevm, action)
	}

	/**
	 * Puts a contract into the state
	 * @type {import('./Tevm.js').Tevm['putContractCode']}
	 * @example
	 * ```ts
	 * tevm.putContract({
	 *  bytecode,
	 *  contractAddress,
	 * })
	 * ```
	 */
	const putContractCode = async (action) => {
		return putContractCodeHandler(tevm, action)
	}

	/**
	 * Executes a call on the EVM
	 * @type {import('./Tevm.js').Tevm['runCall']}
	 * @example
	 * ```ts
	 * const result = await tevm.runCall({
	 *   data: '0x...',
	 *   caller: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
	 *   gasLimit: 1000000n,
	 *   value: 10000000000000000n,
	 * })
	 * ```
	 */
	const runCall = async (action) => {
		return runCallHandler(tevm, action)
	}

	/**
	 * Calls contract code using an ABI and returns the decoded result
	 * @type {import('./Tevm.js').Tevm['runContractCall']}
	 * @example
	 * ```ts
	 * const result = await tevm.runContractCall({
	 *  abi: MyContract.abi,
	 *  contractAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
	 *  functionName: 'balanceOf',
	 *  args: ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'],
	 * })
	 * ```
	 */
	const runContractCall = async (action) => {
		return runContractCallHandler(tevm, action)
	}

	const tevm = {
		_evm: evm,
		request,
		createJsonrpcClient,
		createHttpHandler,
		runScript,
		putAccount,
		putContractCode,
		runCall,
		runContractCall,
	}

	return tevm
}

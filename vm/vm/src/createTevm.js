import { Common, Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import {
	putAccountHandler,
	putContractCodeHandler,
	runCallHandler,
	runContractCallHandler,
	runScriptHandler,
} from '@tevm/action-handlers'
import {
	createHttpHandler as _createHttpHandler,
	createJsonRpcClient as _createJsonrpcClient,
} from '@tevm/jsonrpc'
import { TevmStateManager } from '@tevm/state'
import { http, createPublicClient } from 'viem'

/**
 * A local EVM instance running in JavaScript. Similar to Anvil in your browser
 * @param {import('./CreateEVMOptions.js').CreateEVMOptions} [options]
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
	/**
	 * @type {DefaultStateManager | TevmStateManager}
	 */
	let stateManager
	// ethereumjs throws an error for most chain ids
	if (options.fork?.url) {
		const client = createPublicClient({
			transport: http(options.fork.url),
		})
		const blockTag = options.fork.blockTag ?? (await client.getBlockNumber())
		stateManager = new TevmStateManager({ client, blockTag })
	} else {
		stateManager = new TevmStateManager()
	}

	const chainId = 1
	const hardfork = Hardfork.Shanghai
	const common = new Common({ chain: chainId, hardfork })

	const evm = new TevmEvm({
		common,
		stateManager,
		// blockchain, // Always running the EVM statelessly so not including blockchain
		allowUnlimitedContractSize: options.allowUnlimitedContractSize ?? false,
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
		return createJsonRpcClient()(request)
	}

	/**
	 * @type {import('./Tevm.js').Tevm['createJsonRpcClient']}
	 */
	const createJsonRpcClient = () => {
		return _createJsonrpcClient(tevm._evm)
	}

	/**
	 * @type {import('./Tevm.js').Tevm['createHttpHandler']}
	 */
	const createHttpHandler = () => {
		if (tevm.forkUrl) {
			return _createHttpHandler({ evm: tevm._evm, forkUrl: tevm.forkUrl })
		} else {
			return _createHttpHandler({ evm: tevm._evm })
		}
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
		return runScriptHandler(tevm._evm, action)
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
		return putAccountHandler(tevm._evm, action)
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
		return putContractCodeHandler(tevm._evm, action)
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
		return runCallHandler(tevm._evm, action)
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
		return runContractCallHandler(tevm._evm, action)
	}

	/**
	 * @type {import('./Tevm.js').Tevm}
	 */
	const tevm = {
		_evm: evm,
		request,
		createJsonRpcClient,
		createHttpHandler,
		runScript,
		putAccount,
		putContractCode,
		runCall,
		runContractCall,
		...(options.fork?.url
			? { forkUrl: options.fork.url }
			: { forkUrl: options.fork?.url }),
	}

	await Promise.all(
		options.customPredeploys?.map((predeploy) => {
			putContractCodeHandler(tevm._evm, {
				contractAddress: predeploy.address,
				deployedBytecode: predeploy.contract.deployedBytecode,
			})
		}) || [],
	)

	return tevm
}

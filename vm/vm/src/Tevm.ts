import type { EVMResult } from '@ethereumjs/evm'
import type { Account } from '@ethereumjs/util'
import type { Abi } from 'abitype'
import type { RunContractCallAction } from './actions/contractCall/RunContractCallAction.js'
import type { RunContractCallResult } from './actions/contractCall/RunContractCallResult.js'
import type { PutAccountAction } from './actions/putAccount/PutAccountAction.js'
import type { PutContractCodeAction } from './actions/putContractCode/PutContractCodeAction.js'
import type { RunCallAction } from './actions/runCall/RunCallAction.js'
import type { RunScriptAction } from './actions/runScript/RunScriptAction.js'
import type { RunScriptResult } from './actions/runScript/RunScriptResult.js'
import type { TevmJsonRpcRequest } from './jsonrpc/TevmJsonRpcRequest.js'
import { createHttpHandler } from './jsonrpc/createHttpHandler.js'
import {
	type BackendReturnType,
	type JsonRpcClient,
} from './jsonrpc/createJsonRpcClient.js'

/**
 * Options fetch state that isn't available locally.
 */
type ForkOptions = {
	/**
	 * A viem PublicClient to use for the EVM.
	 * It will be used to fetch state that isn't available locally.
	 */
	url: string
	/**
	 * The block tag to use for the EVM.
	 * If not passed it will start from the latest
	 * block at the time of forking
	 */
	blockTag?: bigint
}

/**
 * Options for creating an Tevm instance
 */
export type CreateEVMOptions = {
	fork?: ForkOptions
	customPrecompiles?: CustomPrecompile[]
}

/**
 * Infers the the first argument of a class
 */
type ConstructorArgument<T> = T extends new (
	...args: infer P
) => any
	? P[0]
	: never

/**
 * TODO This should be publically exported from ethereumjs but isn't
 * Typing this by hand is tedious so we are using some typescript inference to get it
 * do a pr to export this from ethereumjs and then replace this with an import
 * TODO this should be modified to take a hex address rather than an ethjs address to be consistent with rest of Tevm
 */
export type CustomPrecompile = Exclude<
	Exclude<
		ConstructorArgument<typeof import('@ethereumjs/evm').EVM>,
		undefined
	>['customPrecompiles'],
	undefined
>[number]

/**
 * A local EVM instance running in JavaScript. Similar to Anvil in your browser
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
export type Tevm = {
	/**
	 * Internal instance of the EVM. Can be used for lower level operations
	 * but is not guaranteed to stay stable between versions
	 */
	readonly _evm: import('@ethereumjs/evm').EVM

	/**
	 * Executes a jsonrpc request
	 */
	readonly request: <TRequest extends TevmJsonRpcRequest>(
		request: TRequest,
	) => Promise<BackendReturnType<TRequest>>
	/**
	 * Creates a jsonrpc client
	 */
	readonly createJsonrpcClient: () => JsonRpcClient
	/**
	 * Creates a httpHandler that can be used with node http server
	 */
	readonly createHttpHandler: () => ReturnType<typeof createHttpHandler>
	/**
	 * Runs a script or contract that is not deployed to the chain
	 * The recomended way to use a script is with an Tevm import
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
	readonly runScript: <
		TAbi extends Abi | readonly unknown[] = Abi,
		TFunctionName extends string = string,
	>(
		action: RunScriptAction<TAbi, TFunctionName>,
	) => Promise<RunScriptResult<TAbi, TFunctionName>>

	/**
	 * Puts an account with ether balance into the state
	 * @example
	 * ```ts
	 * tevm.putAccount({
	 * 	address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
	 * 	balance: 100n,
	 * })
	 * ```
	 */
	readonly putAccount: (action: PutAccountAction) => Promise<Account>

	/**
	 * Puts a contract into the state
	 * @example
	 * ```ts
	 * tevm.putContract({
	 *  bytecode,
	 *  contractAddress,
	 * })
	 * ```
	 */
	readonly putContractCode: (
		action: PutContractCodeAction,
	) => Promise<Uint8Array>

	/**
	 * Executes a call on the EVM
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
	readonly runCall: (action: RunCallAction) => Promise<EVMResult>

	/**
	 * Calls contract code using an ABI and returns the decoded result
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
	readonly runContractCall: <
		TAbi extends Abi | readonly unknown[] = Abi,
		TFunctionName extends string = string,
	>(
		action: RunContractCallAction<TAbi, TFunctionName>,
	) => Promise<RunContractCallResult<TAbi, TFunctionName>>
}

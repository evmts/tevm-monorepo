import type { EVMResult } from '@ethereumjs/evm'
import type { Account } from '@ethereumjs/util'
import type {
	PutAccountAction,
	PutContractCodeAction,
	RunCallAction,
	RunContractCallAction,
	RunContractCallResponse,
	RunScriptAction,
	RunScriptResponse,
} from '@tevm/actions'
import type {
	BackendReturnType,
	JsonRpcClient,
	TevmJsonRpcRequest,
	createHttpHandler,
} from '@tevm/jsonrpc'
import type { Abi } from 'abitype'

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
	 * Fork url if the EVM is forked
	 */
	readonly forkUrl?: string | undefined
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
	readonly createJsonRpcClient: () => JsonRpcClient
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
	) => Promise<RunScriptResponse<TAbi, TFunctionName>>

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
	) => Promise<RunContractCallResponse<TAbi, TFunctionName>>
}

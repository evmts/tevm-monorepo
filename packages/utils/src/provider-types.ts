/**
 * Native provider types (migrated from viem)
 *
 * These types provide compatibility for fork client operations and transport definitions.
 * They are designed to be compatible with viem's types while reducing direct viem dependencies.
 *
 * @module provider-types
 */

import type { Abi } from './abitype.js'
import type { Address, Hex } from './abitype.js'
import type { ContractEventName as ContractEventNameFromContract } from './contract-types.js'

/**
 * EIP-1193 request function type.
 *
 * A generic function type for making JSON-RPC requests that follows the EIP-1193 specification.
 * This is the core interface for provider communication.
 *
 * @template TRpcSchema - Optional RPC schema for type-safe method calls
 * @example
 * ```typescript
 * const request: EIP1193RequestFn = async ({ method, params }) => {
 *   return await fetch('/rpc', {
 *     method: 'POST',
 *     body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
 *   }).then(r => r.json()).then(r => r.result)
 * }
 *
 * const blockNumber = await request({ method: 'eth_blockNumber' })
 * ```
 */
export type EIP1193RequestFn<TRpcSchema extends readonly unknown[] | undefined = undefined> = <
	TMethod extends string = string,
>(
	args: {
		method: TMethod
		params?: readonly unknown[] | undefined
	},
	options?: { retryCount?: number; retryDelay?: number },
) => Promise<TRpcSchema extends readonly unknown[] ? unknown : unknown>

/**
 * Transport configuration object.
 *
 * Configuration for a viem-compatible transport including request function,
 * retry settings, and transport metadata.
 *
 * @template TType - The transport type identifier (e.g., 'http', 'webSocket', 'custom')
 * @template TEip1193RequestFn - The request function type
 */
export type TransportConfig<
	TType extends string = string,
	TEip1193RequestFn extends EIP1193RequestFn = EIP1193RequestFn,
> = {
	/** The name of the transport */
	name: string
	/** The key of the transport */
	key: string
	/** Methods to include or exclude from executing RPC requests */
	methods?:
		| { include?: string[] | undefined }
		| { exclude?: string[] | undefined }
		| undefined
	/** The JSON-RPC request function that matches the EIP-1193 request spec */
	request: TEip1193RequestFn
	/** The base delay (in ms) between retries */
	retryDelay?: number | undefined
	/** The max number of times to retry */
	retryCount?: number | undefined
	/** The timeout (in ms) for requests */
	timeout?: number | undefined
	/** The type of the transport */
	type: TType
}

/**
 * Transport type.
 *
 * A factory function that creates transport configurations for clients.
 * Used with createPublicClient and other client creation functions.
 *
 * @template TType - The transport type identifier
 * @template TRpcAttributes - Additional transport attributes
 * @template TEip1193RequestFn - The request function type
 * @example
 * ```typescript
 * import { http, createPublicClient } from '@tevm/utils'
 *
 * const client = createPublicClient({
 *   transport: http('https://mainnet.infura.io/v3/your-key'),
 * })
 * ```
 */
export type Transport<
	TType extends string = string,
	TRpcAttributes = Record<string, any>,
	TEip1193RequestFn extends EIP1193RequestFn = EIP1193RequestFn,
> = <TChain extends { id: number; name: string } | undefined = undefined>(options?: {
	chain?: TChain | undefined
	pollingInterval?: number | undefined
	retryCount?: number | undefined
	timeout?: number | undefined
}) => {
	config: TransportConfig<TType>
	request: TEip1193RequestFn
	value?: TRpcAttributes | undefined
}

/**
 * Public client interface.
 *
 * A client for interacting with public JSON-RPC API methods such as
 * retrieving block numbers, transactions, and reading from smart contracts.
 *
 * @template TTransport - The transport type
 * @template TChain - The chain type
 * @example
 * ```typescript
 * import { createPublicClient, http } from '@tevm/utils'
 *
 * const client = createPublicClient({
 *   transport: http('https://mainnet.infura.io/v3/your-key'),
 * })
 *
 * const blockNumber = await client.getBlockNumber()
 * ```
 */
export type PublicClient<
	TTransport extends Transport = Transport,
	TChain extends { id: number; name: string } | undefined = undefined,
> = {
	/** The transport used by the client */
	transport: ReturnType<TTransport>
	/** Make an EIP-1193 request */
	request: EIP1193RequestFn
	/** The chain the client is connected to */
	chain: TChain
	/** Get the current block number */
	getBlockNumber: () => Promise<bigint>
	/** Get a block by number or hash */
	getBlock: (params?: { blockNumber?: bigint; blockHash?: Hex }) => Promise<unknown>
	/** Get the balance of an address */
	getBalance: (params: { address: Address }) => Promise<bigint>
	/** Get transaction count (nonce) for an address */
	getTransactionCount: (params: { address: Address }) => Promise<number>
	/** Get transaction by hash */
	getTransaction: (params: { hash: Hex }) => Promise<unknown>
	/** Get transaction receipt */
	getTransactionReceipt: (params: { hash: Hex }) => Promise<unknown>
	/** Get logs matching a filter */
	getLogs: (params?: unknown) => Promise<unknown[]>
	/** Get code at an address */
	getCode: (params: { address: Address }) => Promise<Hex | undefined>
	/** Get storage at an address and slot */
	getStorageAt: (params: { address: Address; slot: Hex }) => Promise<Hex>
	/** Estimate gas for a call */
	estimateGas: (params: unknown) => Promise<bigint>
	/** Execute a call without creating a transaction */
	call: (params: unknown) => Promise<{ data?: Hex }>
	/** Multicall - batch multiple calls */
	multicall?: (params: unknown) => Promise<unknown[]>
	/** Read from a contract */
	readContract: (params: unknown) => Promise<unknown>
	/** Watch for new blocks */
	watchBlocks?: (params: unknown) => () => void
	/** Watch for pending transactions */
	watchPendingTransactions?: (params: unknown) => () => void
	/** Create a block filter */
	createBlockFilter?: () => Promise<unknown>
	/** Create a pending transaction filter */
	createPendingTransactionFilter?: () => Promise<unknown>
	/** Uninstall a filter */
	uninstallFilter?: (params: { filter: unknown }) => Promise<boolean>
	/** Get filter changes */
	getFilterChanges?: (params: { filter: unknown }) => Promise<unknown[]>
	/** Get filter logs */
	getFilterLogs?: (params: { filter: unknown }) => Promise<unknown[]>
	/** Additional properties for extensibility */
	[key: string]: unknown
}

/**
 * Contract event name type.
 *
 * Extracts the event names from an ABI type.
 * Re-exported from contract-types.js for backward compatibility.
 *
 * @template TAbi - The ABI type
 */
export type ContractEventName<TAbi extends Abi | readonly unknown[] = Abi> = ContractEventNameFromContract<TAbi>

/**
 * Contract event args type.
 *
 * Extracts the argument types from an event in an ABI.
 *
 * @template TAbi - The ABI type
 * @template TEventName - The event name
 */
export type ContractEventArgs<
	TAbi extends Abi | readonly unknown[] = Abi,
	TEventName extends ContractEventName<TAbi> = ContractEventName<TAbi>,
> = TAbi extends Abi
	? {
			[K in keyof TAbi]: TAbi[K] extends { type: 'event'; name: TEventName }
				? TAbi[K] extends { inputs: infer TInputs }
					? TInputs extends readonly { name: string; type: string }[]
						? { [I in keyof TInputs as TInputs[I] extends { name: infer N } ? N & string : never]?: unknown }
						: Record<string, unknown>
					: Record<string, unknown>
				: never
		}[number]
	: Record<string, unknown>

/**
 * Parameters for encoding event topics.
 *
 * Used with encodeEventTopics to encode event arguments into topics for log filtering.
 *
 * @template TAbi - The ABI type
 * @template TEventName - The event name
 * @example
 * ```typescript
 * import { encodeEventTopics } from '@tevm/utils'
 *
 * const topics = encodeEventTopics({
 *   abi: contractAbi,
 *   eventName: 'Transfer',
 *   args: { from: '0x123...', to: '0x456...' },
 * })
 * ```
 */
export type EncodeEventTopicsParameters<
	TAbi extends Abi | readonly unknown[] = Abi,
	TEventName extends ContractEventName<TAbi> | undefined = ContractEventName<TAbi>,
> = {
	/** The contract ABI */
	abi: TAbi
	/** Arguments to encode as topics */
	args?: ContractEventArgs<TAbi, TEventName extends ContractEventName<TAbi> ? TEventName : ContractEventName<TAbi>> | undefined
	/** The event name to encode */
	eventName?: TEventName | ContractEventName<TAbi> | undefined
}

/**
 * EIP-1193 request parameters.
 *
 * Represents the parameters for an EIP-1193 JSON-RPC request.
 * This is a generic type that extracts method/params from a schema type.
 *
 * @template TRpcSchema - The RPC schema type (array of method definitions)
 * @example
 * ```typescript
 * import type { EIP1193Parameters, EIP1474Methods } from '@tevm/utils'
 *
 * const params: EIP1193Parameters<EIP1474Methods> = {
 *   method: 'eth_getBalance',
 *   params: ['0x...', 'latest']
 * }
 * ```
 */
export type EIP1193Parameters<TRpcSchema extends readonly unknown[] = readonly unknown[]> = {
	method: TRpcSchema extends readonly { Method: infer M }[] ? M : string
	params?: readonly unknown[]
}

/**
 * EIP-1474 standard Ethereum JSON-RPC method definitions.
 *
 * This type represents the standard Ethereum JSON-RPC methods as defined
 * in EIP-1474. Each entry defines the method name, parameters, and return type.
 *
 * @example
 * ```typescript
 * import type { EIP1474Methods, EIP1193Parameters } from '@tevm/utils'
 *
 * // Type-safe method parameters
 * const getBalance: EIP1193Parameters<EIP1474Methods> = {
 *   method: 'eth_getBalance',
 *   params: ['0x...', 'latest']
 * }
 * ```
 */
export type EIP1474Methods = readonly [
	{
		Method: 'eth_accounts'
		Parameters?: undefined
		ReturnType: readonly Address[]
	},
	{
		Method: 'eth_blobBaseFee'
		Parameters?: undefined
		ReturnType: Hex
	},
	{
		Method: 'eth_blockNumber'
		Parameters?: undefined
		ReturnType: Hex
	},
	{
		Method: 'eth_call'
		Parameters: readonly [transaction: unknown, block?: unknown]
		ReturnType: Hex
	},
	{
		Method: 'eth_chainId'
		Parameters?: undefined
		ReturnType: Hex
	},
	{
		Method: 'eth_coinbase'
		Parameters?: undefined
		ReturnType: Address
	},
	{
		Method: 'eth_createAccessList'
		Parameters: readonly [transaction: unknown, block?: unknown]
		ReturnType: unknown
	},
	{
		Method: 'eth_estimateGas'
		Parameters: readonly [transaction: unknown, block?: unknown]
		ReturnType: Hex
	},
	{
		Method: 'eth_feeHistory'
		Parameters: readonly [blockCount: Hex, newestBlock: unknown, rewardPercentiles?: readonly number[]]
		ReturnType: unknown
	},
	{
		Method: 'eth_gasPrice'
		Parameters?: undefined
		ReturnType: Hex
	},
	{
		Method: 'eth_getBalance'
		Parameters: readonly [address: Address, block?: unknown]
		ReturnType: Hex
	},
	{
		Method: 'eth_getBlockByHash'
		Parameters: readonly [hash: Hex, includeTransactions?: boolean]
		ReturnType: unknown
	},
	{
		Method: 'eth_getBlockByNumber'
		Parameters: readonly [block: unknown, includeTransactions?: boolean]
		ReturnType: unknown
	},
	{
		Method: 'eth_getBlockTransactionCountByHash'
		Parameters: readonly [hash: Hex]
		ReturnType: Hex
	},
	{
		Method: 'eth_getBlockTransactionCountByNumber'
		Parameters: readonly [block: unknown]
		ReturnType: Hex
	},
	{
		Method: 'eth_getCode'
		Parameters: readonly [address: Address, block?: unknown]
		ReturnType: Hex
	},
	{
		Method: 'eth_getFilterChanges'
		Parameters: readonly [filterId: Hex]
		ReturnType: readonly unknown[]
	},
	{
		Method: 'eth_getFilterLogs'
		Parameters: readonly [filterId: Hex]
		ReturnType: readonly unknown[]
	},
	{
		Method: 'eth_getLogs'
		Parameters: readonly [filter: unknown]
		ReturnType: readonly unknown[]
	},
	{
		Method: 'eth_getProof'
		Parameters: readonly [address: Address, storageKeys: readonly Hex[], block?: unknown]
		ReturnType: unknown
	},
	{
		Method: 'eth_getStorageAt'
		Parameters: readonly [address: Address, slot: Hex, block?: unknown]
		ReturnType: Hex
	},
	{
		Method: 'eth_getTransactionByBlockHashAndIndex'
		Parameters: readonly [hash: Hex, index: Hex]
		ReturnType: unknown
	},
	{
		Method: 'eth_getTransactionByBlockNumberAndIndex'
		Parameters: readonly [block: unknown, index: Hex]
		ReturnType: unknown
	},
	{
		Method: 'eth_getTransactionByHash'
		Parameters: readonly [hash: Hex]
		ReturnType: unknown
	},
	{
		Method: 'eth_getTransactionCount'
		Parameters: readonly [address: Address, block?: unknown]
		ReturnType: Hex
	},
	{
		Method: 'eth_getTransactionReceipt'
		Parameters: readonly [hash: Hex]
		ReturnType: unknown
	},
	{
		Method: 'eth_getUncleByBlockHashAndIndex'
		Parameters: readonly [hash: Hex, index: Hex]
		ReturnType: unknown
	},
	{
		Method: 'eth_getUncleByBlockNumberAndIndex'
		Parameters: readonly [block: unknown, index: Hex]
		ReturnType: unknown
	},
	{
		Method: 'eth_getUncleCountByBlockHash'
		Parameters: readonly [hash: Hex]
		ReturnType: Hex
	},
	{
		Method: 'eth_getUncleCountByBlockNumber'
		Parameters: readonly [block: unknown]
		ReturnType: Hex
	},
	{
		Method: 'eth_maxPriorityFeePerGas'
		Parameters?: undefined
		ReturnType: Hex
	},
	{
		Method: 'eth_newBlockFilter'
		Parameters?: undefined
		ReturnType: Hex
	},
	{
		Method: 'eth_newFilter'
		Parameters: readonly [filter: unknown]
		ReturnType: Hex
	},
	{
		Method: 'eth_newPendingTransactionFilter'
		Parameters?: undefined
		ReturnType: Hex
	},
	{
		Method: 'eth_protocolVersion'
		Parameters?: undefined
		ReturnType: string
	},
	{
		Method: 'eth_sendRawTransaction'
		Parameters: readonly [signedTransaction: Hex]
		ReturnType: Hex
	},
	{
		Method: 'eth_sendTransaction'
		Parameters: readonly [transaction: unknown]
		ReturnType: Hex
	},
	{
		Method: 'eth_sign'
		Parameters: readonly [address: Address, data: Hex]
		ReturnType: Hex
	},
	{
		Method: 'eth_signTransaction'
		Parameters: readonly [transaction: unknown]
		ReturnType: Hex
	},
	{
		Method: 'eth_simulateV1'
		Parameters: readonly [payload: unknown, block?: unknown]
		ReturnType: unknown
	},
	{
		Method: 'eth_syncing'
		Parameters?: undefined
		ReturnType: boolean | unknown
	},
	{
		Method: 'eth_uninstallFilter'
		Parameters: readonly [filterId: Hex]
		ReturnType: boolean
	},
	// EIP-4337 (Account Abstraction) methods
	{
		Method: 'eth_estimateUserOperationGas'
		Parameters: readonly [userOperation: unknown, entryPoint: Address]
		ReturnType: unknown
	},
	{
		Method: 'eth_getUserOperationByHash'
		Parameters: readonly [hash: Hex]
		ReturnType: unknown
	},
	{
		Method: 'eth_getUserOperationReceipt'
		Parameters: readonly [hash: Hex]
		ReturnType: unknown
	},
	{
		Method: 'eth_sendUserOperation'
		Parameters: readonly [userOperation: unknown, entryPoint: Address]
		ReturnType: Hex
	},
	{
		Method: 'eth_supportedEntryPoints'
		Parameters?: undefined
		ReturnType: readonly Address[]
	},
]

/**
 * RPC schema type.
 *
 * A type alias representing an array of RPC method definitions.
 * Used as a constraint for generic type parameters in client configurations.
 * Compatible with viem's RpcSchema type.
 *
 * @example
 * ```typescript
 * import type { RpcSchema, EIP1474Methods } from '@tevm/utils'
 *
 * // Custom client with typed RPC schema
 * type MyClient<TRpcSchema extends RpcSchema | undefined = EIP1474Methods> = {
 *   request: EIP1193RequestFn<TRpcSchema>
 * }
 * ```
 */
export type RpcSchema = readonly unknown[]

/**
 * Client configuration type.
 *
 * Configuration options for creating a viem-compatible client.
 * This type covers the most commonly used configuration options.
 *
 * @template TTransport - The transport type
 * @template TChain - The chain type
 * @template TAccountOrAddress - The account or address type
 * @template TRpcSchema - The RPC schema type
 * @example
 * ```typescript
 * import type { ClientConfig } from '@tevm/utils'
 *
 * const config: ClientConfig = {
 *   transport: http('https://mainnet.infura.io/v3/your-key'),
 *   key: 'my-client',
 *   name: 'My Client',
 *   pollingInterval: 4000,
 *   cacheTime: 10000,
 * }
 * ```
 */
export type ClientConfig<
	TTransport extends Transport = Transport,
	TChain extends { id: number; name: string } | undefined = { id: number; name: string } | undefined,
	TAccountOrAddress extends { address: Address } | Address | undefined = { address: Address } | Address | undefined,
	TRpcSchema extends RpcSchema | undefined = RpcSchema | undefined,
> = {
	/** The Account to use for the Client. This will be used for Actions that require an account as an argument. */
	account?: TAccountOrAddress | undefined
	/** Flags for batch settings. */
	batch?:
		| {
				/** Toggle to enable `eth_call` multicall aggregation. */
				multicall?: boolean | { batchSize?: number; wait?: number } | undefined
		  }
		| undefined
	/** Time (in ms) that cached data will remain in memory. */
	cacheTime?: number | undefined
	/** Chain for the client. */
	chain?: TChain | undefined
	/** A key for the client. */
	key?: string | undefined
	/** A name for the client. */
	name?: string | undefined
	/** Frequency (in ms) for polling enabled actions & events. */
	pollingInterval?: number | undefined
	/** Typed JSON-RPC schema for the client. */
	rpcSchema?: TRpcSchema | undefined
	/** The RPC transport */
	transport: TTransport
	/** The type of client. */
	type?: string | undefined
}

/**
 * Client type.
 *
 * A viem-compatible client interface for making JSON-RPC requests.
 * Provides access to the transport, chain, account, and request function.
 *
 * @template TTransport - The transport type
 * @template TChain - The chain type
 * @template TAccount - The account type
 * @template TRpcSchema - The RPC schema type
 * @example
 * ```typescript
 * import type { Client } from '@tevm/utils'
 *
 * async function getBalance(client: Client, address: Address) {
 *   return await client.request({
 *     method: 'eth_getBalance',
 *     params: [address, 'latest'],
 *   })
 * }
 * ```
 */
export type Client<
	TTransport extends Transport = Transport,
	TChain extends { id: number; name: string } | undefined = { id: number; name: string } | undefined,
	TAccount extends { address: Address } | undefined = { address: Address } | undefined,
	TRpcSchema extends RpcSchema | undefined = RpcSchema | undefined,
> = {
	/** The Account of the Client. */
	account: TAccount
	/** Flags for batch settings. */
	batch?: ClientConfig['batch'] | undefined
	/** Time (in ms) that cached data will remain in memory. */
	cacheTime: number
	/** Chain for the client. */
	chain: TChain
	/** A key for the client. */
	key: string
	/** A name for the client. */
	name: string
	/** Frequency (in ms) for polling enabled actions & events. */
	pollingInterval: number
	/** Request function wrapped with friendly error handling */
	request: EIP1193RequestFn<TRpcSchema extends undefined ? EIP1474Methods : TRpcSchema>
	/** The RPC transport */
	transport: ReturnType<TTransport>
	/** The type of client. */
	type: string
	/** A unique ID for the client. */
	uid: string
	/** Extend the client with additional functionality */
	extend: <TExtended extends Record<string, unknown>>(
		fn: (client: Client<TTransport, TChain, TAccount, TRpcSchema>) => TExtended,
	) => Client<TTransport, TChain, TAccount, TRpcSchema> & TExtended
}

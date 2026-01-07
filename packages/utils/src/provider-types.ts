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

/**
 * Test actions type.
 *
 * An interface for test client actions like those provided by Anvil, Hardhat, or Tevm.
 * Includes methods for manipulating blockchain state during testing.
 *
 * This is a simplified version compatible with viem's TestActions type.
 *
 * @example
 * ```typescript
 * import type { TestActions, MemoryClient } from '@tevm/utils'
 *
 * const client: MemoryClient & TestActions = createMemoryClient().extend(testActions({ mode: 'anvil' }))
 * await client.mine({ blocks: 1 })
 * await client.setBalance({ address: '0x...', value: 1000000000000000000n })
 * ```
 */
export type TestActions = {
	/** Removes a transaction from the mempool */
	dropTransaction: (args: { hash: Hex }) => Promise<void>
	/** Serializes the current state into a savable data blob */
	dumpState: () => Promise<Hex>
	/** Returns the automatic mining status of the node */
	getAutomine: () => Promise<boolean>
	/** Returns the details of all transactions currently pending */
	getTxpoolContent: () => Promise<unknown>
	/** Returns a summary of all pending transactions */
	getTxpoolStatus: () => Promise<{ pending: number; queued: number }>
	/** Impersonate an account or contract address */
	impersonateAccount: (args: { address: Address }) => Promise<void>
	/** Jump forward in time by the given amount of seconds */
	increaseTime: (args: { seconds: number }) => Promise<Hex>
	/** Returns a summary of all pending transactions for inspection */
	inspectTxpool: () => Promise<unknown>
	/** Adds state previously dumped with dumpState to the current chain */
	loadState: (args: { state: Hex }) => Promise<void>
	/** Mine a specified number of blocks */
	mine: (args: { blocks: number; interval?: number }) => Promise<void>
	/** Removes setBlockTimestampInterval if it exists */
	removeBlockTimestampInterval: () => Promise<void>
	/** Resets fork back to its original state */
	reset: (args?: { blockNumber?: bigint; jsonRpcUrl?: string }) => Promise<void>
	/** Revert the state of the blockchain to a previous snapshot */
	revert: (args: { id: Hex }) => Promise<void>
	/** Send an unsigned transaction from an impersonated account */
	sendUnsignedTransaction: (args: unknown) => Promise<Hex>
	/** Enables or disables the automatic mining of new blocks */
	setAutomine: (args: boolean) => Promise<void>
	/** Modifies the balance of an account */
	setBalance: (args: { address: Address; value: bigint }) => Promise<void>
	/** Sets the block's gas limit */
	setBlockGasLimit: (args: { gasLimit: bigint }) => Promise<void>
	/** Sets a block timestamp interval for future blocks */
	setBlockTimestampInterval: (args: { interval: number }) => Promise<void>
	/** Modifies the bytecode stored at an account's address */
	setCode: (args: { address: Address; bytecode: Hex }) => Promise<void>
	/** Sets the coinbase address to be used in new blocks */
	setCoinbase: (args: { address: Address }) => Promise<void>
	/** Sets the automatic mining interval */
	setIntervalMining: (args: { interval: number }) => Promise<void>
	/** Enable or disable logging on the test node */
	setLoggingEnabled: (args: boolean) => Promise<void>
	/** Change the minimum gas price accepted by the network */
	setMinGasPrice: (args: { gasPrice: bigint }) => Promise<void>
	/** Sets the next block's base fee per gas */
	setNextBlockBaseFeePerGas: (args: { baseFeePerGas: bigint }) => Promise<void>
	/** Sets the next block's timestamp */
	setNextBlockTimestamp: (args: { timestamp: bigint }) => Promise<void>
	/** Modifies the nonce of an account */
	setNonce: (args: { address: Address; nonce: number }) => Promise<void>
	/** Sets the backend RPC URL */
	setRpcUrl: (args: string) => Promise<void>
	/** Writes to a slot of an account's storage */
	setStorageAt: (args: { address: Address; index: number | Hex; value: Hex }) => Promise<void>
	/** Snapshot the state of the blockchain at the current block */
	snapshot: () => Promise<Hex>
	/** Stop impersonating an account */
	stopImpersonatingAccount: (args: { address: Address }) => Promise<void>
}

/**
 * Interface for public client actions - read-only blockchain operations.
 * Compatible with viem's PublicActions interface.
 *
 * @example
 * ```typescript
 * import type { PublicActions } from '@tevm/utils'
 *
 * // Type a client with public actions
 * function useClient(client: PublicActions) {
 *   return client.getBalance({ address: '0x...' })
 * }
 * ```
 */
export type PublicActions = {
	/** Executes a new message call immediately without submitting a transaction */
	call: (args: unknown) => Promise<unknown>
	/** Creates an access list for a transaction */
	createAccessList: (args: unknown) => Promise<unknown>
	/** Creates a Filter to listen for new block hashes */
	createBlockFilter: () => Promise<unknown>
	/** Creates a Filter to retrieve event logs for a contract */
	createContractEventFilter: (args: unknown) => Promise<unknown>
	/** Creates a Filter to retrieve event logs */
	createEventFilter: (args?: unknown) => Promise<unknown>
	/** Creates a Filter to listen for new pending transactions */
	createPendingTransactionFilter: () => Promise<unknown>
	/** Estimates the gas required for a contract method call */
	estimateContractGas: (args: unknown) => Promise<bigint>
	/** Estimates the fees per gas for a transaction */
	estimateFeesPerGas: (args?: unknown) => Promise<unknown>
	/** Estimates the gas required for a transaction */
	estimateGas: (args: unknown) => Promise<bigint>
	/** Estimates the max priority fee per gas */
	estimateMaxPriorityFeePerGas: (args?: unknown) => Promise<bigint>
	/** Returns the balance of an address in wei */
	getBalance: (args: { address: Address; blockNumber?: bigint; blockTag?: string }) => Promise<bigint>
	/** Returns the blob base fee in wei */
	getBlobBaseFee: () => Promise<bigint>
	/** Returns information about a block */
	getBlock: (args?: unknown) => Promise<unknown>
	/** Returns the number of the most recent block */
	getBlockNumber: () => Promise<bigint>
	/** Returns the number of transactions in a block */
	getBlockTransactionCount: (args?: unknown) => Promise<number>
	/** Returns the bytecode at an address */
	getBytecode: (args: { address: Address; blockNumber?: bigint; blockTag?: string }) => Promise<Hex | undefined>
	/** Returns the chain ID */
	getChainId: () => Promise<number>
	/** Gets the bytecode at an address (alias for getBytecode) */
	getCode: (args: { address: Address; blockNumber?: bigint; blockTag?: string }) => Promise<Hex | undefined>
	/** Returns a list of event logs for a contract */
	getContractEvents: (args: unknown) => Promise<unknown[]>
	/** Gets the EIP-712 domain of a contract */
	getEip712Domain: (args: { address: Address }) => Promise<unknown>
	/** Gets address for an ENS name */
	getEnsAddress: (args: { name: string }) => Promise<Address | null>
	/** Gets avatar URI for an ENS name */
	getEnsAvatar: (args: { name: string }) => Promise<string | null>
	/** Gets primary ENS name for an address */
	getEnsName: (args: { address: Address }) => Promise<string | null>
	/** Gets resolver address for an ENS name */
	getEnsResolver: (args: { name: string }) => Promise<Address>
	/** Gets text record for an ENS name */
	getEnsText: (args: { name: string; key: string }) => Promise<string | null>
	/** Returns historical gas information */
	getFeeHistory: (args: unknown) => Promise<unknown>
	/** Returns a list of logs or hashes based on a filter */
	getFilterChanges: (args: { filter: unknown }) => Promise<unknown[]>
	/** Returns a list of all logs based on a filter */
	getFilterLogs: (args: { filter: unknown }) => Promise<unknown[]>
	/** Returns the current price per gas in wei */
	getGasPrice: () => Promise<bigint>
	/** Returns a list of event logs matching the provided parameters */
	getLogs: (args?: unknown) => Promise<unknown[]>
	/** Returns the account and storage values of a contract with Merkle proofs */
	getProof: (args: unknown) => Promise<unknown>
	/** Returns the value from a storage slot at a given address */
	getStorageAt: (args: { address: Address; slot: Hex; blockNumber?: bigint; blockTag?: string }) => Promise<Hex | undefined>
	/** Returns information about a transaction by its hash */
	getTransaction: (args: { hash: Hex }) => Promise<unknown>
	/** Returns the number of confirmations for a transaction */
	getTransactionConfirmations: (args: { hash: Hex }) => Promise<bigint>
	/** Returns the number of transactions sent from an address */
	getTransactionCount: (args: { address: Address; blockNumber?: bigint; blockTag?: string }) => Promise<number>
	/** Returns the transaction receipt for a transaction */
	getTransactionReceipt: (args: { hash: Hex }) => Promise<unknown>
	/** Executes multiple read calls in a single request */
	multicall: (args: unknown) => Promise<unknown[]>
	/** Prepares a transaction request for signing */
	prepareTransactionRequest: (args: unknown) => Promise<unknown>
	/** Calls a read-only function on a contract */
	readContract: (args: unknown) => Promise<unknown>
	/** Sends a signed transaction to the network */
	sendRawTransaction: (args: { serializedTransaction: Hex }) => Promise<Hex>
	/** Simulates a transaction */
	simulate: (args: unknown) => Promise<unknown>
	/** Simulates multiple blocks */
	simulateBlocks: (args: unknown) => Promise<unknown>
	/** Simulates multiple calls */
	simulateCalls: (args: unknown) => Promise<unknown>
	/** Simulates a contract function call */
	simulateContract: (args: unknown) => Promise<unknown>
	/** Destroys a Filter */
	uninstallFilter: (args: { filter: unknown }) => Promise<boolean>
	/** Verifies a message signature */
	verifyMessage: (args: unknown) => Promise<boolean>
	/** Verifies a SIWE message signature */
	verifySiweMessage: (args: unknown) => Promise<boolean>
	/** Verifies typed data signature */
	verifyTypedData: (args: unknown) => Promise<boolean>
	/** Waits for a transaction receipt */
	waitForTransactionReceipt: (args: { hash: Hex; timeout?: number }) => Promise<unknown>
	/** Watches for new block numbers */
	watchBlockNumber: (args: unknown) => unknown
	/** Watches for new blocks */
	watchBlocks: (args: unknown) => unknown
	/** Watches for contract events */
	watchContractEvent: (args: unknown) => unknown
	/** Watches for events */
	watchEvent: (args: unknown) => unknown
	/** Watches for pending transactions */
	watchPendingTransactions: (args: unknown) => unknown
}

/**
 * Interface for wallet client actions - write operations requiring signatures.
 * Compatible with viem's WalletActions interface.
 *
 * @example
 * ```typescript
 * import type { WalletActions } from '@tevm/utils'
 *
 * // Type a client with wallet actions
 * function useWalletClient(client: WalletActions) {
 *   return client.sendTransaction({ to: '0x...', value: 1000000000000000000n })
 * }
 * ```
 */
export type WalletActions = {
	/** Adds an EIP712 domain to the client */
	addChain: (args: { chain: unknown }) => Promise<void>
	/** Deploys a contract to the network */
	deployContract: (args: unknown) => Promise<Hex>
	/** Returns the account addresses managed by the wallet */
	getAddresses: () => Promise<readonly Address[]>
	/** Returns the permissions granted to the wallet */
	getPermissions: () => Promise<unknown[]>
	/** Prepares transaction request for signing */
	prepareTransactionRequest: (args: unknown) => Promise<unknown>
	/** Requests new permissions from the wallet */
	requestPermissions: (args: { eth_accounts: unknown }) => Promise<unknown[]>
	/** Requests addresses from the wallet */
	requestAddresses: () => Promise<readonly Address[]>
	/** Sends a transaction to the network */
	sendTransaction: (args: unknown) => Promise<Hex>
	/** Sends raw signed transaction data */
	sendRawTransaction: (args: { serializedTransaction: Hex }) => Promise<Hex>
	/** Signs a message */
	signMessage: (args: { account?: Address; message: string | Hex }) => Promise<Hex>
	/** Signs a transaction without sending */
	signTransaction: (args: unknown) => Promise<Hex>
	/** Signs typed data (EIP-712) */
	signTypedData: (args: unknown) => Promise<Hex>
	/** Switches to a different chain */
	switchChain: (args: { id: number }) => Promise<void>
	/** Watches for asset changes */
	watchAsset: (args: unknown) => Promise<boolean>
	/** Writes to a contract */
	writeContract: (args: unknown) => Promise<Hex>
}

/**
 * Public RPC schema type.
 *
 * Defines the standard public JSON-RPC methods available for read-only operations.
 * Compatible with viem's PublicRpcSchema type.
 *
 * @example
 * ```typescript
 * import type { PublicRpcSchema } from '@tevm/utils'
 *
 * // Use with client configuration
 * type MyPublicClient = Client<Transport, Chain, undefined, PublicRpcSchema>
 * ```
 */
export type PublicRpcSchema = readonly [
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
		Method: 'eth_uninstallFilter'
		Parameters: readonly [filterId: Hex]
		ReturnType: boolean
	},
]

/**
 * Test RPC schema type.
 *
 * Defines the JSON-RPC methods available for test/development operations.
 * Includes Anvil-compatible methods for state manipulation.
 * Compatible with viem's TestRpcSchema type.
 *
 * @example
 * ```typescript
 * import type { TestRpcSchema } from '@tevm/utils'
 *
 * // Use with test client configuration
 * type MyTestClient = Client<Transport, Chain, undefined, TestRpcSchema>
 * ```
 */
export type TestRpcSchema = readonly [
	{
		Method: 'anvil_dropTransaction'
		Parameters: readonly [hash: Hex]
		ReturnType: void
	},
	{
		Method: 'anvil_dumpState'
		Parameters?: undefined
		ReturnType: Hex
	},
	{
		Method: 'anvil_getAutomine'
		Parameters?: undefined
		ReturnType: boolean
	},
	{
		Method: 'anvil_impersonateAccount'
		Parameters: readonly [address: Address]
		ReturnType: void
	},
	{
		Method: 'anvil_loadState'
		Parameters: readonly [state: Hex]
		ReturnType: void
	},
	{
		Method: 'anvil_mine'
		Parameters: readonly [blocks?: Hex, interval?: Hex]
		ReturnType: void
	},
	{
		Method: 'anvil_reset'
		Parameters: readonly [options?: { forking?: { blockNumber?: Hex; jsonRpcUrl?: string } }]
		ReturnType: void
	},
	{
		Method: 'anvil_setAutomine'
		Parameters: readonly [enabled: boolean]
		ReturnType: void
	},
	{
		Method: 'anvil_setBalance'
		Parameters: readonly [address: Address, balance: Hex]
		ReturnType: void
	},
	{
		Method: 'anvil_setBlockGasLimit'
		Parameters: readonly [gasLimit: Hex]
		ReturnType: void
	},
	{
		Method: 'anvil_setBlockTimestampInterval'
		Parameters: readonly [interval: number]
		ReturnType: void
	},
	{
		Method: 'anvil_setCode'
		Parameters: readonly [address: Address, code: Hex]
		ReturnType: void
	},
	{
		Method: 'anvil_setCoinbase'
		Parameters: readonly [address: Address]
		ReturnType: void
	},
	{
		Method: 'anvil_setIntervalMining'
		Parameters: readonly [interval: number]
		ReturnType: void
	},
	{
		Method: 'anvil_setLoggingEnabled'
		Parameters: readonly [enabled: boolean]
		ReturnType: void
	},
	{
		Method: 'anvil_setMinGasPrice'
		Parameters: readonly [gasPrice: Hex]
		ReturnType: void
	},
	{
		Method: 'anvil_setNextBlockBaseFeePerGas'
		Parameters: readonly [baseFeePerGas: Hex]
		ReturnType: void
	},
	{
		Method: 'anvil_setNextBlockTimestamp'
		Parameters: readonly [timestamp: Hex]
		ReturnType: void
	},
	{
		Method: 'anvil_setNonce'
		Parameters: readonly [address: Address, nonce: Hex]
		ReturnType: void
	},
	{
		Method: 'anvil_setRpcUrl'
		Parameters: readonly [url: string]
		ReturnType: void
	},
	{
		Method: 'anvil_setStorageAt'
		Parameters: readonly [address: Address, slot: Hex, value: Hex]
		ReturnType: void
	},
	{
		Method: 'anvil_snapshot'
		Parameters?: undefined
		ReturnType: Hex
	},
	{
		Method: 'anvil_stopImpersonatingAccount'
		Parameters: readonly [address: Address]
		ReturnType: void
	},
	{
		Method: 'evm_increaseTime'
		Parameters: readonly [seconds: number]
		ReturnType: Hex
	},
	{
		Method: 'evm_mine'
		Parameters?: readonly [options?: { timestamp?: number }]
		ReturnType: void
	},
	{
		Method: 'evm_revert'
		Parameters: readonly [snapshotId: Hex]
		ReturnType: void
	},
	{
		Method: 'evm_setAutomine'
		Parameters: readonly [enabled: boolean]
		ReturnType: void
	},
	{
		Method: 'evm_setBlockGasLimit'
		Parameters: readonly [gasLimit: Hex]
		ReturnType: void
	},
	{
		Method: 'evm_setIntervalMining'
		Parameters: readonly [interval: number]
		ReturnType: void
	},
	{
		Method: 'evm_setNextBlockTimestamp'
		Parameters: readonly [timestamp: Hex]
		ReturnType: void
	},
	{
		Method: 'evm_snapshot'
		Parameters?: undefined
		ReturnType: Hex
	},
]

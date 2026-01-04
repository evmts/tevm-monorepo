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

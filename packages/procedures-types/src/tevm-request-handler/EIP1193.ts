import type {
	AnvilJsonRpcRequest,
	DebugJsonRpcRequest,
	EthJsonRpcRequest,
	TevmJsonRpcBulkRequestHandler,
	TevmJsonRpcRequest,
} from '../index.js'
import type { GetAccountResult, TransactionParams } from '@tevm/actions-types'
import type { Filter } from '@tevm/utils'

/**
 * Options for the EIP1193 request handler
 * @see
 */
export interface EIP1193RequestOptions {
	// The base delay (in ms) between retries.
	retryDelay?: number
	// The max number of times to retry.
	retryCount?: number
}

export type TevmRequest =
	| TevmJsonRpcRequest
	| EthJsonRpcRequest
	| AnvilJsonRpcRequest
	| DebugJsonRpcRequest

export type TevmEIP1193RequestFn<
	TParameters extends TevmRequest['params'] = TevmRequest['params'],
> = (
	args: {
		params: TParameters
		method: TevmRequest['method']
	},
	options?: EIP1193RequestOptions,
) => Promise<unknown>

// EIP-1193: Ethereum Provider JavaScript API

// Interface for the Provider

// Interface for request arguments
export interface RequestArguments {
	method: string
	params?: readonly unknown[] | object
}
// Interface for the ProviderRpcError as specified
export interface ProviderRpcError extends Error {
	code: number
	data?: unknown
}

// Interface for the 'connect' event information
export interface ProviderConnectInfo {
	chainId: string // Specifies the integer ID of the connected chain as a hexadecimal string
}

// Interface for the 'message' event information
export interface ProviderMessage {
	type: string
	data: unknown
}

// Interface for the Ethereum subscription message (e.g., from eth_subscribe)
export interface EthSubscription extends ProviderMessage {
	type: 'eth_subscription'
	data: {
		subscription: string
		result: unknown
	}
}

// Define event listener types for specific events
export type ConnectListener = (connectInfo: ProviderConnectInfo) => void
export type DisconnectListener = (error: ProviderRpcError) => void
export type ChainChangedListener = (chainId: string) => void
export type AccountsChangedListener = (accounts: string[]) => void
export type MessageListener = (message: ProviderMessage) => void
export type NewBlockListener = (blockNumber: string) => void
export type PendingTxListener = (tx: TransactionParams) => void
export type PendingTxRevertedListener = (tx: TransactionParams) => void
export type PendingTxConfirmedListener = (tx: TransactionParams) => void
export type ErrorListener = (error: ProviderRpcError) => void
export type EventListener = (filter?: Filter) => void
export type AcountUpdatedListener = (account?: GetAccountResult) => void
export type DebugListener = (message: string) => void

type TODO = any

type TevmActionsApi = TODO

export interface TevmEIP1193Provider {
	request: TevmEIP1193RequestFn

	on(event: 'connect', listener: ConnectListener): this
	on(event: 'disconnect', listener: DisconnectListener): this
	// never happens included for compatibility
	on(event: 'chainChanged', listener: ChainChangedListener): this
	// never happens included for compatibility
	on(event: 'accountsChanged', listener: AccountsChangedListener): this
	on(event: 'message', listener: MessageListener): this
	on(event: 'newBlock', listener: NewBlockListener): this
	on(event: 'pendingTx', listener: PendingTxListener): this
	on(event: 'pendingTxReverted', listener: PendingTxRevertedListener): this
	on(event: 'pendingTxConfirmed', listener: PendingTxConfirmedListener): this
	on(event: 'error', listener: ErrorListener): this
	on(event: 'event', listener: EventListener): this
	on(event: 'accountUpdated', listener: AcountUpdatedListener): this
	on(event: 'debug', listener: DebugListener): this

	removeListener(event: 'connect', listener: ConnectListener): this
	removeListener(event: 'disconnect', listener: DisconnectListener): this
	removeListener(event: 'chainChanged', listener: ChainChangedListener): this
	removeListener(
		event: 'accountsChanged',
		listener: AccountsChangedListener,
	): this
	removeListener(event: 'message', listener: MessageListener): this
}

export type TevmClient = TevmEIP1193Provider &
	TevmActionsApi & {
		/**
		 * Whether the provider is polling for block updates
		 */
		polling: boolean
		/**
		 * Frequency in MS to poll for block updates
		 */
		pollingInterval: number

		requestBulk: TevmJsonRpcBulkRequestHandler
	}

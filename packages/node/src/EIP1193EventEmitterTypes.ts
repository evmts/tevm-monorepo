// this file is adapted from viem
// see it here https://github.com/wevm/viem/blob/main/src/types/eip1193.ts
// Copied from viem commit a098c98231d47ccac9bda1a944880b034020a1b5
// We copy it here for easier developer experience internally and also
// to lock in these types independent of viem potentially making changes
import type { Block } from '@tevm/block'
import type { TxReceipt } from '@tevm/receipt-manager'
import type { ImpersonatedTx, TypedTransaction } from '@tevm/tx'
import type { Address, EthjsLog } from '@tevm/utils'

export type ProviderConnectInfo = {
	chainId: string
}

export type ProviderMessage = {
	type: string
	data: unknown
}

export class ProviderRpcError extends Error {
	code: number
	details: string

	constructor(code: number, message: string) {
		super(message)
		this.code = code
		this.details = message
	}
}

export type EIP1193EventMap = {
	accountsChanged(accounts: Address[]): void
	chainChanged(chainId: string): void
	connect(connectInfo: ProviderConnectInfo): void
	disconnect(error: ProviderRpcError): void
	message(message: ProviderMessage): void
	// These aren't standardized I'm adding the below ones for internal use
	// If standardized versions of these exist already we should consider switching to them in future
	newPendingTransaction(tx: TypedTransaction | ImpersonatedTx): void
	newReceipt(receipt: TxReceipt): void
	newBlock(block: Block): void
	newLog(log: EthjsLog): void
}

export type EIP1193Events = {
	on<TEvent extends keyof EIP1193EventMap>(event: TEvent, listener: EIP1193EventMap[TEvent]): void
	removeListener<TEvent extends keyof EIP1193EventMap>(event: TEvent, listener: EIP1193EventMap[TEvent]): void
}
/**
 * A very minimal EventEmitter interface
 */
export type EIP1193EventEmitter = EIP1193Events & {
	/**
	 * Emit an event.
	 * @param {string | symbol} eventName - The event name.
	 * @param  {...any} args - Arguments to pass to the event listeners.
	 * @returns {boolean} True if the event was emitted, false otherwise.
	 */
	emit(eventName: keyof EIP1193EventMap, ...args: any[]): boolean
}

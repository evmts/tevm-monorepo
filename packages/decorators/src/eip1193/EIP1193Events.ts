// this file is adapted from viem
// see it here https://github.com/wevm/viem/blob/main/src/types/eip1193.ts
// Copied from viem commit a098c98231d47ccac9bda1a944880b034020a1b5
// We copy it here for easier developer experience internally and also
// to lock in these types independent of viem potentially making changes
import type { Address } from '@tevm/utils'

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
}

export type EIP1193Events = {
	on<TEvent extends keyof EIP1193EventMap>(
		event: TEvent,
		listener: EIP1193EventMap[TEvent],
	): void
	removeListener<TEvent extends keyof EIP1193EventMap>(
		event: TEvent,
		listener: EIP1193EventMap[TEvent],
	): void
}

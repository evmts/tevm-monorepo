import type { Hex } from '../types/misc.js'
import { BaseError } from './base.js'
import type { Address } from 'abitype'
export declare class OffchainLookupError extends BaseError {
	name: string
	constructor({
		callbackSelector,
		cause,
		data,
		extraData,
		sender,
		urls,
	}: {
		callbackSelector: Hex
		cause: BaseError
		data: Hex
		extraData: Hex
		sender: Address
		urls: readonly string[]
	})
}
export declare class OffchainLookupResponseMalformedError extends BaseError {
	name: string
	constructor({
		result,
		url,
	}: {
		result: any
		url: string
	})
}
export declare class OffchainLookupSenderMismatchError extends BaseError {
	name: string
	constructor({
		sender,
		to,
	}: {
		sender: Address
		to: Address
	})
}
//# sourceMappingURL=ccip.d.ts.map

import type { Chain } from '../types/chain.js'
import { BaseError } from './base.js'
export declare class ChainDoesNotSupportContract extends BaseError {
	name: string
	constructor({
		blockNumber,
		chain,
		contract,
	}: {
		blockNumber?: bigint
		chain: Chain
		contract: {
			name: string
			blockCreated?: number
		}
	})
}
export declare class ChainMismatchError extends BaseError {
	name: string
	constructor({
		chain,
		currentChainId,
	}: {
		chain: Chain
		currentChainId: number
	})
}
export declare class ChainNotFoundError extends BaseError {
	name: string
	constructor()
}
export declare class ClientChainNotConfiguredError extends BaseError {
	name: string
	constructor()
}
export declare class InvalidChainIdError extends BaseError {
	name: string
	constructor({
		chainId,
	}: {
		chainId: number
	})
}
//# sourceMappingURL=chain.d.ts.map

import type { Hash } from '../types/misc.js'
import { BaseError } from './base.js'
export declare class BlockNotFoundError extends BaseError {
	name: string
	constructor({
		blockHash,
		blockNumber,
	}: {
		blockHash?: Hash
		blockNumber?: bigint
	})
}
//# sourceMappingURL=block.d.ts.map

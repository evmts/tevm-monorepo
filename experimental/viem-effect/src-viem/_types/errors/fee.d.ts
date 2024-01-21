import { BaseError } from './base.js'
export declare class BaseFeeScalarError extends BaseError {
	name: string
	constructor()
}
export declare class Eip1559FeesNotSupportedError extends BaseError {
	name: string
	constructor()
}
export declare class MaxFeePerGasTooLowError extends BaseError {
	name: string
	constructor({
		maxPriorityFeePerGas,
	}: {
		maxPriorityFeePerGas: bigint
	})
}
//# sourceMappingURL=fee.d.ts.map

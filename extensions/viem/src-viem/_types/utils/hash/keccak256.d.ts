import type { ByteArray, Hex } from '../../types/misc.js'
type To = 'hex' | 'bytes'
export type Keccak256Hash<TTo extends To> =
	| (TTo extends 'bytes' ? ByteArray : never)
	| (TTo extends 'hex' ? Hex : never)
export declare function keccak256<TTo extends To = 'hex'>(
	value: Hex | ByteArray,
	to_?: TTo,
): Keccak256Hash<TTo>
export {}
//# sourceMappingURL=keccak256.d.ts.map

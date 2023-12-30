import type { ByteArray, Hex } from '../../types/misc.js'
export type RecursiveArray<T> = T | RecursiveArray<T>[]
type To = 'hex' | 'bytes'
export type ToRlpReturnType<TTo extends To> = TTo extends 'bytes'
	? ByteArray
	: TTo extends 'hex'
	? Hex
	: never
export declare function toRlp<TTo extends To = 'hex'>(
	hexOrBytes: RecursiveArray<Hex> | RecursiveArray<ByteArray>,
	to_?: TTo,
): ToRlpReturnType<TTo>
export declare function bytesToRlp(bytes: RecursiveArray<ByteArray>): ByteArray
export {}
//# sourceMappingURL=toRlp.d.ts.map

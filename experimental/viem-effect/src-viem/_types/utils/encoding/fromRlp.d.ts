import type { ByteArray, Hex } from '../../types/misc.js'
import type { RecursiveArray } from './toRlp.js'
type FromRlpReturnType<TTo> = TTo extends 'bytes'
	? ByteArray
	: TTo extends 'hex'
	? Hex
	: never
export declare function fromRlp<TTo extends 'bytes' | 'hex'>(
	value: ByteArray | Hex,
	to: TTo,
): RecursiveArray<FromRlpReturnType<TTo>>
export {}
//# sourceMappingURL=fromRlp.d.ts.map

import type { ByteArray, Hex, SignableMessage } from '../../types/misc.js'
type To = 'hex' | 'bytes'
export type HashMessage<TTo extends To> =
	| (TTo extends 'bytes' ? ByteArray : never)
	| (TTo extends 'hex' ? Hex : never)
export declare function hashMessage<TTo extends To = 'hex'>(
	message: SignableMessage,
	to_?: TTo,
): HashMessage<TTo>
export {}
//# sourceMappingURL=hashMessage.d.ts.map

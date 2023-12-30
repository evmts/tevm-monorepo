import type { ByteArray, Hex } from '../../types/misc.js'
export type FromBytesParameters<
	TTo extends 'string' | 'hex' | 'bigint' | 'number' | 'boolean',
> =
	| TTo
	| {
			/** Size of the bytes. */
			size?: number
			/** Type to convert to. */
			to: TTo
	  }
type FromBytesReturnType<TTo> = TTo extends 'string'
	? string
	: TTo extends 'hex'
	? Hex
	: TTo extends 'bigint'
	? bigint
	: TTo extends 'number'
	? number
	: TTo extends 'boolean'
	? boolean
	: never
/**
 * Decodes a byte array into a UTF-8 string, hex value, number, bigint or boolean.
 *
 * - Docs: https://viem.sh/docs/utilities/fromBytes.html
 * - Example: https://viem.sh/docs/utilities/fromBytes.html#usage
 *
 * @param bytes Byte array to decode.
 * @param toOrOpts Type to convert to or options.
 * @returns Decoded value.
 *
 * @example
 * import { fromBytes } from 'viem'
 * const data = fromBytes(new Uint8Array([1, 164]), 'number')
 * // 420
 *
 * @example
 * import { fromBytes } from 'viem'
 * const data = fromBytes(
 *   new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]),
 *   'string'
 * )
 * // 'Hello world'
 */
export declare function fromBytes<
	TTo extends 'string' | 'hex' | 'bigint' | 'number' | 'boolean',
>(
	bytes: ByteArray,
	toOrOpts: FromBytesParameters<TTo>,
): FromBytesReturnType<TTo>
export type BytesToBigIntOpts = {
	/** Whether or not the number of a signed representation. */
	signed?: boolean
	/** Size of the bytes. */
	size?: number
}
/**
 * Decodes a byte array into a bigint.
 *
 * - Docs: https://viem.sh/docs/utilities/fromBytes.html#bytestobigint
 *
 * @param bytes Byte array to decode.
 * @param opts Options.
 * @returns BigInt value.
 *
 * @example
 * import { bytesToBigint } from 'viem'
 * const data = bytesToBigint(new Uint8Array([1, 164]))
 * // 420n
 */
export declare function bytesToBigint(
	bytes: ByteArray,
	opts?: BytesToBigIntOpts,
): bigint
export type BytesToBoolOpts = {
	/** Size of the bytes. */
	size?: number
}
/**
 * Decodes a byte array into a boolean.
 *
 * - Docs: https://viem.sh/docs/utilities/fromBytes.html#bytestobool
 *
 * @param bytes Byte array to decode.
 * @param opts Options.
 * @returns Boolean value.
 *
 * @example
 * import { bytesToBool } from 'viem'
 * const data = bytesToBool(new Uint8Array([1]))
 * // true
 */
export declare function bytesToBool(
	bytes_: ByteArray,
	opts?: BytesToBoolOpts,
): boolean
export type BytesToNumberOpts = BytesToBigIntOpts
/**
 * Decodes a byte array into a number.
 *
 * - Docs: https://viem.sh/docs/utilities/fromBytes.html#bytestonumber
 *
 * @param bytes Byte array to decode.
 * @param opts Options.
 * @returns Number value.
 *
 * @example
 * import { bytesToNumber } from 'viem'
 * const data = bytesToNumber(new Uint8Array([1, 164]))
 * // 420
 */
export declare function bytesToNumber(
	bytes: ByteArray,
	opts?: BytesToNumberOpts,
): number
export type BytesToStringOpts = {
	/** Size of the bytes. */
	size?: number
}
/**
 * Decodes a byte array into a UTF-8 string.
 *
 * - Docs: https://viem.sh/docs/utilities/fromBytes.html#bytestostring
 *
 * @param bytes Byte array to decode.
 * @param opts Options.
 * @returns String value.
 *
 * @example
 * import { bytesToString } from 'viem'
 * const data = bytesToString(new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]))
 * // 'Hello world'
 */
export declare function bytesToString(
	bytes_: ByteArray,
	opts?: BytesToStringOpts,
): string
export {}
//# sourceMappingURL=fromBytes.d.ts.map

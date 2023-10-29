import type { ByteArray, Hex } from '../../types/misc.js'
export type SliceReturnType<TValue extends ByteArray | Hex> = TValue extends Hex
	? Hex
	: ByteArray
/**
 * @description Returns a section of the hex or byte array given a start/end bytes offset.
 *
 * @param value The hex or byte array to slice.
 * @param start The start offset (in bytes).
 * @param end The end offset (in bytes).
 */
export declare function slice<TValue extends ByteArray | Hex>(
	value: TValue,
	start?: number,
	end?: number,
	{
		strict,
	}?: {
		strict?: boolean
	},
): SliceReturnType<TValue>
/**
 * @description Returns a section of the byte array given a start/end bytes offset.
 *
 * @param value The byte array to slice.
 * @param start The start offset (in bytes).
 * @param end The end offset (in bytes).
 */
export declare function sliceBytes(
	value_: ByteArray,
	start?: number,
	end?: number,
	{
		strict,
	}?: {
		strict?: boolean
	},
): ByteArray
/**
 * @description Returns a section of the hex value given a start/end bytes offset.
 *
 * @param value The hex value to slice.
 * @param start The start offset (in bytes).
 * @param end The end offset (in bytes).
 */
export declare function sliceHex(
	value_: Hex,
	start?: number,
	end?: number,
	{
		strict,
	}?: {
		strict?: boolean
	},
): Hex
//# sourceMappingURL=slice.d.ts.map

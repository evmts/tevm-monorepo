import type { Hex } from '../../types/misc.js'
import type { AbiParameter, AbiParametersToPrimitiveTypes } from 'abitype'
export type EncodeAbiParametersReturnType = Hex
/**
 * @description Encodes a list of primitive values into an ABI-encoded hex value.
 */
export declare function encodeAbiParameters<
	const TParams extends readonly AbiParameter[] | readonly unknown[],
>(
	params: TParams,
	values: TParams extends readonly AbiParameter[]
		? AbiParametersToPrimitiveTypes<TParams>
		: never,
): EncodeAbiParametersReturnType
export declare function getArrayComponents(
	type: string,
): [length: number | null, innerType: string] | undefined
//# sourceMappingURL=encodeAbiParameters.d.ts.map

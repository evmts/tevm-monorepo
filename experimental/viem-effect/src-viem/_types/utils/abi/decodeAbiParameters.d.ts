import type { Hex } from '../../types/misc.js'
import type { AbiParameter, AbiParametersToPrimitiveTypes } from 'abitype'
export type DecodeAbiParametersReturnType<
	TParams extends
		| readonly AbiParameter[]
		| readonly unknown[] = readonly AbiParameter[],
> = AbiParametersToPrimitiveTypes<
	TParams extends readonly AbiParameter[] ? TParams : AbiParameter[]
>
export declare function decodeAbiParameters<
	const TParams extends readonly AbiParameter[] | readonly unknown[],
>(params: TParams, data: Hex): DecodeAbiParametersReturnType<TParams>
//# sourceMappingURL=decodeAbiParameters.d.ts.map

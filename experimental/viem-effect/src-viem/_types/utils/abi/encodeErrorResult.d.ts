import type { GetErrorArgs, InferErrorName } from '../../types/contract.js'
import type { Abi } from 'abitype'
export type EncodeErrorResultParameters<
	TAbi extends Abi | readonly unknown[] = Abi,
	TErrorName extends string | undefined = string,
	_ErrorName = InferErrorName<TAbi, TErrorName>,
> = {
	errorName?: _ErrorName
} & (TErrorName extends string
	? {
			abi: TAbi
	  } & GetErrorArgs<TAbi, TErrorName>
	: _ErrorName extends string
	? {
			abi: [TAbi[number]]
	  } & GetErrorArgs<TAbi, _ErrorName>
	: never)
export declare function encodeErrorResult<
	const TAbi extends Abi | readonly unknown[],
	TErrorName extends string | undefined = undefined,
>({
	abi,
	errorName,
	args,
}: EncodeErrorResultParameters<TAbi, TErrorName>): `0x${string}`
//# sourceMappingURL=encodeErrorResult.d.ts.map

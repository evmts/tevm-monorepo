import type {
	GetFunctionArgs,
	InferFunctionName,
} from '../../types/contract.js'
import type { Abi } from 'abitype'
export type EncodeFunctionDataParameters<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string | undefined = string,
	_FunctionName = InferFunctionName<TAbi, TFunctionName>,
> = {
	functionName?: _FunctionName
} & (TFunctionName extends string
	? {
			abi: TAbi
	  } & GetFunctionArgs<TAbi, TFunctionName>
	: _FunctionName extends string
	? {
			abi: [TAbi[number]]
	  } & GetFunctionArgs<TAbi, _FunctionName>
	: never)
export declare function encodeFunctionData<
	const TAbi extends Abi | readonly unknown[],
	TFunctionName extends string | undefined = undefined,
>({
	abi,
	args,
	functionName,
}: EncodeFunctionDataParameters<TAbi, TFunctionName>): `0x${string}`
//# sourceMappingURL=encodeFunctionData.d.ts.map

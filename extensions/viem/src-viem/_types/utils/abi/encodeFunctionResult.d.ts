import type {
	ContractFunctionResult,
	InferFunctionName,
} from '../../types/contract.js'
import type { Abi } from 'abitype'
export type EncodeFunctionResultParameters<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string | undefined = string,
	_FunctionName = InferFunctionName<TAbi, TFunctionName>,
> = {
	functionName?: _FunctionName
} & (TFunctionName extends string
	? {
			abi: TAbi
			result?: ContractFunctionResult<TAbi, TFunctionName>
	  }
	: _FunctionName extends string
	? {
			abi: [TAbi[number]]
			result?: ContractFunctionResult<TAbi, _FunctionName>
	  }
	: never)
export declare function encodeFunctionResult<
	const TAbi extends Abi | readonly unknown[],
	TFunctionName extends string | undefined = undefined,
>({
	abi,
	functionName,
	result,
}: EncodeFunctionResultParameters<TAbi, TFunctionName>): `0x${string}`
//# sourceMappingURL=encodeFunctionResult.d.ts.map

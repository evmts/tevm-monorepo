import type { GetFunctionArgs } from '../../types/contract.js'
import type { Hex } from '../../types/misc.js'
import type { Abi, ExtractAbiFunctionNames } from 'abitype'
export type DecodeFunctionDataParameters<
	TAbi extends Abi | readonly unknown[] = Abi,
> = {
	abi: TAbi
	data: Hex
}
export type DecodeFunctionDataReturnType<
	TAbi extends Abi | readonly unknown[] = Abi,
	_FunctionNames extends string = TAbi extends Abi
		? Abi extends TAbi
			? string
			: ExtractAbiFunctionNames<TAbi>
		: string,
> = {
	[TName in _FunctionNames]: {
		args: GetFunctionArgs<TAbi, TName>['args']
		functionName: TName
	}
}[_FunctionNames]
export declare function decodeFunctionData<
	TAbi extends Abi | readonly unknown[],
>({
	abi,
	data,
}: DecodeFunctionDataParameters<TAbi>): DecodeFunctionDataReturnType<
	TAbi,
	TAbi extends Abi
		? Abi extends TAbi
			? string
			: ExtractAbiFunctionNames<TAbi>
		: string
>
//# sourceMappingURL=decodeFunctionData.d.ts.map

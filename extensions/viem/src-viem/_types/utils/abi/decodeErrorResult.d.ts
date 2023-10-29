import type { AbiItem, GetErrorArgs } from '../../types/contract.js'
import type { Hex } from '../../types/misc.js'
import type { Abi, ExtractAbiError, ExtractAbiErrorNames } from 'abitype'
export type DecodeErrorResultParameters<
	TAbi extends Abi | readonly unknown[] = Abi,
> = {
	abi?: TAbi
	data: Hex
}
export type DecodeErrorResultReturnType<
	TAbi extends Abi | readonly unknown[] = Abi,
	_ErrorNames extends string = TAbi extends Abi
		? Abi extends TAbi
			? string
			: ExtractAbiErrorNames<TAbi>
		: string,
> = {
	[TName in _ErrorNames]: {
		abiItem: TAbi extends Abi ? ExtractAbiError<TAbi, TName> : AbiItem
		args: GetErrorArgs<TAbi, TName>['args']
		errorName: TName
	}
}[_ErrorNames]
export declare function decodeErrorResult<
	const TAbi extends Abi | readonly unknown[],
>({
	abi,
	data,
}: DecodeErrorResultParameters<TAbi>): DecodeErrorResultReturnType<TAbi>
//# sourceMappingURL=decodeErrorResult.d.ts.map

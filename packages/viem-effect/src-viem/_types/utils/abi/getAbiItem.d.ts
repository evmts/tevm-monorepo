import type { GetFunctionArgs, InferItemName } from '../../types/contract.js'
import type { Hex } from '../../types/misc.js'
import type { Abi, AbiParameter } from 'abitype'
export type GetAbiItemParameters<
	TAbi extends Abi | readonly unknown[] = Abi,
	TItemName extends string = string,
> = {
	abi: TAbi
	name: InferItemName<TAbi, TItemName> | Hex
} & Partial<GetFunctionArgs<TAbi, TItemName>>
export type GetAbiItemReturnType<
	TAbi extends Abi | readonly unknown[] = Abi,
	TItemName extends string = string,
> = Extract<
	TAbi[number],
	{
		name: TItemName
	}
>
export declare function getAbiItem<
	const TAbi extends Abi | readonly unknown[],
	TItemName extends string,
>({
	abi,
	args,
	name,
}: GetAbiItemParameters<TAbi, TItemName>): GetAbiItemReturnType<TAbi, TItemName>
export declare function isArgOfType(
	arg: unknown,
	abiParameter: AbiParameter,
): boolean
//# sourceMappingURL=getAbiItem.d.ts.map

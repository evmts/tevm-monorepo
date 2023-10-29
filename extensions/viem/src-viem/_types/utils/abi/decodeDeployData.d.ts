import type { GetConstructorArgs } from '../../types/contract.js'
import type { Hex } from '../../types/misc.js'
import type { Abi } from 'abitype'
export type DecodeDeployDataParameters<
	TAbi extends Abi | readonly unknown[] = Abi,
> = {
	abi: TAbi
	bytecode: Hex
	data: Hex
}
export type DecodeDeployDataReturnType<
	TAbi extends Abi | readonly unknown[] = Abi,
> = {
	bytecode: Hex
} & GetConstructorArgs<TAbi>
export declare function decodeDeployData<
	const TAbi extends Abi | readonly unknown[],
>({
	abi,
	bytecode,
	data,
}: DecodeDeployDataParameters<TAbi>): DecodeDeployDataReturnType<TAbi>
//# sourceMappingURL=decodeDeployData.d.ts.map

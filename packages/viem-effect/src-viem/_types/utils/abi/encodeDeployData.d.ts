import type { GetConstructorArgs } from '../../types/contract.js'
import type { Hex } from '../../types/misc.js'
import type { Abi } from 'abitype'
export type EncodeDeployDataParameters<
	TAbi extends Abi | readonly unknown[] = Abi,
> = {
	abi: TAbi
	bytecode: Hex
} & GetConstructorArgs<TAbi>
export declare function encodeDeployData<
	const TAbi extends Abi | readonly unknown[],
>({ abi, args, bytecode }: EncodeDeployDataParameters<TAbi>): `0x${string}`
//# sourceMappingURL=encodeDeployData.d.ts.map

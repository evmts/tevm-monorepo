import type { TevmContract } from './TevmContract'
import { eventsFactory } from './event/eventFactory'
import { readFactory } from './read/readFactory'
import { writeFactory } from './write/writeFactory'
import { type Abi, type FormatAbi, formatAbi } from 'abitype'
import type { Hex } from 'viem'

export const createTevmContractFromAbi = <
	TName extends string,
	TAbi extends Abi,
	TBytecode extends Hex | undefined,
	TDeployedBytecode extends Hex | undefined,
>({
	abi,
	name,
	bytecode,
	deployedBytecode,
}: Pick<
	TevmContract<TName, FormatAbi<TAbi>, TBytecode, TDeployedBytecode>,
	'name' | 'abi' | 'bytecode' | 'deployedBytecode'
>): TevmContract<TName, FormatAbi<TAbi>, TBytecode, TDeployedBytecode> => {
	const methods = abi.filter((field) => {
		return field.type === 'function'
	})
	return {
		bytecode,
		deployedBytecode,
		name,
		abi: abi as any,
		humanReadableAbi: formatAbi(abi) as any,
		// TODO make this more internally typesafe
		events: eventsFactory({ abi, bytecode, deployedBytecode }) as any,
		// TODO make this more internally typesafe
		write: writeFactory({ methods, bytecode, deployedBytecode }) as any,
		// TODO make this more internally typesafe
		read: readFactory({ methods, bytecode, deployedBytecode }) as any,
	}
}

import type { EvmtsContract } from './EvmtsContract'
import { eventsFactory } from './event/eventFactory'
import { readFactory } from './read/readFactory'
import { writeFactory } from './write/writeFactory'
import { parseAbi } from 'abitype'
import type { Hex } from 'viem'

export const evmtsContractFactory = <
	TName extends string,
	THumanReadableAbi extends readonly string[],
	TBytecode extends Hex | undefined,
	TDeployedBytecode extends Hex | undefined,
>({
	humanReadableAbi,
	name,
	bytecode,
	deployedBytecode,
}: Pick<
	EvmtsContract<TName, THumanReadableAbi, TBytecode, TDeployedBytecode>,
	'name' | 'humanReadableAbi' | 'bytecode' | 'deployedBytecode'
>): EvmtsContract<TName, THumanReadableAbi, TBytecode, TDeployedBytecode> => {
	const abi = parseAbi(humanReadableAbi as any)
	const methods = abi.filter((field) => {
		return field.type === 'function'
	})
	return {
		bytecode,
		deployedBytecode,
		name,
		abi: abi as any,
		humanReadableAbi,
		// TODO make this more internally typesafe
		events: eventsFactory({ abi, bytecode, deployedBytecode }) as any,
		// TODO make this more internally typesafe
		write: writeFactory({ methods, bytecode, deployedBytecode }) as any,
		// TODO make this more internally typesafe
		read: readFactory({ methods, bytecode, deployedBytecode }) as any,
	}
}

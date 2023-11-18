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
>({
	humanReadableAbi,
	name,
	bytecode,
}: Pick<
	EvmtsContract<TName, THumanReadableAbi, TBytecode>,
	'name' | 'humanReadableAbi' | 'bytecode'
>): EvmtsContract<TName, THumanReadableAbi, TBytecode> => {
	const abi = parseAbi(humanReadableAbi as any)
	const methods = abi.filter((field) => {
		return field.type === 'function'
	})
	return {
		bytecode,
		name,
		abi: abi as any,
		humanReadableAbi,
		// TODO make this more internally typesafe
		events: eventsFactory({ abi, bytecode }) as any,
		// TODO make this more internally typesafe
		write: writeFactory({ methods, bytecode }) as any,
		// TODO make this more internally typesafe
		read: readFactory({ methods, bytecode }) as any,
	}
}

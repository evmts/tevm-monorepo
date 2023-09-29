import type { EvmtsContract } from './EvmtsContract'
import { eventsFactory } from './event/eventFactory'
import { readFactory } from './read/readFactory'
import { writeFactory } from './write/writeFactory'
import { parseAbi } from 'abitype'

export const evmtsContractFactory = <
	TName extends string,
	THumanReadableAbi extends readonly string[],
>({
	humanReadableAbi,
	name,
}: Pick<
	EvmtsContract<TName, THumanReadableAbi>,
	'name' | 'humanReadableAbi'
>): EvmtsContract<TName, THumanReadableAbi> => {
	const abi = parseAbi(humanReadableAbi as any)
	const methods = abi.filter((field) => {
		return field.type === 'function'
	})
	return {
		name,
		abi: abi as any,
		humanReadableAbi,
		// TODO make this more internally typesafe
		events: eventsFactory({ abi }) as any,
		// TODO make this more internally typesafe
		write: writeFactory({ methods }) as any,
		// TODO make this more internally typesafe
		read: readFactory({ methods }) as any,
	}
}

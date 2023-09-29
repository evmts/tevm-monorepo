import type { EvmtsContract } from './EvmtsContract'
import { eventsFactory } from './event/eventFactory'
import { readFactory } from './read/readFactory'
import { writeFactory } from './write/writeFactory'
import type { Abi } from 'abitype'
import { formatAbi } from 'abitype'

export const evmtsContractFactory = <TName extends string, TAbi extends Abi>({
	abi,
	name,
}: Pick<EvmtsContract<TName, TAbi>, 'name' | 'abi'>): EvmtsContract<
	TName,
	TAbi
> => {
	const methods = abi.filter((field) => {
		return field.type === 'function'
	})
	return {
		name,
		abi,
		humanReadableAbi: formatAbi(abi),
		// TODO make this more internally typesafe
		events: eventsFactory({ abi }) as any,
		// TODO make this more internally typesafe
		write: writeFactory({ methods }) as any,
		// TODO make this more internally typesafe
		read: readFactory({ methods }) as any,
	}
}

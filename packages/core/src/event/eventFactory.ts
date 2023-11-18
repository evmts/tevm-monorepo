import type { Abi, AbiEvent } from 'abitype'
import { formatAbi } from 'abitype'
import type { Hex } from 'viem'

export type ValueOf<T> = T[keyof T]

export const eventsFactory = ({
	abi,
	bytecode,
}: {
	abi: Abi
	bytecode?: Hex | undefined
}) =>
	Object.fromEntries(
		abi
			.filter((field) => {
				return field.type === 'event'
			})
			.map((eventAbi) => {
				const creator = (params: any) => {
					return {
						eventName: (eventAbi as AbiEvent).name,
						abi: [eventAbi],
						humanReadableAbi: formatAbi([eventAbi]),
						bytecode,
						...params,
					}
				}
				creator.abi = [eventAbi]
				creator.eventName = (eventAbi as AbiEvent).name
				creator.humanReadableAbi = formatAbi([eventAbi])
				creator.bytecode = bytecode
				return [(eventAbi as AbiEvent).name, creator]
			}),
	)

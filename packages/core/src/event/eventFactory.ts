import type { Abi, AbiEvent } from 'abitype'
import { formatAbi } from 'abitype'
import type { Hex } from 'viem'

export type ValueOf<T> = T[keyof T]

export const eventsFactory = ({
	abi,
	bytecode,
	deployedBytecode,
}: {
	abi: Abi
	bytecode?: Hex | undefined
	deployedBytecode?: Hex | undefined
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
						deployedBytecode,
						...params,
					}
				}
				creator.abi = [eventAbi]
				creator.eventName = (eventAbi as AbiEvent).name
				creator.humanReadableAbi = formatAbi([eventAbi])
				creator.bytecode = bytecode
				creator.deployedBytecode = deployedBytecode
				return [(eventAbi as AbiEvent).name, creator]
			}),
	)

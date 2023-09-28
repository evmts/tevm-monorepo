import type { Abi, AbiEvent } from 'abitype'
import { formatAbi } from 'abitype'

export type ValueOf<T> = T[keyof T]

export const eventsFactory = ({
	abi,
}: {
	abi: Abi
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
						...params,
					}
				}
				creator.abi = [eventAbi]
				creator.eventName = (eventAbi as AbiEvent).name
				creator.humanReadableAbi = formatAbi([eventAbi])
				return [(eventAbi as AbiEvent).name, creator]
			}),
	)

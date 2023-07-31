import type { Abi, AbiEvent, Address } from 'abitype'
import { formatAbi } from 'abitype'

export type ValueOf<T> = T[keyof T]

export const eventsFactory =
	({
		abi,
		addresses,
	}: {
		abi: Abi
		addresses: Record<number, Address>
	}) =>
	({ chainId }: { chainId?: number | undefined } = {}) =>
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
							address: chainId
								? addresses[chainId as number]
								: Object.values(addresses)[0],
							...params,
						}
					}
					creator.address = chainId
						? addresses[chainId as number]
						: Object.values(addresses)[0]
					creator.abi = [eventAbi]
					creator.eventName = (eventAbi as AbiEvent).name
					creator.humanReadableAbi = formatAbi([eventAbi])
					return [(eventAbi as AbiEvent).name, creator]
				}),
		)

import type { Abi, AbiFunction, Address } from 'abitype'
import { formatAbi } from 'abitype'

export type ValueOf<T> = T[keyof T]

export const writeFactory =
	({
		addresses,
		methods,
	}: { addresses: Record<number, Address>; methods: Abi }) =>
	({ chainId }: { chainId?: number | undefined } = {}) =>
		Object.fromEntries(
			methods.map((method) => {
				const creator = (...args: any[]) => {
					// need to handle case where there is an overload
					// TODO make this more efficient
					const methodAbi = methods.filter(
						(m) => (m as AbiFunction).name === (method as AbiFunction)?.name,
					)
					const maybeArgs = args.length > 0 ? { args } : {}
					return {
						abi: methodAbi,
						humanReadableAbi: formatAbi([method]),
						functionName: (method as AbiFunction).name,
						// TODO we are currently defaulting to the first address in the case of no chain id
						// There has to be a better way like providing an explicit default property in the address config
						address:
							addresses[chainId as number] ??
							Object.values(addresses)[0] ??
							undefined,
						...maybeArgs,
					}
				}
				creator.address = addresses[chainId as number] ?? undefined
				creator.abi = [method]
				creator.humanReadableAbi = formatAbi([method])
				return [(method as AbiFunction).name, creator]
			}),
		)

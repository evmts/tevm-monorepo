import type { Abi, AbiFunction } from 'abitype'
import { formatAbi } from 'abitype'
import type { Hex } from 'viem'

export const readFactory = ({
	methods,
	bytecode,
}: { methods: Abi; bytecode?: Hex | undefined }) =>
	Object.fromEntries(
		methods
			.filter(({ type }) => type === 'function')
			.map((method) => {
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
						bytecode,
						...maybeArgs,
					}
				}
				creator.abi = [method]
				creator.humanReadableAbi = formatAbi([method])
				creator.bytecode = bytecode
				return [(method as AbiFunction).name, creator]
			}),
	)

import type { Abi, AbiFunction } from 'abitype'
import { formatAbi } from 'abitype'
import type { Hex } from 'viem'

export type ValueOf<T> = T[keyof T]

export const writeFactory = ({
	methods,
	bytecode,
	deployedBytecode,
}: {
	methods: Abi
	bytecode?: Hex | undefined
	deployedBytecode?: Hex | undefined
}) =>
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
					bytecode,
					deployedBytecode,
					// TODO we are currently defaulting to the first address in the case of no chain id
					// There has to be a better way like providing an explicit default property in the address config
					...maybeArgs,
				}
			}
			creator.abi = [method]
			creator.humanReadableAbi = formatAbi([method])
			creator.bytecode = bytecode
			creator.deployedBytecode = deployedBytecode
			return [(method as AbiFunction).name, creator]
		}),
	)

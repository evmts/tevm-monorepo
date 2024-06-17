import { formatAbi } from '@tevm/utils'

/**
 * Creates write action creators from parameters
 * @internal
 * @param {object} params
 * @param {import('@tevm/utils').Abi} params.methods
 * @param {import('@tevm/utils').Hex} [params.code]
 * @param {import('@tevm/utils').Address} [params.address]
 */
export const writeFactory = ({ methods, address, code }) =>
	Object.fromEntries(
		methods.map((method) => {
			/**
			 * @param {...any} args
			 */
			const creator = (...args) => {
				// need to handle case where there is an overload
				// TODO make this more efficient
				const methodAbi = methods.filter(
					(m) =>
						/**@type {import('@tevm/utils').AbiFunction}*/ (m).name ===
						/**@type {import('@tevm/utils').AbiFunction}*/ (method)?.name,
				)
				// viem and wagmi barf if we padd in undefined or [] for args so do this to accomidate viem and wagmi
				const maybeArgs = args.length > 0 ? { args } : {}
				return {
					abi: methodAbi,
					humanReadableAbi: formatAbi([method]),
					functionName: /**@type {import('@tevm/utils').AbiFunction}*/ (method).name,
					...(address !== undefined ? { address, to: address } : {}),
					...maybeArgs,
				}
			}
			creator.abi = [method]
			creator.humanReadableAbi = formatAbi([method])
			creator.code = code
			creator.address = address
			creator.to = address
			return [/**@type {import('@tevm/utils').AbiFunction}*/ (method).name, creator]
		}),
	)

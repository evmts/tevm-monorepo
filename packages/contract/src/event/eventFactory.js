import { formatAbi } from 'abitype'

/**
 * Creates the event action creators from parameters
 * @internal
 * @param {object} params
 * @param {import('abitype').Abi} params.abi
 * @param {import('viem').Hex} [params.bytecode]
 * @param {import('viem').Hex} [params.deployedBytecode]
 * @param {import('abitype').Address} [params.address]
 */
export const eventsFactory = ({ abi, bytecode, deployedBytecode, address }) =>
	Object.fromEntries(
		abi
			.filter((field) => {
				return field.type === 'event'
			})
			.map((eventAbi) => {
				/**
				 * @param {object} params
				 */
				const creator = (params) => {
					return {
						eventName: /**@type any*/ (eventAbi).name,
						abi: [eventAbi],
						humanReadableAbi: formatAbi([eventAbi]),
						bytecode,
						deployedBytecode,
						address,
						...params,
					}
				}
				creator.abi = [eventAbi]
				creator.eventName = /**@type any*/ (eventAbi).name
				creator.humanReadableAbi = formatAbi([eventAbi])
				creator.bytecode = bytecode
				creator.deployedBytecode = deployedBytecode
				creator.address = address
				return [/**@type any*/ (eventAbi).name, creator]
			}),
	)

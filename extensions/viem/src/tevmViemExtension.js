import { parse, stringify } from 'superjson'

/**
 * @type {import('./ViemTevmExtension.js').ViemTevmExtension}
 */
export const tevmViemExtension = () => {
	return (client) => {
		/**
		 * @type {import('./ViemTevmClient.js').ViemTevmClient['tevmRequest']}
		 */
		const tevmRequest = async (request) => {
			return /** @type {any} */ (
				parse(
					JSON.stringify(
						await client.request({
							method: /** @type {any}*/ (request.method),
							params: /** @type {any}*/ (JSON.parse(stringify(request.params))),
						}),
					),
				)
			)
		}
		return {
			tevmRequest,
			runScript: async (action) => {
				return /** @type {any} */ (
					tevmRequest({
						method: 'tevm_script',
						params: /** @type any*/ (action),
					})
				)
			},
			putAccount: async (action) => {
				return tevmRequest({
					method: 'tevm_putAccount',
					params: action,
				})
			},
			putContractCode: async (action) => {
				return tevmRequest({
					method: 'tevm_putContractCode',
					params: action,
				})
			},
			runCall: async (action) => {
				return tevmRequest({
					method: 'tevm_call',
					params: action,
				})
			},
			runContractCall: async (action) => {
				return /** @type {any} */ (
					tevmRequest({
						method: 'tevm_contractCall',
						params: /** @type {any}*/ (action),
					})
				)
			},
		}
	}
}

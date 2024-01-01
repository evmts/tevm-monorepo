/**
 * @type {import('./ViemTevmExtension.js').ViemTevmExtension}
 */
export const tevmViemExtension = () => {
	return (client) => {
		/**
		 * @type {import('@tevm/api').TevmClient['request']}
		 */
		const request = /** @type {any} */ (client.request)
		return {
			tevm: {
				request,
				script: async (action) => {
					return /** @type {any} */ (
						request({
							method: 'tevm_script',
							jsonrpc: '2.0',
							params: /** @type any*/ (action),
						})
					)
				},
				account: async (action) => {
					return /** @type {any} */ (
						request({
							method: 'tevm_account',
							jsonrpc: '2.0',
							params: action,
						})
					)
				},
				call: async (action) => {
					return /** @type {any} */ (
						request({
							method: 'tevm_call',
							jsonrpc: '2.0',
							params: action,
						})
					)
				},
				contract: async (action) => {
					return /** @type {any} */ (
						request({
							method: 'tevm_contract',
							jsonrpc: '2.0',
							params: /** @type {any}*/ (action),
						})
					)
				},
			},
		}
	}
}

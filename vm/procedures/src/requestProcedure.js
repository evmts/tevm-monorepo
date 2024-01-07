import { UnknownMethodError } from './errors/UnknownMethodError.js'
import { accountProcedure, callProcedure, scriptProcedure } from './index.js'

/**
 * Handles a single tevm json rpc request
 * Infers return type from request
 * @param {import('@ethereumjs/evm').EVM} evm
 * @returns {import('@tevm/api').TevmClient['request']}
 * @example
 * ```typescript
 * const handler = createJsonrpcClient(tevm)
 * const res = await handler({
 *  jsonrpc: '2.0',
 *  id: '1',
 *  method: 'tevm_call',
 *  params: {
 *    to: '0x000000000'
 *  }
 * })
 * ```
 */
export const requestProcedure = (evm) => {
	/**
	 * @type {import('@tevm/api').TevmClient['request']}
	 */
	return async (request) => {
		switch (request.method) {
			case 'tevm_call':
				return /**@type any*/ (callProcedure)(evm)(request)
			case /** @type {any} */ ('tevm_contract'):
				return /**@type any*/ ({
					id: /** @type any*/ (request).id,
					jsonrpc: '2.0',
					error: {
						code: 'UnknownMethodError',
						message:
							'UnknownMethodError: tevm_contract is not supported. Encode the contract arguments and use tevm_call instead.',
					},
				})
			case 'tevm_account':
				return /**@type any*/ (accountProcedure)(evm)(request)
			case 'tevm_script':
				return /**@type any*/ (scriptProcedure)(evm)(request)
			default: {
				const err = new UnknownMethodError(request)
				return /** @type {any}*/ ({
					id: /** @type any*/ (request).id ?? null,
					method: /** @type any*/ (request).method,
					jsonrpc: '2.0',
					error: {
						code: err._tag,
						message: err.message,
					},
				})
			}
		}
	}
}

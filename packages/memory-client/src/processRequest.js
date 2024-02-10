import { proxyRequest } from './proxyRequest.js'
import {
	UnexpectedInternalServerError,
	UnsupportedMethodError,
} from '@tevm/errors'
import { requestProcedure } from '@tevm/procedures'

// TODO let's refactor the JSON-RPC switch statement in vm/vm/src/procedures/somewhere.js to instead grab
// handlers off of a handler object. Then here we can make this DRY by simply checking to see if the key exists
// on that same object
/**
 * Checks if tevm supports a given method
 * @param {string} method
 * @returns {boolean}
 */
const supportedMethods = new Set([
	'tevm_getAccount',
	'tevm_setAccount',
	'tevm_call',
	'tevm_script',
	'eth_blockNumber',
	'eth_chainId',
	'eth_getCode',
	'eth_getStorageAt',
	'eth_gasPrice',
	'eth_getBalance',
	'debug_traceCall',
])

const throwOnUnsupportedMethods = true

/**
 * @internal
 * Given a vm and proxyUrl creates a request handler to process arbitrary
 * JSON-RPC requests. It will process requests tevm supports locally using
 * `requestProcedure` and proxy all other requests to the given proxyUrl
 * @param {import('@ethereumjs/vm').VM} vm
 * @param {string} [proxyUrl] Optional url to proxy requests to
 * @returns {import('@tevm/procedures-types').TevmJsonRpcRequestHandler}
 */
export const processRequest = (vm, proxyUrl) => {
	return (request) => {
		try {
			if (!supportedMethods.has(request.method)) {
				if (throwOnUnsupportedMethods) {
					const err = new UnsupportedMethodError(request.method)
					console.error(err)
					return Promise.resolve({
						id: request.id ?? null,
						method: request.method,
						jsonrpc: '2.0',
						error: {
							code: err._tag,
							message: err.message,
						},
					})
				}
				return proxyRequest(proxyUrl)(request)
			}
			return requestProcedure(vm)(/**@type any*/(request))
		} catch (e) {
			console.error(e)
			const err = new UnexpectedInternalServerError(request.method)
			return Promise.resolve({
				id: request.id ?? null,
				method: request.method,
				jsonrpc: '2.0',
				error: {
					code: err._tag,
					message: err.message,
				},
			})
		}
	}
}

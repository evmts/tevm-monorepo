// import type { RunContractCallAction, RunContractCallResponse, PutAccountAction, PutContractCodeAction, RunCallAction, RunScriptAction, RunScriptResponse } from '@tevm/actions'
// import type { TevmJsonRpcRequest, BackendReturnType, TevmPutAccountResponse, TevmPutContractCodeResponse, TevmCallResponse } from '@tevm/jsonrpc'
// import type { Abi } from 'abitype'
import { parse, stringify } from 'superjson'
import { http } from 'viem'

/**
 * @param {string} rpcUrl
 * @returns {import('./Client.js').Client}
 */
export function createClient(rpcUrl) {
	const httpRequest = http(rpcUrl)({})

	/**
	 * @type {import('./Client.js').Client['request']}
	 */
	const request = async (r) => {
		const asSuperJson = JSON.parse(stringify(r))
		return httpRequest.request(asSuperJson)
	}

	return {
		request,
		runScript: async (action) => {
			const res = await request({
				jsonrpc: '2.0',
				method: 'tevm_script',
				params: /** @type any */ (action),
			})
			const parsedSuperjson = parse(JSON.stringify(res.result))
			return /** @type {any}*/ (parsedSuperjson)
		},

		putAccount: async (action) => {
			const res = await request({
				jsonrpc: '2.0',
				method: 'tevm_putAccount',
				params: /** @type any */ (action),
			})
			const parsedSuperjson = parse(JSON.stringify(res.result))
			return /** @type any */ (parsedSuperjson)
		},

		putContractCode: async (action) => {
			const res = await request({
				jsonrpc: '2.0',
				method: 'tevm_putContractCode',
				params: action,
			})
			const parsedSuperjson = parse(JSON.stringify(res.result))
			return /** @type any */ (parsedSuperjson)
		},

		runCall: async (action) => {
			const res = await request({
				jsonrpc: '2.0',
				method: 'tevm_call',
				params: /** @type any */ (action),
			})
			const parsedSuperjson = parse(JSON.stringify(res.result))
			return /** @type any */ (parsedSuperjson)
		},

		runContractCall: async (action) => {
			const res = await request({
				jsonrpc: '2.0',
				method: 'tevm_contractCall',
				params: /** @type any */ (action),
			})
			const parsedSuperjson = parse(JSON.stringify(res.result))
			return /** @type any */ (parsedSuperjson)
		},
	}
}

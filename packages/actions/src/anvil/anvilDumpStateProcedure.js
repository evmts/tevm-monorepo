
// TODO this procedure is implemented completely wrong. Anvil encodes the state into a single hex string? Or maybe the type is wrong?

import { dumpStateProcedure } from '../DumpState/dumpStateProcedure.js'

/**
 * @experimental
 * Request handler for anvil_dumpState JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilDumpStateProcedure}
 */
export const anvilDumpStateJsonRpcProcedure = (client) => {
	return async (request) => {
		return /** @type any*/ ({
			...(await dumpStateProcedure(client)({
				...(request.id ? { id: request.id } : {}),
				jsonrpc: '2.0',
				method: 'tevm_dumpState',
			})),
			method: request.method,
		})
	}
}

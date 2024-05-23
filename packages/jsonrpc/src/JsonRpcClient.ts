import type { JsonRpcProcedure } from './JsonRpcProcedure.js'

/**
 * A client for making JsonRpc requests over http
 */
export type JsonRpcClient = {
	request: JsonRpcProcedure<string, unknown, unknown, string | number>
}

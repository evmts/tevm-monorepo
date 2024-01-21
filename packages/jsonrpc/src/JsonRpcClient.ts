import type { JsonRpcProcedure } from './JsonRpcProcedure.js'

/**
 * A client for making JsonRpc requests over http
 */
export type JsonRpcClient = {
	url: string
	request: JsonRpcProcedure<string, unknown, unknown, string>
}

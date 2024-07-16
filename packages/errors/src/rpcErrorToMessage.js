/**
 * @type {Record<import('./requestErrors.js').RpcErrorCode, string>}
 */
export const rpcErrorCodeToMessage = {
	[-1]: 'Unknwon error',
	[-32700]: 'Parse error',
	[-32600]: 'Invalid request',
	[-32601]: 'Method not found',
	[-32602]: 'Invalid params',
	[-32603]: 'Internal error',
	[-32000]: 'Invalid input',
	[-32001]: 'Resource not found',
	[-32002]: 'Resource unavailable',
	[-32003]: 'Transaction rejected',
	[-32004]: 'Method not supported',
	[-32005]: 'Limit exceeded',
	[-32006]: 'JSON-RPC version not supported',
	[-32042]: 'Method not found',
}

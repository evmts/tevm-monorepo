// Define these types directly to avoid circular dependencies
type TevmJsonRpcRequestHandler = (request: any) => Promise<any>
type TevmJsonRpcBulkRequestHandler = (requests: any[]) => Promise<any[]>

export type TevmSendApi = {
	send: TevmJsonRpcRequestHandler
	sendBulk: TevmJsonRpcBulkRequestHandler
}

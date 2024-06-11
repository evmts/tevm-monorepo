import type { TevmJsonRpcBulkRequestHandler, TevmJsonRpcRequestHandler } from '@tevm/procedures'

export type TevmSendApi = {
	send: TevmJsonRpcRequestHandler
	sendBulk: TevmJsonRpcBulkRequestHandler
}

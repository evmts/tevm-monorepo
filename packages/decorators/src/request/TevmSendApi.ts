import type { TevmJsonRpcBulkRequestHandler, TevmJsonRpcRequestHandler } from '@tevm/actions'

export type TevmSendApi = {
	send: TevmJsonRpcRequestHandler
	sendBulk: TevmJsonRpcBulkRequestHandler
}

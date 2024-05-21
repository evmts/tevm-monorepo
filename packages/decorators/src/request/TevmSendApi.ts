import type { TevmJsonRpcBulkRequestHandler, TevmJsonRpcRequestHandler } from '@tevm/procedures-types'

export type TevmSendApi = {
	send: TevmJsonRpcRequestHandler
	sendBulk: TevmJsonRpcBulkRequestHandler
}

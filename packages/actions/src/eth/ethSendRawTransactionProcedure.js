import { InvalidParamsError } from '@tevm/errors'
import { BlobEIP4844Transaction, TransactionFactory } from '@tevm/tx'
import { bytesToHex, hexToBytes } from '@tevm/utils'

/**
 * Request handler for eth_sendRawTransaction JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthSendRawTransactionJsonRpcProcedure}
 */
export const ethSendRawTransactionJsonRpcProcedure = (client) => {
	return async (request) => {
		const vm = await client.getVm()
		const [serializedTx] = request.params
		const txBuf = hexToBytes(serializedTx)
		// Blob Transactions sent over RPC are expected to be in Network Wrapper format
		const tx =
			txBuf[0] === 0x03
				? BlobEIP4844Transaction.fromSerializedBlobTxNetworkWrapper(txBuf, { common: vm.common.vmConfig })
				: TransactionFactory.fromSerializedData(txBuf, { common: vm.common.vmConfig })
		if (!tx.isSigned()) {
			const err = new InvalidParamsError('Transaction must be signed!')
			return {
				method: request.method,
				jsonrpc: '2.0',
				...(request.id ? { id: request.id } : {}),
				error: {
					code: err._tag,
					message: err.message,
				},
			}
		}
		const txPool = await client.getTxPool()
		await txPool.add(tx, true)
		return {
			method: request.method,
			result: bytesToHex(tx.hash()),
			jsonrpc: '2.0',
			...(request.id ? { id: request.id } : {}),
		}
	}
}

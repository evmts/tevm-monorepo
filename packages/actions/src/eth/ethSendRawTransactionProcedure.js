import { InvalidParamsError } from '@tevm/errors'
import { createTxFromRLP } from '@tevm/tx'
import { bytesToHex, hexToBytes } from '@tevm/utils'
import { handleAutomining } from '../Call/handleAutomining.js'

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
		// Use createTxFromRLP for all transaction types
		const tx = createTxFromRLP(txBuf, { common: vm.common.ethjsCommon })
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

		if (client.miningConfig.type === 'auto') {
			await handleAutomining(client, bytesToHex(tx.hash()), false, true)
		}
		// For interval mining, transactions are automatically processed by the interval timer
		// No additional action needed here - transactions stay in mempool until next interval

		return {
			method: request.method,
			result: bytesToHex(tx.hash()),
			jsonrpc: '2.0',
			...(request.id ? { id: request.id } : {}),
		}
	}
}

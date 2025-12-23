import { createTxFromRLP } from '@evmts/zevm/tx'
import { InvalidParamsError } from '@tevm/errors'
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
				...(request.id !== undefined ? { id: request.id } : {}),
				error: {
					code: err._tag,
					message: err.message,
				},
			}
		}
		const txPool = await client.getTxPool()
		const addResult = await txPool.add(tx, true)
		if (addResult.error !== null) {
			const err = new InvalidParamsError('Invalid transaction. Unable to add transaction to pool', {
				cause: new Error(addResult.error),
			})
			return {
				method: request.method,
				jsonrpc: '2.0',
				...(request.id !== undefined ? { id: request.id } : {}),
				error: {
					code: err._tag,
					message: err.message,
				},
			}
		}

		if (client.miningConfig.type === 'auto') {
			const autominingResult = await handleAutomining(client, bytesToHex(tx.hash()), false, true)
			if (autominingResult?.errors?.length) {
				const error = autominingResult.errors[0]
				if (!error) {
					throw new Error('Automining failed without error details')
				}
				return {
					method: request.method,
					jsonrpc: '2.0',
					...(request.id !== undefined ? { id: request.id } : {}),
					error: {
						code: error.code,
						message: error.message,
						data: {
							errors: autominingResult.errors.map(({ message }) => message),
						},
					},
				}
			}
		}
		// For interval mining, transactions are automatically processed by the interval timer
		// No additional action needed here - transactions stay in mempool until next interval

		return {
			method: request.method,
			result: bytesToHex(tx.hash()),
			jsonrpc: '2.0',
			...(request.id !== undefined ? { id: request.id } : {}),
		}
	}
}

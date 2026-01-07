import { debugTraceTransactionJsonRpcProcedure, type PrestateTraceResult } from '@tevm/actions'
import { type TevmNode } from '@tevm/node'
import { type Address, type Client } from '@tevm/utils'
import { handleTransaction } from '../../common/handleTransaction.js'
import type { ContainsTransactionAny } from '../../common/types.js'
import { getBalanceChange } from './getBalanceChange.js'
import { getTokenBalanceChange } from './getTokenBalanceChange.js'
import type { HandleTransactionResult } from './types.js'

/**
 * Replay a transaction with a prestate tracer to figure out the balance changes
 * @param node - The TEVM node
 * @param txHash - The transaction hash
 * @returns Promise with balance change getter functions
 */
export const getDiffMethodsFromPrestateTrace = async (
	client: Client | TevmNode,
	tx: ContainsTransactionAny | Promise<ContainsTransactionAny>,
): Promise<HandleTransactionResult> => {
	const { node, txHash } = await handleTransaction(client, tx)

	const res = await debugTraceTransactionJsonRpcProcedure(node)({
		jsonrpc: '2.0',
		method: 'debug_traceTransaction',
		params: [{ transactionHash: txHash, tracer: 'prestateTracer', tracerConfig: { diffMode: true } }],
		id: 1,
	})

	const prestateTrace = res.result as PrestateTraceResult<true>

	return {
		getBalanceChange: (address: Address) => getBalanceChange(prestateTrace, address.toLowerCase() as Address),
		getTokenBalanceChange: (tokenAddress: Address, address: Address) =>
			getTokenBalanceChange(
				node,
				tokenAddress.toLowerCase() as Address,
				address.toLowerCase() as Address,
				prestateTrace,
			),
	}
}

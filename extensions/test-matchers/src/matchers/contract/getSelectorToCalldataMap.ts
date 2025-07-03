import { debugTraceTransactionJsonRpcProcedure, type FourbyteTraceResult } from '@tevm/actions'
import { type TevmNode } from '@tevm/node'
import { isHex, type Client } from 'viem'
import type { ContainsTransactionAny } from '../../common/types.js'
import { handleTransaction } from '../../common/handleTransaction.js'
import { Hex } from 'ox'

export const getSelectorToCalldataMap = async (
	client: Client | TevmNode,
	tx: ContainsTransactionAny | Promise<ContainsTransactionAny>,
) => {
	const { node, txHash } = await handleTransaction(client, tx)

	const { result, error } = await debugTraceTransactionJsonRpcProcedure(node)({
		jsonrpc: '2.0',
		method: 'debug_traceTransaction',
		params: [{ transactionHash: txHash, tracer: '4byteTracer' }],
		id: 1,
	})

	if (error) throw new Error('Error tracing transaction to retrieve function calls', { cause: error })

	const trace = result as FourbyteTraceResult
	const calldataMap = new Map(Object.entries(trace).filter(([selector]) => isHex(selector))) as Map<Hex.Hex, Hex.Hex[]>

	return calldataMap
}

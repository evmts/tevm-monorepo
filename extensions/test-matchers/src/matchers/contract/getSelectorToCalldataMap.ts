import { debugTraceTransactionJsonRpcProcedure, type FourbyteTraceResult } from '@tevm/actions'
import { type TevmNode } from '@tevm/node'
import { type Address, type Client, getAddress, type Hex, isHex } from 'viem'
import { handleTransaction } from '../../common/handleTransaction.js'
import type { ContainsTransactionAny } from '../../common/types.js'

export const getSelectorToCalldataMap = async (
	client: Client | TevmNode,
	contractAddress: Address,
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
	const contractTrace = trace[getAddress(contractAddress)] ?? {}
	const calldataMap = new Map(Object.entries(contractTrace).filter(([selector]) => isHex(selector))) as Map<Hex, Hex[]>

	return calldataMap
}

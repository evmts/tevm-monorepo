import { debugTraceTransactionJsonRpcProcedure } from '@tevm/actions'
import { type TevmNode } from '@tevm/node'
import { type Client } from 'viem'
import type { ContainsTransactionAny } from '../../common/types.js'
import { handleTransaction } from '../../common/handleTransaction.js'
import fs from 'fs'

export const getFunctionsCalled = async (
	client: Client | TevmNode,
	tx: ContainsTransactionAny | Promise<ContainsTransactionAny>,
) => {
	const { node, txHash } = await handleTransaction(client, tx)

	const transactionRes = await debugTraceTransactionJsonRpcProcedure(node)({
		jsonrpc: '2.0',
		method: 'debug_traceTransaction',
		params: [{ transactionHash: txHash }],
		id: 1,
	})

  // fs.writeFileSync('transactionRes.json', JSON.stringify(transactionRes.result, null, 2))
}

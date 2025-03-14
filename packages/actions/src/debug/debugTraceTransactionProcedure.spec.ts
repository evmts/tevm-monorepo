import { createAddress } from '@tevm/address'
import { SimpleContract } from '@tevm/contract'
import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { callHandler } from '../Call/callHandler.js'
import { deployHandler } from '../Deploy/deployHandler.js'
import { debugTraceTransactionJsonRpcProcedure } from './debugTraceTransactionProcedure.js'

describe('debugTraceTransactionJsonRpcProcedure', () => {
	it('should trace a transaction and return the expected result', async () => {
		const client = createTevmNode({ miningConfig: { type: 'auto' } })
		const procedure = debugTraceTransactionJsonRpcProcedure(client)

		const contract = SimpleContract.withAddress(createAddress(420).toString())

		await deployHandler(client)(contract.deploy(1n))

		const sendTxResult = await callHandler(client)({
			createTransaction: true,
			...contract.write.set(69n),
		})

		if (!sendTxResult.txHash) {
			throw new Error('Transaction failed')
		}

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'debug_traceTransaction',
			params: [
				{
					transactionHash: sendTxResult.txHash,
					tracer: 'callTracer',
				},
			],
			id: 1,
		})

		expect(result).toMatchInlineSnapshot(`
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "debug_traceTransaction",
  "result": {
    "failed": false,
    "gas": "0x0",
    "returnValue": "0x",
    "structLogs": [],
  },
}
`)
	})
})

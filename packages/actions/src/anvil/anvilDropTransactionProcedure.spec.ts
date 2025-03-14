import { createTevmNode } from '@tevm/node'
import { type Hex, hexToBytes } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { callHandler } from '../Call/callHandler.js'
import { anvilDropTransactionJsonRpcProcedure } from './anvilDropTransactionProcedure.js'

describe('anvilDropTransactionJsonRpcProcedure', () => {
	let node: ReturnType<typeof createTevmNode>

	beforeEach(() => {
		node = createTevmNode()
	})

	it('should successfully drop a transaction from the pool', async () => {
		// Add a transaction to the pool
		const to = `0x${'69'.repeat(20)}` as const
		const callResult = await callHandler(node)({
			createTransaction: true,
			to,
			value: 420n,
			skipBalance: true,
		})

		const txHash = callResult.txHash as Hex

		// Verify the transaction is in the pool
		const txPool = await node.getTxPool()
		expect(txPool.getByHash([hexToBytes(txHash)])).toMatchInlineSnapshot(`
			[
			  {
			    "accessList": [],
			    "chainId": "0x384",
			    "data": "0x",
			    "gasLimit": "0x5a3c",
			    "maxFeePerGas": "0x7",
			    "maxPriorityFeePerGas": "0x0",
			    "nonce": "0x0",
			    "r": undefined,
			    "s": undefined,
			    "to": "0x6969696969696969696969696969696969696969",
			    "type": "0x2",
			    "v": undefined,
			    "value": "0x1a4",
			  },
			]
		`)

		const procedure = anvilDropTransactionJsonRpcProcedure(node)
		const result = await procedure({
			method: 'anvil_dropTransaction',
			params: [{ transactionHash: txHash }],
			jsonrpc: '2.0',
		})

		expect(result).toEqual({
			method: 'anvil_dropTransaction',
			jsonrpc: '2.0',
			result: null,
		})

		// Verify the transaction has been removed from the pool
		expect(await txPool.getByHash([hexToBytes(txHash)])).toMatchInlineSnapshot(`
			[
			  {
			    "accessList": [],
			    "chainId": "0x384",
			    "data": "0x",
			    "gasLimit": "0x5a3c",
			    "maxFeePerGas": "0x7",
			    "maxPriorityFeePerGas": "0x0",
			    "nonce": "0x0",
			    "r": undefined,
			    "s": undefined,
			    "to": "0x6969696969696969696969696969696969696969",
			    "type": "0x2",
			    "v": undefined,
			    "value": "0x1a4",
			  },
			]
		`)
	})

	it('should throw an error if the transaction is not in the pool', async () => {
		const nonExistentTxHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'

		const procedure = anvilDropTransactionJsonRpcProcedure(node)

		await expect(
			procedure({
				method: 'anvil_dropTransaction',
				params: [{ transactionHash: nonExistentTxHash }],
				jsonrpc: '2.0',
			}),
		).rejects.toThrow('Only tx in the txpool are allowed to be dropped')
	})

	it('should handle requests with id', async () => {
		// Add a transaction to the pool
		const to = `0x${'69'.repeat(20)}` as const
		const callResult = await callHandler(node)({
			createTransaction: true,
			to,
			value: 420n,
			skipBalance: true,
		})

		const txHash = callResult.txHash as Hex

		const procedure = anvilDropTransactionJsonRpcProcedure(node)
		const result = await procedure({
			method: 'anvil_dropTransaction',
			params: [{ transactionHash: txHash }],
			jsonrpc: '2.0',
			id: 1,
		})

		expect(result).toEqual({
			method: 'anvil_dropTransaction',
			jsonrpc: '2.0',
			result: null,
			id: 1,
		})
	})
})

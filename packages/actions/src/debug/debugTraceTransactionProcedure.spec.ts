import { SimpleContract } from '@tevm/contract'
import { createTevmNode } from '@tevm/node'
import { assert, describe, expect, it } from 'vitest'
import { contractHandler } from '../Contract/contractHandler.js'
import { deployHandler } from '../Deploy/deployHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { debugTraceTransactionJsonRpcProcedure } from './debugTraceTransactionProcedure.js'

describe('debugTraceTransactionJsonRpcProcedure', () => {
	it('should trace a transaction and return the expected result', async () => {
		const client = createTevmNode()
		const procedure = debugTraceTransactionJsonRpcProcedure(client)

		const { createdAddress } = await deployHandler(client)({ addToBlockchain: true, ...SimpleContract.deploy(1n) })
		assert(createdAddress, 'Contract deployment failed')
		const contract = SimpleContract.withAddress(createdAddress)

		// Run some other transaction before the traced one that will be included in the same block
		await contractHandler(client)({
			addToMempool: true,
			...contract.write.set(42n),
		})

		const { txHash } = await contractHandler(client)({
			addToMempool: true,
			...contract.write.set(45n),
		})
		assert(txHash, 'Transaction failed')
		await mineHandler(client)({})

		expect(
			await procedure({
				jsonrpc: '2.0',
				method: 'debug_traceTransaction',
				params: [
					{
						transactionHash: txHash,
					},
				],
				id: 1,
			}),
		).toMatchSnapshot()
	})

	it.todo('should trace a transaction and return the expected result with callTracer', async () => {
		const client = createTevmNode()
		const procedure = debugTraceTransactionJsonRpcProcedure(client)

		const { createdAddress } = await deployHandler(client)({ addToBlockchain: true, ...SimpleContract.deploy(1n) })
		assert(createdAddress, 'Contract deployment failed')
		const contract = SimpleContract.withAddress(createdAddress)

		// Run some other transaction before the traced one that will be included in the same block
		await contractHandler(client)({
			addToMempool: true,
			...contract.write.set(42n),
		})

		const { txHash } = await contractHandler(client)({
			addToMempool: true,
			...contract.write.set(45n),
		})
		assert(txHash, 'Transaction failed')
		await mineHandler(client)({})

		expect(
			await procedure({
				jsonrpc: '2.0',
				method: 'debug_traceTransaction',
				params: [
					{
						transactionHash: txHash,
						tracer: 'callTracer',
					},
				],
				id: 1,
			}),
		).toMatchSnapshot()
	})

	it('should trace a transaction and return the expected result with prestateTracer', async () => {
		const client = createTevmNode()
		const procedure = debugTraceTransactionJsonRpcProcedure(client)

		const { createdAddress } = await deployHandler(client)({ addToBlockchain: true, ...SimpleContract.deploy(1n) })
		assert(createdAddress, 'Contract deployment failed')
		const contract = SimpleContract.withAddress(createdAddress)

		const { txHash } = await contractHandler(client)({
			addToBlockchain: true,
			...contract.write.set(45n),
		})
		assert(txHash, 'Transaction failed')

		// without diffMode
		expect(
			await procedure({
				jsonrpc: '2.0',
				method: 'debug_traceTransaction',
				params: [
					{
						transactionHash: txHash,
						tracer: 'prestateTracer',
					},
				],
				id: 1,
			}),
		).toMatchSnapshot()

		// with diffMode
		expect(
			await procedure({
				jsonrpc: '2.0',
				method: 'debug_traceTransaction',
				params: [
					{
						transactionHash: txHash,
						tracer: 'prestateTracer',
						tracerConfig: {
							diffMode: true,
						},
					},
				],
				id: 1,
			}),
		).toMatchSnapshot()
	})
})

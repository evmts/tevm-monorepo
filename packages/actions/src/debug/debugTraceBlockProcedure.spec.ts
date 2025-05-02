import { SimpleContract } from '@tevm/contract'
import { createTevmNode } from '@tevm/node'
import { assert, describe, expect, it } from 'vitest'
import { contractHandler } from '../Contract/contractHandler.js'
import { deployHandler } from '../Deploy/deployHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { debugTraceBlockJsonRpcProcedure } from './debugTraceBlockProcedure.js'

describe('debugTraceBlockJsonRpcProcedure', () => {
	it('should trace transactions in a block and return the expected result', async () => {
		const client = createTevmNode()
		const procedure = debugTraceBlockJsonRpcProcedure(client)

		const { createdAddress } = await deployHandler(client)({ addToBlockchain: true, ...SimpleContract.deploy(1n) })
		assert(createdAddress, 'Contract deployment failed')
		const contract = SimpleContract.withAddress(createdAddress)

		await contractHandler(client)({
			addToMempool: true,
			blockTag: 'pending',
			...contract.write.set(42n),
		})
		await contractHandler(client)({
			addToMempool: true,
			blockTag: 'pending',
			...contract.write.set(1312n),
		})
		await mineHandler(client)({})

		expect(
			await procedure({
				jsonrpc: '2.0',
				method: 'debug_traceBlock',
				params: [
					{
						blockTag: 'latest',
					},
				],
				id: 1,
			}),
		).toMatchSnapshot()
	})

	it.todo('should trace transactions in a block and return the expected result', async () => {
		const client = createTevmNode()
		const procedure = debugTraceBlockJsonRpcProcedure(client)

		const { createdAddress } = await deployHandler(client)({ addToBlockchain: true, ...SimpleContract.deploy(1n) })
		assert(createdAddress, 'Contract deployment failed')
		const contract = SimpleContract.withAddress(createdAddress)

		await contractHandler(client)({
			addToMempool: true,
			blockTag: 'pending',
			...contract.write.set(42n),
		})
		await contractHandler(client)({
			addToMempool: true,
			blockTag: 'pending',
			...contract.write.set(1312n),
		})
		await mineHandler(client)({})

		expect(
			await procedure({
				jsonrpc: '2.0',
				method: 'debug_traceBlock',
				params: [
					{
						blockTag: 'latest',
						tracer: 'callTracer',
					},
				],
				id: 1,
			}),
		).toMatchSnapshot()
	})

	it('should trace transactions in a block and return the expected result with prestateTracer', async () => {
		const client = createTevmNode()
		const procedure = debugTraceBlockJsonRpcProcedure(client)

		const { createdAddress } = await deployHandler(client)({ addToBlockchain: true, ...SimpleContract.deploy(1n) })
		assert(createdAddress, 'Contract deployment failed')
		const contract = SimpleContract.withAddress(createdAddress)

		await contractHandler(client)({
			addToMempool: true,
			blockTag: 'pending',
			...contract.write.set(42n),
		})
		await contractHandler(client)({
			addToMempool: true,
			blockTag: 'pending',
			...contract.write.set(1312n),
		})
		await mineHandler(client)({})

		expect(
			await procedure({
				jsonrpc: '2.0',
				method: 'debug_traceBlock',
				params: [
					{
						blockTag: 'latest',
						tracer: 'prestateTracer',
					},
				],
				id: 1,
			}),
		).toMatchSnapshot()

		expect(
			await procedure({
				jsonrpc: '2.0',
				method: 'debug_traceBlock',
				params: [
					{
						blockTag: 'latest',
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

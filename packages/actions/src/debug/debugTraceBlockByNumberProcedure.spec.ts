import { SimpleContract } from '@tevm/contract'
import { createTevmNode } from '@tevm/node'
import { assert, describe, expect, it } from 'vitest'
import { contractHandler } from '../Contract/contractHandler.js'
import { deployHandler } from '../Deploy/deployHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { debugTraceBlockByNumberJsonRpcProcedure } from './debugTraceBlockByNumberProcedure.js'

describe('debugTraceBlockByNumberJsonRpcProcedure', () => {
	it('should trace transactions in a block by number and return the expected result', async () => {
		const client = createTevmNode()
		const procedure = debugTraceBlockByNumberJsonRpcProcedure(client)

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

		const vm = await client.getVm()
		const block = await vm.blockchain.getCanonicalHeadBlock()
		const blockNumber = block.header.number

		expect(
			await procedure({
				jsonrpc: '2.0',
				method: 'debug_traceBlockByNumber',
				params: [`0x${blockNumber.toString(16)}`],
				id: 1,
			}),
		).toMatchSnapshot()
	})

	it('should trace transactions with callTracer', async () => {
		const client = createTevmNode()
		const procedure = debugTraceBlockByNumberJsonRpcProcedure(client)

		const { createdAddress } = await deployHandler(client)({ addToBlockchain: true, ...SimpleContract.deploy(1n) })
		assert(createdAddress, 'Contract deployment failed')
		const contract = SimpleContract.withAddress(createdAddress)

		await contractHandler(client)({
			addToMempool: true,
			blockTag: 'pending',
			...contract.write.set(42n),
		})
		await mineHandler(client)({})

		const vm = await client.getVm()
		const block = await vm.blockchain.getCanonicalHeadBlock()
		const blockNumber = block.header.number

		expect(
			await procedure({
				jsonrpc: '2.0',
				method: 'debug_traceBlockByNumber',
				params: [
					`0x${blockNumber.toString(16)}`,
					{
						tracer: 'callTracer',
					},
				],
				id: 1,
			}),
		).toMatchSnapshot()
	})

	it('should trace transactions with prestateTracer', async () => {
		const client = createTevmNode()
		const procedure = debugTraceBlockByNumberJsonRpcProcedure(client)

		const { createdAddress } = await deployHandler(client)({ addToBlockchain: true, ...SimpleContract.deploy(1n) })
		assert(createdAddress, 'Contract deployment failed')
		const contract = SimpleContract.withAddress(createdAddress)

		await contractHandler(client)({
			addToMempool: true,
			blockTag: 'pending',
			...contract.write.set(42n),
		})
		await mineHandler(client)({})

		const vm = await client.getVm()
		const block = await vm.blockchain.getCanonicalHeadBlock()
		const blockNumber = block.header.number

		expect(
			await procedure({
				jsonrpc: '2.0',
				method: 'debug_traceBlockByNumber',
				params: [
					`0x${blockNumber.toString(16)}`,
					{
						tracer: 'prestateTracer',
					},
				],
				id: 1,
			}),
		).toMatchSnapshot()

		expect(
			await procedure({
				jsonrpc: '2.0',
				method: 'debug_traceBlockByNumber',
				params: [
					`0x${blockNumber.toString(16)}`,
					{
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

	it('should work with "latest" block tag', async () => {
		const client = createTevmNode()
		const procedure = debugTraceBlockByNumberJsonRpcProcedure(client)

		const { createdAddress } = await deployHandler(client)({ addToBlockchain: true, ...SimpleContract.deploy(1n) })
		assert(createdAddress, 'Contract deployment failed')
		const contract = SimpleContract.withAddress(createdAddress)

		await contractHandler(client)({
			addToMempool: true,
			blockTag: 'pending',
			...contract.write.set(42n),
		})
		await mineHandler(client)({})

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'debug_traceBlockByNumber',
			params: ['latest'],
			id: 1,
		})

		expect(result).toMatchSnapshot()
		expect(result.result).toBeDefined()
		expect(Array.isArray(result.result)).toBe(true)
	})
})

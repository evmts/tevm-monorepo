import { SimpleContract } from '@tevm/contract'
import { createTevmNode } from '@tevm/node'
import { bytesToHex } from '@tevm/utils'
import { assert, describe, expect, it } from 'vitest'
import { contractHandler } from '../Contract/contractHandler.js'
import { deployHandler } from '../Deploy/deployHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { debugTraceBlockByHashJsonRpcProcedure } from './debugTraceBlockByHashProcedure.js'

describe('debugTraceBlockByHashJsonRpcProcedure', () => {
	it('should trace transactions in a block by hash and return the expected result', async () => {
		const client = createTevmNode()
		const procedure = debugTraceBlockByHashJsonRpcProcedure(client)

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
		const blockHash = bytesToHex(block.header.hash())

		expect(
			await procedure({
				jsonrpc: '2.0',
				method: 'debug_traceBlockByHash',
				params: [blockHash],
				id: 1,
			}),
		).toMatchSnapshot()
	})

	it('should trace transactions with callTracer', async () => {
		const client = createTevmNode()
		const procedure = debugTraceBlockByHashJsonRpcProcedure(client)

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
		const blockHash = bytesToHex(block.header.hash())

		expect(
			await procedure({
				jsonrpc: '2.0',
				method: 'debug_traceBlockByHash',
				params: [
					blockHash,
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
		const procedure = debugTraceBlockByHashJsonRpcProcedure(client)

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
		const blockHash = bytesToHex(block.header.hash())

		expect(
			await procedure({
				jsonrpc: '2.0',
				method: 'debug_traceBlockByHash',
				params: [
					blockHash,
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
				method: 'debug_traceBlockByHash',
				params: [
					blockHash,
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

	it('should return same result as debug_traceBlock for the same block', async () => {
		const client = createTevmNode()
		const traceByHashProc = debugTraceBlockByHashJsonRpcProcedure(client)

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
		const blockHash = bytesToHex(block.header.hash())

		const resultByHash = await traceByHashProc({
			jsonrpc: '2.0',
			method: 'debug_traceBlockByHash',
			params: [blockHash],
			id: 1,
		})

		expect(resultByHash.result).toBeDefined()
		expect(Array.isArray(resultByHash.result)).toBe(true)
		// Should have at least one transaction trace
		expect((resultByHash.result as Array<any>).length).toBeGreaterThan(0)
	})
})

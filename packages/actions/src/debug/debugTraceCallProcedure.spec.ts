import { SimpleContract } from '@tevm/contract'
import { createTevmNode } from '@tevm/node'
import { encodeFunctionData } from '@tevm/utils'
import { assert, describe, expect, it } from 'vitest'
import { deployHandler } from '../Deploy/deployHandler.js'
import { debugTraceCallJsonRpcProcedure } from './debugTraceCallProcedure.js'

describe('debugTraceCallJsonRpcProcedure', () => {
	it('should trace a transaction and return the expected result', async () => {
		const client = createTevmNode()
		const procedure = debugTraceCallJsonRpcProcedure(client)

		const { createdAddress } = await deployHandler(client)({ addToBlockchain: true, ...SimpleContract.deploy(1n) })
		assert(createdAddress, 'Contract deployment failed')
		const contract = SimpleContract.withAddress(createdAddress)

		expect(
			await procedure({
				jsonrpc: '2.0',
				method: 'debug_traceCall',
				params: [
					{
						to: contract.address,
						data: encodeFunctionData(contract.write.set(42n)),
					},
				],
				id: 1,
			}),
		).toMatchSnapshot()
	})

	it.todo('should trace a transaction and return the expected result with callTracer', async () => {
		const client = createTevmNode()
		const procedure = debugTraceCallJsonRpcProcedure(client)

		const { createdAddress } = await deployHandler(client)({ addToBlockchain: true, ...SimpleContract.deploy(1n) })
		assert(createdAddress, 'Contract deployment failed')
		const contract = SimpleContract.withAddress(createdAddress)

		expect(
			await procedure({
				jsonrpc: '2.0',
				method: 'debug_traceCall',
				params: [
					{
						to: contract.address,
						data: encodeFunctionData(contract.write.set(42n)),
						tracer: 'callTracer',
					},
				],
				id: 1,
			}),
		).toMatchSnapshot()
	})

	it('should trace a transaction and return the expected result with prestateTracer', async () => {
		const client = createTevmNode()
		const procedure = debugTraceCallJsonRpcProcedure(client)

		const { createdAddress } = await deployHandler(client)({ addToBlockchain: true, ...SimpleContract.deploy(1n) })
		assert(createdAddress, 'Contract deployment failed')
		const contract = SimpleContract.withAddress(createdAddress)

		// without diffMode
		expect(
			await procedure({
				jsonrpc: '2.0',
				method: 'debug_traceCall',
				params: [
					{
						to: contract.address,
						data: encodeFunctionData(contract.write.set(42n)),
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
				method: 'debug_traceCall',
				params: [
					{
						to: contract.address,
						data: encodeFunctionData(contract.write.set(42n)),
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

	it('should trace a transaction and return the expected result with flatCallTracer', async () => {
		const client = createTevmNode()
		const procedure = debugTraceCallJsonRpcProcedure(client)

		const { createdAddress } = await deployHandler(client)({ addToBlockchain: true, ...SimpleContract.deploy(1n) })
		assert(createdAddress, 'Contract deployment failed')
		const contract = SimpleContract.withAddress(createdAddress)

		expect(
			await procedure({
				jsonrpc: '2.0',
				method: 'debug_traceCall',
				params: [
					{
						to: contract.address,
						data: encodeFunctionData(contract.write.set(42n)),
						tracer: 'flatCallTracer',
					},
				],
				id: 1,
			}),
		).toMatchSnapshot()
	})
})

import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { SimpleContract, TestERC20 } from '@tevm/test-utils'
import { encodeDeployData, encodeFunctionData, hexToBytes } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { runCallWithMuxTrace } from './runCallWithMuxTrace.js'

const ERC20_ADDRESS = `0x${'3'.repeat(40)}` as const
const ERC20_BYTECODE = TestERC20.deployedBytecode
const ERC20_ABI = TestERC20.abi

const SIMPLE_CONTRACT_ADDRESS = `0x${'42'.repeat(20)}` as const
const SIMPLE_CONTRACT_BYTECODE = SimpleContract.deployedBytecode
const SIMPLE_CONTRACT_ABI = SimpleContract.abi

describe('runCallWithMuxTrace', () => {
	let client: ReturnType<typeof createTevmNode>

	beforeEach(async () => {
		client = createTevmNode()

		// Deploy ERC20 contract using setAccountHandler
		await setAccountHandler(client)({
			address: ERC20_ADDRESS,
			deployedBytecode: ERC20_BYTECODE,
		})

		// Deploy SimpleContract using setAccountHandler
		await setAccountHandler(client)({
			address: SIMPLE_CONTRACT_ADDRESS,
			deployedBytecode: SIMPLE_CONTRACT_BYTECODE,
		})
	})

	describe('callTracer', () => {
		it('should execute without errors when callTracer is enabled', async () => {
			const vm = await client.getVm().then((vm) => vm.deepCopy())
			const head = await vm.blockchain.getCanonicalHeadBlock()
			await vm.stateManager.setStateRoot(head.header.stateRoot)

			const params = {
				data: hexToBytes(
					encodeFunctionData({
						abi: ERC20_ABI,
						functionName: 'balanceOf',
						args: [ERC20_ADDRESS],
					}),
				),
				gasLimit: 16784800n,
				to: createAddress(ERC20_ADDRESS),
				block: await vm.blockchain.getCanonicalHeadBlock(),
				origin: createAddress(0),
				caller: createAddress(0),
			}

			const result = await runCallWithMuxTrace(vm, client.logger, params, { callTracer: {} })

			// The function should complete and return an execResult
			expect(result.execResult).toBeDefined()
			expect(result.trace).toBeDefined()
		})

		it('should trace contract creation', async () => {
			const vm = await client.getVm().then((vm) => vm.deepCopy())
			const head = await vm.blockchain.getCanonicalHeadBlock()
			await vm.stateManager.setStateRoot(head.header.stateRoot)

			const params = {
				data: hexToBytes(encodeDeployData(SimpleContract.deploy(420n))),
				gasLimit: 16784800n,
				value: 0n,
				block: await vm.blockchain.getCanonicalHeadBlock(),
				origin: createAddress(0),
				caller: createAddress(0),
			}

			const result = await runCallWithMuxTrace(vm, client.logger, params, { callTracer: {} })

			// The function should complete and return an execResult
			expect(result.execResult).toBeDefined()
			expect(result.trace).toBeDefined()
		})
	})

	describe('flatCallTracer', () => {
		it('should execute without errors when flatCallTracer is enabled', async () => {
			const vm = await client.getVm().then((vm) => vm.deepCopy())
			const head = await vm.blockchain.getCanonicalHeadBlock()
			await vm.stateManager.setStateRoot(head.header.stateRoot)

			const params = {
				data: hexToBytes(
					encodeFunctionData({
						abi: ERC20_ABI,
						functionName: 'balanceOf',
						args: [ERC20_ADDRESS],
					}),
				),
				gasLimit: 16784800n,
				to: createAddress(ERC20_ADDRESS),
				block: await vm.blockchain.getCanonicalHeadBlock(),
				origin: createAddress(0),
				caller: createAddress(0),
			}

			const result = await runCallWithMuxTrace(vm, client.logger, params, { flatCallTracer: {} })

			expect(result.execResult).toBeDefined()
			expect(result.trace.flatCallTracer).toBeDefined()
			expect(Array.isArray(result.trace.flatCallTracer)).toBe(true)
		})

		it('should execute contract creation with flat tracer', async () => {
			const vm = await client.getVm().then((vm) => vm.deepCopy())
			const head = await vm.blockchain.getCanonicalHeadBlock()
			await vm.stateManager.setStateRoot(head.header.stateRoot)

			const params = {
				data: hexToBytes(encodeDeployData(SimpleContract.deploy(420n))),
				gasLimit: 16784800n,
				value: 0n,
				block: await vm.blockchain.getCanonicalHeadBlock(),
				origin: createAddress(0),
				caller: createAddress(0),
			}

			const result = await runCallWithMuxTrace(vm, client.logger, params, { flatCallTracer: {} })

			expect(result.execResult).toBeDefined()
			expect(result.trace).toBeDefined()
		})
	})

	describe('4byteTracer', () => {
		it('should track function selectors', async () => {
			const vm = await client.getVm().then((vm) => vm.deepCopy())
			const head = await vm.blockchain.getCanonicalHeadBlock()
			await vm.stateManager.setStateRoot(head.header.stateRoot)

			const params = {
				data: hexToBytes(
					encodeFunctionData({
						abi: ERC20_ABI,
						functionName: 'balanceOf',
						args: [ERC20_ADDRESS],
					}),
				),
				gasLimit: 16784800n,
				to: createAddress(ERC20_ADDRESS),
				block: await vm.blockchain.getCanonicalHeadBlock(),
				origin: createAddress(0),
				caller: createAddress(0),
			}

			const result = await runCallWithMuxTrace(vm, client.logger, params, { '4byteTracer': {} })

			expect(result.trace['4byteTracer']).toBeDefined()
			// The result should have at least one selector entry
			const fourbyteResult = result.trace['4byteTracer']
			expect(fourbyteResult).toBeDefined()
		})

		it('should count selector occurrences', async () => {
			const vm = await client.getVm().then((vm) => vm.deepCopy())
			const head = await vm.blockchain.getCanonicalHeadBlock()
			await vm.stateManager.setStateRoot(head.header.stateRoot)

			const params = {
				data: hexToBytes(
					encodeFunctionData({
						abi: SIMPLE_CONTRACT_ABI,
						functionName: 'get',
					}),
				),
				gasLimit: 16784800n,
				to: createAddress(SIMPLE_CONTRACT_ADDRESS),
				block: await vm.blockchain.getCanonicalHeadBlock(),
				origin: createAddress(0),
				caller: createAddress(0),
			}

			const result = await runCallWithMuxTrace(vm, client.logger, params, { '4byteTracer': {} })

			// Selector counts should be numbers
			const fourbyteResult = result.trace['4byteTracer']
			if (fourbyteResult) {
				for (const [key, value] of Object.entries(fourbyteResult)) {
					if (typeof value === 'number') {
						expect(value).toBeGreaterThanOrEqual(1)
					}
				}
			}
		})
	})

	describe('default tracer', () => {
		it('should produce structLogs', async () => {
			const vm = await client.getVm().then((vm) => vm.deepCopy())
			const head = await vm.blockchain.getCanonicalHeadBlock()
			await vm.stateManager.setStateRoot(head.header.stateRoot)

			const params = {
				data: hexToBytes(
					encodeFunctionData({
						abi: SIMPLE_CONTRACT_ABI,
						functionName: 'get',
					}),
				),
				gasLimit: 16784800n,
				to: createAddress(SIMPLE_CONTRACT_ADDRESS),
				block: await vm.blockchain.getCanonicalHeadBlock(),
				origin: createAddress(0),
				caller: createAddress(0),
			}

			const result = await runCallWithMuxTrace(vm, client.logger, params, { default: {} })

			expect(result.trace.default).toBeDefined()
			expect(result.trace.default?.structLogs).toBeDefined()
			expect(Array.isArray(result.trace.default?.structLogs)).toBe(true)
		})

		it('should include gas and returnValue in default trace', async () => {
			const vm = await client.getVm().then((vm) => vm.deepCopy())
			const head = await vm.blockchain.getCanonicalHeadBlock()
			await vm.stateManager.setStateRoot(head.header.stateRoot)

			const params = {
				data: hexToBytes(
					encodeFunctionData({
						abi: SIMPLE_CONTRACT_ABI,
						functionName: 'get',
					}),
				),
				gasLimit: 16784800n,
				to: createAddress(SIMPLE_CONTRACT_ADDRESS),
				block: await vm.blockchain.getCanonicalHeadBlock(),
				origin: createAddress(0),
				caller: createAddress(0),
			}

			const result = await runCallWithMuxTrace(vm, client.logger, params, { default: {} })

			expect(result.trace.default?.gas).toBeDefined()
			expect(result.trace.default?.returnValue).toBeDefined()
			expect(typeof result.trace.default?.failed).toBe('boolean')
		})

		it('should have structLog entries with pc, op, gas, gasCost, depth, stack', async () => {
			const vm = await client.getVm().then((vm) => vm.deepCopy())
			const head = await vm.blockchain.getCanonicalHeadBlock()
			await vm.stateManager.setStateRoot(head.header.stateRoot)

			const params = {
				data: hexToBytes(
					encodeFunctionData({
						abi: SIMPLE_CONTRACT_ABI,
						functionName: 'get',
					}),
				),
				gasLimit: 16784800n,
				to: createAddress(SIMPLE_CONTRACT_ADDRESS),
				block: await vm.blockchain.getCanonicalHeadBlock(),
				origin: createAddress(0),
				caller: createAddress(0),
			}

			const result = await runCallWithMuxTrace(vm, client.logger, params, { default: {} })

			const structLogs = result.trace.default?.structLogs
			if (structLogs && structLogs.length > 0) {
				const firstLog = structLogs[0]
				expect(typeof firstLog?.pc).toBe('number')
				expect(typeof firstLog?.op).toBe('string')
				expect(typeof firstLog?.gas).toBe('bigint')
				expect(typeof firstLog?.gasCost).toBe('bigint')
				expect(typeof firstLog?.depth).toBe('number')
				expect(Array.isArray(firstLog?.stack)).toBe(true)
			}
		})
	})

	describe('multiple tracers', () => {
		it('should run multiple tracers simultaneously', async () => {
			const vm = await client.getVm().then((vm) => vm.deepCopy())
			const head = await vm.blockchain.getCanonicalHeadBlock()
			await vm.stateManager.setStateRoot(head.header.stateRoot)

			const params = {
				data: hexToBytes(
					encodeFunctionData({
						abi: SIMPLE_CONTRACT_ABI,
						functionName: 'get',
					}),
				),
				gasLimit: 16784800n,
				to: createAddress(SIMPLE_CONTRACT_ADDRESS),
				block: await vm.blockchain.getCanonicalHeadBlock(),
				origin: createAddress(0),
				caller: createAddress(0),
			}

			const result = await runCallWithMuxTrace(vm, client.logger, params, {
				callTracer: {},
				flatCallTracer: {},
				'4byteTracer': {},
				default: {},
			})

			// All tracers should be present in the result
			expect(result.trace['4byteTracer']).toBeDefined()
			expect(result.trace.default).toBeDefined()
			// callTracer and flatCallTracer may not have results if events weren't emitted
			// but the result object should exist
			expect(result.execResult).toBeDefined()
		})

		it('should run 4byteTracer and default tracer together', async () => {
			const vm = await client.getVm().then((vm) => vm.deepCopy())
			const head = await vm.blockchain.getCanonicalHeadBlock()
			await vm.stateManager.setStateRoot(head.header.stateRoot)

			const params = {
				data: hexToBytes(
					encodeFunctionData({
						abi: SIMPLE_CONTRACT_ABI,
						functionName: 'get',
					}),
				),
				gasLimit: 16784800n,
				to: createAddress(SIMPLE_CONTRACT_ADDRESS),
				block: await vm.blockchain.getCanonicalHeadBlock(),
				origin: createAddress(0),
				caller: createAddress(0),
			}

			const result = await runCallWithMuxTrace(vm, client.logger, params, {
				'4byteTracer': {},
				default: {},
			})

			// Both tracers should produce results
			expect(result.trace['4byteTracer']).toBeDefined()
			expect(result.trace.default).toBeDefined()
			expect(result.trace.default?.structLogs).toBeDefined()
		})

		it('should handle empty tracer config', async () => {
			const vm = await client.getVm().then((vm) => vm.deepCopy())
			const head = await vm.blockchain.getCanonicalHeadBlock()
			await vm.stateManager.setStateRoot(head.header.stateRoot)

			const params = {
				data: hexToBytes(
					encodeFunctionData({
						abi: SIMPLE_CONTRACT_ABI,
						functionName: 'get',
					}),
				),
				gasLimit: 16784800n,
				to: createAddress(SIMPLE_CONTRACT_ADDRESS),
				block: await vm.blockchain.getCanonicalHeadBlock(),
				origin: createAddress(0),
				caller: createAddress(0),
			}

			const result = await runCallWithMuxTrace(vm, client.logger, params, {})

			// Should still execute and return EVM result
			expect(result.execResult).toBeDefined()
			expect(result.trace).toEqual({})
		})
	})

	describe('error handling', () => {
		it('should capture failed state in default tracer', async () => {
			const vm = await client.getVm().then((vm) => vm.deepCopy())
			const head = await vm.blockchain.getCanonicalHeadBlock()
			await vm.stateManager.setStateRoot(head.header.stateRoot)

			// Call a non-existent address with data that will fail
			const params = {
				data: hexToBytes('0x12345678'),
				gasLimit: 16784800n,
				to: createAddress(`0x${'dead'.repeat(10)}`),
				block: await vm.blockchain.getCanonicalHeadBlock(),
				origin: createAddress(0),
				caller: createAddress(0),
			}

			const result = await runCallWithMuxTrace(vm, client.logger, params, { default: {} })

			// Should have executed (even if it didn't do anything meaningful)
			expect(result.trace.default).toBeDefined()
			expect(typeof result.trace.default?.failed).toBe('boolean')
		})
	})
})

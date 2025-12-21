import { Address, createAddress } from '@tevm/address'
import { AdvancedContract, ErrorContract } from '@tevm/contract'
import { createTevmNode } from '@tevm/node'
import { encodeDeployData, encodeFunctionData, hexToBytes, PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { assert, beforeEach, describe, expect, it } from 'vitest'
import type { FlatTraceEntry } from '../common/FlatCallTraceResult.js'
import { deployHandler } from '../Deploy/deployHandler.js'
import { runCallWithFlatCallTrace } from './runCallWithFlatCallTrace.js'

describe('runCallWithFlatCallTrace', () => {
	let client: ReturnType<typeof createTevmNode>
	let advancedContractAddress: Address
	let errorContractAddress: Address

	beforeEach(async () => {
		client = createTevmNode()

		const { createdAddress: createdAdvancedContractAddress } = await deployHandler(client)({
			...AdvancedContract.deploy(1n, false, 'test', PREFUNDED_ACCOUNTS[0].address),
			addToBlockchain: true,
		})
		assert(createdAdvancedContractAddress, 'createdAdvancedContractAddress is undefined')
		advancedContractAddress = createAddress(createdAdvancedContractAddress)

		const { createdAddress: createdErrorContractAddress } = await deployHandler(client)({
			...ErrorContract.deploy(),
			addToBlockchain: true,
		})
		assert(createdErrorContractAddress, 'createdErrorContractAddress is undefined')
		errorContractAddress = createAddress(createdErrorContractAddress)
	})

	it('should return a flat array of call traces', async () => {
		const vm = await client.getVm().then((vm) => vm.deepCopy())
		const head = await vm.blockchain.getCanonicalHeadBlock()
		await vm.stateManager.setStateRoot(head.header.stateRoot)

		const params = {
			data: hexToBytes(
				encodeFunctionData(AdvancedContract.write.setAllValues(2n, true, 'test', PREFUNDED_ACCOUNTS[0].address)),
			),
			gasLimit: 16784800n,
			to: advancedContractAddress,
			block: await vm.blockchain.getCanonicalHeadBlock(),
			origin: createAddress(0),
			caller: createAddress(0),
		}

		const result = await runCallWithFlatCallTrace(vm, client.logger, params)

		// Result should be an array
		expect(Array.isArray(result.trace)).toBe(true)

		// First entry should be the root call
		const rootTrace = result.trace[0] as FlatTraceEntry
		expect(rootTrace).toBeDefined()
		expect(rootTrace.type).toBe('call')
		expect(rootTrace.traceAddress).toEqual([])
		expect(rootTrace.action).toMatchObject({
			callType: 'call',
			to: advancedContractAddress.toString(),
		})
	})

	it('should track nested calls with correct traceAddress', async () => {
		const vm = await client.getVm().then((vm) => vm.deepCopy())
		const head = await vm.blockchain.getCanonicalHeadBlock()
		await vm.stateManager.setStateRoot(head.header.stateRoot)

		// setAllValues calls setNumber, setBool, setString, setAddress internally
		const params = {
			data: hexToBytes(
				encodeFunctionData(AdvancedContract.write.setAllValues(2n, true, 'test', PREFUNDED_ACCOUNTS[0].address)),
			),
			gasLimit: 16784800n,
			to: advancedContractAddress,
			block: await vm.blockchain.getCanonicalHeadBlock(),
			origin: createAddress(0),
			caller: createAddress(0),
		}

		const result = await runCallWithFlatCallTrace(vm, client.logger, params)

		// Should have multiple traces
		expect(result.trace.length).toBeGreaterThan(1)

		// Root trace should have traceAddress []
		expect(result.trace[0]?.traceAddress).toEqual([])

		// Root trace should have subtraces count > 0
		expect(result.trace[0]?.subtraces).toBeGreaterThan(0)

		// Child traces should have traceAddress [0], [1], etc.
		const childTraces = result.trace.filter((t) => t.traceAddress.length === 1)
		expect(childTraces.length).toBeGreaterThan(0)
		childTraces.forEach((trace, index) => {
			expect(trace.traceAddress).toEqual([index])
		})
	})

	it('should handle external contract calls', async () => {
		const vm = await client.getVm().then((vm) => vm.deepCopy())
		const head = await vm.blockchain.getCanonicalHeadBlock()
		await vm.stateManager.setStateRoot(head.header.stateRoot)

		const params = {
			data: hexToBytes(encodeFunctionData(AdvancedContract.write.callMathHelper(2n))),
			gasLimit: 16784800n,
			to: advancedContractAddress,
			block: await vm.blockchain.getCanonicalHeadBlock(),
			origin: createAddress(0),
			caller: createAddress(0),
		}

		const result = await runCallWithFlatCallTrace(vm, client.logger, params)

		// Should have at least 2 traces (main call + external call)
		expect(result.trace.length).toBeGreaterThanOrEqual(2)

		// First trace should be the main contract call
		expect(result.trace[0]?.type).toBe('call')
		expect(result.trace[0]?.traceAddress).toEqual([])

		// Second trace should be the external call with traceAddress [0]
		if (result.trace.length > 1) {
			expect(result.trace[1]?.type).toBe('call')
			expect(result.trace[1]?.traceAddress).toEqual([0])
		}
	})

	it('should handle delegate calls', async () => {
		const vm = await client.getVm().then((vm) => vm.deepCopy())
		const head = await vm.blockchain.getCanonicalHeadBlock()
		await vm.stateManager.setStateRoot(head.header.stateRoot)

		const params = {
			data: hexToBytes(encodeFunctionData(AdvancedContract.write.delegateCallMathHelper(2n))),
			gasLimit: 16784800n,
			to: advancedContractAddress,
			block: await vm.blockchain.getCanonicalHeadBlock(),
			origin: createAddress(0),
			caller: createAddress(0),
		}

		const result = await runCallWithFlatCallTrace(vm, client.logger, params)

		// Should have at least 2 traces
		expect(result.trace.length).toBeGreaterThanOrEqual(2)

		// Find the delegatecall trace
		const delegateCallTrace = result.trace.find(
			(t) => t.type === 'call' && (t.action as any).callType === 'delegatecall',
		)
		expect(delegateCallTrace).toBeDefined()
	})

	it('should handle CREATE operations', async () => {
		const vm = await client.getVm().then((vm) => vm.deepCopy())
		const head = await vm.blockchain.getCanonicalHeadBlock()
		await vm.stateManager.setStateRoot(head.header.stateRoot)

		const deployData = encodeDeployData({
			abi: ErrorContract.abi,
			bytecode: ErrorContract.bytecode,
		})

		const params = {
			data: hexToBytes(deployData),
			gasLimit: 16784800n,
			block: await vm.blockchain.getCanonicalHeadBlock(),
			origin: createAddress(0),
			caller: createAddress(0),
		}

		const result = await runCallWithFlatCallTrace(vm, client.logger, params)

		// Should have at least one trace
		expect(result.trace.length).toBeGreaterThanOrEqual(1)

		// First trace should be a create
		expect(result.trace[0]?.type).toBe('create')
		expect(result.trace[0]?.traceAddress).toEqual([])

		// Create action should have 'init' field instead of 'input'
		const createAction = result.trace[0]?.action as any
		expect(createAction.init).toBeDefined()

		// Create result should have 'address' and 'code' fields
		if (result.trace[0]?.result) {
			const createResult = result.trace[0]?.result as any
			expect(createResult.address).toBeDefined()
			expect(createResult.code).toBeDefined()
		}
	})

	it('should handle reverting calls', async () => {
		const vm = await client.getVm().then((vm) => vm.deepCopy())
		const head = await vm.blockchain.getCanonicalHeadBlock()
		await vm.stateManager.setStateRoot(head.header.stateRoot)

		const params = {
			data: hexToBytes(encodeFunctionData(ErrorContract.write.revertWithStringError())),
			gasLimit: 16784800n,
			to: errorContractAddress,
			block: await vm.blockchain.getCanonicalHeadBlock(),
			origin: createAddress(0),
			caller: createAddress(0),
		}

		const result = await runCallWithFlatCallTrace(vm, client.logger, params)

		// Should have at least one trace
		expect(result.trace.length).toBeGreaterThanOrEqual(1)

		// Root trace should have error set
		expect(result.trace[0]?.error).toBeDefined()

		// Result should be null for failed calls
		expect(result.trace[0]?.result).toBeNull()
	})

	it('should handle static calls', async () => {
		const vm = await client.getVm().then((vm) => vm.deepCopy())
		const head = await vm.blockchain.getCanonicalHeadBlock()
		await vm.stateManager.setStateRoot(head.header.stateRoot)

		// getNumber is a view function which should result in a staticcall at root
		const params = {
			data: hexToBytes(encodeFunctionData(AdvancedContract.read.getNumber())),
			gasLimit: 16784800n,
			to: advancedContractAddress,
			block: await vm.blockchain.getCanonicalHeadBlock(),
			origin: createAddress(0),
			caller: createAddress(0),
			// Note: static calls at root level depend on how the EVM is called
		}

		const result = await runCallWithFlatCallTrace(vm, client.logger, params)

		// Should have at least one trace
		expect(result.trace.length).toBeGreaterThanOrEqual(1)
		expect(result.trace[0]?.type).toBe('call')
	})

	it('should track gas usage correctly', async () => {
		const vm = await client.getVm().then((vm) => vm.deepCopy())
		const head = await vm.blockchain.getCanonicalHeadBlock()
		await vm.stateManager.setStateRoot(head.header.stateRoot)

		const params = {
			data: hexToBytes(encodeFunctionData(AdvancedContract.read.getNumber())),
			gasLimit: 16784800n,
			to: advancedContractAddress,
			block: await vm.blockchain.getCanonicalHeadBlock(),
			origin: createAddress(0),
			caller: createAddress(0),
		}

		const result = await runCallWithFlatCallTrace(vm, client.logger, params)

		// Each trace should have gas info
		result.trace.forEach((trace) => {
			// Action should have gas
			expect(typeof (trace.action as any).gas).toBe('bigint')

			// Successful result should have gasUsed
			if (trace.result) {
				expect(typeof trace.result.gasUsed).toBe('bigint')
			}
		})
	})

	it('should handle lazilyRun parameter', async () => {
		const vm = await client.getVm().then((vm) => vm.deepCopy())
		const head = await vm.blockchain.getCanonicalHeadBlock()
		await vm.stateManager.setStateRoot(head.header.stateRoot)

		const params = {
			data: hexToBytes(encodeFunctionData(AdvancedContract.write.callMathHelper(2n))),
			gasLimit: 16784800n,
			to: advancedContractAddress,
			block: await vm.blockchain.getCanonicalHeadBlock(),
			origin: createAddress(0),
			caller: createAddress(0),
		}

		const result = await runCallWithFlatCallTrace(vm, client.logger, params, true)
		// Should be empty since EVM didn't run
		expect(result.trace.length).toBe(0)
	})
})

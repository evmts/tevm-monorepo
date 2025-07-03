import { Address, createAddress } from '@tevm/address'
import { AdvancedContract, ErrorContract } from '@tevm/contract'
import { createTevmNode } from '@tevm/node'
import { PREFUNDED_ACCOUNTS, encodeDeployData, encodeFunctionData, hexToBytes } from '@tevm/utils'
import { assert, beforeEach, describe, expect, it } from 'vitest'
import { deployHandler } from '../Deploy/deployHandler.js'
import { runCallWithFourbyteTrace } from './runCallWithFourbyteTrace.js'

describe('runCallWithFourbyteTrace', () => {
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

	it('should collect 4-byte function selectors from contract calls', async () => {
		// Call the contract with fourbyteTracer
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

		const result = await runCallWithFourbyteTrace(vm, client.logger, params)

		// Verify trace contains expected selectors
		expect(result.trace).toBeDefined()
		expect(typeof result.trace).toBe('object')

		// Should capture callMathHelper call and the external call to MathHelper.multiply
		expect(result.trace).toMatchObject({
			'0x575f4505-32': 1, // callMathHelper(uint256)
			'0xc6888fa1-32': 1, // multiply(uint256) on MathHelper
		})
	})

	it('should handle view function calls', async () => {
		const vm = await client.getVm().then((vm) => vm.deepCopy())
		const head = await vm.blockchain.getCanonicalHeadBlock()
		await vm.stateManager.setStateRoot(head.header.stateRoot)

		const params = {
			data: hexToBytes(encodeFunctionData(AdvancedContract.read.getAllValues())),
			gasLimit: 16784800n,
			to: advancedContractAddress,
			block: await vm.blockchain.getCanonicalHeadBlock(),
			origin: createAddress(0),
			caller: createAddress(0),
		}

		const result = await runCallWithFourbyteTrace(vm, client.logger, params)

		// Verify trace contains selectors from getAllValues
		// NOTE: Internal calls to getNumber, getBool, etc. within the same contract
		// are JUMP instructions, not CALL opcodes, so they won't be captured
		expect(result.trace).toEqual({
			'0x981f5499-0': 1, // getAllValues() with 0-byte calldata
		})
	})

	it('should collect selector from setAllValues with correct calldata size', async () => {
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

		const result = await runCallWithFourbyteTrace(vm, client.logger, params)

		// Should capture only the setAllValues call, not internal function calls
		// Internal calls to setNumber, setBool, setString, setAddress are JUMP instructions
		expect(result.trace).toEqual({
			'0x349a0054-192': 1, // setAllValues with 192-byte calldata (includes string offset + length)
		})
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

		const result = await runCallWithFourbyteTrace(vm, client.logger, params)

		// Verify trace contains selectors from delegate call
		expect(result.trace).toMatchObject({
			'0xd0da9af5-32': 1, // delegateCallMathHelper(uint256)
			'0xc6888fa1-32': 1, // multiply(uint256) via delegatecall
		})
	})

	it('should handle calls with insufficient data', async () => {
		const vm = await client.getVm().then((vm) => vm.deepCopy())
		const head = await vm.blockchain.getCanonicalHeadBlock()
		await vm.stateManager.setStateRoot(head.header.stateRoot)

		const params = {
			data: hexToBytes('0x12'), // Only 1 byte, not enough for a selector
			gasLimit: 16784800n,
			to: advancedContractAddress,
			block: await vm.blockchain.getCanonicalHeadBlock(),
			origin: createAddress(0),
			caller: createAddress(0),
		}

		const result = await runCallWithFourbyteTrace(vm, client.logger, params)

		// Should not crash and should return empty trace
		expect(result.trace).toBeDefined()
		expect(typeof result.trace).toBe('object')
		// Should be empty since no valid selector was found
		expect(Object.keys(result.trace)).toHaveLength(0)
	})

	it('should handle CREATE operations by ignoring them', async () => {
		const vm = await client.getVm().then((vm) => vm.deepCopy())
		const head = await vm.blockchain.getCanonicalHeadBlock()
		await vm.stateManager.setStateRoot(head.header.stateRoot)

		// Deploy a new contract during execution
		const deployData = encodeDeployData({
			abi: ErrorContract.abi,
			bytecode: ErrorContract.bytecode,
			args: [],
		})

		const params = {
			data: hexToBytes(deployData),
			gasLimit: 16784800n,
			// No 'to' address means this is a CREATE operation
			block: await vm.blockchain.getCanonicalHeadBlock(),
			origin: createAddress(0),
			caller: createAddress(0),
		}

		const result = await runCallWithFourbyteTrace(vm, client.logger, params)

		// CREATE operations should not produce selectors
		expect(result.trace).toBeDefined()
		expect(typeof result.trace).toBe('object')
		// Should be empty since CREATE operations don't have function selectors
		expect(Object.keys(result.trace)).toHaveLength(0)
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

		const result = await runCallWithFourbyteTrace(vm, client.logger, params, true)

		// Should return object with trace but not execute EVM
		expect(result.trace).toBeDefined()
		expect(typeof result.trace).toBe('object')
		// Should be empty since EVM didn't run
		expect(Object.keys(result.trace)).toHaveLength(0)
	})

	it('should match expected trace format', async () => {
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

		const result = await runCallWithFourbyteTrace(vm, client.logger, params)

		// Should match the expected format for FourbyteTraceResult
		expect(result.trace).toMatchSnapshot()
	})
})

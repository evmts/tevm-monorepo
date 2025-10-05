import { Address, createAddress } from '@tevm/address'
import { AdvancedContract, ErrorContract } from '@tevm/contract'
import { createTevmNode } from '@tevm/node'
import { encodeDeployData, encodeFunctionData, hexToBytes, PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { assert, beforeEach, describe, expect, it } from 'vitest'
import { deployHandler } from '../Deploy/deployHandler.js'
import { runCallWithCallTrace } from './runCallWithCallTrace.js'

describe('runCallWithCallTrace', () => {
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

	it('should execute a contract call with call tracing', async () => {
		// Call the contract with trace
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

		const result = await runCallWithCallTrace(vm, client.logger, params)
		expect(result.trace).toMatchSnapshot()
	})

	it('should support lazy tracing mode', async () => {
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

		const lazyResult = await runCallWithCallTrace(vm, client.logger, params, true)

		expect(lazyResult.trace).toBeNull
	})

	it('should trace contract creation', async () => {
		const vm = await client.getVm().then((vm) => vm.deepCopy())
		const head = await vm.blockchain.getCanonicalHeadBlock()
		await vm.stateManager.setStateRoot(head.header.stateRoot)

		const params = {
			data: hexToBytes(encodeDeployData(AdvancedContract.deploy(1n, false, 'test', PREFUNDED_ACCOUNTS[0].address))),
			gasLimit: 16784800n,
			value: 0n,
			block: await vm.blockchain.getCanonicalHeadBlock(),
			origin: createAddress(0),
			caller: createAddress(0),
		}

		const result = await runCallWithCallTrace(vm, client.logger, params)
		expect(result.createdAddress).toBeDefined()
		// AdvancedContract creation
		expect(result.trace).toMatchObject({
			type: 'CREATE',
			from: createAddress(0).toString(),
		})
		// MathHelper creation in constructor
		expect(result.trace.calls?.[0]).toMatchObject({
			type: 'CREATE',
			from: result.createdAddress?.toString(),
		})
	})

	it('should trace a delegatecall', async () => {
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

		const result = await runCallWithCallTrace(vm, client.logger, params)
		// AdvancedContract call
		expect(result.trace).toMatchObject({
			type: 'CALL',
			from: createAddress(0).toString(),
			to: advancedContractAddress.toString(),
		})
		// Delegatecall to MathHelper
		expect(result.trace.calls?.[0]).toMatchObject({
			type: 'DELEGATECALL',
			from: createAddress(0).toString(),
			to: advancedContractAddress.toString(),
		})
	})

	it('should trace revert reason', async () => {
		const vm = await client.getVm().then((vm) => vm.deepCopy())
		const head = await vm.blockchain.getCanonicalHeadBlock()
		await vm.stateManager.setStateRoot(head.header.stateRoot)

		const params = {
			data: hexToBytes(encodeFunctionData(ErrorContract.write.revertWithSimpleCustomError())),
			gasLimit: 16784800n,
			to: errorContractAddress,
			block: await vm.blockchain.getCanonicalHeadBlock(),
			origin: createAddress(0),
			caller: createAddress(0),
		}

		const result = await runCallWithCallTrace(vm, client.logger, params)
		console.log(result.trace)
		expect(result.trace).toMatchObject({
			type: 'CALL',
			from: createAddress(0).toString(),
			to: errorContractAddress.toString(),
			error: 'revert',
			revertReason: 'execution reverted: custom error 0xc2bb947c',
		})
	})
})

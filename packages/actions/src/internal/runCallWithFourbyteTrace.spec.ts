import { Address, createAddress } from '@tevm/address'
import { AdvancedContract, ErrorContract } from '@tevm/contract'
import { createTevmNode } from '@tevm/node'
import { PREFUNDED_ACCOUNTS, encodeDeployData, encodeFunctionData, hexToBytes } from '@tevm/utils'
import { toFunctionSelector } from 'viem'
import { assert, beforeEach, describe, expect, it } from 'vitest'
import { deployHandler } from '../Deploy/deployHandler.js'
import { runCallWithFourbyteTrace } from './runCallWithFourbyteTrace.js'

describe('runCallWithFourbyteTrace', () => {
	let client: ReturnType<typeof createTevmNode>
	let advancedContractAddress: Address
	let errorContractAddress: Address

	// Inner function calls with `this`
	const setAllValuesExpectedTrace = {
		[`${toFunctionSelector('function setAllValues(uint256,bool,string,address)')}-192`]: 1, // each 32 bytes: (newNumber, newBool, newString (offset), newAddress, newString (length), newString (value padded to 32 bytes))
		[`${toFunctionSelector('function setNumber(uint256)')}-32`]: 1, // each 32 bytes: (newNumber)
		[`${toFunctionSelector('function setBool(bool)')}-32`]: 1, // each 32 bytes: (newBool)
		[`${toFunctionSelector('function setString(string)')}-96`]: 1, // each 32 bytes: (newString (offset), newString (length), newString (value padded to 32 bytes))
		[`${toFunctionSelector('function setAddress(address)')}-32`]: 1, // each 32 bytes: (newAddress)
	}

	// View function call
	const getNumberExpectedTrace = {
		[`${toFunctionSelector('function getNumber()')}-0`]: 1,
	}

	// Call to external contract
	const callMathHelperExpectedTrace = {
		[`${toFunctionSelector('function callMathHelper(uint256)')}-32`]: 1, // each 32 bytes: (newNumber)
		[`${toFunctionSelector('function multiply(uint256)')}-32`]: 1, // each 32 bytes: (newNumber)
	}

	// Delegate call to external contract
	const delegateCallMathHelperExpectedTrace = {
		[`${toFunctionSelector('function delegateCallMathHelper(uint256)')}-32`]: 1, // each 32 bytes: (newNumber)
		[`${toFunctionSelector('function multiply(uint256)')}-32`]: 1, // each 32 bytes: (newNumber)
	}

	// Function call that reverts (should still include the function selector)
	const revertWithStringErrorExpectedTrace = {
		[`${toFunctionSelector('function revertWithStringError()')}-0`]: 1,
	}

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
		expect(result.trace).toMatchSnapshot()
		expect(result.trace).toStrictEqual(setAllValuesExpectedTrace)
	})

	it('should handle view function calls', async () => {
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

		const result = await runCallWithFourbyteTrace(vm, client.logger, params)
		expect(result.trace).toStrictEqual(getNumberExpectedTrace)
	})

	it('should handle a call to a function in an external contract', async () => {
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
		expect(result.trace).toStrictEqual(callMathHelperExpectedTrace)
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
		expect(result.trace).toStrictEqual(delegateCallMathHelperExpectedTrace)
	})

	it('should handle a call to a function that reverts', async () => {
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

		const result = await runCallWithFourbyteTrace(vm, client.logger, params)
		expect(result.trace).toStrictEqual(revertWithStringErrorExpectedTrace)
	})

	it('should handle CREATE operations by ignoring them', async () => {
		const vm = await client.getVm().then((vm) => vm.deepCopy())
		const head = await vm.blockchain.getCanonicalHeadBlock()
		await vm.stateManager.setStateRoot(head.header.stateRoot)

		// Deploy a new contract during execution
		const deployData = encodeDeployData({
			abi: ErrorContract.abi,
			bytecode: ErrorContract.bytecode,
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
		// Should be empty since EVM didn't run
		expect(Object.keys(result.trace)).toHaveLength(0)
	})
})

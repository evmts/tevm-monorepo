import { Address, createAddress } from '@tevm/address'
import { AdvancedContract, ErrorContract } from '@tevm/contract'
import { createTevmNode } from '@tevm/node'
import { encodeDeployData, encodeFunctionData, hexToBytes, PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { type EncodeFunctionDataParameters, type Hex, toFunctionSelector } from 'viem'
import { assert, beforeEach, describe, expect, it } from 'vitest'
import { contractHandler } from '../Contract/contractHandler.js'
import { deployHandler } from '../Deploy/deployHandler.js'
import { runCallWithFourbyteTrace } from './runCallWithFourbyteTrace.js'

const encodeFunctionCalldata = (params: EncodeFunctionDataParameters): Hex =>
	`0x${encodeFunctionData(params).slice(10)}`

describe('runCallWithFourbyteTrace', () => {
	let client: ReturnType<typeof createTevmNode>
	let advancedContractAddress: Address
	let errorContractAddress: Address

	// Inner function calls with `this`
	const setAllValuesExpectedTrace = (address: Hex) => ({
		[`${toFunctionSelector('function setAllValues(uint256,bool,string,address)')}-192`]: 1, // each 32 bytes: (newNumber, newBool, newString (offset), newAddress, newString (length), newString (value padded to 32 bytes))
		[`${toFunctionSelector('function setNumber(uint256)')}-32`]: 1, // each 32 bytes: (newNumber)
		[`${toFunctionSelector('function setBool(bool)')}-32`]: 1, // each 32 bytes: (newBool)
		[`${toFunctionSelector('function setString(string)')}-96`]: 1, // each 32 bytes: (newString (offset), newString (length), newString (value padded to 32 bytes))
		[`${toFunctionSelector('function setAddress(address)')}-32`]: 1, // each 32 bytes: (newAddress)
		// our 4byteTracer implementation includes a contract address -> selector -> calldata it was called with mapping
		[address]: {
			[toFunctionSelector('function setAllValues(uint256,bool,string,address)')]: [
				encodeFunctionCalldata(AdvancedContract.write.setAllValues(2n, true, 'test', PREFUNDED_ACCOUNTS[0].address)),
			],
			[toFunctionSelector('function setNumber(uint256)')]: [
				encodeFunctionCalldata(AdvancedContract.write.setNumber(2n)),
			],
			[toFunctionSelector('function setBool(bool)')]: [encodeFunctionCalldata(AdvancedContract.write.setBool(true))],
			[toFunctionSelector('function setString(string)')]: [
				encodeFunctionCalldata(AdvancedContract.write.setString('test')),
			],
			[toFunctionSelector('function setAddress(address)')]: [
				encodeFunctionCalldata(AdvancedContract.write.setAddress(PREFUNDED_ACCOUNTS[0].address)),
			],
		},
	})

	// View function call
	const getNumberExpectedTrace = (address: Hex) => ({
		[`${toFunctionSelector('function getNumber()')}-0`]: 1,
		[address]: {
			[toFunctionSelector('function getNumber()')]: [encodeFunctionCalldata(AdvancedContract.read.getNumber())],
		},
	})

	// Call to external contract
	const callMathHelperExpectedTrace = (contractAddress: Hex, delegateAddress: Hex) => ({
		[`${toFunctionSelector('function callMathHelper(uint256)')}-32`]: 1, // each 32 bytes: (newNumber)
		[`${toFunctionSelector('function multiply(uint256)')}-32`]: 1, // each 32 bytes: (newNumber)
		[contractAddress]: {
			[toFunctionSelector('function callMathHelper(uint256)')]: [
				encodeFunctionCalldata(AdvancedContract.write.callMathHelper(2n)),
			],
		},
		[delegateAddress]: {
			[toFunctionSelector('function multiply(uint256)')]: [
				encodeFunctionCalldata(AdvancedContract.write.callMathHelper(2n)),
			],
		},
	})

	// Delegate call to external contract
	const delegateCallMathHelperExpectedTrace = (address: Hex) => ({
		[`${toFunctionSelector('function delegateCallMathHelper(uint256)')}-32`]: 1, // each 32 bytes: (newNumber)
		[`${toFunctionSelector('function multiply(uint256)')}-32`]: 1, // each 32 bytes: (newNumber)
		[address]: {
			[toFunctionSelector('function delegateCallMathHelper(uint256)')]: [
				encodeFunctionCalldata(AdvancedContract.write.delegateCallMathHelper(2n)),
			],
			[toFunctionSelector('function multiply(uint256)')]: [
				encodeFunctionCalldata(AdvancedContract.write.delegateCallMathHelper(2n)),
			],
		},
	})

	// Function call that reverts (should still include the function selector)
	const revertWithStringErrorExpectedTrace = (address: Hex) => ({
		[`${toFunctionSelector('function revertWithStringError()')}-0`]: 1,
		[address]: {
			[toFunctionSelector('function revertWithStringError()')]: [
				encodeFunctionCalldata(ErrorContract.write.revertWithStringError()),
			],
		},
	})

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
		// Call the contract with 4byteTracer
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
		expect(result.trace).toMatchObject(setAllValuesExpectedTrace(advancedContractAddress.toString()))
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
		expect(result.trace).toMatchObject(getNumberExpectedTrace(advancedContractAddress.toString()))
	})

	it('should handle a call to a function in an external contract', async () => {
		const vm = await client.getVm().then((vm) => vm.deepCopy())
		const head = await vm.blockchain.getCanonicalHeadBlock()
		await vm.stateManager.setStateRoot(head.header.stateRoot)

		const delegateAddress = (
			await contractHandler(client)(
				AdvancedContract.withAddress(advancedContractAddress.toString()).read.mathHelperAddress(),
			)
		).data
		assert(delegateAddress, 'delegateAddress is undefined')

		const params = {
			data: hexToBytes(encodeFunctionData(AdvancedContract.write.callMathHelper(2n))),
			gasLimit: 16784800n,
			to: advancedContractAddress,
			block: await vm.blockchain.getCanonicalHeadBlock(),
			origin: createAddress(0),
			caller: createAddress(0),
		}

		const result = await runCallWithFourbyteTrace(vm, client.logger, params)
		expect(result.trace).toMatchObject(callMathHelperExpectedTrace(advancedContractAddress.toString(), delegateAddress))
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
		expect(result.trace).toMatchObject(delegateCallMathHelperExpectedTrace(advancedContractAddress.toString()))
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
		expect(result.trace).toMatchObject(revertWithStringErrorExpectedTrace(errorContractAddress.toString()))
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

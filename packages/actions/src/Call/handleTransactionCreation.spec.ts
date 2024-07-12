import { describe, expect, it } from 'bun:test'
import { handleTransactionCreation } from './handleTransactionCreation.js'
import { createBaseClient } from '@tevm/base-client'
import type { CallParams } from './CallParams.js'
import { encodeFunctionData } from 'viem'
import { TestERC20 } from '@tevm/test-utils'
import { createAddress } from '@tevm/address'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { callHandlerOpts } from './callHandlerOpts.js'
import { executeCall } from './executeCall.js'

const contract = TestERC20.withAddress(createAddress(420420420420420).toString())

describe(handleTransactionCreation.name, async () => {
	it('should handle transaction creation', async () => {
		const client = createBaseClient()

		await setAccountHandler(client)({
			address: contract.address,
			deployedBytecode: contract.deployedBytecode,
		})

		const params: CallParams = {
			data: encodeFunctionData(contract.read.balanceOf(createAddress(25).toString())),
			to: contract.address,
			gas: 16784800n,
			createTransaction: 'on-success',
		}

		const vm = await client.getVm().then((vm) => vm.deepCopy())

		const { data: evmInput, errors: callHandlerOptsErrors } = await callHandlerOpts(client, params)

		expect(callHandlerOptsErrors).toBeUndefined()
		if (evmInput === undefined) throw new Error('evmInput should be undefined')

		const executeCallResult = await executeCall({ ...client, getVm: async () => vm }, evmInput, params)

		if ('errors' in executeCallResult) throw new Error('executeCallResult.errors should be undefined')

		const { hash, errors } = await handleTransactionCreation(client, params, executeCallResult, evmInput)

		expect(errors).toBeUndefined()
		expect(hash).toBeDefined()
		expect(hash).toMatchSnapshot()
	})

	it('should do nothing if createTransaction is false', async () => {
		const client = createBaseClient()

		await setAccountHandler(client)({
			address: contract.address,
			deployedBytecode: contract.deployedBytecode,
		})

		const params: CallParams = {
			data: encodeFunctionData(contract.read.balanceOf(createAddress(25).toString())),
			to: contract.address,
			gas: 16784800n,
			createTransaction: false,
		}

		const vm = await client.getVm().then((vm) => vm.deepCopy())

		const { data: evmInput, errors: callHandlerOptsErrors } = await callHandlerOpts(client, params)

		expect(callHandlerOptsErrors).toBeUndefined()
		if (evmInput === undefined) throw new Error('evmInput should be undefined')

		const executeCallResult = await executeCall({ ...client, getVm: async () => vm }, evmInput, params)

		if ('errors' in executeCallResult) throw new Error('executeCallResult.errors should be undefined')

		const { hash, errors } = await handleTransactionCreation(client, params, executeCallResult, evmInput)
		expect(errors).toBeUndefined()
		expect(hash).toBeUndefined()
	})

	it('should handle createTransaction having errors', async () => {
		const client = createBaseClient()

		const params: CallParams = {
			to: createAddress(0).toString(),
			createTransaction: true,
			value: 420n,
			from: createAddress(420420420).toString(),
		}

		const vm = await client.getVm().then((vm) => vm.deepCopy())

		const { data: evmInput, errors: callHandlerOptsErrors } = await callHandlerOpts(client, {
			...params,
			skipBalance: true,
		})

		expect(callHandlerOptsErrors).toBeUndefined()
		if (evmInput === undefined) throw new Error('evmInput should be undefined')

		const executeCallResult = await executeCall({ ...client, getVm: async () => vm }, evmInput, params)

		if ('errors' in executeCallResult) throw new Error('executeCallResult.errors should be undefined')

		const { hash, errors } = await handleTransactionCreation(client, params, executeCallResult, evmInput)
		expect(errors).toBeDefined()
		expect(hash).toBeUndefined()
		expect(errors).toMatchSnapshot()
	})
})

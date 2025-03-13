import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { TestERC20 } from '@tevm/test-utils'
import { encodeFunctionData } from 'viem'
import { describe, expect, it, vi } from 'vitest'
import * as CreateTransactionModule from '../CreateTransaction/createTransaction.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import type { CallParams } from './CallParams.js'
import { callHandlerOpts } from './callHandlerOpts.js'
import { executeCall } from './executeCall.js'
import * as HandleAutominingModule from './handleAutomining.js'
import { handleTransactionCreation } from './handleTransactionCreation.js'

const contract = TestERC20.withAddress(createAddress(420420420420420).toString())

describe(handleTransactionCreation.name, async () => {
	it('should handle transaction creation', async () => {
		const client = createTevmNode()

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
		const client = createTevmNode()

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
		const client = createTevmNode()

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

	it('should handle errors from handleAutomining', async () => {
		const client = createTevmNode()

		// Mock createTransaction to return a txHash
		const createTransactionSpy = vi.spyOn(CreateTransactionModule, 'createTransaction')
		createTransactionSpy.mockImplementation(() => {
			return async () => {
				return {
					txHash: '0x123456',
				}
			}
		})

		// Mock handleAutomining to return errors
		const handleAutominingSpy = vi.spyOn(HandleAutominingModule, 'handleAutomining')
		handleAutominingSpy.mockResolvedValue({
			errors: [
				{
					name: 'MiningError',
					message: 'Mining failed',
				} as any,
			],
		})

		const result = (await handleTransactionCreation(
			client,
			{ createTransaction: true },
			{
				runTxResult: {
					execResult: {
						executionGasUsed: 0n,
						returnValue: Buffer.from(''),
					},
				} as any,
				trace: undefined,
			} as any,
			{
				origin: createAddress('0x0000000000000000000000000000000000000001'),
				skipBalance: true,
			},
		)) as any

		expect(result.errors).toBeDefined()
		expect(result.errors.length).toBeGreaterThan(0)

		createTransactionSpy.mockRestore()
		handleAutominingSpy.mockRestore()
	})

	it('should handle thrown errors', async () => {
		const client = createTevmNode()

		// Mock createTransaction to throw an error
		const createTransactionSpy = vi.spyOn(CreateTransactionModule, 'createTransaction')
		createTransactionSpy.mockImplementation(() => {
			return async () => {
				throw new Error('Unexpected error')
			}
		})

		const result = (await handleTransactionCreation(
			client,
			{ createTransaction: true },
			{
				runTxResult: {
					execResult: {
						executionGasUsed: 0n,
						returnValue: Buffer.from(''),
					},
				} as any,
				trace: undefined,
			} as any,
			{
				origin: createAddress('0x0000000000000000000000000000000000000001'),
				skipBalance: true,
			},
		)) as any

		expect(result.errors).toBeDefined()
		expect(result.errors.length).toBeGreaterThan(0)
		expect(result.errors[0].message).toBe('Unexpected error')

		createTransactionSpy.mockRestore()
	})

	it('should call handleAutomining with isGasMining=true when client has gas mining config', async () => {
		// Create client with gas mining config
		const client = createTevmNode({
			miningConfig: { type: 'gas', limit: BigInt(1000000) },
		})

		// Mock createTransaction to return a txHash
		const createTransactionSpy = vi.spyOn(CreateTransactionModule, 'createTransaction')
		createTransactionSpy.mockImplementation(() => {
			return async () => {
				return {
					txHash: '0x123456',
				}
			}
		})

		// Mock handleAutomining to track how it's called
		const handleAutominingSpy = vi.spyOn(HandleAutominingModule, 'handleAutomining')
		handleAutominingSpy.mockResolvedValue(undefined)

		await handleTransactionCreation(
			client,
			{ createTransaction: true },
			{
				runTxResult: {
					execResult: {
						executionGasUsed: 0n,
						returnValue: Buffer.from(''),
					},
				} as any,
				trace: undefined,
			} as any,
			{
				origin: createAddress('0x0000000000000000000000000000000000000001'),
				skipBalance: true,
			},
		)

		// Verify handleAutomining was called with isGasMining=true
		expect(handleAutominingSpy).toHaveBeenCalledWith(
			client,
			'0x123456',
			true
		)

		createTransactionSpy.mockRestore()
		handleAutominingSpy.mockRestore()
	})
})
import { tevmViemExtension } from './tevmViemExtension.js'
import { beforeEach, describe, expect, it, jest } from 'bun:test'
import { encodeFunctionData, numberToHex } from 'viem'

describe('tevmViemExtension', () => {
	let mockClient: any

	beforeEach(() => {
		mockClient = { request: jest.fn() }
	})

	it('tevmRequest should call client.request and parse the response', async () => {
		const mockResponse = { balance: 420n }
		mockClient.request.mockResolvedValue(mockResponse)

		const decorated = tevmViemExtension()(mockClient)
		const params = { address: '0x420', balance: 420n } as const
		const response = await decorated.tevm.account(params)

		expect((mockClient.request as jest.Mock).mock.lastCall[0]).toEqual({
			method: 'tevm_account',
			params: {
				address: '0x420',
				balance: numberToHex(420n),
			},
			jsonrpc: '2.0',
		})
		expect(response.errors).toBe(undefined as any)
	})

	it('runScript should call client.request with "tevm_script" and parse the response', async () => {
		const mockResponse = { executionGasUsed: numberToHex(420n) }
		mockClient.request.mockResolvedValue(mockResponse)

		const decorated = tevmViemExtension()(mockClient)
		const params = {
			abi: [{ type: 'function', name: 'testFunction', inputs: [] }],
			functionName: 'testFunction',
			args: [],
			deployedBytecode: '0x420',
			caller: '0x69',
		} as const
		const response = await decorated.tevm.script(params)

		expect((mockClient.request as jest.Mock).mock.lastCall[0]).toEqual({
			method: 'tevm_script',
			params: {
				data: encodeFunctionData(params),
				deployedBytecode: params.deployedBytecode,
				caller: params.caller,
			},
			jsonrpc: '2.0',
		})
		expect(response.executionGasUsed).toEqual(420n)
	})

	it('putAccount should call client.request with "tevm_putAccount" and parse the response', async () => {
		const mockResponse = { balance: 420n }
		mockClient.request.mockResolvedValue(mockResponse)

		const decorated = tevmViemExtension()(mockClient)
		const params = { balance: 420n, address: '0x420' } as const
		const response = await decorated.tevm.account(params)

		expect((mockClient.request as jest.Mock).mock.lastCall[0]).toEqual({
			method: 'tevm_account',
			params: {
				address: '0x420',
				balance: numberToHex(420n),
			},
			jsonrpc: '2.0',
		})
		expect(response).not.toHaveProperty('errors')
	})
})

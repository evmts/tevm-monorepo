import { tevmViemExtension } from './tevmViemExtension.js'
import { beforeEach, describe, expect, it, jest } from 'bun:test'
import { stringify } from 'superjson'

describe('tevmViemExtension', () => {
	let mockClient: any

	beforeEach(() => {
		mockClient = { request: jest.fn() }
	})

	it('tevmRequest should call client.request and parse the response', async () => {
		const mockResponse = JSON.parse(stringify({ balance: 420n }))
		mockClient.request.mockResolvedValue(mockResponse)

		const decorated = tevmViemExtension()(mockClient)
		const params = { account: '0x420', balance: 420n } as const
		const response = await decorated.putAccount(params)

		expect((mockClient.request as jest.Mock).mock.lastCall[0]).toEqual({
			method: 'tevm_putAccount',
			params: JSON.parse(stringify(params)),
		})
		expect(response.balance).toEqual(420n)
	})

	it('runScript should call client.request with "tevm_script" and parse the response', async () => {
		const mockResponse = JSON.parse(stringify({ gasUsed: 420n }))
		mockClient.request.mockResolvedValue(mockResponse)

		const decorated = tevmViemExtension()(mockClient)
		const params = {
			abi: [{ type: 'function', name: 'testFunction', inputs: [] }],
			functionName: 'testFunction',
			args: [],
			deployedBytecode: '0x420',
			caller: '0x69',
		} as const
		const response = await decorated.runScript(params)

		expect((mockClient.request as jest.Mock).mock.lastCall[0]).toEqual({
			method: 'tevm_script',
			params: JSON.parse(stringify(params)),
		})
		expect(response.gasUsed).toEqual(420n)
	})

	it('putAccount should call client.request with "tevm_putAccount" and parse the response', async () => {
		const mockResponse = JSON.parse(stringify({ balance: 420n }))
		mockClient.request.mockResolvedValue(mockResponse)

		const decorated = tevmViemExtension()(mockClient)
		const params = { balance: 420n, account: '0x420' } as const
		const response = await decorated.putAccount(params)

		expect((mockClient.request as jest.Mock).mock.lastCall[0]).toEqual({
			method: 'tevm_putAccount',
			params: JSON.parse(stringify(params)),
		})
		expect(response.balance).toEqual(420n)
	})
})

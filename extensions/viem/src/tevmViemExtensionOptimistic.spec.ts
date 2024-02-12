// TODO convert to js and make src the entrypoint
import { tevmViemExtensionOptimistic } from './tevmViemExtensionOptimistic.js'
import { describe, expect, it, jest, mock } from 'bun:test'
import { type WaitForTransactionReceiptReturnType } from 'viem/actions'

mock.module('viem/actions', () => ({
	...require('viem/actions'),
	waitForTransactionReceipt: jest.fn(),
}))

const client = (() => {
	const c = {
		request: jest.fn(),
		writeContract: jest.fn(),
		extend: (decorator: ReturnType<typeof tevmViemExtensionOptimistic>) => {
			const decorated = decorator(c)
			return {
				...decorated,
				...c,
			}
		},
	}
	return c
})()

const mockRequestResponse = { executionGasUsed: 420n }
const mockWriteContractResponse = '0x420420420'
const mockTxReciept: WaitForTransactionReceiptReturnType = {
	blockHash: '0x420',
	blockNumber: 420n,
	contractAddress: '0x420',
	cumulativeGasUsed: 420n,
	effectiveGasPrice: 420n,
	from: '0x420',
	gasUsed: 420n,
	logs: [],
	logsBloom: '0x420',
	status: 'success',
	to: '0x420',
	transactionHash: '0x420',
	transactionIndex: 0,
	type: 'eip1559',
}

client.request.mockResolvedValue(mockRequestResponse)
client.writeContract.mockResolvedValue(mockWriteContractResponse)

describe('tevmViemExtension', () => {
	it('writeContractOptimistic should write a contract call and optimistically execute it against the vm', async () => {
		const mockWaitForTransactionReceipt = (await import('viem/actions'))
			.waitForTransactionReceipt as jest.Mock
		mockWaitForTransactionReceipt.mockResolvedValue(mockTxReciept)

		const decoratedClient = client.extend(tevmViemExtensionOptimistic())

		const params = {
			abi: [{ type: 'function', name: 'testFunction', inputs: [] }],
			functionName: 'testFunction',
			args: [],
			caller: '0x69',
			address: '0x4206942069',
			account: {} as any,
			chain: {} as any,
		} as const

		for await (const result of decoratedClient.tevm.writeContractOptimistic(
			params,
		)) {
			if (result.tag === 'OPTIMISTIC_RESULT') {
				expect(result).toEqual({
					data: mockRequestResponse as any,
					success: true,
					tag: 'OPTIMISTIC_RESULT',
				})
				expect((client.request as jest.Mock).mock.lastCall?.[0]).toEqual({
					method: 'tevm_contract',
					params: params,
					jsonrpc: '2.0',
				})
				expect((client.writeContract as jest.Mock).mock.lastCall?.[0]).toEqual({
					abi: params.abi,
					functionName: params.functionName,
					args: params.args,
					caller: params.caller,
					address: params.address,
					account: params.account,
					chain: params.chain,
				})
			} else if (result.tag === 'HASH') {
				expect(result).toEqual({
					data: mockWriteContractResponse,
					success: true,
					tag: 'HASH',
				})
			} else if (result.tag === 'RECEIPT') {
				expect(result).toEqual({
					data: mockTxReciept,
					success: true,
					tag: 'RECEIPT',
				})
				expect(mockWaitForTransactionReceipt.mock.lastCall?.[0]).toEqual(client)
				expect(mockWaitForTransactionReceipt.mock.lastCall?.[1]).toEqual({
					hash: mockWriteContractResponse,
				})
			}
		}
	})
})

import { parseGwei } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { ethFeeHistoryProcedure } from './ethFeeHistoryProcedure.js'

describe(ethFeeHistoryProcedure.name, () => {
	const createMockBlock = (number: bigint, baseFeePerGas = parseGwei('1'), gasUsed = 15000000n, gasLimit = 30000000n, transactions: any[] = []) => ({
		header: {
			number,
			baseFeePerGas,
			gasUsed,
			gasLimit,
		},
		transactions,
	})

	const createMockVm = (currentBlockNumber: bigint) => ({
		blockchain: {
			getCanonicalHeadBlock: () => Promise.resolve(createMockBlock(currentBlockNumber)),
			getBlock: (blockNumber: bigint) => Promise.resolve(createMockBlock(blockNumber)),
		},
	})

	it('should return JSON-RPC formatted fee history', async () => {
		const mockVm = createMockVm(100n)
		const procedure = ethFeeHistoryProcedure({
			getVm: () => Promise.resolve(mockVm) as any,
		} as any)

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_feeHistory',
			id: 1,
			params: ['0xa', 'latest', [25, 50, 75]],
		})

		expect(response.jsonrpc).toBe('2.0')
		expect(response.method).toBe('eth_feeHistory')
		expect(response.id).toBe(1)
		expect(response.result).toBeDefined()
		expect(response.result.oldestBlock).toBe('0x5b') // 91 in hex
		expect(response.result.baseFeePerGas).toHaveLength(11)
		expect(response.result.gasUsedRatio).toHaveLength(10)
		expect(response.result.reward).toBeDefined()
		expect(response.result.reward).toHaveLength(10)
	})

	it('should handle request without id', async () => {
		const mockVm = createMockVm(50n)
		const procedure = ethFeeHistoryProcedure({
			getVm: () => Promise.resolve(mockVm) as any,
		} as any)

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_feeHistory',
			params: ['0x5', 'latest'],
		} as any)

		expect(response.jsonrpc).toBe('2.0')
		expect(response.id).toBeUndefined()
	})

	it('should handle hex block number as newestBlock', async () => {
		const mockVm = createMockVm(200n)
		const procedure = ethFeeHistoryProcedure({
			getVm: () => Promise.resolve(mockVm) as any,
		} as any)

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_feeHistory',
			id: 1,
			params: ['0xa', '0x96', []], // newestBlock = 150
		})

		expect(response.result.oldestBlock).toBe('0x8d') // 141 in hex
	})

	it('should omit reward field when no percentiles requested', async () => {
		const mockVm = createMockVm(100n)
		const procedure = ethFeeHistoryProcedure({
			getVm: () => Promise.resolve(mockVm) as any,
		} as any)

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_feeHistory',
			id: 1,
			params: ['0x5', 'latest'],
		})

		expect(response.result.reward).toBeUndefined()
	})
})

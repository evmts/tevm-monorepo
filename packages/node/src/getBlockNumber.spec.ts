import { describe, expect, it, vi } from 'vitest'
import { getBlockNumber } from './getBlockNumber.js'

describe('getBlockNumber', () => {
	it('should return the block number when successful', async () => {
		const transport = {
			request: vi.fn().mockResolvedValue('0x74d5c68'),
		}
		const blockNumber = await getBlockNumber(transport)
		expect(blockNumber).toBe(122510440n)
	})

	it('should throw an error when there is an error or blockNumber is undefined', async () => {
		const transport = {
			request: vi.fn().mockRejectedValue({
				code: -32000,
				message: 'Unknown error in jsonrpc request',
			}),
		}
		await expect(getBlockNumber(transport)).rejects.toEqual({
			code: -32000,
			message: 'Unknown error in jsonrpc request',
		})
	})
})

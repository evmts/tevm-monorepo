import { describe, expect, it } from 'bun:test'
import { http } from '@tevm/jsonrpc'
import { transports } from '@tevm/test-utils'
import { getBlockNumber } from './getBlockNumber.js'

describe('getBlockNumber', () => {
	it('should return the block number when successful', async () => {
		const blockNumber = await getBlockNumber(transports.optimism)
		expect(blockNumber).toBeGreaterThan(122494824n)
	})

	it('should throw an error when there is an error or blockNumber is undefined', async () => {
		const url = 'https://typo.mainnet.optimism.io'
		const err = await getBlockNumber(http(url)({})).catch((e) => e)
		expect(err).toEqual({
			code: -32000,
			message: 'Unknown error in jsonrpc request',
		})
		expect(err).toMatchSnapshot()
	})
})

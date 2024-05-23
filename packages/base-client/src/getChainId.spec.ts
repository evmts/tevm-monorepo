import { describe, expect, it } from 'bun:test'
import { http } from '@tevm/jsonrpc'
import { transports } from '@tevm/test-utils'
import { getChainId } from './getChainId.js'

describe('getChainId', () => {
	it('should return the chain id when successful', async () => {
		const chainId = await getChainId(transports.mainnet)
		expect(chainId).toBe(1)
	})

	it('should throw an error when there is an error or chainId is undefined', async () => {
		const url = 'https://typo.mainnet.optimism.io'
		expect(getChainId(http(url)({}))).rejects.toThrowError()
	})
})

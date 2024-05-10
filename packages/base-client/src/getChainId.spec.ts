import { describe, expect, it } from 'bun:test'
import { getAlchemyUrl } from '@tevm/test-utils'
import { getChainId } from './getChainId.js'

describe('getChainId', () => {
	it('should return the chain id when successful', async () => {
		const url = getAlchemyUrl()
		const chainId = await getChainId(url)
		expect(chainId).toBe(10)
	})

	it('should throw an error when there is an error or chainId is undefined', async () => {
		const url = 'https://typo.mainnet.optimism.io'
		expect(getChainId(url)).rejects.toThrowError('Was there a typo in the url or port?')
	})
})

import { describe, expect, it } from 'bun:test'
import { blockNumberHandler } from '../index.js'
import { chainIdHandler } from './chainIdHandler.js'
import { createBaseClient } from '@tevm/base-client'

describe(blockNumberHandler.name, () => {
	it('should return the block number', async () => {
		expect(await chainIdHandler(createBaseClient({fork: {url: 'https://mainnet.optimism.io'}}))({})).toBe(10n)
	})
})

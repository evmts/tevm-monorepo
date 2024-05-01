import { describe, expect, it } from 'bun:test'
import { createBaseClient } from '@tevm/base-client'
import { blockNumberHandler } from '../index.js'
import { chainIdHandler } from './chainIdHandler.js'

describe(blockNumberHandler.name, () => {
	it('should return the block number', async () => {
		expect(await chainIdHandler(createBaseClient({ fork: { url: 'https://mainnet.optimism.io' } }))({})).toBe(10n)
	})
})

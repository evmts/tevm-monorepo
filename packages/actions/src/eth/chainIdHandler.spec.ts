import { describe, expect, it } from 'bun:test'
import { createBaseClient } from '@tevm/base-client'
import { getAlchemyUrl } from '@tevm/test-utils'
import { http } from 'viem'
import { blockNumberHandler } from '../index.js'
import { chainIdHandler } from './chainIdHandler.js'

describe(blockNumberHandler.name, () => {
	it('should return the block number', async () => {
		expect(await chainIdHandler(createBaseClient({ fork: { client: http(getAlchemyUrl())({}) } }))({})).toBe(10n)
	})
})

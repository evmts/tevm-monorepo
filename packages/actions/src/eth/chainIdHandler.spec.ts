import { createBaseClient } from '@tevm/base-client'
import { transports } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { chainIdHandler } from './chainIdHandler.js'

describe(chainIdHandler.name, () => {
	it('should return the chain id', async () => {
		expect(await chainIdHandler(createBaseClient({ fork: { transport: transports.optimism } }))({})).toBe(10n)
	})
})

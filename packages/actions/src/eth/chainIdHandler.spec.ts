import { describe, expect, it } from 'bun:test'
import { createBaseClient } from '@tevm/base-client'
import { blockNumberHandler } from '../index.js'
import { chainIdHandler } from './chainIdHandler.js'
import {getAlchemyUrl} from '@tevm/test-utils'

describe(blockNumberHandler.name, () => {
	it('should return the block number', async () => {
		expect(await chainIdHandler(createBaseClient({ fork: { url: getAlchemyUrl() } }))({})).toBe(10n)
	})
})

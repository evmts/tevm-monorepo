import { describe, expect, it } from 'bun:test'
import { blockNumberHandler } from '../index.js'
import { chainIdHandler } from './chainIdHandler.js'

describe(blockNumberHandler.name, () => {
	it('should return the block number', async () => {
		expect(await chainIdHandler({ getChainId: async () => 420 } as any)({})).toBe(420n)
	})
})

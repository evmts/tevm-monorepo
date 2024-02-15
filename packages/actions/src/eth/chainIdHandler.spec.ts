import { blockNumberHandler } from '../index.js'
import { chainIdHandler } from './chainIdHandler.js'
import { describe, expect, it } from 'bun:test'

describe(blockNumberHandler.name, () => {
	it('should return the block number', async () => {
		expect(await chainIdHandler({ chainId: 420 })({})).toBe(420n)
	})
})

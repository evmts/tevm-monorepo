import { blockNumberHandler } from '../index.js'
import { chainIdHandler } from './chainIdHandler.js'
import { describe, expect, it } from 'bun:test'

describe(blockNumberHandler.name, () => {
	it('should return the block number', async () => {
		expect(await chainIdHandler(420n)({})).toBe(420n)
	})
})

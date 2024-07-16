import { describe, expect, it } from 'bun:test'
import { optimism } from '@tevm/common'
import { createBaseChain } from '../createBaseChain.js'
import { shallowCopy } from './shallowCopy.js'

describe(shallowCopy.name, () => {
	it('should create a shallow copy of the chain', () => {
		const originalChain = createBaseChain({
			common: optimism.copy(),
		})
		const copiedChain = shallowCopy(originalChain)()
		expect(copiedChain.options).toEqual(originalChain.options)
	})
})

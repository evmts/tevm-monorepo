import { describe, expect, it } from 'bun:test'
import { shallowCopy } from './shallowCopy.js'
import { createBaseChain } from '../createBaseChain.js'
import { optimism } from '@tevm/common'

describe(shallowCopy.name, () => {
	it('should create a shallow copy of the chain', () => {
		const originalChain = createBaseChain({
			common: optimism.copy(),
		})
		const copiedChain = shallowCopy(originalChain)()
		expect(copiedChain.options).toEqual(originalChain.options)
	})
})

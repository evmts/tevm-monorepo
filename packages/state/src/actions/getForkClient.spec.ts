import { expect, describe, it } from 'vitest'
import { getForkClient } from './getForkClient.js'
import { createBaseState } from '../createBaseState.js'

describe(getForkClient.name, () => {
	it('should return a fork client')
	it('should error if no fork config', () => {
		const state = createBaseState({})
		expect(() => getForkClient(state)).toThrowErrorMatchingInlineSnapshot(`[NoForkError: Cannot initialize a client with no fork url set]`)
	})
})

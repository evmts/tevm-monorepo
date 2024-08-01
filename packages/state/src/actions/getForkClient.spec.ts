import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { getForkClient } from './getForkClient.js'

describe(getForkClient.name, () => {
	it('should return a fork client')
	it('should error if no fork config', () => {
		const state = createBaseState({})
		expect(() => getForkClient(state)).toThrowErrorMatchingInlineSnapshot(
			'[NoForkError: Cannot initialize a client with no fork url set]',
		)
	})
})

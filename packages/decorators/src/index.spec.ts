import { describe, expect, it } from 'vitest'
import * as decorators from './index.js'

describe('index exports', () => {
	it('should export all decorators', () => {
		// Test that all expected exports are present
		expect(decorators).toHaveProperty('ethActions')
		expect(decorators).toHaveProperty('tevmActions')
		expect(decorators).toHaveProperty('requestEip1193')
		expect(decorators).toHaveProperty('tevmSend')
	})
})

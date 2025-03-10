import { describe, expect, it } from 'vitest'
import * as actions from './index.js'

describe('actions index exports', () => {
	it('should export all action decorators', () => {
		// Test that all expected exports are present
		expect(actions).toHaveProperty('ethActions')
		expect(actions).toHaveProperty('tevmActions')
	})
})

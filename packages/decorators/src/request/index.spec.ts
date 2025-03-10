import { describe, expect, it } from 'vitest'
import * as request from './index.js'

describe('request index exports', () => {
	it('should export all request decorators', () => {
		// Test that all expected exports are present
		expect(request).toHaveProperty('requestEip1193')
		expect(request).toHaveProperty('tevmSend')
	})
})

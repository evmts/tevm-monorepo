import { describe, expect, it } from 'vitest'
import { generateRuntime } from './index.js'

describe('index.js', () => {
	it('should export generateRuntime function', () => {
		expect(typeof generateRuntime).toBe('function')
	})
})

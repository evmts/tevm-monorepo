import { hello } from './index.js'
import { describe, expect, it } from 'vitest'

describe('hello', () => {
	it('world', () => {
		expect(hello).toBe('world')
	})
})

import { expandedString } from './zodUtils'
import { describe, expect, it, vi } from 'vitest'

describe('expandedString', () => {
	it('should expand a string', () => {
		vi.stubGlobal('process', {
			...process,
			env: {
				...process.env,
				TEST_VAR: 'expected-value',
			},
		})
		expect(expandedString().parse('$TEST_VAR')).toBe('expected-value')
	})
})

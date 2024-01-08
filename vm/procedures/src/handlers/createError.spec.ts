import { createError } from './createError.js'
import { describe, expect, it } from 'bun:test'

describe(createError.name, () => {
	it('should work', () => {
		expect(createError('Name', 'message', 'input')).toEqual({
			_tag: 'Name',
			message: 'Name: message',
			name: 'Name',
			input: 'input',
		})
		expect(createError('Name', 'message')).toEqual({
			_tag: 'Name',
			name: 'Name',
			message: 'Name: message',
		})
	})
})

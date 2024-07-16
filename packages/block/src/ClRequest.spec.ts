import { InternalError } from '@tevm/errors'
import { describe, expect, it } from 'vitest'
import { ClRequest } from './ClRequest.js'

describe(ClRequest.name, () => {
	it('should serialize', () => {
		const clRequest = new ClRequest(420, new Uint8Array([1, 2, 3]))
		expect(clRequest.type).toBe(420)
		expect(clRequest.bytes).toEqual(new Uint8Array([1, 2, 3]))
		expect(clRequest.serialize()).toMatchSnapshot()
	})
	it('should throw if undefined passed in as type', () => {
		expect(() => new ClRequest(undefined as any, new Uint8Array())).toThrowError(
			new InternalError('request type is required'),
		)
	})
})

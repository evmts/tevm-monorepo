import { Effect } from 'effect'
import { describe, expect, it } from 'vitest'
import * as AccessList from './AccessList.js'

describe('AccessList', () => {
	const validAccessList = [
		{
			address: '0x1234567890123456789012345678901234567890',
			storageKeys: [
				'0x0000000000000000000000000000000000000000000000000000000000000001',
				'0x0000000000000000000000000000000000000000000000000000000000000002',
			],
		},
	]

	const invalidAccessList = [
		{
			address: 'invalid address',
			storageKeys: ['invalid storage key'],
		},
	]

	it('should assert valid access list', async () => {
		const program = AccessList.assert(validAccessList)
		await expect(Effect.runPromise(program)).resolves.toBeUndefined()
	})

	it('should fail when asserting invalid access list', async () => {
		const program = Effect.either(AccessList.assert(invalidAccessList))
		const result = await Effect.runPromise(program)

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left).toBeInstanceOf(AccessList.AssertError)
			expect(result.left.name).toBe('AssertError')
			expect(result.left._tag).toBe('AssertError')
		}
	})

	it('should check if value is an access list', async () => {
		const isValid = await Effect.runPromise(AccessList.isAccessList(validAccessList))
		const isInvalid = await Effect.runPromise(AccessList.isAccessList(invalidAccessList))

		expect(isValid).toBe(true)
		expect(isInvalid).toBe(false)
	})

	it('should validate access list', async () => {
		const isValid = await Effect.runPromise(AccessList.validate(validAccessList))
		const isInvalid = await Effect.runPromise(AccessList.validate(invalidAccessList))

		expect(isValid).toBe(true)
		expect(isInvalid).toBe(false)
	})
})

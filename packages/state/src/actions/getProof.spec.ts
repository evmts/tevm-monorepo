import { createAddress } from '@tevm/address'
import { transports } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { getProof } from './getProof.js'

describe(getProof.name, () => {
	it('getProof from fork url with storage slots', async () => {
		const state = createBaseState({
			fork: {
				transport: transports.optimism,
				blockTag: 420n,
			},
		})
		await state.ready()

		// Create a storage slot to pass in
		const storageSlot = new Uint8Array(32).fill(1)

		// Call getProof with a storage slot to cover the transformation in line 32-36
		const result = await getProof(state)(createAddress(0), [storageSlot])

		// Check the basic structure
		expect(result).toHaveProperty('address')
		expect(result).toHaveProperty('accountProof')
		expect(result).toHaveProperty('balance')
		expect(result).toHaveProperty('codeHash')
		expect(result).toHaveProperty('nonce')
		expect(result).toHaveProperty('storageHash')
		expect(result).toHaveProperty('storageProof')

		// Verify we got a storageProof array with the expected structure
		expect(Array.isArray(result.storageProof)).toBe(true)
		if (result.storageProof.length > 0) {
			const proofEntry = result.storageProof[0]
			expect(proofEntry).toHaveProperty('key')
			expect(proofEntry).toHaveProperty('value')
			expect(proofEntry).toHaveProperty('proof')
		}
	})

	it('throws error if attempting to getProof with no fork uri', async () => {
		const state = createBaseState({})
		await expect(getProof(state)(createAddress(0))).rejects.toThrowErrorMatchingInlineSnapshot(
			'[Error: getProof only implemented in fork mode atm because tevm at this moment does not merkilize the state]',
		)
	})
})

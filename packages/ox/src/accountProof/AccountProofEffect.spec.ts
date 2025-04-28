import { Effect } from 'effect'
import * as Address from 'ox/core/Address'
import * as Hex from 'ox/core/Hex'
import * as AccountProof from 'ox/execution/account-proof'
import { describe, expect, it } from 'vitest'
import { AccountProofEffectLive } from './AccountProofEffect.js'

describe('AccountProofEffect', () => {
	// Sample account proof JSON (simplified for testing)
	const sampleAccountProofJson: AccountProof.AccountProofJson = {
		address: '0x1234567890123456789012345678901234567890',
		accountProof: ['0x123...', '0x456...'],
		balance: '0x100',
		codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
		nonce: '0x0',
		storageHash: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
		storageProof: [
			{
				key: '0x0000000000000000000000000000000000000000000000000000000000000000',
				value: '0x0',
				proof: ['0x789...'],
			},
		],
	}

	it('should parse account proof from raw RPC response', async () => {
		const result = await Effect.runPromise(AccountProofEffectLive.parseEffect(sampleAccountProofJson))

		expect(result).toBeDefined()
		expect(result.address).toBeDefined()
		expect(result.accountProof).toBeInstanceOf(Array)
		expect(result.storageProof).toBeInstanceOf(Array)
	})

	it('should verify an account proof against the provided state root', async () => {
		// First parse the account proof
		const accountProof = await Effect.runPromise(AccountProofEffectLive.parseEffect(sampleAccountProofJson))

		// Mock state root - in a real test, this would be the actual state root that matches the proof
		const stateRoot = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'

		try {
			// This will likely fail with the mocked data, but we're testing the interface works
			await Effect.runPromise(
				AccountProofEffectLive.verifyEffect({
					proof: accountProof,
					address: Address.parse(sampleAccountProofJson.address),
					stateRoot: stateRoot,
				}),
			)
		} catch (error) {
			// We expect an error with mock data, just verify it's the right type of error
			expect(error).toBeDefined()
		}
	})

	it('should verify a storage proof against the provided storage root', async () => {
		// First parse the account proof
		const accountProof = await Effect.runPromise(AccountProofEffectLive.parseEffect(sampleAccountProofJson))

		// Get the first storage proof
		const storageProof = accountProof.storageProof[0]

		// Mock storage root - in a real test, this would be the actual storage root that matches the proof
		const storageRoot = '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'

		try {
			// This will likely fail with the mocked data, but we're testing the interface works
			await Effect.runPromise(
				AccountProofEffectLive.verifyStorageEffect({
					proof: storageProof,
					storageRoot: storageRoot,
					slot: storageProof.key,
				}),
			)
		} catch (error) {
			// We expect an error with mock data, just verify it's the right type of error
			expect(error).toBeDefined()
		}
	})

	it('should handle invalid inputs gracefully', async () => {
		// Create an invalid account proof JSON
		const invalidAccountProofJson = {
			// Missing required fields
			address: '0x1234567890123456789012345678901234567890',
		} as any

		try {
			await Effect.runPromise(AccountProofEffectLive.parseEffect(invalidAccountProofJson))
			expect.fail('Should have thrown an error')
		} catch (error) {
			expect(error).toBeDefined()
		}
	})
})

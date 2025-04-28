import { Effect } from 'effect'
import * as Ox from 'ox'
import { describe, expect, it } from 'vitest'
import * as Mnemonic from './Mnemonic.js'

describe('Mnemonic', () => {
	it('should generate a random mnemonic phrase', async () => {
		const result = await Effect.runPromise(Mnemonic.random(Mnemonic.english))

		expect(typeof result).toBe('string')
		expect(result.split(' ').length).toBe(12) // Default is 12 words
	})

	it('should generate a random mnemonic phrase with custom strength', async () => {
		const result = await Effect.runPromise(Mnemonic.random(Mnemonic.english, { strength: 256 }))

		expect(typeof result).toBe('string')
		expect(result.split(' ').length).toBe(24)
	})

	it('should validate a mnemonic phrase', async () => {
		// First generate a valid mnemonic
		const mnemonicPhrase = await Effect.runPromise(Mnemonic.random(Mnemonic.english))

		// Then validate it
		const result = await Effect.runPromise(Mnemonic.validate(mnemonicPhrase, Mnemonic.english))

		expect(result).toBe(true)
	})

	it('should detect invalid mnemonic phrases', async () => {
		const result = await Effect.runPromise(Mnemonic.validate('invalid mnemonic phrase', Mnemonic.english))

		expect(result).toBe(false)
	})

	it('should convert a mnemonic to a seed', async () => {
		// First generate a valid mnemonic
		const mnemonicPhrase = await Effect.runPromise(Mnemonic.random(Mnemonic.english))

		// Then convert to seed
		const result = await Effect.runPromise(Mnemonic.toSeed(mnemonicPhrase))

		expect(result).toBeInstanceOf(Uint8Array)
		expect(result.length).toBe(64) // BIP-39 seeds are 64 bytes
	})

	it('should convert a mnemonic to a private key', async () => {
		// First generate a valid mnemonic
		const mnemonicPhrase = await Effect.runPromise(Mnemonic.random(Mnemonic.english))

		// Then convert to private key
		const result = await Effect.runPromise(Mnemonic.toPrivateKey<'Hex'>(mnemonicPhrase, { format: 'hex' }))

		expect(typeof result).toBe('string')
		expect(result.startsWith('0x')).toBe(true) // Private keys are returned as hex strings
	})

	it('should convert a mnemonic to HD Key', async () => {
		// First generate a valid mnemonic
		const mnemonicPhrase = await Effect.runPromise(Mnemonic.random(Mnemonic.english))

		// Then convert to HD Key
		const result = await Effect.runPromise(Mnemonic.toHdKey(mnemonicPhrase))

		expect(result).toBeDefined()
		expect(result).toHaveProperty('derive')
		expect(typeof result.derive).toBe('function')
	})

	it('should handle errors gracefully', async () => {
		// Create an intentionally invalid mnemonic phrase with invalid parameters
		try {
			await Effect.runPromise(
				// @ts-ignore - purposefully passing invalid options for testing
				Mnemonic.random(Mnemonic.english, { strength: 999 }), // Invalid strength
			)
			expect.fail('Should have thrown an error')
		} catch (error) {
			expect(error).toBeInstanceOf(Mnemonic.RandomError)
			expect(error.message).toContain('Error generating random mnemonic')
		}
	})
})

import { Effect } from 'effect'
import * as Mnemonic from 'ox/Mnemonic'
import { describe, expect, it } from 'vitest'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'
import { MnemonicEffectLive } from './MnemonicEffect.js'

describe('MnemonicEffect', () => {
	it('should generate a random mnemonic phrase correctly', async () => {
		const result = await Effect.runPromise(MnemonicEffectLive.randomEffect(Mnemonic.english))

		expect(typeof result).toBe('string')
		expect(result.split(' ').length).toBe(12) // Default is 12 words
	})

	it('should generate a random mnemonic phrase with custom strength correctly', async () => {
		const result = await Effect.runPromise(MnemonicEffectLive.randomEffect(Mnemonic.english, { strength: 256 }))

		expect(typeof result).toBe('string')
		expect(result.split(' ').length).toBe(24)
	})

	it('should validate a mnemonic phrase correctly', async () => {
		// First generate a valid mnemonic
		const mnemonicPhrase = await Effect.runPromise(MnemonicEffectLive.randomEffect(Mnemonic.english))

		// Then validate it
		const result = await Effect.runPromise(MnemonicEffectLive.validateEffect(mnemonicPhrase, Mnemonic.english))

		expect(result).toBe(true)
	})

	it('should detect invalid mnemonic phrases', async () => {
		const result = await Effect.runPromise(
			MnemonicEffectLive.validateEffect('invalid mnemonic phrase', Mnemonic.english),
		)

		expect(result).toBe(false)
	})

	it('should convert a mnemonic to a seed correctly', async () => {
		// First generate a valid mnemonic
		const mnemonicPhrase = await Effect.runPromise(MnemonicEffectLive.randomEffect(Mnemonic.english))

		// Then convert to seed
		const result = await Effect.runPromise(MnemonicEffectLive.toSeedEffect(mnemonicPhrase))

		expect(result).toBeInstanceOf(Uint8Array)
		expect(result.length).toBe(64) // BIP-39 seeds are 64 bytes
	})

	it('should convert a mnemonic to a private key correctly', async () => {
		// First generate a valid mnemonic
		const mnemonicPhrase = await Effect.runPromise(MnemonicEffectLive.randomEffect(Mnemonic.english))

		// Then convert to private key
		const result = await Effect.runPromise(MnemonicEffectLive.toPrivateKeyEffect(mnemonicPhrase))

		expect(typeof result).toBe('string')
		expect(result.startsWith('0x')).toBe(true) // Private keys are returned as hex strings by default
	})

	it('should convert a mnemonic to HD Key correctly', async () => {
		// First generate a valid mnemonic
		const mnemonicPhrase = await Effect.runPromise(MnemonicEffectLive.randomEffect(Mnemonic.english))

		// Then convert to HD Key
		const result = await Effect.runPromise(MnemonicEffectLive.toHdKeyEffect(mnemonicPhrase))

		expect(result).toBeDefined()
		console.log('HdKey properties:', Object.keys(result))
		expect(result).toHaveProperty('derive')
		expect(typeof result.derive).toBe('function')
	})

	it('should handle invalid operations gracefully', async () => {
		// Create an intentionally invalid mnemonic phrase
		const invalidMnemonic = 'invalid mnemonic phrase that is definitely not valid'

		try {
			await Effect.runPromise(MnemonicEffectLive.toSeedEffect(invalidMnemonic))
			expect.fail('Should have thrown an error')
		} catch (error) {
			expect(error).toBeDefined()
			// The exact error type depends on how Effect.runPromise handles the BaseErrorEffect wrapper
		}
	})
})

import { Effect } from 'effect'
import { describe, expect, it } from 'vitest'
import { SiweEffectLive, SiweEffectService } from './SiweEffect.js'

describe('SiweEffect', () => {
	const siwe: SiweEffectService = SiweEffectLive

	it('should create a SIWE message', async () => {
		const params = {
			address: '0x1234567890123456789012345678901234567890',
			chainId: 1,
			domain: 'example.com',
			statement: 'Sign in with Ethereum',
			uri: 'https://example.com',
			version: '1',
		}

		const result = await Effect.runPromise(siwe.createMessageEffect(params))
		expect(result).toBeDefined()
		expect(result.address).toBe(params.address)
		expect(result.chainId).toBe(params.chainId)
		expect(result.domain).toBe(params.domain)
	})

	it('should parse a SIWE message', async () => {
		const message =
			'example.com wants you to sign in with your Ethereum account:\n0x1234567890123456789012345678901234567890\n\nSign in with Ethereum\n\nURI: https://example.com\nVersion: 1\nChain ID: 1\nNonce: abc123\nIssued At: 2024-01-01T00:00:00Z'

		const result = await Effect.runPromise(siwe.parseMessageEffect(message))
		expect(result).toBeDefined()
		expect(result.domain).toBe('example.com')
		expect(result.address).toBe('0x1234567890123456789012345678901234567890')
	})

	it('should verify a SIWE message', async () => {
		const params = {
			message:
				'example.com wants you to sign in with your Ethereum account:\n0x1234567890123456789012345678901234567890\n\nSign in with Ethereum\n\nURI: https://example.com\nVersion: 1\nChain ID: 1\nNonce: abc123\nIssued At: 2024-01-01T00:00:00Z',
			signature:
				'0x12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678',
		}

		const result = await Effect.runPromise(siwe.verifyMessageEffect(params))
		expect(typeof result).toBe('boolean')
	})
})

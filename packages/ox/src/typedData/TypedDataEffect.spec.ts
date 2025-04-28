import { Effect } from 'effect'
import { describe, expect, it } from 'vitest'
import { TypedDataEffectLive } from './TypedDataEffect.js'

describe('TypedDataEffect', () => {
	// Sample EIP-712 data for testing
	const domain = {
		name: 'Ether Mail',
		version: '1',
		chainId: 1,
		verifyingContract: '0x0000000000000000000000000000000000000000',
	}

	const types = {
		Person: [
			{ name: 'name', type: 'string' },
			{ name: 'wallet', type: 'address' },
		],
		Mail: [
			{ name: 'from', type: 'Person' },
			{ name: 'to', type: 'Person' },
			{ name: 'contents', type: 'string' },
		],
	}

	const message = {
		from: {
			name: 'Cow',
			wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
		},
		to: {
			name: 'Bob',
			wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
		},
		contents: 'Hello, Bob!',
	}

	const typedData = {
		domain,
		types,
		primaryType: 'Mail',
		message,
	}

	describe('encodeEffect', () => {
		it('should encode typed data correctly', async () => {
			const program = TypedDataEffectLive.encodeEffect(typedData)
			const result = await Effect.runPromise(program)
			expect(result).toBeTypeOf('string')
			expect(result.startsWith('0x19')).toBe(true)
		})
	})

	describe('getSignPayloadEffect', () => {
		it('should get the sign payload correctly', async () => {
			const program = TypedDataEffectLive.getSignPayloadEffect(typedData)
			const result = await Effect.runPromise(program)
			expect(result).toBeTypeOf('string')
			expect(result.startsWith('0x')).toBe(true)
		})
	})

	describe('hashDomainEffect', () => {
		it('should hash the domain correctly', async () => {
			const program = TypedDataEffectLive.hashDomainEffect({ domain })
			const result = await Effect.runPromise(program)
			expect(result).toBeTypeOf('string')
			expect(result.startsWith('0x')).toBe(true)
		})
	})

	describe('hashStructEffect', () => {
		it('should hash the struct correctly', async () => {
			const program = TypedDataEffectLive.hashStructEffect({
				data: message,
				primaryType: 'Mail',
				types: {
					...types,
					EIP712Domain:
						TypedDataEffectLive.extractEip712DomainTypesEffect(domain)._tag === 'Success'
							? await Effect.runPromise(TypedDataEffectLive.extractEip712DomainTypesEffect(domain))
							: [],
				},
			})
			const result = await Effect.runPromise(program)
			expect(result).toBeTypeOf('string')
			expect(result.startsWith('0x')).toBe(true)
		})
	})

	describe('encodeTypeEffect', () => {
		it('should encode type correctly', async () => {
			const program = TypedDataEffectLive.encodeTypeEffect({
				primaryType: 'Mail',
				types,
			})
			const result = await Effect.runPromise(program)
			expect(result).toBe('Mail(Person from,Person to,string contents)Person(string name,address wallet)')
		})
	})

	describe('extractEip712DomainTypesEffect', () => {
		it('should extract EIP-712 domain types correctly', async () => {
			const program = TypedDataEffectLive.extractEip712DomainTypesEffect(domain)
			const result = await Effect.runPromise(program)
			expect(result).toBeInstanceOf(Array)
			expect(result.length).toBeGreaterThan(0)
			expect(result.some((param) => param.name === 'name')).toBe(true)
			expect(result.some((param) => param.name === 'version')).toBe(true)
			expect(result.some((param) => param.name === 'chainId')).toBe(true)
			expect(result.some((param) => param.name === 'verifyingContract')).toBe(true)
		})
	})

	describe('serializeEffect', () => {
		it('should serialize typed data correctly', async () => {
			const program = TypedDataEffectLive.serializeEffect(typedData)
			const result = await Effect.runPromise(program)
			expect(result).toBeTypeOf('string')
			const parsed = JSON.parse(result)
			expect(parsed).toHaveProperty('domain')
			expect(parsed).toHaveProperty('types')
			expect(parsed).toHaveProperty('primaryType', 'Mail')
			expect(parsed).toHaveProperty('message')
		})
	})

	describe('validateEffect', () => {
		it('should validate correct typed data', async () => {
			const program = TypedDataEffectLive.validateEffect(typedData)
			const result = await Effect.runPromise(program)
			expect(result).toBe(true)
		})

		it('should invalidate incorrect typed data', async () => {
			const invalidData = {
				...typedData,
				primaryType: 'InvalidType', // This type doesn't exist in types
			}

			const program = TypedDataEffectLive.validateEffect(invalidData as any)
			const result = await Effect.runPromise(program)
			expect(result).toBe(false)
		})
	})

	describe('assertEffect', () => {
		it('should assert valid typed data without error', async () => {
			const program = TypedDataEffectLive.assertEffect(typedData)
			await expect(Effect.runPromise(program)).resolves.toBeUndefined()
		})

		it('should throw for invalid typed data', async () => {
			const invalidData = {
				...typedData,
				primaryType: 'InvalidType', // This type doesn't exist in types
			}

			const program = TypedDataEffectLive.assertEffect(invalidData as any)
			await expect(Effect.runPromise(program)).rejects.toThrow()
		})
	})
})

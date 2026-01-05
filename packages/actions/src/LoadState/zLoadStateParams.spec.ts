import { describe, expect, it } from 'vitest'
import { zLoadStateParams } from './zLoadStateParams.js'

describe('zLoadStateParams', () => {
	const validAddress = '0x1234567890123456789012345678901234567890'
	const validNonce = '0x0'
	const validBalance = '0x0'
	const validStorageRoot = '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
	const validCodeHash = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'

	describe('valid inputs', () => {
		it('should accept state with one account', () => {
			const result = zLoadStateParams.parse({
				state: {
					[validAddress]: {
						nonce: validNonce,
						balance: validBalance,
						storageRoot: validStorageRoot,
						codeHash: validCodeHash,
					},
				},
			})
			expect(result.state[validAddress]).toEqual({
				nonce: validNonce,
				balance: validBalance,
				storageRoot: validStorageRoot,
				codeHash: validCodeHash,
			})
		})

		it('should accept state with storage', () => {
			const result = zLoadStateParams.parse({
				state: {
					[validAddress]: {
						nonce: validNonce,
						balance: validBalance,
						storageRoot: validStorageRoot,
						codeHash: validCodeHash,
						storage: {
							'0x0000000000000000000000000000000000000000000000000000000000000000':
								'0x0000000000000000000000000000000000000000000000000000000000000001',
						},
					},
				},
			})
			expect(result.state[validAddress]?.storage).toEqual({
				'0x0000000000000000000000000000000000000000000000000000000000000000':
					'0x0000000000000000000000000000000000000000000000000000000000000001',
			})
		})

		it('should accept state with multiple accounts', () => {
			const address2 = '0xabcdef1234567890abcdef1234567890abcdef12'
			const result = zLoadStateParams.parse({
				state: {
					[validAddress]: {
						nonce: validNonce,
						balance: validBalance,
						storageRoot: validStorageRoot,
						codeHash: validCodeHash,
					},
					[address2]: {
						nonce: '0x5',
						balance: '0xde0b6b3a7640000',
						storageRoot: validStorageRoot,
						codeHash: validCodeHash,
					},
				},
			})
			expect(Object.keys(result.state)).toHaveLength(2)
		})

		it('should accept empty storage', () => {
			const result = zLoadStateParams.parse({
				state: {
					[validAddress]: {
						nonce: validNonce,
						balance: validBalance,
						storageRoot: validStorageRoot,
						codeHash: validCodeHash,
						storage: {},
					},
				},
			})
			expect(result.state[validAddress]?.storage).toEqual({})
		})

		it('should accept empty state', () => {
			const result = zLoadStateParams.parse({ state: {} })
			expect(result.state).toEqual({})
		})
	})

	describe('invalid inputs', () => {
		it('should reject missing state', () => {
			expect(() => zLoadStateParams.parse({})).toThrow()
		})

		it('should reject invalid address key', () => {
			expect(() =>
				zLoadStateParams.parse({
					state: {
						'invalid-address': {
							nonce: validNonce,
							balance: validBalance,
							storageRoot: validStorageRoot,
							codeHash: validCodeHash,
						},
					},
				}),
			).toThrow()
		})

		it('should reject missing nonce', () => {
			expect(() =>
				zLoadStateParams.parse({
					state: {
						[validAddress]: {
							balance: validBalance,
							storageRoot: validStorageRoot,
							codeHash: validCodeHash,
						},
					},
				}),
			).toThrow()
		})

		it('should reject missing balance', () => {
			expect(() =>
				zLoadStateParams.parse({
					state: {
						[validAddress]: {
							nonce: validNonce,
							storageRoot: validStorageRoot,
							codeHash: validCodeHash,
						},
					},
				}),
			).toThrow()
		})

		it('should reject missing storageRoot', () => {
			expect(() =>
				zLoadStateParams.parse({
					state: {
						[validAddress]: {
							nonce: validNonce,
							balance: validBalance,
							codeHash: validCodeHash,
						},
					},
				}),
			).toThrow()
		})

		it('should reject missing codeHash', () => {
			expect(() =>
				zLoadStateParams.parse({
					state: {
						[validAddress]: {
							nonce: validNonce,
							balance: validBalance,
							storageRoot: validStorageRoot,
						},
					},
				}),
			).toThrow()
		})

		it('should reject invalid nonce (not hex)', () => {
			expect(() =>
				zLoadStateParams.parse({
					state: {
						[validAddress]: {
							nonce: 'not-hex',
							balance: validBalance,
							storageRoot: validStorageRoot,
							codeHash: validCodeHash,
						},
					},
				}),
			).toThrow()
		})

		it('should reject invalid storage key', () => {
			expect(() =>
				zLoadStateParams.parse({
					state: {
						[validAddress]: {
							nonce: validNonce,
							balance: validBalance,
							storageRoot: validStorageRoot,
							codeHash: validCodeHash,
							storage: {
								'invalid-key': '0x01',
							},
						},
					},
				}),
			).toThrow()
		})

		it('should reject null', () => {
			expect(() => zLoadStateParams.parse(null)).toThrow()
		})
	})

	describe('schema properties', () => {
		it('should have a description', () => {
			expect(zLoadStateParams.description).toBe('Properties shared across the load state')
		})
	})
})

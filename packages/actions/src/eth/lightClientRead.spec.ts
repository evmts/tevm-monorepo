import { describe, expect, it, vi } from 'vitest'
import { asLightSelector, ensureLightReady, getLightProof } from './lightClientRead.js'

describe('lightClientRead', () => {
	it('parses earliest and rejects pending and hashes', () => {
		expect(asLightSelector('earliest')).toBe(0n)
		expect(() => asLightSelector('pending')).toThrow('LIGHT_CLIENT_UNSUPPORTED_SELECTOR')
		expect(() => asLightSelector(`0x${'11'.repeat(32)}`)).toThrow('LIGHT_CLIENT_UNSUPPORTED_SELECTOR')
	})

	it('throws explicit not-ready error', () => {
		expect(() =>
			ensureLightReady(
				{ consensus: { mode: 'light-client', isReady: () => false }, getLightSyncStatus: () => ({ ready: true }) } as any,
				'eth_getBalance',
			),
		).toThrow('LIGHT_CLIENT_NOT_READY')
	})

	it('binds verification to state root and proof payload', async () => {
		const verifyRead = vi.fn().mockResolvedValue(true)
		await getLightProof(
			{
				consensus: {
					resolveStateRoot: async () => `0x${'aa'.repeat(32)}`,
					getProof: async () => ({
						balance: '0x1',
						nonce: '0x0',
						codeHash: `0x${'bb'.repeat(32)}`,
						storageHash: `0x${'cc'.repeat(32)}`,
						storageProof: [],
					}),
					verifyRead,
				},
			},
			`0x${'12'.repeat(20)}`,
			[],
			'latest',
		)
		expect(verifyRead).toHaveBeenCalledWith(
			expect.objectContaining({
				account: `0x${'12'.repeat(20)}`,
				stateRoot: `0x${'aa'.repeat(32)}`,
				selector: 'latest',
				proof: expect.any(Object),
			}),
		)
	})
})

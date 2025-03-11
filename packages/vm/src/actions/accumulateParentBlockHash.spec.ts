import { EipNotEnabledError } from '@tevm/errors'
import { describe, expect, it } from 'vitest'
import type { BaseVm } from '../BaseVm.js'
import { accumulateParentBlockHash } from './accumulateParentBlockHash.js'

describe('accumulateParentBlockHash', () => {
	// This test verifies the first error case
	it('should throw EipNotEnabledError if EIP 2935 is not activated', async () => {
		// Mock VM with EIP 2935 not activated
		const vm = {
			common: {
				ethjsCommon: {
					isActivatedEIP: () => false, // EIP 2935 is not active
				},
			},
		} as unknown as BaseVm

		const accumulate = accumulateParentBlockHash(vm)

		try {
			await accumulate(1n, new Uint8Array(32))
			// Should not reach here
			expect(true).toBe(false) // Force a failure if we don't throw
		} catch (error: unknown) {
			expect(error).toBeInstanceOf(EipNotEnabledError)
			expect((error as Error).message).toContain('EIP 2935 is not active')
		}
	})
})

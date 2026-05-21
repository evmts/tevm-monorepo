import { describe, expect, it } from 'vitest'
import { customTxTypes } from './CUSTOM_Tx_TYPES.js'

describe('CUSTOM_Tx_TYPES', () => {
	it('does not treat EIP-7702 transaction type as custom', () => {
		expect(customTxTypes).not.toContain('0x4')
		expect(customTxTypes).not.toContain('0x04')
	})
})

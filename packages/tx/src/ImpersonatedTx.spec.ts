import { describe, expect, it } from 'bun:test'
import { EthjsAddress } from '@tevm/utils'
import { createImpersonatedTx } from './createImpersonatedTx.js'

describe(createImpersonatedTx.name, () => {
	it('should impersonated a signed tx', () => {
		const impersonatedAddress = EthjsAddress.fromString(`0x${'69'.repeat(20)}`)
		const tx = createImpersonatedTx({
			data: '0x5234',
			impersonatedAddress,
		})
		expect(tx.hash()).toMatchSnapshot()
		expect(tx.isSigned()).toBeTrue()
		expect(tx.getSenderAddress()).toBe(impersonatedAddress)
	})
})

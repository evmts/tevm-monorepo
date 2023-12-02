import { CallActionValidator, type RunCallAction } from './runCall.js'
import { describe, expect, it } from 'bun:test'
import type { z } from 'zod'

describe('runCall', () => {
	it('should be able to use zod validator', () => {
		const address1 = '0x1f420000000000000000000000000000000000ff'
		const address2 = '0x2f420000000000000000000000000000000000ff'
		const transferAmount = 0x420n
		const action: RunCallAction = {
			caller: address1,
			data: '0x0',
			to: address2,
			value: transferAmount,
			origin: address1,
		}
		action satisfies z.infer<typeof CallActionValidator>
		expect(CallActionValidator.parse(action)).toEqual(action)
	})
})

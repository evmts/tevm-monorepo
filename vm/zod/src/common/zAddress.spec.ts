import { zAddress } from './zAddress.js'
import type { Address } from 'abitype'
import { expect, test } from 'bun:test'
import type { z } from 'zod'

test('zAddress', () => {
	const address = `0x${'69'.repeat(20)}` as const satisfies z.infer<
		typeof zAddress
	> satisfies Address
	expect(zAddress.parse(address)).toEqual(address)
})

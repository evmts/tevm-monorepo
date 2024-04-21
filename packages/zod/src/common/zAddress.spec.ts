import { expect, test } from 'bun:test'
import type { Address } from 'abitype'
import type { z } from 'zod'
import { zAddress } from './zAddress.js'

test('zAddress', () => {
	const address = `0x${'69'.repeat(20)}` as const satisfies z.infer<typeof zAddress> satisfies Address
	expect(zAddress.parse(address)).toEqual(address)
})

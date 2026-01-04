import { numberToHex } from '@tevm/utils'
import { type TestActions, testActions } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { MemoryClient } from '../../MemoryClient.js'

let mc: MemoryClient<any, any> & TestActions

beforeEach(async () => {
	mc = createMemoryClient().extend(testActions({ mode: 'anvil' }))
})

describe('setStorageAt', () => {
	it('should work as expected', async () => {
		await mc.setStorageAt({
			address: `0x${'0'.repeat(40)}`,
			index: 1,
			value: numberToHex(1, { size: 1 }),
		})
		expect(
			await mc.getStorageAt({
				address: `0x${'0'.repeat(40)}`,
				slot: numberToHex(1),
			}),
		).toEqual(numberToHex(1, { size: 1 }))
	})
})

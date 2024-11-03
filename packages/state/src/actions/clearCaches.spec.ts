import { EthjsAccount, EthjsAddress } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { clearCaches } from './clearCaches.js'

describe(clearCaches.name, () => {
	it('should clear storage contract and account caches', async () => {
		const baseState = createBaseState({
			loggingLevel: 'warn',
		})

		baseState.caches.accounts.put(createAddress(`0x${'01'.repeat(20)}`), new EthjsAccount())
		baseState.caches.contracts.put(createAddress(`0x${'01'.repeat(20)}`), Uint8Array.from([420]))
		baseState.caches.storage.put(
			createAddress(`0x${'01'.repeat(20)}`),
			Uint8Array.from([69]),
			Uint8Array.from([420]),
		)

		expect(baseState.caches.accounts.size()).toBe(1)
		expect(baseState.caches.contracts.size()).toBe(1)
		expect(baseState.caches.storage.size()).toBe(1)

		clearCaches(baseState)()

		expect(baseState.caches.accounts.size()).toBe(0)
		expect(baseState.caches.contracts.size()).toBe(0)
		expect(baseState.caches.storage.size()).toBe(0)
	})
})

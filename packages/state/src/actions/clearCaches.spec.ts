import { describe, expect, it } from 'bun:test'
import { createBaseState } from '../createBaseState.js'
import { clearCaches } from './clearCaches.js'
import { EthjsAccount, EthjsAddress } from '@tevm/utils'

describe(clearCaches.name, () => {
  it('should clear storage contract and account caches', async () => {
    const baseState = createBaseState()

    baseState._caches.accounts.put(EthjsAddress.fromString(`0x${'01'.repeat(20)}`), new EthjsAccount())
    baseState._caches.contracts.put(EthjsAddress.fromString(`0x${'01'.repeat(20)}`), Uint8Array.from([420]))
    baseState._caches.storage.put(EthjsAddress.fromString(`0x${'01'.repeat(20)}`), Uint8Array.from([69]), Uint8Array.from([420]))

    expect(baseState._caches.accounts.size()).toBe(1)
    expect(baseState._caches.contracts.size()).toBe(1)
    expect(baseState._caches.storage.size()).toBe(1)

    clearCaches(baseState)()

    expect(baseState._caches.accounts.size()).toBe(0)
    expect(baseState._caches.contracts.size()).toBe(0)
    expect(baseState._caches.storage.size()).toBe(0)
  })
})

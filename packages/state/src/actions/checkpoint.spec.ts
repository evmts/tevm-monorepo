import { describe, expect, it } from 'bun:test'
import { createBaseState } from '../createBaseState.js'
import { checkpoint } from './checkpoint.js'
import { revert } from './revert.js'

describe(checkpoint.name, () => {
  it('should call the underlying checkpoint', async () => {
    const baseState = createBaseState()
    expect(baseState._caches.storage._checkpoints).toBe(0)
    expect(baseState._caches.accounts._checkpoints).toBe(0)
    expect(baseState._caches.contracts._checkpoints).toBe(0)
    await checkpoint(baseState)()
    expect(baseState._caches.storage._checkpoints).toBe(1)
    expect(baseState._caches.accounts._checkpoints).toBe(1)
    expect(baseState._caches.contracts._checkpoints).toBe(1)
    await revert(baseState)()
    expect(baseState._caches.storage._checkpoints).toBe(0)
    expect(baseState._caches.accounts._checkpoints).toBe(0)
    expect(baseState._caches.contracts._checkpoints).toBe(0)
  })
})

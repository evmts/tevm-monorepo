import { describe, expect, it } from 'bun:test'
import { createBaseState } from '../createBaseState.js'
import { commit } from './commit.js'
import { checkpoint } from './checkpoint.js'

describe(commit.name, () => {
  it('should clear all storage entries for the account corresponding to `address`', async () => {
    const baseState = createBaseState()
    expect(baseState._caches.storage._checkpoints).toBe(0)
    expect(baseState._caches.accounts._checkpoints).toBe(0)
    expect(baseState._caches.contracts._checkpoints).toBe(0)
    await checkpoint(baseState)()
    expect(baseState._caches.storage._checkpoints).toBe(1)
    expect(baseState._caches.accounts._checkpoints).toBe(1)
    expect(baseState._caches.contracts._checkpoints).toBe(1)
    expect(baseState._caches.accounts._diffCache).toEqual([new Map(), new Map()])
    expect(baseState._caches.storage._diffCache).toEqual([new Map(), new Map()])
    await commit(baseState)()
    expect(baseState._caches.storage._checkpoints).toBe(0)
    expect(baseState._caches.accounts._checkpoints).toBe(0)
    expect(baseState._caches.contracts._checkpoints).toBe(0)
    expect(baseState._caches.accounts._diffCache).toEqual([new Map()])
    expect(baseState._caches.storage._diffCache).toEqual([new Map()])
  })
})

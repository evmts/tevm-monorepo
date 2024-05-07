import { describe, expect, it } from 'bun:test'
import { createBaseState } from '../createBaseState.js'
import { getStateRoot } from './getStateRoot.js'
import { hexToBytes } from 'viem'

describe(getStateRoot.name, () => {
  it('should return the current state root as bytes', async () => {
    const baseState = createBaseState()
    expect(await getStateRoot(baseState)()).toEqual(hexToBytes(baseState._currentStateRoot))
  })
})

import { describe, expect, it } from 'bun:test'
import { EthjsAddress, hexToBytes } from '@tevm/utils'
import { createBaseState } from '../createBaseState.js'
import { dumpStorage } from './dumpStorage.js'

describe(dumpStorage.name, () => {
  it('should dump storage from a given contract address', async () => {
    const baseState = createBaseState({
      loggingLevel: 'warn'
    })

    const address = EthjsAddress.fromString(`0x${'01'.repeat(20)}`)

    const key0 = hexToBytes('0x0')
    const key1 = hexToBytes('0x1')
    const value0 = hexToBytes('0x42')
    const value1 = hexToBytes('0x69')

    baseState.caches.storage.put(address, key0, value0)
    baseState.caches.storage.put(address, key1, value1)

    expect(await dumpStorage(baseState)(address)).toEqual({
      '00': '0x42',
      '01': '0x69',
    })
  })
})

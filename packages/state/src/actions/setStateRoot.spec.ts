import { describe, expect, it } from 'bun:test'
import { EthjsAddress, bytesToHex } from '@tevm/utils'
import { hexToBytes } from 'ethereum-cryptography/utils'
import { createBaseState } from '../createBaseState.js'
import { getAccount } from './getAccount.js'
import { NoStateRootExistsError, setStateRoot } from './setStateRoot.js'

describe(setStateRoot.name, () => {
  it('should set state root', async () => {
    const address = `0x${'01'.repeat(20)}` as const
    const baseState = createBaseState()
    await baseState.ready()
    const root = hexToBytes(`0x${'11'.repeat(32)}`)
    baseState._stateRoots.set(bytesToHex(root), {
      [address]: {
        balance: 420n,
        nonce: 1n,
        storageRoot: '0x69',
        codeHash: '0x420',
      },
    })
    await setStateRoot(baseState)(root)
    const account = await getAccount(baseState)(EthjsAddress.fromString(address))
    expect(account?.balance).toBe(420n)
  })

  it('should throw if no state root exists', async () => {
    const baseState = createBaseState()
    await baseState.ready()
    const root = hexToBytes(`0x${'11'.repeat(32)}`)
    expect(() => setStateRoot(baseState)(root)).toThrowError(
      new NoStateRootExistsError(`State root for ${bytesToHex(root)} does not exist`),
    )
  })
})

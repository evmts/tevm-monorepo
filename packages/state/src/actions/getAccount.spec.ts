import { describe, expect, it } from 'bun:test'
import { createBaseState } from '../createBaseState.js'
import { putAccount } from './putAccount.js'
import { EthjsAccount, EthjsAddress } from '@tevm/utils'
import { getAccount } from './getAccount.js'

describe(getAccount.name, () => {
  it('Should get an account', async () => {
    const baseState = createBaseState()

    const address = EthjsAddress.fromString(`0x${'01'.repeat(20)}`)
    const balance = 420n
    const nonce = 2n
    const account = EthjsAccount.fromAccountData({
      balance,
      nonce,
    })

    await putAccount(baseState)(address, account)

    expect(await getAccount(baseState)(address)).toEqual(account)
  })
})

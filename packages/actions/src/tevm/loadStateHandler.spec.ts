import { loadStateHandler } from './loadStateHandler.js'
import { createStateManager } from '@tevm/state'
import { EthjsAddress } from '@tevm/utils'
import { bytesToHex, hexToBytes } from '@tevm/utils'
import { expect, test } from 'bun:test'
import { dumpStateHandler } from './dumpStateHandler.js'

test('should load state into the state manager', async () => {
  const stateManager = createStateManager({})

  const address = EthjsAddress.fromString(
    '0x0420042004200420042004200420042004200420',
  )

  let accountData = await stateManager.getAccount(address)

  // Expect state to be initially empty
  expect(accountData?.nonce).toBeUndefined()
  expect(accountData?.balance).toBeUndefined()

  const hashedStorageKey =
    '0x0c2d1b9c97b15f8a18e224fe94a8453f996465e14217e0939995ce76fbe01129'
  const storageValue =
    '0xa01000000000000000000000000000000000000000000000000000000000000000'

  //calls tevm state manager loadState method
  const state = {
    '0x0420042004200420042004200420042004200420': {
      nonce: 0n,
      balance: 100n,
      storageRoot:
        '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421' as const,

      codeHash:
        '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470' as const,
      storage: {
        '0x0c2d1b9c97b15f8a18e224fe94a8453f996465e14217e0939995ce76fbe01129':
          '0xa01000000000000000000000000000000000000000000000000000000000000000',
      },
    },
  }

  const client = { getVm: () => ({ stateManager }) } as any

  await loadStateHandler(client)({ state })

  accountData = await stateManager.getAccount(address)

  expect(accountData?.nonce).toEqual(0n)
  expect(accountData?.balance).toEqual(100n)

  const storedValue = await stateManager.getContractStorage(
    address,
    hexToBytes(hashedStorageKey),
  )

  expect(bytesToHex(storedValue)).toBe(storageValue)

  expect(await dumpStateHandler(client)()).toEqual({
    state: {
      "0x0420042004200420042004200420042004200420": {
        nonce: 0n,
        balance: 100n,
        storageRoot: "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
        codeHash: "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
        storage: {
          "0c2d1b9c97b15f8a18e224fe94a8453f996465e14217e0939995ce76fbe01129": "0xa01000000000000000000000000000000000000000000000000000000000000000",
        },
      },
    },
  })
})

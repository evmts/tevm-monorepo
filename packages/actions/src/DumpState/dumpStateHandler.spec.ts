import { createTevmNode } from '@tevm/node'
import { EthjsAccount, EthjsAddress, bytesToHex } from '@tevm/utils'
import { hexToBytes } from '@tevm/utils'
import { expect, test } from 'vitest'
import { loadStateHandler } from '../LoadState/loadStateHandler.js'
import { dumpStateHandler } from './dumpStateHandler.js'

test('should dump important account info and storage', async () => {
	const accountAddress = '0x0420042004200420042004200420042004200420'
	const account = EthjsAddress.fromString(accountAddress)

	const accountInstance = new EthjsAccount(0n, 100n)

	const client = createTevmNode()
	;(await client.getVm()).stateManager.putAccount(account, accountInstance)

	const storageKey = hexToBytes('0x1', { size: 32 })
	const storageValue = hexToBytes('0x1', { size: 32 })
	;(await client.getVm()).stateManager.putContractStorage(account, storageKey, storageValue)

	const { state: dumpedState } = await dumpStateHandler(client)()

	const accountData = dumpedState[accountAddress]

	expect(accountData?.nonce).toEqual(0n)
	expect(accountData?.balance).toEqual(100n)

	const storage = accountData?.storage ?? {}
	expect(storage[bytesToHex(storageKey).slice(2)]).toEqual(bytesToHex(storageValue))

	expect(Object.keys(storage).length).toBe(1)

	const client2 = createTevmNode()

	await loadStateHandler(client2)({
		state: dumpedState,
	})
	const accountStorage = await (await client2.getVm()).stateManager.getContractStorage(account, storageKey)

	expect(accountStorage).toEqual(storageValue)
})

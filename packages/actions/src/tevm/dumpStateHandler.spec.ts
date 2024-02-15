import { dumpStateHandler } from './dumpStateHandler.js'
import { loadStateHandler } from './loadStateHandler.js'
import { createBaseClient } from '@tevm/base-client'
import { EthjsAccount, EthjsAddress } from '@tevm/utils'
import { hexToBytes, keccak256, toRlp } from '@tevm/utils'
import { expect, test } from 'bun:test'

test('should dump important account info and storage', async () => {
	const accountAddress = '0x0420042004200420042004200420042004200420'
	const account = EthjsAddress.fromString(accountAddress)

	const accountInstance = new EthjsAccount(0n, 100n)

	const client = await createBaseClient()

	client.vm.stateManager.putAccount(account, accountInstance)

	const storageKey = hexToBytes('0x1', { size: 32 })
	const storageValue = hexToBytes('0x1', { size: 32 })
	client.vm.stateManager.putContractStorage(account, storageKey, storageValue)

	const { state: dumpedState } = await dumpStateHandler(client)()

	const accountData = dumpedState[accountAddress]

	expect(accountData?.nonce).toEqual(0n)
	expect(accountData?.balance).toEqual(100n)

	//Trie stores the keccak256 of the storage key and the value is rlp encoded
	const storage = accountData?.storage ?? {}
	expect(storage[keccak256(storageKey, 'hex')]).toEqual(toRlp(storageValue))

	expect(Object.keys(storage).length).toBe(1)

	const client2 = await createBaseClient()

	await loadStateHandler(client2)({
		state: dumpedState,
	})
	const accountStorage = await client2.vm.stateManager.getContractStorage(
		account,
		hexToBytes(keccak256(storageKey, 'hex')),
	)

	expect(accountStorage).toEqual(storageValue)
})

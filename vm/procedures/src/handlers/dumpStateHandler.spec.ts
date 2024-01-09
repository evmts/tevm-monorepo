import { RunDumpStateActionHandler } from './dumpStateHandler.js'
import { RunLoadStateActionHandler } from './loadStateHandler.js'
import { Account, Address } from '@ethereumjs/util'
import { DefaultTevmStateManager } from '@tevm/state'
import { expect, test } from 'bun:test'
import { hexToBytes, keccak256, toRlp } from 'viem'

test('should dump important account info and storage', async () => {
	const stateManager = new DefaultTevmStateManager()

	const accountAddress = '0x0420042004200420042004200420042004200420'
	const account = Address.fromString(accountAddress)

	const accountInstance = new Account(0n, 100n)

	stateManager.putAccount(account, accountInstance)

	const storageKey = hexToBytes('0x1', { size: 32 })
	const storageValue = hexToBytes('0x1', { size: 32 })
	stateManager.putContractStorage(account, storageKey, storageValue)

	const dumpedState = await RunDumpStateActionHandler(stateManager)

	const accountData = dumpedState[accountAddress]

	expect(accountData?.nonce).toEqual(0n)
	expect(accountData?.balance).toEqual(100n)

	//Trie stores the keccak256 of the storage key and the value is rlp encoded
	const storage = accountData?.storage ?? {}
	expect(storage[keccak256(storageKey, 'hex')]).toEqual(toRlp(storageValue))

	expect(Object.keys(storage).length).toBe(1)

	const stateManager2 = new DefaultTevmStateManager()

	await RunLoadStateActionHandler(stateManager2, dumpedState)
	const accountStorage = await stateManager2.getContractStorage(
		account,
		hexToBytes(keccak256(storageKey, 'hex')),
	)

	expect(accountStorage).toEqual(storageValue)
})

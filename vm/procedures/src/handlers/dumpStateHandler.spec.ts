import { Account, Address } from '@ethereumjs/util'
import { hexToBytes, keccak256, toRlp } from 'viem'
import { createTevm } from '../../../vm/src/createTevm.js'
import { RunDumpStateActionHandler } from './dumpStateHandler.js'
import { RunLoadStateActionHandler } from './loadStateHandler.js'
import { expect, test } from 'bun:test'

test('should dump important account info and storage', async () => {
	const tevm = await createTevm()

	const accountAddress = '0x0420042004200420042004200420042004200420'
	const account = Address.fromString(accountAddress)

	const accountInstance = new Account(0n, 100n)

	tevm._evm.stateManager.putAccount(account, accountInstance)

	const storageKey = hexToBytes('0x1', { size: 32 })
	const storageValue = hexToBytes('0x1', { size: 32 })
	tevm._evm.stateManager.putContractStorage(account, storageKey, storageValue)

	const dumpedState = await RunDumpStateActionHandler(tevm._evm.stateManager)

	const accountData = dumpedState[accountAddress]

	expect(accountData?.nonce).toEqual(0n)
	expect(accountData?.balance).toEqual(100n)

	//Trie stores the keccak256 of the storage key and the value is rlp encoded
	const storage = accountData?.storage ?? {}
	expect(storage[keccak256(storageKey, 'hex')]).toEqual(toRlp(storageValue))

	let accountStorage = await tevm._evm.stateManager.getContractStorage(
		account,
		storageKey,
	)

	expect(Object.keys(accountStorage).length).toBe(1)

	const tevm2 = await createTevm()

	await RunLoadStateActionHandler(tevm2, dumpedState)
	accountStorage = await tevm2._evm.stateManager.getContractStorage(
		account,
		hexToBytes(keccak256(storageKey, 'hex')),
	)
})

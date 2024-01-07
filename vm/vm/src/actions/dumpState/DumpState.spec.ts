import { Address } from '@ethereumjs/util'
import { hexToBytes } from 'viem'
import { createTevm } from '../../createTevm.js'
import { RunDumpStateActionHandler } from './RunDumpStateActionHandler.js'
import { expect, test } from 'bun:test'

test('should dump important account info and storage', async () => {
	const tevm = await createTevm()

	const accountAddress = '0x0420042004200420042004200420042004200420'
	const account = Address.fromString(accountAddress)
	tevm.putAccount({ account: accountAddress, balance: 100n })

	const storageKey = hexToBytes('0x48656c6c6f20576f726c6421', { size: 32 })
	const storageValue = hexToBytes('0x48656c6c6f20576f726c6421', { size: 32 })
	0xe94221640002d9d59e66a8025d032dd0171dc4555914e89fdfacb92d57fee992
	tevm._evm.stateManager.putContractStorage(account, storageKey, storageValue)

	const res = await RunDumpStateActionHandler(tevm._evm.stateManager)

	const accountData = res[accountAddress]

	expect(accountData?.nonce).toEqual(0n)
	expect(accountData?.balance).toEqual(100n)

	console.log(accountData?.storage)
	//TODO : check storage data is dumped properly
})

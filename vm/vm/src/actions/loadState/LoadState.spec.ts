import { Address } from '@ethereumjs/util'
import { hexToBytes } from 'viem'
import { createTevm } from '../../createTevm.js'
import { expect, test } from 'bun:test'

test('should load state into the state manager', async () => {
	const tevm = await createTevm()

	//calls tevm state manager loadState method
	const state = {
		'0x0420042004200420042004200420042004200420': {
			nonce: 0n,
			balance: 100n,
			storageRoot: hexToBytes('0x48656c6c6f20576f726c6421', { size: 32 }),
			codeHash: hexToBytes('0x48656c6c6f20576f726c6421', { size: 32 }),
		},
	}

	await tevm._evm.stateManager.loadState(state)

	const account = Address.fromString(
		'0x0420042004200420042004200420042004200420',
	)
	const accountData = await tevm._evm.stateManager.getAccount(account)

	expect(accountData?.nonce).toEqual(0n)
	expect(accountData?.balance).toEqual(100n)
})

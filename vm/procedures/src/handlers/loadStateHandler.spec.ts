import { loadStateHandler } from './loadStateHandler.js'
import { Address } from '@ethereumjs/util'
import { DefaultTevmStateManager } from '@tevm/state'
import { expect, test } from 'bun:test'
import { bytesToHex, hexToBytes, toRlp } from 'viem'

test('should load state into the state manager', async () => {
	const stateManager = new DefaultTevmStateManager()

	const account = Address.fromString(
		'0x0420042004200420042004200420042004200420',
	)

	let accountData = await stateManager.getAccount(account)

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
			storageRoot: hexToBytes(
				'0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
				{ size: 32 },
			),
			codeHash: hexToBytes(
				'0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
				{ size: 32 },
			),
			storage: {
				'0x0c2d1b9c97b15f8a18e224fe94a8453f996465e14217e0939995ce76fbe01129':
					'0xa01000000000000000000000000000000000000000000000000000000000000000',
			},
		},
	}

	await loadStateHandler(stateManager)({ state })

	accountData = await stateManager.getAccount(account)

	expect(accountData?.nonce).toEqual(0n)
	expect(accountData?.balance).toEqual(100n)

	const storageDump = await stateManager.dumpStorage(account)

	expect(Object.keys(storageDump).length).toBe(1)

	const storedValue = await stateManager.getContractStorage(
		account,
		hexToBytes(hashedStorageKey),
	)

	expect(toRlp(bytesToHex(storedValue))).toBe(storageValue)
})

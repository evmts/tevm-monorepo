import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { createStateManager } from '@tevm/state'
import { bytesToHex, hexToBytes } from '@tevm/utils'
import { describe, expect, test } from 'vitest'
import { dumpStateHandler } from '../DumpState/dumpStateHandler.js'
import { loadStateHandler } from './loadStateHandler.js'

test('should load state into the state manager', async () => {
	const stateManager = createStateManager({})

	const address = createAddress('0x0420042004200420042004200420042004200420')

	let accountData = await stateManager.getAccount(address)

	// Expect state to be initially empty
	expect(accountData?.nonce).toBeUndefined()
	expect(accountData?.balance).toBeUndefined()

	const hashedStorageKey = '0x0c2d1b9c97b15f8a18e224fe94a8453f996465e14217e0939995ce76fbe01129'
	const storageValue = '0xa01000000000000000000000000000000000000000000000000000000000000000'

	//calls tevm state manager loadState method
	const state = {
		'0x0420042004200420042004200420042004200420': {
			nonce: '0x0',
			balance: '0x64',
			storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421' as const,

			codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470' as const,
			storage: {
				'0x0c2d1b9c97b15f8a18e224fe94a8453f996465e14217e0939995ce76fbe01129':
					'0xa01000000000000000000000000000000000000000000000000000000000000000',
			},
		},
	} as const

	const client = { getVm: () => ({ stateManager }) } as any

	await loadStateHandler(client)({ state, throwOnFail: false })

	accountData = await stateManager.getAccount(address)

	expect(accountData?.nonce).toEqual(0n)
	expect(accountData?.balance).toEqual(100n)

	const storedValue = await stateManager.getStorage(address, hexToBytes(hashedStorageKey))

	expect(bytesToHex(storedValue)).toEqualHex(storageValue)

	expect(await dumpStateHandler(client)()).toEqual({
		state: {
			'0x0420042004200420042004200420042004200420': {
				nonce: '0x0',
				balance: '0x64',
				storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
				codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
				storage: {
					'0x0c2d1b9c97b15f8a18e224fe94a8453f996465e14217e0939995ce76fbe01129':
						'0xa01000000000000000000000000000000000000000000000000000000000000000',
				},
			},
		},
	})
})

describe('loadStateHandler', () => {
	test('should return errors for invalid params', async () => {
		const client = createTevmNode()
		const handler = loadStateHandler(client)

		const result = await handler({
			state: 5 as any,
			throwOnFail: false,
		} as any)

		expect(result.errors).toBeDefined()
		expect(result.errors?.length).toBeGreaterThan(0)
		expect(result.errors?.[0]?.message).toMatchInlineSnapshot(`
			"Invalid state: Invalid input: expected record, received number

			Docs: https://tevm.sh/reference/tevm/errors/classes/invalidrequesterror/
			Version: 1.1.0.next-73"
		`)
	})

	test('should throw error for unsupported state manager', async () => {
		const client = createTevmNode()
		const vm = await client.getVm()
		// @ts-expect-error - Intentionally removing the method for testing
		delete vm.stateManager.generateCanonicalGenesis

		const handler = loadStateHandler({ getVm: () => Promise.resolve(vm) } as any)

		const result = await handler({ state: {}, throwOnFail: false })
		expect(result.errors?.[0]?.message).toMatchInlineSnapshot(`
"UnexpectedError

Docs: https://tevm.sh/reference/tevm/errors/classes/internalerror/
Details: Unsupported state manager. Must use a Tevm state manager from \`@tevm/state\` package. This may indicate a bug in tevm internal code.
Version: 1.1.0.next-73"
`)
	})

	test('should handle error when generating genesis fails', async () => {
		const client = createTevmNode()
		const vm = await client.getVm()
		vm.stateManager.generateCanonicalGenesis = () => {
			throw new Error('Genesis generation failed')
		}

		const handler = loadStateHandler({ getVm: () => Promise.resolve(vm) } as any)

		const result = await handler({
			state: {},
			throwOnFail: false,
		})

		expect(result.errors).toBeDefined()
		expect(result.errors?.length).toBe(1)
		expect(result.errors?.[0]?.message).toMatchInlineSnapshot(`
"UnexpectedError

Docs: https://tevm.sh/reference/tevm/errors/classes/internalerror/
Details: Genesis generation failed
Version: 1.1.0.next-73"
`)
		expect(result.errors?.[0]?.cause?.message).toMatchInlineSnapshot(`"Genesis generation failed"`)
	})
})

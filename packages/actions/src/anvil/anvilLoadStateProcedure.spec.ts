import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { createAccount, bytesToHex } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { anvilLoadStateJsonRpcProcedure } from './anvilLoadStateProcedure.js'

describe('anvilLoadStateJsonRpcProcedure', () => {
	it('should successfully load state', async () => {
		const client = createTevmNode()
		const loadStateProcedure = anvilLoadStateJsonRpcProcedure(client)

		const testAddress = createAddress('0x1234567890123456789012345678901234567890')
		const account = createAccount({ balance: 1000n, nonce: 1n })

		const request = {
			method: 'anvil_loadState',
			params: [
				{
					state: {
						[testAddress.toString()]: bytesToHex(account.serialize()),
					},
				},
			],
			jsonrpc: '2.0',
			id: 1,
		} as const

		const result = await loadStateProcedure(request)

		// Check successful state loading
		const vm = await client.getVm()
		const loadedAccount = await vm.stateManager.getAccount(testAddress)

		expect(loadedAccount?.balance).toBe(1000n)
		expect(loadedAccount?.nonce).toBe(1n)

		// Check the returned result
		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_loadState',
			result: null,
			id: 1,
		})
	})
})

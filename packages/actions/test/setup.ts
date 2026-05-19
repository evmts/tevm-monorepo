import { createTevmNode } from '@tevm/node'
import { isAddress } from 'viem'
import { expect } from 'vitest'
import { getAccountHandler } from '../src/GetAccount/getAccountHandler.js'

expect.extend({
	async toHaveState(received, client, expectedState) {
		const address = typeof received === 'string' ? received : received?.address
		if (!isAddress(address)) throw new Error(`Invalid address: ${address}`)

		const node = 'request' in client ? createTevmNode({ fork: { transport: client } }) : client
		const account = await getAccountHandler(node, { throwOnFail: false })({ address, returnStorage: true })
		if (account.errors) throw new Error(account.errors[0]?.message ?? 'Could not retrieve account')

		const { storage = {}, ...state } = expectedState
		const mismatchedKeys = []

		for (const [key, expectedValue] of Object.entries(state)) {
			if (account[key as keyof typeof account] !== expectedValue) mismatchedKeys.push(key)
		}

		for (const [slot, expectedValue] of Object.entries(storage as Record<string, unknown>)) {
			if (account.storage?.[slot] !== expectedValue) {
				mismatchedKeys.push('storage')
				break
			}
		}

		const pass = mismatchedKeys.length === 0

		return {
			pass,
			actual: pass ? undefined : account,
			expected: pass ? undefined : expectedState,
			message: () =>
				pass
					? `Expected account ${address} not to have state`
					: `Expected account ${address} to have state but mismatched keys: ${mismatchedKeys.join(', ')}`,
		}
	},
})

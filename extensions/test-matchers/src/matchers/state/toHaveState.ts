import { getAccountHandler } from '@tevm/actions'
import { createTevmNode, type TevmNode } from '@tevm/node'
import { type Address, type Hex, isAddress } from '@tevm/utils'
import type { Client } from 'viem'
import type { ContainsAddress } from '../../common/types.js'
import type { ExpectedState } from './types.js'

export const toHaveState = async (
	received: Address | ContainsAddress,
	client: Client | TevmNode,
	expectedState: ExpectedState,
) => {
	const address = typeof received === 'string' ? received : received.address
	if (!isAddress(address)) throw new Error(`Invalid address: ${address}`)

	const node = 'request' in client ? createTevmNode({ fork: { transport: client as any } }) : client
	const account = await getAccountHandler(node, { throwOnFail: false })({ address, returnStorage: true })

	if (account.errors) throw new Error(account.errors[0]?.message ?? 'Could not retrieve account')

	const { storage = {}, ...state } = expectedState
	const mismatchedKeys: (keyof ExpectedState)[] = []

	// Check provided state entries (except storage)
	Object.entries(state).forEach(([_key, expectedValue]) => {
		const key = _key as keyof Omit<ExpectedState, 'storage'>
		const actualValue = account[key]
		if (actualValue !== expectedValue) mismatchedKeys.push(key)
	})

	// Check provided storage entries
	for (const [_slot, expectedValue] of Object.entries(storage)) {
		const slot = _slot as Hex
		const actualValue = account.storage?.[slot]
		if (actualValue !== expectedValue) {
			mismatchedKeys.push('storage')
			break
		}
	}

	const pass = mismatchedKeys.length === 0

	return {
		pass,
		message: () =>
			pass
				? `Expected account ${address} not to have state.`
				: `Expected account ${address} to have state but received mismatched state at keys: ${mismatchedKeys.join(', ')}`,
		// Only show provided keys with their actual values so it's not confusing
		actual: pass
			? undefined
			: {
					...Object.fromEntries(
						Object.entries(expectedState)
							.filter(([key]) => key !== 'storage')
							.map(([key]) => [key, account[key as keyof typeof account] ?? undefined]),
					),
					...(Object.keys(expectedState).includes('storage') && expectedState.storage
						? {
								storage: Object.fromEntries(
									Object.entries(expectedState.storage).map(([slot]) => [
										slot,
										account.storage?.[slot as Hex] ?? undefined,
									]),
								),
							}
						: {}),
				},
		expected: pass ? undefined : expectedState,
	}
}

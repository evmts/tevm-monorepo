import { getAccountHandler } from '@tevm/actions'
import { createTevmNode, type TevmNode } from '@tevm/node'
import { type Address, type Client, type Hex, isAddress } from 'viem'
import type { ContainsAddress } from '../../common/types.js'
import type { ExpectedStorage } from './types.js'

export const toHaveStorageAt = async (
	received: Address | ContainsAddress,
	client: Client | TevmNode,
	expectedStorage: ExpectedStorage,
) => {
	const address = typeof received === 'string' ? received : received.address
	if (!isAddress(address)) throw new Error(`Invalid address: ${address}`)

	const node = 'request' in client ? createTevmNode({ fork: { transport: client } }) : client
	const account = await getAccountHandler(node, { throwOnFail: false })({ address, returnStorage: true })

	if (account.errors) throw new Error(account.errors[0]?.message ?? 'Could not retrieve account')

	const storageEntries = Array.isArray(expectedStorage) ? expectedStorage : [expectedStorage]
	const mismatchedSlots: Hex[] = []

	// Check each storage entry
	for (const { slot, value: expectedValue } of storageEntries) {
		const actualValue = account.storage?.[slot]
		if (actualValue !== expectedValue) mismatchedSlots.push(slot)
	}

	const pass = mismatchedSlots.length === 0

	return {
		pass,
		message: () =>
			pass
				? `Expected account ${address} not to have storage values at the specified slots.`
				: `Expected account ${address} to have storage values at slots: ${mismatchedSlots.join(', ')}`,
		actual: pass
			? undefined
			: storageEntries.map(({ slot }) => ({ slot, value: account.storage?.[slot] ?? undefined })),
		expected: pass ? undefined : storageEntries.map(({ slot, value }) => ({ slot, value })),
	}
}

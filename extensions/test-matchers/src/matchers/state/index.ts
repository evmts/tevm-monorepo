import type { TevmNode } from '@tevm/node'
import type { Client } from 'viem'
import { toBeInitializedAccount } from './toBeInitializedAccount.js'
import { toHaveState } from './toHaveState.js'
import { toHaveStorageAt } from './toHaveStorageAt.js'
import type { ExpectedState, ExpectedStorage } from './types.js'

export { toBeInitializedAccount, toHaveState, toHaveStorageAt }

export interface StateMatchers {
	/**
	 * Asserts that an address contains deployed contract code (is initialized).
	 * Fails if the address is an EOA or has no code.
	 *
	 * @param client - The client or node to use for state queries
	 *
	 * @example
	 * ```typescript
	 * // Check if address has deployed code
	 * await expect('0x742d35Cc5dB4c8E9f8D4Dc1Ef70c4c7c8E5b7A6b')
	 *   .toBeInitializedAccount(client)
	 *
	 * // Check EOA (should fail)
	 * await expect('0x0000000000000000000000000000000000000000')
	 *   .not.toBeInitializedAccount(client)
	 * ```
	 *
	 * @see {@link toHaveState} to check specific state properties
	 */
	toBeInitializedAccount(client: Client | TevmNode): Promise<void>

	/**
	 * Asserts that an account has specific state properties.
	 * Can check balance, nonce, code, and storage in a single assertion.
	 *
	 * @param client - The client or node to use for state queries
	 * @param expectedState - The expected state properties (partial match)
	 *
	 * @example
	 * ```typescript
	 * // Check multiple state properties
	 * await expect('0x742d35Cc5dB4c8E9f8D4Dc1Ef70c4c7c8E5b7A6b')
	 *   .toHaveState(client, {
	 *     balance: 1000n,
	 *     nonce: 5n,
	 *     code: '0x6080604052...', // contract bytecode
	 *     storage: {
	 *       '0x0': '0x1',
	 *       '0x1': '0x2'
	 *     }
	 *   })
	 *
	 * // Check only balance
	 * await expect(address).toHaveState(client, { balance: 0n })
	 * ```
	 *
	 * @see {@link toHaveStorageAt} to check only storage
	 * @see {@link toBeInitializedAccount} to check if contract exists
	 */
	toHaveState(client: Client | TevmNode, expectedState: ExpectedState): Promise<void>

	/**
	 * Asserts that a contract has specific storage values at given slots.
	 *
	 * @param client - The client or node to use for state queries
	 * @param expectedStorage - Single storage entry or array of entries
	 *
	 * @example
	 * ```typescript
	 * // Check single storage slot
	 * await expect(contractAddress)
	 *   .toHaveStorageAt(client, {
	 *     slot: '0x0',
	 *     value: '0x1'
	 *   })
	 *
	 * // Check multiple storage slots
	 * await expect(contractAddress)
	 *   .toHaveStorageAt(client, [
	 *     { slot: '0x0', value: '0x1' },    // owner
	 *     { slot: '0x1', value: '0x64' },   // totalSupply = 100
	 *     { slot: '0x2', value: '0x0' },    // paused = false
	 *   ])
	 * ```
	 *
	 * @see {@link toHaveState} to check multiple state properties
	 */
	toHaveStorageAt(client: Client | TevmNode, expectedStorage: ExpectedStorage): Promise<void>
}

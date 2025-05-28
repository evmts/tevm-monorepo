import type { EvmStateManagerInterface } from '@tevm/common'
import type { Address } from 'viem'
import type { BaseState } from './BaseState.js'
import type { TevmState } from './state-types/index.js'

export interface StateManager extends EvmStateManagerInterface {
	/**
	 * The internal state representation
	 */
	_baseState: BaseState
	ready: BaseState['ready']
	/**
	 * Returns contract addresses
	 */
	getAccountAddresses: () => Set<Address>
	/**
	 * Returns a new instance of the ForkStateManager with the same opts and all storage copied over
	 */
	deepCopy(): Promise<StateManager>
	/**
	 * Dumps the state of the state manager as a {@link TevmState}
	 */
	dumpCanonicalGenesis(): Promise<TevmState>
	/**
	 * Resets all internal caches
	 */
	clearCaches(): void
	/**
	 * @experimental
	 * Saves a state root to the state root mapping
	 * THis API is considered unstable
	 */
	saveStateRoot(root: Uint8Array, state: TevmState): void
	/**
	 * Commits the current state.
	 */
	commit(
		/**
		 * @experimental
		 * Whether to create a new state root
		 * Defaults to true.
		 * This api is not stable
		 */
		createNewStateRoot?: boolean,
	): Promise<void>
	/**
	 * Clears all storage entries for the account
	 */
	clearContractStorage(address: import('@tevm/utils').EthjsAddress): Promise<void>
	/**
	 * Dumps storage based on the input
	 */
	dumpStorage(address: import('@tevm/utils').EthjsAddress): Promise<import('@tevm/common').StorageDump>
	/**
	 * Dumps a range of storage values
	 */
	dumpStorageRange(
		address: import('@tevm/utils').EthjsAddress,
		startKey: bigint,
		limit: number,
	): Promise<import('@tevm/common').StorageRange>
	/**
	 * Loads a state from a given state root
	 */
	generateCanonicalGenesis(state: TevmState): Promise<void>
	/**
	 * Get an EIP-1186 proof from the provider
	 * @param address - The address to get proof for
	 * @param storageSlots - Storage slots to include in the proof
	 * @returns The account and storage proof
	 */
	getProof(
		address: import('@tevm/utils').EthjsAddress,
		storageSlots?: Uint8Array[],
	): Promise<import('@ethereumjs/statemanager').Proof>
}

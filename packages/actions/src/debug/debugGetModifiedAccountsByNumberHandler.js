import { bytesToHex, hexToBigInt } from '@tevm/utils'

/**
 * Returns addresses of accounts modified between two block numbers
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugHandler.js').DebugGetModifiedAccountsByNumberHandler}
 * @example
 * ```typescript
 * import { createTevmNode } from 'tevm/node'
 * import { debugGetModifiedAccountsByNumberHandler } from 'tevm/actions'
 *
 * const client = createTevmNode()
 *
 * const getModifiedAccounts = debugGetModifiedAccountsByNumberHandler(client)
 *
 * const result = await getModifiedAccounts({
 *   startBlockNumber: 100n,
 *   endBlockNumber: 101n
 * })
 * console.log(result) // Array of modified account addresses
 * ```
 */
export const debugGetModifiedAccountsByNumberHandler = (client) => async (params) => {
	const { logger, getVm } = client
	logger.debug(params, 'debugGetModifiedAccountsByNumberHandler: executing get modified accounts with params')

	const vm = await getVm()
	const { startBlockNumber, endBlockNumber } = params

	// Normalize block numbers
	const normalizeBlockNumber = (/** @type {import('@tevm/utils').Hex | Uint8Array | number | bigint} */ bn) => {
		if (typeof bn === 'string') {
			return hexToBigInt(/** @type {import('@tevm/utils').Hex} */ (bn))
		} else if (bn instanceof Uint8Array) {
			return hexToBigInt(bytesToHex(bn))
		} else if (typeof bn === 'number') {
			return BigInt(bn)
		}
		return bn
	}

	const startBN = normalizeBlockNumber(startBlockNumber)
	const endBN = endBlockNumber !== undefined ? normalizeBlockNumber(endBlockNumber) : startBN + 1n

	logger.debug({ startBN, endBN }, 'debugGetModifiedAccountsByNumberHandler: normalized block numbers')

	if (endBN <= startBN) {
		throw new Error('End block number must be greater than start block number')
	}

	// Get both blocks
	const startBlock = await vm.blockchain.getBlockByTag(startBN)
	const endBlock = await vm.blockchain.getBlockByTag(endBN)

	logger.debug(
		{
			startBlockNumber: startBlock.header.number,
			startBlockHash: bytesToHex(startBlock.hash()),
			endBlockNumber: endBlock.header.number,
			endBlockHash: bytesToHex(endBlock.hash()),
		},
		'debugGetModifiedAccountsByNumberHandler: got blocks',
	)

	// Get states for both blocks
	if (!('dumpCanonicalGenesis' in vm.stateManager)) {
		throw new Error('Unsupported state manager. Must use a TEVM state manager from @tevm/state package.')
	}

	const startStateRootHex = bytesToHex(startBlock.header.stateRoot)
	const endStateRootHex = bytesToHex(endBlock.header.stateRoot)

	let startState = {}
	let endState = {}

	if (await vm.stateManager.hasStateRoot(startBlock.header.stateRoot)) {
		startState = vm.stateManager._baseState.stateRoots.get(startStateRootHex) ?? {}
	}

	if (await vm.stateManager.hasStateRoot(endBlock.header.stateRoot)) {
		endState = vm.stateManager._baseState.stateRoots.get(endStateRootHex) ?? {}
	}

	// Find modified accounts
	const modifiedAddresses = new Set()

	// Check all accounts in end state
	for (const address of Object.keys(endState)) {
		const startAccount = startState[address]
		const endAccount = endState[address]

		// Account is modified if:
		// 1. It didn't exist in start state
		// 2. Balance changed
		// 3. Nonce changed
		// 4. Code changed
		// 5. Storage changed
		if (!startAccount) {
			modifiedAddresses.add(/** @type {import('@tevm/utils').Hex} */ (address))
		} else if (
			startAccount.balance !== endAccount.balance ||
			startAccount.nonce !== endAccount.nonce ||
			startAccount.codeHash !== endAccount.codeHash ||
			JSON.stringify(startAccount.storage) !== JSON.stringify(endAccount.storage)
		) {
			modifiedAddresses.add(/** @type {import('@tevm/utils').Hex} */ (address))
		}
	}

	// Check for deleted accounts
	for (const address of Object.keys(startState)) {
		if (!endState[address]) {
			modifiedAddresses.add(/** @type {import('@tevm/utils').Hex} */ (address))
		}
	}

	const result = Array.from(modifiedAddresses)
	logger.debug(
		{ modifiedAccountsCount: result.length },
		'debugGetModifiedAccountsByNumberHandler: found modified accounts',
	)

	return result
}

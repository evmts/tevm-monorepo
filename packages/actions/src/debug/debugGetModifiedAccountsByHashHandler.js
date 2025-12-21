import { bytesToHex } from '@tevm/utils'

/**
 * Returns addresses of accounts modified between two block hashes
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugHandler.js').DebugGetModifiedAccountsByHashHandler}
 * @example
 * ```typescript
 * import { createTevmNode } from 'tevm/node'
 * import { debugGetModifiedAccountsByHashHandler } from 'tevm/actions'
 *
 * const client = createTevmNode()
 *
 * const getModifiedAccounts = debugGetModifiedAccountsByHashHandler(client)
 *
 * const result = await getModifiedAccounts({
 *   startBlockHash: '0xabc...',
 *   endBlockHash: '0xdef...'
 * })
 * console.log(result) // Array of modified account addresses
 * ```
 */
export const debugGetModifiedAccountsByHashHandler = (client) => async (params) => {
	const { logger, getVm } = client
	logger.debug(params, 'debugGetModifiedAccountsByHashHandler: executing get modified accounts with params')

	const vm = await getVm()
	const { startBlockHash, endBlockHash } = params

	// Normalize block hashes to Uint8Array
	const normalizeBlockHash = (/** @type {import('@tevm/utils').Hex | Uint8Array} */ bh) => {
		if (typeof bh === 'string') {
			return Uint8Array.from(Buffer.from(bh.slice(2), 'hex'))
		}
		return bh
	}

	const startBH = normalizeBlockHash(startBlockHash)
	const endBH = endBlockHash !== undefined ? normalizeBlockHash(endBlockHash) : undefined

	logger.debug(
		{
			startBlockHash: bytesToHex(startBH),
			endBlockHash: endBH ? bytesToHex(endBH) : undefined,
		},
		'debugGetModifiedAccountsByHashHandler: normalized block hashes',
	)

	// Get start block
	const startBlock = await vm.blockchain.getBlock(startBH)

	// If no end block hash provided, use the next block
	let endBlock
	if (endBH) {
		endBlock = await vm.blockchain.getBlock(endBH)
	} else {
		// Get next block by number
		const nextBlockNumber = startBlock.header.number + 1n
		endBlock = await vm.blockchain.getBlockByTag(nextBlockNumber)
	}

	logger.debug(
		{
			startBlockNumber: startBlock.header.number,
			startBlockHash: bytesToHex(startBlock.hash()),
			endBlockNumber: endBlock.header.number,
			endBlockHash: bytesToHex(endBlock.hash()),
		},
		'debugGetModifiedAccountsByHashHandler: got blocks',
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
		const startAccount = /** @type {any} */ (startState)[address]
		const endAccount = /** @type {any} */ (endState)[address]

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
		if (!(/** @type {any} */ (endState)[address])) {
			modifiedAddresses.add(/** @type {import('@tevm/utils').Hex} */ (address))
		}
	}

	const result = Array.from(modifiedAddresses)
	logger.debug(
		{ modifiedAccountsCount: result.length },
		'debugGetModifiedAccountsByHashHandler: found modified accounts',
	)

	return result
}

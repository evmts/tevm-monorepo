import { bytesToHex, hexToBigInt, numberToHex } from '@tevm/utils'

/**
 * Returns the complete state at a specific block
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugHandler.js').DebugDumpBlockHandler}
 * @example
 * ```typescript
 * import { createTevmNode } from 'tevm/node'
 * import { debugDumpBlockHandler } from 'tevm/actions'
 *
 * const client = createTevmNode()
 *
 * const dumpBlock = debugDumpBlockHandler(client)
 *
 * const result = await dumpBlock({ blockTag: 'latest' })
 * console.log(result.root) // State root hash
 * console.log(result.accounts) // All accounts in the state
 * ```
 */
export const debugDumpBlockHandler = (client) => async (params) => {
	const { logger, getVm } = client
	logger.debug(params, 'debugDumpBlockHandler: executing dump block with params')

	const vm = await getVm()
	const { blockTag } = params

	// Normalize blockTag to bigint or tag string
	/** @type {import('@tevm/utils').BlockTag | bigint} */
	let normalizedBlockTag
	if (typeof blockTag === 'string') {
		if (
			blockTag === 'latest' ||
			blockTag === 'pending' ||
			blockTag === 'earliest' ||
			blockTag === 'safe' ||
			blockTag === 'finalized'
		) {
			normalizedBlockTag = blockTag
		} else {
			// It's a hex string
			normalizedBlockTag = hexToBigInt(/** @type {import('@tevm/utils').Hex} */ (blockTag))
		}
	} else if (blockTag instanceof Uint8Array) {
		normalizedBlockTag = hexToBigInt(bytesToHex(blockTag))
	} else if (typeof blockTag === 'bigint' || typeof blockTag === 'number') {
		normalizedBlockTag = typeof blockTag === 'number' ? BigInt(blockTag) : blockTag
	} else {
		normalizedBlockTag = 'latest'
	}

	logger.debug({ normalizedBlockTag }, 'debugDumpBlockHandler: normalized block tag')

	// Get the block
	const block = await vm.blockchain.getBlockByTag(normalizedBlockTag)
	logger.debug(
		{ blockNumber: block.header.number, blockHash: bytesToHex(block.hash()) },
		'debugDumpBlockHandler: got block',
	)

	// Get the state at this block
	let state
	if ('dumpCanonicalGenesis' in vm.stateManager) {
		if (normalizedBlockTag === 'latest' || normalizedBlockTag === 'pending') {
			state = await vm.stateManager.dumpCanonicalGenesis()
		} else {
			const stateRootHex = bytesToHex(block.header.stateRoot)
			if (await vm.stateManager.hasStateRoot(block.header.stateRoot)) {
				state = vm.stateManager._baseState.stateRoots.get(stateRootHex) ?? {}
			} else {
				logger.warn({ stateRootHex }, 'debugDumpBlockHandler: state root does not exist')
				state = {}
			}
		}
	} else {
		throw new Error('Unsupported state manager. Must use a TEVM state manager from @tevm/state package.')
	}

	logger.debug({ accountCount: Object.keys(state).length }, 'debugDumpBlockHandler: dumped state')

	// Convert state to debug format
	/** @type {Record<import('@tevm/utils').Hex, import('./DebugResult.js').DebugDumpBlockAccountState>} */
	const accounts = {}

	for (const [address, account] of Object.entries(state)) {
		const accountState = /** @type {import('./DebugResult.js').DebugDumpBlockAccountState} */ ({
			balance: numberToHex(account.balance),
			nonce: numberToHex(account.nonce),
			codeHash: account.codeHash,
			root: account.storageRoot,
		})

		if (account.deployedBytecode) {
			accountState.code = account.deployedBytecode
		}

		if (account.storage && Object.keys(account.storage).length > 0) {
			accountState.storage = /** @type {Record<import('@tevm/utils').Hex, import('@tevm/utils').Hex>} */ (
				Object.fromEntries(
					Object.entries(account.storage).map(([key, value]) => [
						/** @type {import('@tevm/utils').Hex} */ (key.startsWith('0x') ? key : `0x${key}`),
						/** @type {import('@tevm/utils').Hex} */ (value),
					]),
				)
			)
		}

		accounts[/** @type {import('@tevm/utils').Hex} */ (address)] = accountState
	}

	return {
		root: bytesToHex(block.header.stateRoot),
		accounts,
	}
}

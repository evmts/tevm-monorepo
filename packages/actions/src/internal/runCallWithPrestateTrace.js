import { createAddress } from '@tevm/address'
import { DefensiveNullCheckError } from '@tevm/errors'
import { bytesToHex, toHex } from '@tevm/utils'

/**
 * @internal
 * Executes a call with prestate tracer, which captures account state before and after execution
 * @template {boolean} TDiffMode
 * @param {import('@tevm/vm').Vm} vm
 * @param {import('@tevm/node').TevmNode['logger']} logger
 * @param {import('@tevm/evm').EvmRunCallOpts} params
 * @param {TDiffMode} diffMode If true, only returns state that changed between pre and post execution
 * @returns {Promise<import('@tevm/evm').EvmResult & {trace: TDiffMode extends true ? import('../debug/DebugResult.js').PrestateTracerDiffResult : import('../debug/DebugResult.js').PrestateTracerResult}>}
 * @throws {never}
 */
export const runCallWithPrestateTrace = async (vm, logger, params, diffMode = /** @type {TDiffMode} */ (false)) => {
	// Prepare VM for tracing
	await vm.evm.journal.cleanup()
	// Start tracking which accounts and storage slots are accessed during execution
	vm.evm.journal.startReportingAccessList()
	vm.evm.journal.startReportingPreimages()
	// Checkpoint to capture state pre-execution
	await vm.evm.journal.checkpoint()

	/** @type {any} */
	let trace

	// Run the call
	logger.debug(params, 'runCallWithPrestateTrace: executing call')
	const runCallResult = await vm.evm.runCall(params)

	// Get the access list to determine which accounts and storage slots were accessed
	if (!vm.evm.journal.accessList) {
		throw new DefensiveNullCheckError('Expected journal access list to be defined')
	}

	// Transform access list to usable format
	/** @type {Map<import('@tevm/utils').Hex, Set<import('@tevm/utils').Hex>>} */
	const accessListMap = new Map()
	for (const [addressString, slots] of vm.evm.journal.accessList) {
		accessListMap.set(
			`0x${addressString}`,
			new Set(slots.values().map((s) => /** @type {import('@tevm/utils').Hex} */ (`0x${s}`))),
		)
	}

	const preimages = Array.from(vm.evm.journal.preimages?.values() || []).map((v) => bytesToHex(v))

	// Capture post-state (from VM after execution)
	/** @type {import('../debug/DebugResult.js').PrestateTracerResult} */
	const postState = {}
	// if (diffMode) {
	for (const addressString of preimages) {
		try {
			const ethAddress = createAddress(addressString)
			const slots = accessListMap.get(`0x${addressString}`) ?? new Set()
			const accountState = await captureAccountState(vm, logger, ethAddress, slots)

			if (accountState) postState[`0x${addressString}`] = accountState
		} catch (err) {
			logger.error(err, `Error capturing post-state for ${addressString}`)
		}
	}
	// }

	// Revert to pre-execution state
	vm.evm.journal.revert()

	// Capture pre-state (from cloned VM before execution)
	/** @type {import('../debug/DebugResult.js').PrestateTracerResult} */
	const preState = {}
	for (const addressString of preimages) {
		try {
			const ethAddress = createAddress(addressString)
			const slots = accessListMap.get(`0x${addressString}`) || new Set()
			const accountState = await captureAccountState(vm, logger, ethAddress, slots)

			if (accountState) preState[`0x${addressString}`] = accountState
		} catch (err) {
			logger.error(err, `Error capturing pre-state for ${addressString}`)
		}
	}

	// Format result based on diffMode
	if (diffMode) {
		// For diffMode, only include state that changed in post state
		/** @type {import('../debug/DebugResult.js').PrestateTracerResult} */
		const postDiff = {}

		for (const address of Object.keys(postState)) {
			const addressHex = /** @type {import('@tevm/utils').Hex} */ (address)
			const pre = preState[addressHex]
			const post = postState[addressHex]

			if (!post) continue

			// Compare and capture differences
			/** @type {Partial<{
			 *   balance: import('@tevm/utils').Hex,
			 *   nonce: string,
			 *   code: import('@tevm/utils').Hex,
			 *   storage: Record<import('@tevm/utils').Hex, import('@tevm/utils').Hex>
			 * }>} */
			const postDiffAccount = {}
			let hasDiff = false

			// Check balance difference
			if (pre && post.balance && pre.balance !== post.balance) {
				postDiffAccount.balance = post.balance
				hasDiff = true
			}

			// Check nonce difference
			if (pre && post.nonce && pre.nonce !== post.nonce) {
				postDiffAccount.nonce = post.nonce
				hasDiff = true
			}

			// Check code difference (rare, only for contract creation or self-destruct)
			if (pre && post.code && pre.code !== post.code) {
				postDiffAccount.code = post.code
				hasDiff = true
			}

			// Check storage differences
			/** @type {Record<import('@tevm/utils').Hex, import('@tevm/utils').Hex>} */
			const storagePostDiff = {}
			let hasStorageDiff = false

			// Get all unique slot keys from both pre and post
			const allSlots = new Set([...Object.keys(pre?.storage || {}), ...Object.keys(post.storage || {})])

			for (const slot of allSlots) {
				const slotHex = /** @type {import('@tevm/utils').Hex} */ (slot)
				const preValue = pre?.storage?.[slotHex] || '0x0'
				const postValue = post.storage?.[slotHex] || '0x0'

				if (preValue !== postValue) {
					storagePostDiff[slotHex] = postValue
					hasStorageDiff = true
				}
			}

			if (hasStorageDiff) {
				postDiffAccount.storage = storagePostDiff
				hasDiff = true
			}

			// Only add to diff if there were changes
			if (hasDiff) postDiff[addressHex] = postDiffAccount
		}

		// Return differentials
		trace = {
			pre: preState,
			post: postDiff,
		}
	} else {
		// Without diffMode, return full state
		trace = preState
	}

	return {
		...runCallResult,
		trace,
	}
}

/**
 * @internal
 * Captures the state of an account, including its storage based on accessed slots
 * @param {import('@tevm/vm').Vm} vm
 * @param {import('@tevm/node').TevmNode['logger']} logger
 * @param {import('@tevm/utils').EthjsAddress} address
 * @param {Set<import('@tevm/utils').Hex>} slots Set of storage slot keys that were accessed
 * @returns {Promise<import('../debug/DebugResult.js').AccountState | null>}
 */
const captureAccountState = async (vm, logger, address, slots = new Set()) => {
	try {
		// Get account details
		const account = await vm.stateManager.getAccount(address)
		if (!account) return null

		// Get code
		const code = await vm.stateManager.getContractCode(address)

		// Get storage for all accessed slots
		/** @type {Record<import('@tevm/utils').Hex, import('@tevm/utils').Hex>} */
		const storage = {}
		for (const slotHex of slots) {
			try {
				// Convert hex slot to Uint8Array for getContractStorage
				const slotKey = Buffer.from(slotHex.slice(2), 'hex')
				const value = await vm.stateManager.getContractStorage(address, slotKey)
				storage[slotHex] = bytesToHex(value)
			} catch (err) {
				logger.error(err, `Error getting storage at slot ${slotHex} for account ${address.toString()}`)
			}
		}

		return {
			balance: toHex(account.balance),
			nonce: account.nonce.toString(),
			code: code && code.length > 0 ? bytesToHex(code) : '0x',
			storage,
		}
	} catch (err) {
		logger.error(err, `Error capturing state for account ${address.toString()}`)
		return null
	}
}

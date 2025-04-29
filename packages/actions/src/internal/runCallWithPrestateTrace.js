import { createAddress } from '@tevm/address'
import { DefensiveNullCheckError } from '@tevm/errors'
import { bytesToHex, hexToBytes } from '@tevm/utils'
import { evmInputToImpersonatedTx } from './evmInputToImpersonatedTx.js'

/**
 * @internal
 * Executes a call with prestate tracer, which captures account state before and after execution
 * @template {boolean} TDiffMode
 * @param {import('@tevm/node').TevmNode} client
 * @param {import('@tevm/evm').EvmRunCallOpts} evmInput
 * @param {TDiffMode} diffMode If true, only returns state that changed between pre and post execution
 * @returns {Promise<import('@tevm/evm').EvmResult & {trace: TDiffMode extends true ? import('../debug/DebugResult.js').PrestateTraceDiffResult : import('../debug/DebugResult.js').PrestateTraceResult}>}
 * @throws {never}
 */
export const runCallWithPrestateTrace = async (client, evmInput, diffMode = /** @type {TDiffMode} */ (false)) => {
	const { logger, getVm } = client
	const vm = await getVm()
	// Ensure we start with a clear warmed accounts Map
	await vm.evm.journal.cleanup()

	// Convert EVM input to a transaction
	const tx = await evmInputToImpersonatedTx(client)(evmInput)
	// Run the transaction
	logger.debug(evmInput, 'runCallWithPrestateTrace: executing call using runTx')
	const runTxResult = await vm.runTx({
		tx,
		skipHardForkValidation: true,
		skipBlockGasLimitValidation: true,
		reportAccessList: true,
		reportPreimages: true,
		preserveJournal: true,
	})

	// Get the access list and preimages to determine which accounts and storage slots were accessed
	const { accessList: _accessList, preimages: _preimages } = runTxResult
	if (!_accessList) throw new DefensiveNullCheckError('Expected access list to be defined')
	const preimages = Array.from(_preimages?.values() ?? []).map((v) => bytesToHex(v))

	// Transform access list to usable format
	/** @type {Map<import('@tevm/utils').Hex, Set<import('@tevm/utils').Hex>>} */
	const accessList = new Map()
	for (const { address, storageKeys } of _accessList) {
		accessList.set(`0x${address}`, new Set(storageKeys.map((s) => /** @type {import('@tevm/utils').Hex} */ (`0x${s}`))))
	}

	// Capture post-state (from VM after execution)
	/** @type {import('../debug/DebugResult.js').PrestateTraceResult} */
	const postState = {}
	if (diffMode) {
		for (const address of preimages) {
			try {
				const ethAddress = createAddress(address)
				const slots = accessList.get(address) ?? new Set()
				const accountState = await captureAccountState(vm, logger, ethAddress, slots)

				if (accountState) postState[address] = accountState
			} catch (err) {
				logger.error(err, `Error capturing post-state for ${address}`)
			}
		}
	}

	// Revert to pre-execution state
	vm.evm.journal.revert()

	// Capture pre-state (from cloned VM before execution)
	/** @type {import('../debug/DebugResult.js').PrestateTraceResult} */
	const preState = {}
	for (const address of preimages) {
		try {
			const ethAddress = createAddress(address)
			const slots = accessList.get(address) ?? new Set()
			const accountState = await captureAccountState(vm, logger, ethAddress, slots)

			if (accountState) preState[address] = accountState
		} catch (err) {
			logger.error(err, `Error capturing pre-state for ${address}`)
		}
	}

	return {
		...runTxResult,
		// Include both pre and post state only in diffMode
		trace: /** @type {any} */ (diffMode ? formatDiffResult(preState, postState) : preState),
	}
}

/**
 * @internal
 * Captures the state of an account, including its storage based on accessed slots
 * @param {import('@tevm/vm').Vm} vm
 * @param {import('@tevm/node').TevmNode['logger']} logger
 * @param {import('@tevm/utils').EthjsAddress} address
 * @param {Set<import('@tevm/utils').Hex>} slots Set of storage slot keys that were accessed
 * @returns {Promise<import('../debug/DebugResult.js').AccountState | undefined>}
 */
const captureAccountState = async (vm, logger, address, slots = new Set()) => {
	try {
		// Get account details
		const account = await vm.stateManager.getAccount(address)
		if (!account) return undefined

		// Get code
		const code = await vm.stateManager.getContractCode(address)

		// Get storage for all accessed slots
		/** @type {Record<import('@tevm/utils').Hex, import('@tevm/utils').Hex>} */
		const storage = {}
		for (const slotHex of slots) {
			try {
				// Convert hex slot to Uint8Array for getContractStorage
				const slotKey = hexToBytes(slotHex)
				const value = await vm.stateManager.getContractStorage(address, slotKey)
				storage[slotHex] = bytesToHex(value)
			} catch (err) {
				logger.error(err, `Error getting storage at slot ${slotHex} for account ${address.toString()}`)
			}
		}

		/**
		 * @param {keyof typeof account} property
		 * @returns {any}
		 */
		const safeAccess = (property) => {
			try {
				return typeof account[property] === 'function' ? account[property]() : account[property]
			} catch (err) {
				logger.error(err, `Error getting ${property} for account ${address.toString()}`)
				return undefined
			}
		}

		return {
			storage,
			// We would want to throw if any of these is not loaded
			balance: account.balance,
			nonce: account.nonce,
			code: code && code.length > 0 ? bytesToHex(code) : '0x',
			// For these we can default (not loaded) to undefined
			codeHash: safeAccess('codeHash') ? bytesToHex(safeAccess('codeHash')) : undefined,
			codeSize: safeAccess('codeSize'),
			storageRoot: safeAccess('storageRoot') ? bytesToHex(safeAccess('storageRoot')) : undefined,
			isContract: safeAccess('isContract'),
			isEmpty: safeAccess('isEmpty'),
			version: safeAccess('version'),
		}
	} catch (err) {
		logger.error(err, `Error capturing state for account ${address.toString()}`)
		return undefined
	}
}

/**
 * @internal
 * Formats the prestate trace result for diffMode
 * @param {import('../debug/DebugResult.js').PrestateTraceResult} preState
 * @param {import('../debug/DebugResult.js').PrestateTraceResult} postState
 * @returns {import('../debug/DebugResult.js').PrestateTraceDiffResult}
 */
const formatDiffResult = (preState, postState) => {
	/** @type {import('../debug/DebugResult.js').PrestateTraceDiffResult["post"]} */
	const postDiff = {}

	for (const address of Object.keys(postState)) {
		const addressHex = /** @type {import('@tevm/utils').Hex} */ (address)
		const pre = preState[addressHex]
		const post = postState[addressHex]
		if (!post) continue

		// Get all unique slot keys from both pre and post
		const allSlots = new Set([...Object.keys(pre?.storage ?? {}), ...Object.keys(post.storage ?? {})])
		// Build storage diff
		/** @type {Record<import('@tevm/utils').Hex, import('@tevm/utils').Hex>} */
		let storageDiff = {}
		for (const slot of allSlots) {
			const slotHex = /** @type {import('@tevm/utils').Hex} */ (slot)
			const preValue = pre?.storage?.[slotHex] ?? '0x0'
			const postValue = post.storage?.[slotHex] ?? '0x0'

			storageDiff = {
				...storageDiff,
				...(preValue !== postValue ? { [slotHex]: postValue } : {}),
			}
		}

		// Compare and capture differences
		const postDiffAccount = {
			...(pre && post.balance && pre.balance !== post.balance ? { balance: post.balance } : {}),
			...(pre && post.nonce && pre.nonce !== post.nonce ? { nonce: post.nonce } : {}),
			...(pre && post.code && pre.code !== post.code ? { code: post.code } : {}),
			...(Object.keys(storageDiff).length > 0 ? { storage: storageDiff } : {}),
		}

		// Only add to diff if there were any changes
		if (Object.keys(postDiffAccount).length > 0) postDiff[addressHex] = postDiffAccount
	}

	// Return differentials
	return {
		pre: preState,
		post: postDiff,
	}
}

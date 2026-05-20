import { createTxFromRLP } from '@evmts/zevm/tx'
import { Block } from '@tevm/block'
import { InvalidParamsError } from '@tevm/errors'
import { bytesToHex, hexToBytes } from '@tevm/utils'

/**
 * @typedef {import('@tevm/utils').Hex} Hex
 * @typedef {{ payloadJobs: Map<string, any>, latestValidHash: string | null }} EngineState
 */

const STATUS = {
	VALID: 'VALID',
	INVALID: 'INVALID',
	SYNCING: 'SYNCING',
	ACCEPTED: 'ACCEPTED',
	INVALID_BLOCK_HASH: 'INVALID_BLOCK_HASH',
}

const ZERO_HASH = `0x${'00'.repeat(32)}`
const MAX_BODIES = 1024
const REQUIRED_EXECUTION_PAYLOAD_FIELDS = [
	'parentHash',
	'feeRecipient',
	'stateRoot',
	'receiptsRoot',
	'logsBloom',
	'prevRandao',
	'blockNumber',
	'gasLimit',
	'gasUsed',
	'timestamp',
	'extraData',
	'baseFeePerGas',
	'blockHash',
	'transactions',
]

/**
 * @param {any} client
 * @returns {EngineState}
 */
const ensureState = (client) => {
	if (!client.__engineState) client.__engineState = { payloadJobs: new Map(), latestValidHash: null }
	return client.__engineState
}

/**
 * @param {any} request
 * @param {any} result
 */
const ok = (request, result) => ({ id: request.id, jsonrpc: '2.0', method: request.method, result })
/**
 * @param {any} request
 * @param {string} message
 */
const badParams = (request, message) => ({
	id: request.id,
	jsonrpc: '2.0',
	method: request.method,
	error: { code: new InvalidParamsError(message).code, message },
})

/**
 * @param {unknown} value
 * @returns {value is Hex}
 */
const isHexHash = (value) => typeof value === 'string' && /^0x[0-9a-fA-F]{64}$/.test(value)
/**
 * @param {Hex} value
 */
const normalizeHash = (value) => value.toLowerCase()
/**
 * @param {string} status
 * @param {Hex | null} [latestValidHash]
 * @param {string | null} [validationError]
 */
const payloadStatus = (status, latestValidHash = null, validationError = null) => ({
	status,
	latestValidHash,
	validationError,
})

/**
 * @param {any} payload
 * @returns {string | null}
 */
const validatePayloadShape = (payload) => {
	if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return 'Invalid execution payload'
	for (const field of REQUIRED_EXECUTION_PAYLOAD_FIELDS) {
		if (!(field in payload)) return `Invalid execution payload: missing ${field}`
	}
	if (!isHexHash(payload.parentHash)) return 'Invalid execution payload: parentHash must be a 32-byte hex string'
	if (!isHexHash(payload.blockHash)) return 'Invalid execution payload: blockHash must be a 32-byte hex string'
	if (!Array.isArray(payload.transactions)) return 'Invalid execution payload: transactions must be an array'
	return null
}

/**
 * @param {any} vm
 * @param {unknown} hash
 */
const getBlockByHash = async (vm, hash) => {
	if (!isHexHash(hash) || normalizeHash(hash) === ZERO_HASH) return null
	try {
		return await vm.blockchain.getBlock(hexToBytes(hash))
	} catch {
		return null
	}
}

/**
 * @param {string} method
 * @param {any} executionPayload
 */
const buildPayloadResponse = (method, executionPayload) => {
	if (method === 'engine_getPayloadV1') return executionPayload
	return {
		executionPayload,
		blockValue: '0x0',
		blobsBundle: null,
		shouldOverrideBuilder: false,
	}
}

/**
 * @param {any} client
 * @param {{ forkchoiceState: { headBlockHash: Hex }, payloadAttributes: any }} job
 */
const buildBlockForPayloadJob = async (client, job) => {
	const vm = await client.getVm()
	const parentBlock = await vm.blockchain.getBlock(hexToBytes(job.forkchoiceState.headBlockHash))
	const parentHeader = parentBlock.header
	const { payloadAttributes } = job
	const timestamp = payloadAttributes.timestamp ? BigInt(payloadAttributes.timestamp) : parentHeader.timestamp + 1n
	const blockBuilder = await vm.buildBlock({
		parentBlock,
		headerData: {
			number: parentHeader.number + 1n,
			timestamp,
			gasLimit: parentHeader.gasLimit,
			extraData: payloadAttributes.extraData ? hexToBytes(payloadAttributes.extraData) : undefined,
			coinbase: payloadAttributes.suggestedFeeRecipient
				? hexToBytes(payloadAttributes.suggestedFeeRecipient)
				: undefined,
			mixHash: payloadAttributes.prevRandao ? hexToBytes(payloadAttributes.prevRandao) : undefined,
			parentBeaconBlockRoot: payloadAttributes.parentBeaconBlockRoot
				? hexToBytes(payloadAttributes.parentBeaconBlockRoot)
				: undefined,
		},
		blockOpts: {
			freeze: false,
			putBlockIntoBlockchain: false,
			skipConsensusFormatValidation: true,
			setHardfork: false,
		},
	})
	for (const rawTx of payloadAttributes.transactions ?? []) {
		if (typeof rawTx !== 'string' || !rawTx.startsWith('0x')) {
			throw new InvalidParamsError('Invalid transaction encoding')
		}
		const tx = createTxFromRLP(hexToBytes(/** @type {Hex} */ (rawTx)), { common: vm.common })
		await blockBuilder.addTransaction(tx)
	}
	return blockBuilder.build()
}

export const engineExchangeCapabilitiesProcedure =
	() =>
	/**
	 * @param {any} request
	 */
	async (request) => {
		const [capabilities] = request.params ?? []
		return ok(request, Array.isArray(capabilities) ? capabilities : [])
	}

export const engineExchangeTransitionConfigurationV1Procedure =
	() =>
	/**
	 * @param {any} request
	 */
	async (request) =>
		ok(request, request.params?.[0] ?? null)

export const engineGetClientVersionV1Procedure =
	() =>
	/**
	 * @param {any} request
	 */
	async (request) =>
		ok(request, [{ code: 'tevm', name: 'tevm', version: '0.0.0', commit: 'local' }])

/**
 * @param {any} client
 */
export const engineForkchoiceUpdatedProcedure =
	(client) =>
	/**
	 * @param {any} request
	 */
	async (request) => {
		await client.emitExExEvent({
			type: 'enginePayload',
			phase: 'received',
			method: request.method,
			payload: request.params,
		})
		const state = ensureState(client)
		const [forkchoiceState, payloadAttributes] = request.params ?? []
		if (!forkchoiceState || typeof forkchoiceState !== 'object') return badParams(request, 'Invalid forkchoice state')
		if (!isHexHash(forkchoiceState.headBlockHash)) return badParams(request, 'Invalid forkchoice headBlockHash')

		const vm = await client.getVm()
		const head = await getBlockByHash(vm, forkchoiceState.headBlockHash)
		if (!head) {
			const res = { payloadStatus: payloadStatus(STATUS.SYNCING), payloadId: null }
			await client.emitExExEvent({
				type: 'enginePayload',
				phase: 'validated',
				method: request.method,
				payload: request.params,
				result: res,
			})
			return ok(request, res)
		}

		let payloadId = null
		if (payloadAttributes !== null && payloadAttributes !== undefined) {
			if (typeof payloadAttributes !== 'object' || Array.isArray(payloadAttributes)) {
				return badParams(request, 'Invalid payload attributes')
			}
			payloadId = `0x${(BigInt(Date.now()) & ((1n << 64n) - 1n)).toString(16).padStart(16, '0')}`
			state.payloadJobs.set(payloadId, { forkchoiceState, payloadAttributes, createdAt: Date.now() })
		}
		state.latestValidHash = forkchoiceState.headBlockHash
		const res = { payloadStatus: payloadStatus(STATUS.VALID, forkchoiceState.headBlockHash), payloadId }
		await client.emitExExEvent({
			type: 'enginePayload',
			phase: 'validated',
			method: request.method,
			payload: request.params,
			result: res,
		})
		return ok(request, res)
	}

/**
 * @param {any} client
 */
export const engineNewPayloadProcedure =
	(client) =>
	/**
	 * @param {any} request
	 */
	async (request) => {
		const [payload] = request.params ?? []
		const shapeError = validatePayloadShape(payload)
		if (shapeError) return badParams(request, shapeError)

		await client.emitExExEvent({ type: 'enginePayload', phase: 'received', method: request.method, payload })
		const vm = await client.getVm()
		const parentBlock = await getBlockByHash(vm, payload.parentHash)
		if (!parentBlock) {
			const res = payloadStatus(STATUS.SYNCING)
			await client.emitExExEvent({
				type: 'enginePayload',
				phase: 'validated',
				method: request.method,
				payload,
				result: res,
			})
			return ok(request, res)
		}

		let block
		try {
			block = await Block.fromExecutionPayload(payload, { common: vm.common, setHardfork: false })
		} catch (e) {
			const res = payloadStatus(
				STATUS.INVALID,
				bytesToHex(parentBlock.hash()),
				/** @type any */ (e)?.message ?? String(e),
			)
			await client.emitExExEvent({
				type: 'enginePayload',
				phase: 'validated',
				method: request.method,
				payload,
				result: res,
			})
			return ok(request, res)
		}

		if (block.header.number !== parentBlock.header.number + 1n) {
			const res = payloadStatus(
				STATUS.INVALID,
				bytesToHex(parentBlock.hash()),
				`Invalid block number, expected ${parentBlock.header.number + 1n}, received ${block.header.number}`,
			)
			await client.emitExExEvent({
				type: 'enginePayload',
				phase: 'validated',
				method: request.method,
				payload,
				result: res,
			})
			return ok(request, res)
		}

		const existing = await getBlockByHash(vm, payload.blockHash)
		if (existing) {
			const res = payloadStatus(STATUS.VALID, payload.blockHash)
			await client.emitExExEvent({
				type: 'enginePayload',
				phase: 'validated',
				method: request.method,
				payload,
				result: res,
			})
			return ok(request, res)
		}

		try {
			const validationVm = await vm.deepCopy()
			await validationVm.runBlock({
				block,
				root: parentBlock.header.stateRoot,
				generate: false,
				skipBlockValidation: true,
			})
			const result = await vm.runBlock({
				block,
				root: parentBlock.header.stateRoot,
				generate: false,
				skipBlockValidation: true,
			})
			const receiptsManager = await client.getReceiptsManager()
			await Promise.all([receiptsManager.saveReceipts(block, result.receipts), vm.blockchain.putBlock(block)])
			const txPool = await client.getTxPool()
			txPool.removeNewBlockTxs([block])
			const state = ensureState(client)
			state.latestValidHash = payload.blockHash
			const res = payloadStatus(STATUS.VALID, payload.blockHash)
			await client.emitExExEvent({
				type: 'enginePayload',
				phase: 'validated',
				method: request.method,
				payload,
				result: res,
			})
			return ok(request, res)
		} catch (e) {
			const res = payloadStatus(
				STATUS.INVALID,
				bytesToHex(parentBlock.hash()),
				/** @type any */ (e)?.message ?? String(e),
			)
			await client.emitExExEvent({
				type: 'enginePayload',
				phase: 'validated',
				method: request.method,
				payload,
				result: res,
			})
			return ok(request, res)
		}
	}

/**
 * @param {any} client
 */
export const engineGetPayloadProcedure =
	(client) =>
	/**
	 * @param {any} request
	 */
	async (request) => {
		const [payloadId] = request.params ?? []
		const state = ensureState(client)
		if (!payloadId || !state.payloadJobs.has(payloadId)) return badParams(request, 'Unknown payload id')
		const job = state.payloadJobs.get(payloadId)
		if (!job.block) job.block = await buildBlockForPayloadJob(client, job)
		return ok(request, buildPayloadResponse(request.method, job.block.toExecutionPayload()))
	}

export const engineGetPayloadBodiesByHashProcedure =
	() =>
	/**
	 * @param {any} request
	 */
	async (request) => {
		const [hashes] = request.params ?? []
		if (!Array.isArray(hashes)) return badParams(request, 'Invalid hashes')
		if (hashes.length > MAX_BODIES) return badParams(request, 'Request exceeds body lookup limit')
		return ok(
			request,
			hashes.map(() => null),
		)
	}

export const engineGetPayloadBodiesByRangeProcedure =
	() =>
	/**
	 * @param {any} request
	 */
	async (request) => {
		const [start, count] = request.params ?? []
		const c = Number(BigInt(count ?? 0))
		if (c < 0 || c > MAX_BODIES || !start) return badParams(request, 'Invalid range')
		return ok(
			request,
			Array.from({ length: c }, () => null),
		)
	}

export const engineGetBlobsProcedure =
	() =>
	/**
	 * @param {any} request
	 */
	async (request) => {
		const [hashes] = request.params ?? []
		if (!Array.isArray(hashes)) return badParams(request, 'Invalid blob hashes')
		if (hashes.length > MAX_BODIES) return badParams(request, 'Request exceeds blob lookup limit')
		return ok(
			request,
			hashes.map(() => null),
		)
	}

/**
 * @param {any} client
 */
export const testingBuildBlockV1Procedure =
	(client) =>
	/**
	 * @param {any} request
	 */
	async (request) => {
		const [parentHash, payloadAttributes, transactions, extraData] = request.params ?? []
		if (!isHexHash(parentHash)) return badParams(request, 'Invalid parent hash')
		if (!payloadAttributes || typeof payloadAttributes !== 'object')
			return badParams(request, 'Invalid payload attributes')
		if (transactions !== null && !Array.isArray(transactions)) return badParams(request, 'Invalid transactions')
		if (extraData !== undefined && typeof extraData !== 'string') return badParams(request, 'Invalid extra data')
		try {
			const block = await buildBlockForPayloadJob(client, {
				forkchoiceState: { headBlockHash: parentHash },
				payloadAttributes: { ...payloadAttributes, extraData, transactions: transactions ?? [] },
			})
			const executionPayload = block.toExecutionPayload()
			if (extraData !== undefined && executionPayload.extraData !== extraData) {
				return badParams(request, 'Failed to build block with requested extra data')
			}
			return ok(request, {
				executionPayload,
				blockValue: '0x0',
				blobsBundle: null,
				shouldOverrideBuilder: false,
			})
		} catch (e) {
			return badParams(
				request,
				/not found|unknown|missing/i.test(String(e))
					? 'Unknown parent block'
					: `Failed to build block: ${/** @type any */ (e).message ?? String(e)}`,
			)
		}
	}

/**
 * @param {any} client
 */
export const clearEngineState = (client) => {
	if (client.__engineState) client.__engineState.payloadJobs.clear()
}

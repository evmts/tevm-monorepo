import { InvalidParamsError } from '@tevm/errors'
import { createTxFromRLP } from '@evmts/zevm/tx'
import { bytesToHex, hexToBytes } from '@tevm/utils'

const STATUS = {
  VALID: 'VALID',
  INVALID: 'INVALID',
  SYNCING: 'SYNCING',
  ACCEPTED: 'ACCEPTED',
  INVALID_BLOCK_HASH: 'INVALID_BLOCK_HASH',
}

const ensureState = (client) => {
  if (!client.__engineState) client.__engineState = { payloadJobs: new Map(), latestValidHash: null }
  return client.__engineState
}

const ok = (request, result) => ({ id: request.id, jsonrpc: '2.0', method: request.method, result })
const badParams = (request, message) => ({ id: request.id, jsonrpc: '2.0', method: request.method, error: { code: new InvalidParamsError(message).code, message } })

export const engineExchangeCapabilitiesProcedure = () => async (request) => {
  const [capabilities] = request.params ?? []
  return ok(request, Array.isArray(capabilities) ? capabilities : [])
}

export const engineExchangeTransitionConfigurationV1Procedure = () => async (request) => ok(request, request.params?.[0] ?? null)

export const engineGetClientVersionV1Procedure = () => async (request) => ok(request, [{ code: 'tevm', name: 'tevm', version: '0.0.0', commit: 'local' }])

export const engineForkchoiceUpdatedProcedure = (client) => async (request) => {
  await client.emitExExEvent({ type: 'enginePayload', phase: 'received', method: request.method, payload: request.params })
  const state = ensureState(client)
  const [forkchoiceState, payloadAttributes] = request.params ?? []
  if (!forkchoiceState || typeof forkchoiceState !== 'object') return badParams(request, 'Invalid forkchoice state')
  let payloadId = null
  if (payloadAttributes && typeof payloadAttributes === 'object') {
    payloadId = `0x${(BigInt(Date.now()) & ((1n << 64n) - 1n)).toString(16).padStart(16, '0')}`
    state.payloadJobs.set(payloadId, { forkchoiceState, payloadAttributes, createdAt: Date.now() })
  }
  const res = { payloadStatus: { status: STATUS.VALID, latestValidHash: forkchoiceState.headBlockHash ?? null, validationError: null }, payloadId }
  await client.emitExExEvent({ type: 'enginePayload', phase: 'validated', method: request.method, payload: request.params, result: res })
  return ok(request, res)
}

export const engineNewPayloadProcedure = (client) => async (request) => {
  const [payload] = request.params ?? []
  if (!payload || typeof payload !== 'object') return badParams(request, 'Invalid execution payload')
  await client.emitExExEvent({ type: 'enginePayload', phase: 'received', method: request.method, payload })
  const res = !payload.parentHash
    ? { status: STATUS.ACCEPTED, latestValidHash: null, validationError: null }
    : { status: STATUS.VALID, latestValidHash: payload.blockHash ?? null, validationError: null }
  await client.emitExExEvent({ type: 'enginePayload', phase: 'validated', method: request.method, payload, result: res })
  return ok(request, res)
}

export const engineGetPayloadProcedure = (client) => async (request) => {
  const [payloadId] = request.params ?? []
  const state = ensureState(client)
  if (!payloadId || !state.payloadJobs.has(payloadId)) return badParams(request, 'Unknown payload id')
  const job = state.payloadJobs.get(payloadId)
  return ok(request, { blockHash: job.forkchoiceState.headBlockHash ?? '0x0', transactions: [], withdrawals: [] })
}

const MAX_BODIES = 1024
export const engineGetPayloadBodiesByHashProcedure = () => async (request) => {
  const [hashes] = request.params ?? []
  if (!Array.isArray(hashes)) return badParams(request, 'Invalid hashes')
  if (hashes.length > MAX_BODIES) return badParams(request, 'Request exceeds body lookup limit')
  return ok(request, hashes.map(() => null))
}

export const engineGetPayloadBodiesByRangeProcedure = () => async (request) => {
  const [start, count] = request.params ?? []
  const c = Number(BigInt(count ?? 0))
  if (c < 0 || c > MAX_BODIES || !start) return badParams(request, 'Invalid range')
  return ok(request, Array.from({ length: c }, () => null))
}

export const engineGetBlobsProcedure = () => async (request) => {
  const [hashes] = request.params ?? []
  if (!Array.isArray(hashes)) return badParams(request, 'Invalid blob hashes')
  if (hashes.length > MAX_BODIES) return badParams(request, 'Request exceeds blob lookup limit')
  return ok(request, hashes.map(() => null))
}

export const testingBuildBlockV1Procedure = (client) => async (request) => {
  const [parentHash, payloadAttributes, transactions, extraData] = request.params ?? []
  if (typeof parentHash !== 'string' || !parentHash.startsWith('0x')) return badParams(request, 'Invalid parent hash')
  if (!payloadAttributes || typeof payloadAttributes !== 'object') return badParams(request, 'Invalid payload attributes')
  if (transactions !== null && !Array.isArray(transactions)) return badParams(request, 'Invalid transactions')
  if (extraData !== undefined && typeof extraData !== 'string') return badParams(request, 'Invalid extra data')
  try {
    const vm = await client.getVm()
    const parentBlock = await vm.blockchain.getBlock(hexToBytes(parentHash))
    const parentHeader = parentBlock.header
    const blockBuilder = await vm.buildBlock({
      parentBlock,
      headerData: {
        number: parentHeader.number + 1n,
        timestamp: payloadAttributes.timestamp ? BigInt(payloadAttributes.timestamp) : parentHeader.timestamp + 1n,
        gasLimit: parentHeader.gasLimit,
        extraData: extraData ? hexToBytes(extraData) : undefined,
        coinbase: payloadAttributes.suggestedFeeRecipient ? hexToBytes(payloadAttributes.suggestedFeeRecipient) : undefined,
        mixHash: payloadAttributes.prevRandao ? hexToBytes(payloadAttributes.prevRandao) : undefined,
      },
      blockOpts: { freeze: false, putBlockIntoBlockchain: false, skipConsensusFormatValidation: true, setHardfork: false },
    })
    const applied = []
    for (const rawTx of transactions ?? []) {
      if (typeof rawTx !== 'string' || !rawTx.startsWith('0x')) return badParams(request, 'Invalid transaction encoding')
      const tx = createTxFromRLP(hexToBytes(rawTx), { common: vm.common })
      const result = await blockBuilder.addTransaction(tx)
      if (result.execResult.exceptionError) return badParams(request, `Transaction application failed: ${result.execResult.exceptionError.message}`)
      applied.push(rawTx)
    }
    const block = await blockBuilder.build()
    return ok(request, {
      executionPayload: {
        parentHash,
        blockHash: bytesToHex(block.hash()),
        blockNumber: `0x${block.header.number.toString(16)}`,
        timestamp: `0x${block.header.timestamp.toString(16)}`,
        feeRecipient: payloadAttributes.suggestedFeeRecipient ?? '0x0000000000000000000000000000000000000000',
        prevRandao: payloadAttributes.prevRandao ?? '0x0',
        extraData: extraData ?? '0x',
        transactions: applied,
      },
      blockValue: '0x0',
      blobsBundle: null,
      shouldOverrideBuilder: false,
    })
  } catch (e) {
    return badParams(request, /not found|unknown|missing/i.test(String(e)) ? 'Unknown parent block' : `Failed to build block: ${/** @type any */(e).message ?? String(e)}`)
  }
}

export const clearEngineState = (client) => {
  if (client.__engineState) client.__engineState.payloadJobs.clear()
}

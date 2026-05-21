import { createTevmNode } from '@tevm/node'
import { bytesToHex, numberToHex } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { testAccounts } from '../eth/utils/testAccounts.js'
import { requestProcedure } from '../requestProcedure.js'

let client: any
beforeEach(async () => {
	client = createTevmNode()
	await client.ready()
})

const payloadAttributesForHead = async () => {
	const vm = await client.getVm()
	const parent = await vm.blockchain.getCanonicalHeadBlock()
	return {
		parent,
		parentHash: bytesToHex(parent.hash()),
		payloadAttributes: {
			timestamp: numberToHex(parent.header.timestamp + 1n),
			prevRandao: `0x${'11'.repeat(32)}`,
			suggestedFeeRecipient: '0x0000000000000000000000000000000000000000',
		},
	}
}

const buildPayload = async () => {
	const { parentHash, payloadAttributes } = await payloadAttributesForHead()
	const res = await requestProcedure(client)({
		jsonrpc: '2.0',
		id: 10,
		method: 'testing_buildBlockV1',
		params: [parentHash, payloadAttributes, null, '0x'],
	} as any)
	expect(res.error).toBeUndefined()
	return res.result.executionPayload
}

describe('engine procedures', () => {
	it('handles forkchoice->getPayload lifecycle', async () => {
		const { parentHash, payloadAttributes } = await payloadAttributesForHead()
		const fc = await requestProcedure(client)({
			jsonrpc: '2.0',
			id: 1,
			method: 'engine_forkchoiceUpdatedV1',
			params: [
				{ headBlockHash: parentHash, safeBlockHash: parentHash, finalizedBlockHash: parentHash },
				payloadAttributes,
			],
		} as any)
		expect(fc.error).toBeUndefined()
		expect(fc.result.payloadStatus.status).toBe('VALID')
		const payloadId = fc.result.payloadId
		const payload = await requestProcedure(client)({
			jsonrpc: '2.0',
			id: 2,
			method: 'engine_getPayloadV1',
			params: [payloadId],
		} as any)
		expect(payload.error).toBeUndefined()
		expect(payload.result.parentHash).toBe(parentHash)
		expect(payload.result.blockHash).toMatch(/^0x[0-9a-f]{64}$/)
	})

	it('returns invalid params for unknown payload id', async () => {
		const res = await requestProcedure(client)({
			jsonrpc: '2.0',
			id: 1,
			method: 'engine_getPayloadV1',
			params: ['0xdeadbeef'],
		} as any)
		expect(res.error).toBeDefined()
	})

	it('validates and imports a built execution payload', async () => {
		const payload = await buildPayload()
		const res = await requestProcedure(client)({
			jsonrpc: '2.0',
			id: 1,
			method: 'engine_newPayloadV3',
			params: [payload],
		} as any)
		expect(res.error).toBeUndefined()
		expect(res.result).toEqual({ status: 'VALID', latestValidHash: payload.blockHash, validationError: null })

		const blockNumber = await requestProcedure(client)({ jsonrpc: '2.0', id: 2, method: 'eth_blockNumber' } as any)
		expect(blockNumber.result).toBe(payload.blockNumber)
	})

	it('returns syncing for an execution payload with an unknown parent', async () => {
		const payload = await buildPayload()
		const res = await requestProcedure(client)({
			jsonrpc: '2.0',
			id: 1,
			method: 'engine_newPayloadV3',
			params: [{ ...payload, parentHash: `0x${'11'.repeat(32)}` }],
		} as any)
		expect(res.error).toBeUndefined()
		expect(res.result).toEqual({ status: 'SYNCING', latestValidHash: null, validationError: null })
	})

	it('returns invalid for a payload whose block hash does not match its contents', async () => {
		const payload = await buildPayload()
		const res = await requestProcedure(client)({
			jsonrpc: '2.0',
			id: 1,
			method: 'engine_newPayloadV3',
			params: [{ ...payload, blockHash: `0x${'22'.repeat(32)}` }],
		} as any)
		expect(res.error).toBeUndefined()
		expect(res.result.status).toBe('INVALID')
		expect(res.result.latestValidHash).toBe(payload.parentHash)
		expect(res.result.validationError).toMatch(/Invalid blockHash/)
	})

	it('rejects malformed newPayload params', async () => {
		const res = await requestProcedure(client)({
			jsonrpc: '2.0',
			id: 1,
			method: 'engine_newPayloadV3',
			params: [{ blockHash: '0x2' }],
		} as any)
		expect(res.error).toBeDefined()
	})

	it('enforces lookup limits', async () => {
		const many = Array.from({ length: 1025 }, (_, i) => `0x${(i + 1).toString(16)}`)
		const byHash = await requestProcedure(client)({
			jsonrpc: '2.0',
			id: 1,
			method: 'engine_getPayloadBodiesByHashV1',
			params: [many],
		} as any)
		expect(byHash.error).toBeDefined()
		const blobs = await requestProcedure(client)({
			jsonrpc: '2.0',
			id: 2,
			method: 'engine_getBlobsV1',
			params: [many],
		} as any)
		expect(blobs.error).toBeDefined()
	})

	it('builds empty block via testing_buildBlockV1', async () => {
		const { parentHash, payloadAttributes } = await payloadAttributesForHead()
		const res = await requestProcedure(client)({
			jsonrpc: '2.0',
			id: 10,
			method: 'testing_buildBlockV1',
			params: [parentHash, payloadAttributes, null, '0x'],
		} as any)
		expect(res.error).toBeUndefined()
		expect(res.result.executionPayload.parentHash).toBe(parentHash)
		expect(res.result.executionPayload.blockHash).toMatch(/^0x[0-9a-f]{64}$/)
		expect(res.result.executionPayload.stateRoot).toMatch(/^0x[0-9a-f]{64}$/)
	})

	it('builds block with supplied transactions via testing_buildBlockV1', async () => {
		const { parentHash, payloadAttributes } = await payloadAttributesForHead()
		const signed = await requestProcedure(client)({
			jsonrpc: '2.0',
			id: 14,
			method: 'eth_signTransaction',
			params: [
				{
					from: testAccounts[0].address,
					to: testAccounts[1].address,
					value: '0x1',
					gas: '0x5208',
					gasPrice: '0x3b9aca00',
					nonce: '0x0',
				},
			],
		} as any)
		expect(signed.error).toBeUndefined()

		const res = await requestProcedure(client)({
			jsonrpc: '2.0',
			id: 15,
			method: 'testing_buildBlockV1',
			params: [parentHash, payloadAttributes, [signed.result], '0x'],
		} as any)
		expect(res.error).toBeUndefined()
		expect(res.result.executionPayload.parentHash).toBe(parentHash)
		expect(res.result.executionPayload.transactions).toEqual([signed.result])
	})

	it('rejects malformed testing_buildBlockV1 params', async () => {
		const res = await requestProcedure(client)({
			jsonrpc: '2.0',
			id: 11,
			method: 'testing_buildBlockV1',
			params: ['nope', {}, [], '0x'],
		} as any)
		expect(res.error).toBeDefined()
	})

	it('rejects unknown parent in testing_buildBlockV1', async () => {
		const res = await requestProcedure(client)({
			jsonrpc: '2.0',
			id: 12,
			method: 'testing_buildBlockV1',
			params: [
				`0x${'11'.repeat(32)}`,
				{
					timestamp: '0x1',
					prevRandao: `0x${'11'.repeat(32)}`,
					suggestedFeeRecipient: '0x0000000000000000000000000000000000000000',
				},
				null,
				'0x',
			],
		} as any)
		expect(res.error).toBeDefined()
	})

	it('rejects transaction application failure in testing_buildBlockV1', async () => {
		const { parentHash, payloadAttributes } = await payloadAttributesForHead()
		const res = await requestProcedure(client)({
			jsonrpc: '2.0',
			id: 13,
			method: 'testing_buildBlockV1',
			params: [parentHash, payloadAttributes, ['0x01'], '0x'],
		} as any)
		expect(res.error).toBeDefined()
	})
})

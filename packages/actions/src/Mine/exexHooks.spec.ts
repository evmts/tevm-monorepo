import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { bytesToHex, numberToHex } from '@tevm/utils'
import { parseEther } from 'viem'
import { describe, expect, it } from 'vitest'
import { callHandler } from '../Call/callHandler.js'
import { requestProcedure } from '../requestProcedure.js'
import { mineHandler } from './mineHandler.js'

describe('exex hooks', () => {
	it('runs hooks in order, awaits async hooks, and supports teardown', async () => {
		const calls: string[] = []
		const node = createTevmNode()
		const off1 = node.registerExExHook(async (event) => {
			if (event.type === 'block') {
				await Promise.resolve()
				calls.push('first')
			}
		})
		node.registerExExHook((event) => {
			if (event.type === 'block') calls.push('second')
		})

		await callHandler(node)({
			createTransaction: true,
			addToMempool: true,
			to: createAddress(`0x${'00'.repeat(19)}01`).toString(),
			value: parseEther('1'),
			skipBalance: true,
		})
		await mineHandler(node)({ blockCount: 1 })
		expect(calls).toEqual(['first', 'second'])

		off1()
		calls.length = 0
		await callHandler(node)({
			createTransaction: true,
			addToMempool: true,
			to: createAddress(`0x${'00'.repeat(19)}02`).toString(),
			value: parseEther('1'),
			skipBalance: true,
		})
		await mineHandler(node)({ blockCount: 1 })
		expect(calls).toEqual(['second'])
	})

	it('registers hooks via node options', async () => {
		const seen: string[] = []
		const node = createTevmNode({
			exExHooks: [
				(event) => {
					if (event.type === 'block' && event.phase === 'imported') seen.push('block/imported')
				},
			],
		})

		await mineHandler(node)({ blockCount: 1 })
		expect(seen).toEqual(['block/imported'])
	})

	it('continues when a hook throws', async () => {
		const calls: string[] = []
		const node = createTevmNode()
		node.registerExExHook(() => {
			throw new Error('boom')
		})
		node.registerExExHook((event) => {
			if (event.type === 'canonical') calls.push('ok')
		})
		await mineHandler(node)({ blockCount: 1 })
		expect(calls).toEqual(['ok'])
	})

	it('emits hooks in manual, automine, and interval mining modes', async () => {
		const seen: string[] = []
		const node = createTevmNode()
		node.registerExExHook((event) => {
			if (event.type === 'block') seen.push(event.phase)
		})

		node.miningConfig.type = 'manual'
		await mineHandler(node)({ blockCount: 1 })

		node.miningConfig.type = 'auto'
		await mineHandler(node)({ blockCount: 1 })

		node.miningConfig.type = 'interval'
		node.miningConfig.interval = 1000
		await mineHandler(node)({ blockCount: 1 })

		expect(seen).toEqual(['imported', 'imported', 'imported'])
	})

	it('emits engine payload events', async () => {
		const node = createTevmNode()
		const seen: string[] = []
		node.registerExExHook((event) => {
			if (event.type === 'enginePayload') seen.push(event.phase)
		})
		const vm = await node.getVm()
		const parent = await vm.blockchain.getCanonicalHeadBlock()
		const parentHash = bytesToHex(parent.hash())
		const built = await requestProcedure(node)({
			jsonrpc: '2.0',
			id: 1,
			method: 'testing_buildBlockV1',
			params: [
				parentHash,
				{
					timestamp: numberToHex(parent.header.timestamp + 1n),
					prevRandao: `0x${'11'.repeat(32)}`,
					suggestedFeeRecipient: '0x0000000000000000000000000000000000000000',
				},
				null,
				'0x',
			],
		} as any)
		await requestProcedure(node)({
			jsonrpc: '2.0',
			id: 2,
			method: 'engine_newPayloadV3',
			params: [built.result.executionPayload],
		} as any)
		expect(seen).toEqual(['received', 'validated'])
	})
})

import { Effect } from 'effect'
import { describe, expect, it } from 'vitest'
import * as Block from './Block.js'

describe('Block', () => {
	it('should convert block to RPC format', async () => {
		// Create a minimal block for testing
		const block: Block.Block = {
			hash: '0x123456',
			number: 1n,
			parentHash: '0xabcdef',
			timestamp: 1000n,
			nonce: '0x0000000000000000',
			difficulty: 0n,
			gasLimit: 10000000n,
			gasUsed: 5000000n,
			miner: '0x0000000000000000000000000000000000000000',
			extraData: '0x',
			baseFeePerGas: 1000000000n,
			receiptsRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
			stateRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
			transactionsRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
			withdrawalsRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
			blobGasUsed: 0n,
			excessBlobGas: 0n,
			parentBeaconBlockRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
			size: 1000n,
			totalDifficulty: 1000000n,
			transactions: [],
			uncles: [],
			withdrawals: [],
		}

		const result = await Effect.runPromise(Block.toRpc(block))
		expect(result).toHaveProperty('hash', '0x123456')
		expect(result).toHaveProperty('number', '0x1')
		expect(result).toHaveProperty('parentHash', '0xabcdef')
		expect(result).toHaveProperty('timestamp', '0x3e8')
	})

	it('should convert RPC block to block format', async () => {
		// Create a minimal RPC block for testing
		const rpcBlock: Block.Rpc = {
			hash: '0x123456',
			number: '0x1',
			parentHash: '0xabcdef',
			timestamp: '0x3e8',
			nonce: '0x0000000000000000',
			difficulty: '0x0',
			gasLimit: '0x989680',
			gasUsed: '0x4c4b40',
			miner: '0x0000000000000000000000000000000000000000',
			extraData: '0x',
			baseFeePerGas: '0x3b9aca00',
			receiptsRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
			stateRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
			transactionsRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
			withdrawalsRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
			blobGasUsed: '0x0',
			excessBlobGas: '0x0',
			parentBeaconBlockRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
			size: '0x3e8',
			totalDifficulty: '0xf4240',
			transactions: [],
			uncles: [],
			withdrawals: [],
		}

		const result = await Effect.runPromise(Block.fromRpc(rpcBlock))
		expect(result).toHaveProperty('hash', '0x123456')
		expect(result).toHaveProperty('number', 1n)
		expect(result).toHaveProperty('parentHash', '0xabcdef')
		expect(result).toHaveProperty('timestamp', 1000n)
	})

	it('should handle null blocks in fromRpc', async () => {
		const result = await Effect.runPromise(Block.fromRpc(null))
		expect(result).toBeNull()
	})

	it('should catch errors in toRpc', async () => {
		// @ts-expect-error intentionally passing invalid block
		const invalidBlock = { invalidField: 'test' }

		const program = Effect.either(Block.toRpc(invalidBlock))
		const result = await Effect.runPromise(program)

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left).toBeInstanceOf(Block.ToRpcError)
			expect(result.left.name).toBe('ToRpcError')
			expect(result.left._tag).toBe('ToRpcError')
		}
	})

	it('should catch errors in fromRpc', async () => {
		// @ts-expect-error intentionally passing invalid RPC block
		const invalidRpcBlock = { invalidField: 'test' }

		const program = Effect.either(Block.fromRpc(invalidRpcBlock))
		const result = await Effect.runPromise(program)

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left).toBeInstanceOf(Block.FromRpcError)
			expect(result.left.name).toBe('FromRpcError')
			expect(result.left._tag).toBe('FromRpcError')
		}
	})
})

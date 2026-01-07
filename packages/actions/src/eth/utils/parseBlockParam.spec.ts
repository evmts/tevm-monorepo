import { InvalidBlockError } from '@tevm/errors'
import { createTevmNode } from '@tevm/node'
import { bytesToHex } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { parseBlockParam } from './parseBlockParam.js'

describe('parseBlockParam', () => {
	let node: any
	let blockchain: any

	beforeEach(async () => {
		node = createTevmNode()
		const vm = await node.getVm()
		blockchain = vm.blockchain

		// Set up a canonical head block
		const headBlock = await blockchain.getCanonicalHeadBlock()
		blockchain.blocksByTag.set('latest', headBlock)
		blockchain.blocksByNumber.set(BigInt(headBlock.header.number), headBlock)
		blockchain.blocks.set(headBlock.hash(), headBlock)
	})

	it('should handle number input', async () => {
		const result = await parseBlockParam(blockchain, 123 as any)
		expect(result).toBe(123n)
	})

	it('should handle bigint input', async () => {
		const result = await parseBlockParam(blockchain, 456n)
		expect(result).toBe(456n)
	})

	it('should handle hex block hash', async () => {
		const headBlock = await blockchain.getCanonicalHeadBlock()
		const blockHash = bytesToHex(headBlock.hash())
		blockchain.blocks.set(blockHash, headBlock)
		const result = await parseBlockParam(blockchain, blockHash)
		expect(result).toBe(BigInt(headBlock.header.number))
	})

	it('should handle hex string block number input', async () => {
		const result = await parseBlockParam(blockchain, '0x123')
		expect(result).toBe(291n)
	})

	it('should handle "safe" tag', async () => {
		const safeBlock = await blockchain.getCanonicalHeadBlock()
		blockchain.blocksByTag.set('safe', safeBlock)
		const result = await parseBlockParam(blockchain, 'safe')
		expect(result).toBe(BigInt(safeBlock.header.number))
	})

	it('should throw error for unsupported "safe" tag', async () => {
		await expect(parseBlockParam(blockchain, 'safe')).rejects.toThrow(InvalidBlockError)
	})

	it('should handle "latest" tag', async () => {
		const latestBlock = await blockchain.getCanonicalHeadBlock()
		const result = await parseBlockParam(blockchain, 'latest')
		expect(result).toBe(BigInt(latestBlock.header.number))
	})

	it('should handle undefined as "latest"', async () => {
		const latestBlock = await blockchain.getCanonicalHeadBlock()
		const result = await parseBlockParam(blockchain, undefined as any)
		expect(result).toBe(BigInt(latestBlock.header.number))
	})

	it('should throw error for missing "latest" block', async () => {
		blockchain.blocksByTag.delete('latest')
		await expect(parseBlockParam(blockchain, 'latest')).rejects.toThrow(InvalidBlockError)
	})

	it('should throw error for "pending" tag', async () => {
		await expect(parseBlockParam(blockchain, 'pending')).rejects.toThrow(InvalidBlockError)
	})

	it('should handle "earliest" tag', async () => {
		const result = await parseBlockParam(blockchain, 'earliest')
		expect(result).toBe(1n)
	})

	it('should throw error for "finalized" tag', async () => {
		await expect(parseBlockParam(blockchain, 'finalized')).rejects.toThrow(InvalidBlockError)
	})

	it('should throw error for unknown block param', async () => {
		await expect(parseBlockParam(blockchain, 'unknown' as any)).rejects.toThrow(InvalidBlockError)
	})

	it('should handle non-existent block hash', async () => {
		const nonExistentHash = `0x${'1234'.repeat(16)}` as const
		await expect(parseBlockParam(blockchain, nonExistentHash)).rejects.toThrow('Block with hash')
	})
})

import { describe, expect, it } from 'bun:test'
import { createChain } from './createChain.js'
import { getMockBlocks } from './test/getBlocks.js'
import { optimism } from '@tevm/common'

describe(createChain.name, () => {
	it('should create a chain with the correct methods', async () => {
		const options = { common: optimism.copy() }
		const chain = await createChain(options)

		expect(chain).toHaveProperty('getBlockByTag')
		expect(chain).toHaveProperty('deepCopy')
		expect(chain).toHaveProperty('shallowCopy')
		expect(chain).toHaveProperty('getBlock')
		expect(chain).toHaveProperty('putBlock')
		expect(chain).toHaveProperty('validateHeader')
		expect(chain).toHaveProperty('getCanonicalHeadBlock')
		expect(chain).toHaveProperty('delBlock')
		expect(chain).toHaveProperty('getIteratorHead')
		expect(chain).toHaveProperty('setIteratorHead')
		expect(chain).toHaveProperty('consensus')
		expect(chain).toHaveProperty('iterator')
	})

	it('should perform deep copy of the chain', async () => {
		const options = { common: optimism.copy() }
		const chain = await createChain(options)
		const copy = await chain.deepCopy()

		expect(copy).not.toBe(chain)
		expect(copy.common).toEqual(chain.common)
		expect(copy.blocks.size).toBe(chain.blocks.size)
	})

	it('should perform shallow copy of the chain', async () => {
		const options = { common: optimism.copy() }
		const chain = await createChain(options)
		const copy = chain.shallowCopy()

		expect(copy).not.toBe(chain)
		expect(copy.common).toEqual(chain.common)
		expect(copy.blocks.size).toBe(chain.blocks.size)
	})

	it('should get and put blocks correctly', async () => {
		const options = { common: optimism.copy() }
		const chain = await createChain(options)
		const mockBlocks = await getMockBlocks()

		await chain.putBlock(mockBlocks[0])
		const block = await chain.getBlock(mockBlocks[0].header.hash())

		expect(block).toEqual(mockBlocks[0])
	})

	it('should validate block header correctly', async () => {
		const options = { common: optimism.copy() }
		const chain = await createChain(options)
		const mockBlocks = await getMockBlocks()

		await chain.putBlock(mockBlocks[0])
		await chain.putBlock(mockBlocks[1])
		const error = await chain.validateHeader(mockBlocks[1].header).catch((e) => e)
		expect(error).toBeUndefined()
	})

	it('should throw an error for invalid block header validation', async () => {
		const options = { common: optimism.copy() }
		const chain = await createChain(options)
		const mockBlocks = await getMockBlocks()

		await chain.putBlock(mockBlocks[0])
		const invalidHeader = { ...mockBlocks[1].header, number: mockBlocks[0].header.number } // invalid block number
		const error = await chain.validateHeader(invalidHeader as any).catch((e) => e)
		expect(error).toBeInstanceOf(Error)
		expect(error.message).toMatchSnapshot()
	})

	it('should delete a block correctly', async () => {
		const options = { common: optimism.copy() }
		const chain = await createChain(options)
		const mockBlocks = await getMockBlocks()

		await chain.putBlock(mockBlocks[0])
		await chain.putBlock(mockBlocks[1])
		await chain.delBlock(mockBlocks[1].header.hash())

		const block = await chain.getBlock(mockBlocks[1].header.hash()).catch((e) => e)
		expect(block).toBeInstanceOf(Error)
		expect(block.message).toMatchSnapshot()
	})

	it('should get and set iterator head correctly', async () => {
		const options = { common: optimism.copy() }
		const chain = await createChain(options)
		const mockBlocks = await getMockBlocks()

		await chain.putBlock(mockBlocks[0])
		await chain.setIteratorHead('vm', mockBlocks[0].header.hash())

		const head = await chain.getIteratorHead('vm')
		expect(head).toEqual(mockBlocks[0])
	})

	it('should get the canonical head block correctly', async () => {
		const options = { common: optimism.copy() }
		const chain = await createChain(options)
		const mockBlocks = await getMockBlocks()

		await chain.putBlock(mockBlocks[0])
		const head = await chain.getCanonicalHeadBlock()

		expect(head).toEqual(mockBlocks[0])
	})
})

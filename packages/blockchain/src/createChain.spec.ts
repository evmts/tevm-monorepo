import { optimism } from '@tevm/common'
import { describe, expect, it } from 'vitest'
import { createChain } from './createChain.js'
import { getMockBlocks } from './test/getBlocks.js'

describe(createChain.name, () => {
	it('has state', async () => {
		const chain = await createChain({ common: optimism.copy() })
		expect(chain.blocks).toBeInstanceOf(Map)
		expect(chain.blocksByNumber).toBeInstanceOf(Map)
		expect(chain.blocksByTag).toBeInstanceOf(Map)
	})

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

	it('should throw error when iterator method is called', async () => {
		const options = { common: optimism.copy() }
		const chain = (await createChain(options)) as any

		// Verify that calling iterator throws an error
		expect(() => chain.iterator()).toThrow('iterator is not implemented')
	})

	it('should perform deep copy of the chain', async () => {
		const options = { common: optimism.copy() }
		const chain = await createChain(options)
		const copy = await chain.deepCopy()

		expect(copy).not.toBe(chain)
		expect(copy.common.id).toEqual(chain.common.id)
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

	it('should throw an error for invalid block header validation', async () => {
		const options = { common: optimism.copy() }
		const chain = await createChain(options)
		const mockBlocks = await getMockBlocks()

		await chain.putBlock(mockBlocks[0])
		const invalidHeader = {
			...mockBlocks[1].header,
			number: mockBlocks[0].header.number,
		} // invalid block number
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
		await chain.delBlock(mockBlocks[0].hash())

		expect(chain.blocksByNumber.get(mockBlocks[0].header.number)).toBeUndefined()
	})

	it('should get and set iterator head correctly', async () => {
		const options = { common: optimism.copy() }
		const chain = await createChain(options)
		const mockBlocks = await getMockBlocks()

		await chain.putBlock(mockBlocks[0])
		await chain.setIteratorHead('vm', mockBlocks[0].hash())

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

import { optimism } from '@tevm/common'
import { InvalidBlockError, UnknownBlockError } from '@tevm/errors'
import { transports } from '@tevm/test-utils'
import { hexToBytes } from 'viem'
import { describe, expect, it } from 'vitest'
import { createBaseChain } from '../createBaseChain.js'
import { getMockBlocks } from '../test/getBlocks.js'
import { getBlock } from './getBlock.js'
import { putBlock } from './putBlock.js'

describe(getBlock.name, async () => {
	const chain = createBaseChain({
		common: optimism.copy(),
	})

	const blocks = await getMockBlocks()

	await putBlock(chain)(blocks[0])
	await putBlock(chain)(blocks[1])
	await putBlock(chain)(blocks[2])

	it('can get a block by hash', async () => {
		expect(await getBlock(chain)(blocks[0].hash())).toBe(blocks[0])
	})

	it('can get a block by number', async () => {
		expect(await getBlock(chain)(blocks[0].header.number)).toBe(blocks[0])
	})

	it('can get a block by number that is not a big int', async () => {
		expect(await getBlock(chain)(Number(blocks[0].header.number))).toBe(blocks[0])
	})

	it('should throw an error if the block does not exist', async () => {
		let error = await getBlock(chain)(69).catch((e) => e)
		expect(error).toBeInstanceOf(UnknownBlockError)
		expect(error).toMatchSnapshot()
		error = await getBlock(chain)(blocks[3].hash()).catch((e) => e)
		expect(error).toBeInstanceOf(UnknownBlockError)
		expect(error).toMatchSnapshot()
	})

	it('should fetch and cache the block from rpc if it does not exist', async () => {
		const chain = createBaseChain({
			common: optimism.copy(),
			fork: {
				transport: transports.optimism,
				blockTag: 141866019n,
			},
		})
		await chain.ready()
		expect(
			await getBlock(chain)(hexToBytes('0x5ce84d97d2f387431ab6f11b909181b3e46e50c7e345b6ba256b36f20ee53fc2')),
		).toMatchSnapshot()
	})

	it('should fetch and cache the block by number from rpc if it does not exist', async () => {
		const chain = createBaseChain({
			common: optimism.copy(),
			fork: {
				transport: transports.optimism,
			},
		})
		await chain.ready()
		expect((await getBlock(chain)(blocks[1].header.number)).hash()).toEqual(blocks[1].hash())
		expect(chain.blocksByNumber.get(blocks[1].header.number)?.hash()).toEqual(blocks[1].hash())
	})

	it('should throw an error if attempting to fetch a block newer than the forked block', async () => {
		const chain = createBaseChain({
			common: optimism.copy(),
			fork: {
				transport: transports.optimism,
				blockTag: blocks[0].header.number,
			},
		})
		await chain.ready()
		const error = await getBlock(chain)(blocks[1].header.number).catch((e) => e)
		expect(error).toBeInstanceOf(InvalidBlockError)
		expect(error).toMatchSnapshot()
	})

	it('should throw in a completely invalid blockTag format is passed', async () => {
		const chain = createBaseChain({
			common: optimism.copy(),
		})
		const error = await getBlock(chain)(['wtf'] as any).catch((e) => e)
		expect(error).toBeInstanceOf(InvalidBlockError)
		expect(error).toMatchSnapshot()
	})
})

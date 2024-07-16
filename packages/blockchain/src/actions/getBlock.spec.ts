import { describe, expect, it } from 'bun:test'
import { getBlock } from './getBlock.js'
import { createBaseChain } from '../createBaseChain.js'
import { mainnet } from '@tevm/common'
import { putBlock } from './putBlock.js'
import { getMockBlocks } from '../test/getBlocks.js'
import { UnknownBlockError } from '@tevm/errors'
import { transports } from '@tevm/test-utils'

describe(getBlock.name, async () => {
	const chain = createBaseChain({
		common: mainnet.copy(),
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
		let error = await getBlock(chain)(69).then((e) => e)
		expect(error).toBeInstanceOf(UnknownBlockError)
		expect(error).toMatchSnapshot()
		error = await getBlock(chain)(blocks[3].hash()).catch((e) => e)
		expect(error).toBeInstanceOf(UnknownBlockError)
		expect(error).toMatchSnapshot()
	})

	it('should fetch and cache the block from rpc if it does not exist', async () => {
		const chain = createBaseChain({
			common: mainnet.copy(),
			fork: {
				transport: transports.optimism,
				blockTag: blocks[0].header.number,
			},
		})
		await chain.ready()
		expect(await getBlock(chain)(blocks[1].hash())).toEqual(blocks[1])
		expect(chain.blocksByNumber.get(blocks[1].header.number)).toEqual(blocks[1])
	})

	it('should fetch and cache the block by number from rpc if it does not exist', async () => {
		const chain = createBaseChain({
			common: mainnet.copy(),
			fork: {
				transport: transports.optimism,
				blockTag: blocks[0].header.number,
			},
		})
		await chain.ready()
		expect(await getBlock(chain)(blocks[1].header.number)).toEqual(blocks[1])
		expect(chain.blocksByNumber.get(blocks[1].header.number)).toEqual(blocks[1])
	})

	it('should throw an error if attempting to fetch a block newer than the forked block', async () => {
		const chain = createBaseChain({
			common: mainnet.copy(),
			fork: {
				transport: transports.optimism,
				blockTag: blocks[0].header.number,
			},
		})
		await chain.ready()
		const error = await getBlock(chain)(blocks[1].header.number).catch((e) => e)
		expect(error).toBeInstanceOf(UnknownBlockError)
		expect(error).toMatchSnapshot()
	})
})

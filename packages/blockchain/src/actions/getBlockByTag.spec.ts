import { describe, expect, it } from 'bun:test'
import { getBlockByTag } from './getBlockByTag.js'
import { createBaseChain } from '../createBaseChain.js'
import { mainnet } from '@tevm/common'
import { getMockBlocks } from '../test/getBlocks.js'
import { putBlock } from './putBlock.js'
import { UnknownBlockError } from '@tevm/errors'
import { transports } from '@tevm/test-utils'

describe(getBlockByTag.name, async () => {
	const chain = createBaseChain({
		common: mainnet.copy(),
	})

	const blocks = await getMockBlocks()

	await putBlock(chain)(blocks[0])
	await putBlock(chain)(blocks[1])
	await putBlock(chain)(blocks[2])

	it('can get a block by hash', async () => {
		expect(await getBlockByTag(chain)(blocks[0].hash())).toBe(blocks[0])
	})

	it('can get a block by number', async () => {
		expect(await getBlockByTag(chain)(blocks[0].header.number)).toBe(blocks[0])
	})

	it('can get a block by number that is not a big int', async () => {
		expect(await getBlockByTag(chain)(Number(blocks[0].header.number))).toBe(blocks[0])
	})

	it('should throw an error if the block does not exist', async () => {
		let error = await getBlockByTag(chain)(69).then((e) => e)
		expect(error).toBeInstanceOf(UnknownBlockError)
		expect(error).toMatchSnapshot()
		error = await getBlockByTag(chain)(blocks[3].hash()).catch((e) => e)
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
		expect(await getBlockByTag(chain)('earliest')).toMatchSnapshot()
	})

	it('should throw UnknownBlockError if tag doesn not exist', async () => {
		const chain = createBaseChain({
			common: mainnet.copy(),
		})
		const error = await getBlockByTag(chain)('safe').catch((e) => e)
		expect(error).toBeInstanceOf(UnknownBlockError)
		expect(error).toMatchSnapshot()
	})
})

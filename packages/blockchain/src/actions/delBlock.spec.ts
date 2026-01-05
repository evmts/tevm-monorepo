import { optimism } from '@tevm/common'
import { InvalidBlockError } from '@tevm/errors'
import { bytesToHex } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { createBaseChain } from '../createBaseChain.js'
import { getMockBlocks } from '../test/getBlocks.js'
import { delBlock } from './delBlock.js'
import { getCanonicalHeadBlock } from './getCanonicalHeadBlock.js'
import { putBlock } from './putBlock.js'

describe(delBlock.name, async () => {
	it('should delete block', async () => {
		const chain = createBaseChain({
			common: optimism.copy(),
		})
		const blocks = await getMockBlocks()
		await putBlock(chain)(blocks[0])
		await putBlock(chain)(blocks[1])
		await putBlock(chain)(blocks[2])
		await putBlock(chain)(blocks[3])

		await delBlock(chain)(blocks[2].hash())

		expect(chain.blocks.get(bytesToHex(blocks[2].hash()))).toBeUndefined()
		expect(chain.blocksByNumber.get(blocks[2].header.number)).toBeUndefined()
	})

	it('should set latest to parent if we delete latest', async () => {
		const chain = createBaseChain({
			common: optimism.copy(),
		})
		const blocks = await getMockBlocks()
		await putBlock(chain)(blocks[0])
		await putBlock(chain)(blocks[1])
		// because of an optimism bug we must set it here
		chain.blocks.set(bytesToHex(blocks[1].header.parentHash), blocks[0])

		await delBlock(chain)(blocks[1].hash())

		expect(await getCanonicalHeadBlock(chain)()).toBe(blocks[0])
	})

	it('should throw an InvalidBlockError if we attempt to delete the fork block', async () => {
		const chain = createBaseChain({
			common: optimism.copy(),
		})
		const blocks = await getMockBlocks()
		await putBlock(chain)(blocks[0])
		chain.blocksByTag.set('forked', blocks[0])

		const error = await delBlock(chain)(blocks[0].hash()).catch((e) => e)

		expect(error).toBeInstanceOf(InvalidBlockError)
		expect(error).toMatchSnapshot()
	})
})

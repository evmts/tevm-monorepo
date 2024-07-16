import { describe, expect, it } from 'bun:test'
import { deepCopy } from './deepCopy.js'
import { createBaseChain } from '../createBaseChain.js'
import { optimism } from '@tevm/common'
import { putBlock } from './putBlock.js'
import { bytesToHex } from '@tevm/utils'
import { getBlock } from './getBlock.js'
import { getMockBlocks } from '../test/getBlocks.js'

describe(deepCopy.name, async () => {
	it('should deepCopy the chain', async () => {
		const blocks = await getMockBlocks()
		const chain = createBaseChain({
			common: optimism.copy(),
		})
		await putBlock(chain)(blocks[0])
		await putBlock(chain)(blocks[1])
		await putBlock(chain)(blocks[2])
		await putBlock(chain)(blocks[3])
		const copy = await deepCopy(chain)()
		expect(await getBlock(copy)(blocks[0].header.number)).toEqual(blocks[0])
		expect(await getBlock(copy)(blocks[1].header.number)).toEqual(blocks[1])
		expect(await getBlock(copy)(blocks[3].header.number)).toEqual(blocks[3])
		expect(chain.blocksByTag.get('latest')).toEqual(blocks[3])
		expect(chain.blocks.get(bytesToHex(blocks[0].hash()))).toEqual(blocks[0])
		expect(chain.blocks.get(bytesToHex(blocks[1].hash()))).toEqual(blocks[1])
		expect(chain.blocks.get(bytesToHex(blocks[2].hash()))).toEqual(blocks[2])
		expect(chain.blocks.get(bytesToHex(blocks[3].hash()))).toEqual(blocks[3])
		expect(chain.blocksByNumber.get(blocks[0].header.number)).toEqual(blocks[0])
		expect(chain.blocksByNumber.get(blocks[1].header.number)).toEqual(blocks[1])
		expect(chain.blocksByNumber.get(blocks[2].header.number)).toEqual(blocks[2])
		expect(chain.blocksByNumber.get(blocks[3].header.number)).toEqual(blocks[3])
	})
})

import { describe, expect, it } from 'bun:test'
import { optimism } from '@tevm/common'
import { bytesToHex } from 'viem'
import { createBaseChain } from '../createBaseChain.js'
import { getMockBlocks } from '../test/getBlocks.js'
import { putBlock } from './putBlock.js'

describe(putBlock.name, async () => {
	const blocks = await getMockBlocks()

	it('should save the block', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		await putBlock(chain)(blocks[0])
		expect(chain.blocks.get(bytesToHex(blocks[0].hash()))).toBe(blocks[0])
		expect(chain.blocksByNumber.get(blocks[0].header.number)).toBe(blocks[0])
	})

	it('should set the latest block if it is the highest block', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		await putBlock(chain)(blocks[0])
		expect(chain.blocksByTag.get('latest')).toBe(blocks[0])
	})

	it('should not set the latest block if it is not the highest block', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		await putBlock(chain)(blocks[1])
		await putBlock(chain)(blocks[0])
		expect(chain.blocksByTag.get('latest')).toBe(blocks[1])
	})
})

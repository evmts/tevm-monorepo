import { optimism } from '@tevm/common'
import { describe, expect, it } from 'vitest'
import { createBaseChain } from '../createBaseChain.js'
import { getMockBlocks } from '../test/getBlocks.js'
import { putBlock } from './putBlock.js'
import { setIteratorHead } from './setIteratorHead.js'

describe(setIteratorHead.name, async () => {
	const blocks = await getMockBlocks()

	it('should set the iterator head for a given tag', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		await putBlock(chain)(blocks[0])
		await setIteratorHead(chain)('myTag', blocks[0].hash())
		expect(chain.blocksByTag.get('myTag' as any)).toBe(blocks[0])
	})

	it('should reject unknown hashes', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		await expect(setIteratorHead(chain)('myTag', blocks[0].hash())).rejects.toThrow('No block with hash')
		expect(chain.blocksByTag.has('myTag' as any)).toBe(false)
	})
})

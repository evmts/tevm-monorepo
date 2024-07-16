import { describe, expect, it } from 'bun:test'
import { setIteratorHead } from './setIteratorHead.js'
import { createBaseChain } from '../createBaseChain.js'
import { getMockBlocks } from '../test/getBlocks.js'
import { optimism } from '@tevm/common'
import { putBlock } from './putBlock.js'

describe(setIteratorHead.name, async () => {
	const blocks = await getMockBlocks()

	it('should set the iterator head for a given tag', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		await putBlock(chain)(blocks[0])
		await setIteratorHead(chain)('myTag', blocks[0].header.hash())
		expect(chain.blocksByTag.get('myTag' as any)).toBe(blocks[0])
	})

	it('should throw an error if the block does not exist', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		let error = await setIteratorHead(chain)('nonExistentTag', new Uint8Array(32)).catch((e) => e)
		expect(error).toBeInstanceOf(Error)
		expect(error.message).toBe(
			'Block with hash 0000000000000000000000000000000000000000000000000000000000000000 not found',
		)
	})
})

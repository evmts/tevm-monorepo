import { describe, expect, it } from 'bun:test'
import { getCanonicalHeadBlock } from './getCanonicalHeadBlock.js'
import { createBaseChain } from '../createBaseChain.js'
import { putBlock } from './putBlock.js'
import { getMockBlocks } from '../test/getBlocks.js'
import { optimism } from '@tevm/common'
import { InternalError } from '@tevm/errors'

describe(getCanonicalHeadBlock.name, async () => {
	const blocks = await getMockBlocks()
	it('should get the canonical head block', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		await putBlock(chain)(blocks[0])
		expect(await getCanonicalHeadBlock(chain)()).toBe(blocks[0])
	})
	it('should throw an error if not cannonical block', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		chain.blocksByTag.set('latest', undefined)
		let error = await getCanonicalHeadBlock(chain)().catch((e) => e)
		expect(error).toBeInstanceOf(InternalError)
		expect(error).toMatchSnapshot()
	})
})

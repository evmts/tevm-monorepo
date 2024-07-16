import { optimism } from '@tevm/common'
import { InvalidBlockError } from '@tevm/errors'
import { describe, expect, it } from 'vitest'
import { createBaseChain } from '../createBaseChain.js'
import { getMockBlocks } from '../test/getBlocks.js'
import { getIteratorHead } from './getIteratorHead.js'
import { putBlock } from './putBlock.js'

describe(getIteratorHead.name, async () => {
	const blocks = await getMockBlocks()

	it('should get the iterator head block for default tag', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		await putBlock(chain)(blocks[0])
		chain.blocksByTag.set('vm' as any, blocks[0]) // Set the iterator head
		expect(await getIteratorHead(chain)()).toBe(blocks[0])
	})

	it('should get the iterator head block for a specific tag', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		await putBlock(chain)(blocks[1])
		chain.blocksByTag.set('myTag' as any, blocks[1]) // Set the iterator head
		expect(await getIteratorHead(chain)('myTag')).toBe(blocks[1])
	})

	it('should throw an error if the iterator head block does not exist', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		const error = await getIteratorHead(chain)('nonExistentTag').catch((e) => e)
		expect(error).toBeInstanceOf(InvalidBlockError)
		expect(error).toMatchSnapshot()
	})

	it('should include current tags in error message if the iterator head block does not exist', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		chain.blocksByTag.set('someTag' as any, blocks[0])
		const error = await getIteratorHead(chain)('nonExistentTag').catch((e) => e)
		expect(error).toBeInstanceOf(InvalidBlockError)
		expect(error).toMatchSnapshot()
	})
})

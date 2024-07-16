import { describe, expect, it } from 'bun:test'
import { validateHeader } from './validateHeader.js'
import { createBaseChain } from '../createBaseChain.js'
import { getMockBlocks } from '../test/getBlocks.js'
import { optimism } from '@tevm/common'
import { putBlock } from './putBlock.js'

describe(validateHeader.name, async () => {
	const blocks = await getMockBlocks()

	it('should validate a valid header', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		await putBlock(chain)(blocks[0])
		await putBlock(chain)(blocks[1])
		const headerValidator = validateHeader(chain)
		expect(await headerValidator(blocks[1].header)).toBeUndefined()
	})

	it('should throw an error for invalid block number', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		await putBlock(chain)(blocks[0])
		const invalidHeader = { ...blocks[1].header, number: blocks[0].header.number } // invalid block number
		const headerValidator = validateHeader(chain)
		const error = await headerValidator(invalidHeader as any).catch((e) => e)
		expect(error).toBeInstanceOf(Error)
		expect(error).toMatchSnapshot()
	})

	it('should throw an error for invalid timestamp', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		await putBlock(chain)(blocks[0])
		const invalidHeader = { ...blocks[1].header, timestamp: blocks[0].header.timestamp } // invalid timestamp
		const headerValidator = validateHeader(chain)
		const error = await headerValidator(invalidHeader as any).catch((e) => e)
		expect(error).toBeInstanceOf(Error)
		expect(error).toMatchSnapshot()
	})

	it('should throw an error for unsupported consensus type', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		await putBlock(chain)(blocks[0])
		const invalidHeader = {
			...blocks[1].header,
			common: {
				...blocks[1].header.common,
				ethjsCommon: { ...blocks[1].header.common.ethjsCommon, consensusType: () => 'pow' },
			},
		} // invalid consensus type
		const headerValidator = validateHeader(chain)
		const error = await headerValidator(invalidHeader as any).catch((e) => e)
		expect(error).toBeInstanceOf(Error)
		expect(error.message).toMatchSnapshot()
	})

	it('should throw an error for invalid timestamp diff (clique)', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		await putBlock(chain)(blocks[0])
		const invalidHeader = { ...blocks[1].header, timestamp: blocks[0].header.timestamp + 1n } // invalid timestamp diff
		const headerValidator = validateHeader(chain)
		const error = await headerValidator(invalidHeader as any).catch((e) => e)
		expect(error).toBeInstanceOf(Error)
		expect(error.message).toMatchSnapshot()
	})
})

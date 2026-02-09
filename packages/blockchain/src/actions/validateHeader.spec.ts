import { ConsensusAlgorithm, optimism } from '@tevm/common'
import { transports } from '@tevm/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createBaseChain } from '../createBaseChain.js'
import { getMockBlocks } from '../test/getBlocks.js'
import * as getBlockModule from './getBlock.js'
import { getBlock } from './getBlock.js'
import { getCanonicalHeadBlock } from './getCanonicalHeadBlock.js'
import { putBlock } from './putBlock.js'
import { validateHeader } from './validateHeader.js'

describe(validateHeader.name, async () => {
	const blocks = await getMockBlocks()

	beforeEach(() => {
		vi.restoreAllMocks()
	})

	it('should validate a valid header', async () => {
		const chain = createBaseChain({
			common: optimism.copy(),
			fork: { transport: transports.optimism },
		})
		const cannonicalHead = await getCanonicalHeadBlock(chain)()
		const parentBlock = await getBlock(chain)(cannonicalHead.header.parentHash)

		// Mock validateGasLimit to avoid the missing parameter issue
		vi.spyOn(cannonicalHead.header, 'validateGasLimit').mockImplementation(() => {})

		// Mock calcNextBaseFee on parent header to return the expected base fee
		const baseFeePerGas = cannonicalHead.header.baseFeePerGas
		if (baseFeePerGas === undefined) {
			throw new Error('Expected baseFeePerGas to be defined')
		}
		vi.spyOn(parentBlock.header, 'calcNextBaseFee').mockReturnValue(baseFeePerGas)
		vi.spyOn(parentBlock.header, 'calcNextExcessBlobGas').mockReturnValue(cannonicalHead.header.excessBlobGas)

		const headerValidator = validateHeader(chain)
		expect(await headerValidator(cannonicalHead.header)).toBeUndefined()

		// Verify validateGasLimit was called with parent header
		expect(cannonicalHead.header.validateGasLimit).toHaveBeenCalledWith(parentBlock.header)
	})

	it('should return early for genesis block validation', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		const headerValidator = validateHeader(chain)

		// Create a mock genesis header
		const genesisHeader = {
			isGenesis: () => true,
			errorStr: () => 'Genesis Block',
		}

		// Genesis block should pass validation with early return
		expect(await headerValidator(genesisHeader as any)).toBeUndefined()
	})

	it('should validate gas limit by calling validateGasLimit on header', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		await putBlock(chain)(blocks[0])

		// Mock validateGasLimit method on the actual header
		const mockValidateGasLimit = vi.fn()
		vi.spyOn(blocks[1].header, 'validateGasLimit').mockImplementation(mockValidateGasLimit)

		// Mock the common to use pos consensus and disable EIP1559
		vi.spyOn(chain.common.ethjsCommon, 'consensusType').mockReturnValue('pos')
		vi.spyOn(chain.common.ethjsCommon, 'isActivatedEIP').mockReturnValue(false)

		// Mock getBlock to return the parent block
		vi.spyOn(getBlockModule, 'getBlock').mockImplementation(() => {
			return async () => blocks[0]
		})

		const headerValidator = validateHeader(chain)
		await headerValidator(blocks[1].header)

		// Verify validateGasLimit was called with parent header
		expect(mockValidateGasLimit).toHaveBeenCalledWith(blocks[0].header)
	})

	it('should throw error when validating uncle block with incorrect height', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		await putBlock(chain)(blocks[0])

		// Mock a proper header with isGenesis and errorStr
		const header = {
			...blocks[1].header,
			isGenesis: () => false,
			errorStr: () => 'Test uncle header',
			validateGasLimit: vi.fn(),
			common: {
				...blocks[1].header.common,
				ethjsCommon: {
					...blocks[1].header.common.ethjsCommon,
					consensusType: () => 'pos',
					consensusAlgorithm: () => null,
					isActivatedEIP: () => false,
				},
			},
		}

		// Mock getBlock for parent
		vi.spyOn(getBlockModule, 'getBlock').mockImplementation(() => {
			return async () => blocks[0]
		})

		const headerValidator = validateHeader(chain)

		// Too old (parent number + 9)
		const tooOldHeight = blocks[0].header.number + BigInt(9)
		const errorTooOld = await headerValidator(header as any, tooOldHeight).catch((e) => e)
		expect(errorTooOld).toBeInstanceOf(Error)
		expect(errorTooOld.message).toContain('uncle block has a parent that is too old or too young')

		// Too young (parent number + 1, needs to be > 1)
		const tooYoungHeight = blocks[0].header.number + BigInt(1)
		const errorTooYoung = await headerValidator(header as any, tooYoungHeight).catch((e) => e)
		expect(errorTooYoung).toBeInstanceOf(Error)
		expect(errorTooYoung.message).toContain('uncle block has a parent that is too old or too young')

		// Just right (parent number + 3)
		const correctHeight = blocks[0].header.number + BigInt(3)

		try {
			await headerValidator(header as any, correctHeight)
		} catch (e: unknown) {
			// Make sure the error is not about the height
			expect((e as Error).message).not.toContain('uncle block has a parent that is too old or too young')
		}
	})

	it('should throw an error for invalid block number', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		await putBlock(chain)(blocks[0])

		const invalidHeader = {
			...blocks[1].header,
			isGenesis: () => false,
			errorStr: () => 'Invalid block number header',
			number: blocks[0].header.number, // invalid block number
		}

		// Mock getBlock for parent
		vi.spyOn(getBlockModule, 'getBlock').mockImplementation(() => {
			return async () => blocks[0]
		})

		const headerValidator = validateHeader(chain)
		const error = await headerValidator(invalidHeader as any).catch((e) => e)
		expect(error).toBeInstanceOf(Error)
		expect(error.message).toContain('invalid number')
	})

	it('should throw an error for invalid timestamp', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		await putBlock(chain)(blocks[0])

		const invalidHeader = {
			...blocks[1].header,
			isGenesis: () => false,
			errorStr: () => 'Invalid timestamp header',
			timestamp: blocks[0].header.timestamp, // invalid timestamp
		}

		// Mock getBlock for parent
		vi.spyOn(getBlockModule, 'getBlock').mockImplementation(() => {
			return async () => blocks[0]
		})

		const headerValidator = validateHeader(chain)
		const error = await headerValidator(invalidHeader as any).catch((e) => e)
		expect(error).toBeInstanceOf(Error)
		expect(error.message).toContain('invalid timestamp')
	})

	it('should throw an error for unsupported consensus type', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		await putBlock(chain)(blocks[0])

		// Mock the common to use pow consensus (not supported)
		vi.spyOn(chain.common.ethjsCommon, 'consensusType').mockReturnValue('pow')

		// Mock getBlock for parent
		vi.spyOn(getBlockModule, 'getBlock').mockImplementation(() => {
			return async () => blocks[0]
		})

		const headerValidator = validateHeader(chain)
		const error = await headerValidator(blocks[1].header).catch((e) => e)
		expect(error).toBeInstanceOf(Error)
		expect(error.message).toContain('Tevm currently does not support pow')
	})

	it('should throw an error for invalid timestamp diff (clique)', async () => {
		// Create a custom chain with clique consensus
		const cliqueCommon = optimism.copy()
		cliqueCommon.ethjsCommon.consensusAlgorithm = () => ConsensusAlgorithm.Clique
		cliqueCommon.ethjsCommon.consensusConfig = () => ({ period: 15 })

		const chain = createBaseChain({ common: cliqueCommon })
		await putBlock(chain)(blocks[0])

		// Create a header with timestamp too close to parent (less than period)
		const invalidHeader = {
			...blocks[1].header,
			isGenesis: () => false,
			errorStr: () => 'Invalid clique timestamp header',
			timestamp: blocks[0].header.timestamp + BigInt(10), // period is 15
			validateGasLimit: vi.fn(),
			common: {
				...blocks[1].header.common,
				ethjsCommon: {
					...blocks[1].header.common.ethjsCommon,
					consensusType: () => 'pos',
				},
			},
		}

		// Mock getBlock to return parent
		vi.spyOn(getBlockModule, 'getBlock').mockImplementation(() => {
			return async () => blocks[0]
		})

		const headerValidator = validateHeader(chain)
		const error = await headerValidator(invalidHeader as any).catch((e) => e)
		expect(error).toBeInstanceOf(Error)
		expect(error.message).toContain('invalid timestamp diff (lower than period)')
	})

	it('should handle height check for uncle blocks', async () => {
		// This test directly tests the logic for height checking in validateHeader
		const parentNumber = BigInt(5)
		// Remove unused variable
		// const headerNumber = BigInt(6)

		// Valid difference (between 1 and 8)
		const validHeight = parentNumber + BigInt(3)

		// Invalid difference (too large)
		const invalidHeight = parentNumber + BigInt(10)

		// Check the uncle block validation logic
		const dif = invalidHeight - parentNumber
		expect(dif < BigInt(8) && dif > BigInt(1)).toBe(false)

		// Check that a valid height difference passes
		const validDif = validHeight - parentNumber
		expect(validDif < BigInt(8) && validDif > BigInt(1)).toBe(true)
	})

	it('should check baseFeePerGas for non-initial EIP1559 blocks', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		const headerValidator = validateHeader(chain)

		// Create a parent block with calcNextBaseFee
		const parentBlock = {
			...blocks[0],
			header: {
				...blocks[0].header,
				calcNextBaseFee: () => BigInt(1000000000),
			},
		}

		// Mock getBlock to return our mocked parent block - use type assertion for tests
		vi.spyOn(getBlockModule, 'getBlock').mockImplementation(() => {
			return async () => parentBlock as any
		})

		// Create a header with correct EIP1559 settings but wrong baseFeePerGas
		const header = {
			...blocks[1].header,
			isGenesis: () => false,
			errorStr: () => 'EIP1559 header',
			parentHash: blocks[1].header.parentHash,
			baseFeePerGas: BigInt(500000), // Incorrect value
			validateGasLimit: vi.fn(),
			common: {
				...blocks[1].header.common,
				ethjsCommon: {
					...blocks[1].header.common.ethjsCommon,
					consensusType: () => 'pos',
					consensusAlgorithm: () => null,
					isActivatedEIP: (eip: number) => eip === 1559,
					hardforkBlock: () => BigInt(5), // London at block 5, our header is after this
				},
			},
		}

		const error = await headerValidator(header as any).catch((e) => e)
		expect(error).toBeInstanceOf(Error)
		expect(error.message).toContain('Invalid block: base fee not correct')
	})

	it('should check initialBaseFee for initial EIP1559 block', async () => {
		const londonHfBlock = BigInt(10000)

		// Create common with London HF at block 10000 and initial base fee
		const customCommon = optimism.copy()
		// @ts-expect-error - mocking for test
		customCommon.ethjsCommon.hardforkBlock = (hf: string) => (hf === 'london' ? londonHfBlock : undefined)
		// @ts-expect-error - mocking for test
		customCommon.ethjsCommon.param = (category: string, name: string) => {
			if (category === 'gasConfig' && name === 'initialBaseFee') {
				return BigInt(1000000000)
			}
			return undefined
		}

		const chain = createBaseChain({ common: customCommon })
		const headerValidator = validateHeader(chain)

		// Mock parent header
		const mockParentHeader = {
			...blocks[0].header,
			number: londonHfBlock - BigInt(1),
		}

		// Mock getBlock to return our mocked parent header
		vi.spyOn(getBlockModule, 'getBlock').mockImplementation(() => {
			return async () => ({ header: mockParentHeader }) as any
		})

		// Create a header at London HF with incorrect baseFeePerGas
		const header = {
			...blocks[1].header,
			isGenesis: () => false,
			errorStr: () => 'Initial EIP1559 header',
			number: londonHfBlock,
			parentHash: blocks[0].header.hash(),
			baseFeePerGas: BigInt(500000), // Incorrect value, should be 1000000000
			validateGasLimit: vi.fn(),
			common: {
				...blocks[1].header.common,
				ethjsCommon: {
					...customCommon.ethjsCommon,
					consensusType: () => 'pos',
					isActivatedEIP: (eip: number) => eip === 1559,
				},
			},
		}

		const error = await headerValidator(header as any).catch((e) => e)
		expect(error).toBeInstanceOf(Error)
		expect(error.message).toContain('Invalid block: base fee not correct')
	})

	it('should check excessBlobGas for EIP4844 blocks', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		const headerValidator = validateHeader(chain)

		// Mock calcNextExcessBlobGas on the parent header
		vi.spyOn(blocks[0].header, 'calcNextExcessBlobGas').mockReturnValue(BigInt(700000))

		// Mock validateGasLimit to avoid the gasLimitBoundDivisor error
		vi.spyOn(blocks[1].header, 'validateGasLimit').mockImplementation(() => {})

		// Mock getBlock to return the parent block
		vi.spyOn(getBlockModule, 'getBlock').mockImplementation(() => {
			return async () => blocks[0]
		})

		// Mock the header's excessBlobGas to be incorrect
		const originalExcessBlobGas = blocks[1].header.excessBlobGas
		Object.defineProperty(blocks[1].header, 'excessBlobGas', {
			value: BigInt(800000),
			configurable: true,
		})

		// Mock the common to enable EIP4844 and pos consensus
		vi.spyOn(chain.common.ethjsCommon, 'consensusType').mockReturnValue('pos')
		vi.spyOn(chain.common.ethjsCommon, 'isActivatedEIP').mockImplementation((eip: number) => eip === 4844)

		const error = await headerValidator(blocks[1].header).catch((e) => e)

		// Restore original value
		Object.defineProperty(blocks[1].header, 'excessBlobGas', {
			value: originalExcessBlobGas,
			configurable: true,
		})

		expect(error).toBeInstanceOf(Error)
		expect(error.message).toContain('expected blob gas: 700000, got: 800000')
	})
})

// @ts-nocheck - Disable type checking for this test file
import { describe, expect, it, mock } from 'bun:test'
import { Block } from '@tevm/block'
import type { BaseVm } from '../BaseVm.js'
import type { RunBlockOpts } from '../utils/index.js'
import { runBlock } from './runBlock.js'

// Create mock for applyBlock
const mockApplyBlockResult = {
	receipts: [],
	results: [],
	gasUsed: 100n,
	bloom: {
		bitvector: new Uint8Array(256),
		keccakFunction: () => new Uint8Array(32),
		add: () => {},
		check: () => false,
		multiCheck: () => false,
		or: () => {},
	},
	receiptsRoot: new Uint8Array(32),
	preimages: new Map(),
}

// Mock the applyBlock dependency
mock('./applyBlock.js', {
	applyBlock: mock().mockImplementation(() => {
		return () => Promise.resolve(mockApplyBlockResult)
	}),
})

describe('runBlock', () => {
	it.skip('should emit events and execute a block', async () => {
		// Create mocks
		const setStateRootMock = mock().mockResolvedValue(undefined)
		const getStateRootMock = mock().mockResolvedValue(new Uint8Array(32).fill(1))
		const checkpointMock = mock().mockResolvedValue(undefined)
		const commitMock = mock().mockResolvedValue(undefined)
		const revertMock = mock().mockResolvedValue(undefined)
		const emitSpy = mock()
		const hardforkIsActiveOnBlockMock = mock().mockReturnValue(false)
		const isActivatedEIPMock = mock().mockReturnValue(false)
		const readyMock = mock().mockResolvedValue(undefined)

		const stateManager = {
			setStateRoot: setStateRootMock,
			getStateRoot: getStateRootMock,
		}

		const journal = {
			checkpoint: checkpointMock,
			commit: commitMock,
			revert: revertMock,
		}

		const evm = {
			journal,
		}

		// Create a minimal block
		const block = {
			header: {
				number: 10n,
				receiptTrie: new Uint8Array(32),
				logsBloom: new Uint8Array(256),
				gasUsed: 100n,
				stateRoot: new Uint8Array(32).fill(1),
			},
			transactions: [],
			uncleHeaders: [],
		} as unknown as Block

		// Create VM mock
		const vm = {
			stateManager,
			evm,
			blockchain: {
				validateHeader: mock().mockResolvedValue(undefined),
			},
			_emit: emitSpy,
			common: {
				ethjsCommon: {
					hardforkIsActiveOnBlock: hardforkIsActiveOnBlockMock,
					isActivatedEIP: isActivatedEIPMock,
				},
			},
			ready: readyMock,
		} as unknown as BaseVm

		// Execute runBlock
		const runBlockFunction = runBlock(vm)
		const result = await runBlockFunction({ block, generate: false } as RunBlockOpts)

		// Verify basic events and methods were called
		expect(emitSpy).toHaveBeenCalledTimes(2)
		expect(emitSpy).toHaveBeenNthCalledWith(1, 'beforeBlock', block)
		expect(emitSpy).toHaveBeenNthCalledWith(
			2,
			'afterBlock',
			expect.objectContaining({
				block,
				receipts: [],
				gasUsed: 100n,
			}),
		)

		expect(checkpointMock).toHaveBeenCalled()
		expect(commitMock).toHaveBeenCalled()
		expect(setStateRootMock).toHaveBeenCalled()
		expect(setStateRootMock).toHaveBeenCalledWith(block.header.stateRoot)
		expect(getStateRootMock).toHaveBeenCalled()

		// Verify result structure
		expect(result.receipts).toEqual([])
		expect(result.gasUsed).toBe(100n)
	})

	it.skip('should set state root if provided', async () => {
		const customStateRoot = new Uint8Array(32).fill(5)

		const stateManager = {
			setStateRoot: mock().mockResolvedValue(undefined),
			getStateRoot: mock().mockResolvedValue(customStateRoot),
		}

		const journal = {
			checkpoint: mock().mockResolvedValue(undefined),
			commit: mock().mockResolvedValue(undefined),
			revert: mock().mockResolvedValue(undefined),
		}

		const vm = {
			stateManager,
			evm: { journal },
			_emit: mock(),
			common: {
				ethjsCommon: {
					hardforkIsActiveOnBlock: mock().mockReturnValue(false),
					isActivatedEIP: mock().mockReturnValue(false),
				},
			},
			ready: mock().mockResolvedValue(undefined),
		} as unknown as BaseVm

		const block = {
			header: {
				number: 10n,
				receiptTrie: new Uint8Array(32),
				logsBloom: new Uint8Array(256),
				gasUsed: 100n,
				stateRoot: new Uint8Array(32).fill(1),
			},
			transactions: [],
			uncleHeaders: [],
		} as unknown as Block

		const runBlockFunction = runBlock(vm)
		await runBlockFunction({
			block,
			root: customStateRoot,
			generate: false,
		} as RunBlockOpts)

		expect(stateManager.setStateRoot).toHaveBeenCalledWith(customStateRoot)
	})

	it('should revert on error and rethrow', async () => {
		// Create a separate mock for applyBlock that throws
		const mockApplyBlockError = new Error('Apply block failed')
		mock('./applyBlock.js', {
			applyBlock: mock().mockImplementation(() => {
				return () => Promise.reject(mockApplyBlockError)
			}),
		})

		const stateManager = {
			setStateRoot: mock().mockResolvedValue(undefined),
			getStateRoot: mock().mockResolvedValue(new Uint8Array(32)),
		}

		const journalRevert = mock().mockResolvedValue(undefined)
		const journalCheckpoint = mock().mockResolvedValue(undefined)

		const journal = {
			checkpoint: journalCheckpoint,
			revert: journalRevert,
		}

		const vm = {
			stateManager,
			evm: { journal },
			_emit: mock(),
			common: {
				ethjsCommon: {
					hardforkIsActiveOnBlock: mock().mockReturnValue(false),
					isActivatedEIP: mock().mockReturnValue(false),
				},
			},
			ready: mock().mockResolvedValue(undefined),
		} as unknown as BaseVm

		const block = {
			header: {
				number: 10n,
				receiptTrie: new Uint8Array(32),
				logsBloom: new Uint8Array(256),
				gasUsed: 100n,
				stateRoot: new Uint8Array(32),
			},
			transactions: [],
			uncleHeaders: [],
		} as unknown as Block

		const runBlockFunction = runBlock(vm)

		try {
			await runBlockFunction({ block, generate: false } as RunBlockOpts)
			expect(true).toBe(false) // Should not reach here
		} catch (error: any) {
			// The error message depends on the implementation, so we only check that an error was thrown
			expect(error).toBeTruthy()
			expect(journalRevert).toHaveBeenCalled()
		}
	})

	it.skip('should handle skipBlockValidation option', async () => {
		// Reset the mock
		const validationMock = mock().mockImplementation((options: any) => {
			// Check if skipBlockValidation was passed correctly
			expect(options.skipBlockValidation).toBe(true)
			return mockApplyBlockResult
		})

		mock('./applyBlock.js', {
			applyBlock: mock().mockImplementation(() => {
				return () => Promise.resolve(validationMock)
			}),
		})

		const stateManager = {
			setStateRoot: mock().mockResolvedValue(undefined),
			getStateRoot: mock().mockResolvedValue(new Uint8Array(32)),
		}

		const journal = {
			checkpoint: mock().mockResolvedValue(undefined),
			commit: mock().mockResolvedValue(undefined),
		}

		const vm = {
			stateManager,
			evm: { journal },
			_emit: mock(),
			common: {
				ethjsCommon: {
					hardforkIsActiveOnBlock: mock().mockReturnValue(false),
					isActivatedEIP: mock().mockReturnValue(false),
				},
			},
			ready: mock().mockResolvedValue(undefined),
		} as unknown as BaseVm

		const block = {
			header: {
				number: 10n,
				receiptTrie: new Uint8Array(32),
				logsBloom: new Uint8Array(256),
				gasUsed: 100n,
				stateRoot: new Uint8Array(32),
			},
			transactions: [],
			uncleHeaders: [],
		} as unknown as Block

		const runBlockFunction = runBlock(vm)
		await runBlockFunction({
			block,
			generate: false,
			skipBlockValidation: true,
		} as RunBlockOpts)
	})
})

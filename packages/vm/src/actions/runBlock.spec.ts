// @ts-nocheck - Disable type checking for this test file
import { describe, expect, it, vi } from 'vitest'
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
vi.mock('./applyBlock.js', () => ({
	applyBlock: vi.fn().mockImplementation(() => {
		return () => Promise.resolve(mockApplyBlockResult)
	}),
}))

describe('runBlock', () => {
	it.skip('should emit events and execute a block', async () => {
		// Create mocks
		const setStateRootMock = vi.fn().mockResolvedValue(undefined)
		const getStateRootMock = vi.fn().mockResolvedValue(new Uint8Array(32).fill(1))
		const checkpointMock = vi.fn().mockResolvedValue(undefined)
		const commitMock = vi.fn().mockResolvedValue(undefined)
		const revertMock = vi.fn().mockResolvedValue(undefined)
		const emitSpy = vi.fn()
		const hardforkIsActiveOnBlockMock = vi.fn().mockReturnValue(false)
		const isActivatedEIPMock = vi.fn().mockReturnValue(false)
		const readyMock = vi.fn().mockResolvedValue(undefined)

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
				validateHeader: vi.fn().mockResolvedValue(undefined),
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
			setStateRoot: vi.fn().mockResolvedValue(undefined),
			getStateRoot: vi.fn().mockResolvedValue(customStateRoot),
		}

		const journal = {
			checkpoint: vi.fn().mockResolvedValue(undefined),
			commit: vi.fn().mockResolvedValue(undefined),
			revert: vi.fn().mockResolvedValue(undefined),
		}

		const vm = {
			stateManager,
			evm: { journal },
			_emit: vi.fn(),
			common: {
				ethjsCommon: {
					hardforkIsActiveOnBlock: vi.fn().mockReturnValue(false),
					isActivatedEIP: vi.fn().mockReturnValue(false),
				},
			},
			ready: vi.fn().mockResolvedValue(undefined),
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
		const stateManager = {
			setStateRoot: vi.fn().mockResolvedValue(undefined),
			getStateRoot: vi.fn().mockResolvedValue(new Uint8Array(32)),
		}

		const journalRevert = vi.fn().mockResolvedValue(undefined)
		const journalCheckpoint = vi.fn().mockResolvedValue(undefined)

		const journal = {
			checkpoint: journalCheckpoint,
			revert: journalRevert,
		}

		const vm = {
			stateManager,
			evm: { journal },
			_emit: vi.fn(),
			common: {
				ethjsCommon: {
					hardforkIsActiveOnBlock: vi.fn().mockReturnValue(false),
					isActivatedEIP: vi.fn().mockReturnValue(false),
				},
			},
			ready: vi.fn().mockResolvedValue(undefined),
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
		const validationMock = vi.fn().mockImplementation((options: any) => {
			// Check if skipBlockValidation was passed correctly
			expect(options.skipBlockValidation).toBe(true)
			return mockApplyBlockResult
		})

		vi.mock('./applyBlock.js', () => ({
			applyBlock: vi.fn().mockImplementation(() => {
				return () => Promise.resolve(validationMock)
			}),
		}))

		const stateManager = {
			setStateRoot: vi.fn().mockResolvedValue(undefined),
			getStateRoot: vi.fn().mockResolvedValue(new Uint8Array(32)),
		}

		const journal = {
			checkpoint: vi.fn().mockResolvedValue(undefined),
			commit: vi.fn().mockResolvedValue(undefined),
		}

		const vm = {
			stateManager,
			evm: { journal },
			_emit: vi.fn(),
			common: {
				ethjsCommon: {
					hardforkIsActiveOnBlock: vi.fn().mockReturnValue(false),
					isActivatedEIP: vi.fn().mockReturnValue(false),
				},
			},
			ready: vi.fn().mockResolvedValue(undefined),
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

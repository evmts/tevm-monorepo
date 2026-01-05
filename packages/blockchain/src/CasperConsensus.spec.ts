import { describe, it, expect } from 'vitest'
import { CasperConsensus } from './CasperConsensus.js'
import { ConsensusAlgorithm } from '@tevm/common'
import { InternalError } from '@tevm/errors'

describe('CasperConsensus', () => {
	it('should have Casper algorithm identifier', () => {
		const consensus = new CasperConsensus()
		expect(consensus.algorithm).toBe(ConsensusAlgorithm.Casper)
	})

	describe('genesisInit', () => {
		it('should be a no-op that resolves successfully', async () => {
			const consensus = new CasperConsensus()
			// Should not throw
			await expect(consensus.genesisInit(undefined)).resolves.toBeUndefined()
		})

		it('should handle being called with a block argument', async () => {
			const consensus = new CasperConsensus()
			const mockBlock = {} as any
			// Should not throw even with a block arg
			await expect(consensus.genesisInit(mockBlock)).resolves.toBeUndefined()
		})
	})

	describe('setup', () => {
		it('should be a no-op that resolves successfully', async () => {
			const consensus = new CasperConsensus()
			await expect(consensus.setup(undefined)).resolves.toBeUndefined()
		})

		it('should handle being called with options', async () => {
			const consensus = new CasperConsensus()
			const mockOptions = { blockchain: {} } as any
			await expect(consensus.setup(mockOptions)).resolves.toBeUndefined()
		})
	})

	describe('validateConsensus', () => {
		it('should be a no-op that resolves successfully', async () => {
			const consensus = new CasperConsensus()
			await expect(consensus.validateConsensus(undefined)).resolves.toBeUndefined()
		})

		it('should handle being called with a block', async () => {
			const consensus = new CasperConsensus()
			const mockBlock = {} as any
			await expect(consensus.validateConsensus(mockBlock)).resolves.toBeUndefined()
		})
	})

	describe('validateDifficulty', () => {
		it('should accept difficulty of 0n', async () => {
			const consensus = new CasperConsensus()
			const mockHeader = {
				difficulty: 0n,
				number: 100n,
				hash: () => '0x1234567890abcdef',
			}
			await expect(consensus.validateDifficulty(mockHeader as any)).resolves.toBeUndefined()
		})

		it('should throw InternalError for non-zero difficulty', async () => {
			const consensus = new CasperConsensus()
			const mockHeader = {
				difficulty: 1n,
				number: 100n,
				hash: () => '0xabcdef1234567890',
			}
			await expect(consensus.validateDifficulty(mockHeader as any)).rejects.toThrow(InternalError)
		})

		it('should include header error string in error message when errorStr is a function', async () => {
			const consensus = new CasperConsensus()
			const mockHeader = {
				difficulty: 12345n,
				errorStr: () => 'custom error string info',
			}
			try {
				await consensus.validateDifficulty(mockHeader as any)
				expect.fail('Should have thrown')
			} catch (error) {
				expect(error).toBeInstanceOf(InternalError)
				expect((error as Error).message).toContain('invalid difficulty')
				expect((error as Error).message).toContain('PoS blocks must have difficulty 0')
				expect((error as Error).message).toContain('custom error string info')
			}
		})

		it('should include block number and hash in error when errorStr is not available', async () => {
			const consensus = new CasperConsensus()
			const mockHeader = {
				difficulty: 999n,
				number: 42n,
				hash: () => '0xdeadbeef',
			}
			try {
				await consensus.validateDifficulty(mockHeader as any)
				expect.fail('Should have thrown')
			} catch (error) {
				expect(error).toBeInstanceOf(InternalError)
				expect((error as Error).message).toContain('block number=42')
				expect((error as Error).message).toContain('hash=0xdeadbeef')
			}
		})

		it('should handle missing hash function gracefully', async () => {
			const consensus = new CasperConsensus()
			const mockHeader = {
				difficulty: 1n,
				number: 50n,
				// no hash function
			}
			try {
				await consensus.validateDifficulty(mockHeader as any)
				expect.fail('Should have thrown')
			} catch (error) {
				expect(error).toBeInstanceOf(InternalError)
				expect((error as Error).message).toContain('hash=unknown')
			}
		})
	})

	describe('newBlock', () => {
		it('should be a no-op that resolves successfully', async () => {
			const consensus = new CasperConsensus()
			await expect(consensus.newBlock(undefined, undefined, undefined)).resolves.toBeUndefined()
		})

		it('should handle being called with all arguments', async () => {
			const consensus = new CasperConsensus()
			const mockBlock = {} as any
			const mockAncestor = {} as any
			const mockAncientHeaders = [{}, {}] as any
			await expect(consensus.newBlock(mockBlock, mockAncestor, mockAncientHeaders)).resolves.toBeUndefined()
		})
	})
})

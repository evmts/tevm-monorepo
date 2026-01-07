import { describe, it, expect } from 'vitest'
import { BuildStatus } from './BuildStatus.js'
import { DAOConfig } from './DAOConfig.js'
import { parentBeaconBlockRootAddress } from './parentBeaconBlockRootAddress.js'
import type { BlockStatus } from './BlockStatus.js'
import type { Block } from '@tevm/block'

describe('BuildStatus enum', () => {
	it('should have Reverted status', () => {
		expect(BuildStatus.Reverted).toBe('reverted')
	})

	it('should have Build status', () => {
		expect(BuildStatus.Build).toBe('build')
	})

	it('should have Pending status', () => {
		expect(BuildStatus.Pending).toBe('pending')
	})

	it('should only have 3 status values', () => {
		// Enum values (not keys)
		const values = Object.values(BuildStatus).filter(v => typeof v === 'string')
		expect(values).toHaveLength(3)
		expect(values).toContain('reverted')
		expect(values).toContain('build')
		expect(values).toContain('pending')
	})
})

describe('BlockStatus type', () => {
	it('should create pending status correctly', () => {
		const status: BlockStatus = { status: BuildStatus.Pending }
		expect(status.status).toBe(BuildStatus.Pending)
		expect('block' in status).toBe(false)
	})

	it('should create reverted status correctly', () => {
		const status: BlockStatus = { status: BuildStatus.Reverted }
		expect(status.status).toBe(BuildStatus.Reverted)
		expect('block' in status).toBe(false)
	})

	it('should create build status with block correctly', () => {
		// Create a mock block - the type system requires a block property for Build status
		const mockBlock = { header: { number: 1n } } as unknown as Block
		const status: BlockStatus = { status: BuildStatus.Build, block: mockBlock }
		expect(status.status).toBe(BuildStatus.Build)
		expect(status.block).toBe(mockBlock)
	})
})

describe('DAOConfig', () => {
	it('should have DAOAccounts array', () => {
		expect(Array.isArray(DAOConfig.DAOAccounts)).toBe(true)
	})

	it('should have 116 DAO accounts', () => {
		// The DAO hack affected these accounts that needed refunds
		expect(DAOConfig.DAOAccounts).toHaveLength(116)
	})

	it('should have DAORefundContract address', () => {
		expect(DAOConfig.DAORefundContract).toBe('bf4ed7b27f1d666546e30d74d50d173d20bca754')
	})

	it('should have all accounts as valid 40-character hex strings', () => {
		for (const account of DAOConfig.DAOAccounts) {
			expect(account).toMatch(/^[a-f0-9]{40}$/i)
		}
	})

	it('should have refund contract as valid 40-character hex string', () => {
		expect(DAOConfig.DAORefundContract).toMatch(/^[a-f0-9]{40}$/i)
	})

	it('should include the main DAO contract', () => {
		// The main DAO contract address (TheDAO)
		expect(DAOConfig.DAOAccounts).toContain('bb9bc244d798123fde783fcc1c72d3bb8c189413')
	})

	it('should be immutable (as const)', () => {
		// Verify that the config is marked as const
		// This is a compile-time check, but we can verify the structure exists
		expect(typeof DAOConfig).toBe('object')
		expect(Object.isFrozen(DAOConfig)).toBe(false) // Note: as const doesn't freeze at runtime
	})
})

describe('parentBeaconBlockRootAddress', () => {
	it('should be the correct EIP-4788 beacon root contract address', () => {
		// EIP-4788 specifies this address for the beacon block root contract
		// This is a system contract deployed at a deterministic address
		const expectedAddress = '0x000F3df6D732807Ef1319fB7B8bB8522d0Beac02'
		expect(parentBeaconBlockRootAddress.toString()).toBe(expectedAddress.toLowerCase())
	})

	it('should be an Address type', () => {
		// Verify it has Address properties
		expect(parentBeaconBlockRootAddress).toBeDefined()
		expect(typeof parentBeaconBlockRootAddress.toString).toBe('function')
		expect(parentBeaconBlockRootAddress.bytes).toBeInstanceOf(Uint8Array)
	})

	it('should have correct byte length (20 bytes)', () => {
		expect(parentBeaconBlockRootAddress.bytes.length).toBe(20)
	})

	it('should have correct first bytes', () => {
		const bytes = parentBeaconBlockRootAddress.bytes
		// 0x000F... -> first 2 bytes should be 0x00, 0x0F
		expect(bytes[0]).toBe(0x00)
		expect(bytes[1]).toBe(0x0F)
	})
})

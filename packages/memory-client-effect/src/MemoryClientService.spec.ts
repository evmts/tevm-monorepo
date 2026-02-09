import { Context } from 'effect'
import { describe, expect, it } from 'vitest'
import { MemoryClientService } from './MemoryClientService.js'

describe('MemoryClientService', () => {
	it('should be a Context.Tag', () => {
		expect(MemoryClientService).toBeDefined()
		// Context.Tag should have key property
		expect(typeof MemoryClientService.key).toBe('string')
	})

	it('should have the correct service identifier', () => {
		expect(MemoryClientService.key).toBe('@tevm/memory-client-effect/MemoryClientService')
	})

	it('should be usable with Context.make for creating test implementations', () => {
		const mockShape = {
			ready: {} as any,
			getBlockNumber: {} as any,
			getChainId: {} as any,
			getAccount: () => ({}) as any,
			setAccount: () => ({}) as any,
			getBalance: () => ({}) as any,
			getCode: () => ({}) as any,
			getStorageAt: () => ({}) as any,
			takeSnapshot: () => ({}) as any,
			revertToSnapshot: () => ({}) as any,
			deepCopy: () => ({}) as any,
			dispose: {} as any,
		}

		const context = Context.make(MemoryClientService, mockShape)
		expect(context).toBeDefined()
	})
})

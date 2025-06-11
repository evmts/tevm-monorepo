import { describe, expect, it, vi } from 'vitest'
import { createTevmNode } from './createTevmNode.js'
import type { IntervalMining, GasMining } from './MiningConfig.js'

describe('Mining Config Validation', () => {
	it('should warn and fallback to manual mining when interval mining is used', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
		
		const intervalConfig: IntervalMining = {
			type: 'interval',
			interval: 5000
		}
		
		const node = await createTevmNode({
			miningConfig: intervalConfig
		})
		
		// Should fallback to manual mining
		expect(node.miningConfig.type).toBe('manual')
		
		// Should have warned about unimplemented feature
		expect(warnSpy).toHaveBeenCalledWith(
			expect.stringContaining('Interval mining mode is not yet implemented')
		)
		
		warnSpy.mockRestore()
	})
	
	it('should warn and fallback to manual mining when gas mining is used', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
		
		const gasConfig: GasMining = {
			type: 'gas',
			limit: 15000000n
		}
		
		const node = await createTevmNode({
			miningConfig: gasConfig
		})
		
		// Should fallback to manual mining
		expect(node.miningConfig.type).toBe('manual')
		
		// Should have warned about unimplemented feature
		expect(warnSpy).toHaveBeenCalledWith(
			expect.stringContaining('Gas mining mode is not yet fully implemented')
		)
		
		warnSpy.mockRestore()
	})
	
	it('should allow manual mining without warnings', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
		
		const node = await createTevmNode({
			miningConfig: { type: 'manual' }
		})
		
		expect(node.miningConfig.type).toBe('manual')
		expect(warnSpy).not.toHaveBeenCalled()
		
		warnSpy.mockRestore()
	})
	
	it('should allow auto mining without warnings', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
		
		const node = await createTevmNode({
			miningConfig: { type: 'auto' }
		})
		
		expect(node.miningConfig.type).toBe('auto')
		expect(warnSpy).not.toHaveBeenCalled()
		
		warnSpy.mockRestore()
	})
	
	it('should default to manual mining when no config is provided', async () => {
		const node = await createTevmNode({})
		
		expect(node.miningConfig.type).toBe('manual')
	})
	
	it('should maintain TypeScript compatibility for deprecated types', () => {
		// This test ensures the deprecated types still exist for backward compatibility
		// but are marked as deprecated
		
		const intervalConfig: IntervalMining = {
			type: 'interval',
			interval: 1000
		}
		
		const gasConfig: GasMining = {
			type: 'gas',
			limit: 10000000n
		}
		
		// These should compile but not be used in practice
		expect(intervalConfig.type).toBe('interval')
		expect(gasConfig.type).toBe('gas')
	})
})
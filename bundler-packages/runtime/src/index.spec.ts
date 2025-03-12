import { describe, expect, it } from 'vitest'
import { generateRuntime } from './index.js'
import { runSync } from 'effect/Effect'
import type { ModuleType } from './types.js'

describe('index.js', () => {
	it('should export generateRuntime function', () => {
		expect(typeof generateRuntime).toBe('function')
	})

	it('should re-export the generateRuntime function that works correctly', () => {
		const minimalArtifacts = {
			TestContract: {
				abi: [{ type: 'function', name: 'test', inputs: [], outputs: [], stateMutability: 'nonpayable' }],
				evm: { bytecode: { object: '1234' }, deployedBytecode: { object: '5678' } },
			}
		}

		// Test the re-exported function with each module type
		const moduleTypes: ModuleType[] = ['cjs', 'dts', 'ts', 'mjs']
		
		for (const moduleType of moduleTypes) {
			const result = runSync(generateRuntime(minimalArtifacts, moduleType, true, '@tevm/contract'))
			expect(result).toBeDefined()
			expect(result).toContain('TestContract')
			
			// Verify appropriate elements for each module type
			if (moduleType === 'cjs') {
				expect(result).toContain('module.exports')
			} else if (moduleType === 'ts' || moduleType === 'mjs') {
				expect(result).toContain('export const')
			} else if (moduleType === 'dts') {
				expect(result).toContain('export const TestContract: Contract<')
			}
		}
	})
})

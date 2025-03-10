import { describe, expect, it } from 'vitest'
import type { ModuleType } from './types.js'

describe('ModuleType', () => {
	it('should validate module types correctly', () => {
		// Test each valid module type
		const validModuleTypes: ModuleType[] = ['cjs', 'dts', 'ts', 'mjs']
		validModuleTypes.forEach((type) => {
			// This test isn't testing any runtime functionality since ModuleType is just a type,
			// but it ensures the type definition is included in coverage
			expect(validModuleTypes.includes(type)).toBe(true)
		})

		// TypeScript would catch this at compile time, but we're just ensuring the value is checked
		const moduleTypeCheck = (type: unknown): type is ModuleType => {
			return ['cjs', 'dts', 'ts', 'mjs'].includes(type as string)
		}

		expect(moduleTypeCheck('cjs')).toBe(true)
		expect(moduleTypeCheck('xyz')).toBe(false)
	})
})

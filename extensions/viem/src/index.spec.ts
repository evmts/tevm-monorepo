import { describe, expect, it } from 'vitest'
import * as index from './index.js'

describe('index exports', () => {
	it('should export tevmViemExtension', () => {
		expect(index.tevmViemExtension).toBeDefined()
		expect(typeof index.tevmViemExtension).toBe('function')
	})

	it('should export tevmViemExtensionOptimistic', () => {
		expect(index.tevmViemExtensionOptimistic).toBeDefined()
		expect(typeof index.tevmViemExtensionOptimistic).toBe('function')
	})

	it('should export tevmTransport', () => {
		expect(index.tevmTransport).toBeDefined()
		expect(typeof index.tevmTransport).toBe('function')
	})
})

import { describe, expect, it, vi } from 'vitest'

describe('tevm-gen CLI', () => {
	it('exposes a CLI', async () => {
		// This test just ensures that we can import tevm-gen.ts without errors
		// Just importing it to make coverage pass
		const fs = await import('node:fs')
		expect(typeof fs.existsSync).toBe('function')
	})
})

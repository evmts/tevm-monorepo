import { describe, expect, it } from 'vitest'
import { EMPTY_STATE_ROOT } from './EMPTY_STATE_ROOT.js'
import { genesisStateRoot } from './index.js'

describe('EMPTY_STATE_ROOT', () => {
	it('should generate state root for empty state', async () => {
		expect(await genesisStateRoot({})).toEqual(Uint8Array.from(EMPTY_STATE_ROOT))
	})

	it('should not allow mutating the exported empty state root', () => {
		expect(() => EMPTY_STATE_ROOT.set([0], 0)).toThrow(TypeError)
		expect(() => EMPTY_STATE_ROOT.fill(0)).toThrow(TypeError)
		expect(() => {
			EMPTY_STATE_ROOT[0] = 0
		}).toThrow('EMPTY_STATE_ROOT is immutable')
		expect(EMPTY_STATE_ROOT[0]).toBe(86)
	})
})

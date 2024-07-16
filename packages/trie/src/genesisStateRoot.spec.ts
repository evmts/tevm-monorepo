import { describe, expect, it } from 'vitest'
import { EMPTY_STATE_ROOT } from './EMPTY_STATE_ROOT.js'
import { genesisStateRoot } from './index.js'

describe('EMPTY_STATE_ROOT', () => {
	it('should generate state root for empty state', async () => {
		expect(await genesisStateRoot({})).toEqual(EMPTY_STATE_ROOT)
	})
})

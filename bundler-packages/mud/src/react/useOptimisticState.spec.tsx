// @vitest-environment jsdom
/**
 * TODO: These tests are currently skipped because @latticexyz/store-sync/react
 * imports 'sendCallsSync' from 'viem/actions' which doesn't exist in the current
 * viem version. This is an upstream issue in @latticexyz that needs to be fixed.
 * @see https://github.com/latticexyz/mud/issues
 */
import { describe, it } from 'vitest'

describe.skip('useOptimisticState', () => {
	// Tests temporarily skipped due to @latticexyz/store-sync/react dependency issue
	it('placeholder', () => {})
})

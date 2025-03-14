import type { Hex } from 'viem'
import { expect, test } from 'vitest'
import { zStorageRoot } from './zStorageRoot.js'

test('zStorageRoot', () => {
	const storageRoot = `0x${'69'.repeat(32)}` as const satisfies Hex
	expect(zStorageRoot.parse(storageRoot)).toEqual(storageRoot)
	expect(() => zStorageRoot.parse('wrong')).toThrow()
})

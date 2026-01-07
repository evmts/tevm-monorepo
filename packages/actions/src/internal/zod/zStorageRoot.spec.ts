import type { Hex } from '@tevm/utils'
import { expect, test } from 'vitest'
import type { z } from 'zod'
import { zStorageRoot } from './zStorageRoot.js'

test('zStorageRoot', () => {
	const storageRoot = `0x${'69'.repeat(32)}` as const satisfies z.infer<typeof zStorageRoot> satisfies Hex
	expect(zStorageRoot.parse(storageRoot)).toEqual(storageRoot)
	expect(() => zStorageRoot.parse('wrong')).toThrow()
})

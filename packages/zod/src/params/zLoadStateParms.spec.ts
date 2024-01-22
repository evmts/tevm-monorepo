import { zLoadStateParams } from './zLoadStateParams.js'
import type { LoadStateParams } from '@tevm/actions-types'
import { expect, test } from 'bun:test'
import { stringToHex } from 'viem'
import type { z } from 'zod'

test('zLoadStateParams', () => {
	const AccountStorage = {
		nonce: 0n,
		balance: 100n,
		storageRoot: stringToHex(
			'0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
		),
		codeHash: stringToHex(
			'0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
		),
		storage: {
			'0x0c2d1b9c97b15f8a18e224fe94a8453f996465e14217e0939995ce76fbe01129':
				'0xa0100000000000000' as const,
		},
	}

	const loadStateParams = {
		state: { '0x0420042004200420042004200420042004200420': AccountStorage },
	} as const satisfies z.infer<
		typeof zLoadStateParams
	> satisfies LoadStateParams

	expect(zLoadStateParams.parse(loadStateParams)).toEqual(loadStateParams)
	expect(() => zLoadStateParams.parse('0x4')).toThrow()
})

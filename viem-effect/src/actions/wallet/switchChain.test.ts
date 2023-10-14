import { expect, test } from 'vitest'

import { avalanche, fantom } from '../../chains/index.js'
import { walletClient } from '~test/src/utils.js'

import { switchChain } from './switchChain.js'

test('default', async () => {
	await switchChain(walletClient!, avalanche)
})

test('unsupported chain', async () => {
	await expect(
		switchChain(walletClient!, fantom),
	).rejects.toMatchInlineSnapshot(`
    [UnknownRpcError: An unknown RPC error occurred.

    Details: Unrecognized chain.
    Version: viem@1.0.2]
  `)
})

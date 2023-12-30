import { test } from 'vitest'

import { avalanche } from '../../chains/index.js'
import { walletClient } from '~test/src/utils.js'

import { addChain } from './addChain.js'

test('default', async () => {
	await addChain(walletClient!, { chain: avalanche })
})

test('no block explorer', async () => {
	await addChain(walletClient!, {
		chain: { ...avalanche, blockExplorers: undefined },
	})
})

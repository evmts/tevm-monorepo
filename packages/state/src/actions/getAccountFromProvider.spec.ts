import { createAddress } from '@tevm/address'
import { transports } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { getAccountFromProvider } from './getAccountFromProvider.js'

describe(getAccountFromProvider.name, () => {
	it('should get an account from fork transport', async () => {
		const address = createAddress(`0x42${'0'.repeat(36)}42`)
		const state = createBaseState({ fork: { transport: transports.optimism, blockTag: 123468305n } })
		expect(await getAccountFromProvider(state)(address)).toMatchInlineSnapshot(`
			Account {
			  "_balance": 0n,
			  "_codeHash": Uint8Array [
			    133,
			    81,
			    217,
			    53,
			    244,
			    230,
			    122,
			    211,
			    201,
			    134,
			    9,
			    240,
			    217,
			    240,
			    242,
			    52,
			    116,
			    12,
			    76,
			    69,
			    153,
			    248,
			    38,
			    116,
			    99,
			    59,
			    85,
			    32,
			    67,
			    147,
			    224,
			    127,
			  ],
			  "_codeSize": 0,
			  "_nonce": 1n,
			  "_storageRoot": Uint8Array [
			    92,
			    82,
			    93,
			    239,
			    26,
			    0,
			    79,
			    14,
			    61,
			    31,
			    208,
			    102,
			    64,
			    132,
			    157,
			    76,
			    210,
			    21,
			    180,
			    54,
			    93,
			    3,
			    211,
			    197,
			    227,
			    4,
			    83,
			    13,
			    130,
			    244,
			    159,
			    77,
			  ],
			  "_version": 0,
			}
		`)
	})
})

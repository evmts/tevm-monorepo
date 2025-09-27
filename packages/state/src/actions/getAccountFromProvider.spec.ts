import { createAddress } from '@tevm/address'
import { transports } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { getAccountFromProvider } from './getAccountFromProvider.js'
import { hexToBigInt, type Hex } from '@tevm/utils'

describe(getAccountFromProvider.name, () => {
	it('should get an account from fork transport', async () => {
		const address = createAddress('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
		const latestBlock = (await transports.optimism.request({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_blockNumber',
		})) as Hex | undefined
		if (!latestBlock) {
			throw new Error('Latest block not found')
		}
		const state = createBaseState({ fork: { transport: transports.optimism, blockTag: hexToBigInt(latestBlock) } })
		expect(await getAccountFromProvider(state)(address)).toMatchInlineSnapshot(`
			Account {
			  "_balance": 179839672557435718n,
			  "_codeHash": Uint8Array [
			    197,
			    210,
			    70,
			    1,
			    134,
			    247,
			    35,
			    60,
			    146,
			    126,
			    125,
			    178,
			    220,
			    199,
			    3,
			    192,
			    229,
			    0,
			    182,
			    83,
			    202,
			    130,
			    39,
			    59,
			    123,
			    250,
			    216,
			    4,
			    93,
			    133,
			    164,
			    112,
			  ],
			  "_codeSize": 0,
			  "_nonce": 31n,
			  "_storageRoot": Uint8Array [
			    86,
			    232,
			    31,
			    23,
			    27,
			    204,
			    85,
			    166,
			    255,
			    131,
			    69,
			    230,
			    146,
			    192,
			    248,
			    110,
			    91,
			    72,
			    224,
			    27,
			    153,
			    108,
			    173,
			    192,
			    1,
			    98,
			    47,
			    181,
			    227,
			    99,
			    180,
			    33,
			  ],
			  "_version": 0,
			}
		`)
	})
})

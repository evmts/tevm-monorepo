import { z } from 'zod'
import { zBaseParams } from '../BaseCall/zBaseParams.js'
import { zHex } from '../internal/zod/zHex.js'
/**
 * Zod validator for a valid load state action
 */
const AccountStorage = zBaseParams.extend({
	nonce: zHex.describe('The nonce of the account'),
	balance: zHex.describe('The balance of the account'),
	storageRoot: zHex.describe('The storage root of the account'),
	codeHash: zHex.describe('The code hash of the account'),
	storage: z.optional(z.record(zHex, zHex)).describe('The storage of the account'),
})

export const zLoadStateParams = z
	.object({ state: z.record(zHex, AccountStorage) })
	.describe('Properties shared across the load state')

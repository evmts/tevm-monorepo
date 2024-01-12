import { zHex } from '../common/index.js'
import { z } from 'zod'
/**
 * Zod validator for a valid load state action
 */

const AccountStorage = z.object({
	nonce: z.bigint(),
	balance: z.bigint(),
	storageRoot: z.instanceof(Uint8Array),
	codeHash: z.instanceof(Uint8Array),
	storage: z.optional(z.record(zHex)),
})

export const zLoadStateParams = z.object({ state: z.record(AccountStorage) })

.describe('Properties shared across the load state')

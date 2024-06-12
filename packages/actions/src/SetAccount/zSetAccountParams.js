import { z } from 'zod'
import { zBaseParams } from '../BaseCall/zBaseParams.js'
import { zAddress } from '../internal/zod/zAddress.js'
import { zBytecode } from '../internal/zod/zBytecode.js'
import { zHex } from '../internal/zod/zHex.js'
import { zStorageRoot } from '../internal/zod/zStorageRoot.js'

/**
 * Zod validator for a valid setAccount action
 */
export const zSetAccountParams = zBaseParams
	.extend({
		address: zAddress.describe('The ethereum address of the account'),
		balance: z.bigint().nonnegative().optional().describe('The balance to give the account'),
		nonce: z.bigint().nonnegative().optional().describe('The nonce to give the account'),
		deployedBytecode: zBytecode
			.optional()
			.describe('The contract bytecode to set at the account address as a >0 byte hex string'),
		storageRoot: zStorageRoot
			.optional()
			.describe('The storage root to set at the account address as a 32 byte hex strign'),
		state: z.record(zHex, zHex).optional().describe('Overrides entire state with provided state'),
		stateDiff: z.record(zHex, zHex).optional().describe('Patches the state with the provided state'),
	})
	.refine(
		(data) => {
			if (data.state && data.stateDiff) {
				return false
			}
			return true
		},
		{ message: 'Cannot have both state and stateDiff' },
	)
	.describe('Params to create an account or contract')

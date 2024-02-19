import { zAddress, zBytecode, zStorageRoot } from '../common/index.js'
import { zBaseParams } from './zBaseParams.js'
import { z } from 'zod'

/**
 * Zod validator for a valid setAccount action
 */
export const zSetAccountParams = zBaseParams
	.extend({
		address: zAddress.describe('The ethereum address of the account'),
		balance: z
			.bigint()
			.nonnegative()
			.optional()
			.describe('The balance to give the account'),
		nonce: z
			.bigint()
			.nonnegative()
			.optional()
			.describe('The nonce to give the account'),
		deployedBytecode: zBytecode
			.optional()
			.describe(
				'The contract bytecode to set at the account address as a >0 byte hex string',
			),
		storageRoot: zStorageRoot
			.optional()
			.describe(
				'The storage root to set at the account address as a 32 byte hex strign',
			),
	})
	.describe('Params to create an account or contract')

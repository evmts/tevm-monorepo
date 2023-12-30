import { DEFAULT_BALANCE } from '../constants/index.js'
import { Address as ZAddress } from 'abitype/zod'
import { z } from 'zod'

export const PutAccountActionValidator = z.object({
	account: ZAddress.describe('The account to give eth to'),
	balance: z
		.bigint()
		.optional()
		.default(DEFAULT_BALANCE)
		.describe('The balance to give the account'),
})

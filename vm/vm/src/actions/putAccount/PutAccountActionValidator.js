import { Address as ZAddress } from 'abitype/zod'
import { z } from 'zod'
import { DEFAULT_BALANCE } from './DEFAULT_BALANCE.js'

export const PutAccountActionValidator = z.object({
	account: ZAddress.describe('The account to give eth to'),
	balance: z
		.bigint()
		.optional()
		.default(DEFAULT_BALANCE)
		.describe('The balance to give the account'),
})

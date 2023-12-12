import { Address as ZAddress } from 'abitype/zod'
import { z } from 'zod'
import { ZHex } from '../../utils/ZHex.js'

export const CallActionValidator = z.object({
	to: ZAddress.describe('the address to send call to'),
	caller: ZAddress.describe('the address of the caller'),
	origin: ZAddress.optional().describe('the address of the origin'),
	gasLimit: z.bigint().optional().describe('the gas limit'),
	data: ZHex.describe('the data to send'),
	value: z.bigint().optional().describe('the eth value to send in wei'),
})

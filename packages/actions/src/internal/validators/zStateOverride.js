/**
 * @module zStateOverride
 * Zod schema for state override objects
 */

import { z } from 'zod'
import { zAddress } from '../zod/zAddress.js'
import { zHex } from '../zod/zHex.js'

/**
 * Zod schema for state overrides
 * @type {import('zod').ZodSchema<import('../../../types/StateOverride.js').StateOverride>}
 */
export const zStateOverride = z.object({
  address: zAddress,
  balance: z.bigint().optional(),
  nonce: z.number().optional(),
  code: zHex.optional(),
  storage: z.record(zHex, zHex).optional(),
})
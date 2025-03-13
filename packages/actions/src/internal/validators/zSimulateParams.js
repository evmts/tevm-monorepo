/**
 * @module zSimulateParams
 * Zod schema for simulate RPC method parameters
 */

import { z } from 'zod'
import { zAddress } from '../zod/zAddress.js'
import { zBlockTag } from '../zod/zBlockTag.js'
import { zHex } from '../zod/zHex.js'
import { zSimulateCallItem } from './zSimulateCallItem.js'
import { zStateOverride } from './zStateOverride.js'

/**
 * Zod schema for block overrides in simulateCalls requests
 * @type {import('zod').ZodSchema<import('../../../types/BlockOverride.js').BlockOverride>}
 */
export const zBlockOverride = z.object({
  baseFeePerGas: z.bigint().optional(),
  timestamp: z.bigint().optional(),
  number: z.bigint().optional(),
  difficulty: z.bigint().optional(),
  gasLimit: z.bigint().optional(),
  coinbase: zAddress.optional(),
})

/**
 * Zod schema for simulateCalls parameters
 * @type {import('zod').ZodSchema<import('../../../types/SimulateParams.js').SimulateParams>}
 */
export const zSimulateParams = z.object({
  account: zAddress.optional(),
  calls: z.array(zSimulateCallItem),
  blockNumber: zBlockTag.optional(),
  stateOverrides: z.array(zStateOverride).optional(),
  blockOverrides: zBlockOverride.optional(),
  traceAssetChanges: z.boolean().optional(),
})
  .refine(
    (data) => {
      // If traceAssetChanges is true, account is required
      if (data.traceAssetChanges && !data.account) {
        return false
      }
      return true
    },
    {
      message: '`account` is required when `traceAssetChanges` is true',
      path: ['account'],
    },
  )
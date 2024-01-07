import type { Address } from 'abitype'
import type { Hex } from 'viem'

/**
 * Generic log information
 */
export type Log = { address: Address; topics: Hex[]; data: Hex }

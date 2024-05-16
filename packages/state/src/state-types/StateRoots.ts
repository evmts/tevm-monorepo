import type { Hex } from '@tevm/utils'
import type { TevmState } from './TevmState.js'

/**
 * Mapping of state roots as hex string to the state
 */
export type StateRoots = Map<Hex, TevmState>

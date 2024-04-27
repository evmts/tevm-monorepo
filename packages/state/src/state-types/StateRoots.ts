import type { TevmState } from './TevmState.js'

/**
 * Mapping of state roots as bytes to the state
 */
export type StateRoots = Map<Uint8Array, TevmState>

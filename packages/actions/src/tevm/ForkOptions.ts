import type { ForkParams } from "@tevm/actions-types"

/**
 * Register function takes ForkParams and returns an id forkId
 */
export type RegisterFunction = (params: ForkParams) => Promise<bigint>

export type ForkOptions = {
  register: RegisterFunction
}

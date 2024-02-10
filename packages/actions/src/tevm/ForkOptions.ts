import type { ForkParams } from '@tevm/actions-types'

/**
 * @experimental This is an unimplemented experimental feature
 * Register function takes ForkParams and returns an id forkId
 */
export type RegisterFunction = (params: ForkParams) => Promise<bigint>

/**
 * @experimental
 */
export type ForkOptions = {
	register: RegisterFunction
}

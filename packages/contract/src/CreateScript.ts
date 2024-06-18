import type { Address, Hex } from '@tevm/utils'
import type { Contract } from './Contract.js'
import type { DeployArgs } from './DeployArgs.js'

/**
 * Creates a deployless instance of a contract
 * Can be used to execute code that isn't deployed in tevm
 * or [viem](https://viem.sh/docs/actions/public/call#deployless-calls)
 */
export type CreateScript<
	TName extends string,
	THumanReadableAbi extends string[] | readonly string[],
	TAddress extends Address | undefined = undefined,
	TBytecode extends Hex | undefined = undefined,
> = (...args: DeployArgs<THumanReadableAbi, TBytecode>) => Contract<TName, THumanReadableAbi, TAddress, Hex, Hex, Hex>

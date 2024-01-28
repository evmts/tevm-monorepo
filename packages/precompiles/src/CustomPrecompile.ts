/**
 * TODO This should be publically exported from ethereumjs but isn't
 * Typing this by hand is tedious so we are using some typescript inference to get it
 * do a pr to export this from ethereumjs and then replace this with an import
 * TODO this should be modified to take a hex address rather than an ethjs address to be consistent with rest of Tevm
 */

import type { ConstructorArgument } from './ConstructorArgument.js'

/**
 * Custom precompiles allow you to run arbitrary JavaScript code in the EVM
 */
export type CustomPrecompile = Exclude<
	Exclude<
		ConstructorArgument<typeof import('@ethereumjs/evm').EVM>,
		undefined
	>['customPrecompiles'],
	undefined
>[number]

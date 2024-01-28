import type { AnvilReturnType } from './AnvilReturnType.js'
import type { DebugReturnType } from './DebugReturnType.js'
import type { EthReturnType } from './EthReturnType.js'
import type { TevmReturnType } from './TevmReturnType.js'

/**
 * Utility type to get the return type given a method name
 * @example
 * ```typescript
 * type BlockNumberReturnType = JsonRpcReturnTypeFromMethod<'eth_blockNumber'>
 * ```
 */
export type JsonRpcReturnTypeFromMethod<
	TMethod extends
		| keyof EthReturnType
		| keyof TevmReturnType
		| keyof AnvilReturnType
		| keyof DebugReturnType,
> = (EthReturnType &
	TevmReturnType &
	AnvilReturnType &
	DebugReturnType)[TMethod]

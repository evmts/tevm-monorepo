import type { AnvilRequestType } from './AnvilRequestType.js'
import type { DebugRequestType } from './DebugRequestType.js'
import type { EthRequestType } from './EthRequestType.js'
import type { TevmRequestType } from './TevmRequestType.js'

/**
 * Utility type to get the request type given a method name
 * @example
 * ```typescript
 * type BlockNumberRequestType = JsonRpcRequestTypeFromMethod<'eth_blockNumber'>
 * ```
 */
export type JsonRpcRequestTypeFromMethod<
	TMethod extends
		| keyof EthRequestType
		| keyof TevmRequestType
		| keyof AnvilRequestType
		| keyof DebugRequestType,
> = (EthRequestType &
	TevmRequestType &
	AnvilRequestType &
	DebugRequestType)[TMethod]

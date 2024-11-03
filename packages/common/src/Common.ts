import { type Common as EthjsCommon } from '@ethereumjs/common'
import { type Prettify, type Chain as ViemChain } from 'viem/chains'

/**
 * Common is the main representation of chain specific configuration for tevm clients.
 *
 * Tevm specific chain configuration wrapping viem chain and ethereumjs commmon
 * Common contains the common configuration set between all chains such as fee information, hardfork information, eip information, predeployed contracts, default block explorers and more.
 * extends ethereumjs Common class with the Viem Chain type
 * @example
 * ```typescript
 * import { optimism, Common } from 'tevm/common'
 * import { createMemoryClient } from 'tevm'}
 *
 * const createClient = (common: Common) => {
 *   const client = createMemoryClient({
 *     common,
 *   })
 *   return client
 * }
 *
 * const client = createClient(optimism)
 * ```
 * @see [createCommon](https://tevm.sh/reference/tevm/common/functions/createcommon/)
 * @see [Tevm client docs](https://tevm.sh/learn/clients/)
 */
export type Common = Prettify<ViemChain & { vmConfig: EthjsCommon; copy: () => Common }>

import type { EVMOpts as EthereumjsEVMOpts } from '@ethereumjs/evm'

/**
 * The options available to pass to the EVM. Inferred from ethereumjs/evm
 * @see https://github.com/ethereumjs/ethereumjs-monorepo/pull/3334
 * @example
 * ```typescript
 * import { type Evm, createEvm, CreateEvmOptions } from 'tevm/evm'
 * import { mainnet } from 'tevm/common'
 * import { createStateManager } from 'tevm/state'
 * import { createBlockchain } from 'tevm/blockchain'}
 * import { EthjsAddress } from 'tevm/utils'
 *
 * const evm: Evm = createEvm({
 *   common: mainnet.copy(),
 *   stateManager: createStateManager(),
 *   blockchain: createBlockchain(),
 * })
 * ```
 */
export type EVMOpts = EthereumjsEVMOpts

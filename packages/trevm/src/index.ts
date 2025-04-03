import { createTrevm as createNativeTrevm } from '@tevm/trevm-native';

export type { TrevmEvmOptions, TrevmRunCallOptions, TrevmRunCallResult, TrevmEvm } from '@tevm/trevm-native';

/**
 * Creates a Trevm-based EVM instance that matches the tevm/evm API.
 * This serves as a drop-in replacement for createEvm.
 *
 * @example
 * ```typescript
 * import { createTrevm } from '@tevm/trevm'
 * import { mainnet } from '@tevm/common'
 * import { createBlockchain } from '@tevm/blockchain'
 * import { createStateManager } from '@tevm/state-manager'
 * import { EthjsAddress } from '@tevm/utils'
 *
 * const common = mainnet.clone()
 * const stateManager = createStateManager({ common })
 * const blockchain = createBlockchain({ common })
 * const evm = await createTrevm({ common, stateManager, blockchain})
 *
 * const runCallResult = await evm.runCall({
 *   to: EthjsAddress.from(`0x${'00'.repeat(20)}`),
 *   value: 420n,
 *   skipBalance: true,
 * })
 * console.log(runCallResult)
 * ````
 */
export const createTrevm = createNativeTrevm;
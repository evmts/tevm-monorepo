import type { ViemTevmOptimisticClientDecorator } from './ViemTevmOptimisticClientDecorator.js'

/**
 * @deprecated in favor of the viem transport
 * @experimental
 * Decorates a viem [public client](https://viem.sh/) with the [tevm api](https://tevm.sh/generated/tevm/api/type-aliases/tevm/)
 * @example
 * ```js
 * import { createClient, parseEth } from 'viem'
 * import { tevmViemExtension } from '@tevm/viem-extension'
 *
 * const client = createClient('https://mainnet.optimism.io')
 *   .extend(tevmViemExtension())
 *
 * await client.tevm.account({
 *   address: `0x${'12'.repeat(20)}`,
 *   balance: parseEth('420'),
 * })
 * ```
 * @see [@tevm/server](https://tevm.sh/generated/tevm/server/functions/createserver) for documentation on creating a tevm backend
 */
export type ViemTevmOptimisticExtension =
	() => ViemTevmOptimisticClientDecorator

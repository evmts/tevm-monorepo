// this file is adapted from viem
// see it here https://github.com/wevm/viem/blob/main/src/types/eip1193.ts
// Copied from viem commit a098c98231d47ccac9bda1a944880b034020a1b5
// We copy it here for easier developer experience internally and also
// to lock in these types independent of viem potentially making changes
import type { WalletPermissionCaveat } from './WalletPermissionCaveat.js'

/**
 * Permission granted to a website or application by a wallet.
 * Defined in EIP-2255 for the wallet permissions management system.
 * @example
 * ```typescript
 * import { WalletPermission } from '@tevm/decorators'
 * import { createTevmNode } from 'tevm'
 * import { requestEip1193 } from '@tevm/decorators'
 *
 * const node = createTevmNode().extend(requestEip1193())
 *
 * // Request and display current wallet permissions
 * const permissions = await node.request({
 *   method: 'wallet_getPermissions'
 * })
 *
 * const accountsPermission: WalletPermission = {
 *   id: 'ZcbZ7h80QuyOfK1im9OHbw',
 *   parentCapability: 'eth_accounts',
 *   invoker: 'https://example.com',
 *   date: 1720872662291,
 *   caveats: [{
 *     type: 'restrictReturnedAccounts',
 *     value: ['0x1234567890123456789012345678901234567890']
 *   }]
 * }
 * ```
 */
export type WalletPermission = {
	caveats: WalletPermissionCaveat[]
	date: number
	id: string
	invoker: `http://${string}` | `https://${string}`
	parentCapability: 'eth_accounts' | string
}

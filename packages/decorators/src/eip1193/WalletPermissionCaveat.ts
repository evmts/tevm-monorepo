// this file is adapted from viem
// see it here https://github.com/wevm/viem/blob/main/src/types/eip1193.ts
// Copied from viem commit a098c98231d47ccac9bda1a944880b034020a1b5
// We copy it here for easier developer experience internally and also
// to lock in these types independent of viem potentially making changes

/**
 * Restrictions or conditions applied to a wallet permission.
 * Used in the EIP-2255 wallet permissions system to add constraints to granted permissions.
 * @example
 * ```typescript
 * import { WalletPermissionCaveat } from '@tevm/decorators'
 *
 * const addressCaveat: WalletPermissionCaveat = {
 *   type: 'restrictReturnedAccounts',
 *   value: ['0x1234567890123456789012345678901234567890']
 * }
 * 
 * const expirationCaveat: WalletPermissionCaveat = {
 *   type: 'expiresOn', 
 *   value: 1720872662291 // Unix timestamp in milliseconds
 * }
 * ```
 */
export type WalletPermissionCaveat = {
	type: string
	value: any
}

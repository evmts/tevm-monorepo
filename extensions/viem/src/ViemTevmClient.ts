import type { TevmClient } from '@tevm/client-types'

/**
 * @deprecated in favor of the viem transport
 * The decorated properties added by the `tevmViemExtension`
 */
export type ViemTevmClient = {
	tevm: TevmClient
}

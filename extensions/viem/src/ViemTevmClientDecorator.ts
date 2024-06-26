import type { ViemTevmClient } from './ViemTevmClient.js'

/**
 * @deprecated in favor of the viem transport
 * A viem decorator for `tevmViemExtension`
 */
export type ViemTevmClientDecorator = (client: any) => ViemTevmClient

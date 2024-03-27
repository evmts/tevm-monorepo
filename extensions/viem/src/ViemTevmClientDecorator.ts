import type { ViemTevmClient } from './ViemTevmClient.js'

/**
 * A viem decorator for `tevmViemExtension`
 */
export type ViemTevmClientDecorator = (
	client: Pick<import('viem').Client, 'request'>,
) => ViemTevmClient

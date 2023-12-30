import type { ViemTevmClient } from './ViemTevmClient.js'

export type ViemTevmClientDecorator = (
	client: Pick<import('viem').Client, 'request'>,
) => ViemTevmClient


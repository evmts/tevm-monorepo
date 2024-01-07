import type { TevmClient } from '@tevm/api'

export type ViemTevmClient = {
	tevm: Omit<TevmClient, 'request'>
}

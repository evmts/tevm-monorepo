import type { Tevm } from '@tevm/api'

export type ViemTevmClient = {
	tevm: Omit<Tevm, 'request'>
}

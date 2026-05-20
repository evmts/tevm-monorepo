import type { ConsensusService } from './ConsensusService.js'

export const createNoopConsensusService = (): ConsensusService => ({
	mode: 'noop',
	verifyRead: async () => true,
})

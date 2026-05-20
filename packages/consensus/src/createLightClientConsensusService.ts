import type { ConsensusService, LightSyncStatus } from './ConsensusService.js'

export type LightClientConsensusOptions = {
	readonly verifyRead: NonNullable<ConsensusService['verifyRead']>
	readonly getChainId?: ConsensusService['getChainId']
	readonly getBlockNumber?: ConsensusService['getBlockNumber']
	readonly resolveStateRoot?: ConsensusService['resolveStateRoot']
	readonly getProof?: ConsensusService['getProof']
	readonly initialLightSyncStatus?: NonNullable<ConsensusService['getLightSyncStatus']> extends () => infer T
		? T
		: never
}

export const createLightClientConsensusService = (options: LightClientConsensusOptions): ConsensusService => {
	let lightSyncStatus: LightSyncStatus = {
		ready: false,
		status: 'idle',
		network: 'unknown',
		checkpointSource: 'none',
		lastCheckpoint: null,
		optimisticSlot: 0n,
		safeSlot: 0n,
		finalizedSlot: 0n,
		...options.initialLightSyncStatus,
	}

	const normalize = (status: LightSyncStatus): LightSyncStatus => {
		const optimisticSlot = status.optimisticSlot
		const safeSlot = status.safeSlot > optimisticSlot ? optimisticSlot : status.safeSlot
		const finalizedSlot = status.finalizedSlot > safeSlot ? safeSlot : status.finalizedSlot
		return { ...status, optimisticSlot, safeSlot, finalizedSlot }
	}
	lightSyncStatus = normalize(lightSyncStatus)
	const getLightSyncStatus = () => normalize({ ...lightSyncStatus })
	const updateLightSyncStatus = (next: Partial<LightSyncStatus>) => {
		lightSyncStatus = normalize({ ...lightSyncStatus, ...next })
		return getLightSyncStatus()
	}
	return {
		mode: 'light-client',
		verifyRead: options.verifyRead,
		getLightSyncStatus,
		updateLightSyncStatus,
		isReady: () => getLightSyncStatus().ready,
		...(options.getChainId ? { getChainId: options.getChainId } : {}),
		...(options.getBlockNumber ? { getBlockNumber: options.getBlockNumber } : {}),
		...(options.resolveStateRoot ? { resolveStateRoot: options.resolveStateRoot } : {}),
		...(options.getProof ? { getProof: options.getProof } : {}),
	}
}

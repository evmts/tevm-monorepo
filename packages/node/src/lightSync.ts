import { existsSync, readFileSync } from 'node:fs'

export type LightSyncNetwork = 'mainnet' | 'sepolia' | 'holesky' | 'unknown'
export type CheckpointSource = 'explicit' | 'persisted' | 'default' | 'none'
export type LightSyncLifecycleStatus = 'idle' | 'starting' | 'syncing' | 'ready' | 'error'

export type LightSyncStatus = {
	ready: boolean
	status: LightSyncLifecycleStatus
	network: LightSyncNetwork
	checkpointSource: CheckpointSource
	lastCheckpoint: string | null
	optimisticSlot: bigint
	safeSlot: bigint
	finalizedSlot: bigint
}

export const chainIdToLightSyncNetwork = (chainId: number): LightSyncNetwork => {
	if (chainId === 1) return 'mainnet'
	if (chainId === 11155111) return 'sepolia'
	if (chainId === 17000) return 'holesky'
	return 'unknown'
}

export const normalizeSlots = (status: LightSyncStatus): LightSyncStatus => {
	const optimisticSlot = status.optimisticSlot
	const safeSlot = status.safeSlot > optimisticSlot ? optimisticSlot : status.safeSlot
	const finalizedSlot = status.finalizedSlot > safeSlot ? safeSlot : status.finalizedSlot
	return { ...status, optimisticSlot, safeSlot, finalizedSlot }
}

export const selectStartupCheckpoint = (opts: {
	explicitCheckpoint?: string
	persistedCheckpointPath?: string
	defaultCheckpoint?: string
	strictCheckpointAge?: boolean
	maxCheckpointAgeMs?: number
	nowMs?: number
	fsOps?: { existsSync: (path: string) => boolean; readFileSync: (path: string, encoding: 'utf8') => string }
}): { checkpointSource: CheckpointSource; checkpoint: string | null } => {
	const nowMs = opts.nowMs ?? Date.now()
	const strict = opts.strictCheckpointAge ?? false
	const maxAge = opts.maxCheckpointAgeMs ?? 1000 * 60 * 60 * 24 * 3
	const fsOps = opts.fsOps ?? { existsSync, readFileSync }
	if (opts.explicitCheckpoint) return { checkpointSource: 'explicit', checkpoint: opts.explicitCheckpoint }
	if (opts.persistedCheckpointPath) {
		if (!fsOps.existsSync(opts.persistedCheckpointPath)) {
			if (strict) return { checkpointSource: 'none', checkpoint: null }
		} else {
			try {
				const raw = fsOps.readFileSync(opts.persistedCheckpointPath, 'utf8')
				const parsed = JSON.parse(raw)
				if (typeof parsed?.checkpoint === 'string') {
					const updatedAt = Number(parsed?.updatedAtMs ?? 0)
					const isStale = updatedAt > 0 && nowMs - updatedAt > maxAge
					if (!isStale) return { checkpointSource: 'persisted', checkpoint: parsed.checkpoint }
					if (strict) return { checkpointSource: 'none', checkpoint: null }
				} else if (strict) {
					return { checkpointSource: 'none', checkpoint: null }
				}
			} catch {
				if (strict) return { checkpointSource: 'none', checkpoint: null }
			}
		}
	}
	if (opts.defaultCheckpoint) return { checkpointSource: 'default', checkpoint: opts.defaultCheckpoint }
	return { checkpointSource: 'none', checkpoint: null }
}

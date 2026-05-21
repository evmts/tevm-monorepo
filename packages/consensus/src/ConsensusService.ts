export type ConsensusMode = 'noop' | 'light-client'

export type LightReadSelector = 'latest' | 'safe' | 'finalized' | bigint
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

export type ConsensusService = {
	readonly mode: ConsensusMode
	readonly getLightSyncStatus?: () => Readonly<LightSyncStatus>
	readonly updateLightSyncStatus?: (next: Partial<LightSyncStatus>) => Readonly<LightSyncStatus>
	readonly isReady?: () => boolean
	readonly getChainId?: () => Promise<bigint>
	readonly getBlockNumber?: () => Promise<bigint>
	readonly resolveStateRoot?: (selector: LightReadSelector) => Promise<`0x${string}` | undefined>
	readonly getProof?: (params: {
		readonly address: `0x${string}`
		readonly storageKeys: readonly `0x${string}`[]
		readonly selector: LightReadSelector
	}) => Promise<{
		readonly balance: `0x${string}`
		readonly nonce: `0x${string}`
		readonly codeHash: `0x${string}`
		readonly storageHash: `0x${string}`
		readonly storageProof: readonly { readonly key: `0x${string}`; readonly value: `0x${string}` }[]
		readonly code?: `0x${string}`
	}>
	readonly verifyRead?: (params: {
		readonly blockHash?: `0x${string}`
		readonly account?: `0x${string}`
		readonly stateRoot?: `0x${string}`
		readonly selector?: 'latest' | 'safe' | 'finalized' | `0x${string}`
		readonly proof?: unknown
	}) => Promise<boolean>
}

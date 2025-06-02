import { type Stash, getRecord, registerTable, setRecord } from '@latticexyz/stash/internal'
import { type SyncAdapter, SyncStep, createStoreSync } from '@latticexyz/store-sync'
import { SyncProgress } from '@latticexyz/store-sync/internal'
import type { Hex } from 'viem'
import { stateUpdateCoordinator } from '../stateUpdateCoordinator.js'
import { applyStashUpdates, notifyStashSubscribers } from './applyUpdates.js'
import { createStorageAdapter } from './createStorageAdapter.js'

export type CreateSyncAdapterOptions = {
	stash: Stash
	onTx?: ((tx: { hash: Hex | undefined }) => Promise<void>) | undefined
}

export function createSyncAdapter({ stash, onTx }: CreateSyncAdapterOptions): SyncAdapter {
	return (opts) => {
		// TODO: clear stash?

		registerTable({ stash, table: SyncProgress })

		const storageAdapter = createStorageAdapter({ stash })

		return createStoreSync({
			...opts,
			storageAdapter: async (block) => {
				return new Promise<void>((resolve) => {
					stateUpdateCoordinator.queueCanonicalUpdate(async () => {
						const updates = await storageAdapter(block)
						if (onTx)
							await Promise.all(
								block.logs.map(({ transactionHash }) =>
									transactionHash ? onTx({ hash: transactionHash }) : Promise.resolve(),
								),
							)
						applyStashUpdates({ stash, updates })
						notifyStashSubscribers({ stash, updates })
						resolve()
					})
				})
			},
			onProgress: (nextValue) => {
				const currentValue = getRecord({ stash, table: SyncProgress, key: {} })
				// update sync progress until we're caught up and live
				if (currentValue?.step !== SyncStep.LIVE) {
					setRecord({ stash, table: SyncProgress, key: {}, value: nextValue })
				}
			},
		})
	}
}

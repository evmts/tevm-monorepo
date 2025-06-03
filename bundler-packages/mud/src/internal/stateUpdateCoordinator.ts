type QueuedUpdate = { type: 'optimistic'; fn: () => Promise<void> } | { type: 'canonical'; fn: () => Promise<void> }

/**
 * Coordinates state updates to prevent race conditions between optimistic and canonical updates.
 *
 * Race condition: when canonical sync removes optimistic txs from the pool (in createSyncAdapter:storageAdapter:onTx) but before applying
 * the canonical state to stash (in createSyncAdapter:storageAdapter:applyStashUpdates), a pending optimistic update could run and see empty pool +
 * old canonical state, causing UI to briefly flash to incorrect intermediate state.
 *
 * Solution: queue all updates and let canonical updates clear pending optimistic ones since
 * canonical updates naturally trigger fresh optimistic calculations via stash subscribers.
 */
class StateUpdateCoordinator {
	private isRunning = false
	private queue: QueuedUpdate[] = []

	queueOptimisticUpdate(fn: () => Promise<void>): void {
		this.enqueue({ type: 'optimistic', fn })
	}

	queueCanonicalUpdate(fn: () => Promise<void>): void {
		this.enqueue({ type: 'canonical', fn })
	}

	private enqueue(update: QueuedUpdate): void {
		// If queueing canonical update, clear pending optimistic updates
		// since canonical will trigger fresh optimistic updates anyway
		if (update.type === 'canonical') {
			this.queue = this.queue.filter((op) => op.type !== 'optimistic')
		}

		this.queue.push(update)
		this.processQueue()
	}

	private async processQueue(): Promise<void> {
		if (this.isRunning || this.queue.length === 0) return

		this.isRunning = true

		try {
			while (this.queue.length > 0) {
				const update = this.queue.shift()!
				await update.fn()
			}
		} finally {
			this.isRunning = false
		}
	}
}

export const stateUpdateCoordinator = new StateUpdateCoordinator()

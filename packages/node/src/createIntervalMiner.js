import { mineHandler } from '@tevm/actions'

/**
 * Creates an interval miner that prevents time drift by scheduling the next timeout before execution
 * @param {import('./TevmNode.js').TevmNode} client - The TEVM node client
 * @returns {{ start: () => void, stop: () => void, isRunning: () => boolean }}
 * @example
 * ```javascript
 * import { createTevmNode } from '@tevm/node'
 * 
 * const node = createTevmNode({ 
 *   miningConfig: { type: 'interval', blockTime: 5 }
 * })
 * 
 * const miner = createIntervalMiner(node)
 * miner.start() // Start interval mining
 * 
 * // Later...
 * miner.stop() // Clean shutdown
 * ```
 */
export const createIntervalMiner = (client) => {
	/**
	 * @type {NodeJS.Timeout | null}
	 */
	let timeoutId = null
	
	/**
	 * @type {Promise<void> | null}
	 */
	let currentMiningPromise = null
	
	/**
	 * @type {boolean}
	 */
	let shouldStop = false
	
	/**
	 * @type {number | null}
	 */
	let nextMiningTime = null

	/**
	 * Schedules the next mining operation to prevent time drift
	 * @param {number} intervalMs - Interval in milliseconds
	 */
	const scheduleNext = (intervalMs) => {
		if (shouldStop) return

		const now = Date.now()
		
		// Calculate the next mining time based on absolute intervals to prevent drift
		if (nextMiningTime === null) {
			// First run - mine immediately and set the baseline
			nextMiningTime = now + intervalMs
		} else {
			// Subsequent runs - maintain absolute timing
			nextMiningTime += intervalMs
			
			// If we've fallen behind, catch up by mining immediately
			// but maintain the absolute timeline for future operations
			while (nextMiningTime <= now) {
				nextMiningTime += intervalMs
			}
		}
		
		const delay = nextMiningTime - now
		
		client.logger.debug(
			{ delay, nextMiningTime, intervalMs }, 
			'Scheduling next interval mining operation'
		)
		
		timeoutId = setTimeout(() => {
			mine(intervalMs)
		}, delay)
	}

	/**
	 * Performs the mining operation
	 * @param {number} intervalMs - Interval in milliseconds  
	 */
	const mine = async (intervalMs) => {
		if (shouldStop) return

		// Schedule the NEXT operation BEFORE executing the current one
		// This prevents time drift by ensuring consistent intervals
		scheduleNext(intervalMs)

		// Wait for any current mining operation to complete to prevent race conditions
		if (currentMiningPromise) {
			try {
				await currentMiningPromise
			} catch (error) {
				client.logger.error(
					{ error: error.message }, 
					'Previous mining operation failed, continuing with next operation'
				)
			}
		}

		// Execute the current mining operation
		currentMiningPromise = (async () => {
			try {
				client.logger.debug('Starting interval mining operation')
				
				const result = await mineHandler(client)({
					throwOnFail: false,
					blockCount: 1,
				})

				if (result.errors?.length) {
					client.logger.error(
						{ errors: result.errors.map(e => e.message) },
						'Interval mining operation encountered errors'
					)
				} else {
					client.logger.debug(
						{ blockHashes: result.blockHashes },
						'Interval mining operation completed successfully'
					)
				}
			} catch (error) {
				client.logger.error(
					{ error: error.message },
					'Interval mining operation failed'
				)
			}
		})()
	}

	return {
		/**
		 * Starts interval mining if the client is configured for it
		 */
		start() {
			if (client.miningConfig.type !== 'interval') {
				client.logger.debug('Mining config is not interval type, not starting interval miner')
				return
			}

			if (client.miningConfig.blockTime <= 0) {
				client.logger.debug('Interval mining blockTime is 0 or negative, not starting interval miner')
				return
			}

			if (timeoutId !== null) {
				client.logger.debug('Interval miner already running')
				return
			}

			shouldStop = false
			nextMiningTime = null // Reset timeline
			const intervalMs = client.miningConfig.blockTime * 1000

			client.logger.debug(
				{ intervalMs, blockTime: client.miningConfig.blockTime },
				'Starting interval mining'
			)

			// Start the first mining operation immediately
			scheduleNext(0) // 0 delay for immediate first run
		},

		/**
		 * Stops interval mining with clean shutdown
		 */
		stop() {
			if (timeoutId === null && currentMiningPromise === null) {
				return
			}

			client.logger.debug('Stopping interval mining')
			shouldStop = true

			if (timeoutId !== null) {
				clearTimeout(timeoutId)
				timeoutId = null
			}

			// Don't wait for current mining operation to complete
			// Just mark that we should stop scheduling new ones
			currentMiningPromise = null
			nextMiningTime = null
		},

		/**
		 * Returns whether interval mining is currently running
		 * @returns {boolean}
		 */
		isRunning() {
			return timeoutId !== null || currentMiningPromise !== null
		}
	}
}
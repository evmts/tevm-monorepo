/**
 * We need to import mineHandler but @tevm/actions is not a dependency of @tevm/node
 * So we'll need to require the client to have already set up the mining handlers
 * For now, we'll create a simple mining implementation here
 */

/**
 * @typedef {Object} IntervalMiner
 * @property {() => void} start - Start the interval mining
 * @property {() => void} stop - Stop the interval mining
 * @property {() => void} updateConfig - Update mining config and restart if needed
 * @property {(callback: () => Promise<void>) => void} setMiningCallback - Set the function to call when mining should occur
 */

/**
 * Creates an interval mining system that uses setTimeout to prevent race conditions
 * @param {import('./TevmNode.js').TevmNode} client - The TevmNode client
 * @returns {IntervalMiner} The interval miner controller
 * @example
 * ```js
 * import { createIntervalMiner } from '@tevm/node'
 * 
 * const client = createTevmNode({
 *   miningConfig: { type: 'interval', blockTime: 5 }
 * })
 * 
 * const miner = createIntervalMiner(client)
 * miner.start() // Start mining every 5 seconds
 * 
 * // Later...
 * miner.stop() // Stop mining
 * ```
 */
export const createIntervalMiner = (client) => {
	/**
	 * @type {NodeJS.Timeout | undefined}
	 */
	let timeoutId = undefined

	/**
	 * @type {boolean}
	 */
	let isRunning = false

	/**
	 * Callback function for mining - will be set by the client
	 * @type {(() => Promise<void>) | undefined}
	 */
	let miningCallback

	/**
	 * Sets the mining callback function
	 * @param {() => Promise<void>} callback - Function to call when mining should occur
	 * @returns {void}
	 */
	const setMiningCallback = (callback) => {
		miningCallback = callback
	}

	/**
	 * Executes mining cycle if callback is available
	 * @returns {Promise<void>}
	 */
	const mineBlock = async () => {
		if (!isRunning) {
			return
		}

		try {
			client.logger.debug('Interval mining: Starting block mining cycle')
			
			// Read mempool state synchronously at the beginning to prevent race conditions
			const txPool = await client.getTxPool()
			const txsInPool = txPool.txsInPool
			
			client.logger.debug({ txsInPool }, 'Interval mining: Mempool state captured')

			// Only mine if there are transactions in the pool and we have a mining callback
			if (txsInPool > 0 && miningCallback) {
				try {
					await miningCallback()
					client.logger.debug('Interval mining: Block mined successfully')
				} catch (miningError) {
					client.logger.error(miningError, 'Interval mining: Mining failed')
				}
			} else if (!miningCallback) {
				client.logger.debug('Interval mining: No mining callback set, skipping mining cycle')
			} else {
				client.logger.debug('Interval mining: No transactions in mempool, skipping mining cycle')
			}
		} catch (error) {
			client.logger.error(error, 'Interval mining: Unexpected error during mining')
		} finally {
			// Schedule the next mining cycle if still running
			scheduleNext()
		}
	}

	/**
	 * Schedules the next mining cycle using setTimeout
	 * @returns {void}
	 */
	const scheduleNext = () => {
		if (!isRunning || client.miningConfig.type !== 'interval') {
			return
		}

		const blockTime = client.miningConfig.blockTime * 1000 // Convert to milliseconds
		
		// Don't schedule if blockTime is 0 (manual mining only)
		if (blockTime <= 0) {
			client.logger.debug('Interval mining: Block time is 0, stopping automatic mining')
			return
		}

		timeoutId = setTimeout(() => {
			if (isRunning) {
				mineBlock()
			}
		}, blockTime)

		client.logger.debug({ blockTime }, 'Interval mining: Next mining cycle scheduled')
	}

	/**
	 * Starts the interval mining
	 * @returns {void}
	 */
	const start = () => {
		if (client.miningConfig.type !== 'interval') {
			client.logger.debug('Interval mining: Cannot start - mining type is not interval')
			return
		}

		if (isRunning) {
			client.logger.debug('Interval mining: Already running')
			return
		}

		isRunning = true
		client.logger.debug('Interval mining: Starting')
		scheduleNext()
	}

	/**
	 * Stops the interval mining
	 * @returns {void}
	 */
	const stop = () => {
		if (!isRunning) {
			return
		}

		isRunning = false
		
		if (timeoutId) {
			clearTimeout(timeoutId)
			timeoutId = undefined
		}

		client.logger.debug('Interval mining: Stopped')
	}

	/**
	 * Updates the mining config and restarts if needed
	 * @returns {void}
	 */
	const updateConfig = () => {
		const wasRunning = isRunning
		stop()
		
		if (wasRunning && client.miningConfig.type === 'interval') {
			start()
		}
	}

	return {
		start,
		stop,
		updateConfig,
		setMiningCallback,
	}
}
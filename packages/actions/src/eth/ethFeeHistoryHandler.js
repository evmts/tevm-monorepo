import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { hexToBigInt, hexToNumber, numberToHex, parseGwei } from '@tevm/utils'
import { blockNumberHandler } from './blockNumberHandler.js'

/**
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthHandler.js').EthFeeHistoryHandler}
 */
export const ethFeeHistoryHandler = ({ forkTransport, getVm, ...client }) => {
	/**
	 * @param {import('./EthParams.js').EthFeeHistoryParams} params
	 */
	return async ({ blockCount, newestBlock, rewardPercentiles }) => {
		// Parse parameters
		const blockCountNumber = hexToNumber(blockCount)
		const hasRewardPercentiles = rewardPercentiles && rewardPercentiles.length > 0

		// Validate block count (Ethereum clients typically limit this to ~1024)
		if (blockCountNumber > 1024) {
			throw new Error('Block count too large (maximum: 1024)')
		}

		// If no fork transport, return mock data for local testing
		if (!forkTransport) {
			return generateMockFeeHistory(blockCountNumber, hasRewardPercentiles, rewardPercentiles)
		}

		// Get the actual newest block number
		const fetcher = createJsonRpcFetcher(forkTransport)
		
		let newestBlockNumber
		if (newestBlock === 'latest' || newestBlock === 'pending') {
			newestBlockNumber = await blockNumberHandler({ ...client, getVm })({})
		} else {
			newestBlockNumber = hexToBigInt(newestBlock)
		}

		// Calculate the range of blocks to fetch
		const oldestBlockNumber = newestBlockNumber - BigInt(Math.max(0, blockCountNumber - 1))

		// Fetch fee history from the fork transport
		try {
			const response = await fetcher.request({
				method: 'eth_feeHistory',
				params: [blockCount, newestBlock, ...(hasRewardPercentiles ? [rewardPercentiles] : [])],
				jsonrpc: '2.0',
				id: 1,
			})

			return response.result
		} catch (error) {
			// Fallback to generating fee history from individual blocks
			return await generateFeeHistoryFromBlocks(
				fetcher,
				oldestBlockNumber,
				newestBlockNumber,
				blockCountNumber,
				rewardPercentiles
			)
		}
	}
}

/**
 * Generate mock fee history for testing without fork
 * @param {number} blockCount
 * @param {boolean} hasRewardPercentiles
 * @param {readonly number[] | undefined} rewardPercentiles
 */
function generateMockFeeHistory(blockCount, hasRewardPercentiles, rewardPercentiles) {
	const baseFeePerGas = []
	const gasUsedRatio = []
	const reward = hasRewardPercentiles ? [] : undefined

	// Generate base fees (EIP-1559 style)
	let currentBaseFee = parseGwei('20') // Start at 20 gwei

	for (let i = 0; i <= blockCount; i++) {
		baseFeePerGas.push(numberToHex(currentBaseFee))
		
		if (i < blockCount) {
			// Generate realistic gas usage ratios
			const ratio = 0.3 + Math.random() * 0.4 // Between 30% and 70%
			gasUsedRatio.push(ratio)

			// Adjust base fee for next block based on usage
			if (ratio > 0.5) {
				currentBaseFee = currentBaseFee + (currentBaseFee * BigInt(Math.floor((ratio - 0.5) * 125))) / 1000n
			} else {
				currentBaseFee = currentBaseFee - (currentBaseFee * BigInt(Math.floor((0.5 - ratio) * 125))) / 1000n
			}
			
			// Generate reward percentiles if requested
			if (hasRewardPercentiles && rewardPercentiles) {
				const blockRewards = []
				for (const percentile of rewardPercentiles) {
					// Generate realistic priority fees based on percentile
					const baseFee = parseGwei('1') // 1 gwei base priority fee
					const multiplier = percentile / 50 // Scale based on percentile
					const priorityFee = baseFee + BigInt(Math.floor(Number(baseFee) * multiplier))
					blockRewards.push(numberToHex(priorityFee))
				}
				reward.push(blockRewards)
			}
		}
	}

	return {
		baseFeePerGas,
		gasUsedRatio,
		...(reward ? { reward } : {})
	}
}

/**
 * Generate fee history by fetching individual blocks
 * @param {import('@tevm/jsonrpc').JsonRpcFetcher} fetcher
 * @param {bigint} oldestBlockNumber
 * @param {bigint} newestBlockNumber
 * @param {number} blockCount
 * @param {readonly number[] | undefined} rewardPercentiles
 */
async function generateFeeHistoryFromBlocks(fetcher, oldestBlockNumber, newestBlockNumber, blockCount, rewardPercentiles) {
	const baseFeePerGas = []
	const gasUsedRatio = []
	const reward = rewardPercentiles && rewardPercentiles.length > 0 ? [] : undefined

	// Fetch blocks in parallel
	const blockPromises = []
	for (let i = 0; i < blockCount; i++) {
		const blockNumber = oldestBlockNumber + BigInt(i)
		blockPromises.push(
			fetcher.request({
				method: 'eth_getBlockByNumber',
				params: [numberToHex(blockNumber), true], // true for full transaction objects
				jsonrpc: '2.0',
				id: Number(blockNumber),
			})
		)
	}

	const blockResponses = await Promise.all(blockPromises)

	// Process each block
	for (const blockResponse of blockResponses) {
		const block = blockResponse.result
		if (!block) continue

		// Add base fee
		baseFeePerGas.push(block.baseFeePerGas || '0x0')

		// Calculate gas used ratio
		const gasUsed = hexToBigInt(block.gasUsed)
		const gasLimit = hexToBigInt(block.gasLimit)
		const ratio = gasLimit > 0n ? Number(gasUsed) / Number(gasLimit) : 0
		gasUsedRatio.push(ratio)

		// Calculate reward percentiles if requested
		if (reward && rewardPercentiles && block.transactions) {
			const blockRewards = calculateRewardPercentiles(block.transactions, rewardPercentiles)
			reward.push(blockRewards)
		}
	}

	// Add one more base fee for the next block (estimated)
	if (baseFeePerGas.length > 0) {
		const lastBaseFee = hexToBigInt(baseFeePerGas[baseFeePerGas.length - 1])
		const lastGasRatio = gasUsedRatio[gasUsedRatio.length - 1] || 0.5
		
		// Simple EIP-1559 base fee calculation for next block
		let nextBaseFee = lastBaseFee
		if (lastGasRatio > 0.5) {
			const delta = (lastBaseFee * BigInt(Math.floor((lastGasRatio - 0.5) * 1000))) / 8000n
			nextBaseFee = lastBaseFee + (delta > 0n ? delta : 1n)
		} else if (lastGasRatio < 0.5) {
			const delta = (lastBaseFee * BigInt(Math.floor((0.5 - lastGasRatio) * 1000))) / 8000n
			nextBaseFee = lastBaseFee - delta
		}
		
		baseFeePerGas.push(numberToHex(nextBaseFee))
	}

	return {
		baseFeePerGas,
		gasUsedRatio,
		...(reward ? { reward } : {})
	}
}

/**
 * Calculate reward percentiles from transaction data
 * @param {any[]} transactions
 * @param {readonly number[]} percentiles
 */
function calculateRewardPercentiles(transactions, percentiles) {
	// Extract priority fees from EIP-1559 transactions
	const priorityFees = []
	
	for (const tx of transactions) {
		if (tx.maxPriorityFeePerGas) {
			priorityFees.push(hexToBigInt(tx.maxPriorityFeePerGas))
		} else if (tx.gasPrice && tx.type !== '0x2') {
			// For legacy transactions, assume minimal priority fee
			priorityFees.push(parseGwei('1'))
		}
	}

	// Sort priority fees
	priorityFees.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)

	if (priorityFees.length === 0) {
		// No transactions, return zero fees for all percentiles
		return percentiles.map(() => '0x0')
	}

	// Calculate percentiles
	return percentiles.map(percentile => {
		const index = Math.floor((percentile / 100) * (priorityFees.length - 1))
		const clampedIndex = Math.max(0, Math.min(index, priorityFees.length - 1))
		return numberToHex(priorityFees[clampedIndex])
	})
}
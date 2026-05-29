import { InvalidParamsError } from '@tevm/errors'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { hexToBigInt, numberToHex, parseGwei } from '@tevm/utils'
import { blockNumberHandler } from './blockNumberHandler.js'

/**
 * Handler for the `eth_feeHistory` RPC method.
 * Returns historical gas information, including base fees and priority fees for a range of blocks.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthHandler.js').EthFeeHistoryHandler}
 * @example
 * ```javascript
 * import { createTevmNode } from '@tevm/node'
 * import { ethFeeHistoryHandler } from '@tevm/actions'
 *
 * const node = createTevmNode()
 * const handler = ethFeeHistoryHandler(node)
 * const feeHistory = await handler({
 *   blockCount: 4n,
 *   newestBlock: 'latest',
 *   rewardPercentiles: [25, 50, 75],
 * })
 * console.log(feeHistory)
 * // {
 * //   oldestBlock: 1n,
 * //   baseFeePerGas: [1000000000n, 1100000000n, 1200000000n, 1300000000n, 1400000000n],
 * //   gasUsedRatio: [0.5, 0.6, 0.7, 0.8],
 * //   reward: [[1000000000n, 2000000000n, 3000000000n], ...]
 * // }
 * ```
 */
export const ethFeeHistoryHandler = (client) => {
	const { forkTransport, getVm } = client
	return async (params) => {
		const { blockCount, newestBlock = 'latest', rewardPercentiles } = params

		// Per the eth_feeHistory spec blockCount must be >= 1. Reject 0 (or negative) to avoid
		// returning an oldestBlock that is past the newest block / an empty baseFeePerGas array.
		if (blockCount < 1n) {
			throw new InvalidParamsError('eth_feeHistory blockCount must be at least 1')
		}

		// For forked nodes, forward the request to the fork transport
		if (forkTransport) {
			const fetcher = createJsonRpcFetcher(forkTransport)
			const result = await fetcher.request({
				method: 'eth_feeHistory',
				params: [
					numberToHex(blockCount),
					typeof newestBlock === 'bigint' ? numberToHex(newestBlock) : newestBlock,
					rewardPercentiles ? [...rewardPercentiles] : undefined,
				],
				jsonrpc: '2.0',
				id: 1,
			})

			if (result.error) {
				throw new Error(result.error.message)
			}

			const feeHistoryResult = /** @type {{
				oldestBlock: import('@tevm/utils').Hex,
				baseFeePerGas: import('@tevm/utils').Hex[],
				gasUsedRatio: number[],
				reward?: import('@tevm/utils').Hex[][]
			}} */ (result.result)

			/** @type {import('./EthResult.js').EthFeeHistoryResult} */
			const forkResult = {
				oldestBlock: hexToBigInt(feeHistoryResult.oldestBlock),
				baseFeePerGas: feeHistoryResult.baseFeePerGas.map((hex) => hexToBigInt(hex)),
				gasUsedRatio: feeHistoryResult.gasUsedRatio,
			}
			if (feeHistoryResult.reward !== undefined) {
				forkResult.reward = feeHistoryResult.reward.map((blockRewards) => blockRewards.map((hex) => hexToBigInt(hex)))
			}
			return forkResult
		}

		// For local devnet, calculate fee history from blocks
		const vm = await getVm()
		const currentBlockNumber = await blockNumberHandler(client)({})

		// Resolve newestBlock to a block number
		const newestBlockNumber = (() => {
			if (typeof newestBlock === 'bigint') {
				return newestBlock
			}
			if (typeof newestBlock === 'string' && newestBlock.startsWith('0x')) {
				return hexToBigInt(/** @type {import('@tevm/utils').Hex} */ (newestBlock))
			}
			// Handle block tags
			if (
				newestBlock === 'latest' ||
				newestBlock === 'pending' ||
				newestBlock === 'safe' ||
				newestBlock === 'finalized'
			) {
				return currentBlockNumber
			}
			if (newestBlock === 'earliest') {
				return 0n
			}
			return currentBlockNumber
		})()

		// Calculate the oldest block in the range (constrained by genesis)
		const blockCountNum = Number(blockCount)
		const oldestBlock =
			newestBlockNumber >= BigInt(blockCountNum - 1) ? newestBlockNumber - BigInt(blockCountNum - 1) : 0n

		const actualBlockCount = Number(newestBlockNumber - oldestBlock) + 1

		/** @type {bigint[]} */
		const baseFeePerGas = []
		/** @type {number[]} */
		const gasUsedRatio = []
		/** @type {bigint[][] | undefined} */
		const reward = rewardPercentiles && rewardPercentiles.length > 0 ? [] : undefined

		// Iterate through the block range
		for (let i = 0; i < actualBlockCount; i++) {
			const blockNumber = oldestBlock + BigInt(i)
			try {
				const block = await vm.blockchain.getBlock(blockNumber)
				const header = block.header

				// Get base fee (EIP-1559 blocks have baseFeePerGas)
				const baseFee = header.baseFeePerGas ?? 0n
				baseFeePerGas.push(baseFee)

				// Calculate gas used ratio
				const gasLimit = header.gasLimit
				const gasUsed = header.gasUsed
				const ratio = gasLimit > 0n ? Number(gasUsed) / Number(gasLimit) : 0
				gasUsedRatio.push(ratio)

				// Calculate reward percentiles if requested
				if (reward && rewardPercentiles && rewardPercentiles.length > 0) {
					if (block.transactions.length === 0) {
						// Empty block - all zeros for rewards
						reward.push(rewardPercentiles.map(() => 0n))
					} else {
						// Per the eth_feeHistory spec, reward percentiles are gas-weighted: transactions are
						// sorted by effective priority fee and the percentile is taken at the point where the
						// cumulative gasUsed of the block crosses percentile% of the block's total gas. We pull
						// per-transaction gasUsed from the receipt manager (cumulativeBlockGasUsed deltas); if
						// receipts are unavailable we fall back to weighting each transaction equally.
						/** @type {bigint[] | undefined} */
						let perTxGasUsed
						try {
							const receiptsManager = await client.getReceiptsManager()
							const receipts = await receiptsManager.getReceipts(block.hash())
							if (receipts && receipts.length === block.transactions.length) {
								let previousCumulative = 0n
								perTxGasUsed = receipts.map((receipt) => {
									const gas = receipt.cumulativeBlockGasUsed - previousCumulative
									previousCumulative = receipt.cumulativeBlockGasUsed
									return gas > 0n ? gas : 0n
								})
							}
						} catch {
							perTxGasUsed = undefined
						}
						if (!perTxGasUsed) {
							// Fall back to equal per-transaction weighting when receipts are unavailable
							perTxGasUsed = block.transactions.map(() => 1n)
						}

						// Pair each transaction's effective priority fee with its gas used
						const feeAndGas = block.transactions.map((tx, txIndex) => {
							/** @type {bigint} */
							let effectivePriorityFee
							if ('maxPriorityFeePerGas' in tx && tx.maxPriorityFeePerGas !== undefined) {
								// EIP-1559 transaction
								const maxPriorityFee = tx.maxPriorityFeePerGas
								const maxFee = /** @type {bigint} */ ('maxFeePerGas' in tx ? tx.maxFeePerGas : 0n)
								const candidate = maxFee - baseFee > maxPriorityFee ? maxPriorityFee : maxFee - baseFee
								effectivePriorityFee = candidate > 0n ? candidate : 0n
							} else {
								// Legacy transaction - effective priority fee is gasPrice - baseFee
								const gasPrice = /** @type {bigint} */ ('gasPrice' in tx ? tx.gasPrice : 0n)
								effectivePriorityFee = gasPrice > baseFee ? gasPrice - baseFee : 0n
							}
							return {
								reward: effectivePriorityFee,
								gasUsed: /** @type {bigint} */ (perTxGasUsed[txIndex] ?? 0n),
							}
						})

						// Sort ascending by effective priority fee
						feeAndGas.sort((a, b) => (a.reward < b.reward ? -1 : a.reward > b.reward ? 1 : 0))

						const totalGasUsed = feeAndGas.reduce((sum, entry) => sum + entry.gasUsed, 0n)

						// Walk the gas-weighted cumulative distribution to resolve each percentile
						const percentileRewards = rewardPercentiles.map((percentile) => {
							if (totalGasUsed === 0n) {
								return feeAndGas[feeAndGas.length - 1]?.reward ?? 0n
							}
							// Threshold gas at which this percentile is considered reached
							const thresholdGas = (totalGasUsed * BigInt(Math.floor(percentile))) / 100n
							let cumulativeGas = 0n
							for (const entry of feeAndGas) {
								cumulativeGas += entry.gasUsed
								if (cumulativeGas >= thresholdGas) {
									return entry.reward
								}
							}
							return feeAndGas[feeAndGas.length - 1]?.reward ?? 0n
						})
						reward.push(percentileRewards)
					}
				}
			} catch {
				// Block not found - use default values
				baseFeePerGas.push(parseGwei('1'))
				gasUsedRatio.push(0)
				if (reward) {
					reward.push(rewardPercentiles?.map(() => 0n) ?? [])
				}
			}
		}

		// Add the next block's base fee prediction (required by spec)
		// For local devnet, we estimate based on the last block's gas usage
		if (baseFeePerGas.length > 0 && gasUsedRatio.length > 0) {
			const lastBaseFee = baseFeePerGas[baseFeePerGas.length - 1] ?? parseGwei('1')
			const lastGasUsedRatio = gasUsedRatio[gasUsedRatio.length - 1] ?? 0

			// Simple EIP-1559 base fee calculation
			// If gas used is above 50% target, base fee increases; otherwise it decreases
			const targetGasUsedRatio = 0.5
			const maxBaseFeeChange = lastBaseFee / 8n // 12.5% max change

			let nextBaseFee = lastBaseFee
			if (lastGasUsedRatio > targetGasUsedRatio) {
				const increase = (maxBaseFeeChange * BigInt(Math.floor((lastGasUsedRatio - targetGasUsedRatio) * 100))) / 50n
				nextBaseFee = lastBaseFee + increase
			} else if (lastGasUsedRatio < targetGasUsedRatio) {
				const decrease = (maxBaseFeeChange * BigInt(Math.floor((targetGasUsedRatio - lastGasUsedRatio) * 100))) / 50n
				nextBaseFee = lastBaseFee > decrease ? lastBaseFee - decrease : 0n
			}
			baseFeePerGas.push(nextBaseFee)
		}

		/** @type {import('./EthResult.js').EthFeeHistoryResult} */
		const result = {
			oldestBlock,
			baseFeePerGas,
			gasUsedRatio,
		}
		if (reward !== undefined) {
			result.reward = reward
		}
		return result
	}
}

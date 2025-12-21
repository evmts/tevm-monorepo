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
						// Calculate effective priority fees for each transaction
						const effectivePriorityFees = block.transactions.map((tx) => {
							if ('maxPriorityFeePerGas' in tx && tx.maxPriorityFeePerGas !== undefined) {
								// EIP-1559 transaction
								const maxPriorityFee = tx.maxPriorityFeePerGas
								const maxFee = /** @type {bigint} */ ('maxFeePerGas' in tx ? tx.maxFeePerGas : 0n)
								const effectivePriorityFee = maxFee - baseFee > maxPriorityFee ? maxPriorityFee : maxFee - baseFee
								return effectivePriorityFee > 0n ? effectivePriorityFee : 0n
							}
							// Legacy transaction - effective priority fee is gasPrice - baseFee
							const gasPrice = /** @type {bigint} */ ('gasPrice' in tx ? tx.gasPrice : 0n)
							return gasPrice > baseFee ? gasPrice - baseFee : 0n
						})

						// Sort by effective priority fee
						effectivePriorityFees.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))

						// Calculate percentiles
						const percentileRewards = rewardPercentiles.map((percentile) => {
							if (effectivePriorityFees.length === 0) return 0n
							const index = Math.floor((percentile / 100) * effectivePriorityFees.length)
							return effectivePriorityFees[Math.min(index, effectivePriorityFees.length - 1)] ?? 0n
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

export function calculateOmmerReward(ommerBlockNumber: bigint, blockNumber: bigint, minerReward: bigint): bigint {
	const heightDiff = blockNumber - ommerBlockNumber
	let reward = ((8n - heightDiff) * minerReward) / 8n
	if (reward < 0n) {
		reward = 0n
	}
	return reward
}

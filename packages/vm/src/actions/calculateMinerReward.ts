export function calculateMinerReward(minerReward: bigint, ommersNum: number): bigint {
	// calculate nibling reward
	const niblingReward = minerReward / BigInt(32)
	const totalNiblingReward = niblingReward * BigInt(ommersNum)
	const reward = minerReward + totalNiblingReward
	return reward
}

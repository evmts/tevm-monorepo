import { Block } from '@tevm/block'
import type { BaseVm } from '../BaseVm.js'
import { calculateMinerReward } from './calculateMinerReward.js'
import { calculateOmmerReward } from './calculateOmmerReward.js'
import { rewardAccount } from './rewardAccount.js'

/**
 * Calculates block rewards for miner and ommers and puts
 * the updated balances of their accounts to state.
 */
export const assignBlockRewards =
	(vm: BaseVm) =>
	async (block: Block): Promise<void> => {
		const minerReward = vm.common.ethjsCommon.param('minerReward')
		const ommers = block.uncleHeaders
		// Reward ommers
		for (const ommer of ommers) {
			const reward = calculateOmmerReward(ommer.number, block.header.number, minerReward)
			await rewardAccount(vm.evm, ommer.coinbase, reward)
		}
		// Reward miner
		const reward = calculateMinerReward(minerReward, ommers.length)
		await rewardAccount(vm.evm, block.header.coinbase, reward)
	}

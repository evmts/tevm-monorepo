import { Block } from '@tevm/block'
import { optimism } from '@tevm/common'
import { createLogger } from '@tevm/logger'
import { transports } from '@tevm/test-utils'
import { getBlockFromRpc } from '../utils/getBlockFromRpc.js'

let blocks: [Block, Block, Block, Block] | undefined = undefined
export const getMockBlocks = async (): Promise<[Block, Block, Block, Block]> => {
	blocks =
		blocks ??
		((await Promise.all(
			[122750000n, 122750001n, 122750002n, 122750003n].map((blockTag) =>
				getBlockFromRpc(
					{ logger: createLogger({ name: 'test', level: 'warn' }) } as any,
					{ transport: transports.optimism, blockTag },
					optimism,
				).then((res) => res[0]),
			),
		)) as [Block, Block, Block, Block])
	return blocks
}

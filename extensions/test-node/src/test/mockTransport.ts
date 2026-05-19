import type { EIP1193RequestFn, Hex } from 'viem'

const BLOCK_HASH = `0x${'12'.repeat(32)}` as const

export const createMockBlock = (number: Hex, includeTransactions = false) => ({
	number,
	hash: BLOCK_HASH,
	transactions: includeTransactions ? [] : [],
})

export const createMockForkTransport = (): { request: EIP1193RequestFn } => {
	const request = (async ({ method, params }) => {
		if (method === 'eth_getBlockByNumber') {
			const [blockNumber, includeTransactions] = params as [Hex, boolean]
			if (blockNumber === '0xffffffffffffffff') throw new Error('block not found')
			return createMockBlock(blockNumber, includeTransactions)
		}

		if (method === 'eth_blockNumber') return '0x15c0000'
		if (method === 'eth_chainId') return '0x1'

		return '0x1'
	}) as EIP1193RequestFn

	return { request }
}

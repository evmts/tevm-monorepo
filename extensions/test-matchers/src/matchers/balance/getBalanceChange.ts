import type { PrestateTraceResult } from '@tevm/actions'
import type { Address } from 'viem'

export const getBalanceChange = (prestateTrace: PrestateTraceResult<true>, address: Address) => {
	const pre = prestateTrace.pre[address]
	const post = prestateTrace.post[address]
	if (!pre || !post) return 0n

	return BigInt(post.balance ?? 0n) - BigInt(pre.balance ?? 0n)
}

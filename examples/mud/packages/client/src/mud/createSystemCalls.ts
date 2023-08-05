import { ClientComponents } from './createClientComponents'
import { SetupNetworkResult } from './setupNetwork'
import { getComponentValue } from '@latticexyz/recs'
import { awaitStreamValue } from '@latticexyz/utils'

export type SystemCalls = ReturnType<typeof createSystemCalls>

export function createSystemCalls(
	{ worldSend, txReduced$, singletonEntity }: SetupNetworkResult,
	{ Counter }: ClientComponents,
) {
	const increment = async () => {
		const tx = await worldSend('increment', [])
		await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
		return getComponentValue(Counter, singletonEntity)
	}

	return {
		increment,
	}
}

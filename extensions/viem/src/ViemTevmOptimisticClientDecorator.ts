import type { ViemTevmOptimisticClient } from './ViemTevmOptimisticClient.js'
import type { Account, Chain, Transport } from 'viem'

export type ViemTevmOptimisticClientDecorator = <
	TTransport extends Transport = Transport,
	TChain extends Chain | undefined = Chain | undefined,
	TAccount extends Account | undefined = Account | undefined,
>(
	client: Pick<
		import('viem').WalletClient<TTransport, TChain, TAccount>,
		'request' | 'writeContract'
	>,
) => ViemTevmOptimisticClient<TChain, TAccount>

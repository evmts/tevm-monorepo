import type { ViemTevmOptimisticClient } from './ViemTevmOptimisticClient.js'
import type { Account, Chain, Transport } from 'viem'

/**
 * @deprecated in favor of the viem transport
 * @experimental
 * A viem decorator for `tevmViemExtension`
 */
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

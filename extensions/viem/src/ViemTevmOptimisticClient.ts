import type { OptimisticResult } from './OptimisticResult.js'
import type { TevmClient } from '@tevm/client-types'
import type { Abi } from 'abitype'
import type {
	Account,
	Chain,
	ContractFunctionArgs,
	ContractFunctionName,
	WriteContractParameters,
} from 'viem'

/**
 * @deprecated in favor of the viem transport
 * @experimental
 * The decorated methods added to a viem wallet client by `tevmViemExtensionOptimistic`
 */
export type ViemTevmOptimisticClient<
	TChain extends Chain | undefined = Chain,
	TAccount extends Account | undefined = Account | undefined,
> = {
	tevm: Omit<TevmClient, 'request'> & {
		writeContractOptimistic<
			TAbi extends Abi | readonly unknown[] = Abi,
			TFunctionName extends ContractFunctionName<TAbi> = ContractFunctionName<TAbi>,
			TArgs extends ContractFunctionArgs<
				TAbi,
				'nonpayable' | 'payable',
				TFunctionName
			> = ContractFunctionArgs<TAbi, 'nonpayable' | 'payable', TFunctionName>,
			TChainOverride extends Chain | undefined = Chain | undefined,
		>(
			action: WriteContractParameters<
				TAbi,
				TFunctionName,
				TArgs,
				TChain,
				TAccount,
				TChainOverride
			>,
		): AsyncGenerator<OptimisticResult<TAbi, TFunctionName, TChain>>
	}
}

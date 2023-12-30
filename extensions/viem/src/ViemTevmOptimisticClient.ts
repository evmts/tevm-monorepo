import type { Abi } from 'abitype'
import type {
	Account,
	Chain,
	WriteContractParameters,
} from 'viem'
import type { OptimisticResult } from './OptimisticResult.js'

export type ViemTevmOptimisticClient<
	TChain extends Chain | undefined = Chain,
	TAccount extends Account | undefined = Account | undefined,
> = {
	writeContractOptimistic<
		TAbi extends Abi | readonly unknown[] = Abi,
		TFunctionName extends string = string,
		TChainOverride extends Chain | undefined = Chain | undefined,
	>(
		action: WriteContractParameters<
			TAbi,
			TFunctionName,
			TChain,
			TAccount,
			TChainOverride
		>,
	): AsyncGenerator<OptimisticResult<TAbi, TFunctionName, TChain>>
}

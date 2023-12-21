import type {
	RunContractCallAction,
	RunContractCallResult,
	PutAccountAction,
	PutContractCodeAction,
	RunCallAction,
	RunScriptAction,
	RunScriptResult,
	NonVerboseTevmJsonRpcRequest,
	BackendReturnType,
	TevmPutAccountResponse,
	TevmPutContractCodeResponse
} from '@tevm/vm'
import type { TevmCallResponse } from '@tevm/vm'
import type { Abi } from 'abitype'
import type {
	Account,
	Chain,
	Transport,
	WriteContractParameters,
	WriteContractReturnType,
} from 'viem'

export type ViemTevmClient = {
	tevmRequest<T extends NonVerboseTevmJsonRpcRequest>(
		r: T,
	): Promise<BackendReturnType<T>['result']>
	runScript<
		TAbi extends Abi | readonly unknown[] = Abi,
		TFunctionName extends string = string,
	>(
		action: RunScriptAction<TAbi, TFunctionName>,
	): Promise<RunScriptResult<TAbi, TFunctionName>>
	putAccount(
		action: PutAccountAction,
	): Promise<TevmPutAccountResponse['result']>
	putContractCode(
		action: PutContractCodeAction,
	): Promise<TevmPutContractCodeResponse['result']>
	runCall(action: RunCallAction): Promise<TevmCallResponse['result']>
	runContractCall<
		TAbi extends Abi | readonly unknown[] = Abi,
		TFunctionName extends string = string,
	>(
		action: RunContractCallAction<TAbi, TFunctionName>,
	): Promise<RunContractCallResult<TAbi, TFunctionName>>
}

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
	): Promise<{
		optimisticResult: () => Promise<RunContractCallResult<TAbi, TFunctionName>>
		result: () => Promise<WriteContractReturnType>
	}>
}

export type ViemTevmClientDecorator = (
	client: Pick<import('viem').Client, 'request'>,
) => ViemTevmClient

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

export type ViemTevmExtension = () => ViemTevmClientDecorator

export type ViemTevmOptimisticExtension =
	() => ViemTevmOptimisticClientDecorator

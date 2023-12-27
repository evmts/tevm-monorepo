import type { RunContractCallAction } from '../actions/contractCall/RunContractCallAction.js';
import type { RunContractCallError } from '../actions/contractCall/RunContractCallError.js';
import type { RunContractCallResult } from '../actions/contractCall/RunContractCallResult.js';
import type { PutAccountAction, PutContractCodeAction, RunCallAction } from '../actions/index.js';
import type { RunScriptAction } from '../actions/runScript/RunScriptAction.js';
import type { RunScriptResult } from '../actions/runScript/RunScriptResult.js';
import type { NonVerboseTevmJsonRpcRequest } from '../jsonrpc/TevmJsonRpcRequest.js';
import type { BackendReturnType } from '../jsonrpc/createJsonRpcClient.js';
import type { TevmPutAccountResponse } from '../jsonrpc/putAccount/TevmPutAccountResponse.js';
import type { TevmPutContractCodeResponse } from '../jsonrpc/putContractCode/TevmPutContractCodeResponse.js';
import type { TevmCallResponse } from '../jsonrpc/runCall/TevmCallResponse.js';
import type { Abi } from 'abitype';
import type { Account, Chain, Transport, WaitForTransactionReceiptReturnType, WriteContractErrorType, WriteContractParameters, WriteContractReturnType } from 'viem';
export type ViemTevmClient = {
    tevmRequest<T extends NonVerboseTevmJsonRpcRequest>(r: T): Promise<BackendReturnType<T>['result']>;
    runScript<TAbi extends Abi | readonly unknown[] = Abi, TFunctionName extends string = string>(action: RunScriptAction<TAbi, TFunctionName>): Promise<RunScriptResult<TAbi, TFunctionName>>;
    putAccount(action: PutAccountAction): Promise<TevmPutAccountResponse['result']>;
    putContractCode(action: PutContractCodeAction): Promise<TevmPutContractCodeResponse['result']>;
    runCall(action: RunCallAction): Promise<TevmCallResponse['result']>;
    runContractCall<TAbi extends Abi | readonly unknown[] = Abi, TFunctionName extends string = string>(action: RunContractCallAction<TAbi, TFunctionName>): Promise<RunContractCallResult<TAbi, TFunctionName>>;
};
export type TypedError<T> = Error & {
    tag: T;
};
export type GenResult<TDataType, TTag extends string> = {
    success: true;
    tag: TTag;
    data: TDataType;
    errors?: ReadonlyArray<TypedError<string>>;
};
type GenError<TErrorType, TTag extends string> = {
    errors?: ReadonlyArray<TypedError<string>>;
    error: TErrorType;
    success: false;
    tag: TTag;
};
export type OptimisticResult<TAbi extends Abi | readonly unknown[], TFunctionName extends string, TChain extends Chain | undefined> = GenResult<RunContractCallResult<TAbi, TFunctionName>, 'OPTIMISTIC_RESULT'> | GenError<RunContractCallError, 'OPTIMISTIC_RESULT'> | GenResult<WriteContractReturnType, 'HASH'> | GenError<WriteContractErrorType, 'HASH'> | GenResult<WaitForTransactionReceiptReturnType<TChain>, 'RECEIPT'> | GenError<WriteContractErrorType, 'RECEIPT'>;
export type ViemTevmOptimisticClient<TChain extends Chain | undefined = Chain, TAccount extends Account | undefined = Account | undefined> = {
    writeContractOptimistic<TAbi extends Abi | readonly unknown[] = Abi, TFunctionName extends string = string, TChainOverride extends Chain | undefined = Chain | undefined>(action: WriteContractParameters<TAbi, TFunctionName, TChain, TAccount, TChainOverride>): AsyncGenerator<OptimisticResult<TAbi, TFunctionName, TChain>>;
};
export type ViemTevmClientDecorator = (client: Pick<import('viem').Client, 'request'>) => ViemTevmClient;
export type ViemTevmOptimisticClientDecorator = <TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined, TAccount extends Account | undefined = Account | undefined>(client: Pick<import('viem').WalletClient<TTransport, TChain, TAccount>, 'request' | 'writeContract'>) => ViemTevmOptimisticClient<TChain, TAccount>;
export type ViemTevmExtension = () => ViemTevmClientDecorator;
export type ViemTevmOptimisticExtension = () => ViemTevmOptimisticClientDecorator;
export {};
//# sourceMappingURL=types.d.ts.map
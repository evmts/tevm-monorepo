import type { RunContractCallAction } from '../actions/contractCall/RunContractCallAction.js';
import type { RunContractCallResult } from '../actions/contractCall/RunContractCallResult.js';
import type { PutAccountAction } from '../actions/index.js';
import type { PutContractCodeAction } from '../actions/putContractCode/PutContractCodeAction.js';
import type { RunCallAction } from '../actions/runCall/RunCallAction.js';
import type { RunScriptAction } from '../actions/runScript/RunScriptAction.js';
import type { RunScriptResult } from '../actions/runScript/RunScriptResult.js';
import type { TevmJsonRpcRequest } from '../jsonrpc/TevmJsonRpcRequest.js';
import type { BackendReturnType } from '../jsonrpc/createJsonRpcClient.js';
import type { TevmPutAccountResponse } from '../jsonrpc/putAccount/TevmPutAccountResponse.js';
import type { TevmPutContractCodeResponse } from '../jsonrpc/putContractCode/TevmPutContractCodeResponse.js';
import type { TevmCallResponse } from '../jsonrpc/runCall/TevmCallResponse.js';
import type { Abi } from 'abitype';
export type Client = {
    request<T extends TevmJsonRpcRequest>(r: T): Promise<BackendReturnType<T>>;
    runScript<TAbi extends Abi | readonly unknown[] = Abi, TFunctionName extends string = string>(action: RunScriptAction<TAbi, TFunctionName>): Promise<RunScriptResult<TAbi, TFunctionName>>;
    putAccount(action: PutAccountAction): Promise<TevmPutAccountResponse>;
    putContractCode(action: PutContractCodeAction): Promise<TevmPutContractCodeResponse>;
    runCall(action: RunCallAction): Promise<TevmCallResponse>;
    runContractCall<TAbi extends Abi | readonly unknown[] = Abi, TFunctionName extends string = string>(action: RunContractCallAction<TAbi, TFunctionName>): Promise<RunContractCallResult<TAbi, TFunctionName>>;
};
export declare function createClient(rpcUrl: string): Client;
//# sourceMappingURL=createClient.d.ts.map
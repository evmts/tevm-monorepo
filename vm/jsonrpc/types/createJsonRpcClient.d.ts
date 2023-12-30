import type { EVM } from '@ethereumjs/evm';
import type { NonVerboseTevmJsonRpcRequest, TevmJsonRpcRequest } from './TevmJsonRpcRequest.js';
import type { TevmCallResponse, TevmContractCallResponse, TevmPutAccountResponse, TevmPutContractCodeResponse, TevmScriptResponse } from './responses/index.js';
export declare class UnknownMethodError extends Error {
    name: string;
    _tag: string;
    constructor(request: never);
}
export type BackendReturnType<T extends NonVerboseTevmJsonRpcRequest> = T extends {
    method: 'tevm_call';
} ? TevmCallResponse : T extends {
    method: 'tevm_contractCall';
} ? TevmContractCallResponse<T['params']['abi'], T['params']['functionName'] & string> : T extends {
    method: 'tevm_putAccount';
} ? TevmPutAccountResponse : T extends {
    method: 'tevm_putContractCode';
} ? TevmPutContractCodeResponse : T extends {
    method: 'tevm_script';
} ? TevmScriptResponse<T['params']['abi'], T['params']['functionName'] & string> : never;
/**
 * Creates a vanillajs jsonrpc handler for tevm requests
 * Infers return type from request
 * @example
 * ```typescript
 * const handler = createJsonrpcClient(tevm)
 * const res = await handler({
 *  jsonrpc: '2.0',
 *  id: '1',
 *  method: 'tevm_call',
 *  params: {
 *    to: '0x000000000'
 *  }
 * })
 * ```
 */
export declare const createJsonRpcClient: (evm: EVM) => <TRequest extends TevmJsonRpcRequest>(request: TRequest) => Promise<BackendReturnType<TRequest>>;
export type JsonRpcClient = ReturnType<typeof createJsonRpcClient>;
//# sourceMappingURL=createJsonRpcClient.d.ts.map
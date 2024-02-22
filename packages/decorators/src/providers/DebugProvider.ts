import type {
  DebugTraceCallJsonRpcResponse,
  DebugTraceTransactionJsonRpcResponse,
  DebugTraceCallJsonRpcRequest,
  DebugTraceTransactionJsonRpcRequest,
  EthChainIdJsonRpcRequest,
  EthChainIdJsonRpcResponse,
} from "@tevm/procedures-types";
import type { BaseProvider } from "./BaseProvider.js";

export interface EthereumProvider extends BaseProvider {
  request(args: EthChainIdJsonRpcRequest): EthChainIdJsonRpcResponse
  // TODO move some of these hardcoded requests to the tevm procedures package
  request(args: { method: 'tevm_mode' }): 'fork' | 'proxy' | 'normal';
  on(eventName: 'connect', listener: () => void): this;
  on(eventName: 'disconnect', listener: () => void): this;
  // this event never happens is here for compatability
  on(eventName: 'accountsChanged', listener: (accounts: string[]) => void): this;
  // this event never happens is here for compatability
  on(eventName: 'chainChanged', listener: (networkId: string) => void): this;
  request(args: DebugTraceCallJsonRpcRequest): Promise<DebugTraceCallJsonRpcResponse>;
  request(args: DebugTraceTransactionJsonRpcRequest): Promise<DebugTraceTransactionJsonRpcResponse>;
}


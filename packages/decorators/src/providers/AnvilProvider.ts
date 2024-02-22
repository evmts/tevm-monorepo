import type {
  AnvilSetCodeJsonRpcResponse,
  AnvilSetNonceJsonRpcResponse,
  AnvilDumpStateJsonRpcResponse,
  AnvilLoadStateJsonRpcResponse,
  AnvilSetChainIdJsonRpcResponse,
  AnvilSetStorageAtJsonRpcResponse,
  AnvilSetCodeJsonRpcRequest,
  AnvilSetNonceJsonRpcRequest,
  AnvilDumpStateJsonRpcRequest,
  AnvilLoadStateJsonRpcRequest,
  AnvilSetChainIdJsonRpcRequest,
  AnvilSetStorageAtJsonRpcRequest,
  AnvilStopImpersonatingAccountJsonRpcRequest,
  AnvilImpersonateAccountJsonRpcRequest,
  AnvilGetAutomineJsonRpcRequest,
  AnvilMineJsonRpcRequest,
  AnvilResetJsonRpcRequest,
  AnvilDropTransactionJsonRpcRequest,
  AnvilSetBalanceJsonRpcRequest,
  AnvilSetBalanceJsonRpcResponse,
  AnvilGetAutomineJsonRpcResponse,
  AnvilDropTransactionJsonRpcResponse,
  AnvilImpersonateAccountJsonRpcResponse,
  AnvilStopImpersonatingAccountJsonRpcResponse,
  AnvilMineJsonRpcResponse,
  AnvilResetJsonRpcResponse,
  EthChainIdJsonRpcRequest,
  EthChainIdJsonRpcResponse,
} from "@tevm/procedures-types";
import type { BaseProvider } from "./BaseProvider.js";

export interface AnvilProvider extends BaseProvider {
  request(args: EthChainIdJsonRpcRequest): EthChainIdJsonRpcResponse
  // TODO move some of these hardcoded requests to the tevm procedures package
  request(args: { method: 'tevm_mode' }): 'fork' | 'proxy' | 'normal';
  on(eventName: 'connect', listener: () => void): this;
  on(eventName: 'disconnect', listener: () => void): this;
  // this event never happens is here for compatability
  on(eventName: 'accountsChanged', listener: (accounts: string[]) => void): this;
  // this event never happens is here for compatability
  on(eventName: 'chainChanged', listener: (networkId: string) => void): this;

  removeListener(eventName: 'connect', listener: () => void): this;
  removeListener(eventName: 'disconnect', listener: () => void): this;
  removeListener(eventName: 'accountsChanged', listener: (accounts: string[]) => void): this;
  removeListener(eventName: 'chainChanged', listener: (networkId: string) => void): this;
  request(args: AnvilResetJsonRpcRequest): Promise<AnvilResetJsonRpcResponse>;
  request(args: AnvilMineJsonRpcRequest): Promise<AnvilMineJsonRpcResponse>;
  request(args: AnvilGetAutomineJsonRpcRequest): Promise<AnvilGetAutomineJsonRpcResponse>;
  request(args: AnvilImpersonateAccountJsonRpcRequest): Promise<AnvilImpersonateAccountJsonRpcResponse>;
  request(args: AnvilStopImpersonatingAccountJsonRpcRequest): Promise<AnvilStopImpersonatingAccountJsonRpcResponse>;
  request(args: AnvilDropTransactionJsonRpcRequest): Promise<AnvilDropTransactionJsonRpcResponse>;
  request(args: AnvilSetBalanceJsonRpcRequest): Promise<AnvilSetBalanceJsonRpcResponse>;
  request(args: AnvilSetCodeJsonRpcRequest): Promise<AnvilSetCodeJsonRpcResponse>;
  request(args: AnvilSetNonceJsonRpcRequest): Promise<AnvilSetNonceJsonRpcResponse>;
  request(args: AnvilDumpStateJsonRpcRequest): Promise<AnvilDumpStateJsonRpcResponse>;
  request(args: AnvilLoadStateJsonRpcRequest): Promise<AnvilLoadStateJsonRpcResponse>;
  request(args: AnvilSetChainIdJsonRpcRequest): Promise<AnvilSetChainIdJsonRpcResponse>;
  request(args: AnvilSetStorageAtJsonRpcRequest): Promise<AnvilSetStorageAtJsonRpcResponse>;
}


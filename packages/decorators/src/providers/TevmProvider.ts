import type {
  DumpStateJsonRpcResponse,
  CallJsonRpcResponse,
  ContractJsonRpcResponse,
  ScriptJsonRpcResponse,
  GetAccountJsonRpcResponse,
  SetAccountJsonRpcResponse,
  LoadStateJsonRpcResponse,
  CallJsonRpcRequest,
  ScriptJsonRpcRequest,
  GetAccountJsonRpcRequest,
  SetAccountJsonRpcRequest,
  ContractJsonRpcRequest,
  DumpStateJsonRpcRequest,
  LoadStateJsonRpcRequest,
  TevmJsonRpcRequest,
  EthChainIdJsonRpcRequest,
  EthChainIdJsonRpcResponse,
} from "@tevm/procedures-types";
import type { BaseProvider } from "./BaseProvider.js";

export interface TevmProvider extends BaseProvider {
  request(args: EthChainIdJsonRpcRequest): EthChainIdJsonRpcResponse
  // TODO move some of these hardcoded requests to the tevm procedures package
  request(args: { method: 'tevm_mode' }): 'fork' | 'proxy' | 'normal';
  on(eventName: 'connect', listener: () => void): this;
  on(eventName: 'disconnect', listener: () => void): this;
  // this event never happens is here for compatability
  on(eventName: 'accountsChanged', listener: (accounts: string[]) => void): this;
  // this event never happens is here for compatability
  on(eventName: 'chainChanged', listener: (networkId: string) => void): this;

  request(args: CallJsonRpcRequest): Promise<CallJsonRpcResponse>;
  request(args: ContractJsonRpcRequest): Promise<ContractJsonRpcResponse>;
  request(args: DumpStateJsonRpcRequest): Promise<DumpStateJsonRpcResponse>;
  request(args: GetAccountJsonRpcRequest): Promise<GetAccountJsonRpcResponse>;
  request(args: LoadStateJsonRpcRequest): Promise<LoadStateJsonRpcResponse>;
  request(args: ScriptJsonRpcRequest): Promise<ScriptJsonRpcResponse>;
  request(args: SetAccountJsonRpcRequest): Promise<SetAccountJsonRpcResponse>;
  request(args: TevmJsonRpcRequest): Promise<unknown>;
  on(eventName: 'connect', listener: () => void): this;
  removeListener(eventName: string, listener: (...args: any[]) => void): this;
}


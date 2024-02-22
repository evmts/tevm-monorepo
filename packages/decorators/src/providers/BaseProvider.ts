import type { EthChainIdJsonRpcRequest, EthChainIdJsonRpcResponse } from "@tevm/procedures-types";

export interface BaseProvider {
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
}


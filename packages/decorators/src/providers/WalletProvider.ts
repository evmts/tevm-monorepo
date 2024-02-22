import type {
  EthSignJsonRpcResponse,
  EthAccountsJsonRpcResponse,
  EthSignTransactionJsonRpcResponse,
  EthSignJsonRpcRequest,
  EthAccountsJsonRpcRequest,
  EthSignTransactionJsonRpcRequest,
  EthChainIdJsonRpcRequest,
  EthChainIdJsonRpcResponse,
} from "@tevm/procedures-types";
import type { BaseProvider } from "./BaseProvider.js";
import type { EthBlockNumberHandler, EthCallHandler, EthChainIdHandler, EthGasPriceHandler, EthGetBalanceHandler, EthGetCodeHandler, EthGetStorageAtHandler } from "@tevm/actions-types";

/**
 * Standard JSON-RPC methods for interacting with the VM
 * @see {@link https://ethereum.github.io/execution-apis/api-documentation/ | JSON-RPC}
 */
export interface EthereumProvider extends BaseProvider {
  /**
   * Standard JSON-RPC methods for interacting with the VM
   * @see {@link https://ethereum.github.io/execution-apis/api-documentation/ | JSON-RPC}
   */
  eth: {
    /**
     * Returns the current block number
     * Set the `tag` to a block number or block hash to get the balance at that block
     * Block tag defaults to 'pending' tag which is the optimistic state of the VM
     * @see {@link https://ethereum.github.io/execution-apis/api-documentation/ | JSON-RPC}
     * @example
     * const blockNumber = await tevm.eth.blockNumber()
     * console.log(blockNumber) // 0n
     */
    blockNumber: EthBlockNumberHandler
    /**
     * Executes a call without modifying the state
     * Set the `tag` to a block number or block hash to get the balance at that block
     * Block tag defaults to 'pending' tag which is the optimistic state of the VM
     * @see {@link https://ethereum.github.io/execution-apis/api-documentation/ | JSON-RPC}
     * @example
     * const res = await tevm.eth.call({to: '0x123...', data: '0x123...'})
     * console.log(res) // "0x..."
     */
    call: EthCallHandler
    /**
     * Returns the current chain id
     * Set the `tag` to a block number or block hash to get the balance at that block
     * Block tag defaults to 'pending' tag which is the optimistic state of the VM
     * @see {@link https://ethereum.github.io/execution-apis/api-documentation/ | JSON-RPC}
     * @example
     * const chainId = await tevm.eth.chainId()
     * console.log(chainId) // 10n
     */
    chainId: EthChainIdHandler
    /**
     * Returns code at a given address
     * Set the `tag` to a block number or block hash to get the balance at that block
     * Block tag defaults to 'pending' tag which is the optimistic state of the VM
     * @see {@link https://ethereum.github.io/execution-apis/api-documentation/ | JSON-RPC}
     * @example
     * const code = await tevm.eth.getCode({address: '0x123...'})
     */
    getCode: EthGetCodeHandler
    /**
     * Returns storage at a given address and slot
     * Set the `tag` to a block number or block hash to get the balance at that block
     * Block tag defaults to 'pending' tag which is the optimistic state of the VM
     * @see {@link https://ethereum.github.io/execution-apis/api-documentation/ | JSON-RPC}
     * @example
     * const storageValue = await tevm.eth.getStorageAt({address: '0x123...', position: 0})
     */
    getStorageAt: EthGetStorageAtHandler
    /**
     * Returns the current gas price
     * Set the `tag` to a block number or block hash to get the balance at that block
     * Block tag defaults to 'pending' tag which is the optimistic state of the VM
     * @see {@link https://ethereum.github.io/execution-apis/api-documentation/ | JSON-RPC}
     * @example
     * const gasPrice = await tevm.eth.gasPrice()
     * console.log(gasPrice) // 0n
     */
    gasPrice: EthGasPriceHandler
    /**
     * Returns the balance of a given address
     * Set the `tag` to a block number or block hash to get the balance at that block
     * Block tag defaults to 'pending' tag which is the optimistic state of the VM
     * @see {@link https://ethereum.github.io/execution-apis/api-documentation/ | JSON-RPC}
     * @example
     * const balance = await tevm.eth.getBalance({address: '0x123...', tag: 'pending'})
     * console.log(gasPrice) // 0n
     */
    getBalance: EthGetBalanceHandler
  }
  request(args: EthChainIdJsonRpcRequest): EthChainIdJsonRpcResponse
  // TODO move some of these hardcoded requests to the tevm procedures package
  request(args: { method: 'tevm_mode' }): 'fork' | 'proxy' | 'normal';
  on(eventName: 'connect', listener: () => void): this;
  on(eventName: 'disconnect', listener: () => void): this;
  // this event never happens is here for compatability
  on(eventName: 'accountsChanged', listener: (accounts: string[]) => void): this;
  // this event never happens is here for compatability
  on(eventName: 'chainChanged', listener: (networkId: string) => void): this;

  request(args: EthSignJsonRpcRequest): Promise<EthSignJsonRpcResponse>;
  request(args: EthAccountsJsonRpcRequest): Promise<EthAccountsJsonRpcResponse>;
  request(args: EthSignTransactionJsonRpcRequest): Promise<EthSignTransactionJsonRpcResponse>;
}


import type {
  EthCallJsonRpcResponse,
  // EthSignJsonRpcResponse,
  EthMiningJsonRpcResponse,
  EthChainIdJsonRpcResponse,
  EthGetCodeJsonRpcResponse,
  // EthGetLogsJsonRpcResponse,
  // EthSyncingJsonRpcResponse,
  // EthAccountsJsonRpcResponse,
  // EthCoinbaseJsonRpcResponse,
  EthGasPriceJsonRpcResponse,
  // EthHashrateJsonRpcResponse,
  // EthNewFilterJsonRpcResponse,
  EthGetBalanceJsonRpcResponse,
  EthBlockNumberJsonRpcResponse,
  // EthEstimateGasJsonRpcResponse,
  EthGetStorageAtJsonRpcResponse,
  // EthGetFilterLogsJsonRpcResponse,
  // EthGetBlockByHashJsonRpcResponse,
  // EthNewBlockFilterJsonRpcResponse,
  // EthProtocolVersionJsonRpcResponse,
  // EthSendTransactionJsonRpcResponse,
  // EthSignTransactionJsonRpcResponse,
  // EthUninstallFilterJsonRpcResponse,
  // EthGetBlockByNumberJsonRpcResponse,
  // EthGetFilterChangesJsonRpcResponse,
  // EthSendRawTransactionJsonRpcResponse,
  // EthGetTransactionCountJsonRpcResponse,
  // EthGetTransactionByHashJsonRpcResponse,
  // EthGetTransactionReceiptJsonRpcResponse,
  // EthGetUncleCountByBlockHashJsonRpcResponse,
  // EthGetUncleCountByBlockNumberJsonRpcResponse,
  // EthGetUncleByBlockHashAndIndexJsonRpcResponse,
  // EthNewPendingTransactionFilterJsonRpcResponse,
  // EthGetUncleByBlockNumberAndIndexJsonRpcResponse,
  // EthGetBlockTransactionCountByHashJsonRpcResponse,
  // EthGetBlockTransactionCountByNumberJsonRpcResponse,
  // EthGetTransactionByBlockHashAndIndexJsonRpcResponse,
  EthCallJsonRpcRequest,
  // EthSignJsonRpcRequest,
  EthMiningJsonRpcRequest,
  EthChainIdJsonRpcRequest,
  EthGetCodeJsonRpcRequest,
  // EthGetLogsJsonRpcRequest,
  //   EthSyncingJsonRpcRequest,
  // EthAccountsJsonRpcRequest,
  //   EthCoinbaseJsonRpcRequest,
  EthGasPriceJsonRpcRequest,
  //   EthHashrateJsonRpcRequest,
  //   EthNewFilterJsonRpcRequest,
  EthGetBalanceJsonRpcRequest,
  EthBlockNumberJsonRpcRequest,
  //   EthEstimateGasJsonRpcRequest,
  EthGetStorageAtJsonRpcRequest,
  //   EthGetFilterLogsJsonRpcRequest,
  //   EthGetBlockByHashJsonRpcRequest,
  //   EthNewBlockFilterJsonRpcRequest,
  //   EthProtocolVersionJsonRpcRequest,
  //   EthSendTransactionJsonRpcRequest,
  //   EthSignTransactionJsonRpcRequest,
  //   EthUninstallFilterJsonRpcRequest,
  //   EthGetBlockByNumberJsonRpcRequest,
  //   EthGetFilterChangesJsonRpcRequest,
  //   EthSendRawTransactionJsonRpcRequest,
  //   EthGetTransactionCountJsonRpcRequest,
  //   EthGetTransactionByHashJsonRpcRequest,
  //   EthGetTransactionReceiptJsonRpcRequest,
  //   EthGetUncleCountByBlockHashJsonRpcRequest,
  //   EthGetUncleCountByBlockNumberJsonRpcRequest,
  //   EthGetUncleByBlockHashAndIndexJsonRpcRequest,
  //   EthNewPendingTransactionFilterJsonRpcRequest,
  //   EthGetUncleByBlockNumberAndIndexJsonRpcRequest,
  //   EthGetBlockTransactionCountByHashJsonRpcRequest,
  //   EthGetBlockTransactionCountByNumberJsonRpcRequest,
  //   EthGetTransactionByBlockHashAndIndexJsonRpcRequest,
  //   EthGetTransactionByBlockNumberAndIndexJsonRpcRequest,
  //   EthGetTransactionByBlockNumberAndIndexJsonRpcResponse,
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

  request(args: EthBlockNumberJsonRpcRequest): Promise<EthBlockNumberJsonRpcResponse>;
  request(args: EthCallJsonRpcRequest): Promise<EthCallJsonRpcResponse>;
  request(args: EthChainIdJsonRpcRequest): Promise<EthChainIdJsonRpcResponse>;
  request(args: EthGasPriceJsonRpcRequest): Promise<EthGasPriceJsonRpcResponse>;
  request(args: EthGetBalanceJsonRpcRequest): Promise<EthGetBalanceJsonRpcResponse>;
  request(args: EthGetStorageAtJsonRpcRequest): Promise<EthGetStorageAtJsonRpcResponse>;
  request(args: EthGetCodeJsonRpcRequest): Promise<EthGetCodeJsonRpcResponse>;
  request(args: EthMiningJsonRpcRequest): Promise<EthMiningJsonRpcResponse>;
  // request(args: EthSignJsonRpcRequest): Promise<EthSignJsonRpcResponse>;
  // request(args: EthGetTransactionByBlockNumberAndIndexJsonRpcRequest): Promise<EthGetTransactionByBlockNumberAndIndexJsonRpcResponse>;
  // request(args: EthGetLogsJsonRpcRequest): Promise<EthGetLogsJsonRpcResponse>;
  // request(args: EthSyncingJsonRpcRequest): Promise<EthSyncingJsonRpcResponse>;
  // request(args: EthAccountsJsonRpcRequest): Promise<EthAccountsJsonRpcResponse>;
  // request(args: EthCoinbaseJsonRpcRequest): Promise<EthCoinbaseJsonRpcResponse>;
  // request(args: EthHashrateJsonRpcRequest): Promise<EthHashrateJsonRpcResponse>;
  // request(args: EthNewFilterJsonRpcRequest): Promise<EthNewFilterJsonRpcResponse>;
  // request(args: EthEstimateGasJsonRpcRequest): Promise<EthEstimateGasJsonRpcResponse>;
  // request(args: EthGetFilterLogsJsonRpcRequest): Promise<EthGetFilterLogsJsonRpcResponse>;
  // request(args: EthGetBlockByHashJsonRpcRequest): Promise<EthGetBlockByHashJsonRpcResponse>;
  // request(args: EthNewBlockFilterJsonRpcRequest): Promise<EthNewBlockFilterJsonRpcResponse>;
  // request(args: EthProtocolVersionJsonRpcRequest): Promise<EthProtocolVersionJsonRpcResponse>;
  // request(args: EthSendTransactionJsonRpcRequest): Promise<EthSendTransactionJsonRpcResponse>;
  // request(args: EthSignTransactionJsonRpcRequest): Promise<EthSignTransactionJsonRpcResponse>;
  // request(args: EthUninstallFilterJsonRpcRequest): Promise<EthUninstallFilterJsonRpcResponse>;
  // request(args: EthGetBlockByNumberJsonRpcRequest): Promise<EthGetBlockByNumberJsonRpcResponse>;
  // request(args: EthGetFilterChangesJsonRpcRequest): Promise<EthGetFilterChangesJsonRpcResponse>;
  // request(args: EthSendRawTransactionJsonRpcRequest): Promise<EthSendRawTransactionJsonRpcResponse>;
  // request(args: EthGetTransactionCountJsonRpcRequest): Promise<EthGetTransactionCountJsonRpcResponse>;
  // request(args: EthGetTransactionByHashJsonRpcRequest): Promise<EthGetTransactionByHashJsonRpcResponse>;
  // request(args: EthGetTransactionReceiptJsonRpcRequest): Promise<EthGetTransactionReceiptJsonRpcResponse>;
  // request(args: EthGetUncleCountByBlockHashJsonRpcRequest): Promise<EthGetUncleCountByBlockHashJsonRpcResponse>;
  // request(args: EthGetUncleCountByBlockNumberJsonRpcRequest): Promise<EthGetUncleCountByBlockNumberJsonRpcResponse>;
  // request(args: EthGetUncleByBlockHashAndIndexJsonRpcRequest): Promise<EthGetUncleByBlockHashAndIndexJsonRpcResponse>;
  // request(args: EthNewPendingTransactionFilterJsonRpcRequest): Promise<EthNewPendingTransactionFilterJsonRpcResponse>;
  // request(args: EthGetUncleByBlockNumberAndIndexJsonRpcRequest): Promise<EthGetUncleByBlockNumberAndIndexJsonRpcResponse>;
  // request(args: EthGetBlockTransactionCountByHashJsonRpcRequest): Promise<EthGetBlockTransactionCountByHashJsonRpcResponse>;
  // request(args: EthGetBlockTransactionCountByNumberJsonRpcRequest): Promise<EthGetBlockTransactionCountByNumberJsonRpcResponse>;
  // request(args: EthGetTransactionByBlockHashAndIndexJsonRpcRequest): Promise<EthGetTransactionByBlockHashAndIndexJsonRpcResponse>;
}


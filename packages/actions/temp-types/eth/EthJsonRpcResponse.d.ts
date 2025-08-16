import type { JsonRpcResponse } from '@tevm/jsonrpc';
import type { Address, Hex } from '@tevm/utils';
import type { BlockResult } from '../common/BlockResult.js';
import type { FilterLog } from '../common/FilterLog.js';
import type { TransactionReceiptResult } from '../common/TransactionReceiptResult.js';
import type { TransactionResult } from '../common/TransactionResult.js';
import type { SerializeToJson } from '../utils/SerializeToJson.js';
import type { EthBlockNumberResult } from './EthResult.js';
/**
 * JSON-RPC response for `eth_accounts` procedure
 */
export type EthAccountsJsonRpcResponse = JsonRpcResponse<'eth_accounts', Address[], string | number>;
/**
 * JSON-RPC response for `eth_blobBaseFee` procedure
 */
export type EthBlobBaseFeeJsonRpcResponse = JsonRpcResponse<'eth_blobBaseFee', Hex, string | number>;
/**
 * JSON-RPC response for `eth_blockNumber` procedure
 */
export type EthBlockNumberJsonRpcResponse = JsonRpcResponse<'eth_blockNumber', SerializeToJson<EthBlockNumberResult>, string | number>;
/**
 * JSON-RPC response for `eth_call` procedure
 */
export type EthCallJsonRpcResponse = JsonRpcResponse<'eth_call', Hex, string | number>;
/**
 * JSON-RPC response for `eth_chainId` procedure
 */
export type EthChainIdJsonRpcResponse = JsonRpcResponse<'eth_chainId', Hex, string | number>;
/**
 * JSON-RPC response for `eth_coinbase` procedure
 */
export type EthCoinbaseJsonRpcResponse = JsonRpcResponse<'eth_coinbase', Hex, string | number>;
/**
 * JSON-RPC response for `eth_estimateGas` procedure
 */
export type EthEstimateGasJsonRpcResponse = JsonRpcResponse<'eth_estimateGas', Hex, string | number>;
/**
 * JSON-RPC response for `eth_hashrate` procedure
 */
export type EthHashrateJsonRpcResponse = JsonRpcResponse<'eth_hashrate', Hex, string | number>;
/**
 * JSON-RPC response for `eth_gasPrice` procedure
 */
export type EthGasPriceJsonRpcResponse = JsonRpcResponse<'eth_gasPrice', Hex, string | number>;
/**
 * JSON-RPC response for `eth_getBalance` procedure
 */
export type EthGetBalanceJsonRpcResponse = JsonRpcResponse<'eth_getBalance', Hex, string | number>;
/**
 * JSON-RPC response for `eth_getBlockByHash` procedure
 */
export type EthGetBlockByHashJsonRpcResponse = JsonRpcResponse<'eth_getBlockByHash', BlockResult, string | number>;
/**
 * JSON-RPC response for `eth_getBlockByNumber` procedure
 */
export type EthGetBlockByNumberJsonRpcResponse = JsonRpcResponse<'eth_getBlockByNumber', BlockResult, string | number>;
/**
 * JSON-RPC response for `eth_getBlockTransactionCountByHash` procedure
 */
export type EthGetBlockTransactionCountByHashJsonRpcResponse = JsonRpcResponse<'eth_getBlockTransactionCountByHash', Hex, string | number>;
/**
 * JSON-RPC response for `eth_getBlockTransactionCountByNumber` procedure
 */
export type EthGetBlockTransactionCountByNumberJsonRpcResponse = JsonRpcResponse<'eth_getBlockTransactionCountByNumber', Hex, string | number>;
/**
 * JSON-RPC response for `eth_getCode` procedure
 */
export type EthGetCodeJsonRpcResponse = JsonRpcResponse<'eth_getCode', Hex, string | number>;
/**
 * JSON-RPC response for `eth_getFilterChanges` procedure
 */
export type EthGetFilterChangesJsonRpcResponse = JsonRpcResponse<'eth_getFilterChanges', Array<SerializeToJson<FilterLog>>, string | number>;
/**
 * JSON-RPC response for `eth_getFilterLogs` procedure
 */
export type EthGetFilterLogsJsonRpcResponse = JsonRpcResponse<'eth_getFilterLogs', Array<SerializeToJson<FilterLog>>, string | number>;
/**
 * JSON-RPC response for `eth_getLogs` procedure
 */
export type EthGetLogsJsonRpcResponse = JsonRpcResponse<'eth_getLogs', Array<SerializeToJson<SerializeToJson<FilterLog>>>, string | number>;
/**
 * JSON-RPC response for `eth_getStorageAt` procedure
 */
export type EthGetStorageAtJsonRpcResponse = JsonRpcResponse<'eth_getStorageAt', Hex, string | number>;
/**
 * JSON-RPC response for `eth_getTransactionCount` procedure
 */
export type EthGetTransactionCountJsonRpcResponse = JsonRpcResponse<'eth_getTransactionCount', Hex, string | number>;
/**
 * JSON-RPC response for `eth_getUncleCountByBlockHash` procedure
 */
export type EthGetUncleCountByBlockHashJsonRpcResponse = JsonRpcResponse<'eth_getUncleCountByBlockHash', Hex, string | number>;
/**
 * JSON-RPC response for `eth_getUncleCountByBlockNumber` procedure
 */
export type EthGetUncleCountByBlockNumberJsonRpcResponse = JsonRpcResponse<'eth_getUncleCountByBlockNumber', Hex, string | number>;
/**
 * JSON-RPC response for `eth_getTransactionByHash` procedure
 */
export type EthGetTransactionByHashJsonRpcResponse = JsonRpcResponse<'eth_getTransactionByHash', TransactionResult, string | number>;
/**
 * JSON-RPC response for `eth_getTransactionByBlockHashAndIndex` procedure
 */
export type EthGetTransactionByBlockHashAndIndexJsonRpcResponse = JsonRpcResponse<'eth_getTransactionByBlockHashAndIndex', TransactionResult, string | number>;
/**
 * JSON-RPC response for `eth_getTransactionByBlockNumberAndIndex` procedure
 */
export type EthGetTransactionByBlockNumberAndIndexJsonRpcResponse = JsonRpcResponse<'eth_getTransactionByBlockNumberAndIndex', TransactionResult, string | number>;
/**
 * JSON-RPC response for `eth_getTransactionReceipt` procedure
 */
export type EthGetTransactionReceiptJsonRpcResponse = JsonRpcResponse<'eth_getTransactionReceipt', SerializeToJson<TransactionReceiptResult> | null, string | number>;
/**
 * JSON-RPC response for `eth_getUncleByBlockHashAndIndex` procedure
 */
export type EthGetUncleByBlockHashAndIndexJsonRpcResponse = JsonRpcResponse<'eth_getUncleByBlockHashAndIndex', Hex, string | number>;
/**
 * JSON-RPC response for `eth_getUncleByBlockNumberAndIndex` procedure
 */
export type EthGetUncleByBlockNumberAndIndexJsonRpcResponse = JsonRpcResponse<'eth_getUncleByBlockNumberAndIndex', Hex, string | number>;
/**
 * JSON-RPC response for `eth_mining` procedure
 */
export type EthMiningJsonRpcResponse = JsonRpcResponse<'eth_mining', boolean, string | number>;
/**
 * JSON-RPC response for `eth_protocolVersion` procedure
 */
export type EthProtocolVersionJsonRpcResponse = JsonRpcResponse<'eth_protocolVersion', Hex, string | number>;
/**
 * JSON-RPC response for `eth_sendRawTransaction` procedure
 */
export type EthSendRawTransactionJsonRpcResponse = JsonRpcResponse<'eth_sendRawTransaction', Hex, string | number>;
/**
 * JSON-RPC response for `eth_sendTransaction` procedure
 */
export type EthSendTransactionJsonRpcResponse = JsonRpcResponse<'eth_sendTransaction', Hex, string | number>;
/**
 * JSON-RPC response for `eth_sign` procedure
 */
export type EthSignJsonRpcResponse = JsonRpcResponse<'eth_sign', Hex, string | number>;
/**
 * JSON-RPC response for `eth_signTransaction` procedure
 */
export type EthSignTransactionJsonRpcResponse = JsonRpcResponse<'eth_signTransaction', Hex, string | number>;
/**
 * JSON-RPC response for `eth_syncing` procedure
 */
export type EthSyncingJsonRpcResponse = JsonRpcResponse<'eth_syncing', boolean | {
    startingBlock: Hex;
    currentBlock: Hex;
    highestBlock: Hex;
    headedBytecodebytes?: Hex;
    healedBytecodes?: Hex;
    healedTrienodes?: Hex;
    healingBytecode?: Hex;
    healingTrienodes?: Hex;
    syncedBytecodeBytes?: Hex;
    syncedBytecodes?: Hex;
    syncedStorage?: Hex;
    syncedStorageBytes?: Hex;
    pulledStates: Hex;
    knownStates: Hex;
}, string | number>;
/**
 * JSON-RPC response for `eth_newFilter` procedure
 */
export type EthNewFilterJsonRpcResponse = JsonRpcResponse<'eth_newFilter', Hex, string | number>;
/**
 * JSON-RPC response for `eth_newBlockFilter` procedure
 */
export type EthNewBlockFilterJsonRpcResponse = JsonRpcResponse<'eth_newBlockFilter', Hex, string | number>;
/**
 * JSON-RPC response for `eth_newPendingTransactionFilter` procedure
 */
export type EthNewPendingTransactionFilterJsonRpcResponse = JsonRpcResponse<'eth_newPendingTransactionFilter', Hex, string | number>;
/**
 * JSON-RPC response for `eth_uninstallFilter` procedure
 */
export type EthUninstallFilterJsonRpcResponse = JsonRpcResponse<'eth_uninstallFilter', boolean, string | number>;
/**
 * JSON-RPC response for `eth_createAccessList` procedure
 */
export type EthCreateAccessListJsonRpcResponse = JsonRpcResponse<'eth_createAccessList', {
    accessList: Array<{
        address: Address;
        storageKeys: Hex[];
    }>;
    gasUsed: Hex;
}, string | number>;
//# sourceMappingURL=EthJsonRpcResponse.d.ts.map
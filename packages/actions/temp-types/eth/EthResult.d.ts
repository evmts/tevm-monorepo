/***
 * TODO I didn't update any of these jsdocs
 * TODO some of these types are not deserialized and/or don't match viem types and will
 * need to be updated as t hey are implemented
 */
import type { BlockResult } from '../common/BlockResult.js';
import type { FilterLog } from '../common/FilterLog.js';
import type { TransactionReceiptResult } from '../common/TransactionReceiptResult.js';
import type { TransactionResult } from '../common/TransactionResult.js';
import type { Address, Hex } from '../common/index.js';
export type EthAccountsResult = Array<Address>;
/**
 * JSON-RPC response for `eth_blockNumber` procedure
 */
export type EthBlockNumberResult = bigint;
/**
 * JSON-RPC response for `eth_call` procedure
 */
export type EthCallResult = Hex;
/**
 * JSON-RPC response for `eth_chainId` procedure
 */
export type EthChainIdResult = bigint;
/**
 * JSON-RPC response for `eth_coinbase` procedure
 */
export type EthCoinbaseResult = Address;
/**
 * JSON-RPC response for `eth_estimateGas` procedure
 */
export type EthEstimateGasResult = bigint;
/**
 * JSON-RPC response for `eth_hashrate` procedure
 */
export type EthHashrateResult = Hex;
/**
 * JSON-RPC response for `eth_gasPrice` procedure
 */
export type EthGasPriceResult = bigint;
/**
 * JSON-RPC response for `eth_getBalance` procedure
 */
export type EthGetBalanceResult = bigint;
/**
 * JSON-RPC response for `eth_getBlockByHash` procedure
 */
export type EthGetBlockByHashResult = BlockResult;
/**
 * JSON-RPC response for `eth_getBlockByNumber` procedure
 */
export type EthGetBlockByNumberResult = BlockResult;
/**
 * JSON-RPC response for `eth_getBlockTransactionCountByHash` procedure
 */
export type EthGetBlockTransactionCountByHashResult = Hex;
/**
 * JSON-RPC response for `eth_getBlockTransactionCountByNumber` procedure
 */
export type EthGetBlockTransactionCountByNumberResult = Hex;
/**
 * JSON-RPC response for `eth_getCode` procedure
 */
export type EthGetCodeResult = Hex;
/**
 * JSON-RPC response for `eth_getFilterChanges` procedure
 */
export type EthGetFilterChangesResult = Array<FilterLog>;
/**
 * JSON-RPC response for `eth_getFilterLogs` procedure
 */
export type EthGetFilterLogsResult = Array<FilterLog>;
/**
 * JSON-RPC response for `eth_getLogs` procedure
 */
export type EthGetLogsResult = Array<FilterLog>;
/**
 * JSON-RPC response for `eth_getStorageAt` procedure
 */
export type EthGetStorageAtResult = Hex;
/**
 * JSON-RPC response for `eth_getTransactionCount` procedure
 */
export type EthGetTransactionCountResult = Hex;
/**
 * JSON-RPC response for `eth_getUncleCountByBlockHash` procedure
 */
export type EthGetUncleCountByBlockHashResult = Hex;
/**
 * JSON-RPC response for `eth_getUncleCountByBlockNumber` procedure
 */
export type EthGetUncleCountByBlockNumberResult = Hex;
/**
 * JSON-RPC response for `eth_getTransactionByHash` procedure
 */
export type EthGetTransactionByHashResult = TransactionResult;
/**
 * JSON-RPC response for `eth_getTransactionByBlockHashAndIndex` procedure
 */
export type EthGetTransactionByBlockHashAndIndexResult = TransactionResult;
/**
 * JSON-RPC response for `eth_getTransactionByBlockNumberAndIndex` procedure
 */
export type EthGetTransactionByBlockNumberAndIndexResult = TransactionResult;
/**
 * JSON-RPC response for `eth_getTransactionReceipt` procedure
 */
export type EthGetTransactionReceiptResult = TransactionReceiptResult | null;
/**
 * JSON-RPC response for `eth_getUncleByBlockHashAndIndex` procedure
 */
export type EthGetUncleByBlockHashAndIndexResult = Hex;
/**
 * JSON-RPC response for `eth_getUncleByBlockNumberAndIndex` procedure
 */
export type EthGetUncleByBlockNumberAndIndexResult = Hex;
/**
 * JSON-RPC response for `eth_mining` procedure
 */
export type EthMiningResult = boolean;
/**
 * JSON-RPC response for `eth_protocolVersion` procedure
 */
export type EthProtocolVersionResult = Hex;
/**
 * JSON-RPC response for `eth_sendRawTransaction` procedure
 */
export type EthSendRawTransactionResult = Hex;
/**
 * JSON-RPC response for `eth_sendTransaction` procedure
 */
export type EthSendTransactionResult = Hex;
/**
 * JSON-RPC response for `eth_sign` procedure
 */
export type EthSignResult = Hex;
/**
 * JSON-RPC response for `eth_signTransaction` procedure
 */
export type EthSignTransactionResult = Hex;
/**
 * JSON-RPC response for `eth_syncing` procedure
 */
export type EthSyncingResult = boolean | {
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
};
/**
 * JSON-RPC response for `eth_newFilter` procedure
 */
export type EthNewFilterResult = Hex;
/**
 * JSON-RPC response for `eth_newBlockFilter` procedure
 */
export type EthNewBlockFilterResult = Hex;
/**
 * JSON-RPC response for `eth_newPendingTransactionFilter` procedure
 */
export type EthNewPendingTransactionFilterResult = Hex;
/**
 * JSON-RPC response for `eth_uninstallFilter` procedure
 */
export type EthUninstallFilterResult = boolean;
//# sourceMappingURL=EthResult.d.ts.map
export function createHandlers(client: import("@tevm/node").TevmNode): {
    debug_traceBlock: import("./debug/DebugProcedure.js").DebugTraceBlockProcedure<"callTracer" | "prestateTracer", boolean>;
    debug_traceBlockByHash: import("./debug/DebugProcedure.js").DebugTraceBlockProcedure<"callTracer" | "prestateTracer", boolean>;
    debug_traceBlockByNumber: import("./debug/DebugProcedure.js").DebugTraceBlockProcedure<"callTracer" | "prestateTracer", boolean>;
    debug_traceCall: import("./debug/DebugProcedure.js").DebugTraceCallProcedure<"callTracer" | "prestateTracer", boolean>;
    debug_traceTransaction: import("./debug/DebugProcedure.js").DebugTraceTransactionProcedure<"callTracer" | "prestateTracer", boolean>;
    debug_traceState: import("./debug/DebugProcedure.js").DebugTraceStateProcedure<readonly ("blockchain" | "blockchain.blocksByNumber" | "blockchain.initOptions" | "evm" | "evm.opcodes" | "evm.precompiles" | "evm.common" | "evm.common.eips" | "evm.common.hardfork" | "evm.common.consensus" | "node" | "node.status" | "node.mode" | "node.miningConfig" | "node.filters" | "node.impersonatedAccount" | "pool" | "pool.pool" | "pool.txsByHash" | "pool.txsByNonce" | "pool.txsInNonceOrder" | "pool.txsInPool" | "stateManager" | "stateManager.storage" | "stateManager.stateRoots")[]>;
    anvil_deal: import("./index.js").AnvilDealProcedure;
    anvil_setCode: import("./index.js").AnvilSetCodeProcedure;
    anvil_setBalance: import("./index.js").AnvilSetBalanceProcedure;
    anvil_setNonce: import("./index.js").AnvilSetNonceProcedure;
    anvil_setChainId: import("./index.js").EthChainIdHandler;
    anvil_getAutomine: import("./index.js").AnvilGetAutomineProcedure;
    anvil_setCoinbase: import("./index.js").AnvilSetCoinbaseProcedure;
    anvil_mine: import("./index.js").MineJsonRpcProcedure;
    anvil_reset: import("./index.js").AnvilResetProcedure;
    anvil_dropTransaction: import("./index.js").AnvilDropTransactionProcedure;
    anvil_dumpState: import("./index.js").AnvilDumpStateProcedure;
    anvil_loadState: import("./index.js").AnvilLoadStateProcedure;
    anvil_setStorageAt: import("./index.js").AnvilSetStorageAtProcedure;
    anvil_impersonateAccount: import("./index.js").AnvilImpersonateAccountProcedure;
    anvil_stopImpersonatingAccount: import("./index.js").AnvilStopImpersonatingAccountProcedure;
    eth_blockNumber: import("./index.js").EthBlockNumberJsonRpcProcedure;
    eth_chainId: import("./index.js").EthChainIdJsonRpcProcedure;
    eth_call: import("./index.js").EthCallJsonRpcProcedure;
    eth_createAccessList: import("./index.js").EthCreateAccessListJsonRpcProcedure;
    eth_getCode: import("./index.js").EthGetCodeJsonRpcProcedure;
    eth_getStorageAt: import("./index.js").EthGetStorageAtJsonRpcProcedure;
    eth_gasPrice: import("./index.js").EthGasPriceJsonRpcProcedure;
    eth_getBalance: import("./index.js").EthGetBalanceJsonRpcProcedure;
    eth_coinbase: import("./index.js").EthCoinbaseJsonRpcProcedure;
    eth_mining: (request: any) => {
        id?: any;
        result: boolean;
        method: any;
        jsonrpc: string;
    };
    eth_syncing: (request: any) => {
        id?: any;
        result: boolean;
        method: any;
        jsonrpc: string;
    };
    eth_sendTransaction: import("./index.js").EthSendTransactionJsonRpcProcedure;
    eth_sendRawTransaction: import("./index.js").EthSendRawTransactionJsonRpcProcedure;
    eth_estimateGas: import("./index.js").EthEstimateGasJsonRpcProcedure;
    eth_getTransactionReceipt: import("./index.js").EthGetTransactionReceiptJsonRpcProcedure;
    eth_getLogs: import("./index.js").EthGetLogsJsonRpcProcedure;
    eth_getBlockByHash: import("./index.js").EthGetBlockByHashJsonRpcProcedure;
    eth_getBlockByNumber: import("./index.js").EthGetBlockByNumberJsonRpcProcedure;
    eth_getBlockTransactionCountByHash: import("./index.js").EthGetBlockTransactionCountByHashJsonRpcProcedure;
    eth_getBlockTransactionCountByNumber: import("./index.js").EthGetBlockTransactionCountByNumberJsonRpcProcedure;
    eth_getTransactionByHash: import("./index.js").EthGetTransactionByHashJsonRpcProcedure;
    eth_getTransactionByBlockHashAndIndex: import("./index.js").EthGetTransactionByBlockHashAndIndexJsonRpcProcedure;
    eth_getTransactionByBlockNumberAndIndex: import("./index.js").EthGetTransactionByBlockNumberAndIndexJsonRpcProcedure;
    eth_protocolVersion: import("./index.js").EthProtocolVersionJsonRpcProcedure;
    eth_getTransactionCount: import("./index.js").EthGetTransactionCountJsonRpcProcedure;
    eth_newFilter: import("./index.js").EthNewFilterJsonRpcProcedure;
    eth_getFilterLogs: import("./index.js").EthGetFilterLogsJsonRpcProcedure;
    eth_newBlockFilter: import("./index.js").EthNewBlockFilterJsonRpcProcedure;
    eth_uninstallFilter: import("./index.js").EthUninstallFilterJsonRpcProcedure;
    eth_getFilterChanges: import("./index.js").EthGetFilterChangesJsonRpcProcedure;
    eth_newPendingTransactionFilter: import("./index.js").EthNewPendingTransactionFilterJsonRpcProcedure;
    eth_blobBaseFee: import("./index.js").EthBlobBaseFeeJsonRpcProcedure;
    tevm_call: import("./index.js").CallJsonRpcProcedure;
    /**
     * @param {any} request
     */
    tevm_contract: (request: any) => any;
    tevm_getAccount: import("./index.js").GetAccountJsonRpcProcedure;
    tevm_setAccount: import("./index.js").SetAccountJsonRpcProcedure;
    tevm_dumpState: import("./index.js").DumpStateJsonRpcProcedure;
    tevm_loadState: import("./index.js").LoadStateJsonRpcProcedure;
    tevm_miner: import("./index.js").MineJsonRpcProcedure;
};
export type RequestHandlers = ReturnType<typeof createHandlers>;
//# sourceMappingURL=createHandlers.d.ts.map
import * as _tevm_actions from '@tevm/actions';
import { CallParams, BaseCallParams, SetAccountParams, AnvilGetAutomineParams, AnvilResetParams, AnvilDropTransactionParams, AnvilDumpStateParams, AnvilLoadStateParams, DebugTraceTransactionParams, DebugTraceCallParams, FilterParams, EthBlockNumberResult, BlockResult, FilterLog, TransactionResult, TransactionReceiptResult, ethSignTransactionHandler, gasPriceHandler, getBalanceHandler, getCodeHandler, AnvilImpersonateAccountResult, AnvilStopImpersonatingAccountResult, AnvilGetAutomineResult, AnvilMineResult, AnvilResetResult, AnvilDropTransactionResult, AnvilSetBalanceResult, AnvilSetCodeResult, AnvilSetNonceResult, AnvilSetStorageAtResult, AnvilSetChainIdResult, AnvilDumpStateResult, AnvilLoadStateResult, DebugTraceTransactionResult, DebugTraceCallResult, CallResult, TevmCallError, TevmDumpStateError, GetAccountResult, TevmGetAccountError, LoadStateResult, TevmLoadStateError, MineResult, TevmMineError, TevmScriptError, SetAccountResult, TevmSetAccountError } from '@tevm/actions';
import { JsonRpcRequest, JsonRpcResponse } from '@tevm/jsonrpc';
import * as _tevm_utils from '@tevm/utils';
import { Hex, Address as Address$1, BlockTag as BlockTag$1 } from '@tevm/utils';
import { ParameterizedTevmState } from '@tevm/state';
import * as _tevm_node from '@tevm/node';
import * as _tevm_block from '@tevm/block';
import * as _tevm_tx from '@tevm/tx';

type JsonSerializable = bigint | string | number | boolean | null | JsonSerializableArray | JsonSerializableObject | JsonSerializableSet | (Error & {
    code: number | string;
});
type JsonSerializableArray = ReadonlyArray<JsonSerializable>;
type JsonSerializableObject = {
    [key: string]: JsonSerializable;
};
type JsonSerializableSet<T extends bigint | string | number | boolean = bigint | string | number | boolean> = Set<T>;
type BigIntToHex<T> = T extends bigint ? Hex : T;
type SetToHex<T> = T extends Set<any> ? Hex : T;
type SerializeToJson<T> = T extends Error & {
    code: infer TCode;
} ? {
    code: TCode;
    message: T['message'];
} : T extends JsonSerializableSet<infer S> ? ReadonlyArray<S> : T extends JsonSerializableObject ? {
    [P in keyof T]: SerializeToJson<T[P]>;
} : T extends JsonSerializableArray ? SerializeToJson<T[number]>[] : BigIntToHex<SetToHex<T>>;

/**
 * JSON-RPC request for `tevm_call`
 */
type CallJsonRpcRequest = JsonRpcRequest<'tevm_call', [
    params: SerializeToJson<Omit<CallParams, 'stateOverrideSet' | 'blockOverrideSet'>>,
    stateOverrideSet?: SerializeToJson<CallParams['stateOverrideSet']>,
    blockOverrideSet?: SerializeToJson<CallParams['blockOverrideSet']>
]>;

/**
 * The JSON-RPC request for the `tevm_dumpState` method
 */
type DumpStateJsonRpcRequest = JsonRpcRequest<'tevm_dumpState', []>;

/**
 * The base parameters shared across all actions
 */
type BaseParams<TThrowOnFail extends boolean = boolean> = {
    /**
     * Whether to throw on errors or return errors as value on the 'errors' property
     * Defaults to `true`
     */
    readonly throwOnFail?: TThrowOnFail;
};

/**
 * An ethereum address represented as a hex string
 * @see https://abitype.dev/config#addresstype for configuration options to change type to being a string if preferred
 */
type Address = Address$1;

type BlockTag = 'latest' | 'earliest' | 'pending' | 'safe' | 'finalized';

type BlockParam = BlockTag | Hex | bigint;

/**
 * Tevm params to get an account
 * @example
 * const getAccountParams: import('@tevm/api').GetAccountParams = {
 *   address: '0x...',
 * }
 */
type GetAccountParams<TThrowOnFail extends boolean = boolean> = BaseParams<TThrowOnFail> & {
    /**
     * Address of account
     */
    readonly address: Address;
    /**
     * If true the handler will return the contract storage
     * It only returns storage that happens to be cached in the vm
     * In fork mode if storage hasn't yet been cached it will not be returned
     * This defaults to false
     * Be aware that this can be very expensive if a contract has a lot of storage
     */
    readonly returnStorage?: boolean;
    /**
     * Block tag to fetch account from
     * - bigint for block number
     * - hex string for block hash
     * - 'latest', 'earliest', 'pending', 'forked' etc. tags
     */
    readonly blockTag?: BlockParam;
};

/**
 * JSON-RPC request for `tevm_getAccount` method
 */
type GetAccountJsonRpcRequest = JsonRpcRequest<'tevm_getAccount', [SerializeToJson<GetAccountParams>]>;

/**
 * The parameters for the `tevm_loadState` method
 */
type SerializedParams = {
    state: SerializeToJson<ParameterizedTevmState>;
};
/**
 * The JSON-RPC request for the `tevm_loadState` method
 */
type LoadStateJsonRpcRequest = JsonRpcRequest<'tevm_loadState', [SerializedParams]>;

/**
 * JSON-RPC request for `tevm_mine` method
 */
type MineJsonRpcRequest = JsonRpcRequest<'tevm_mine', [blockCount: Hex, interval: Hex]>;

/**
 * @deprecated Use CallJsonRpcProcedure instead
 * The JSON-RPC request for the `tevm_script` method
 */
type ScriptJsonRpcRequest = JsonRpcRequest<'tevm_script', 
/**
 * The parameters for the `tevm_script` method
 * The higher level handler method takes abi functionName and args
 * But to serialize it over jsonrpc we need to serialize the data
 * the same way normal contract calls are serialized into functionData
 */
[
    params: SerializeToJson<Omit<BaseCallParams, 'stateOverrideSet' | 'blockOverrideSet'>> & {
        /**
         * The raw call data
         */
        data: Hex;
        /**
         * The deployed bytecode of the contract.
         */
        deployedBytecode: Hex;
    },
    stateOverrideSet?: SerializeToJson<BaseCallParams['stateOverrideSet']>,
    blockOverrideSet?: SerializeToJson<BaseCallParams['blockOverrideSet']>
]>;

/**
 * JSON-RPC request for `tevm_setAccount` method
 */
type SetAccountJsonRpcRequest = JsonRpcRequest<'tevm_setAccount', [SerializeToJson<SetAccountParams>]>;

/**
 * A Tevm JSON-RPC request
 * `tevm_account`, `tevm_call`, `tevm_contract`, `tevm_script`
 */
type TevmJsonRpcRequest = GetAccountJsonRpcRequest | SetAccountJsonRpcRequest | CallJsonRpcRequest | ScriptJsonRpcRequest | LoadStateJsonRpcRequest | DumpStateJsonRpcRequest | MineJsonRpcRequest;

/**
 * JSON-RPC request for `anvil_impersonateAccount` method
 */
type AnvilImpersonateAccountJsonRpcRequest = JsonRpcRequest<'anvil_impersonateAccount', [Address$1]>;
/**
 * JSON-RPC request for `anvil_stopImpersonatingAccount` method
 */
type AnvilStopImpersonatingAccountJsonRpcRequest = JsonRpcRequest<'anvil_stopImpersonatingAccount', [Address$1]>;
/**
 * JSON-RPC request for `anvil_autoImpersonateAccount` method
 * Not included atm because tevm_call supports it and i was getting methodNotFound errors trying it in anvil
 */
/**
 * JSON-RPC request for `anvil_getAutomine` method
 */
type AnvilGetAutomineJsonRpcRequest = JsonRpcRequest<'anvil_getAutomine', [
    SerializeToJson<AnvilGetAutomineParams>
]>;
/**
 * JSON-RPC request for `anvil_setCoinbase` method
 * Not included atm because tevm_call supports it and i was getting methodNotFound errors trying it in anvil
 */
type AnvilSetCoinbaseJsonRpcRequest = JsonRpcRequest<'anvil_setCoinbase', [Address$1]>;
/**
 * JSON-RPC request for `anvil_mine` method
 */
type AnvilMineJsonRpcRequest = JsonRpcRequest<'anvil_mine', [blockCount: Hex, interval: Hex]>;
/**
 * JSON-RPC request for `anvil_reset` method
 */
type AnvilResetJsonRpcRequest = JsonRpcRequest<'anvil_reset', [SerializeToJson<AnvilResetParams>]>;
/**
 * JSON-RPC request for `anvil_dropTransaction` method
 */
type AnvilDropTransactionJsonRpcRequest = JsonRpcRequest<'anvil_dropTransaction', [
    SerializeToJson<AnvilDropTransactionParams>
]>;
/**
 * JSON-RPC request for `anvil_setBalance` method
 */
type AnvilSetBalanceJsonRpcRequest = JsonRpcRequest<'anvil_setBalance', [address: Address$1, balance: Hex]>;
/**
 * JSON-RPC request for `anvil_setCode` method
 */
type AnvilSetCodeJsonRpcRequest = JsonRpcRequest<'anvil_setCode', [account: Address$1, deployedBytecode: Hex]>;
/**
 * JSON-RPC request for `anvil_setNonce` method
 */
type AnvilSetNonceJsonRpcRequest = JsonRpcRequest<'anvil_setNonce', [address: Address$1, nonce: Hex]>;
/**
 * JSON-RPC request for `anvil_setStorageAt` method
 */
type AnvilSetStorageAtJsonRpcRequest = JsonRpcRequest<'anvil_setStorageAt', [
    address: Address$1,
    slot: Hex,
    value: Hex
]>;
/**
 * JSON-RPC request for `anvil_setChainId` method
 */
type AnvilSetChainIdJsonRpcRequest = JsonRpcRequest<'anvil_setChainId', [Hex]>;
/**
 * JSON-RPC request for `anvil_dumpState` method
 */
type AnvilDumpStateJsonRpcRequest = JsonRpcRequest<'anvil_dumpState', [SerializeToJson<AnvilDumpStateParams>]>;
/**
 * JSON-RPC request for `anvil_loadState` method
 */
type AnvilLoadStateJsonRpcRequest = JsonRpcRequest<'anvil_loadState', [SerializeToJson<AnvilLoadStateParams>]>;
type AnvilJsonRpcRequest = AnvilImpersonateAccountJsonRpcRequest | AnvilStopImpersonatingAccountJsonRpcRequest | AnvilGetAutomineJsonRpcRequest | AnvilMineJsonRpcRequest | AnvilResetJsonRpcRequest | AnvilDropTransactionJsonRpcRequest | AnvilSetBalanceJsonRpcRequest | AnvilSetCodeJsonRpcRequest | AnvilSetNonceJsonRpcRequest | AnvilSetStorageAtJsonRpcRequest | AnvilSetChainIdJsonRpcRequest | AnvilDumpStateJsonRpcRequest | AnvilLoadStateJsonRpcRequest | AnvilSetCoinbaseJsonRpcRequest;

/**
 * JSON-RPC request for `debug_traceTransaction` method
 */
type DebugTraceTransactionJsonRpcRequest = JsonRpcRequest<'debug_traceTransaction', [
    SerializeToJson<DebugTraceTransactionParams>
]>;
/**
 * JSON-RPC request for `debug_traceCall` method
 */
type DebugTraceCallJsonRpcRequest = JsonRpcRequest<'debug_traceCall', [SerializeToJson<DebugTraceCallParams>]>;
type DebugJsonRpcRequest = DebugTraceTransactionJsonRpcRequest | DebugTraceCallJsonRpcRequest;

/**
 * the transaction call object for methods like `eth_call`
 */
type JsonRpcTransaction = {
    /**
     * The address from which the transaction is sent
     */
    from: Address$1;
    /**
     * The address to which the transaction is addressed
     */
    to?: Address$1;
    /**
     * The integer of gas provided for the transaction execution
     */
    gas?: Hex;
    /**
     * The integer of gasPrice used for each paid gas encoded as hexadecimal
     */
    gasPrice?: Hex;
    /**
     * The integer of value sent with this transaction encoded as hexadecimal
     */
    value?: Hex;
    /**
     * The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation
     */
    data?: Hex;
};
/**
 * JSON-RPC request for `eth_accounts` procedure
 */
type EthAccountsJsonRpcRequest = JsonRpcRequest<'eth_accounts', readonly []>;
/**
 * JSON-RPC request for `eth_blockNumber` procedure
 */
type EthBlockNumberJsonRpcRequest = JsonRpcRequest<'eth_blockNumber', readonly []>;
/**
 * JSON-RPC request for `eth_call` procedure
 */
type EthCallJsonRpcRequest = JsonRpcRequest<'eth_call', readonly [
    tx: JsonRpcTransaction,
    tag: BlockTag$1 | Hex,
    stateOverrideSet?: SerializeToJson<BaseCallParams['stateOverrideSet']>,
    blockOverrideSet?: SerializeToJson<BaseCallParams['blockOverrideSet']>
]>;
/**
 * JSON-RPC request for `eth_chainId` procedure
 */
type EthChainIdJsonRpcRequest = JsonRpcRequest<'eth_chainId', readonly []>;
/**
 * JSON-RPC request for `eth_coinbase` procedure
 */
type EthCoinbaseJsonRpcRequest = JsonRpcRequest<'eth_coinbase', readonly []>;
/**
 * JSON-RPC request for `eth_estimateGas` procedure
 */
type EthEstimateGasJsonRpcRequest = JsonRpcRequest<'eth_estimateGas', readonly [
    tx: JsonRpcTransaction,
    tag?: BlockTag$1 | Hex,
    stateOverrideSet?: SerializeToJson<BaseCallParams['stateOverrideSet']>,
    blockOverrideSet?: SerializeToJson<BaseCallParams['blockOverrideSet']>
]>;
/**
 * JSON-RPC request for `eth_hashrate` procedure
 */
type EthHashrateJsonRpcRequest = JsonRpcRequest<'eth_hashrate', readonly []>;
/**
 * JSON-RPC request for `eth_gasPrice` procedure
 */
type EthGasPriceJsonRpcRequest = JsonRpcRequest<'eth_gasPrice', readonly []>;
/**
 * JSON-RPC request for `eth_getBalance` procedure
 */
type EthGetBalanceJsonRpcRequest = JsonRpcRequest<'eth_getBalance', [address: Address$1, tag: BlockTag$1 | Hex]>;
/**
 * JSON-RPC request for `eth_getBlockByHash` procedure
 */
type EthGetBlockByHashJsonRpcRequest = JsonRpcRequest<'eth_getBlockByHash', readonly [blockHash: Hex, fullTransactionObjects: boolean]>;
/**
 * JSON-RPC request for `eth_getBlockByNumber` procedure
 */
type EthGetBlockByNumberJsonRpcRequest = JsonRpcRequest<'eth_getBlockByNumber', readonly [tag: BlockTag$1 | Hex, fullTransactionObjects: boolean]>;
/**
 * JSON-RPC request for `eth_getBlockTransactionCountByHash` procedure
 */
type EthGetBlockTransactionCountByHashJsonRpcRequest = JsonRpcRequest<'eth_getBlockTransactionCountByHash', readonly [hash: Hex]>;
/**
 * JSON-RPC request for `eth_getBlockTransactionCountByNumber` procedure
 */
type EthGetBlockTransactionCountByNumberJsonRpcRequest = JsonRpcRequest<'eth_getBlockTransactionCountByNumber', readonly [tag: BlockTag$1 | Hex]>;
/**
 * JSON-RPC request for `eth_getCode` procedure
 */
type EthGetCodeJsonRpcRequest = JsonRpcRequest<'eth_getCode', readonly [address: Address$1, tag: BlockTag$1 | Hex]>;
/**
 * JSON-RPC request for `eth_getFilterChanges` procedure
 */
type EthGetFilterChangesJsonRpcRequest = JsonRpcRequest<'eth_getFilterChanges', [filterId: Hex]>;
/**
 * JSON-RPC request for `eth_getFilterLogs` procedure
 */
type EthGetFilterLogsJsonRpcRequest = JsonRpcRequest<'eth_getFilterLogs', [filterId: Hex]>;
/**
 * JSON-RPC request for `eth_getLogs` procedure
 */
type EthGetLogsJsonRpcRequest = JsonRpcRequest<'eth_getLogs', [filterParams: FilterParams]>;
/**
 * JSON-RPC request for `eth_getStorageAt` procedure
 */
type EthGetStorageAtJsonRpcRequest = JsonRpcRequest<'eth_getStorageAt', readonly [address: Address$1, position: Hex, tag: BlockTag$1 | Hex]>;
/**
 * JSON-RPC request for `eth_getTransactionCount` procedure
 */
type EthGetTransactionCountJsonRpcRequest = JsonRpcRequest<'eth_getTransactionCount', readonly [address: Address$1, tag: BlockTag$1 | Hex]>;
/**
 * JSON-RPC request for `eth_getUncleCountByBlockHash` procedure
 */
type EthGetUncleCountByBlockHashJsonRpcRequest = JsonRpcRequest<'eth_getUncleCountByBlockHash', readonly [hash: Hex]>;
/**
 * JSON-RPC request for `eth_getUncleCountByBlockNumber` procedure
 */
type EthGetUncleCountByBlockNumberJsonRpcRequest = JsonRpcRequest<'eth_getUncleCountByBlockNumber', readonly [tag: BlockTag$1 | Hex]>;
/**
 * JSON-RPC request for `eth_getTransactionByHash` procedure
 */
type EthGetTransactionByHashJsonRpcRequest = JsonRpcRequest<'eth_getTransactionByHash', readonly [data: Hex]>;
/**
 * JSON-RPC request for `eth_getTransactionByBlockHashAndIndex` procedure
 */
type EthGetTransactionByBlockHashAndIndexJsonRpcRequest = JsonRpcRequest<'eth_getTransactionByBlockHashAndIndex', readonly [tag: Hex, index: Hex]>;
/**
 * JSON-RPC request for `eth_getTransactionByBlockNumberAndIndex` procedure
 */
type EthGetTransactionByBlockNumberAndIndexJsonRpcRequest = JsonRpcRequest<'eth_getTransactionByBlockNumberAndIndex', readonly [tag: BlockTag$1 | Hex, index: Hex]>;
/**
 * JSON-RPC request for `eth_getTransactionReceipt` procedure
 */
type EthGetTransactionReceiptJsonRpcRequest = JsonRpcRequest<'eth_getTransactionReceipt', [txHash: Hex]>;
/**
 * JSON-RPC request for `eth_getUncleByBlockHashAndIndex` procedure
 */
type EthGetUncleByBlockHashAndIndexJsonRpcRequest = JsonRpcRequest<'eth_getUncleByBlockHashAndIndex', readonly [blockHash: Hex, uncleIndex: Hex]>;
/**
 * JSON-RPC request for `eth_getUncleByBlockNumberAndIndex` procedure
 */
type EthGetUncleByBlockNumberAndIndexJsonRpcRequest = JsonRpcRequest<'eth_getUncleByBlockNumberAndIndex', readonly [tag: BlockTag$1 | Hex, uncleIndex: Hex]>;
/**
 * JSON-RPC request for `eth_mining` procedure
 */
type EthMiningJsonRpcRequest = JsonRpcRequest<'eth_mining', readonly []>;
/**
 * JSON-RPC request for `eth_protocolVersion` procedure
 */
type EthProtocolVersionJsonRpcRequest = JsonRpcRequest<'eth_protocolVersion', readonly []>;
/**
 * JSON-RPC request for `eth_sendRawTransaction` procedure
 */
type EthSendRawTransactionJsonRpcRequest = JsonRpcRequest<'eth_sendRawTransaction', [data: Hex]>;
/**
 * JSON-RPC request for `eth_sendTransaction` procedure
 */
type EthSendTransactionJsonRpcRequest = JsonRpcRequest<'eth_sendTransaction', [tx: JsonRpcTransaction]>;
/**
 * JSON-RPC request for `eth_sign` procedure
 */
type EthSignJsonRpcRequest = JsonRpcRequest<'eth_sign', [address: Address$1, message: Hex]>;
/**
 * JSON-RPC request for `eth_signTransaction` procedure
 */
type EthSignTransactionJsonRpcRequest = JsonRpcRequest<'eth_signTransaction', [
    {
        from: Address$1;
        to?: Address$1;
        gas?: Hex;
        gasPrice?: Hex;
        value?: Hex;
        data?: Hex;
        nonce?: Hex;
        chainId?: Hex;
    }
]>;
/**
 * JSON-RPC request for `eth_syncing` procedure
 */
type EthSyncingJsonRpcRequest = JsonRpcRequest<'eth_syncing', readonly []>;
/**
 * JSON-RPC request for `eth_newFilter` procedure
 */
type EthNewFilterJsonRpcRequest = JsonRpcRequest<'eth_newFilter', [SerializeToJson<FilterParams>]>;
/**
 * JSON-RPC request for `eth_newBlockFilter` procedure
 */
type EthNewBlockFilterJsonRpcRequest = JsonRpcRequest<'eth_newBlockFilter', readonly []>;
/**
 * JSON-RPC request for `eth_newPendingTransactionFilter` procedure
 */
type EthNewPendingTransactionFilterJsonRpcRequest = JsonRpcRequest<'eth_newPendingTransactionFilter', readonly []>;
/**
 * JSON-RPC request for `eth_uninstallFilter` procedure
 */
type EthUninstallFilterJsonRpcRequest = JsonRpcRequest<'eth_uninstallFilter', [filterId: Hex]>;
type EthJsonRpcRequest = EthAccountsJsonRpcRequest | EthAccountsJsonRpcRequest | EthBlockNumberJsonRpcRequest | EthCallJsonRpcRequest | EthChainIdJsonRpcRequest | EthCoinbaseJsonRpcRequest | EthEstimateGasJsonRpcRequest | EthHashrateJsonRpcRequest | EthGasPriceJsonRpcRequest | EthGetBalanceJsonRpcRequest | EthGetBlockByHashJsonRpcRequest | EthGetBlockByNumberJsonRpcRequest | EthGetBlockTransactionCountByHashJsonRpcRequest | EthGetBlockTransactionCountByNumberJsonRpcRequest | EthGetCodeJsonRpcRequest | EthGetFilterChangesJsonRpcRequest | EthGetFilterLogsJsonRpcRequest | EthGetLogsJsonRpcRequest | EthGetStorageAtJsonRpcRequest | EthGetTransactionCountJsonRpcRequest | EthGetUncleCountByBlockHashJsonRpcRequest | EthGetUncleCountByBlockNumberJsonRpcRequest | EthGetTransactionByHashJsonRpcRequest | EthGetTransactionByBlockHashAndIndexJsonRpcRequest | EthGetTransactionByBlockNumberAndIndexJsonRpcRequest | EthGetTransactionReceiptJsonRpcRequest | EthGetUncleByBlockHashAndIndexJsonRpcRequest | EthGetUncleByBlockNumberAndIndexJsonRpcRequest | EthMiningJsonRpcRequest | EthProtocolVersionJsonRpcRequest | EthSendRawTransactionJsonRpcRequest | EthSendTransactionJsonRpcRequest | EthSignJsonRpcRequest | EthSignTransactionJsonRpcRequest | EthSyncingJsonRpcRequest | EthNewFilterJsonRpcRequest | EthNewBlockFilterJsonRpcRequest | EthNewPendingTransactionFilterJsonRpcRequest | EthUninstallFilterJsonRpcRequest;

/**
 * JSON-RPC response for `eth_accounts` procedure
 */
type EthAccountsJsonRpcResponse = JsonRpcResponse<'eth_accounts', Address$1[], string | number>;
/**
 * JSON-RPC response for `eth_blockNumber` procedure
 */
type EthBlockNumberJsonRpcResponse = JsonRpcResponse<'eth_blockNumber', SerializeToJson<EthBlockNumberResult>, string | number>;
/**
 * JSON-RPC response for `eth_call` procedure
 */
type EthCallJsonRpcResponse = JsonRpcResponse<'eth_call', Hex, string | number>;
/**
 * JSON-RPC response for `eth_chainId` procedure
 */
type EthChainIdJsonRpcResponse = JsonRpcResponse<'eth_chainId', Hex, string | number>;
/**
 * JSON-RPC response for `eth_coinbase` procedure
 */
type EthCoinbaseJsonRpcResponse = JsonRpcResponse<'eth_coinbase', Hex, string | number>;
/**
 * JSON-RPC response for `eth_estimateGas` procedure
 */
type EthEstimateGasJsonRpcResponse = JsonRpcResponse<'eth_estimateGas', Hex, string | number>;
/**
 * JSON-RPC response for `eth_hashrate` procedure
 */
type EthHashrateJsonRpcResponse = JsonRpcResponse<'eth_hashrate', Hex, string | number>;
/**
 * JSON-RPC response for `eth_gasPrice` procedure
 */
type EthGasPriceJsonRpcResponse = JsonRpcResponse<'eth_gasPrice', Hex, string | number>;
/**
 * JSON-RPC response for `eth_getBalance` procedure
 */
type EthGetBalanceJsonRpcResponse = JsonRpcResponse<'eth_getBalance', Hex, string | number>;
/**
 * JSON-RPC response for `eth_getBlockByHash` procedure
 */
type EthGetBlockByHashJsonRpcResponse = JsonRpcResponse<'eth_getBlockByHash', BlockResult, string | number>;
/**
 * JSON-RPC response for `eth_getBlockByNumber` procedure
 */
type EthGetBlockByNumberJsonRpcResponse = JsonRpcResponse<'eth_getBlockByNumber', BlockResult, string | number>;
/**
 * JSON-RPC response for `eth_getBlockTransactionCountByHash` procedure
 */
type EthGetBlockTransactionCountByHashJsonRpcResponse = JsonRpcResponse<'eth_getBlockTransactionCountByHash', Hex, string | number>;
/**
 * JSON-RPC response for `eth_getBlockTransactionCountByNumber` procedure
 */
type EthGetBlockTransactionCountByNumberJsonRpcResponse = JsonRpcResponse<'eth_getBlockTransactionCountByNumber', Hex, string | number>;
/**
 * JSON-RPC response for `eth_getCode` procedure
 */
type EthGetCodeJsonRpcResponse = JsonRpcResponse<'eth_getCode', Hex, string | number>;
/**
 * JSON-RPC response for `eth_getFilterChanges` procedure
 */
type EthGetFilterChangesJsonRpcResponse = JsonRpcResponse<'eth_getFilterChanges', Array<SerializeToJson<FilterLog>>, string | number>;
/**
 * JSON-RPC response for `eth_getFilterLogs` procedure
 */
type EthGetFilterLogsJsonRpcResponse = JsonRpcResponse<'eth_getFilterLogs', Array<SerializeToJson<FilterLog>>, string | number>;
/**
 * JSON-RPC response for `eth_getLogs` procedure
 */
type EthGetLogsJsonRpcResponse = JsonRpcResponse<'eth_getLogs', Array<SerializeToJson<SerializeToJson<FilterLog>>>, string | number>;
/**
 * JSON-RPC response for `eth_getStorageAt` procedure
 */
type EthGetStorageAtJsonRpcResponse = JsonRpcResponse<'eth_getStorageAt', Hex, string | number>;
/**
 * JSON-RPC response for `eth_getTransactionCount` procedure
 */
type EthGetTransactionCountJsonRpcResponse = JsonRpcResponse<'eth_getTransactionCount', Hex, string | number>;
/**
 * JSON-RPC response for `eth_getUncleCountByBlockHash` procedure
 */
type EthGetUncleCountByBlockHashJsonRpcResponse = JsonRpcResponse<'eth_getUncleCountByBlockHash', Hex, string | number>;
/**
 * JSON-RPC response for `eth_getUncleCountByBlockNumber` procedure
 */
type EthGetUncleCountByBlockNumberJsonRpcResponse = JsonRpcResponse<'eth_getUncleCountByBlockNumber', Hex, string | number>;
/**
 * JSON-RPC response for `eth_getTransactionByHash` procedure
 */
type EthGetTransactionByHashJsonRpcResponse = JsonRpcResponse<'eth_getTransactionByHash', TransactionResult, string | number>;
/**
 * JSON-RPC response for `eth_getTransactionByBlockHashAndIndex` procedure
 */
type EthGetTransactionByBlockHashAndIndexJsonRpcResponse = JsonRpcResponse<'eth_getTransactionByBlockHashAndIndex', TransactionResult, string | number>;
/**
 * JSON-RPC response for `eth_getTransactionByBlockNumberAndIndex` procedure
 */
type EthGetTransactionByBlockNumberAndIndexJsonRpcResponse = JsonRpcResponse<'eth_getTransactionByBlockNumberAndIndex', TransactionResult, string | number>;
/**
 * JSON-RPC response for `eth_getTransactionReceipt` procedure
 */
type EthGetTransactionReceiptJsonRpcResponse = JsonRpcResponse<'eth_getTransactionReceipt', SerializeToJson<TransactionReceiptResult> | null, string | number>;
/**
 * JSON-RPC response for `eth_getUncleByBlockHashAndIndex` procedure
 */
type EthGetUncleByBlockHashAndIndexJsonRpcResponse = JsonRpcResponse<'eth_getUncleByBlockHashAndIndex', Hex, string | number>;
/**
 * JSON-RPC response for `eth_getUncleByBlockNumberAndIndex` procedure
 */
type EthGetUncleByBlockNumberAndIndexJsonRpcResponse = JsonRpcResponse<'eth_getUncleByBlockNumberAndIndex', Hex, string | number>;
/**
 * JSON-RPC response for `eth_mining` procedure
 */
type EthMiningJsonRpcResponse = JsonRpcResponse<'eth_mining', boolean, string | number>;
/**
 * JSON-RPC response for `eth_protocolVersion` procedure
 */
type EthProtocolVersionJsonRpcResponse = JsonRpcResponse<'eth_protocolVersion', Hex, string | number>;
/**
 * JSON-RPC response for `eth_sendRawTransaction` procedure
 */
type EthSendRawTransactionJsonRpcResponse = JsonRpcResponse<'eth_sendRawTransaction', Hex, string | number>;
/**
 * JSON-RPC response for `eth_sendTransaction` procedure
 */
type EthSendTransactionJsonRpcResponse = JsonRpcResponse<'eth_sendTransaction', Hex, string | number>;
/**
 * JSON-RPC response for `eth_sign` procedure
 */
type EthSignJsonRpcResponse = JsonRpcResponse<'eth_sign', Hex, string | number>;
/**
 * JSON-RPC response for `eth_signTransaction` procedure
 */
type EthSignTransactionJsonRpcResponse = JsonRpcResponse<'eth_signTransaction', Hex, string | number>;
/**
 * JSON-RPC response for `eth_syncing` procedure
 */
type EthSyncingJsonRpcResponse = JsonRpcResponse<'eth_syncing', boolean | {
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
type EthNewFilterJsonRpcResponse = JsonRpcResponse<'eth_newFilter', Hex, string | number>;
/**
 * JSON-RPC response for `eth_newBlockFilter` procedure
 */
type EthNewBlockFilterJsonRpcResponse = JsonRpcResponse<'eth_newBlockFilter', Hex, string | number>;
/**
 * JSON-RPC response for `eth_newPendingTransactionFilter` procedure
 */
type EthNewPendingTransactionFilterJsonRpcResponse = JsonRpcResponse<'eth_newPendingTransactionFilter', Hex, string | number>;
/**
 * JSON-RPC response for `eth_uninstallFilter` procedure
 */
type EthUninstallFilterJsonRpcResponse = JsonRpcResponse<'eth_uninstallFilter', boolean, string | number>;

type EthAccountsJsonRpcProcedure = (request: EthAccountsJsonRpcRequest) => Promise<EthAccountsJsonRpcResponse>;
type EthBlockNumberJsonRpcProcedure = (request: EthBlockNumberJsonRpcRequest) => Promise<EthBlockNumberJsonRpcResponse>;
type EthCallJsonRpcProcedure = (request: EthCallJsonRpcRequest) => Promise<EthCallJsonRpcResponse>;
type EthChainIdJsonRpcProcedure = (request: EthChainIdJsonRpcRequest) => Promise<EthChainIdJsonRpcResponse>;
type EthCoinbaseJsonRpcProcedure = (request: EthCoinbaseJsonRpcRequest) => Promise<EthCoinbaseJsonRpcResponse>;
type EthEstimateGasJsonRpcProcedure = (request: EthEstimateGasJsonRpcRequest) => Promise<EthEstimateGasJsonRpcResponse>;
type EthHashrateJsonRpcProcedure = (request: EthHashrateJsonRpcRequest) => Promise<EthHashrateJsonRpcResponse>;
type EthGasPriceJsonRpcProcedure = (request: EthGasPriceJsonRpcRequest) => Promise<EthGasPriceJsonRpcResponse>;
type EthGetBalanceJsonRpcProcedure = (request: EthGetBalanceJsonRpcRequest) => Promise<EthGetBalanceJsonRpcResponse>;
type EthGetBlockByHashJsonRpcProcedure = (request: EthGetBlockByHashJsonRpcRequest) => Promise<EthGetBlockByHashJsonRpcResponse>;
type EthGetBlockByNumberJsonRpcProcedure = (request: EthGetBlockByNumberJsonRpcRequest) => Promise<EthGetBlockByNumberJsonRpcResponse>;
type EthGetBlockTransactionCountByHashJsonRpcProcedure = (request: EthGetBlockTransactionCountByHashJsonRpcRequest) => Promise<EthGetBlockTransactionCountByHashJsonRpcResponse>;
type EthGetBlockTransactionCountByNumberJsonRpcProcedure = (request: EthGetBlockTransactionCountByNumberJsonRpcRequest) => Promise<EthGetBlockTransactionCountByNumberJsonRpcResponse>;
type EthGetCodeJsonRpcProcedure = (request: EthGetCodeJsonRpcRequest) => Promise<EthGetCodeJsonRpcResponse>;
type EthGetFilterChangesJsonRpcProcedure = (request: EthGetFilterChangesJsonRpcRequest) => Promise<EthGetFilterChangesJsonRpcResponse>;
type EthGetFilterLogsJsonRpcProcedure = (request: EthGetFilterLogsJsonRpcRequest) => Promise<EthGetFilterLogsJsonRpcResponse>;
type EthGetLogsJsonRpcProcedure = (request: EthGetLogsJsonRpcRequest) => Promise<EthGetLogsJsonRpcResponse>;
type EthGetStorageAtJsonRpcProcedure = (request: EthGetStorageAtJsonRpcRequest) => Promise<EthGetStorageAtJsonRpcResponse>;
type EthGetTransactionCountJsonRpcProcedure = (request: EthGetTransactionCountJsonRpcRequest) => Promise<EthGetTransactionCountJsonRpcResponse>;
type EthGetUncleCountByBlockHashJsonRpcProcedure = (request: EthGetUncleCountByBlockHashJsonRpcRequest) => Promise<EthGetUncleCountByBlockHashJsonRpcResponse>;
type EthGetUncleCountByBlockNumberJsonRpcProcedure = (request: EthGetUncleCountByBlockNumberJsonRpcRequest) => Promise<EthGetUncleCountByBlockNumberJsonRpcResponse>;
type EthGetTransactionByHashJsonRpcProcedure = (request: EthGetTransactionByHashJsonRpcRequest) => Promise<EthGetTransactionByHashJsonRpcResponse>;
type EthGetTransactionByBlockHashAndIndexJsonRpcProcedure = (request: EthGetTransactionByBlockHashAndIndexJsonRpcRequest) => Promise<EthGetTransactionByBlockHashAndIndexJsonRpcResponse>;
type EthGetTransactionByBlockNumberAndIndexJsonRpcProcedure = (request: EthGetTransactionByBlockNumberAndIndexJsonRpcRequest) => Promise<EthGetTransactionByBlockNumberAndIndexJsonRpcResponse>;
type EthGetTransactionReceiptJsonRpcProcedure = (request: EthGetTransactionReceiptJsonRpcRequest) => Promise<EthGetTransactionReceiptJsonRpcResponse>;
type EthGetUncleByBlockHashAndIndexJsonRpcProcedure = (request: EthGetUncleByBlockHashAndIndexJsonRpcRequest) => Promise<EthGetUncleByBlockHashAndIndexJsonRpcResponse>;
type EthGetUncleByBlockNumberAndIndexJsonRpcProcedure = (request: EthGetUncleByBlockNumberAndIndexJsonRpcRequest) => Promise<EthGetUncleByBlockNumberAndIndexJsonRpcResponse>;
type EthMiningJsonRpcProcedure = (request: EthMiningJsonRpcRequest) => Promise<EthMiningJsonRpcResponse>;
type EthProtocolVersionJsonRpcProcedure = (request: EthProtocolVersionJsonRpcRequest) => Promise<EthProtocolVersionJsonRpcResponse>;
type EthSendRawTransactionJsonRpcProcedure = (request: EthSendRawTransactionJsonRpcRequest) => Promise<EthSendRawTransactionJsonRpcResponse>;
type EthSendTransactionJsonRpcProcedure = (request: EthSendTransactionJsonRpcRequest) => Promise<EthSendTransactionJsonRpcResponse>;
type EthSignJsonRpcProcedure = (request: EthSignJsonRpcRequest) => Promise<EthSignJsonRpcResponse>;
type EthSignTransactionJsonRpcProcedure = (request: EthSignTransactionJsonRpcRequest) => Promise<EthSignTransactionJsonRpcResponse>;
type EthSyncingJsonRpcProcedure = (request: EthSyncingJsonRpcRequest) => Promise<EthSyncingJsonRpcResponse>;
type EthNewFilterJsonRpcProcedure = (request: EthNewFilterJsonRpcRequest) => Promise<EthNewFilterJsonRpcResponse>;
type EthNewBlockFilterJsonRpcProcedure = (request: EthNewBlockFilterJsonRpcRequest) => Promise<EthNewBlockFilterJsonRpcResponse>;
type EthNewPendingTransactionFilterJsonRpcProcedure = (request: EthNewPendingTransactionFilterJsonRpcRequest) => Promise<EthNewPendingTransactionFilterJsonRpcResponse>;
type EthUninstallFilterJsonRpcProcedure = (request: EthUninstallFilterJsonRpcRequest) => Promise<EthUninstallFilterJsonRpcResponse>;

declare function blockNumberProcedure(client: _tevm_node.TevmNode): EthBlockNumberJsonRpcProcedure;

declare function chainIdProcedure(baseClient: _tevm_node.TevmNode): EthChainIdJsonRpcProcedure;

declare function ethAccountsProcedure(accounts: ReadonlyArray<_tevm_utils.Account>): EthAccountsJsonRpcProcedure;

declare function ethBlobBaseFeeJsonRpcProcedure(client: _tevm_node.TevmNode): EthGasPriceJsonRpcProcedure;

declare function ethCallProcedure(client: _tevm_node.TevmNode): EthCallJsonRpcProcedure;

declare function ethCoinbaseJsonRpcProcedure(client: _tevm_node.TevmNode): EthCoinbaseJsonRpcProcedure;

declare function ethEstimateGasJsonRpcProcedure(client: _tevm_node.TevmNode): EthEstimateGasJsonRpcProcedure;

declare function ethGetBlockByHashJsonRpcProcedure(client: _tevm_node.TevmNode): EthGetBlockByHashJsonRpcProcedure;

declare function ethGetBlockByNumberJsonRpcProcedure(client: _tevm_node.TevmNode): EthGetBlockByNumberJsonRpcProcedure;

declare function ethGetBlockTransactionCountByHashJsonRpcProcedure(client: _tevm_node.TevmNode): EthGetBlockTransactionCountByHashJsonRpcProcedure;

declare function ethGetBlockTransactionCountByNumberJsonRpcProcedure(client: _tevm_node.TevmNode): EthGetBlockTransactionCountByNumberJsonRpcProcedure;

declare function ethGetFilterChangesProcedure(client: _tevm_node.TevmNode): EthGetFilterChangesJsonRpcProcedure;

declare function ethGetFilterLogsProcedure(client: _tevm_node.TevmNode): EthGetFilterLogsJsonRpcProcedure;

declare function ethGetLogsProcedure(client: _tevm_node.TevmNode): EthGetLogsJsonRpcProcedure;

declare function ethGetTransactionByBlockHashAndIndexJsonRpcProcedure(client: _tevm_node.TevmNode): EthGetTransactionByBlockHashAndIndexJsonRpcProcedure;

declare function ethGetTransactionByBlockNumberAndIndexJsonRpcProcedure(client: _tevm_node.TevmNode): EthGetTransactionByBlockNumberAndIndexJsonRpcProcedure;

declare function ethGetTransactionByHashJsonRpcProcedure(client: _tevm_node.TevmNode): EthGetTransactionByHashJsonRpcProcedure;

declare function ethGetTransactionCountProcedure(node: _tevm_node.TevmNode): EthGetTransactionCountJsonRpcProcedure;

declare function ethGetTransactionReceiptJsonRpcProcedure(client: _tevm_node.TevmNode): EthGetTransactionReceiptJsonRpcProcedure;

declare function ethNewBlockFilterProcedure(client: _tevm_node.TevmNode): EthNewBlockFilterJsonRpcProcedure;

declare function ethNewFilterJsonRpcProcedure(tevmNode: _tevm_node.TevmNode): EthNewFilterJsonRpcProcedure;

declare function ethNewPendingTransactionFilterProcedure(client: _tevm_node.TevmNode): EthNewPendingTransactionFilterJsonRpcProcedure;

declare function ethProtocolVersionJsonRpcProcedure(): EthProtocolVersionJsonRpcProcedure;

declare function ethSendRawTransactionJsonRpcProcedure(client: _tevm_node.TevmNode): EthSendRawTransactionJsonRpcProcedure;

declare function ethSendTransactionJsonRpcProcedure(client: _tevm_node.TevmNode): EthSendTransactionJsonRpcProcedure;

declare function ethSignProcedure(accounts: ReadonlyArray<_tevm_utils.HDAccount>): EthSignJsonRpcProcedure;

declare function ethSignTransactionProcedure(options: Parameters<typeof ethSignTransactionHandler>[0]): EthSignTransactionJsonRpcProcedure;

declare function ethUninstallFilterJsonRpcProcedure(client: _tevm_node.TevmNode): EthUninstallFilterJsonRpcProcedure;

declare function gasPriceProcedure({ getVm, forkTransport }: Parameters<typeof gasPriceHandler>[0]): EthGasPriceJsonRpcProcedure;

declare function getBalanceProcedure(baseClient: Parameters<typeof getBalanceHandler>[0]): EthGetBalanceJsonRpcProcedure;

declare function getCodeProcedure(baseClient: Parameters<typeof getCodeHandler>[0]): EthGetCodeJsonRpcProcedure;

declare function getStorageAtProcedure(client: _tevm_node.TevmNode): EthGetStorageAtJsonRpcProcedure;

type AnvilError = string;
/**
 * JSON-RPC response for `anvil_impersonateAccount` procedure
 */
type AnvilImpersonateAccountJsonRpcResponse = JsonRpcResponse<'anvil_impersonateAccount', SerializeToJson<AnvilImpersonateAccountResult>, AnvilError>;
/**
 * JSON-RPC response for `anvil_stopImpersonatingAccount` procedure
 */
type AnvilStopImpersonatingAccountJsonRpcResponse = JsonRpcResponse<'anvil_stopImpersonatingAccount', SerializeToJson<AnvilStopImpersonatingAccountResult>, AnvilError>;
/**
 * JSON-RPC response for `anvil_setCoinbase` procedure
 */
type AnvilSetCoinbaseJsonRpcResponse = JsonRpcResponse<'anvil_setCoinbase', Address$1, AnvilError>;
/**
 * JSON-RPC response for `anvil_autoImpersonateAccount` procedure
 * Not included atm because tevm_call supports it and i was getting methodNotFound errors trying it in anvil
 */
/**
 * JSON-RPC response for `anvil_getAutomine` procedure
 */
type AnvilGetAutomineJsonRpcResponse = JsonRpcResponse<'anvil_getAutomine', SerializeToJson<AnvilGetAutomineResult>, AnvilError>;
/**
 * JSON-RPC response for `anvil_mine` procedure
 */
type AnvilMineJsonRpcResponse = JsonRpcResponse<'anvil_mine', SerializeToJson<AnvilMineResult>, AnvilError>;
/**
 * JSON-RPC response for `anvil_reset` procedure
 */
type AnvilResetJsonRpcResponse = JsonRpcResponse<'anvil_reset', SerializeToJson<AnvilResetResult>, AnvilError>;
/**
 * JSON-RPC response for `anvil_dropTransaction` procedure
 */
type AnvilDropTransactionJsonRpcResponse = JsonRpcResponse<'anvil_dropTransaction', SerializeToJson<AnvilDropTransactionResult>, AnvilError>;
/**
 * JSON-RPC response for `anvil_setBalance` procedure
 */
type AnvilSetBalanceJsonRpcResponse = JsonRpcResponse<'anvil_setBalance', SerializeToJson<AnvilSetBalanceResult>, AnvilError>;
/**
 * JSON-RPC response for `anvil_setCode` procedure
 */
type AnvilSetCodeJsonRpcResponse = JsonRpcResponse<'anvil_setCode', SerializeToJson<AnvilSetCodeResult>, AnvilError>;
/**
 * JSON-RPC response for `anvil_setNonce` procedure
 */
type AnvilSetNonceJsonRpcResponse = JsonRpcResponse<'anvil_setNonce', SerializeToJson<AnvilSetNonceResult>, AnvilError>;
/**
 * JSON-RPC response for `anvil_setStorageAt` procedure
 */
type AnvilSetStorageAtJsonRpcResponse = JsonRpcResponse<'anvil_setStorageAt', SerializeToJson<AnvilSetStorageAtResult>, AnvilError>;
/**
 * JSON-RPC response for `anvil_setChainId` procedure
 */
type AnvilSetChainIdJsonRpcResponse = JsonRpcResponse<'anvil_setChainId', SerializeToJson<AnvilSetChainIdResult>, AnvilError>;
/**
 * JSON-RPC response for `anvil_dumpState` procedure
 */
type AnvilDumpStateJsonRpcResponse = JsonRpcResponse<'anvil_dumpState', SerializeToJson<AnvilDumpStateResult>, AnvilError>;
/**
 * JSON-RPC response for `anvil_loadState` procedure
 */
type AnvilLoadStateJsonRpcResponse = JsonRpcResponse<'anvil_loadState', SerializeToJson<AnvilLoadStateResult>, AnvilError>;

type AnvilSetCoinbaseProcedure = (request: AnvilSetCoinbaseJsonRpcRequest) => Promise<AnvilSetCoinbaseJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_impersonateAccount`
 */
type AnvilImpersonateAccountProcedure = (request: AnvilImpersonateAccountJsonRpcRequest) => Promise<AnvilImpersonateAccountJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_stopImpersonatingAccount`
 */
type AnvilStopImpersonatingAccountProcedure = (request: AnvilStopImpersonatingAccountJsonRpcRequest) => Promise<AnvilStopImpersonatingAccountJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_autoImpersonateAccount`
 * Not included atm because tevm_call supports it and i was getting methodNotFound errors trying it in anvil
 */
/**
 * JSON-RPC procedure for `anvil_getAutomine`
 */
type AnvilGetAutomineProcedure = (request: AnvilGetAutomineJsonRpcRequest) => Promise<AnvilGetAutomineJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_mine`
 */
type AnvilMineProcedure = (request: AnvilMineJsonRpcRequest) => Promise<AnvilMineJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_reset`
 */
type AnvilResetProcedure = (request: AnvilResetJsonRpcRequest) => Promise<AnvilResetJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_dropTransaction`
 */
type AnvilDropTransactionProcedure = (request: AnvilDropTransactionJsonRpcRequest) => Promise<AnvilDropTransactionJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_setBalance`
 */
type AnvilSetBalanceProcedure = (request: AnvilSetBalanceJsonRpcRequest) => Promise<AnvilSetBalanceJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_setCode`
 */
type AnvilSetCodeProcedure = (request: AnvilSetCodeJsonRpcRequest) => Promise<AnvilSetCodeJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_setNonce`
 */
type AnvilSetNonceProcedure = (request: AnvilSetNonceJsonRpcRequest) => Promise<AnvilSetNonceJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_setStorageAt`
 */
type AnvilSetStorageAtProcedure = (request: AnvilSetStorageAtJsonRpcRequest) => Promise<AnvilSetStorageAtJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_setChainId`
 */
type AnvilSetChainIdProcedure = (request: AnvilSetChainIdJsonRpcRequest) => Promise<AnvilSetChainIdJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_dumpState`
 */
type AnvilDumpStateProcedure = (request: AnvilDumpStateJsonRpcRequest) => Promise<AnvilDumpStateJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_loadState`
 */
type AnvilLoadStateProcedure = (request: AnvilLoadStateJsonRpcRequest) => Promise<AnvilLoadStateJsonRpcResponse>;

declare function anvilDropTransactionJsonRpcProcedure(client: _tevm_node.TevmNode): AnvilDropTransactionProcedure;

declare function anvilDumpStateJsonRpcProcedure(client: _tevm_node.TevmNode): AnvilDumpStateProcedure;

declare function anvilGetAutomineJsonRpcProcedure(client: _tevm_node.TevmNode): AnvilGetAutomineProcedure;

declare function anvilImpersonateAccountJsonRpcProcedure(client: _tevm_node.TevmNode): AnvilImpersonateAccountProcedure;

declare function anvilLoadStateJsonRpcProcedure(client: _tevm_node.TevmNode): AnvilLoadStateProcedure;

declare function anvilResetJsonRpcProcedure(client: _tevm_node.TevmNode): AnvilResetProcedure;

declare function anvilSetBalanceJsonRpcProcedure(client: _tevm_node.TevmNode): AnvilSetBalanceProcedure;

declare function anvilSetChainIdJsonRpcProcedure(client: _tevm_node.TevmNode): AnvilSetChainIdProcedure;

declare function anvilSetCoinbaseJsonRpcProcedure(client: _tevm_node.TevmNode): AnvilSetCoinbaseProcedure;

declare function anvilSetNonceJsonRpcProcedure(client: _tevm_node.TevmNode): AnvilSetNonceProcedure;

declare function anvilSetStorageAtJsonRpcProcedure(client: _tevm_node.TevmNode): AnvilSetStorageAtProcedure;

declare function anvilStopImpersonatingAccountJsonRpcProcedure(client: _tevm_node.TevmNode): AnvilStopImpersonatingAccountProcedure;

/**
 * A mapping of `anvil_*` method names to their return type
 */
type AnvilReturnType = {
    anvil_impersonateAccount: AnvilImpersonateAccountJsonRpcResponse;
    anvil_stopImpersonatingAccount: AnvilStopImpersonatingAccountJsonRpcResponse;
    anvil_getAutomine: AnvilGetAutomineJsonRpcResponse;
    anvil_mine: AnvilMineJsonRpcResponse;
    anvil_reset: AnvilResetJsonRpcResponse;
    anvil_dropTransaction: AnvilDropTransactionJsonRpcResponse;
    anvil_setBalance: AnvilSetBalanceJsonRpcResponse;
    anvil_setCode: AnvilSetCodeJsonRpcResponse;
    anvil_setNonce: AnvilSetNonceJsonRpcResponse;
    anvil_setStorageAt: AnvilSetStorageAtJsonRpcResponse;
    anvil_setChainId: AnvilSetChainIdJsonRpcResponse;
    anvil_dumpState: AnvilDumpStateJsonRpcResponse;
    anvil_loadState: AnvilLoadStateJsonRpcResponse;
    anvil_setCoinbase: AnvilSetCoinbaseJsonRpcResponse;
};

type DebugError = string;
/**
 * JSON-RPC response for `debug_traceTransaction` procedure
 */
type DebugTraceTransactionJsonRpcResponse = JsonRpcResponse<'debug_traceTransaction', SerializeToJson<DebugTraceTransactionResult>, DebugError>;
/**
 * JSON-RPC response for `debug_traceCall` procedure
 */
type DebugTraceCallJsonRpcResponse = JsonRpcResponse<'debug_traceCall', SerializeToJson<DebugTraceCallResult>, DebugError>;

/**
 * A mapping of `debug_*` method names to their return type
 */
type DebugReturnType = {
    debug_traceTransaction: DebugTraceTransactionJsonRpcResponse;
    debug_traceCall: DebugTraceCallJsonRpcResponse;
};

/**
 * A mapping of `eth_*` method names to their return type
 */
type EthReturnType = {
    eth_call: EthCallJsonRpcResponse;
    eth_gasPrice: EthGasPriceJsonRpcResponse;
    eth_sign: EthSignJsonRpcResponse;
    eth_newBlockFilter: EthNewBlockFilterJsonRpcResponse;
    eth_mining: EthMiningJsonRpcResponse;
    eth_chainId: EthChainIdJsonRpcResponse;
    eth_getCode: EthGetCodeJsonRpcResponse;
    eth_getLogs: EthGetLogsJsonRpcResponse;
    eth_syncing: EthSyncingJsonRpcResponse;
    eth_accounts: EthAccountsJsonRpcResponse;
    eth_coinbase: EthCoinbaseJsonRpcResponse;
    eth_hashrate: EthHashrateJsonRpcResponse;
    eth_newFilter: EthNewFilterJsonRpcResponse;
    eth_getBalance: EthGetBalanceJsonRpcResponse;
    eth_blockNumber: EthBlockNumberJsonRpcResponse;
    eth_estimateGas: EthEstimateGasJsonRpcResponse;
    eth_getStorageAt: EthGetStorageAtJsonRpcResponse;
    eth_getFilterLogs: EthGetFilterLogsJsonRpcResponse;
    eth_getBlockByHash: EthGetBlockByHashJsonRpcResponse;
    eth_protocolVersion: EthProtocolVersionJsonRpcResponse;
    eth_sendTransaction: EthSendTransactionJsonRpcResponse;
    eth_signTransaction: EthSignTransactionJsonRpcResponse;
    eth_uninstallFilter: EthUninstallFilterJsonRpcResponse;
    eth_getBlockByNumber: EthGetBlockByNumberJsonRpcResponse;
    eth_getFilterChanges: EthGetFilterChangesJsonRpcResponse;
    eth_sendRawTransaction: EthSendRawTransactionJsonRpcResponse;
    eth_getTransactionCount: EthGetTransactionCountJsonRpcResponse;
    eth_getTransactionByHash: EthGetTransactionByHashJsonRpcResponse;
    eth_getTransactionReceipt: EthGetTransactionReceiptJsonRpcResponse;
    eth_getUncleCountByBlockHash: EthGetUncleCountByBlockHashJsonRpcResponse;
    eth_getUncleCountByBlockNumber: EthGetUncleCountByBlockNumberJsonRpcResponse;
    eth_getUncleByBlockHashAndIndex: EthGetUncleByBlockHashAndIndexJsonRpcResponse;
    eth_newPendingTransactionFilter: EthNewPendingTransactionFilterJsonRpcResponse;
    eth_getUncleByBlockNumberAndIndex: EthGetUncleByBlockNumberAndIndexJsonRpcResponse;
    eth_getBlockTransactionCountByHash: EthGetBlockTransactionCountByHashJsonRpcResponse;
    eth_getBlockTransactionCountByNumber: EthGetBlockTransactionCountByNumberJsonRpcResponse;
    eth_getTransactionByBlockHashAndIndex: EthGetTransactionByBlockHashAndIndexJsonRpcResponse;
    eth_getTransactionByBlockNumberAndIndex: EthGetTransactionByBlockNumberAndIndexJsonRpcResponse;
};

/**
 * JSON-RPC response for `tevm_call` procedure
 */
type CallJsonRpcResponse = JsonRpcResponse<'tevm_call', SerializeToJson<CallResult>, TevmCallError['code']>;

/**
 * The response to the `tevm_dumpState` JSON-RPC request.
 */
type DumpStateJsonRpcResponse = JsonRpcResponse<'tevm_dumpState', SerializeToJson<{
    state: ParameterizedTevmState;
}>, TevmDumpStateError['code']>;

/**
 * JSON-RPC response for `tevm_getAccount` method
 */
type GetAccountJsonRpcResponse = JsonRpcResponse<'tevm_getAccount', SerializeToJson<GetAccountResult>, TevmGetAccountError['code']>;

/**
 * Response of the `tevm_loadState` RPC method.
 */
type LoadStateJsonRpcResponse = JsonRpcResponse<'tevm_loadState', SerializeToJson<LoadStateResult>, TevmLoadStateError['code']>;

/**
 * JSON-RPC response for `tevm_mine` method
 */
type MineJsonRpcResponse = JsonRpcResponse<'tevm_mine', SerializeToJson<MineResult>, TevmMineError['code']>;

/**
 * @deprecated Use CallJsonRpcProcedure instead
 * JSON-RPC response for `tevm_script` method
 * @example
 * import { createMemoryClient } from 'tevm'
 *
 * const tevm = createMemoryClient()
 *
 * const respose: ScriptJsonRpcResponse = await tevm.request({
 *   method: 'tevm_script',
 *   params: {
 *     deployedBytecode: '608...',
 *     abi: [...],
 *     args: [...]
 * })
 */
type ScriptJsonRpcResponse = JsonRpcResponse<'tevm_script', SerializeToJson<CallResult>, TevmScriptError['code']>;

/**
 * JSON-RPC response for `tevm_setAccount` method
 */
type SetAccountJsonRpcResponse = JsonRpcResponse<'tevm_setAccount', SerializeToJson<SetAccountResult>, TevmSetAccountError['code']>;

/**
 * A mapping of `tevm_*` method names to their return type
 */
type TevmReturnType = {
    tevm_call: CallJsonRpcResponse;
    /**
     * @deprecated
     */
    tevm_script: ScriptJsonRpcResponse;
    tevm_loadState: LoadStateJsonRpcResponse;
    tevm_dumpState: DumpStateJsonRpcResponse;
    tevm_getAccount: GetAccountJsonRpcResponse;
    tevm_setAccount: SetAccountJsonRpcResponse;
    tevm_mine: MineJsonRpcResponse;
};

/**
 * Utility type to get the return type given a method name
 * @example
 * ```typescript
 * type BlockNumberReturnType = JsonRpcReturnTypeFromMethod<'eth_blockNumber'>
 * ```
 */
type JsonRpcReturnTypeFromMethod<TMethod extends keyof EthReturnType | keyof TevmReturnType | keyof AnvilReturnType | keyof DebugReturnType> = (EthReturnType & TevmReturnType & AnvilReturnType & DebugReturnType)[TMethod];

/**
 * Typesafe request handler for JSON-RPC requests. Most users will want to use the higher level
 * and more feature-rich `actions` api
 * @example
 * ```typescript
 * const blockNumberResponse = await tevm.request({
 *  method: 'eth_blockNumber',
 *  params: []
 *  id: 1
 *  jsonrpc: '2.0'
 * })
 * const accountResponse = await tevm.request({
 *  method: 'tevm_getAccount',
 *  params: [{address: '0x123...'}]
 *  id: 1
 *  jsonrpc: '2.0'
 * })
 * ```
 *
 * ### tevm_* methods
 *
 * #### tevm_call
 *
 * request - {@link CallJsonRpcRequest}
 * response - {@link CallJsonRpcResponse}
 *
 * #### tevm_getAccount
 *
 * request - {@link GetAccountJsonRpcRequest}
 * response - {@link GetAccountJsonRpcResponse}
 *
 * #### tevm_setAccount
 *
 * request - {@link SetAccountJsonRpcRequest}
 * response - {@link SetAccountJsonRpcResponse}
 *
 * ### debug_* methods
 *
 * #### debug_traceCall
 *
 * request - {@link DebugTraceCallJsonRpcRequest}
 * response - {@link DebugTraceCallJsonRpcResponse}
 *
 * ### eth_* methods
 *
 * #### eth_blockNumber
 *
 * request - {@link EthBlockNumberJsonRpcRequest}
 * response - {@link EthBlockNumberJsonRpcResponse}
 *
 * #### eth_chainId
 *
 * request - {@link EthChainIdJsonRpcRequest}
 * response - {@link EthChainIdJsonRpcResponse}
 *
 * #### eth_getCode
 *
 * request - {@link EthGetCodeJsonRpcRequest}
 * response - {@link EthGetCodeJsonRpcResponse}
 *
 * #### eth_getStorageAt
 *
 * request - {@link EthGetStorageAtJsonRpcRequest}
 * response - {@link EthGetStorageAtJsonRpcResponse}
 *
 * #### eth_gasPrice
 *
 * request - {@link EthGasPriceJsonRpcRequest}
 * response - {@link EthGasPriceJsonRpcResponse}
 *
 * #### eth_getBalance
 *
 * request - {@link EthGetBalanceJsonRpcRequest}
 * response - {@link EthGetBalanceJsonRpcResponse}
 */
type TevmJsonRpcRequestHandler = <TRequest extends TevmJsonRpcRequest | EthJsonRpcRequest | AnvilJsonRpcRequest | DebugJsonRpcRequest>(request: TRequest) => Promise<JsonRpcReturnTypeFromMethod<TRequest['method']>>;

declare function requestProcedure(client: _tevm_node.TevmNode): TevmJsonRpcRequestHandler;

/**
 * @experimental
 * Bulk request handler for JSON-RPC requests. Takes an array of requests and returns an array of results.
 * Bulk requests are currently handled in parallel which can cause issues if the requests are expected to run
 * sequentially or interphere with each other. An option for configuring requests sequentially or in parallel
 * will be added in the future.
 *
 * Currently is not very generic with regard to input and output types.
 * @example
 * ```typescript
 * const [blockNumberResponse, gasPriceResponse] = await tevm.requestBulk([{
 *  method: 'eth_blockNumber',
 *  params: []
 *  id: 1
 *  jsonrpc: '2.0'
 * }, {
 *  method: 'eth_gasPrice',
 *  params: []
 *  id: 1
 *  jsonrpc: '2.0'
 * }])
 * ```
 *
 * ### tevm_* methods
 *
 * #### tevm_call
 *
 * request - {@link CallJsonRpcRequest}
 * response - {@link CallJsonRpcResponse}
 *
 * #### tevm_getAccount
 *
 * request - {@link GetAccountJsonRpcRequest}
 * response - {@link GetAccountJsonRpcResponse}
 *
 * #### tevm_setAccount
 *
 * request - {@link SetAccountJsonRpcRequest}
 * response - {@link SetAccountJsonRpcResponse}
 *
 * ### debug_* methods
 *
 * #### debug_traceCall
 *
 * request - {@link DebugTraceCallJsonRpcRequest}
 * response - {@link DebugTraceCallJsonRpcResponse}
 *
 * ### eth_* methods
 *
 * #### eth_blockNumber
 *
 * request - {@link EthBlockNumberJsonRpcRequest}
 * response - {@link EthBlockNumberJsonRpcResponse}
 *
 * #### eth_chainId
 *
 * request - {@link EthChainIdJsonRpcRequest}
 * response - {@link EthChainIdJsonRpcResponse}
 *
 * #### eth_getCode
 *
 * request - {@link EthGetCodeJsonRpcRequest}
 * response - {@link EthGetCodeJsonRpcResponse}
 *
 * #### eth_getStorageAt
 *
 * request - {@link EthGetStorageAtJsonRpcRequest}
 * response - {@link EthGetStorageAtJsonRpcResponse}
 *
 * #### eth_gasPrice
 *
 * request - {@link EthGasPriceJsonRpcRequest}
 * response - {@link EthGasPriceJsonRpcResponse}
 *
 * #### eth_getBalance
 *
 * request - {@link EthGetBalanceJsonRpcRequest}
 * response - {@link EthGetBalanceJsonRpcResponse}
 */
type TevmJsonRpcBulkRequestHandler = (requests: ReadonlyArray<TevmJsonRpcRequest | EthJsonRpcRequest | AnvilJsonRpcRequest | DebugJsonRpcRequest>) => Promise<Array<JsonRpcReturnTypeFromMethod<any>>>;

declare function requestBulkProcedure(client: _tevm_node.TevmNode): TevmJsonRpcBulkRequestHandler;

/**
 * Call JSON-RPC procedure executes a call against the tevm EVM
 */
type CallJsonRpcProcedure = (request: CallJsonRpcRequest) => Promise<CallJsonRpcResponse>;

declare function callProcedure(client: _tevm_node.TevmNode): CallJsonRpcProcedure;

/**
 * JSON-RPC procedure for `debug_traceTransaction`
 */
type DebugTraceTransactionProcedure = (request: DebugTraceTransactionJsonRpcRequest) => Promise<DebugTraceTransactionJsonRpcResponse>;
/**
 * JSON-RPC procedure for `debug_traceCall`
 */
type DebugTraceCallProcedure = (request: DebugTraceCallJsonRpcRequest) => Promise<DebugTraceCallJsonRpcResponse>;

declare function debugTraceCallJsonRpcProcedure(client: _tevm_node.TevmNode): DebugTraceCallProcedure;

declare function debugTraceTransactionJsonRpcProcedure(client: _tevm_node.TevmNode): DebugTraceTransactionProcedure;

/**
 * Procedure for handling tevm_dumpState JSON-RPC requests
 * @returns the state as a JSON-RPC successful result
 * @example
 * const result = await tevm.request({
 *.   method: 'tevm_DumpState',
 *    params: [],
 *.   id: 1,
 *   jsonrpc: '2.0'
 *. }
 * console.log(result) // { jsonrpc: '2.0', id: 1, method: 'tevm_dumpState', result: {'0x...': '0x....', ...}}
 */
type DumpStateJsonRpcProcedure = (request: DumpStateJsonRpcRequest) => Promise<DumpStateJsonRpcResponse>;

declare function dumpStateProcedure(client: _tevm_node.TevmNode): DumpStateJsonRpcProcedure;

/**
 * GetAccount JSON-RPC tevm procedure puts an account or contract into the tevm state
 */
type GetAccountJsonRpcProcedure = (request: GetAccountJsonRpcRequest) => Promise<GetAccountJsonRpcResponse>;

declare function getAccountProcedure(client: _tevm_node.TevmNode): GetAccountJsonRpcProcedure;

/**
 * Procedure for handling script JSON-RPC requests
 * Procedure for handling tevm_loadState JSON-RPC requests
 * @returns jsonrpc error response if there are errors otherwise it returns a successful empty object result
 * @example
 * const result = await tevm.request({
 *.   method: 'tevm_loadState',
 *    params: { '0x..': '0x...', ...},
 *.   id: 1,
 *   jsonrpc: '2.0'
 *. }
 * console.log(result) // { jsonrpc: '2.0', id: 1, method: 'tevm_loadState', result: {}}
 */
type LoadStateJsonRpcProcedure = (request: LoadStateJsonRpcRequest) => Promise<LoadStateJsonRpcResponse>;

declare function loadStateProcedure(client: _tevm_node.TevmNode): LoadStateJsonRpcProcedure;

/**
 * Mine JSON-RPC tevm procedure mines 1 or more blocks
 */
type MineJsonRpcProcedure = (request: MineJsonRpcRequest) => Promise<MineJsonRpcResponse>;

declare function mineProcedure(client: _tevm_node.TevmNode): MineJsonRpcProcedure;

/**
 * @deprecated Use CallJsonRpcProcedure instead
 * Procedure for handling script JSON-RPC requests
 */
type ScriptJsonRpcProcedure = (request: ScriptJsonRpcRequest) => Promise<ScriptJsonRpcResponse>;

declare function scriptProcedure(client: _tevm_node.TevmNode): ScriptJsonRpcProcedure;

/**
 * SetAccount JSON-RPC tevm procedure sets an account into the tevm state
 */
type SetAccountJsonRpcProcedure = (request: SetAccountJsonRpcRequest) => Promise<SetAccountJsonRpcResponse>;

declare function setAccountProcedure(client: _tevm_node.TevmNode): SetAccountJsonRpcProcedure;

/**
 * A mapping of `anvil_*` method names to their request type
 */
type AnvilRequestType = {
    anvil_impersonateAccount: AnvilImpersonateAccountJsonRpcRequest;
    anvil_stopImpersonatingAccount: AnvilStopImpersonatingAccountJsonRpcRequest;
    anvil_getAutomine: AnvilGetAutomineJsonRpcRequest;
    anvil_mine: AnvilMineJsonRpcRequest;
    anvil_reset: AnvilResetJsonRpcRequest;
    anvil_dropTransaction: AnvilDropTransactionJsonRpcRequest;
    anvil_setBalance: AnvilSetBalanceJsonRpcRequest;
    anvil_setCode: AnvilSetCodeJsonRpcRequest;
    anvil_setNonce: AnvilSetNonceJsonRpcRequest;
    anvil_setStorageAt: AnvilSetStorageAtJsonRpcRequest;
    anvil_setChainId: AnvilSetChainIdJsonRpcRequest;
    anvil_dumpState: AnvilDumpStateJsonRpcRequest;
    anvil_loadState: AnvilLoadStateJsonRpcRequest;
};

/**
 * A mapping of `debug_*` method names to their request type
 */
type DebugRequestType = {
    debug_traceTransaction: DebugTraceTransactionJsonRpcRequest;
    debug_traceCall: DebugTraceCallJsonRpcRequest;
};

/**
 * A mapping of `eth_*` method names to their request type
 */
type EthRequestType = {
    eth_call: EthCallJsonRpcRequest;
    eth_gasPrice: EthGasPriceJsonRpcRequest;
    eth_sign: EthSignJsonRpcRequest;
    eth_newBlockFilter: EthNewBlockFilterJsonRpcRequest;
    eth_mining: EthMiningJsonRpcRequest;
    eth_chainId: EthChainIdJsonRpcRequest;
    eth_getCode: EthGetCodeJsonRpcRequest;
    eth_getLogs: EthGetLogsJsonRpcRequest;
    eth_syncing: EthSyncingJsonRpcRequest;
    eth_accounts: EthAccountsJsonRpcRequest;
    eth_coinbase: EthCoinbaseJsonRpcRequest;
    eth_hashrate: EthHashrateJsonRpcRequest;
    eth_newFilter: EthNewFilterJsonRpcRequest;
    eth_getBalance: EthGetBalanceJsonRpcRequest;
    eth_blockNumber: EthBlockNumberJsonRpcRequest;
    eth_estimateGas: EthEstimateGasJsonRpcRequest;
    eth_getStorageAt: EthGetStorageAtJsonRpcRequest;
    eth_getFilterLogs: EthGetFilterLogsJsonRpcRequest;
    eth_getBlockByHash: EthGetBlockByHashJsonRpcRequest;
    eth_protocolVersion: EthProtocolVersionJsonRpcRequest;
    eth_sendTransaction: EthSendTransactionJsonRpcRequest;
    eth_signTransaction: EthSignTransactionJsonRpcRequest;
    eth_uninstallFilter: EthUninstallFilterJsonRpcRequest;
    eth_getBlockByNumber: EthGetBlockByNumberJsonRpcRequest;
    eth_getFilterChanges: EthGetFilterChangesJsonRpcRequest;
    eth_sendRawTransaction: EthSendRawTransactionJsonRpcRequest;
    eth_getTransactionCount: EthGetTransactionCountJsonRpcRequest;
    eth_getTransactionByHash: EthGetTransactionByHashJsonRpcRequest;
    eth_getTransactionReceipt: EthGetTransactionReceiptJsonRpcRequest;
    eth_getUncleCountByBlockHash: EthGetUncleCountByBlockHashJsonRpcRequest;
    eth_getUncleCountByBlockNumber: EthGetUncleCountByBlockNumberJsonRpcRequest;
    eth_getUncleByBlockHashAndIndex: EthGetUncleByBlockHashAndIndexJsonRpcRequest;
    eth_newPendingTransactionFilter: EthNewPendingTransactionFilterJsonRpcRequest;
    eth_getUncleByBlockNumberAndIndex: EthGetUncleByBlockNumberAndIndexJsonRpcRequest;
    eth_getBlockTransactionCountByHash: EthGetBlockTransactionCountByHashJsonRpcRequest;
    eth_getBlockTransactionCountByNumber: EthGetBlockTransactionCountByNumberJsonRpcRequest;
    eth_getTransactionByBlockHashAndIndex: EthGetTransactionByBlockHashAndIndexJsonRpcRequest;
    eth_getTransactionByBlockNumberAndIndex: EthGetTransactionByBlockNumberAndIndexJsonRpcRequest;
};

/**
 * A mapping of `tevm_*` method names to their request type
 */
type TevmRequestType = {
    tevm_call: CallJsonRpcRequest;
    /**
     * @deprecated
     */
    tevm_script: ScriptJsonRpcRequest;
    tevm_loadState: LoadStateJsonRpcRequest;
    tevm_dumpState: DumpStateJsonRpcRequest;
    tevm_getAccount: GetAccountJsonRpcRequest;
    tevm_setAccount: SetAccountJsonRpcRequest;
    tevm_mine: MineJsonRpcRequest;
};

/**
 * Utility type to get the request type given a method name
 * @example
 * ```typescript
 * type BlockNumberRequestType = JsonRpcRequestTypeFromMethod<'eth_blockNumber'>
 * ```
 */
type JsonRpcRequestTypeFromMethod<TMethod extends keyof EthRequestType | keyof TevmRequestType | keyof AnvilRequestType | keyof DebugRequestType> = (EthRequestType & TevmRequestType & AnvilRequestType & DebugRequestType)[TMethod];

declare function blockToJsonRpcBlock(block: _tevm_block.Block, includeTransactions: boolean): Promise<Required<EthGetBlockByHashJsonRpcResponse>["result"]>;

declare function generateRandomId(): _tevm_utils.Hex;

declare function parseBlockTag(blockTag: _tevm_utils.Hex | _tevm_utils.BlockTag): bigint | _tevm_utils.Hex | _tevm_utils.BlockTag;

declare function txToJsonRpcTx(tx: _tevm_tx.TypedTransaction | _tevm_tx.ImpersonatedTx, block: _tevm_block.Block, txIndex?: number | undefined): _tevm_actions.TransactionResult;

export { type AnvilDropTransactionJsonRpcRequest, type AnvilDropTransactionJsonRpcResponse, type AnvilDropTransactionProcedure, type AnvilDumpStateJsonRpcRequest, type AnvilDumpStateJsonRpcResponse, type AnvilDumpStateProcedure, type AnvilGetAutomineJsonRpcRequest, type AnvilGetAutomineJsonRpcResponse, type AnvilGetAutomineProcedure, type AnvilImpersonateAccountJsonRpcRequest, type AnvilImpersonateAccountJsonRpcResponse, type AnvilImpersonateAccountProcedure, type AnvilJsonRpcRequest, type AnvilLoadStateJsonRpcRequest, type AnvilLoadStateJsonRpcResponse, type AnvilLoadStateProcedure, type AnvilMineJsonRpcRequest, type AnvilMineJsonRpcResponse, type AnvilMineProcedure, type AnvilRequestType, type AnvilResetJsonRpcRequest, type AnvilResetJsonRpcResponse, type AnvilResetProcedure, type AnvilReturnType, type AnvilSetBalanceJsonRpcRequest, type AnvilSetBalanceJsonRpcResponse, type AnvilSetBalanceProcedure, type AnvilSetChainIdJsonRpcRequest, type AnvilSetChainIdJsonRpcResponse, type AnvilSetChainIdProcedure, type AnvilSetCodeJsonRpcRequest, type AnvilSetCodeJsonRpcResponse, type AnvilSetCodeProcedure, type AnvilSetCoinbaseJsonRpcRequest, type AnvilSetCoinbaseJsonRpcResponse, type AnvilSetCoinbaseProcedure, type AnvilSetNonceJsonRpcRequest, type AnvilSetNonceJsonRpcResponse, type AnvilSetNonceProcedure, type AnvilSetStorageAtJsonRpcRequest, type AnvilSetStorageAtJsonRpcResponse, type AnvilSetStorageAtProcedure, type AnvilStopImpersonatingAccountJsonRpcRequest, type AnvilStopImpersonatingAccountJsonRpcResponse, type AnvilStopImpersonatingAccountProcedure, type BigIntToHex, type CallJsonRpcProcedure, type CallJsonRpcRequest, type CallJsonRpcResponse, type DebugJsonRpcRequest, type DebugRequestType, type DebugReturnType, type DebugTraceCallJsonRpcRequest, type DebugTraceCallJsonRpcResponse, type DebugTraceCallProcedure, type DebugTraceTransactionJsonRpcRequest, type DebugTraceTransactionJsonRpcResponse, type DebugTraceTransactionProcedure, type DumpStateJsonRpcProcedure, type DumpStateJsonRpcRequest, type DumpStateJsonRpcResponse, type EthAccountsJsonRpcProcedure, type EthAccountsJsonRpcRequest, type EthAccountsJsonRpcResponse, type EthBlockNumberJsonRpcProcedure, type EthBlockNumberJsonRpcRequest, type EthBlockNumberJsonRpcResponse, type EthCallJsonRpcProcedure, type EthCallJsonRpcRequest, type EthCallJsonRpcResponse, type EthChainIdJsonRpcProcedure, type EthChainIdJsonRpcRequest, type EthChainIdJsonRpcResponse, type EthCoinbaseJsonRpcProcedure, type EthCoinbaseJsonRpcRequest, type EthCoinbaseJsonRpcResponse, type EthEstimateGasJsonRpcProcedure, type EthEstimateGasJsonRpcRequest, type EthEstimateGasJsonRpcResponse, type EthGasPriceJsonRpcProcedure, type EthGasPriceJsonRpcRequest, type EthGasPriceJsonRpcResponse, type EthGetBalanceJsonRpcProcedure, type EthGetBalanceJsonRpcRequest, type EthGetBalanceJsonRpcResponse, type EthGetBlockByHashJsonRpcProcedure, type EthGetBlockByHashJsonRpcRequest, type EthGetBlockByHashJsonRpcResponse, type EthGetBlockByNumberJsonRpcProcedure, type EthGetBlockByNumberJsonRpcRequest, type EthGetBlockByNumberJsonRpcResponse, type EthGetBlockTransactionCountByHashJsonRpcProcedure, type EthGetBlockTransactionCountByHashJsonRpcRequest, type EthGetBlockTransactionCountByHashJsonRpcResponse, type EthGetBlockTransactionCountByNumberJsonRpcProcedure, type EthGetBlockTransactionCountByNumberJsonRpcRequest, type EthGetBlockTransactionCountByNumberJsonRpcResponse, type EthGetCodeJsonRpcProcedure, type EthGetCodeJsonRpcRequest, type EthGetCodeJsonRpcResponse, type EthGetFilterChangesJsonRpcProcedure, type EthGetFilterChangesJsonRpcRequest, type EthGetFilterChangesJsonRpcResponse, type EthGetFilterLogsJsonRpcProcedure, type EthGetFilterLogsJsonRpcRequest, type EthGetFilterLogsJsonRpcResponse, type EthGetLogsJsonRpcProcedure, type EthGetLogsJsonRpcRequest, type EthGetLogsJsonRpcResponse, type EthGetStorageAtJsonRpcProcedure, type EthGetStorageAtJsonRpcRequest, type EthGetStorageAtJsonRpcResponse, type EthGetTransactionByBlockHashAndIndexJsonRpcProcedure, type EthGetTransactionByBlockHashAndIndexJsonRpcRequest, type EthGetTransactionByBlockHashAndIndexJsonRpcResponse, type EthGetTransactionByBlockNumberAndIndexJsonRpcProcedure, type EthGetTransactionByBlockNumberAndIndexJsonRpcRequest, type EthGetTransactionByBlockNumberAndIndexJsonRpcResponse, type EthGetTransactionByHashJsonRpcProcedure, type EthGetTransactionByHashJsonRpcRequest, type EthGetTransactionByHashJsonRpcResponse, type EthGetTransactionCountJsonRpcProcedure, type EthGetTransactionCountJsonRpcRequest, type EthGetTransactionCountJsonRpcResponse, type EthGetTransactionReceiptJsonRpcProcedure, type EthGetTransactionReceiptJsonRpcRequest, type EthGetTransactionReceiptJsonRpcResponse, type EthGetUncleByBlockHashAndIndexJsonRpcProcedure, type EthGetUncleByBlockHashAndIndexJsonRpcRequest, type EthGetUncleByBlockHashAndIndexJsonRpcResponse, type EthGetUncleByBlockNumberAndIndexJsonRpcProcedure, type EthGetUncleByBlockNumberAndIndexJsonRpcRequest, type EthGetUncleByBlockNumberAndIndexJsonRpcResponse, type EthGetUncleCountByBlockHashJsonRpcProcedure, type EthGetUncleCountByBlockHashJsonRpcRequest, type EthGetUncleCountByBlockHashJsonRpcResponse, type EthGetUncleCountByBlockNumberJsonRpcProcedure, type EthGetUncleCountByBlockNumberJsonRpcRequest, type EthGetUncleCountByBlockNumberJsonRpcResponse, type EthHashrateJsonRpcProcedure, type EthHashrateJsonRpcRequest, type EthHashrateJsonRpcResponse, type EthJsonRpcRequest, type EthMiningJsonRpcProcedure, type EthMiningJsonRpcRequest, type EthMiningJsonRpcResponse, type EthNewBlockFilterJsonRpcProcedure, type EthNewBlockFilterJsonRpcRequest, type EthNewBlockFilterJsonRpcResponse, type EthNewFilterJsonRpcProcedure, type EthNewFilterJsonRpcRequest, type EthNewFilterJsonRpcResponse, type EthNewPendingTransactionFilterJsonRpcProcedure, type EthNewPendingTransactionFilterJsonRpcRequest, type EthNewPendingTransactionFilterJsonRpcResponse, type EthProtocolVersionJsonRpcProcedure, type EthProtocolVersionJsonRpcRequest, type EthProtocolVersionJsonRpcResponse, type EthRequestType, type EthReturnType, type EthSendRawTransactionJsonRpcProcedure, type EthSendRawTransactionJsonRpcRequest, type EthSendRawTransactionJsonRpcResponse, type EthSendTransactionJsonRpcProcedure, type EthSendTransactionJsonRpcRequest, type EthSendTransactionJsonRpcResponse, type EthSignJsonRpcProcedure, type EthSignJsonRpcRequest, type EthSignJsonRpcResponse, type EthSignTransactionJsonRpcProcedure, type EthSignTransactionJsonRpcRequest, type EthSignTransactionJsonRpcResponse, type EthSyncingJsonRpcProcedure, type EthSyncingJsonRpcRequest, type EthSyncingJsonRpcResponse, type EthUninstallFilterJsonRpcProcedure, type EthUninstallFilterJsonRpcRequest, type EthUninstallFilterJsonRpcResponse, type GetAccountJsonRpcProcedure, type GetAccountJsonRpcRequest, type GetAccountJsonRpcResponse, type JsonRpcRequestTypeFromMethod, type JsonRpcReturnTypeFromMethod, type JsonRpcTransaction, type JsonSerializable, type JsonSerializableArray, type JsonSerializableObject, type JsonSerializableSet, type LoadStateJsonRpcProcedure, type LoadStateJsonRpcRequest, type LoadStateJsonRpcResponse, type MineJsonRpcProcedure, type MineJsonRpcRequest, type MineJsonRpcResponse, type ScriptJsonRpcProcedure, type ScriptJsonRpcRequest, type ScriptJsonRpcResponse, type SerializeToJson, type SerializedParams, type SetAccountJsonRpcProcedure, type SetAccountJsonRpcRequest, type SetAccountJsonRpcResponse, type SetToHex, type TevmJsonRpcBulkRequestHandler, type TevmJsonRpcRequest, type TevmJsonRpcRequestHandler, type TevmRequestType, type TevmReturnType, anvilDropTransactionJsonRpcProcedure, anvilDumpStateJsonRpcProcedure, anvilGetAutomineJsonRpcProcedure, anvilImpersonateAccountJsonRpcProcedure, anvilLoadStateJsonRpcProcedure, anvilResetJsonRpcProcedure, anvilSetBalanceJsonRpcProcedure, anvilSetChainIdJsonRpcProcedure, anvilSetCoinbaseJsonRpcProcedure, anvilSetNonceJsonRpcProcedure, anvilSetStorageAtJsonRpcProcedure, anvilStopImpersonatingAccountJsonRpcProcedure, blockNumberProcedure, blockToJsonRpcBlock, callProcedure, chainIdProcedure, debugTraceCallJsonRpcProcedure, debugTraceTransactionJsonRpcProcedure, dumpStateProcedure, ethAccountsProcedure, ethBlobBaseFeeJsonRpcProcedure, ethCallProcedure, ethCoinbaseJsonRpcProcedure, ethEstimateGasJsonRpcProcedure, ethGetBlockByHashJsonRpcProcedure, ethGetBlockByNumberJsonRpcProcedure, ethGetBlockTransactionCountByHashJsonRpcProcedure, ethGetBlockTransactionCountByNumberJsonRpcProcedure, ethGetFilterChangesProcedure, ethGetFilterLogsProcedure, ethGetLogsProcedure, ethGetTransactionByBlockHashAndIndexJsonRpcProcedure, ethGetTransactionByBlockNumberAndIndexJsonRpcProcedure, ethGetTransactionByHashJsonRpcProcedure, ethGetTransactionCountProcedure, ethGetTransactionReceiptJsonRpcProcedure, ethNewBlockFilterProcedure, ethNewFilterJsonRpcProcedure, ethNewPendingTransactionFilterProcedure, ethProtocolVersionJsonRpcProcedure, ethSendRawTransactionJsonRpcProcedure, ethSendTransactionJsonRpcProcedure, ethSignProcedure, ethSignTransactionProcedure, ethUninstallFilterJsonRpcProcedure, gasPriceProcedure, generateRandomId, getAccountProcedure, getBalanceProcedure, getCodeProcedure, getStorageAtProcedure, loadStateProcedure, mineProcedure, parseBlockTag, requestBulkProcedure, requestProcedure, scriptProcedure, setAccountProcedure, txToJsonRpcTx };

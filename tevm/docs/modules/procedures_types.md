[tevm](../README.md) / [Modules](../modules.md) / procedures-types

# Module: procedures-types

## Table of contents

### References

- [JsonRpcRequestTypeFromMethod](procedures_types.md#jsonrpcrequesttypefrommethod)
- [JsonRpcReturnTypeFromMethod](procedures_types.md#jsonrpcreturntypefrommethod)
- [TevmJsonRpcBulkRequestHandler](procedures_types.md#tevmjsonrpcbulkrequesthandler)
- [TevmJsonRpcRequest](procedures_types.md#tevmjsonrpcrequest)
- [TevmJsonRpcRequestHandler](procedures_types.md#tevmjsonrpcrequesthandler)

### Type Aliases

- [AnvilDropTransactionJsonRpcRequest](procedures_types.md#anvildroptransactionjsonrpcrequest)
- [AnvilDropTransactionJsonRpcResponse](procedures_types.md#anvildroptransactionjsonrpcresponse)
- [AnvilDropTransactionProcedure](procedures_types.md#anvildroptransactionprocedure)
- [AnvilDumpStateJsonRpcRequest](procedures_types.md#anvildumpstatejsonrpcrequest)
- [AnvilDumpStateJsonRpcResponse](procedures_types.md#anvildumpstatejsonrpcresponse)
- [AnvilDumpStateProcedure](procedures_types.md#anvildumpstateprocedure)
- [AnvilGetAutomineJsonRpcRequest](procedures_types.md#anvilgetautominejsonrpcrequest)
- [AnvilGetAutomineJsonRpcResponse](procedures_types.md#anvilgetautominejsonrpcresponse)
- [AnvilGetAutomineProcedure](procedures_types.md#anvilgetautomineprocedure)
- [AnvilImpersonateAccountJsonRpcRequest](procedures_types.md#anvilimpersonateaccountjsonrpcrequest)
- [AnvilImpersonateAccountJsonRpcResponse](procedures_types.md#anvilimpersonateaccountjsonrpcresponse)
- [AnvilImpersonateAccountProcedure](procedures_types.md#anvilimpersonateaccountprocedure)
- [AnvilJsonRpcRequest](procedures_types.md#anviljsonrpcrequest)
- [AnvilLoadStateJsonRpcRequest](procedures_types.md#anvilloadstatejsonrpcrequest)
- [AnvilLoadStateJsonRpcResponse](procedures_types.md#anvilloadstatejsonrpcresponse)
- [AnvilLoadStateProcedure](procedures_types.md#anvilloadstateprocedure)
- [AnvilMineJsonRpcRequest](procedures_types.md#anvilminejsonrpcrequest)
- [AnvilMineJsonRpcResponse](procedures_types.md#anvilminejsonrpcresponse)
- [AnvilMineProcedure](procedures_types.md#anvilmineprocedure)
- [AnvilRequestType](procedures_types.md#anvilrequesttype)
- [AnvilResetJsonRpcRequest](procedures_types.md#anvilresetjsonrpcrequest)
- [AnvilResetJsonRpcResponse](procedures_types.md#anvilresetjsonrpcresponse)
- [AnvilResetProcedure](procedures_types.md#anvilresetprocedure)
- [AnvilReturnType](procedures_types.md#anvilreturntype)
- [AnvilSetBalanceJsonRpcRequest](procedures_types.md#anvilsetbalancejsonrpcrequest)
- [AnvilSetBalanceJsonRpcResponse](procedures_types.md#anvilsetbalancejsonrpcresponse)
- [AnvilSetBalanceProcedure](procedures_types.md#anvilsetbalanceprocedure)
- [AnvilSetChainIdJsonRpcRequest](procedures_types.md#anvilsetchainidjsonrpcrequest)
- [AnvilSetChainIdJsonRpcResponse](procedures_types.md#anvilsetchainidjsonrpcresponse)
- [AnvilSetChainIdProcedure](procedures_types.md#anvilsetchainidprocedure)
- [AnvilSetCodeJsonRpcRequest](procedures_types.md#anvilsetcodejsonrpcrequest)
- [AnvilSetCodeJsonRpcResponse](procedures_types.md#anvilsetcodejsonrpcresponse)
- [AnvilSetCodeProcedure](procedures_types.md#anvilsetcodeprocedure)
- [AnvilSetNonceJsonRpcRequest](procedures_types.md#anvilsetnoncejsonrpcrequest)
- [AnvilSetNonceJsonRpcResponse](procedures_types.md#anvilsetnoncejsonrpcresponse)
- [AnvilSetNonceProcedure](procedures_types.md#anvilsetnonceprocedure)
- [AnvilSetStorageAtJsonRpcRequest](procedures_types.md#anvilsetstorageatjsonrpcrequest)
- [AnvilSetStorageAtJsonRpcResponse](procedures_types.md#anvilsetstorageatjsonrpcresponse)
- [AnvilSetStorageAtProcedure](procedures_types.md#anvilsetstorageatprocedure)
- [AnvilStopImpersonatingAccountJsonRpcRequest](procedures_types.md#anvilstopimpersonatingaccountjsonrpcrequest)
- [AnvilStopImpersonatingAccountJsonRpcResponse](procedures_types.md#anvilstopimpersonatingaccountjsonrpcresponse)
- [AnvilStopImpersonatingAccountProcedure](procedures_types.md#anvilstopimpersonatingaccountprocedure)
- [BigIntToHex](procedures_types.md#biginttohex)
- [CallJsonRpcProcedure](procedures_types.md#calljsonrpcprocedure)
- [CallJsonRpcRequest](procedures_types.md#calljsonrpcrequest)
- [CallJsonRpcResponse](procedures_types.md#calljsonrpcresponse)
- [ContractJsonRpcProcedure](procedures_types.md#contractjsonrpcprocedure)
- [ContractJsonRpcRequest](procedures_types.md#contractjsonrpcrequest)
- [ContractJsonRpcResponse](procedures_types.md#contractjsonrpcresponse)
- [DebugJsonRpcRequest](procedures_types.md#debugjsonrpcrequest)
- [DebugRequestType](procedures_types.md#debugrequesttype)
- [DebugReturnType](procedures_types.md#debugreturntype)
- [DebugTraceCallJsonRpcRequest](procedures_types.md#debugtracecalljsonrpcrequest)
- [DebugTraceCallJsonRpcResponse](procedures_types.md#debugtracecalljsonrpcresponse)
- [DebugTraceCallProcedure](procedures_types.md#debugtracecallprocedure)
- [DebugTraceTransactionJsonRpcRequest](procedures_types.md#debugtracetransactionjsonrpcrequest)
- [DebugTraceTransactionJsonRpcResponse](procedures_types.md#debugtracetransactionjsonrpcresponse)
- [DebugTraceTransactionProcedure](procedures_types.md#debugtracetransactionprocedure)
- [DumpStateJsonRpcProcedure](procedures_types.md#dumpstatejsonrpcprocedure)
- [DumpStateJsonRpcRequest](procedures_types.md#dumpstatejsonrpcrequest)
- [DumpStateJsonRpcResponse](procedures_types.md#dumpstatejsonrpcresponse)
- [EthAccountsJsonRpcProcedure](procedures_types.md#ethaccountsjsonrpcprocedure)
- [EthAccountsJsonRpcRequest](procedures_types.md#ethaccountsjsonrpcrequest)
- [EthAccountsJsonRpcResponse](procedures_types.md#ethaccountsjsonrpcresponse)
- [EthBlockNumberJsonRpcProcedure](procedures_types.md#ethblocknumberjsonrpcprocedure)
- [EthBlockNumberJsonRpcRequest](procedures_types.md#ethblocknumberjsonrpcrequest)
- [EthBlockNumberJsonRpcResponse](procedures_types.md#ethblocknumberjsonrpcresponse)
- [EthCallJsonRpcProcedure](procedures_types.md#ethcalljsonrpcprocedure)
- [EthCallJsonRpcRequest](procedures_types.md#ethcalljsonrpcrequest)
- [EthCallJsonRpcResponse](procedures_types.md#ethcalljsonrpcresponse)
- [EthChainIdJsonRpcProcedure](procedures_types.md#ethchainidjsonrpcprocedure)
- [EthChainIdJsonRpcRequest](procedures_types.md#ethchainidjsonrpcrequest)
- [EthChainIdJsonRpcResponse](procedures_types.md#ethchainidjsonrpcresponse)
- [EthCoinbaseJsonRpcProcedure](procedures_types.md#ethcoinbasejsonrpcprocedure)
- [EthCoinbaseJsonRpcRequest](procedures_types.md#ethcoinbasejsonrpcrequest)
- [EthCoinbaseJsonRpcResponse](procedures_types.md#ethcoinbasejsonrpcresponse)
- [EthEstimateGasJsonRpcProcedure](procedures_types.md#ethestimategasjsonrpcprocedure)
- [EthEstimateGasJsonRpcRequest](procedures_types.md#ethestimategasjsonrpcrequest)
- [EthEstimateGasJsonRpcResponse](procedures_types.md#ethestimategasjsonrpcresponse)
- [EthGasPriceJsonRpcProcedure](procedures_types.md#ethgaspricejsonrpcprocedure)
- [EthGasPriceJsonRpcRequest](procedures_types.md#ethgaspricejsonrpcrequest)
- [EthGasPriceJsonRpcResponse](procedures_types.md#ethgaspricejsonrpcresponse)
- [EthGetBalanceJsonRpcProcedure](procedures_types.md#ethgetbalancejsonrpcprocedure)
- [EthGetBalanceJsonRpcRequest](procedures_types.md#ethgetbalancejsonrpcrequest)
- [EthGetBalanceJsonRpcResponse](procedures_types.md#ethgetbalancejsonrpcresponse)
- [EthGetBlockByHashJsonRpcProcedure](procedures_types.md#ethgetblockbyhashjsonrpcprocedure)
- [EthGetBlockByHashJsonRpcRequest](procedures_types.md#ethgetblockbyhashjsonrpcrequest)
- [EthGetBlockByHashJsonRpcResponse](procedures_types.md#ethgetblockbyhashjsonrpcresponse)
- [EthGetBlockByNumberJsonRpcProcedure](procedures_types.md#ethgetblockbynumberjsonrpcprocedure)
- [EthGetBlockByNumberJsonRpcRequest](procedures_types.md#ethgetblockbynumberjsonrpcrequest)
- [EthGetBlockByNumberJsonRpcResponse](procedures_types.md#ethgetblockbynumberjsonrpcresponse)
- [EthGetBlockTransactionCountByHashJsonRpcProcedure](procedures_types.md#ethgetblocktransactioncountbyhashjsonrpcprocedure)
- [EthGetBlockTransactionCountByHashJsonRpcRequest](procedures_types.md#ethgetblocktransactioncountbyhashjsonrpcrequest)
- [EthGetBlockTransactionCountByHashJsonRpcResponse](procedures_types.md#ethgetblocktransactioncountbyhashjsonrpcresponse)
- [EthGetBlockTransactionCountByNumberJsonRpcProcedure](procedures_types.md#ethgetblocktransactioncountbynumberjsonrpcprocedure)
- [EthGetBlockTransactionCountByNumberJsonRpcRequest](procedures_types.md#ethgetblocktransactioncountbynumberjsonrpcrequest)
- [EthGetBlockTransactionCountByNumberJsonRpcResponse](procedures_types.md#ethgetblocktransactioncountbynumberjsonrpcresponse)
- [EthGetCodeJsonRpcProcedure](procedures_types.md#ethgetcodejsonrpcprocedure)
- [EthGetCodeJsonRpcRequest](procedures_types.md#ethgetcodejsonrpcrequest)
- [EthGetCodeJsonRpcResponse](procedures_types.md#ethgetcodejsonrpcresponse)
- [EthGetFilterChangesJsonRpcProcedure](procedures_types.md#ethgetfilterchangesjsonrpcprocedure)
- [EthGetFilterChangesJsonRpcRequest](procedures_types.md#ethgetfilterchangesjsonrpcrequest)
- [EthGetFilterChangesJsonRpcResponse](procedures_types.md#ethgetfilterchangesjsonrpcresponse)
- [EthGetFilterLogsJsonRpcProcedure](procedures_types.md#ethgetfilterlogsjsonrpcprocedure)
- [EthGetFilterLogsJsonRpcRequest](procedures_types.md#ethgetfilterlogsjsonrpcrequest)
- [EthGetFilterLogsJsonRpcResponse](procedures_types.md#ethgetfilterlogsjsonrpcresponse)
- [EthGetLogsJsonRpcProcedure](procedures_types.md#ethgetlogsjsonrpcprocedure)
- [EthGetLogsJsonRpcRequest](procedures_types.md#ethgetlogsjsonrpcrequest)
- [EthGetLogsJsonRpcResponse](procedures_types.md#ethgetlogsjsonrpcresponse)
- [EthGetStorageAtJsonRpcProcedure](procedures_types.md#ethgetstorageatjsonrpcprocedure)
- [EthGetStorageAtJsonRpcRequest](procedures_types.md#ethgetstorageatjsonrpcrequest)
- [EthGetStorageAtJsonRpcResponse](procedures_types.md#ethgetstorageatjsonrpcresponse)
- [EthGetTransactionByBlockHashAndIndexJsonRpcProcedure](procedures_types.md#ethgettransactionbyblockhashandindexjsonrpcprocedure)
- [EthGetTransactionByBlockHashAndIndexJsonRpcRequest](procedures_types.md#ethgettransactionbyblockhashandindexjsonrpcrequest)
- [EthGetTransactionByBlockHashAndIndexJsonRpcResponse](procedures_types.md#ethgettransactionbyblockhashandindexjsonrpcresponse)
- [EthGetTransactionByBlockNumberAndIndexJsonRpcProcedure](procedures_types.md#ethgettransactionbyblocknumberandindexjsonrpcprocedure)
- [EthGetTransactionByBlockNumberAndIndexJsonRpcRequest](procedures_types.md#ethgettransactionbyblocknumberandindexjsonrpcrequest)
- [EthGetTransactionByBlockNumberAndIndexJsonRpcResponse](procedures_types.md#ethgettransactionbyblocknumberandindexjsonrpcresponse)
- [EthGetTransactionByHashJsonRpcProcedure](procedures_types.md#ethgettransactionbyhashjsonrpcprocedure)
- [EthGetTransactionByHashJsonRpcRequest](procedures_types.md#ethgettransactionbyhashjsonrpcrequest)
- [EthGetTransactionByHashJsonRpcResponse](procedures_types.md#ethgettransactionbyhashjsonrpcresponse)
- [EthGetTransactionCountJsonRpcProcedure](procedures_types.md#ethgettransactioncountjsonrpcprocedure)
- [EthGetTransactionCountJsonRpcRequest](procedures_types.md#ethgettransactioncountjsonrpcrequest)
- [EthGetTransactionCountJsonRpcResponse](procedures_types.md#ethgettransactioncountjsonrpcresponse)
- [EthGetTransactionReceiptJsonRpcProcedure](procedures_types.md#ethgettransactionreceiptjsonrpcprocedure)
- [EthGetTransactionReceiptJsonRpcRequest](procedures_types.md#ethgettransactionreceiptjsonrpcrequest)
- [EthGetTransactionReceiptJsonRpcResponse](procedures_types.md#ethgettransactionreceiptjsonrpcresponse)
- [EthGetUncleByBlockHashAndIndexJsonRpcProcedure](procedures_types.md#ethgetunclebyblockhashandindexjsonrpcprocedure)
- [EthGetUncleByBlockHashAndIndexJsonRpcRequest](procedures_types.md#ethgetunclebyblockhashandindexjsonrpcrequest)
- [EthGetUncleByBlockHashAndIndexJsonRpcResponse](procedures_types.md#ethgetunclebyblockhashandindexjsonrpcresponse)
- [EthGetUncleByBlockNumberAndIndexJsonRpcProcedure](procedures_types.md#ethgetunclebyblocknumberandindexjsonrpcprocedure)
- [EthGetUncleByBlockNumberAndIndexJsonRpcRequest](procedures_types.md#ethgetunclebyblocknumberandindexjsonrpcrequest)
- [EthGetUncleByBlockNumberAndIndexJsonRpcResponse](procedures_types.md#ethgetunclebyblocknumberandindexjsonrpcresponse)
- [EthGetUncleCountByBlockHashJsonRpcProcedure](procedures_types.md#ethgetunclecountbyblockhashjsonrpcprocedure)
- [EthGetUncleCountByBlockHashJsonRpcRequest](procedures_types.md#ethgetunclecountbyblockhashjsonrpcrequest)
- [EthGetUncleCountByBlockHashJsonRpcResponse](procedures_types.md#ethgetunclecountbyblockhashjsonrpcresponse)
- [EthGetUncleCountByBlockNumberJsonRpcProcedure](procedures_types.md#ethgetunclecountbyblocknumberjsonrpcprocedure)
- [EthGetUncleCountByBlockNumberJsonRpcRequest](procedures_types.md#ethgetunclecountbyblocknumberjsonrpcrequest)
- [EthGetUncleCountByBlockNumberJsonRpcResponse](procedures_types.md#ethgetunclecountbyblocknumberjsonrpcresponse)
- [EthHashrateJsonRpcProcedure](procedures_types.md#ethhashratejsonrpcprocedure)
- [EthHashrateJsonRpcRequest](procedures_types.md#ethhashratejsonrpcrequest)
- [EthHashrateJsonRpcResponse](procedures_types.md#ethhashratejsonrpcresponse)
- [EthJsonRpcRequest](procedures_types.md#ethjsonrpcrequest)
- [EthMiningJsonRpcProcedure](procedures_types.md#ethminingjsonrpcprocedure)
- [EthMiningJsonRpcRequest](procedures_types.md#ethminingjsonrpcrequest)
- [EthMiningJsonRpcResponse](procedures_types.md#ethminingjsonrpcresponse)
- [EthNewBlockFilterJsonRpcProcedure](procedures_types.md#ethnewblockfilterjsonrpcprocedure)
- [EthNewBlockFilterJsonRpcRequest](procedures_types.md#ethnewblockfilterjsonrpcrequest)
- [EthNewBlockFilterJsonRpcResponse](procedures_types.md#ethnewblockfilterjsonrpcresponse)
- [EthNewFilterJsonRpcProcedure](procedures_types.md#ethnewfilterjsonrpcprocedure)
- [EthNewFilterJsonRpcRequest](procedures_types.md#ethnewfilterjsonrpcrequest)
- [EthNewFilterJsonRpcResponse](procedures_types.md#ethnewfilterjsonrpcresponse)
- [EthNewPendingTransactionFilterJsonRpcProcedure](procedures_types.md#ethnewpendingtransactionfilterjsonrpcprocedure)
- [EthNewPendingTransactionFilterJsonRpcRequest](procedures_types.md#ethnewpendingtransactionfilterjsonrpcrequest)
- [EthNewPendingTransactionFilterJsonRpcResponse](procedures_types.md#ethnewpendingtransactionfilterjsonrpcresponse)
- [EthProtocolVersionJsonRpcProcedure](procedures_types.md#ethprotocolversionjsonrpcprocedure)
- [EthProtocolVersionJsonRpcRequest](procedures_types.md#ethprotocolversionjsonrpcrequest)
- [EthProtocolVersionJsonRpcResponse](procedures_types.md#ethprotocolversionjsonrpcresponse)
- [EthRequestType](procedures_types.md#ethrequesttype)
- [EthReturnType](procedures_types.md#ethreturntype)
- [EthSendRawTransactionJsonRpcProcedure](procedures_types.md#ethsendrawtransactionjsonrpcprocedure)
- [EthSendRawTransactionJsonRpcRequest](procedures_types.md#ethsendrawtransactionjsonrpcrequest)
- [EthSendRawTransactionJsonRpcResponse](procedures_types.md#ethsendrawtransactionjsonrpcresponse)
- [EthSendTransactionJsonRpcProcedure](procedures_types.md#ethsendtransactionjsonrpcprocedure)
- [EthSendTransactionJsonRpcRequest](procedures_types.md#ethsendtransactionjsonrpcrequest)
- [EthSendTransactionJsonRpcResponse](procedures_types.md#ethsendtransactionjsonrpcresponse)
- [EthSignJsonRpcProcedure](procedures_types.md#ethsignjsonrpcprocedure)
- [EthSignJsonRpcRequest](procedures_types.md#ethsignjsonrpcrequest)
- [EthSignJsonRpcResponse](procedures_types.md#ethsignjsonrpcresponse)
- [EthSignTransactionJsonRpcProcedure](procedures_types.md#ethsigntransactionjsonrpcprocedure)
- [EthSignTransactionJsonRpcRequest](procedures_types.md#ethsigntransactionjsonrpcrequest)
- [EthSignTransactionJsonRpcResponse](procedures_types.md#ethsigntransactionjsonrpcresponse)
- [EthSyncingJsonRpcProcedure](procedures_types.md#ethsyncingjsonrpcprocedure)
- [EthSyncingJsonRpcRequest](procedures_types.md#ethsyncingjsonrpcrequest)
- [EthSyncingJsonRpcResponse](procedures_types.md#ethsyncingjsonrpcresponse)
- [EthUninstallFilterJsonRpcProcedure](procedures_types.md#ethuninstallfilterjsonrpcprocedure)
- [EthUninstallFilterJsonRpcRequest](procedures_types.md#ethuninstallfilterjsonrpcrequest)
- [EthUninstallFilterJsonRpcResponse](procedures_types.md#ethuninstallfilterjsonrpcresponse)
- [GetAccountJsonRpcProcedure](procedures_types.md#getaccountjsonrpcprocedure)
- [GetAccountJsonRpcRequest](procedures_types.md#getaccountjsonrpcrequest)
- [GetAccountJsonRpcResponse](procedures_types.md#getaccountjsonrpcresponse)
- [JsonRpcTransaction](procedures_types.md#jsonrpctransaction)
- [JsonSerializable](procedures_types.md#jsonserializable)
- [JsonSerializableArray](procedures_types.md#jsonserializablearray)
- [JsonSerializableObject](procedures_types.md#jsonserializableobject)
- [JsonSerializableSet](procedures_types.md#jsonserializableset)
- [LoadStateJsonRpcProcedure](procedures_types.md#loadstatejsonrpcprocedure)
- [LoadStateJsonRpcRequest](procedures_types.md#loadstatejsonrpcrequest)
- [LoadStateJsonRpcResponse](procedures_types.md#loadstatejsonrpcresponse)
- [ScriptJsonRpcProcedure](procedures_types.md#scriptjsonrpcprocedure)
- [ScriptJsonRpcRequest](procedures_types.md#scriptjsonrpcrequest)
- [ScriptJsonRpcResponse](procedures_types.md#scriptjsonrpcresponse)
- [SerializeToJson](procedures_types.md#serializetojson)
- [SerializedParams](procedures_types.md#serializedparams)
- [SetAccountJsonRpcProcedure](procedures_types.md#setaccountjsonrpcprocedure)
- [SetAccountJsonRpcRequest](procedures_types.md#setaccountjsonrpcrequest)
- [SetAccountJsonRpcResponse](procedures_types.md#setaccountjsonrpcresponse)
- [SetToHex](procedures_types.md#settohex)
- [TevmRequestType](procedures_types.md#tevmrequesttype)
- [TevmReturnType](procedures_types.md#tevmreturntype)

## References

### JsonRpcRequestTypeFromMethod

Re-exports [JsonRpcRequestTypeFromMethod](index.md#jsonrpcrequesttypefrommethod)

___

### JsonRpcReturnTypeFromMethod

Re-exports [JsonRpcReturnTypeFromMethod](index.md#jsonrpcreturntypefrommethod)

___

### TevmJsonRpcBulkRequestHandler

Re-exports [TevmJsonRpcBulkRequestHandler](index.md#tevmjsonrpcbulkrequesthandler)

___

### TevmJsonRpcRequest

Re-exports [TevmJsonRpcRequest](index.md#tevmjsonrpcrequest)

___

### TevmJsonRpcRequestHandler

Re-exports [TevmJsonRpcRequestHandler](index.md#tevmjsonrpcrequesthandler)

## Type Aliases

### AnvilDropTransactionJsonRpcRequest

Ƭ **AnvilDropTransactionJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"anvil_dropTransaction"``, [[`SerializeToJson`](procedures_types.md#serializetojson)\<[`AnvilDropTransactionParams`](actions_types.md#anvildroptransactionparams)\>]\>

JSON-RPC request for `anvil_dropTransaction` method

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:56

___

### AnvilDropTransactionJsonRpcResponse

Ƭ **AnvilDropTransactionJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"anvil_dropTransaction"``, [`SerializeToJson`](procedures_types.md#serializetojson)\<[`AnvilDropTransactionResult`](actions_types.md#anvildroptransactionresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_dropTransaction` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:433

___

### AnvilDropTransactionProcedure

Ƭ **AnvilDropTransactionProcedure**: (`request`: [`AnvilDropTransactionJsonRpcRequest`](procedures_types.md#anvildroptransactionjsonrpcrequest)) => `Promise`\<[`AnvilDropTransactionJsonRpcResponse`](procedures_types.md#anvildroptransactionjsonrpcresponse)\>

JSON-RPC procedure for `anvil_dropTransaction`

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilDropTransactionJsonRpcResponse`](procedures_types.md#anvildroptransactionjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilDropTransactionJsonRpcRequest`](procedures_types.md#anvildroptransactionjsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilDropTransactionJsonRpcResponse`](procedures_types.md#anvildroptransactionjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:718

___

### AnvilDumpStateJsonRpcRequest

Ƭ **AnvilDumpStateJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"anvil_dumpState"``, [[`SerializeToJson`](procedures_types.md#serializetojson)\<[`AnvilDumpStateParams`](actions_types.md#anvildumpstateparams)\>]\>

JSON-RPC request for `anvil_dumpState` method

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:92

___

### AnvilDumpStateJsonRpcResponse

Ƭ **AnvilDumpStateJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"anvil_dumpState"``, [`SerializeToJson`](procedures_types.md#serializetojson)\<[`AnvilDumpStateResult`](actions_types.md#anvildumpstateresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_dumpState` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:457

___

### AnvilDumpStateProcedure

Ƭ **AnvilDumpStateProcedure**: (`request`: [`AnvilDumpStateJsonRpcRequest`](procedures_types.md#anvildumpstatejsonrpcrequest)) => `Promise`\<[`AnvilDumpStateJsonRpcResponse`](procedures_types.md#anvildumpstatejsonrpcresponse)\>

JSON-RPC procedure for `anvil_dumpState`

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilDumpStateJsonRpcResponse`](procedures_types.md#anvildumpstatejsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilDumpStateJsonRpcRequest`](procedures_types.md#anvildumpstatejsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilDumpStateJsonRpcResponse`](procedures_types.md#anvildumpstatejsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:742

___

### AnvilGetAutomineJsonRpcRequest

Ƭ **AnvilGetAutomineJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"anvil_getAutomine"``, [[`SerializeToJson`](procedures_types.md#serializetojson)\<[`AnvilGetAutomineParams`](actions_types.md#anvilgetautomineparams)\>]\>

JSON-RPC request for `anvil_getAutomine` method

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:38

___

### AnvilGetAutomineJsonRpcResponse

Ƭ **AnvilGetAutomineJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"anvil_getAutomine"``, [`SerializeToJson`](procedures_types.md#serializetojson)\<[`AnvilGetAutomineResult`](actions_types.md#anvilgetautomineresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_getAutomine` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:421

___

### AnvilGetAutomineProcedure

Ƭ **AnvilGetAutomineProcedure**: (`request`: [`AnvilGetAutomineJsonRpcRequest`](procedures_types.md#anvilgetautominejsonrpcrequest)) => `Promise`\<[`AnvilGetAutomineJsonRpcResponse`](procedures_types.md#anvilgetautominejsonrpcresponse)\>

JSON-RPC procedure for `anvil_getAutomine`

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilGetAutomineJsonRpcResponse`](procedures_types.md#anvilgetautominejsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilGetAutomineJsonRpcRequest`](procedures_types.md#anvilgetautominejsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilGetAutomineJsonRpcResponse`](procedures_types.md#anvilgetautominejsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:706

___

### AnvilImpersonateAccountJsonRpcRequest

Ƭ **AnvilImpersonateAccountJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"anvil_impersonateAccount"``, [[`SerializeToJson`](procedures_types.md#serializetojson)\<[`AnvilImpersonateAccountParams`](actions_types.md#anvilimpersonateaccountparams)\>]\>

JSON-RPC request for `anvil_impersonateAccount` method

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:22

___

### AnvilImpersonateAccountJsonRpcResponse

Ƭ **AnvilImpersonateAccountJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"anvil_impersonateAccount"``, [`SerializeToJson`](procedures_types.md#serializetojson)\<[`AnvilImpersonateAccountResult`](actions_types.md#anvilimpersonateaccountresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_impersonateAccount` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:409

___

### AnvilImpersonateAccountProcedure

Ƭ **AnvilImpersonateAccountProcedure**: (`request`: [`AnvilImpersonateAccountJsonRpcRequest`](procedures_types.md#anvilimpersonateaccountjsonrpcrequest)) => `Promise`\<[`AnvilImpersonateAccountJsonRpcResponse`](procedures_types.md#anvilimpersonateaccountjsonrpcresponse)\>

JSON-RPC procedure for `anvil_impersonateAccount`

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilImpersonateAccountJsonRpcResponse`](procedures_types.md#anvilimpersonateaccountjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilImpersonateAccountJsonRpcRequest`](procedures_types.md#anvilimpersonateaccountjsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilImpersonateAccountJsonRpcResponse`](procedures_types.md#anvilimpersonateaccountjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:694

___

### AnvilJsonRpcRequest

Ƭ **AnvilJsonRpcRequest**: [`AnvilImpersonateAccountJsonRpcRequest`](procedures_types.md#anvilimpersonateaccountjsonrpcrequest) \| [`AnvilStopImpersonatingAccountJsonRpcRequest`](procedures_types.md#anvilstopimpersonatingaccountjsonrpcrequest) \| [`AnvilGetAutomineJsonRpcRequest`](procedures_types.md#anvilgetautominejsonrpcrequest) \| [`AnvilMineJsonRpcRequest`](procedures_types.md#anvilminejsonrpcrequest) \| [`AnvilResetJsonRpcRequest`](procedures_types.md#anvilresetjsonrpcrequest) \| [`AnvilDropTransactionJsonRpcRequest`](procedures_types.md#anvildroptransactionjsonrpcrequest) \| [`AnvilSetBalanceJsonRpcRequest`](procedures_types.md#anvilsetbalancejsonrpcrequest) \| [`AnvilSetCodeJsonRpcRequest`](procedures_types.md#anvilsetcodejsonrpcrequest) \| [`AnvilSetNonceJsonRpcRequest`](procedures_types.md#anvilsetnoncejsonrpcrequest) \| [`AnvilSetStorageAtJsonRpcRequest`](procedures_types.md#anvilsetstorageatjsonrpcrequest) \| [`AnvilSetChainIdJsonRpcRequest`](procedures_types.md#anvilsetchainidjsonrpcrequest) \| [`AnvilDumpStateJsonRpcRequest`](procedures_types.md#anvildumpstatejsonrpcrequest) \| [`AnvilLoadStateJsonRpcRequest`](procedures_types.md#anvilloadstatejsonrpcrequest)

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:101

___

### AnvilLoadStateJsonRpcRequest

Ƭ **AnvilLoadStateJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"anvil_loadState"``, [[`SerializeToJson`](procedures_types.md#serializetojson)\<[`AnvilLoadStateParams`](actions_types.md#anvilloadstateparams)\>]\>

JSON-RPC request for `anvil_loadState` method

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:98

___

### AnvilLoadStateJsonRpcResponse

Ƭ **AnvilLoadStateJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"anvil_loadState"``, [`SerializeToJson`](procedures_types.md#serializetojson)\<[`AnvilLoadStateResult`](actions_types.md#anvilloadstateresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_loadState` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:461

___

### AnvilLoadStateProcedure

Ƭ **AnvilLoadStateProcedure**: (`request`: [`AnvilLoadStateJsonRpcRequest`](procedures_types.md#anvilloadstatejsonrpcrequest)) => `Promise`\<[`AnvilLoadStateJsonRpcResponse`](procedures_types.md#anvilloadstatejsonrpcresponse)\>

JSON-RPC procedure for `anvil_loadState`

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilLoadStateJsonRpcResponse`](procedures_types.md#anvilloadstatejsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilLoadStateJsonRpcRequest`](procedures_types.md#anvilloadstatejsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilLoadStateJsonRpcResponse`](procedures_types.md#anvilloadstatejsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:746

___

### AnvilMineJsonRpcRequest

Ƭ **AnvilMineJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"anvil_mine"``, [[`SerializeToJson`](procedures_types.md#serializetojson)\<[`AnvilMineParams`](actions_types.md#anvilmineparams)\>]\>

JSON-RPC request for `anvil_mine` method

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:44

___

### AnvilMineJsonRpcResponse

Ƭ **AnvilMineJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"anvil_mine"``, [`SerializeToJson`](procedures_types.md#serializetojson)\<[`AnvilMineResult`](actions_types.md#anvilmineresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_mine` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:425

___

### AnvilMineProcedure

Ƭ **AnvilMineProcedure**: (`request`: [`AnvilMineJsonRpcRequest`](procedures_types.md#anvilminejsonrpcrequest)) => `Promise`\<[`AnvilMineJsonRpcResponse`](procedures_types.md#anvilminejsonrpcresponse)\>

JSON-RPC procedure for `anvil_mine`

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilMineJsonRpcResponse`](procedures_types.md#anvilminejsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilMineJsonRpcRequest`](procedures_types.md#anvilminejsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilMineJsonRpcResponse`](procedures_types.md#anvilminejsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:710

___

### AnvilRequestType

Ƭ **AnvilRequestType**: `Object`

A mapping of `anvil_*` method names to their request type

#### Type declaration

| Name | Type |
| :------ | :------ |
| `anvil_dropTransaction` | [`AnvilDropTransactionJsonRpcRequest`](procedures_types.md#anvildroptransactionjsonrpcrequest) |
| `anvil_dumpState` | [`AnvilDumpStateJsonRpcRequest`](procedures_types.md#anvildumpstatejsonrpcrequest) |
| `anvil_getAutomine` | [`AnvilGetAutomineJsonRpcRequest`](procedures_types.md#anvilgetautominejsonrpcrequest) |
| `anvil_impersonateAccount` | [`AnvilImpersonateAccountJsonRpcRequest`](procedures_types.md#anvilimpersonateaccountjsonrpcrequest) |
| `anvil_loadState` | [`AnvilLoadStateJsonRpcRequest`](procedures_types.md#anvilloadstatejsonrpcrequest) |
| `anvil_mine` | [`AnvilMineJsonRpcRequest`](procedures_types.md#anvilminejsonrpcrequest) |
| `anvil_reset` | [`AnvilResetJsonRpcRequest`](procedures_types.md#anvilresetjsonrpcrequest) |
| `anvil_setBalance` | [`AnvilSetBalanceJsonRpcRequest`](procedures_types.md#anvilsetbalancejsonrpcrequest) |
| `anvil_setChainId` | [`AnvilSetChainIdJsonRpcRequest`](procedures_types.md#anvilsetchainidjsonrpcrequest) |
| `anvil_setCode` | [`AnvilSetCodeJsonRpcRequest`](procedures_types.md#anvilsetcodejsonrpcrequest) |
| `anvil_setNonce` | [`AnvilSetNonceJsonRpcRequest`](procedures_types.md#anvilsetnoncejsonrpcrequest) |
| `anvil_setStorageAt` | [`AnvilSetStorageAtJsonRpcRequest`](procedures_types.md#anvilsetstorageatjsonrpcrequest) |
| `anvil_stopImpersonatingAccount` | [`AnvilStopImpersonatingAccountJsonRpcRequest`](procedures_types.md#anvilstopimpersonatingaccountjsonrpcrequest) |

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:855

___

### AnvilResetJsonRpcRequest

Ƭ **AnvilResetJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"anvil_reset"``, [[`SerializeToJson`](procedures_types.md#serializetojson)\<[`AnvilResetParams`](actions_types.md#anvilresetparams)\>]\>

JSON-RPC request for `anvil_reset` method

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:50

___

### AnvilResetJsonRpcResponse

Ƭ **AnvilResetJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"anvil_reset"``, [`SerializeToJson`](procedures_types.md#serializetojson)\<[`AnvilResetResult`](actions_types.md#anvilresetresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_reset` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:429

___

### AnvilResetProcedure

Ƭ **AnvilResetProcedure**: (`request`: [`AnvilResetJsonRpcRequest`](procedures_types.md#anvilresetjsonrpcrequest)) => `Promise`\<[`AnvilResetJsonRpcResponse`](procedures_types.md#anvilresetjsonrpcresponse)\>

JSON-RPC procedure for `anvil_reset`

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilResetJsonRpcResponse`](procedures_types.md#anvilresetjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilResetJsonRpcRequest`](procedures_types.md#anvilresetjsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilResetJsonRpcResponse`](procedures_types.md#anvilresetjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:714

___

### AnvilReturnType

Ƭ **AnvilReturnType**: `Object`

A mapping of `anvil_*` method names to their return type

#### Type declaration

| Name | Type |
| :------ | :------ |
| `anvil_dropTransaction` | [`AnvilDropTransactionJsonRpcResponse`](procedures_types.md#anvildroptransactionjsonrpcresponse) |
| `anvil_dumpState` | [`AnvilDumpStateJsonRpcResponse`](procedures_types.md#anvildumpstatejsonrpcresponse) |
| `anvil_getAutomine` | [`AnvilGetAutomineJsonRpcResponse`](procedures_types.md#anvilgetautominejsonrpcresponse) |
| `anvil_impersonateAccount` | [`AnvilImpersonateAccountJsonRpcResponse`](procedures_types.md#anvilimpersonateaccountjsonrpcresponse) |
| `anvil_loadState` | [`AnvilLoadStateJsonRpcResponse`](procedures_types.md#anvilloadstatejsonrpcresponse) |
| `anvil_mine` | [`AnvilMineJsonRpcResponse`](procedures_types.md#anvilminejsonrpcresponse) |
| `anvil_reset` | [`AnvilResetJsonRpcResponse`](procedures_types.md#anvilresetjsonrpcresponse) |
| `anvil_setBalance` | [`AnvilSetBalanceJsonRpcResponse`](procedures_types.md#anvilsetbalancejsonrpcresponse) |
| `anvil_setChainId` | [`AnvilSetChainIdJsonRpcResponse`](procedures_types.md#anvilsetchainidjsonrpcresponse) |
| `anvil_setCode` | [`AnvilSetCodeJsonRpcResponse`](procedures_types.md#anvilsetcodejsonrpcresponse) |
| `anvil_setNonce` | [`AnvilSetNonceJsonRpcResponse`](procedures_types.md#anvilsetnoncejsonrpcresponse) |
| `anvil_setStorageAt` | [`AnvilSetStorageAtJsonRpcResponse`](procedures_types.md#anvilsetstorageatjsonrpcresponse) |
| `anvil_stopImpersonatingAccount` | [`AnvilStopImpersonatingAccountJsonRpcResponse`](procedures_types.md#anvilstopimpersonatingaccountjsonrpcresponse) |

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:874

___

### AnvilSetBalanceJsonRpcRequest

Ƭ **AnvilSetBalanceJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"anvil_setBalance"``, [[`SerializeToJson`](procedures_types.md#serializetojson)\<[`AnvilSetBalanceParams`](actions_types.md#anvilsetbalanceparams)\>]\>

JSON-RPC request for `anvil_setBalance` method

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:62

___

### AnvilSetBalanceJsonRpcResponse

Ƭ **AnvilSetBalanceJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"anvil_setBalance"``, [`SerializeToJson`](procedures_types.md#serializetojson)\<[`AnvilSetBalanceResult`](actions_types.md#anvilsetbalanceresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_setBalance` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:437

___

### AnvilSetBalanceProcedure

Ƭ **AnvilSetBalanceProcedure**: (`request`: [`AnvilSetBalanceJsonRpcRequest`](procedures_types.md#anvilsetbalancejsonrpcrequest)) => `Promise`\<[`AnvilSetBalanceJsonRpcResponse`](procedures_types.md#anvilsetbalancejsonrpcresponse)\>

JSON-RPC procedure for `anvil_setBalance`

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilSetBalanceJsonRpcResponse`](procedures_types.md#anvilsetbalancejsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilSetBalanceJsonRpcRequest`](procedures_types.md#anvilsetbalancejsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilSetBalanceJsonRpcResponse`](procedures_types.md#anvilsetbalancejsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:722

___

### AnvilSetChainIdJsonRpcRequest

Ƭ **AnvilSetChainIdJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"anvil_setChainId"``, [[`SerializeToJson`](procedures_types.md#serializetojson)\<[`AnvilSetChainIdParams`](actions_types.md#anvilsetchainidparams)\>]\>

JSON-RPC request for `anvil_setChainId` method

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:86

___

### AnvilSetChainIdJsonRpcResponse

Ƭ **AnvilSetChainIdJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"anvil_setChainId"``, [`SerializeToJson`](procedures_types.md#serializetojson)\<[`AnvilSetChainIdResult`](actions_types.md#anvilsetchainidresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_setChainId` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:453

___

### AnvilSetChainIdProcedure

Ƭ **AnvilSetChainIdProcedure**: (`request`: [`AnvilSetChainIdJsonRpcRequest`](procedures_types.md#anvilsetchainidjsonrpcrequest)) => `Promise`\<[`AnvilSetChainIdJsonRpcResponse`](procedures_types.md#anvilsetchainidjsonrpcresponse)\>

JSON-RPC procedure for `anvil_setChainId`

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilSetChainIdJsonRpcResponse`](procedures_types.md#anvilsetchainidjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilSetChainIdJsonRpcRequest`](procedures_types.md#anvilsetchainidjsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilSetChainIdJsonRpcResponse`](procedures_types.md#anvilsetchainidjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:738

___

### AnvilSetCodeJsonRpcRequest

Ƭ **AnvilSetCodeJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"anvil_setCode"``, [[`SerializeToJson`](procedures_types.md#serializetojson)\<[`AnvilSetCodeParams`](actions_types.md#anvilsetcodeparams)\>]\>

JSON-RPC request for `anvil_setCode` method

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:68

___

### AnvilSetCodeJsonRpcResponse

Ƭ **AnvilSetCodeJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"anvil_setCode"``, [`SerializeToJson`](procedures_types.md#serializetojson)\<[`AnvilSetCodeResult`](actions_types.md#anvilsetcoderesult)\>, `AnvilError`\>

JSON-RPC response for `anvil_setCode` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:441

___

### AnvilSetCodeProcedure

Ƭ **AnvilSetCodeProcedure**: (`request`: [`AnvilSetCodeJsonRpcRequest`](procedures_types.md#anvilsetcodejsonrpcrequest)) => `Promise`\<[`AnvilSetCodeJsonRpcResponse`](procedures_types.md#anvilsetcodejsonrpcresponse)\>

JSON-RPC procedure for `anvil_setCode`

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilSetCodeJsonRpcResponse`](procedures_types.md#anvilsetcodejsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilSetCodeJsonRpcRequest`](procedures_types.md#anvilsetcodejsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilSetCodeJsonRpcResponse`](procedures_types.md#anvilsetcodejsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:726

___

### AnvilSetNonceJsonRpcRequest

Ƭ **AnvilSetNonceJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"anvil_setNonce"``, [[`SerializeToJson`](procedures_types.md#serializetojson)\<[`AnvilSetNonceParams`](actions_types.md#anvilsetnonceparams)\>]\>

JSON-RPC request for `anvil_setNonce` method

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:74

___

### AnvilSetNonceJsonRpcResponse

Ƭ **AnvilSetNonceJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"anvil_setNonce"``, [`SerializeToJson`](procedures_types.md#serializetojson)\<[`AnvilSetNonceResult`](actions_types.md#anvilsetnonceresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_setNonce` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:445

___

### AnvilSetNonceProcedure

Ƭ **AnvilSetNonceProcedure**: (`request`: [`AnvilSetNonceJsonRpcRequest`](procedures_types.md#anvilsetnoncejsonrpcrequest)) => `Promise`\<[`AnvilSetNonceJsonRpcResponse`](procedures_types.md#anvilsetnoncejsonrpcresponse)\>

JSON-RPC procedure for `anvil_setNonce`

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilSetNonceJsonRpcResponse`](procedures_types.md#anvilsetnoncejsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilSetNonceJsonRpcRequest`](procedures_types.md#anvilsetnoncejsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilSetNonceJsonRpcResponse`](procedures_types.md#anvilsetnoncejsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:730

___

### AnvilSetStorageAtJsonRpcRequest

Ƭ **AnvilSetStorageAtJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"anvil_setStorageAt"``, [[`SerializeToJson`](procedures_types.md#serializetojson)\<[`AnvilSetStorageAtParams`](actions_types.md#anvilsetstorageatparams)\>]\>

JSON-RPC request for `anvil_setStorageAt` method

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:80

___

### AnvilSetStorageAtJsonRpcResponse

Ƭ **AnvilSetStorageAtJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"anvil_setStorageAt"``, [`SerializeToJson`](procedures_types.md#serializetojson)\<[`AnvilSetStorageAtResult`](actions_types.md#anvilsetstorageatresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_setStorageAt` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:449

___

### AnvilSetStorageAtProcedure

Ƭ **AnvilSetStorageAtProcedure**: (`request`: [`AnvilSetStorageAtJsonRpcRequest`](procedures_types.md#anvilsetstorageatjsonrpcrequest)) => `Promise`\<[`AnvilSetStorageAtJsonRpcResponse`](procedures_types.md#anvilsetstorageatjsonrpcresponse)\>

JSON-RPC procedure for `anvil_setStorageAt`

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilSetStorageAtJsonRpcResponse`](procedures_types.md#anvilsetstorageatjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilSetStorageAtJsonRpcRequest`](procedures_types.md#anvilsetstorageatjsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilSetStorageAtJsonRpcResponse`](procedures_types.md#anvilsetstorageatjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:734

___

### AnvilStopImpersonatingAccountJsonRpcRequest

Ƭ **AnvilStopImpersonatingAccountJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"anvil_stopImpersonatingAccount"``, [[`SerializeToJson`](procedures_types.md#serializetojson)\<[`AnvilStopImpersonatingAccountParams`](actions_types.md#anvilstopimpersonatingaccountparams)\>]\>

JSON-RPC request for `anvil_stopImpersonatingAccount` method

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:28

___

### AnvilStopImpersonatingAccountJsonRpcResponse

Ƭ **AnvilStopImpersonatingAccountJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"anvil_stopImpersonatingAccount"``, [`SerializeToJson`](procedures_types.md#serializetojson)\<[`AnvilStopImpersonatingAccountResult`](actions_types.md#anvilstopimpersonatingaccountresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_stopImpersonatingAccount` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:413

___

### AnvilStopImpersonatingAccountProcedure

Ƭ **AnvilStopImpersonatingAccountProcedure**: (`request`: [`AnvilStopImpersonatingAccountJsonRpcRequest`](procedures_types.md#anvilstopimpersonatingaccountjsonrpcrequest)) => `Promise`\<[`AnvilStopImpersonatingAccountJsonRpcResponse`](procedures_types.md#anvilstopimpersonatingaccountjsonrpcresponse)\>

JSON-RPC procedure for `anvil_stopImpersonatingAccount`

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilStopImpersonatingAccountJsonRpcResponse`](procedures_types.md#anvilstopimpersonatingaccountjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilStopImpersonatingAccountJsonRpcRequest`](procedures_types.md#anvilstopimpersonatingaccountjsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilStopImpersonatingAccountJsonRpcResponse`](procedures_types.md#anvilstopimpersonatingaccountjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:698

___

### BigIntToHex

Ƭ **BigIntToHex**\<`T`\>: `T` extends `bigint` ? [`Hex`](index.md#hex) : `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:13

___

### CallJsonRpcProcedure

Ƭ **CallJsonRpcProcedure**: (`request`: [`CallJsonRpcRequest`](procedures_types.md#calljsonrpcrequest)) => `Promise`\<[`CallJsonRpcResponse`](procedures_types.md#calljsonrpcresponse)\>

Call JSON-RPC procedure executes a call against the tevm EVM

#### Type declaration

▸ (`request`): `Promise`\<[`CallJsonRpcResponse`](procedures_types.md#calljsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`CallJsonRpcRequest`](procedures_types.md#calljsonrpcrequest) |

##### Returns

`Promise`\<[`CallJsonRpcResponse`](procedures_types.md#calljsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:751

___

### CallJsonRpcRequest

Ƭ **CallJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"tevm_call"``, [[`SerializeToJson`](procedures_types.md#serializetojson)\<[`CallParams`](index.md#callparams)\>]\>

JSON-RPC request for `tevm_call`

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:106

___

### CallJsonRpcResponse

Ƭ **CallJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"tevm_call"``, [`SerializeToJson`](procedures_types.md#serializetojson)\<[`CallResult`](index.md#callresult)\>, [`CallError`](errors.md#callerror)[``"_tag"``]\>

JSON-RPC response for `tevm_call` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:466

___

### ContractJsonRpcProcedure

Ƭ **ContractJsonRpcProcedure**: [`CallJsonRpcRequest`](procedures_types.md#calljsonrpcrequest)

Since ContractJsonRpcProcedure is a quality of life wrapper around CallJsonRpcProcedure
 We choose to overload the type instead of creating a new one. Tevm contract handlers encode their
 contract call as a normal call request over JSON-rpc

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:758

___

### ContractJsonRpcRequest

Ƭ **ContractJsonRpcRequest**: [`CallJsonRpcRequest`](procedures_types.md#calljsonrpcrequest)

Since contract calls are just a quality of life wrapper around call we avoid using tevm_contract
in favor of overloading tevm_call

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:114

___

### ContractJsonRpcResponse

Ƭ **ContractJsonRpcResponse**: [`CallJsonRpcResponse`](procedures_types.md#calljsonrpcresponse)

Since contract calls are just a quality of life wrapper around call we avoid using tevm_contract
in favor of overloading tevm_call

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:472

___

### DebugJsonRpcRequest

Ƭ **DebugJsonRpcRequest**: [`DebugTraceTransactionJsonRpcRequest`](procedures_types.md#debugtracetransactionjsonrpcrequest) \| [`DebugTraceCallJsonRpcRequest`](procedures_types.md#debugtracecalljsonrpcrequest)

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:128

___

### DebugRequestType

Ƭ **DebugRequestType**: `Object`

A mapping of `debug_*` method names to their request type

#### Type declaration

| Name | Type |
| :------ | :------ |
| `debug_traceCall` | [`DebugTraceCallJsonRpcRequest`](procedures_types.md#debugtracecalljsonrpcrequest) |
| `debug_traceTransaction` | [`DebugTraceTransactionJsonRpcRequest`](procedures_types.md#debugtracetransactionjsonrpcrequest) |

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:893

___

### DebugReturnType

Ƭ **DebugReturnType**: `Object`

A mapping of `debug_*` method names to their return type

#### Type declaration

| Name | Type |
| :------ | :------ |
| `debug_traceCall` | [`DebugTraceCallJsonRpcResponse`](procedures_types.md#debugtracecalljsonrpcresponse) |
| `debug_traceTransaction` | [`DebugTraceTransactionJsonRpcResponse`](procedures_types.md#debugtracetransactionjsonrpcresponse) |

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:901

___

### DebugTraceCallJsonRpcRequest

Ƭ **DebugTraceCallJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"debug_traceCall"``, [[`SerializeToJson`](procedures_types.md#serializetojson)\<[`DebugTraceCallParams`](actions_types.md#debugtracecallparams)\>]\>

JSON-RPC request for `debug_traceCall` method

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:125

___

### DebugTraceCallJsonRpcResponse

Ƭ **DebugTraceCallJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"debug_traceCall"``, [`SerializeToJson`](procedures_types.md#serializetojson)\<[`DebugTraceCallResult`](actions_types.md#debugtracecallresult)\>, `DebugError`\>

JSON-RPC response for `debug_traceCall` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:482

___

### DebugTraceCallProcedure

Ƭ **DebugTraceCallProcedure**: (`request`: [`DebugTraceCallJsonRpcRequest`](procedures_types.md#debugtracecalljsonrpcrequest)) => `Promise`\<[`DebugTraceCallJsonRpcResponse`](procedures_types.md#debugtracecalljsonrpcresponse)\>

JSON-RPC procedure for `debug_traceCall`

#### Type declaration

▸ (`request`): `Promise`\<[`DebugTraceCallJsonRpcResponse`](procedures_types.md#debugtracecalljsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`DebugTraceCallJsonRpcRequest`](procedures_types.md#debugtracecalljsonrpcrequest) |

##### Returns

`Promise`\<[`DebugTraceCallJsonRpcResponse`](procedures_types.md#debugtracecalljsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:767

___

### DebugTraceTransactionJsonRpcRequest

Ƭ **DebugTraceTransactionJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"debug_traceTransaction"``, [[`SerializeToJson`](procedures_types.md#serializetojson)\<[`DebugTraceTransactionParams`](actions_types.md#debugtracetransactionparams)\>]\>

JSON-RPC request for `debug_traceTransaction` method

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:119

___

### DebugTraceTransactionJsonRpcResponse

Ƭ **DebugTraceTransactionJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"debug_traceTransaction"``, [`SerializeToJson`](procedures_types.md#serializetojson)\<[`DebugTraceTransactionResult`](actions_types.md#debugtracetransactionresult)\>, `DebugError`\>

JSON-RPC response for `debug_traceTransaction` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:478

___

### DebugTraceTransactionProcedure

Ƭ **DebugTraceTransactionProcedure**: (`request`: [`DebugTraceTransactionJsonRpcRequest`](procedures_types.md#debugtracetransactionjsonrpcrequest)) => `Promise`\<[`DebugTraceTransactionJsonRpcResponse`](procedures_types.md#debugtracetransactionjsonrpcresponse)\>

JSON-RPC procedure for `debug_traceTransaction`

#### Type declaration

▸ (`request`): `Promise`\<[`DebugTraceTransactionJsonRpcResponse`](procedures_types.md#debugtracetransactionjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`DebugTraceTransactionJsonRpcRequest`](procedures_types.md#debugtracetransactionjsonrpcrequest) |

##### Returns

`Promise`\<[`DebugTraceTransactionJsonRpcResponse`](procedures_types.md#debugtracetransactionjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:763

___

### DumpStateJsonRpcProcedure

Ƭ **DumpStateJsonRpcProcedure**: (`request`: [`DumpStateJsonRpcRequest`](procedures_types.md#dumpstatejsonrpcrequest)) => `Promise`\<[`DumpStateJsonRpcResponse`](procedures_types.md#dumpstatejsonrpcresponse)\>

Procedure for handling tevm_dumpState JSON-RPC requests

**`Example`**

```ts
const result = await tevm.request({
.   method: 'tevm_DumpState',
   params: [],
.   id: 1,
  jsonrpc: '2.0'
. }
console.log(result) // { jsonrpc: '2.0', id: 1, method: 'tevm_dumpState', result: {'0x...': '0x....', ...}}
```

#### Type declaration

▸ (`request`): `Promise`\<[`DumpStateJsonRpcResponse`](procedures_types.md#dumpstatejsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`DumpStateJsonRpcRequest`](procedures_types.md#dumpstatejsonrpcrequest) |

##### Returns

`Promise`\<[`DumpStateJsonRpcResponse`](procedures_types.md#dumpstatejsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:781

___

### DumpStateJsonRpcRequest

Ƭ **DumpStateJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"tevm_dumpState"``, []\>

The JSON-RPC request for the `tevm_dumpState` method

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:133

___

### DumpStateJsonRpcResponse

Ƭ **DumpStateJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"tevm_dumpState"``, [`SerializeToJson`](procedures_types.md#serializetojson)\<\{ `state`: [`ParameterizedTevmState`](state.md#parameterizedtevmstate)  }\>, [`DumpStateError`](errors.md#dumpstateerror)[``"_tag"``]\>

The response to the `tevm_dumpState` JSON-RPC request.

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:487

___

### EthAccountsJsonRpcProcedure

Ƭ **EthAccountsJsonRpcProcedure**: (`request`: [`EthAccountsJsonRpcRequest`](procedures_types.md#ethaccountsjsonrpcrequest)) => `Promise`\<[`EthAccountsJsonRpcResponse`](procedures_types.md#ethaccountsjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthAccountsJsonRpcResponse`](procedures_types.md#ethaccountsjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthAccountsJsonRpcRequest`](procedures_types.md#ethaccountsjsonrpcrequest) |

##### Returns

`Promise`\<[`EthAccountsJsonRpcResponse`](procedures_types.md#ethaccountsjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:783

___

### EthAccountsJsonRpcRequest

Ƭ **EthAccountsJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_accounts"``, readonly []\>

JSON-RPC request for `eth_accounts` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:167

___

### EthAccountsJsonRpcResponse

Ƭ **EthAccountsJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_accounts"``, [`Address`](index.md#address)[], `string`\>

JSON-RPC response for `eth_accounts` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:494

___

### EthBlockNumberJsonRpcProcedure

Ƭ **EthBlockNumberJsonRpcProcedure**: (`request`: [`EthBlockNumberJsonRpcRequest`](procedures_types.md#ethblocknumberjsonrpcrequest)) => `Promise`\<[`EthBlockNumberJsonRpcResponse`](procedures_types.md#ethblocknumberjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthBlockNumberJsonRpcResponse`](procedures_types.md#ethblocknumberjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthBlockNumberJsonRpcRequest`](procedures_types.md#ethblocknumberjsonrpcrequest) |

##### Returns

`Promise`\<[`EthBlockNumberJsonRpcResponse`](procedures_types.md#ethblocknumberjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:784

___

### EthBlockNumberJsonRpcRequest

Ƭ **EthBlockNumberJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_blockNumber"``, readonly []\>

JSON-RPC request for `eth_blockNumber` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:171

___

### EthBlockNumberJsonRpcResponse

Ƭ **EthBlockNumberJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_blockNumber"``, [`SerializeToJson`](procedures_types.md#serializetojson)\<[`EthBlockNumberResult`](actions_types.md#ethblocknumberresult)\>, `string`\>

JSON-RPC response for `eth_blockNumber` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:498

___

### EthCallJsonRpcProcedure

Ƭ **EthCallJsonRpcProcedure**: (`request`: [`EthCallJsonRpcRequest`](procedures_types.md#ethcalljsonrpcrequest)) => `Promise`\<[`EthCallJsonRpcResponse`](procedures_types.md#ethcalljsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthCallJsonRpcResponse`](procedures_types.md#ethcalljsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthCallJsonRpcRequest`](procedures_types.md#ethcalljsonrpcrequest) |

##### Returns

`Promise`\<[`EthCallJsonRpcResponse`](procedures_types.md#ethcalljsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:785

___

### EthCallJsonRpcRequest

Ƭ **EthCallJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_call"``, readonly [tx: JsonRpcTransaction, tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_call` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:175

___

### EthCallJsonRpcResponse

Ƭ **EthCallJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_call"``, [`Hex`](index.md#hex), `string`\>

JSON-RPC response for `eth_call` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:502

___

### EthChainIdJsonRpcProcedure

Ƭ **EthChainIdJsonRpcProcedure**: (`request`: [`EthChainIdJsonRpcRequest`](procedures_types.md#ethchainidjsonrpcrequest)) => `Promise`\<[`EthChainIdJsonRpcResponse`](procedures_types.md#ethchainidjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthChainIdJsonRpcResponse`](procedures_types.md#ethchainidjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthChainIdJsonRpcRequest`](procedures_types.md#ethchainidjsonrpcrequest) |

##### Returns

`Promise`\<[`EthChainIdJsonRpcResponse`](procedures_types.md#ethchainidjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:786

___

### EthChainIdJsonRpcRequest

Ƭ **EthChainIdJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_chainId"``, readonly []\>

JSON-RPC request for `eth_chainId` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:179

___

### EthChainIdJsonRpcResponse

Ƭ **EthChainIdJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_chainId"``, [`Hex`](index.md#hex), `string`\>

JSON-RPC response for `eth_chainId` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:506

___

### EthCoinbaseJsonRpcProcedure

Ƭ **EthCoinbaseJsonRpcProcedure**: (`request`: [`EthCoinbaseJsonRpcRequest`](procedures_types.md#ethcoinbasejsonrpcrequest)) => `Promise`\<[`EthCoinbaseJsonRpcResponse`](procedures_types.md#ethcoinbasejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthCoinbaseJsonRpcResponse`](procedures_types.md#ethcoinbasejsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthCoinbaseJsonRpcRequest`](procedures_types.md#ethcoinbasejsonrpcrequest) |

##### Returns

`Promise`\<[`EthCoinbaseJsonRpcResponse`](procedures_types.md#ethcoinbasejsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:787

___

### EthCoinbaseJsonRpcRequest

Ƭ **EthCoinbaseJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_coinbase"``, readonly []\>

JSON-RPC request for `eth_coinbase` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:183

___

### EthCoinbaseJsonRpcResponse

Ƭ **EthCoinbaseJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_coinbase"``, [`Hex`](index.md#hex), `string`\>

JSON-RPC response for `eth_coinbase` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:510

___

### EthEstimateGasJsonRpcProcedure

Ƭ **EthEstimateGasJsonRpcProcedure**: (`request`: [`EthEstimateGasJsonRpcRequest`](procedures_types.md#ethestimategasjsonrpcrequest)) => `Promise`\<[`EthEstimateGasJsonRpcResponse`](procedures_types.md#ethestimategasjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthEstimateGasJsonRpcResponse`](procedures_types.md#ethestimategasjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthEstimateGasJsonRpcRequest`](procedures_types.md#ethestimategasjsonrpcrequest) |

##### Returns

`Promise`\<[`EthEstimateGasJsonRpcResponse`](procedures_types.md#ethestimategasjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:788

___

### EthEstimateGasJsonRpcRequest

Ƭ **EthEstimateGasJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_estimateGas"``, readonly [tx: JsonRpcTransaction]\>

JSON-RPC request for `eth_estimateGas` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:187

___

### EthEstimateGasJsonRpcResponse

Ƭ **EthEstimateGasJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_estimateGas"``, [`Hex`](index.md#hex), `string`\>

JSON-RPC response for `eth_estimateGas` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:514

___

### EthGasPriceJsonRpcProcedure

Ƭ **EthGasPriceJsonRpcProcedure**: (`request`: [`EthGasPriceJsonRpcRequest`](procedures_types.md#ethgaspricejsonrpcrequest)) => `Promise`\<[`EthGasPriceJsonRpcResponse`](procedures_types.md#ethgaspricejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGasPriceJsonRpcResponse`](procedures_types.md#ethgaspricejsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGasPriceJsonRpcRequest`](procedures_types.md#ethgaspricejsonrpcrequest) |

##### Returns

`Promise`\<[`EthGasPriceJsonRpcResponse`](procedures_types.md#ethgaspricejsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:790

___

### EthGasPriceJsonRpcRequest

Ƭ **EthGasPriceJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_gasPrice"``, readonly []\>

JSON-RPC request for `eth_gasPrice` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:195

___

### EthGasPriceJsonRpcResponse

Ƭ **EthGasPriceJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_gasPrice"``, [`Hex`](index.md#hex), `string`\>

JSON-RPC response for `eth_gasPrice` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:522

___

### EthGetBalanceJsonRpcProcedure

Ƭ **EthGetBalanceJsonRpcProcedure**: (`request`: [`EthGetBalanceJsonRpcRequest`](procedures_types.md#ethgetbalancejsonrpcrequest)) => `Promise`\<[`EthGetBalanceJsonRpcResponse`](procedures_types.md#ethgetbalancejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBalanceJsonRpcResponse`](procedures_types.md#ethgetbalancejsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBalanceJsonRpcRequest`](procedures_types.md#ethgetbalancejsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetBalanceJsonRpcResponse`](procedures_types.md#ethgetbalancejsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:791

___

### EthGetBalanceJsonRpcRequest

Ƭ **EthGetBalanceJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_getBalance"``, [address: Address, tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_getBalance` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:199

___

### EthGetBalanceJsonRpcResponse

Ƭ **EthGetBalanceJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_getBalance"``, [`Hex`](index.md#hex), `string`\>

JSON-RPC response for `eth_getBalance` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:526

___

### EthGetBlockByHashJsonRpcProcedure

Ƭ **EthGetBlockByHashJsonRpcProcedure**: (`request`: [`EthGetBlockByHashJsonRpcRequest`](procedures_types.md#ethgetblockbyhashjsonrpcrequest)) => `Promise`\<[`EthGetBlockByHashJsonRpcResponse`](procedures_types.md#ethgetblockbyhashjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBlockByHashJsonRpcResponse`](procedures_types.md#ethgetblockbyhashjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBlockByHashJsonRpcRequest`](procedures_types.md#ethgetblockbyhashjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetBlockByHashJsonRpcResponse`](procedures_types.md#ethgetblockbyhashjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:792

___

### EthGetBlockByHashJsonRpcRequest

Ƭ **EthGetBlockByHashJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_getBlockByHash"``, readonly [blockHash: Hex, fullTransactionObjects: boolean]\>

JSON-RPC request for `eth_getBlockByHash` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:206

___

### EthGetBlockByHashJsonRpcResponse

Ƭ **EthGetBlockByHashJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_getBlockByHash"``, [`BlockResult`](actions_types.md#blockresult), `string`\>

JSON-RPC response for `eth_getBlockByHash` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:530

___

### EthGetBlockByNumberJsonRpcProcedure

Ƭ **EthGetBlockByNumberJsonRpcProcedure**: (`request`: [`EthGetBlockByNumberJsonRpcRequest`](procedures_types.md#ethgetblockbynumberjsonrpcrequest)) => `Promise`\<[`EthGetBlockByNumberJsonRpcResponse`](procedures_types.md#ethgetblockbynumberjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBlockByNumberJsonRpcResponse`](procedures_types.md#ethgetblockbynumberjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBlockByNumberJsonRpcRequest`](procedures_types.md#ethgetblockbynumberjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetBlockByNumberJsonRpcResponse`](procedures_types.md#ethgetblockbynumberjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:793

___

### EthGetBlockByNumberJsonRpcRequest

Ƭ **EthGetBlockByNumberJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_getBlockByNumber"``, readonly [tag: BlockTag \| Hex, fullTransactionObjects: boolean]\>

JSON-RPC request for `eth_getBlockByNumber` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:210

___

### EthGetBlockByNumberJsonRpcResponse

Ƭ **EthGetBlockByNumberJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_getBlockByNumber"``, [`BlockResult`](actions_types.md#blockresult), `string`\>

JSON-RPC response for `eth_getBlockByNumber` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:534

___

### EthGetBlockTransactionCountByHashJsonRpcProcedure

Ƭ **EthGetBlockTransactionCountByHashJsonRpcProcedure**: (`request`: [`EthGetBlockTransactionCountByHashJsonRpcRequest`](procedures_types.md#ethgetblocktransactioncountbyhashjsonrpcrequest)) => `Promise`\<[`EthGetBlockTransactionCountByHashJsonRpcResponse`](procedures_types.md#ethgetblocktransactioncountbyhashjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBlockTransactionCountByHashJsonRpcResponse`](procedures_types.md#ethgetblocktransactioncountbyhashjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBlockTransactionCountByHashJsonRpcRequest`](procedures_types.md#ethgetblocktransactioncountbyhashjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetBlockTransactionCountByHashJsonRpcResponse`](procedures_types.md#ethgetblocktransactioncountbyhashjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:794

___

### EthGetBlockTransactionCountByHashJsonRpcRequest

Ƭ **EthGetBlockTransactionCountByHashJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_getBlockTransactionCountByHash"``, readonly [hash: Hex]\>

JSON-RPC request for `eth_getBlockTransactionCountByHash` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:214

___

### EthGetBlockTransactionCountByHashJsonRpcResponse

Ƭ **EthGetBlockTransactionCountByHashJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_getBlockTransactionCountByHash"``, [`Hex`](index.md#hex), `string`\>

JSON-RPC response for `eth_getBlockTransactionCountByHash` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:538

___

### EthGetBlockTransactionCountByNumberJsonRpcProcedure

Ƭ **EthGetBlockTransactionCountByNumberJsonRpcProcedure**: (`request`: [`EthGetBlockTransactionCountByNumberJsonRpcRequest`](procedures_types.md#ethgetblocktransactioncountbynumberjsonrpcrequest)) => `Promise`\<[`EthGetBlockTransactionCountByNumberJsonRpcResponse`](procedures_types.md#ethgetblocktransactioncountbynumberjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBlockTransactionCountByNumberJsonRpcResponse`](procedures_types.md#ethgetblocktransactioncountbynumberjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBlockTransactionCountByNumberJsonRpcRequest`](procedures_types.md#ethgetblocktransactioncountbynumberjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetBlockTransactionCountByNumberJsonRpcResponse`](procedures_types.md#ethgetblocktransactioncountbynumberjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:795

___

### EthGetBlockTransactionCountByNumberJsonRpcRequest

Ƭ **EthGetBlockTransactionCountByNumberJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_getBlockTransactionCountByNumber"``, readonly [tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_getBlockTransactionCountByNumber` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:218

___

### EthGetBlockTransactionCountByNumberJsonRpcResponse

Ƭ **EthGetBlockTransactionCountByNumberJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_getBlockTransactionCountByNumber"``, [`Hex`](index.md#hex), `string`\>

JSON-RPC response for `eth_getBlockTransactionCountByNumber` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:542

___

### EthGetCodeJsonRpcProcedure

Ƭ **EthGetCodeJsonRpcProcedure**: (`request`: [`EthGetCodeJsonRpcRequest`](procedures_types.md#ethgetcodejsonrpcrequest)) => `Promise`\<[`EthGetCodeJsonRpcResponse`](procedures_types.md#ethgetcodejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetCodeJsonRpcResponse`](procedures_types.md#ethgetcodejsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetCodeJsonRpcRequest`](procedures_types.md#ethgetcodejsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetCodeJsonRpcResponse`](procedures_types.md#ethgetcodejsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:796

___

### EthGetCodeJsonRpcRequest

Ƭ **EthGetCodeJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_getCode"``, readonly [address: Address, tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_getCode` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:222

___

### EthGetCodeJsonRpcResponse

Ƭ **EthGetCodeJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_getCode"``, [`Hex`](index.md#hex), `string`\>

JSON-RPC response for `eth_getCode` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:546

___

### EthGetFilterChangesJsonRpcProcedure

Ƭ **EthGetFilterChangesJsonRpcProcedure**: (`request`: [`EthGetFilterChangesJsonRpcRequest`](procedures_types.md#ethgetfilterchangesjsonrpcrequest)) => `Promise`\<[`EthGetFilterChangesJsonRpcResponse`](procedures_types.md#ethgetfilterchangesjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetFilterChangesJsonRpcResponse`](procedures_types.md#ethgetfilterchangesjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetFilterChangesJsonRpcRequest`](procedures_types.md#ethgetfilterchangesjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetFilterChangesJsonRpcResponse`](procedures_types.md#ethgetfilterchangesjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:797

___

### EthGetFilterChangesJsonRpcRequest

Ƭ **EthGetFilterChangesJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_getFilterChanges"``, [filterId: Hex]\>

JSON-RPC request for `eth_getFilterChanges` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:226

___

### EthGetFilterChangesJsonRpcResponse

Ƭ **EthGetFilterChangesJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_getFilterChanges"``, [`FilterLog`](actions_types.md#filterlog)[], `string`\>

JSON-RPC response for `eth_getFilterChanges` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:550

___

### EthGetFilterLogsJsonRpcProcedure

Ƭ **EthGetFilterLogsJsonRpcProcedure**: (`request`: [`EthGetFilterLogsJsonRpcRequest`](procedures_types.md#ethgetfilterlogsjsonrpcrequest)) => `Promise`\<[`EthGetFilterLogsJsonRpcResponse`](procedures_types.md#ethgetfilterlogsjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetFilterLogsJsonRpcResponse`](procedures_types.md#ethgetfilterlogsjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetFilterLogsJsonRpcRequest`](procedures_types.md#ethgetfilterlogsjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetFilterLogsJsonRpcResponse`](procedures_types.md#ethgetfilterlogsjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:798

___

### EthGetFilterLogsJsonRpcRequest

Ƭ **EthGetFilterLogsJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_getFilterLogs"``, [filterId: Hex]\>

JSON-RPC request for `eth_getFilterLogs` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:232

___

### EthGetFilterLogsJsonRpcResponse

Ƭ **EthGetFilterLogsJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_getFilterLogs"``, [`FilterLog`](actions_types.md#filterlog)[], `string`\>

JSON-RPC response for `eth_getFilterLogs` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:554

___

### EthGetLogsJsonRpcProcedure

Ƭ **EthGetLogsJsonRpcProcedure**: (`request`: [`EthGetLogsJsonRpcRequest`](procedures_types.md#ethgetlogsjsonrpcrequest)) => `Promise`\<[`EthGetLogsJsonRpcResponse`](procedures_types.md#ethgetlogsjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetLogsJsonRpcResponse`](procedures_types.md#ethgetlogsjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetLogsJsonRpcRequest`](procedures_types.md#ethgetlogsjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetLogsJsonRpcResponse`](procedures_types.md#ethgetlogsjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:799

___

### EthGetLogsJsonRpcRequest

Ƭ **EthGetLogsJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_getLogs"``, [filterParams: FilterParams]\>

JSON-RPC request for `eth_getLogs` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:238

___

### EthGetLogsJsonRpcResponse

Ƭ **EthGetLogsJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_getLogs"``, [`FilterLog`](actions_types.md#filterlog)[], `string`\>

JSON-RPC response for `eth_getLogs` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:558

___

### EthGetStorageAtJsonRpcProcedure

Ƭ **EthGetStorageAtJsonRpcProcedure**: (`request`: [`EthGetStorageAtJsonRpcRequest`](procedures_types.md#ethgetstorageatjsonrpcrequest)) => `Promise`\<[`EthGetStorageAtJsonRpcResponse`](procedures_types.md#ethgetstorageatjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetStorageAtJsonRpcResponse`](procedures_types.md#ethgetstorageatjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetStorageAtJsonRpcRequest`](procedures_types.md#ethgetstorageatjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetStorageAtJsonRpcResponse`](procedures_types.md#ethgetstorageatjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:800

___

### EthGetStorageAtJsonRpcRequest

Ƭ **EthGetStorageAtJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_getStorageAt"``, readonly [address: Address, position: Hex, tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_getStorageAt` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:244

___

### EthGetStorageAtJsonRpcResponse

Ƭ **EthGetStorageAtJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_getStorageAt"``, [`Hex`](index.md#hex), `string`\>

JSON-RPC response for `eth_getStorageAt` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:562

___

### EthGetTransactionByBlockHashAndIndexJsonRpcProcedure

Ƭ **EthGetTransactionByBlockHashAndIndexJsonRpcProcedure**: (`request`: [`EthGetTransactionByBlockHashAndIndexJsonRpcRequest`](procedures_types.md#ethgettransactionbyblockhashandindexjsonrpcrequest)) => `Promise`\<[`EthGetTransactionByBlockHashAndIndexJsonRpcResponse`](procedures_types.md#ethgettransactionbyblockhashandindexjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionByBlockHashAndIndexJsonRpcResponse`](procedures_types.md#ethgettransactionbyblockhashandindexjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionByBlockHashAndIndexJsonRpcRequest`](procedures_types.md#ethgettransactionbyblockhashandindexjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetTransactionByBlockHashAndIndexJsonRpcResponse`](procedures_types.md#ethgettransactionbyblockhashandindexjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:805

___

### EthGetTransactionByBlockHashAndIndexJsonRpcRequest

Ƭ **EthGetTransactionByBlockHashAndIndexJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_getTransactionByBlockHashAndIndex"``, readonly [tag: Hex, index: Hex]\>

JSON-RPC request for `eth_getTransactionByBlockHashAndIndex` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:264

___

### EthGetTransactionByBlockHashAndIndexJsonRpcResponse

Ƭ **EthGetTransactionByBlockHashAndIndexJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_getTransactionByBlockHashAndIndex"``, [`TransactionResult`](actions_types.md#transactionresult), `string`\>

JSON-RPC response for `eth_getTransactionByBlockHashAndIndex` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:582

___

### EthGetTransactionByBlockNumberAndIndexJsonRpcProcedure

Ƭ **EthGetTransactionByBlockNumberAndIndexJsonRpcProcedure**: (`request`: [`EthGetTransactionByBlockNumberAndIndexJsonRpcRequest`](procedures_types.md#ethgettransactionbyblocknumberandindexjsonrpcrequest)) => `Promise`\<[`EthGetTransactionByBlockNumberAndIndexJsonRpcResponse`](procedures_types.md#ethgettransactionbyblocknumberandindexjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionByBlockNumberAndIndexJsonRpcResponse`](procedures_types.md#ethgettransactionbyblocknumberandindexjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionByBlockNumberAndIndexJsonRpcRequest`](procedures_types.md#ethgettransactionbyblocknumberandindexjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetTransactionByBlockNumberAndIndexJsonRpcResponse`](procedures_types.md#ethgettransactionbyblocknumberandindexjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:806

___

### EthGetTransactionByBlockNumberAndIndexJsonRpcRequest

Ƭ **EthGetTransactionByBlockNumberAndIndexJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_getTransactionByBlockNumberAndIndex"``, readonly [tag: BlockTag \| Hex, index: Hex]\>

JSON-RPC request for `eth_getTransactionByBlockNumberAndIndex` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:268

___

### EthGetTransactionByBlockNumberAndIndexJsonRpcResponse

Ƭ **EthGetTransactionByBlockNumberAndIndexJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_getTransactionByBlockNumberAndIndex"``, [`TransactionResult`](actions_types.md#transactionresult), `string`\>

JSON-RPC response for `eth_getTransactionByBlockNumberAndIndex` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:586

___

### EthGetTransactionByHashJsonRpcProcedure

Ƭ **EthGetTransactionByHashJsonRpcProcedure**: (`request`: [`EthGetTransactionByHashJsonRpcRequest`](procedures_types.md#ethgettransactionbyhashjsonrpcrequest)) => `Promise`\<[`EthGetTransactionByHashJsonRpcResponse`](procedures_types.md#ethgettransactionbyhashjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionByHashJsonRpcResponse`](procedures_types.md#ethgettransactionbyhashjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionByHashJsonRpcRequest`](procedures_types.md#ethgettransactionbyhashjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetTransactionByHashJsonRpcResponse`](procedures_types.md#ethgettransactionbyhashjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:804

___

### EthGetTransactionByHashJsonRpcRequest

Ƭ **EthGetTransactionByHashJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_getTransactionByHash"``, readonly [data: Hex]\>

JSON-RPC request for `eth_getTransactionByHash` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:260

___

### EthGetTransactionByHashJsonRpcResponse

Ƭ **EthGetTransactionByHashJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_getTransactionByHash"``, [`TransactionResult`](actions_types.md#transactionresult), `string`\>

JSON-RPC response for `eth_getTransactionByHash` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:578

___

### EthGetTransactionCountJsonRpcProcedure

Ƭ **EthGetTransactionCountJsonRpcProcedure**: (`request`: [`EthGetTransactionCountJsonRpcRequest`](procedures_types.md#ethgettransactioncountjsonrpcrequest)) => `Promise`\<[`EthGetTransactionCountJsonRpcResponse`](procedures_types.md#ethgettransactioncountjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionCountJsonRpcResponse`](procedures_types.md#ethgettransactioncountjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionCountJsonRpcRequest`](procedures_types.md#ethgettransactioncountjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetTransactionCountJsonRpcResponse`](procedures_types.md#ethgettransactioncountjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:801

___

### EthGetTransactionCountJsonRpcRequest

Ƭ **EthGetTransactionCountJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_getTransactionCount"``, readonly [address: Address, tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_getTransactionCount` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:248

___

### EthGetTransactionCountJsonRpcResponse

Ƭ **EthGetTransactionCountJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_getTransactionCount"``, [`Hex`](index.md#hex), `string`\>

JSON-RPC response for `eth_getTransactionCount` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:566

___

### EthGetTransactionReceiptJsonRpcProcedure

Ƭ **EthGetTransactionReceiptJsonRpcProcedure**: (`request`: [`EthGetTransactionReceiptJsonRpcRequest`](procedures_types.md#ethgettransactionreceiptjsonrpcrequest)) => `Promise`\<[`EthGetTransactionReceiptJsonRpcResponse`](procedures_types.md#ethgettransactionreceiptjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionReceiptJsonRpcResponse`](procedures_types.md#ethgettransactionreceiptjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionReceiptJsonRpcRequest`](procedures_types.md#ethgettransactionreceiptjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetTransactionReceiptJsonRpcResponse`](procedures_types.md#ethgettransactionreceiptjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:807

___

### EthGetTransactionReceiptJsonRpcRequest

Ƭ **EthGetTransactionReceiptJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_getTransactionReceipt"``, [txHash: Hex]\>

JSON-RPC request for `eth_getTransactionReceipt` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:272

___

### EthGetTransactionReceiptJsonRpcResponse

Ƭ **EthGetTransactionReceiptJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_getTransactionReceipt"``, [`TransactionReceiptResult`](actions_types.md#transactionreceiptresult), `string`\>

JSON-RPC response for `eth_getTransactionReceipt` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:590

___

### EthGetUncleByBlockHashAndIndexJsonRpcProcedure

Ƭ **EthGetUncleByBlockHashAndIndexJsonRpcProcedure**: (`request`: [`EthGetUncleByBlockHashAndIndexJsonRpcRequest`](procedures_types.md#ethgetunclebyblockhashandindexjsonrpcrequest)) => `Promise`\<[`EthGetUncleByBlockHashAndIndexJsonRpcResponse`](procedures_types.md#ethgetunclebyblockhashandindexjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetUncleByBlockHashAndIndexJsonRpcResponse`](procedures_types.md#ethgetunclebyblockhashandindexjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetUncleByBlockHashAndIndexJsonRpcRequest`](procedures_types.md#ethgetunclebyblockhashandindexjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetUncleByBlockHashAndIndexJsonRpcResponse`](procedures_types.md#ethgetunclebyblockhashandindexjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:808

___

### EthGetUncleByBlockHashAndIndexJsonRpcRequest

Ƭ **EthGetUncleByBlockHashAndIndexJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_getUncleByBlockHashAndIndex"``, readonly [blockHash: Hex, uncleIndex: Hex]\>

JSON-RPC request for `eth_getUncleByBlockHashAndIndex` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:278

___

### EthGetUncleByBlockHashAndIndexJsonRpcResponse

Ƭ **EthGetUncleByBlockHashAndIndexJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_getUncleByBlockHashAndIndex"``, [`Hex`](index.md#hex), `string`\>

JSON-RPC response for `eth_getUncleByBlockHashAndIndex` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:594

___

### EthGetUncleByBlockNumberAndIndexJsonRpcProcedure

Ƭ **EthGetUncleByBlockNumberAndIndexJsonRpcProcedure**: (`request`: [`EthGetUncleByBlockNumberAndIndexJsonRpcRequest`](procedures_types.md#ethgetunclebyblocknumberandindexjsonrpcrequest)) => `Promise`\<[`EthGetUncleByBlockNumberAndIndexJsonRpcResponse`](procedures_types.md#ethgetunclebyblocknumberandindexjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetUncleByBlockNumberAndIndexJsonRpcResponse`](procedures_types.md#ethgetunclebyblocknumberandindexjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetUncleByBlockNumberAndIndexJsonRpcRequest`](procedures_types.md#ethgetunclebyblocknumberandindexjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetUncleByBlockNumberAndIndexJsonRpcResponse`](procedures_types.md#ethgetunclebyblocknumberandindexjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:809

___

### EthGetUncleByBlockNumberAndIndexJsonRpcRequest

Ƭ **EthGetUncleByBlockNumberAndIndexJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_getUncleByBlockNumberAndIndex"``, readonly [tag: BlockTag \| Hex, uncleIndex: Hex]\>

JSON-RPC request for `eth_getUncleByBlockNumberAndIndex` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:282

___

### EthGetUncleByBlockNumberAndIndexJsonRpcResponse

Ƭ **EthGetUncleByBlockNumberAndIndexJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_getUncleByBlockNumberAndIndex"``, [`Hex`](index.md#hex), `string`\>

JSON-RPC response for `eth_getUncleByBlockNumberAndIndex` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:598

___

### EthGetUncleCountByBlockHashJsonRpcProcedure

Ƭ **EthGetUncleCountByBlockHashJsonRpcProcedure**: (`request`: [`EthGetUncleCountByBlockHashJsonRpcRequest`](procedures_types.md#ethgetunclecountbyblockhashjsonrpcrequest)) => `Promise`\<[`EthGetUncleCountByBlockHashJsonRpcResponse`](procedures_types.md#ethgetunclecountbyblockhashjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetUncleCountByBlockHashJsonRpcResponse`](procedures_types.md#ethgetunclecountbyblockhashjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetUncleCountByBlockHashJsonRpcRequest`](procedures_types.md#ethgetunclecountbyblockhashjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetUncleCountByBlockHashJsonRpcResponse`](procedures_types.md#ethgetunclecountbyblockhashjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:802

___

### EthGetUncleCountByBlockHashJsonRpcRequest

Ƭ **EthGetUncleCountByBlockHashJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_getUncleCountByBlockHash"``, readonly [hash: Hex]\>

JSON-RPC request for `eth_getUncleCountByBlockHash` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:252

___

### EthGetUncleCountByBlockHashJsonRpcResponse

Ƭ **EthGetUncleCountByBlockHashJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_getUncleCountByBlockHash"``, [`Hex`](index.md#hex), `string`\>

JSON-RPC response for `eth_getUncleCountByBlockHash` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:570

___

### EthGetUncleCountByBlockNumberJsonRpcProcedure

Ƭ **EthGetUncleCountByBlockNumberJsonRpcProcedure**: (`request`: [`EthGetUncleCountByBlockNumberJsonRpcRequest`](procedures_types.md#ethgetunclecountbyblocknumberjsonrpcrequest)) => `Promise`\<[`EthGetUncleCountByBlockNumberJsonRpcResponse`](procedures_types.md#ethgetunclecountbyblocknumberjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetUncleCountByBlockNumberJsonRpcResponse`](procedures_types.md#ethgetunclecountbyblocknumberjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetUncleCountByBlockNumberJsonRpcRequest`](procedures_types.md#ethgetunclecountbyblocknumberjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetUncleCountByBlockNumberJsonRpcResponse`](procedures_types.md#ethgetunclecountbyblocknumberjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:803

___

### EthGetUncleCountByBlockNumberJsonRpcRequest

Ƭ **EthGetUncleCountByBlockNumberJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_getUncleCountByBlockNumber"``, readonly [tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_getUncleCountByBlockNumber` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:256

___

### EthGetUncleCountByBlockNumberJsonRpcResponse

Ƭ **EthGetUncleCountByBlockNumberJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_getUncleCountByBlockNumber"``, [`Hex`](index.md#hex), `string`\>

JSON-RPC response for `eth_getUncleCountByBlockNumber` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:574

___

### EthHashrateJsonRpcProcedure

Ƭ **EthHashrateJsonRpcProcedure**: (`request`: [`EthHashrateJsonRpcRequest`](procedures_types.md#ethhashratejsonrpcrequest)) => `Promise`\<[`EthHashrateJsonRpcResponse`](procedures_types.md#ethhashratejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthHashrateJsonRpcResponse`](procedures_types.md#ethhashratejsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthHashrateJsonRpcRequest`](procedures_types.md#ethhashratejsonrpcrequest) |

##### Returns

`Promise`\<[`EthHashrateJsonRpcResponse`](procedures_types.md#ethhashratejsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:789

___

### EthHashrateJsonRpcRequest

Ƭ **EthHashrateJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_hashrate"``, readonly []\>

JSON-RPC request for `eth_hashrate` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:191

___

### EthHashrateJsonRpcResponse

Ƭ **EthHashrateJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_hashrate"``, [`Hex`](index.md#hex), `string`\>

JSON-RPC response for `eth_hashrate` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:518

___

### EthJsonRpcRequest

Ƭ **EthJsonRpcRequest**: [`EthAccountsJsonRpcRequest`](procedures_types.md#ethaccountsjsonrpcrequest) \| [`EthAccountsJsonRpcRequest`](procedures_types.md#ethaccountsjsonrpcrequest) \| [`EthBlockNumberJsonRpcRequest`](procedures_types.md#ethblocknumberjsonrpcrequest) \| [`EthCallJsonRpcRequest`](procedures_types.md#ethcalljsonrpcrequest) \| [`EthChainIdJsonRpcRequest`](procedures_types.md#ethchainidjsonrpcrequest) \| [`EthCoinbaseJsonRpcRequest`](procedures_types.md#ethcoinbasejsonrpcrequest) \| [`EthEstimateGasJsonRpcRequest`](procedures_types.md#ethestimategasjsonrpcrequest) \| [`EthHashrateJsonRpcRequest`](procedures_types.md#ethhashratejsonrpcrequest) \| [`EthGasPriceJsonRpcRequest`](procedures_types.md#ethgaspricejsonrpcrequest) \| [`EthGetBalanceJsonRpcRequest`](procedures_types.md#ethgetbalancejsonrpcrequest) \| [`EthGetBlockByHashJsonRpcRequest`](procedures_types.md#ethgetblockbyhashjsonrpcrequest) \| [`EthGetBlockByNumberJsonRpcRequest`](procedures_types.md#ethgetblockbynumberjsonrpcrequest) \| [`EthGetBlockTransactionCountByHashJsonRpcRequest`](procedures_types.md#ethgetblocktransactioncountbyhashjsonrpcrequest) \| [`EthGetBlockTransactionCountByNumberJsonRpcRequest`](procedures_types.md#ethgetblocktransactioncountbynumberjsonrpcrequest) \| [`EthGetCodeJsonRpcRequest`](procedures_types.md#ethgetcodejsonrpcrequest) \| [`EthGetFilterChangesJsonRpcRequest`](procedures_types.md#ethgetfilterchangesjsonrpcrequest) \| [`EthGetFilterLogsJsonRpcRequest`](procedures_types.md#ethgetfilterlogsjsonrpcrequest) \| [`EthGetLogsJsonRpcRequest`](procedures_types.md#ethgetlogsjsonrpcrequest) \| [`EthGetStorageAtJsonRpcRequest`](procedures_types.md#ethgetstorageatjsonrpcrequest) \| [`EthGetTransactionCountJsonRpcRequest`](procedures_types.md#ethgettransactioncountjsonrpcrequest) \| [`EthGetUncleCountByBlockHashJsonRpcRequest`](procedures_types.md#ethgetunclecountbyblockhashjsonrpcrequest) \| [`EthGetUncleCountByBlockNumberJsonRpcRequest`](procedures_types.md#ethgetunclecountbyblocknumberjsonrpcrequest) \| [`EthGetTransactionByHashJsonRpcRequest`](procedures_types.md#ethgettransactionbyhashjsonrpcrequest) \| [`EthGetTransactionByBlockHashAndIndexJsonRpcRequest`](procedures_types.md#ethgettransactionbyblockhashandindexjsonrpcrequest) \| [`EthGetTransactionByBlockNumberAndIndexJsonRpcRequest`](procedures_types.md#ethgettransactionbyblocknumberandindexjsonrpcrequest) \| [`EthGetTransactionReceiptJsonRpcRequest`](procedures_types.md#ethgettransactionreceiptjsonrpcrequest) \| [`EthGetUncleByBlockHashAndIndexJsonRpcRequest`](procedures_types.md#ethgetunclebyblockhashandindexjsonrpcrequest) \| [`EthGetUncleByBlockNumberAndIndexJsonRpcRequest`](procedures_types.md#ethgetunclebyblocknumberandindexjsonrpcrequest) \| [`EthMiningJsonRpcRequest`](procedures_types.md#ethminingjsonrpcrequest) \| [`EthProtocolVersionJsonRpcRequest`](procedures_types.md#ethprotocolversionjsonrpcrequest) \| [`EthSendRawTransactionJsonRpcRequest`](procedures_types.md#ethsendrawtransactionjsonrpcrequest) \| [`EthSendTransactionJsonRpcRequest`](procedures_types.md#ethsendtransactionjsonrpcrequest) \| [`EthSignJsonRpcRequest`](procedures_types.md#ethsignjsonrpcrequest) \| [`EthSignTransactionJsonRpcRequest`](procedures_types.md#ethsigntransactionjsonrpcrequest) \| [`EthSyncingJsonRpcRequest`](procedures_types.md#ethsyncingjsonrpcrequest) \| [`EthNewFilterJsonRpcRequest`](procedures_types.md#ethnewfilterjsonrpcrequest) \| [`EthNewBlockFilterJsonRpcRequest`](procedures_types.md#ethnewblockfilterjsonrpcrequest) \| [`EthNewPendingTransactionFilterJsonRpcRequest`](procedures_types.md#ethnewpendingtransactionfilterjsonrpcrequest) \| [`EthUninstallFilterJsonRpcRequest`](procedures_types.md#ethuninstallfilterjsonrpcrequest)

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:347

___

### EthMiningJsonRpcProcedure

Ƭ **EthMiningJsonRpcProcedure**: (`request`: [`EthMiningJsonRpcRequest`](procedures_types.md#ethminingjsonrpcrequest)) => `Promise`\<[`EthMiningJsonRpcResponse`](procedures_types.md#ethminingjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthMiningJsonRpcResponse`](procedures_types.md#ethminingjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthMiningJsonRpcRequest`](procedures_types.md#ethminingjsonrpcrequest) |

##### Returns

`Promise`\<[`EthMiningJsonRpcResponse`](procedures_types.md#ethminingjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:810

___

### EthMiningJsonRpcRequest

Ƭ **EthMiningJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_mining"``, readonly []\>

JSON-RPC request for `eth_mining` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:286

___

### EthMiningJsonRpcResponse

Ƭ **EthMiningJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_mining"``, `boolean`, `string`\>

JSON-RPC response for `eth_mining` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:602

___

### EthNewBlockFilterJsonRpcProcedure

Ƭ **EthNewBlockFilterJsonRpcProcedure**: (`request`: [`EthNewBlockFilterJsonRpcRequest`](procedures_types.md#ethnewblockfilterjsonrpcrequest)) => `Promise`\<[`EthNewBlockFilterJsonRpcResponse`](procedures_types.md#ethnewblockfilterjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthNewBlockFilterJsonRpcResponse`](procedures_types.md#ethnewblockfilterjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthNewBlockFilterJsonRpcRequest`](procedures_types.md#ethnewblockfilterjsonrpcrequest) |

##### Returns

`Promise`\<[`EthNewBlockFilterJsonRpcResponse`](procedures_types.md#ethnewblockfilterjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:818

___

### EthNewBlockFilterJsonRpcRequest

Ƭ **EthNewBlockFilterJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_newBlockFilter"``, readonly []\>

JSON-RPC request for `eth_newBlockFilter` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:336

___

### EthNewBlockFilterJsonRpcResponse

Ƭ **EthNewBlockFilterJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_newBlockFilter"``, [`Hex`](index.md#hex), `string`\>

JSON-RPC response for `eth_newBlockFilter` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:649

___

### EthNewFilterJsonRpcProcedure

Ƭ **EthNewFilterJsonRpcProcedure**: (`request`: [`EthNewFilterJsonRpcRequest`](procedures_types.md#ethnewfilterjsonrpcrequest)) => `Promise`\<[`EthNewFilterJsonRpcResponse`](procedures_types.md#ethnewfilterjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthNewFilterJsonRpcResponse`](procedures_types.md#ethnewfilterjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthNewFilterJsonRpcRequest`](procedures_types.md#ethnewfilterjsonrpcrequest) |

##### Returns

`Promise`\<[`EthNewFilterJsonRpcResponse`](procedures_types.md#ethnewfilterjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:817

___

### EthNewFilterJsonRpcRequest

Ƭ **EthNewFilterJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_newFilter"``, [`SerializeToJson`](procedures_types.md#serializetojson)\<[`FilterParams`](actions_types.md#filterparams)\>\>

JSON-RPC request for `eth_newFilter` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:332

___

### EthNewFilterJsonRpcResponse

Ƭ **EthNewFilterJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_newFilter"``, [`Hex`](index.md#hex), `string`\>

JSON-RPC response for `eth_newFilter` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:645

___

### EthNewPendingTransactionFilterJsonRpcProcedure

Ƭ **EthNewPendingTransactionFilterJsonRpcProcedure**: (`request`: [`EthNewPendingTransactionFilterJsonRpcRequest`](procedures_types.md#ethnewpendingtransactionfilterjsonrpcrequest)) => `Promise`\<[`EthNewPendingTransactionFilterJsonRpcResponse`](procedures_types.md#ethnewpendingtransactionfilterjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthNewPendingTransactionFilterJsonRpcResponse`](procedures_types.md#ethnewpendingtransactionfilterjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthNewPendingTransactionFilterJsonRpcRequest`](procedures_types.md#ethnewpendingtransactionfilterjsonrpcrequest) |

##### Returns

`Promise`\<[`EthNewPendingTransactionFilterJsonRpcResponse`](procedures_types.md#ethnewpendingtransactionfilterjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:819

___

### EthNewPendingTransactionFilterJsonRpcRequest

Ƭ **EthNewPendingTransactionFilterJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_newPendingTransactionFilter"``, readonly []\>

JSON-RPC request for `eth_newPendingTransactionFilter` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:340

___

### EthNewPendingTransactionFilterJsonRpcResponse

Ƭ **EthNewPendingTransactionFilterJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_newPendingTransactionFilter"``, [`Hex`](index.md#hex), `string`\>

JSON-RPC response for `eth_newPendingTransactionFilter` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:653

___

### EthProtocolVersionJsonRpcProcedure

Ƭ **EthProtocolVersionJsonRpcProcedure**: (`request`: [`EthProtocolVersionJsonRpcRequest`](procedures_types.md#ethprotocolversionjsonrpcrequest)) => `Promise`\<[`EthProtocolVersionJsonRpcResponse`](procedures_types.md#ethprotocolversionjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthProtocolVersionJsonRpcResponse`](procedures_types.md#ethprotocolversionjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthProtocolVersionJsonRpcRequest`](procedures_types.md#ethprotocolversionjsonrpcrequest) |

##### Returns

`Promise`\<[`EthProtocolVersionJsonRpcResponse`](procedures_types.md#ethprotocolversionjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:811

___

### EthProtocolVersionJsonRpcRequest

Ƭ **EthProtocolVersionJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_protocolVersion"``, readonly []\>

JSON-RPC request for `eth_protocolVersion` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:290

___

### EthProtocolVersionJsonRpcResponse

Ƭ **EthProtocolVersionJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_protocolVersion"``, [`Hex`](index.md#hex), `string`\>

JSON-RPC response for `eth_protocolVersion` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:606

___

### EthRequestType

Ƭ **EthRequestType**: `Object`

A mapping of `eth_*` method names to their request type

#### Type declaration

| Name | Type |
| :------ | :------ |
| `eth_accounts` | [`EthAccountsJsonRpcRequest`](procedures_types.md#ethaccountsjsonrpcrequest) |
| `eth_blockNumber` | [`EthBlockNumberJsonRpcRequest`](procedures_types.md#ethblocknumberjsonrpcrequest) |
| `eth_call` | [`EthCallJsonRpcRequest`](procedures_types.md#ethcalljsonrpcrequest) |
| `eth_chainId` | [`EthChainIdJsonRpcRequest`](procedures_types.md#ethchainidjsonrpcrequest) |
| `eth_coinbase` | [`EthCoinbaseJsonRpcRequest`](procedures_types.md#ethcoinbasejsonrpcrequest) |
| `eth_estimateGas` | [`EthEstimateGasJsonRpcRequest`](procedures_types.md#ethestimategasjsonrpcrequest) |
| `eth_gasPrice` | [`EthGasPriceJsonRpcRequest`](procedures_types.md#ethgaspricejsonrpcrequest) |
| `eth_getBalance` | [`EthGetBalanceJsonRpcRequest`](procedures_types.md#ethgetbalancejsonrpcrequest) |
| `eth_getBlockByHash` | [`EthGetBlockByHashJsonRpcRequest`](procedures_types.md#ethgetblockbyhashjsonrpcrequest) |
| `eth_getBlockByNumber` | [`EthGetBlockByNumberJsonRpcRequest`](procedures_types.md#ethgetblockbynumberjsonrpcrequest) |
| `eth_getBlockTransactionCountByHash` | [`EthGetBlockTransactionCountByHashJsonRpcRequest`](procedures_types.md#ethgetblocktransactioncountbyhashjsonrpcrequest) |
| `eth_getBlockTransactionCountByNumber` | [`EthGetBlockTransactionCountByNumberJsonRpcRequest`](procedures_types.md#ethgetblocktransactioncountbynumberjsonrpcrequest) |
| `eth_getCode` | [`EthGetCodeJsonRpcRequest`](procedures_types.md#ethgetcodejsonrpcrequest) |
| `eth_getFilterChanges` | [`EthGetFilterChangesJsonRpcRequest`](procedures_types.md#ethgetfilterchangesjsonrpcrequest) |
| `eth_getFilterLogs` | [`EthGetFilterLogsJsonRpcRequest`](procedures_types.md#ethgetfilterlogsjsonrpcrequest) |
| `eth_getLogs` | [`EthGetLogsJsonRpcRequest`](procedures_types.md#ethgetlogsjsonrpcrequest) |
| `eth_getStorageAt` | [`EthGetStorageAtJsonRpcRequest`](procedures_types.md#ethgetstorageatjsonrpcrequest) |
| `eth_getTransactionByBlockHashAndIndex` | [`EthGetTransactionByBlockHashAndIndexJsonRpcRequest`](procedures_types.md#ethgettransactionbyblockhashandindexjsonrpcrequest) |
| `eth_getTransactionByBlockNumberAndIndex` | [`EthGetTransactionByBlockNumberAndIndexJsonRpcRequest`](procedures_types.md#ethgettransactionbyblocknumberandindexjsonrpcrequest) |
| `eth_getTransactionByHash` | [`EthGetTransactionByHashJsonRpcRequest`](procedures_types.md#ethgettransactionbyhashjsonrpcrequest) |
| `eth_getTransactionCount` | [`EthGetTransactionCountJsonRpcRequest`](procedures_types.md#ethgettransactioncountjsonrpcrequest) |
| `eth_getTransactionReceipt` | [`EthGetTransactionReceiptJsonRpcRequest`](procedures_types.md#ethgettransactionreceiptjsonrpcrequest) |
| `eth_getUncleByBlockHashAndIndex` | [`EthGetUncleByBlockHashAndIndexJsonRpcRequest`](procedures_types.md#ethgetunclebyblockhashandindexjsonrpcrequest) |
| `eth_getUncleByBlockNumberAndIndex` | [`EthGetUncleByBlockNumberAndIndexJsonRpcRequest`](procedures_types.md#ethgetunclebyblocknumberandindexjsonrpcrequest) |
| `eth_getUncleCountByBlockHash` | [`EthGetUncleCountByBlockHashJsonRpcRequest`](procedures_types.md#ethgetunclecountbyblockhashjsonrpcrequest) |
| `eth_getUncleCountByBlockNumber` | [`EthGetUncleCountByBlockNumberJsonRpcRequest`](procedures_types.md#ethgetunclecountbyblocknumberjsonrpcrequest) |
| `eth_hashrate` | [`EthHashrateJsonRpcRequest`](procedures_types.md#ethhashratejsonrpcrequest) |
| `eth_mining` | [`EthMiningJsonRpcRequest`](procedures_types.md#ethminingjsonrpcrequest) |
| `eth_newBlockFilter` | [`EthNewBlockFilterJsonRpcRequest`](procedures_types.md#ethnewblockfilterjsonrpcrequest) |
| `eth_newFilter` | [`EthNewFilterJsonRpcRequest`](procedures_types.md#ethnewfilterjsonrpcrequest) |
| `eth_newPendingTransactionFilter` | [`EthNewPendingTransactionFilterJsonRpcRequest`](procedures_types.md#ethnewpendingtransactionfilterjsonrpcrequest) |
| `eth_protocolVersion` | [`EthProtocolVersionJsonRpcRequest`](procedures_types.md#ethprotocolversionjsonrpcrequest) |
| `eth_sendRawTransaction` | [`EthSendRawTransactionJsonRpcRequest`](procedures_types.md#ethsendrawtransactionjsonrpcrequest) |
| `eth_sendTransaction` | [`EthSendTransactionJsonRpcRequest`](procedures_types.md#ethsendtransactionjsonrpcrequest) |
| `eth_sign` | [`EthSignJsonRpcRequest`](procedures_types.md#ethsignjsonrpcrequest) |
| `eth_signTransaction` | [`EthSignTransactionJsonRpcRequest`](procedures_types.md#ethsigntransactionjsonrpcrequest) |
| `eth_syncing` | [`EthSyncingJsonRpcRequest`](procedures_types.md#ethsyncingjsonrpcrequest) |
| `eth_uninstallFilter` | [`EthUninstallFilterJsonRpcRequest`](procedures_types.md#ethuninstallfilterjsonrpcrequest) |

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:909

___

### EthReturnType

Ƭ **EthReturnType**: `Object`

A mapping of `eth_*` method names to their return type

#### Type declaration

| Name | Type |
| :------ | :------ |
| `eth_accounts` | [`EthAccountsJsonRpcResponse`](procedures_types.md#ethaccountsjsonrpcresponse) |
| `eth_blockNumber` | [`EthBlockNumberJsonRpcResponse`](procedures_types.md#ethblocknumberjsonrpcresponse) |
| `eth_call` | [`EthCallJsonRpcResponse`](procedures_types.md#ethcalljsonrpcresponse) |
| `eth_chainId` | [`EthChainIdJsonRpcResponse`](procedures_types.md#ethchainidjsonrpcresponse) |
| `eth_coinbase` | [`EthCoinbaseJsonRpcResponse`](procedures_types.md#ethcoinbasejsonrpcresponse) |
| `eth_estimateGas` | [`EthEstimateGasJsonRpcResponse`](procedures_types.md#ethestimategasjsonrpcresponse) |
| `eth_gasPrice` | [`EthGasPriceJsonRpcResponse`](procedures_types.md#ethgaspricejsonrpcresponse) |
| `eth_getBalance` | [`EthGetBalanceJsonRpcResponse`](procedures_types.md#ethgetbalancejsonrpcresponse) |
| `eth_getBlockByHash` | [`EthGetBlockByHashJsonRpcResponse`](procedures_types.md#ethgetblockbyhashjsonrpcresponse) |
| `eth_getBlockByNumber` | [`EthGetBlockByNumberJsonRpcResponse`](procedures_types.md#ethgetblockbynumberjsonrpcresponse) |
| `eth_getBlockTransactionCountByHash` | [`EthGetBlockTransactionCountByHashJsonRpcResponse`](procedures_types.md#ethgetblocktransactioncountbyhashjsonrpcresponse) |
| `eth_getBlockTransactionCountByNumber` | [`EthGetBlockTransactionCountByNumberJsonRpcResponse`](procedures_types.md#ethgetblocktransactioncountbynumberjsonrpcresponse) |
| `eth_getCode` | [`EthGetCodeJsonRpcResponse`](procedures_types.md#ethgetcodejsonrpcresponse) |
| `eth_getFilterChanges` | [`EthGetFilterChangesJsonRpcResponse`](procedures_types.md#ethgetfilterchangesjsonrpcresponse) |
| `eth_getFilterLogs` | [`EthGetFilterLogsJsonRpcResponse`](procedures_types.md#ethgetfilterlogsjsonrpcresponse) |
| `eth_getLogs` | [`EthGetLogsJsonRpcResponse`](procedures_types.md#ethgetlogsjsonrpcresponse) |
| `eth_getStorageAt` | [`EthGetStorageAtJsonRpcResponse`](procedures_types.md#ethgetstorageatjsonrpcresponse) |
| `eth_getTransactionByBlockHashAndIndex` | [`EthGetTransactionByBlockHashAndIndexJsonRpcResponse`](procedures_types.md#ethgettransactionbyblockhashandindexjsonrpcresponse) |
| `eth_getTransactionByBlockNumberAndIndex` | [`EthGetTransactionByBlockNumberAndIndexJsonRpcResponse`](procedures_types.md#ethgettransactionbyblocknumberandindexjsonrpcresponse) |
| `eth_getTransactionByHash` | [`EthGetTransactionByHashJsonRpcResponse`](procedures_types.md#ethgettransactionbyhashjsonrpcresponse) |
| `eth_getTransactionCount` | [`EthGetTransactionCountJsonRpcResponse`](procedures_types.md#ethgettransactioncountjsonrpcresponse) |
| `eth_getTransactionReceipt` | [`EthGetTransactionReceiptJsonRpcResponse`](procedures_types.md#ethgettransactionreceiptjsonrpcresponse) |
| `eth_getUncleByBlockHashAndIndex` | [`EthGetUncleByBlockHashAndIndexJsonRpcResponse`](procedures_types.md#ethgetunclebyblockhashandindexjsonrpcresponse) |
| `eth_getUncleByBlockNumberAndIndex` | [`EthGetUncleByBlockNumberAndIndexJsonRpcResponse`](procedures_types.md#ethgetunclebyblocknumberandindexjsonrpcresponse) |
| `eth_getUncleCountByBlockHash` | [`EthGetUncleCountByBlockHashJsonRpcResponse`](procedures_types.md#ethgetunclecountbyblockhashjsonrpcresponse) |
| `eth_getUncleCountByBlockNumber` | [`EthGetUncleCountByBlockNumberJsonRpcResponse`](procedures_types.md#ethgetunclecountbyblocknumberjsonrpcresponse) |
| `eth_hashrate` | [`EthHashrateJsonRpcResponse`](procedures_types.md#ethhashratejsonrpcresponse) |
| `eth_mining` | [`EthMiningJsonRpcResponse`](procedures_types.md#ethminingjsonrpcresponse) |
| `eth_newBlockFilter` | [`EthNewBlockFilterJsonRpcResponse`](procedures_types.md#ethnewblockfilterjsonrpcresponse) |
| `eth_newFilter` | [`EthNewFilterJsonRpcResponse`](procedures_types.md#ethnewfilterjsonrpcresponse) |
| `eth_newPendingTransactionFilter` | [`EthNewPendingTransactionFilterJsonRpcResponse`](procedures_types.md#ethnewpendingtransactionfilterjsonrpcresponse) |
| `eth_protocolVersion` | [`EthProtocolVersionJsonRpcResponse`](procedures_types.md#ethprotocolversionjsonrpcresponse) |
| `eth_sendRawTransaction` | [`EthSendRawTransactionJsonRpcResponse`](procedures_types.md#ethsendrawtransactionjsonrpcresponse) |
| `eth_sendTransaction` | [`EthSendTransactionJsonRpcResponse`](procedures_types.md#ethsendtransactionjsonrpcresponse) |
| `eth_sign` | [`EthSignJsonRpcResponse`](procedures_types.md#ethsignjsonrpcresponse) |
| `eth_signTransaction` | [`EthSignTransactionJsonRpcResponse`](procedures_types.md#ethsigntransactionjsonrpcresponse) |
| `eth_syncing` | [`EthSyncingJsonRpcResponse`](procedures_types.md#ethsyncingjsonrpcresponse) |
| `eth_uninstallFilter` | [`EthUninstallFilterJsonRpcResponse`](procedures_types.md#ethuninstallfilterjsonrpcresponse) |

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:953

___

### EthSendRawTransactionJsonRpcProcedure

Ƭ **EthSendRawTransactionJsonRpcProcedure**: (`request`: [`EthSendRawTransactionJsonRpcRequest`](procedures_types.md#ethsendrawtransactionjsonrpcrequest)) => `Promise`\<[`EthSendRawTransactionJsonRpcResponse`](procedures_types.md#ethsendrawtransactionjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSendRawTransactionJsonRpcResponse`](procedures_types.md#ethsendrawtransactionjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSendRawTransactionJsonRpcRequest`](procedures_types.md#ethsendrawtransactionjsonrpcrequest) |

##### Returns

`Promise`\<[`EthSendRawTransactionJsonRpcResponse`](procedures_types.md#ethsendrawtransactionjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:812

___

### EthSendRawTransactionJsonRpcRequest

Ƭ **EthSendRawTransactionJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_sendRawTransaction"``, [data: Hex]\>

JSON-RPC request for `eth_sendRawTransaction` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:294

___

### EthSendRawTransactionJsonRpcResponse

Ƭ **EthSendRawTransactionJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_sendRawTransaction"``, [`Hex`](index.md#hex), `string`\>

JSON-RPC response for `eth_sendRawTransaction` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:610

___

### EthSendTransactionJsonRpcProcedure

Ƭ **EthSendTransactionJsonRpcProcedure**: (`request`: [`EthSendTransactionJsonRpcRequest`](procedures_types.md#ethsendtransactionjsonrpcrequest)) => `Promise`\<[`EthSendTransactionJsonRpcResponse`](procedures_types.md#ethsendtransactionjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSendTransactionJsonRpcResponse`](procedures_types.md#ethsendtransactionjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSendTransactionJsonRpcRequest`](procedures_types.md#ethsendtransactionjsonrpcrequest) |

##### Returns

`Promise`\<[`EthSendTransactionJsonRpcResponse`](procedures_types.md#ethsendtransactionjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:813

___

### EthSendTransactionJsonRpcRequest

Ƭ **EthSendTransactionJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_sendTransaction"``, [tx: JsonRpcTransaction]\>

JSON-RPC request for `eth_sendTransaction` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:300

___

### EthSendTransactionJsonRpcResponse

Ƭ **EthSendTransactionJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_sendTransaction"``, [`Hex`](index.md#hex), `string`\>

JSON-RPC response for `eth_sendTransaction` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:614

___

### EthSignJsonRpcProcedure

Ƭ **EthSignJsonRpcProcedure**: (`request`: [`EthSignJsonRpcRequest`](procedures_types.md#ethsignjsonrpcrequest)) => `Promise`\<[`EthSignJsonRpcResponse`](procedures_types.md#ethsignjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSignJsonRpcResponse`](procedures_types.md#ethsignjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSignJsonRpcRequest`](procedures_types.md#ethsignjsonrpcrequest) |

##### Returns

`Promise`\<[`EthSignJsonRpcResponse`](procedures_types.md#ethsignjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:814

___

### EthSignJsonRpcRequest

Ƭ **EthSignJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_sign"``, [address: Address, message: Hex]\>

JSON-RPC request for `eth_sign` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:306

___

### EthSignJsonRpcResponse

Ƭ **EthSignJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_sign"``, [`Hex`](index.md#hex), `string`\>

JSON-RPC response for `eth_sign` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:618

___

### EthSignTransactionJsonRpcProcedure

Ƭ **EthSignTransactionJsonRpcProcedure**: (`request`: [`EthSignTransactionJsonRpcRequest`](procedures_types.md#ethsigntransactionjsonrpcrequest)) => `Promise`\<[`EthSignTransactionJsonRpcResponse`](procedures_types.md#ethsigntransactionjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSignTransactionJsonRpcResponse`](procedures_types.md#ethsigntransactionjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSignTransactionJsonRpcRequest`](procedures_types.md#ethsigntransactionjsonrpcrequest) |

##### Returns

`Promise`\<[`EthSignTransactionJsonRpcResponse`](procedures_types.md#ethsigntransactionjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:815

___

### EthSignTransactionJsonRpcRequest

Ƭ **EthSignTransactionJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_signTransaction"``, [\{ `chainId?`: [`Hex`](index.md#hex) ; `data?`: [`Hex`](index.md#hex) ; `from`: [`Address`](index.md#address) ; `gas?`: [`Hex`](index.md#hex) ; `gasPrice?`: [`Hex`](index.md#hex) ; `nonce?`: [`Hex`](index.md#hex) ; `to?`: [`Address`](index.md#address) ; `value?`: [`Hex`](index.md#hex)  }]\>

JSON-RPC request for `eth_signTransaction` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:313

___

### EthSignTransactionJsonRpcResponse

Ƭ **EthSignTransactionJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_signTransaction"``, [`Hex`](index.md#hex), `string`\>

JSON-RPC response for `eth_signTransaction` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:622

___

### EthSyncingJsonRpcProcedure

Ƭ **EthSyncingJsonRpcProcedure**: (`request`: [`EthSyncingJsonRpcRequest`](procedures_types.md#ethsyncingjsonrpcrequest)) => `Promise`\<[`EthSyncingJsonRpcResponse`](procedures_types.md#ethsyncingjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSyncingJsonRpcResponse`](procedures_types.md#ethsyncingjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSyncingJsonRpcRequest`](procedures_types.md#ethsyncingjsonrpcrequest) |

##### Returns

`Promise`\<[`EthSyncingJsonRpcResponse`](procedures_types.md#ethsyncingjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:816

___

### EthSyncingJsonRpcRequest

Ƭ **EthSyncingJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_syncing"``, readonly []\>

JSON-RPC request for `eth_syncing` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:328

___

### EthSyncingJsonRpcResponse

Ƭ **EthSyncingJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_syncing"``, `boolean` \| \{ `currentBlock`: [`Hex`](index.md#hex) ; `headedBytecodebytes?`: [`Hex`](index.md#hex) ; `healedBytecodes?`: [`Hex`](index.md#hex) ; `healedTrienodes?`: [`Hex`](index.md#hex) ; `healingBytecode?`: [`Hex`](index.md#hex) ; `healingTrienodes?`: [`Hex`](index.md#hex) ; `highestBlock`: [`Hex`](index.md#hex) ; `knownStates`: [`Hex`](index.md#hex) ; `pulledStates`: [`Hex`](index.md#hex) ; `startingBlock`: [`Hex`](index.md#hex) ; `syncedBytecodeBytes?`: [`Hex`](index.md#hex) ; `syncedBytecodes?`: [`Hex`](index.md#hex) ; `syncedStorage?`: [`Hex`](index.md#hex) ; `syncedStorageBytes?`: [`Hex`](index.md#hex)  }, `string`\>

JSON-RPC response for `eth_syncing` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:626

___

### EthUninstallFilterJsonRpcProcedure

Ƭ **EthUninstallFilterJsonRpcProcedure**: (`request`: [`EthUninstallFilterJsonRpcRequest`](procedures_types.md#ethuninstallfilterjsonrpcrequest)) => `Promise`\<[`EthUninstallFilterJsonRpcResponse`](procedures_types.md#ethuninstallfilterjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthUninstallFilterJsonRpcResponse`](procedures_types.md#ethuninstallfilterjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthUninstallFilterJsonRpcRequest`](procedures_types.md#ethuninstallfilterjsonrpcrequest) |

##### Returns

`Promise`\<[`EthUninstallFilterJsonRpcResponse`](procedures_types.md#ethuninstallfilterjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:820

___

### EthUninstallFilterJsonRpcRequest

Ƭ **EthUninstallFilterJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"eth_uninstallFilter"``, [filterId: Hex]\>

JSON-RPC request for `eth_uninstallFilter` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:344

___

### EthUninstallFilterJsonRpcResponse

Ƭ **EthUninstallFilterJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"eth_uninstallFilter"``, `boolean`, `string`\>

JSON-RPC response for `eth_uninstallFilter` procedure

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:657

___

### GetAccountJsonRpcProcedure

Ƭ **GetAccountJsonRpcProcedure**: (`request`: [`GetAccountJsonRpcRequest`](procedures_types.md#getaccountjsonrpcrequest)) => `Promise`\<[`GetAccountJsonRpcResponse`](procedures_types.md#getaccountjsonrpcresponse)\>

GetAccount JSON-RPC tevm procedure puts an account or contract into the tevm state

#### Type declaration

▸ (`request`): `Promise`\<[`GetAccountJsonRpcResponse`](procedures_types.md#getaccountjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`GetAccountJsonRpcRequest`](procedures_types.md#getaccountjsonrpcrequest) |

##### Returns

`Promise`\<[`GetAccountJsonRpcResponse`](procedures_types.md#getaccountjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:825

___

### GetAccountJsonRpcRequest

Ƭ **GetAccountJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"tevm_getAccount"``, [[`SerializeToJson`](procedures_types.md#serializetojson)\<[`GetAccountParams`](index.md#getaccountparams)\>]\>

JSON-RPC request for `tevm_getAccount` method

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:352

___

### GetAccountJsonRpcResponse

Ƭ **GetAccountJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"tevm_getAccount"``, [`SerializeToJson`](procedures_types.md#serializetojson)\<[`GetAccountResult`](index.md#getaccountresult)\>, [`GetAccountError`](errors.md#getaccounterror)[``"_tag"``]\>

JSON-RPC response for `tevm_getAccount` method

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:662

___

### JsonRpcTransaction

Ƭ **JsonRpcTransaction**: `Object`

the transaction call object for methods like `eth_call`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `data?` | [`Hex`](index.md#hex) | The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation |
| `from` | [`Address`](index.md#address) | The address from which the transaction is sent |
| `gas?` | [`Hex`](index.md#hex) | The integer of gas provided for the transaction execution |
| `gasPrice?` | [`Hex`](index.md#hex) | The integer of gasPrice used for each paid gas encoded as hexadecimal |
| `to?` | [`Address`](index.md#address) | The address to which the transaction is addressed |
| `value?` | [`Hex`](index.md#hex) | The integer of value sent with this transaction encoded as hexadecimal |

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:138

___

### JsonSerializable

Ƭ **JsonSerializable**: `bigint` \| `string` \| `number` \| `boolean` \| ``null`` \| [`JsonSerializableArray`](procedures_types.md#jsonserializablearray) \| [`JsonSerializableObject`](procedures_types.md#jsonserializableobject) \| [`JsonSerializableSet`](procedures_types.md#jsonserializableset)

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:7

___

### JsonSerializableArray

Ƭ **JsonSerializableArray**: `ReadonlyArray`\<[`JsonSerializable`](procedures_types.md#jsonserializable)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:8

___

### JsonSerializableObject

Ƭ **JsonSerializableObject**: `Object`

#### Index signature

▪ [key: `string`]: [`JsonSerializable`](procedures_types.md#jsonserializable)

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:9

___

### JsonSerializableSet

Ƭ **JsonSerializableSet**\<`T`\>: `Set`\<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `bigint` \| `string` \| `number` \| `boolean` = `bigint` \| `string` \| `number` \| `boolean` |

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:12

___

### LoadStateJsonRpcProcedure

Ƭ **LoadStateJsonRpcProcedure**: (`request`: [`LoadStateJsonRpcRequest`](procedures_types.md#loadstatejsonrpcrequest)) => `Promise`\<[`LoadStateJsonRpcResponse`](procedures_types.md#loadstatejsonrpcresponse)\>

Procedure for handling script JSON-RPC requests
Procedure for handling tevm_loadState JSON-RPC requests

**`Example`**

```ts
const result = await tevm.request({
.   method: 'tevm_loadState',
   params: { '0x..': '0x...', ...},
.   id: 1,
  jsonrpc: '2.0'
. }
console.log(result) // { jsonrpc: '2.0', id: 1, method: 'tevm_loadState', result: {}}
```

#### Type declaration

▸ (`request`): `Promise`\<[`LoadStateJsonRpcResponse`](procedures_types.md#loadstatejsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`LoadStateJsonRpcRequest`](procedures_types.md#loadstatejsonrpcrequest) |

##### Returns

`Promise`\<[`LoadStateJsonRpcResponse`](procedures_types.md#loadstatejsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:840

___

### LoadStateJsonRpcRequest

Ƭ **LoadStateJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"tevm_loadState"``, [[`SerializedParams`](procedures_types.md#serializedparams)]\>

The JSON-RPC request for the `tevm_loadState` method

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:365

___

### LoadStateJsonRpcResponse

Ƭ **LoadStateJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"tevm_loadState"``, [`SerializeToJson`](procedures_types.md#serializetojson)\<[`LoadStateResult`](actions_types.md#loadstateresult)\>, [`LoadStateError`](errors.md#loadstateerror)[``"_tag"``]\>

Response of the `tevm_loadState` RPC method.

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:667

___

### ScriptJsonRpcProcedure

Ƭ **ScriptJsonRpcProcedure**: (`request`: [`ScriptJsonRpcRequest`](procedures_types.md#scriptjsonrpcrequest)) => `Promise`\<[`ScriptJsonRpcResponse`](procedures_types.md#scriptjsonrpcresponse)\>

Procedure for handling script JSON-RPC requests

#### Type declaration

▸ (`request`): `Promise`\<[`ScriptJsonRpcResponse`](procedures_types.md#scriptjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`ScriptJsonRpcRequest`](procedures_types.md#scriptjsonrpcrequest) |

##### Returns

`Promise`\<[`ScriptJsonRpcResponse`](procedures_types.md#scriptjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:850

___

### ScriptJsonRpcRequest

Ƭ **ScriptJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"tevm_script"``, [[`SerializeToJson`](procedures_types.md#serializetojson)\<[`BaseCallParams`](actions_types.md#basecallparams)\> & \{ `data`: [`Hex`](index.md#hex) ; `deployedBytecode`: [`Hex`](index.md#hex)  }]\>

The JSON-RPC request for the `tevm_script` method

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:372

___

### ScriptJsonRpcResponse

Ƭ **ScriptJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"tevm_script"``, [`SerializeToJson`](procedures_types.md#serializetojson)\<[`CallResult`](index.md#callresult)\>, [`ScriptError`](errors.md#scripterror)[``"_tag"``]\>

JSON-RPC response for `tevm_script` method

**`Example`**

```ts
import { createMemoryClient } from 'tevm'

const tevm = createMemoryClient()

const respose: ScriptJsonRpcResponse = await tevm.request({
  method: 'tevm_script',
  params: {
    deployedBytecode: '608...',
    abi: [...],
    args: [...]
})
```

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:684

___

### SerializeToJson

Ƭ **SerializeToJson**\<`T`\>: `T` extends [`JsonSerializableSet`](procedures_types.md#jsonserializableset)\<infer S\> ? `ReadonlyArray`\<`S`\> : `T` extends [`JsonSerializableObject`](procedures_types.md#jsonserializableobject) ? \{ [P in keyof T]: SerializeToJson\<T[P]\> } : `T` extends [`JsonSerializableArray`](procedures_types.md#jsonserializablearray) ? [`SerializeToJson`](procedures_types.md#serializetojson)\<`T`[`number`]\>[] : [`BigIntToHex`](procedures_types.md#biginttohex)\<[`SetToHex`](procedures_types.md#settohex)\<`T`\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:15

___

### SerializedParams

Ƭ **SerializedParams**: `Object`

The parameters for the `tevm_loadState` method

#### Type declaration

| Name | Type |
| :------ | :------ |
| `state` | [`SerializeToJson`](procedures_types.md#serializetojson)\<[`ParameterizedTevmState`](state.md#parameterizedtevmstate)\> |

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:359

___

### SetAccountJsonRpcProcedure

Ƭ **SetAccountJsonRpcProcedure**: (`request`: [`SetAccountJsonRpcRequest`](procedures_types.md#setaccountjsonrpcrequest)) => `Promise`\<[`SetAccountJsonRpcResponse`](procedures_types.md#setaccountjsonrpcresponse)\>

SetAccount JSON-RPC tevm procedure sets an account into the tevm state

#### Type declaration

▸ (`request`): `Promise`\<[`SetAccountJsonRpcResponse`](procedures_types.md#setaccountjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`SetAccountJsonRpcRequest`](procedures_types.md#setaccountjsonrpcrequest) |

##### Returns

`Promise`\<[`SetAccountJsonRpcResponse`](procedures_types.md#setaccountjsonrpcresponse)\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:845

___

### SetAccountJsonRpcRequest

Ƭ **SetAccountJsonRpcRequest**: [`JsonRpcRequest`](index.md#jsonrpcrequest)\<``"tevm_setAccount"``, [[`SerializeToJson`](procedures_types.md#serializetojson)\<[`SetAccountParams`](index.md#setaccountparams)\>]\>

JSON-RPC request for `tevm_setAccount` method

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:395

___

### SetAccountJsonRpcResponse

Ƭ **SetAccountJsonRpcResponse**: [`JsonRpcResponse`](index.md#jsonrpcresponse)\<``"tevm_setAccount"``, [`SerializeToJson`](procedures_types.md#serializetojson)\<[`SetAccountResult`](index.md#setaccountresult)\>, [`SetAccountError`](errors.md#setaccounterror)[``"_tag"``]\>

JSON-RPC response for `tevm_setAccount` method

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:689

___

### SetToHex

Ƭ **SetToHex**\<`T`\>: `T` extends `Set`\<`any`\> ? [`Hex`](index.md#hex) : `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:14

___

### TevmRequestType

Ƭ **TevmRequestType**: `Object`

A mapping of `tevm_*` method names to their request type

#### Type declaration

| Name | Type |
| :------ | :------ |
| `tevm_call` | [`CallJsonRpcRequest`](procedures_types.md#calljsonrpcrequest) |
| `tevm_dumpState` | [`DumpStateJsonRpcRequest`](procedures_types.md#dumpstatejsonrpcrequest) |
| `tevm_getAccount` | [`GetAccountJsonRpcRequest`](procedures_types.md#getaccountjsonrpcrequest) |
| `tevm_loadState` | [`LoadStateJsonRpcRequest`](procedures_types.md#loadstatejsonrpcrequest) |
| `tevm_script` | [`ScriptJsonRpcRequest`](procedures_types.md#scriptjsonrpcrequest) |
| `tevm_setAccount` | [`SetAccountJsonRpcRequest`](procedures_types.md#setaccountjsonrpcrequest) |

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:997

___

### TevmReturnType

Ƭ **TevmReturnType**: `Object`

A mapping of `tevm_*` method names to their return type

#### Type declaration

| Name | Type |
| :------ | :------ |
| `tevm_call` | [`CallJsonRpcResponse`](procedures_types.md#calljsonrpcresponse) |
| `tevm_dumpState` | [`DumpStateJsonRpcResponse`](procedures_types.md#dumpstatejsonrpcresponse) |
| `tevm_getAccount` | [`GetAccountJsonRpcResponse`](procedures_types.md#getaccountjsonrpcresponse) |
| `tevm_loadState` | [`LoadStateJsonRpcResponse`](procedures_types.md#loadstatejsonrpcresponse) |
| `tevm_script` | [`ScriptJsonRpcResponse`](procedures_types.md#scriptjsonrpcresponse) |
| `tevm_setAccount` | [`SetAccountJsonRpcResponse`](procedures_types.md#setaccountjsonrpcresponse) |

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:1018

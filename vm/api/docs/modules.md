[@tevm/api](README.md) / Exports

# @tevm/api

## Table of contents

### Type Aliases

- [AccountError](modules.md#accounterror)
- [AccountHandler](modules.md#accounthandler)
- [AccountJsonRpcProcedure](modules.md#accountjsonrpcprocedure)
- [AccountJsonRpcRequest](modules.md#accountjsonrpcrequest)
- [AccountJsonRpcResponse](modules.md#accountjsonrpcresponse)
- [AccountParams](modules.md#accountparams)
- [AccountResult](modules.md#accountresult)
- [BaseCallError](modules.md#basecallerror)
- [BaseCallParams](modules.md#basecallparams)
- [Block](modules.md#block)
- [BlockResult](modules.md#blockresult)
- [CallError](modules.md#callerror)
- [CallHandler](modules.md#callhandler)
- [CallJsonRpcProcedure](modules.md#calljsonrpcprocedure)
- [CallJsonRpcRequest](modules.md#calljsonrpcrequest)
- [CallJsonRpcResponse](modules.md#calljsonrpcresponse)
- [CallParams](modules.md#callparams)
- [CallResult](modules.md#callresult)
- [ContractError](modules.md#contracterror)
- [ContractHandler](modules.md#contracthandler)
- [ContractJsonRpcProcedure](modules.md#contractjsonrpcprocedure)
- [ContractJsonRpcRequest](modules.md#contractjsonrpcrequest)
- [ContractJsonRpcResponse](modules.md#contractjsonrpcresponse)
- [ContractParams](modules.md#contractparams)
- [ContractResult](modules.md#contractresult)
- [EthAccountsHandler](modules.md#ethaccountshandler)
- [EthAccountsJsonRpcProcedure](modules.md#ethaccountsjsonrpcprocedure)
- [EthAccountsJsonRpcRequest](modules.md#ethaccountsjsonrpcrequest)
- [EthAccountsJsonRpcResponse](modules.md#ethaccountsjsonrpcresponse)
- [EthAccountsParams](modules.md#ethaccountsparams)
- [EthAccountsResult](modules.md#ethaccountsresult)
- [EthBlockNumberHandler](modules.md#ethblocknumberhandler)
- [EthBlockNumberJsonRpcProcedure](modules.md#ethblocknumberjsonrpcprocedure)
- [EthBlockNumberJsonRpcRequest](modules.md#ethblocknumberjsonrpcrequest)
- [EthBlockNumberJsonRpcResponse](modules.md#ethblocknumberjsonrpcresponse)
- [EthBlockNumberParams](modules.md#ethblocknumberparams)
- [EthBlockNumberResult](modules.md#ethblocknumberresult)
- [EthCallHandler](modules.md#ethcallhandler)
- [EthCallJsonRpcProcedure](modules.md#ethcalljsonrpcprocedure)
- [EthCallJsonRpcRequest](modules.md#ethcalljsonrpcrequest)
- [EthCallJsonRpcResponse](modules.md#ethcalljsonrpcresponse)
- [EthCallParams](modules.md#ethcallparams)
- [EthCallResult](modules.md#ethcallresult)
- [EthChainIdHandler](modules.md#ethchainidhandler)
- [EthChainIdJsonRpcProcedure](modules.md#ethchainidjsonrpcprocedure)
- [EthChainIdJsonRpcRequest](modules.md#ethchainidjsonrpcrequest)
- [EthChainIdJsonRpcResponse](modules.md#ethchainidjsonrpcresponse)
- [EthChainIdParams](modules.md#ethchainidparams)
- [EthChainIdResult](modules.md#ethchainidresult)
- [EthCoinbaseHandler](modules.md#ethcoinbasehandler)
- [EthCoinbaseJsonRpcProcedure](modules.md#ethcoinbasejsonrpcprocedure)
- [EthCoinbaseJsonRpcRequest](modules.md#ethcoinbasejsonrpcrequest)
- [EthCoinbaseJsonRpcResponse](modules.md#ethcoinbasejsonrpcresponse)
- [EthCoinbaseParams](modules.md#ethcoinbaseparams)
- [EthCoinbaseResult](modules.md#ethcoinbaseresult)
- [EthEstimateGasHandler](modules.md#ethestimategashandler)
- [EthEstimateGasJsonRpcProcedure](modules.md#ethestimategasjsonrpcprocedure)
- [EthEstimateGasJsonRpcRequest](modules.md#ethestimategasjsonrpcrequest)
- [EthEstimateGasJsonRpcResponse](modules.md#ethestimategasjsonrpcresponse)
- [EthEstimateGasParams](modules.md#ethestimategasparams)
- [EthEstimateGasResult](modules.md#ethestimategasresult)
- [EthGasPriceHandler](modules.md#ethgaspricehandler)
- [EthGasPriceJsonRpcProcedure](modules.md#ethgaspricejsonrpcprocedure)
- [EthGasPriceJsonRpcRequest](modules.md#ethgaspricejsonrpcrequest)
- [EthGasPriceJsonRpcResponse](modules.md#ethgaspricejsonrpcresponse)
- [EthGasPriceParams](modules.md#ethgaspriceparams)
- [EthGasPriceResult](modules.md#ethgaspriceresult)
- [EthGetBalanceHandler](modules.md#ethgetbalancehandler)
- [EthGetBalanceJsonRpcProcedure](modules.md#ethgetbalancejsonrpcprocedure)
- [EthGetBalanceJsonRpcRequest](modules.md#ethgetbalancejsonrpcrequest)
- [EthGetBalanceJsonRpcResponse](modules.md#ethgetbalancejsonrpcresponse)
- [EthGetBalanceParams](modules.md#ethgetbalanceparams)
- [EthGetBalanceResult](modules.md#ethgetbalanceresult)
- [EthGetBlockByHashHandler](modules.md#ethgetblockbyhashhandler)
- [EthGetBlockByHashJsonRpcProcedure](modules.md#ethgetblockbyhashjsonrpcprocedure)
- [EthGetBlockByHashJsonRpcRequest](modules.md#ethgetblockbyhashjsonrpcrequest)
- [EthGetBlockByHashJsonRpcResponse](modules.md#ethgetblockbyhashjsonrpcresponse)
- [EthGetBlockByHashParams](modules.md#ethgetblockbyhashparams)
- [EthGetBlockByHashResult](modules.md#ethgetblockbyhashresult)
- [EthGetBlockByNumberHandler](modules.md#ethgetblockbynumberhandler)
- [EthGetBlockByNumberJsonRpcProcedure](modules.md#ethgetblockbynumberjsonrpcprocedure)
- [EthGetBlockByNumberJsonRpcRequest](modules.md#ethgetblockbynumberjsonrpcrequest)
- [EthGetBlockByNumberJsonRpcResponse](modules.md#ethgetblockbynumberjsonrpcresponse)
- [EthGetBlockByNumberParams](modules.md#ethgetblockbynumberparams)
- [EthGetBlockByNumberResult](modules.md#ethgetblockbynumberresult)
- [EthGetBlockTransactionCountByHashHandler](modules.md#ethgetblocktransactioncountbyhashhandler)
- [EthGetBlockTransactionCountByHashJsonRpcProcedure](modules.md#ethgetblocktransactioncountbyhashjsonrpcprocedure)
- [EthGetBlockTransactionCountByHashJsonRpcRequest](modules.md#ethgetblocktransactioncountbyhashjsonrpcrequest)
- [EthGetBlockTransactionCountByHashJsonRpcResponse](modules.md#ethgetblocktransactioncountbyhashjsonrpcresponse)
- [EthGetBlockTransactionCountByHashParams](modules.md#ethgetblocktransactioncountbyhashparams)
- [EthGetBlockTransactionCountByHashResult](modules.md#ethgetblocktransactioncountbyhashresult)
- [EthGetBlockTransactionCountByNumberHandler](modules.md#ethgetblocktransactioncountbynumberhandler)
- [EthGetBlockTransactionCountByNumberJsonRpcProcedure](modules.md#ethgetblocktransactioncountbynumberjsonrpcprocedure)
- [EthGetBlockTransactionCountByNumberJsonRpcRequest](modules.md#ethgetblocktransactioncountbynumberjsonrpcrequest)
- [EthGetBlockTransactionCountByNumberJsonRpcResponse](modules.md#ethgetblocktransactioncountbynumberjsonrpcresponse)
- [EthGetBlockTransactionCountByNumberParams](modules.md#ethgetblocktransactioncountbynumberparams)
- [EthGetBlockTransactionCountByNumberResult](modules.md#ethgetblocktransactioncountbynumberresult)
- [EthGetCodeHandler](modules.md#ethgetcodehandler)
- [EthGetCodeJsonRpcProcedure](modules.md#ethgetcodejsonrpcprocedure)
- [EthGetCodeJsonRpcRequest](modules.md#ethgetcodejsonrpcrequest)
- [EthGetCodeJsonRpcResponse](modules.md#ethgetcodejsonrpcresponse)
- [EthGetCodeParams](modules.md#ethgetcodeparams)
- [EthGetCodeResult](modules.md#ethgetcoderesult)
- [EthGetFilterChangesHandler](modules.md#ethgetfilterchangeshandler)
- [EthGetFilterChangesJsonRpcProcedure](modules.md#ethgetfilterchangesjsonrpcprocedure)
- [EthGetFilterChangesJsonRpcRequest](modules.md#ethgetfilterchangesjsonrpcrequest)
- [EthGetFilterChangesJsonRpcResponse](modules.md#ethgetfilterchangesjsonrpcresponse)
- [EthGetFilterChangesParams](modules.md#ethgetfilterchangesparams)
- [EthGetFilterChangesResult](modules.md#ethgetfilterchangesresult)
- [EthGetFilterLogsHandler](modules.md#ethgetfilterlogshandler)
- [EthGetFilterLogsJsonRpcProcedure](modules.md#ethgetfilterlogsjsonrpcprocedure)
- [EthGetFilterLogsJsonRpcRequest](modules.md#ethgetfilterlogsjsonrpcrequest)
- [EthGetFilterLogsJsonRpcResponse](modules.md#ethgetfilterlogsjsonrpcresponse)
- [EthGetFilterLogsParams](modules.md#ethgetfilterlogsparams)
- [EthGetFilterLogsResult](modules.md#ethgetfilterlogsresult)
- [EthGetLogsHandler](modules.md#ethgetlogshandler)
- [EthGetLogsJsonRpcProcedure](modules.md#ethgetlogsjsonrpcprocedure)
- [EthGetLogsJsonRpcRequest](modules.md#ethgetlogsjsonrpcrequest)
- [EthGetLogsJsonRpcResponse](modules.md#ethgetlogsjsonrpcresponse)
- [EthGetLogsParams](modules.md#ethgetlogsparams)
- [EthGetLogsResult](modules.md#ethgetlogsresult)
- [EthGetStorageAtHandler](modules.md#ethgetstorageathandler)
- [EthGetStorageAtJsonRpcProcedure](modules.md#ethgetstorageatjsonrpcprocedure)
- [EthGetStorageAtJsonRpcRequest](modules.md#ethgetstorageatjsonrpcrequest)
- [EthGetStorageAtJsonRpcResponse](modules.md#ethgetstorageatjsonrpcresponse)
- [EthGetStorageAtParams](modules.md#ethgetstorageatparams)
- [EthGetStorageAtResult](modules.md#ethgetstorageatresult)
- [EthGetTransactionByBlockHashAndIndexHandler](modules.md#ethgettransactionbyblockhashandindexhandler)
- [EthGetTransactionByBlockHashAndIndexJsonRpcProcedure](modules.md#ethgettransactionbyblockhashandindexjsonrpcprocedure)
- [EthGetTransactionByBlockHashAndIndexJsonRpcRequest](modules.md#ethgettransactionbyblockhashandindexjsonrpcrequest)
- [EthGetTransactionByBlockHashAndIndexJsonRpcResponse](modules.md#ethgettransactionbyblockhashandindexjsonrpcresponse)
- [EthGetTransactionByBlockHashAndIndexParams](modules.md#ethgettransactionbyblockhashandindexparams)
- [EthGetTransactionByBlockHashAndIndexResult](modules.md#ethgettransactionbyblockhashandindexresult)
- [EthGetTransactionByBlockNumberAndIndexHandler](modules.md#ethgettransactionbyblocknumberandindexhandler)
- [EthGetTransactionByBlockNumberAndIndexJsonRpcProcedure](modules.md#ethgettransactionbyblocknumberandindexjsonrpcprocedure)
- [EthGetTransactionByBlockNumberAndIndexJsonRpcRequest](modules.md#ethgettransactionbyblocknumberandindexjsonrpcrequest)
- [EthGetTransactionByBlockNumberAndIndexJsonRpcResponse](modules.md#ethgettransactionbyblocknumberandindexjsonrpcresponse)
- [EthGetTransactionByBlockNumberAndIndexParams](modules.md#ethgettransactionbyblocknumberandindexparams)
- [EthGetTransactionByBlockNumberAndIndexResult](modules.md#ethgettransactionbyblocknumberandindexresult)
- [EthGetTransactionByHashHandler](modules.md#ethgettransactionbyhashhandler)
- [EthGetTransactionByHashJsonRpcProcedure](modules.md#ethgettransactionbyhashjsonrpcprocedure)
- [EthGetTransactionByHashJsonRpcRequest](modules.md#ethgettransactionbyhashjsonrpcrequest)
- [EthGetTransactionByHashJsonRpcResponse](modules.md#ethgettransactionbyhashjsonrpcresponse)
- [EthGetTransactionByHashParams](modules.md#ethgettransactionbyhashparams)
- [EthGetTransactionByHashResult](modules.md#ethgettransactionbyhashresult)
- [EthGetTransactionCountHandler](modules.md#ethgettransactioncounthandler)
- [EthGetTransactionCountJsonRpcProcedure](modules.md#ethgettransactioncountjsonrpcprocedure)
- [EthGetTransactionCountJsonRpcRequest](modules.md#ethgettransactioncountjsonrpcrequest)
- [EthGetTransactionCountJsonRpcResponse](modules.md#ethgettransactioncountjsonrpcresponse)
- [EthGetTransactionCountParams](modules.md#ethgettransactioncountparams)
- [EthGetTransactionCountResult](modules.md#ethgettransactioncountresult)
- [EthGetTransactionReceiptHandler](modules.md#ethgettransactionreceipthandler)
- [EthGetTransactionReceiptJsonRpcProcedure](modules.md#ethgettransactionreceiptjsonrpcprocedure)
- [EthGetTransactionReceiptJsonRpcRequest](modules.md#ethgettransactionreceiptjsonrpcrequest)
- [EthGetTransactionReceiptJsonRpcResponse](modules.md#ethgettransactionreceiptjsonrpcresponse)
- [EthGetTransactionReceiptParams](modules.md#ethgettransactionreceiptparams)
- [EthGetTransactionReceiptResult](modules.md#ethgettransactionreceiptresult)
- [EthGetUncleByBlockHashAndIndexHandler](modules.md#ethgetunclebyblockhashandindexhandler)
- [EthGetUncleByBlockHashAndIndexJsonRpcProcedure](modules.md#ethgetunclebyblockhashandindexjsonrpcprocedure)
- [EthGetUncleByBlockHashAndIndexJsonRpcRequest](modules.md#ethgetunclebyblockhashandindexjsonrpcrequest)
- [EthGetUncleByBlockHashAndIndexJsonRpcResponse](modules.md#ethgetunclebyblockhashandindexjsonrpcresponse)
- [EthGetUncleByBlockHashAndIndexParams](modules.md#ethgetunclebyblockhashandindexparams)
- [EthGetUncleByBlockHashAndIndexResult](modules.md#ethgetunclebyblockhashandindexresult)
- [EthGetUncleByBlockNumberAndIndexHandler](modules.md#ethgetunclebyblocknumberandindexhandler)
- [EthGetUncleByBlockNumberAndIndexJsonRpcProcedure](modules.md#ethgetunclebyblocknumberandindexjsonrpcprocedure)
- [EthGetUncleByBlockNumberAndIndexJsonRpcRequest](modules.md#ethgetunclebyblocknumberandindexjsonrpcrequest)
- [EthGetUncleByBlockNumberAndIndexJsonRpcResponse](modules.md#ethgetunclebyblocknumberandindexjsonrpcresponse)
- [EthGetUncleByBlockNumberAndIndexParams](modules.md#ethgetunclebyblocknumberandindexparams)
- [EthGetUncleByBlockNumberAndIndexResult](modules.md#ethgetunclebyblocknumberandindexresult)
- [EthGetUncleCountByBlockHashHandler](modules.md#ethgetunclecountbyblockhashhandler)
- [EthGetUncleCountByBlockHashJsonRpcProcedure](modules.md#ethgetunclecountbyblockhashjsonrpcprocedure)
- [EthGetUncleCountByBlockHashJsonRpcRequest](modules.md#ethgetunclecountbyblockhashjsonrpcrequest)
- [EthGetUncleCountByBlockHashJsonRpcResponse](modules.md#ethgetunclecountbyblockhashjsonrpcresponse)
- [EthGetUncleCountByBlockHashParams](modules.md#ethgetunclecountbyblockhashparams)
- [EthGetUncleCountByBlockHashResult](modules.md#ethgetunclecountbyblockhashresult)
- [EthGetUncleCountByBlockNumberHandler](modules.md#ethgetunclecountbyblocknumberhandler)
- [EthGetUncleCountByBlockNumberJsonRpcProcedure](modules.md#ethgetunclecountbyblocknumberjsonrpcprocedure)
- [EthGetUncleCountByBlockNumberJsonRpcRequest](modules.md#ethgetunclecountbyblocknumberjsonrpcrequest)
- [EthGetUncleCountByBlockNumberJsonRpcResponse](modules.md#ethgetunclecountbyblocknumberjsonrpcresponse)
- [EthGetUncleCountByBlockNumberParams](modules.md#ethgetunclecountbyblocknumberparams)
- [EthGetUncleCountByBlockNumberResult](modules.md#ethgetunclecountbyblocknumberresult)
- [EthHashrateHandler](modules.md#ethhashratehandler)
- [EthHashrateJsonRpcProcedure](modules.md#ethhashratejsonrpcprocedure)
- [EthHashrateJsonRpcRequest](modules.md#ethhashratejsonrpcrequest)
- [EthHashrateJsonRpcResponse](modules.md#ethhashratejsonrpcresponse)
- [EthHashrateParams](modules.md#ethhashrateparams)
- [EthHashrateResult](modules.md#ethhashrateresult)
- [EthJsonRpcRequestHandler](modules.md#ethjsonrpcrequesthandler)
- [EthMiningHandler](modules.md#ethmininghandler)
- [EthMiningJsonRpcProcedure](modules.md#ethminingjsonrpcprocedure)
- [EthMiningJsonRpcRequest](modules.md#ethminingjsonrpcrequest)
- [EthMiningJsonRpcResponse](modules.md#ethminingjsonrpcresponse)
- [EthMiningParams](modules.md#ethminingparams)
- [EthMiningResult](modules.md#ethminingresult)
- [EthNewBlockFilterHandler](modules.md#ethnewblockfilterhandler)
- [EthNewBlockFilterJsonRpcProcedure](modules.md#ethnewblockfilterjsonrpcprocedure)
- [EthNewBlockFilterJsonRpcRequest](modules.md#ethnewblockfilterjsonrpcrequest)
- [EthNewBlockFilterJsonRpcResponse](modules.md#ethnewblockfilterjsonrpcresponse)
- [EthNewBlockFilterParams](modules.md#ethnewblockfilterparams)
- [EthNewBlockFilterResult](modules.md#ethnewblockfilterresult)
- [EthNewFilterHandler](modules.md#ethnewfilterhandler)
- [EthNewFilterJsonRpcProcedure](modules.md#ethnewfilterjsonrpcprocedure)
- [EthNewFilterJsonRpcRequest](modules.md#ethnewfilterjsonrpcrequest)
- [EthNewFilterJsonRpcResponse](modules.md#ethnewfilterjsonrpcresponse)
- [EthNewFilterParams](modules.md#ethnewfilterparams)
- [EthNewFilterResult](modules.md#ethnewfilterresult)
- [EthNewPendingTransactionFilterHandler](modules.md#ethnewpendingtransactionfilterhandler)
- [EthNewPendingTransactionFilterJsonRpcProcedure](modules.md#ethnewpendingtransactionfilterjsonrpcprocedure)
- [EthNewPendingTransactionFilterJsonRpcRequest](modules.md#ethnewpendingtransactionfilterjsonrpcrequest)
- [EthNewPendingTransactionFilterJsonRpcResponse](modules.md#ethnewpendingtransactionfilterjsonrpcresponse)
- [EthNewPendingTransactionFilterParams](modules.md#ethnewpendingtransactionfilterparams)
- [EthNewPendingTransactionFilterResult](modules.md#ethnewpendingtransactionfilterresult)
- [EthParams](modules.md#ethparams)
- [EthProtocolVersionHandler](modules.md#ethprotocolversionhandler)
- [EthProtocolVersionJsonRpcProcedure](modules.md#ethprotocolversionjsonrpcprocedure)
- [EthProtocolVersionJsonRpcRequest](modules.md#ethprotocolversionjsonrpcrequest)
- [EthProtocolVersionJsonRpcResponse](modules.md#ethprotocolversionjsonrpcresponse)
- [EthProtocolVersionParams](modules.md#ethprotocolversionparams)
- [EthProtocolVersionResult](modules.md#ethprotocolversionresult)
- [EthSendRawTransactionHandler](modules.md#ethsendrawtransactionhandler)
- [EthSendRawTransactionJsonRpcProcedure](modules.md#ethsendrawtransactionjsonrpcprocedure)
- [EthSendRawTransactionJsonRpcRequest](modules.md#ethsendrawtransactionjsonrpcrequest)
- [EthSendRawTransactionJsonRpcResponse](modules.md#ethsendrawtransactionjsonrpcresponse)
- [EthSendRawTransactionParams](modules.md#ethsendrawtransactionparams)
- [EthSendRawTransactionResult](modules.md#ethsendrawtransactionresult)
- [EthSendTransactionHandler](modules.md#ethsendtransactionhandler)
- [EthSendTransactionJsonRpcProcedure](modules.md#ethsendtransactionjsonrpcprocedure)
- [EthSendTransactionJsonRpcRequest](modules.md#ethsendtransactionjsonrpcrequest)
- [EthSendTransactionJsonRpcResponse](modules.md#ethsendtransactionjsonrpcresponse)
- [EthSendTransactionParams](modules.md#ethsendtransactionparams)
- [EthSendTransactionResult](modules.md#ethsendtransactionresult)
- [EthSignHandler](modules.md#ethsignhandler)
- [EthSignJsonRpcProcedure](modules.md#ethsignjsonrpcprocedure)
- [EthSignJsonRpcRequest](modules.md#ethsignjsonrpcrequest)
- [EthSignJsonRpcResponse](modules.md#ethsignjsonrpcresponse)
- [EthSignParams](modules.md#ethsignparams)
- [EthSignResult](modules.md#ethsignresult)
- [EthSignTransactionHandler](modules.md#ethsigntransactionhandler)
- [EthSignTransactionJsonRpcProcedure](modules.md#ethsigntransactionjsonrpcprocedure)
- [EthSignTransactionJsonRpcRequest](modules.md#ethsigntransactionjsonrpcrequest)
- [EthSignTransactionJsonRpcResponse](modules.md#ethsigntransactionjsonrpcresponse)
- [EthSignTransactionParams](modules.md#ethsigntransactionparams)
- [EthSignTransactionResult](modules.md#ethsigntransactionresult)
- [EthSyncingHandler](modules.md#ethsyncinghandler)
- [EthSyncingJsonRpcProcedure](modules.md#ethsyncingjsonrpcprocedure)
- [EthSyncingJsonRpcRequest](modules.md#ethsyncingjsonrpcrequest)
- [EthSyncingJsonRpcResponse](modules.md#ethsyncingjsonrpcresponse)
- [EthSyncingParams](modules.md#ethsyncingparams)
- [EthSyncingResult](modules.md#ethsyncingresult)
- [EthUninstallFilterHandler](modules.md#ethuninstallfilterhandler)
- [EthUninstallFilterJsonRpcProcedure](modules.md#ethuninstallfilterjsonrpcprocedure)
- [EthUninstallFilterJsonRpcRequest](modules.md#ethuninstallfilterjsonrpcrequest)
- [EthUninstallFilterJsonRpcResponse](modules.md#ethuninstallfilterjsonrpcresponse)
- [EthUninstallFilterParams](modules.md#ethuninstallfilterparams)
- [EthUninstallFilterResult](modules.md#ethuninstallfilterresult)
- [EvmError](modules.md#evmerror)
- [FilterLog](modules.md#filterlog)
- [InvalidAddressError](modules.md#invalidaddresserror)
- [InvalidBalanceError](modules.md#invalidbalanceerror)
- [InvalidBlobVersionedHashesError](modules.md#invalidblobversionedhasheserror)
- [InvalidBlockError](modules.md#invalidblockerror)
- [InvalidBytecodeError](modules.md#invalidbytecodeerror)
- [InvalidCallerError](modules.md#invalidcallererror)
- [InvalidDataError](modules.md#invaliddataerror)
- [InvalidDeployedBytecodeError](modules.md#invaliddeployedbytecodeerror)
- [InvalidDepthError](modules.md#invaliddeptherror)
- [InvalidFunctionNameError](modules.md#invalidfunctionnameerror)
- [InvalidGasLimitError](modules.md#invalidgaslimiterror)
- [InvalidGasPriceError](modules.md#invalidgaspriceerror)
- [InvalidGasRefundError](modules.md#invalidgasrefunderror)
- [InvalidNonceError](modules.md#invalidnonceerror)
- [InvalidOriginError](modules.md#invalidoriginerror)
- [InvalidRequestError](modules.md#invalidrequesterror)
- [InvalidSaltError](modules.md#invalidsalterror)
- [InvalidSelfdestructError](modules.md#invalidselfdestructerror)
- [InvalidSkipBalanceError](modules.md#invalidskipbalanceerror)
- [InvalidStorageRootError](modules.md#invalidstoragerooterror)
- [InvalidToError](modules.md#invalidtoerror)
- [InvalidValueError](modules.md#invalidvalueerror)
- [JsonRpcRequest](modules.md#jsonrpcrequest)
- [JsonRpcResponse](modules.md#jsonrpcresponse)
- [Log](modules.md#log)
- [ScriptError](modules.md#scripterror)
- [ScriptHandler](modules.md#scripthandler)
- [ScriptJsonRpcProcedure](modules.md#scriptjsonrpcprocedure)
- [ScriptJsonRpcRequest](modules.md#scriptjsonrpcrequest)
- [ScriptJsonRpcResponse](modules.md#scriptjsonrpcresponse)
- [ScriptParams](modules.md#scriptparams)
- [ScriptResult](modules.md#scriptresult)
- [Tevm](modules.md#tevm)
- [TevmEVMErrorMessage](modules.md#tevmevmerrormessage)
- [TevmJsonRpcRequest](modules.md#tevmjsonrpcrequest)
- [TevmJsonRpcRequestHandler](modules.md#tevmjsonrpcrequesthandler)
- [TransactionParams](modules.md#transactionparams)
- [TransactionReceiptResult](modules.md#transactionreceiptresult)
- [TransactionResult](modules.md#transactionresult)
- [TypedError](modules.md#typederror)
- [UnexpectedError](modules.md#unexpectederror)

## Type Aliases

### AccountError

Ƭ **AccountError**: [`InvalidAddressError`](modules.md#invalidaddresserror) \| [`InvalidBalanceError`](modules.md#invalidbalanceerror) \| [`InvalidNonceError`](modules.md#invalidnonceerror) \| [`InvalidStorageRootError`](modules.md#invalidstoragerooterror) \| [`InvalidBytecodeError`](modules.md#invalidbytecodeerror) \| [`InvalidRequestError`](modules.md#invalidrequesterror) \| [`UnexpectedError`](modules.md#unexpectederror)

Errors returned by account tevm procedure

**`Example`**

```ts
const {errors} = await tevm.account({address: '0x1234'})

if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
  console.log(errors[0].message) // Invalid address: 0x1234
}
```

#### Defined in

[errors/AccountError.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/AccountError.ts#L19)

___

### AccountHandler

Ƭ **AccountHandler**: (`params`: [`AccountParams`](modules.md#accountparams)) => `Promise`\<[`AccountResult`](modules.md#accountresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AccountResult`](modules.md#accountresult)\>

Handler for account tevm procedure

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AccountParams`](modules.md#accountparams) |

##### Returns

`Promise`\<[`AccountResult`](modules.md#accountresult)\>

#### Defined in

[handlers/AccountHandler.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AccountHandler.ts#L6)

___

### AccountJsonRpcProcedure

Ƭ **AccountJsonRpcProcedure**: (`request`: [`AccountJsonRpcRequest`](modules.md#accountjsonrpcrequest)) => `Promise`\<[`AccountJsonRpcResponse`](modules.md#accountjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AccountJsonRpcResponse`](modules.md#accountjsonrpcresponse)\>

Account JSON-RPC tevm procedure puts an account or contract into the tevm state

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AccountJsonRpcRequest`](modules.md#accountjsonrpcrequest) |

##### Returns

`Promise`\<[`AccountJsonRpcResponse`](modules.md#accountjsonrpcresponse)\>

#### Defined in

[procedure/AccountJsonRpcProcedure.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AccountJsonRpcProcedure.ts#L6)

___

### AccountJsonRpcRequest

Ƭ **AccountJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"tevm_account"``, `SerializeToJson`\<[`AccountParams`](modules.md#accountparams)\>\>

JSON-RPC request for `tevm_account` method

#### Defined in

[requests/AccountJsonRpcRequest.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AccountJsonRpcRequest.ts#L8)

___

### AccountJsonRpcResponse

Ƭ **AccountJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"tevm_account"``, `SerializeToJson`\<[`AccountResult`](modules.md#accountresult)\>, [`AccountError`](modules.md#accounterror)[``"_tag"``]\>

JSON-RPC response for `tevm_account` procedure

#### Defined in

[responses/AccountJsonRpcResponse.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AccountJsonRpcResponse.ts#L8)

___

### AccountParams

Ƭ **AccountParams**: `Object`

Tevm params to put an account into the vm state

**`Example`**

```ts
// all fields are optional except address
const accountParams: import('@tevm/api').AccountParams = {
  account: '0x...',
  nonce: 5n,
  balance: 9000000000000n,
  storageRoot: '0x....',
  deployedBytecode: '0x....'
}
```

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of account |
| `balance?` | `bigint` | Balance to set account to |
| `deployedBytecode?` | `Hex` | Contract bytecode to set account to |
| `nonce?` | `bigint` | Nonce to set account to |
| `storageRoot?` | `Hex` | Storage root to set account to |

#### Defined in

[params/AccountParams.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AccountParams.ts#L16)

___

### AccountResult

Ƭ **AccountResult**\<`ErrorType`\>: `Object`

Result of Account Action

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ErrorType` | [`AccountError`](modules.md#accounterror) |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `errors?` | `ErrorType`[] | Description of the exception, if any occurred |

#### Defined in

[result/AccountResult.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AccountResult.ts#L6)

___

### BaseCallError

Ƭ **BaseCallError**: [`EvmError`](modules.md#evmerror) \| [`InvalidRequestError`](modules.md#invalidrequesterror) \| [`InvalidAddressError`](modules.md#invalidaddresserror) \| [`InvalidBalanceError`](modules.md#invalidbalanceerror) \| [`InvalidBlobVersionedHashesError`](modules.md#invalidblobversionedhasheserror) \| [`InvalidBlockError`](modules.md#invalidblockerror) \| [`InvalidCallerError`](modules.md#invalidcallererror) \| [`InvalidDepthError`](modules.md#invaliddeptherror) \| [`InvalidGasLimitError`](modules.md#invalidgaslimiterror) \| [`InvalidGasPriceError`](modules.md#invalidgaspriceerror) \| [`InvalidGasRefundError`](modules.md#invalidgasrefunderror) \| [`InvalidNonceError`](modules.md#invalidnonceerror) \| [`InvalidOriginError`](modules.md#invalidoriginerror) \| [`InvalidSelfdestructError`](modules.md#invalidselfdestructerror) \| [`InvalidSkipBalanceError`](modules.md#invalidskipbalanceerror) \| [`InvalidStorageRootError`](modules.md#invalidstoragerooterror) \| [`InvalidToError`](modules.md#invalidtoerror) \| [`InvalidValueError`](modules.md#invalidvalueerror) \| [`UnexpectedError`](modules.md#unexpectederror)

Errors returned by all call based tevm procedures including call, contract, and script

#### Defined in

[errors/BaseCallError.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/BaseCallError.ts#L24)

___

### BaseCallParams

Ƭ **BaseCallParams**: `Object`

Properties shared accross call-like params

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `blobVersionedHashes?` | `Hex`[] | Versioned hashes for each blob in a blob transaction |
| `block?` | `Partial`\<[`Block`](modules.md#block)\> | The `block` the `tx` belongs to. If omitted a default blank block will be used. |
| `caller?` | `Address` | The address that ran this code (`msg.sender`). Defaults to the zero address. |
| `depth?` | `number` | The call depth. Defaults to `0` |
| `gasLimit?` | `bigint` | The gas limit for the call. Defaults to `16777215` (`0xffffff`) |
| `gasPrice?` | `bigint` | The gas price for the call. Defaults to `0` |
| `gasRefund?` | `bigint` | Refund counter. Defaults to `0` |
| `origin?` | `Address` | The address where the call originated from. Defaults to the zero address. |
| `selfdestruct?` | `Set`\<`Address`\> | Addresses to selfdestruct. Defaults to the empty set. |
| `skipBalance?` | `boolean` | Set caller to msg.value of less than msg.value Defaults to false exceipt for when running scripts where it is set to true |
| `to?` | `Address` | The address of the account that is executing this code (`address(this)`). Defaults to the zero address. |
| `value?` | `bigint` | The value in ether that is being sent to `opts.address`. Defaults to `0` |

#### Defined in

[params/BaseCallParams.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/BaseCallParams.ts#L7)

___

### Block

Ƭ **Block**: `Object`

Header information of an ethereum block

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseFeePerGas?` | `bigint` | (Optional) The base fee per gas in the block, introduced in EIP-1559 for dynamic transaction fee calculation. |
| `blobGasPrice?` | `bigint` | The gas price for the block; may be undefined in blocks after EIP-1559. |
| `coinbase` | `Address` | The address of the miner or validator who mined or validated the block. |
| `difficulty` | `bigint` | The difficulty level of the block (relevant in PoW chains). |
| `gasLimit` | `bigint` | The gas limit for the block, i.e., the maximum amount of gas that can be used by the transactions in the block. |
| `number` | `bigint` | The block number (height) in the blockchain. |
| `timestamp` | `bigint` | The timestamp at which the block was mined or validated. |

#### Defined in

[common/Block.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/common/Block.ts#L6)

___

### BlockResult

Ƭ **BlockResult**: `Object`

The type returned by block related
json rpc procedures

#### Type declaration

| Name | Type |
| :------ | :------ |
| `difficulty` | `Hex` |
| `extraData` | `Hex` |
| `gasLimit` | `Hex` |
| `gasUsed` | `Hex` |
| `hash` | `Hex` |
| `logsBloom` | `Hex` |
| `miner` | `Hex` |
| `nonce` | `Hex` |
| `number` | `Hex` |
| `parentHash` | `Hex` |
| `sha3Uncles` | `Hex` |
| `size` | `Hex` |
| `stateRoot` | `Hex` |
| `timestamp` | `Hex` |
| `totalDifficulty` | `Hex` |
| `transactions` | `Hex`[] |
| `transactionsRoot` | `Hex` |
| `uncles` | `Hex`[] |

#### Defined in

[common/BlockResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/common/BlockResult.ts#L7)

___

### CallError

Ƭ **CallError**: [`BaseCallError`](modules.md#basecallerror) \| [`InvalidSaltError`](modules.md#invalidsalterror) \| [`InvalidDataError`](modules.md#invaliddataerror) \| [`InvalidDeployedBytecodeError`](modules.md#invaliddeployedbytecodeerror)

Error returned by call tevm procedure

**`Example`**

```ts
const {errors} = await tevm.call({address: '0x1234'})
if (errors?.length) {
 console.log(errors[0].name) // InvalidDataError
}
```

#### Defined in

[errors/CallError.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/CallError.ts#L14)

___

### CallHandler

Ƭ **CallHandler**: (`action`: [`CallParams`](modules.md#callparams)) => `Promise`\<[`CallResult`](modules.md#callresult)\>

#### Type declaration

▸ (`action`): `Promise`\<[`CallResult`](modules.md#callresult)\>

Handler for call tevm procedure

##### Parameters

| Name | Type |
| :------ | :------ |
| `action` | [`CallParams`](modules.md#callparams) |

##### Returns

`Promise`\<[`CallResult`](modules.md#callresult)\>

#### Defined in

[handlers/CallHandler.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/CallHandler.ts#L6)

___

### CallJsonRpcProcedure

Ƭ **CallJsonRpcProcedure**: (`request`: [`CallJsonRpcRequest`](modules.md#calljsonrpcrequest)) => `Promise`\<[`CallJsonRpcResponse`](modules.md#calljsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`CallJsonRpcResponse`](modules.md#calljsonrpcresponse)\>

Call JSON-RPC procedure executes a call against the tevm EVM

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`CallJsonRpcRequest`](modules.md#calljsonrpcrequest) |

##### Returns

`Promise`\<[`CallJsonRpcResponse`](modules.md#calljsonrpcresponse)\>

#### Defined in

[procedure/CallJsonRpcProcedure.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/CallJsonRpcProcedure.ts#L6)

___

### CallJsonRpcRequest

Ƭ **CallJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"tevm_call"``, `SerializeToJson`\<[`CallParams`](modules.md#callparams)\>\>

JSON-RPC request for `tevm_call`

#### Defined in

[requests/CallJsonRpcRequest.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/CallJsonRpcRequest.ts#L8)

___

### CallJsonRpcResponse

Ƭ **CallJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"tevm_call"``, `SerializeToJson`\<[`CallResult`](modules.md#callresult)\>, [`CallError`](modules.md#callerror)[``"_tag"``]\>

JSON-RPC response for `tevm_call` procedure

#### Defined in

[responses/CallJsonRpcResponse.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/CallJsonRpcResponse.ts#L8)

___

### CallParams

Ƭ **CallParams**: [`BaseCallParams`](modules.md#basecallparams) & \{ `data?`: `Hex` ; `deployedBytecode?`: `Hex` ; `salt?`: `Hex`  }

Tevm params to execute a call on the vm
Call is the lowest level method to interact with the vm
and other messages such as contract and script are using call
under the hood

**`Example`**

```ts
const callParams: import('@tevm/api').CallParams = {
  data: '0x...',
  bytecode: '0x...',
  gasLimit: 420n,
}
```

#### Defined in

[params/CallParams.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/CallParams.ts#L16)

___

### CallResult

Ƭ **CallResult**\<`ErrorType`\>: `Object`

Result of a Tevm VM Call method

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ErrorType` | [`CallError`](modules.md#callerror) |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `blobGasUsed?` | `bigint` | Amount of blob gas consumed by the transaction |
| `createdAddress?` | `Address` | Address of created account during transaction, if any |
| `createdAddresses?` | `Set`\<`Address`\> | Map of addresses which were created (used in EIP 6780) |
| `errors?` | `ErrorType`[] | Description of the exception, if any occurred |
| `executionGasUsed` | `bigint` | Amount of gas the code used to run |
| `gas?` | `bigint` | Amount of gas left |
| `gasRefund?` | `bigint` | The gas refund counter as a uint256 |
| `logs?` | [`Log`](modules.md#log)[] | Array of logs that the contract emitted |
| `rawData` | `Hex` | Encoded return value from the contract as hex string |
| `selfdestruct?` | `Set`\<`Address`\> | A set of accounts to selfdestruct |

#### Defined in

[result/CallResult.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/CallResult.ts#L9)

___

### ContractError

Ƭ **ContractError**: [`BaseCallError`](modules.md#basecallerror) \| [`InvalidAddressError`](modules.md#invalidaddresserror) \| [`EvmError`](modules.md#evmerror) \| [`InvalidRequestError`](modules.md#invalidrequesterror) \| [`UnexpectedError`](modules.md#unexpectederror) \| `InvalidAbiError` \| [`InvalidDataError`](modules.md#invaliddataerror) \| [`InvalidFunctionNameError`](modules.md#invalidfunctionnameerror) \| `InvalidArgsError` \| `DecodeFunctionDataError` \| `EncodeFunctionReturnDataError`

Errors returned by contract tevm procedure

**`Example`**

```ts
const {errors} = await tevm.contract({address: '0x1234'})
if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
}
```

#### Defined in

[errors/ContractError.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/ContractError.ts#L21)

___

### ContractHandler

Ƭ **ContractHandler**: \<TAbi, TFunctionName\>(`action`: [`ContractParams`](modules.md#contractparams)\<`TAbi`, `TFunctionName`\>) => `Promise`\<[`ContractResult`](modules.md#contractresult)\<`TAbi`, `TFunctionName`\>\>

#### Type declaration

▸ \<`TAbi`, `TFunctionName`\>(`action`): `Promise`\<[`ContractResult`](modules.md#contractresult)\<`TAbi`, `TFunctionName`\>\>

Handler for contract tevm procedure
It's API resuses the viem `contractRead`/`contractWrite` API to encode abi, functionName, and args

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\> |

##### Parameters

| Name | Type |
| :------ | :------ |
| `action` | [`ContractParams`](modules.md#contractparams)\<`TAbi`, `TFunctionName`\> |

##### Returns

`Promise`\<[`ContractResult`](modules.md#contractresult)\<`TAbi`, `TFunctionName`\>\>

#### Defined in

[handlers/ContractHandler.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/ContractHandler.ts#L9)

___

### ContractJsonRpcProcedure

Ƭ **ContractJsonRpcProcedure**: [`CallJsonRpcRequest`](modules.md#calljsonrpcrequest)

Since ContractJsonRpcProcedure is a quality of life wrapper around CallJsonRpcProcedure
 We choose to overload the type instead of creating a new one. Tevm contract handlers encode their
 contract call as a normal call request over JSON-rpc

#### Defined in

[procedure/ContractJsonRpcProcedure.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/ContractJsonRpcProcedure.ts#L8)

___

### ContractJsonRpcRequest

Ƭ **ContractJsonRpcRequest**: [`CallJsonRpcRequest`](modules.md#calljsonrpcrequest)

Since contract calls are just a quality of life wrapper around call we avoid using tevm_contract
in favor of overloading tevm_call

#### Defined in

[requests/ContractJsonRpcRequest.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/ContractJsonRpcRequest.ts#L7)

___

### ContractJsonRpcResponse

Ƭ **ContractJsonRpcResponse**: [`CallJsonRpcResponse`](modules.md#calljsonrpcresponse)

Since contract calls are just a quality of life wrapper around call we avoid using tevm_contract
in favor of overloading tevm_call

#### Defined in

[responses/ContractJsonRpcResponse.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/ContractJsonRpcResponse.ts#L7)

___

### ContractParams

Ƭ **ContractParams**\<`TAbi`, `TFunctionName`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](modules.md#basecallparams) & \{ `to`: `Address`  }

Tevm params to execute a call on a contract

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\> |

#### Defined in

[params/ContractParams.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/ContractParams.ts#L11)

___

### ContractResult

Ƭ **ContractResult**\<`TAbi`, `TFunctionName`, `ErrorType`\>: `Omit`\<[`CallResult`](modules.md#callresult), ``"errors"``\> & \{ `data`: `DecodeFunctionResultReturnType`\<`TAbi`, `TFunctionName`\> ; `errors?`: `never`  } \| [`CallResult`](modules.md#callresult)\<`ErrorType`\> & \{ `data?`: `never`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\> |
| `ErrorType` | [`ContractError`](modules.md#contracterror) |

#### Defined in

[result/ContractResult.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/ContractResult.ts#L9)

___

### EthAccountsHandler

Ƭ **EthAccountsHandler**: (`request`: [`EthAccountsParams`](modules.md#ethaccountsparams)) => `Promise`\<[`EthAccountsResult`](modules.md#ethaccountsresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthAccountsResult`](modules.md#ethaccountsresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthAccountsParams`](modules.md#ethaccountsparams) |

##### Returns

`Promise`\<[`EthAccountsResult`](modules.md#ethaccountsresult)\>

#### Defined in

[handlers/EthHandler.ts:83](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L83)

___

### EthAccountsJsonRpcProcedure

Ƭ **EthAccountsJsonRpcProcedure**: (`request`: [`EthAccountsJsonRpcRequest`](modules.md#ethaccountsjsonrpcrequest)) => `Promise`\<[`EthAccountsJsonRpcResponse`](modules.md#ethaccountsjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthAccountsJsonRpcResponse`](modules.md#ethaccountsjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthAccountsJsonRpcRequest`](modules.md#ethaccountsjsonrpcrequest) |

##### Returns

`Promise`\<[`EthAccountsJsonRpcResponse`](modules.md#ethaccountsjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:83](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L83)

___

### EthAccountsJsonRpcRequest

Ƭ **EthAccountsJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_accounts"``, readonly []\>

JSON-RPC request for `eth_accounts` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L11)

___

### EthAccountsJsonRpcResponse

Ƭ **EthAccountsJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_accounts"``, `Address`[], `string`\>

JSON-RPC response for `eth_accounts` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L15)

___

### EthAccountsParams

Ƭ **EthAccountsParams**: `EmptyParams`

Params taken by `eth_accounts` handler

#### Defined in

[params/EthParams.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L24)

___

### EthAccountsResult

Ƭ **EthAccountsResult**: `Address`[]

#### Defined in

[result/EthResult.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L13)

___

### EthBlockNumberHandler

Ƭ **EthBlockNumberHandler**: (`request`: [`EthBlockNumberParams`](modules.md#ethblocknumberparams)) => `Promise`\<[`EthBlockNumberResult`](modules.md#ethblocknumberresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthBlockNumberResult`](modules.md#ethblocknumberresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthBlockNumberParams`](modules.md#ethblocknumberparams) |

##### Returns

`Promise`\<[`EthBlockNumberResult`](modules.md#ethblocknumberresult)\>

#### Defined in

[handlers/EthHandler.ts:87](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L87)

___

### EthBlockNumberJsonRpcProcedure

Ƭ **EthBlockNumberJsonRpcProcedure**: (`request`: [`EthBlockNumberJsonRpcRequest`](modules.md#ethblocknumberjsonrpcrequest)) => `Promise`\<[`EthBlockNumberJsonRpcResponse`](modules.md#ethblocknumberjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthBlockNumberJsonRpcResponse`](modules.md#ethblocknumberjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthBlockNumberJsonRpcRequest`](modules.md#ethblocknumberjsonrpcrequest) |

##### Returns

`Promise`\<[`EthBlockNumberJsonRpcResponse`](modules.md#ethblocknumberjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:87](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L87)

___

### EthBlockNumberJsonRpcRequest

Ƭ **EthBlockNumberJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_blockNumber"``, readonly []\>

JSON-RPC request for `eth_blockNumber` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L19)

___

### EthBlockNumberJsonRpcResponse

Ƭ **EthBlockNumberJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_blockNumber"``, `SerializeToJson`\<[`EthBlockNumberResult`](modules.md#ethblocknumberresult)\>, `string`\>

JSON-RPC response for `eth_blockNumber` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L25)

___

### EthBlockNumberParams

Ƭ **EthBlockNumberParams**: `EmptyParams`

JSON-RPC request for `eth_blockNumber` procedure

#### Defined in

[params/EthParams.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L29)

___

### EthBlockNumberResult

Ƭ **EthBlockNumberResult**: `bigint`

JSON-RPC response for `eth_blockNumber` procedure

#### Defined in

[result/EthResult.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L18)

___

### EthCallHandler

Ƭ **EthCallHandler**: (`request`: [`EthCallParams`](modules.md#ethcallparams)) => `Promise`\<[`EthCallResult`](modules.md#ethcallresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthCallResult`](modules.md#ethcallresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthCallParams`](modules.md#ethcallparams) |

##### Returns

`Promise`\<[`EthCallResult`](modules.md#ethcallresult)\>

#### Defined in

[handlers/EthHandler.ts:91](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L91)

___

### EthCallJsonRpcProcedure

Ƭ **EthCallJsonRpcProcedure**: (`request`: [`EthCallJsonRpcRequest`](modules.md#ethcalljsonrpcrequest)) => `Promise`\<[`EthCallJsonRpcResponse`](modules.md#ethcalljsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthCallJsonRpcResponse`](modules.md#ethcalljsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthCallJsonRpcRequest`](modules.md#ethcalljsonrpcrequest) |

##### Returns

`Promise`\<[`EthCallJsonRpcResponse`](modules.md#ethcalljsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:91](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L91)

___

### EthCallJsonRpcRequest

Ƭ **EthCallJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_call"``, readonly [tx: Transaction, tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_call` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L27)

___

### EthCallJsonRpcResponse

Ƭ **EthCallJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_call"``, `Hex`, `string`\>

JSON-RPC response for `eth_call` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L35)

___

### EthCallParams

Ƭ **EthCallParams**: `CallParameters`

JSON-RPC request for `eth_call` procedure

#### Defined in

[params/EthParams.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L34)

___

### EthCallResult

Ƭ **EthCallResult**: `Hex`

JSON-RPC response for `eth_call` procedure

#### Defined in

[result/EthResult.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L24)

___

### EthChainIdHandler

Ƭ **EthChainIdHandler**: (`request`: [`EthChainIdParams`](modules.md#ethchainidparams)) => `Promise`\<[`EthChainIdResult`](modules.md#ethchainidresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthChainIdResult`](modules.md#ethchainidresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthChainIdParams`](modules.md#ethchainidparams) |

##### Returns

`Promise`\<[`EthChainIdResult`](modules.md#ethchainidresult)\>

#### Defined in

[handlers/EthHandler.ts:93](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L93)

___

### EthChainIdJsonRpcProcedure

Ƭ **EthChainIdJsonRpcProcedure**: (`request`: [`EthChainIdJsonRpcRequest`](modules.md#ethchainidjsonrpcrequest)) => `Promise`\<[`EthChainIdJsonRpcResponse`](modules.md#ethchainidjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthChainIdJsonRpcResponse`](modules.md#ethchainidjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthChainIdJsonRpcRequest`](modules.md#ethchainidjsonrpcrequest) |

##### Returns

`Promise`\<[`EthChainIdJsonRpcResponse`](modules.md#ethchainidjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:95](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L95)

___

### EthChainIdJsonRpcRequest

Ƭ **EthChainIdJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_chainId"``, readonly []\>

JSON-RPC request for `eth_chainId` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L35)

___

### EthChainIdJsonRpcResponse

Ƭ **EthChainIdJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_chainId"``, `Hex`, `string`\>

JSON-RPC response for `eth_chainId` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L41)

___

### EthChainIdParams

Ƭ **EthChainIdParams**: `EmptyParams`

JSON-RPC request for `eth_chainId` procedure

#### Defined in

[params/EthParams.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L39)

___

### EthChainIdResult

Ƭ **EthChainIdResult**: `Hex`

JSON-RPC response for `eth_chainId` procedure

#### Defined in

[result/EthResult.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L30)

___

### EthCoinbaseHandler

Ƭ **EthCoinbaseHandler**: (`request`: [`EthCoinbaseParams`](modules.md#ethcoinbaseparams)) => `Promise`\<[`EthCoinbaseResult`](modules.md#ethcoinbaseresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthCoinbaseResult`](modules.md#ethcoinbaseresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthCoinbaseParams`](modules.md#ethcoinbaseparams) |

##### Returns

`Promise`\<[`EthCoinbaseResult`](modules.md#ethcoinbaseresult)\>

#### Defined in

[handlers/EthHandler.ts:97](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L97)

___

### EthCoinbaseJsonRpcProcedure

Ƭ **EthCoinbaseJsonRpcProcedure**: (`request`: [`EthCoinbaseJsonRpcRequest`](modules.md#ethcoinbasejsonrpcrequest)) => `Promise`\<[`EthCoinbaseJsonRpcResponse`](modules.md#ethcoinbasejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthCoinbaseJsonRpcResponse`](modules.md#ethcoinbasejsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthCoinbaseJsonRpcRequest`](modules.md#ethcoinbasejsonrpcrequest) |

##### Returns

`Promise`\<[`EthCoinbaseJsonRpcResponse`](modules.md#ethcoinbasejsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:99](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L99)

___

### EthCoinbaseJsonRpcRequest

Ƭ **EthCoinbaseJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_coinbase"``, readonly []\>

JSON-RPC request for `eth_coinbase` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:43](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L43)

___

### EthCoinbaseJsonRpcResponse

Ƭ **EthCoinbaseJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_coinbase"``, `Hex`, `string`\>

JSON-RPC response for `eth_coinbase` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L51)

___

### EthCoinbaseParams

Ƭ **EthCoinbaseParams**: `EmptyParams`

JSON-RPC request for `eth_coinbase` procedure

#### Defined in

[params/EthParams.ts:44](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L44)

___

### EthCoinbaseResult

Ƭ **EthCoinbaseResult**: `Hex`

JSON-RPC response for `eth_coinbase` procedure

#### Defined in

[result/EthResult.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L36)

___

### EthEstimateGasHandler

Ƭ **EthEstimateGasHandler**: (`request`: [`EthEstimateGasParams`](modules.md#ethestimategasparams)) => `Promise`\<[`EthEstimateGasResult`](modules.md#ethestimategasresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthEstimateGasResult`](modules.md#ethestimategasresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthEstimateGasParams`](modules.md#ethestimategasparams) |

##### Returns

`Promise`\<[`EthEstimateGasResult`](modules.md#ethestimategasresult)\>

#### Defined in

[handlers/EthHandler.ts:101](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L101)

___

### EthEstimateGasJsonRpcProcedure

Ƭ **EthEstimateGasJsonRpcProcedure**: (`request`: [`EthEstimateGasJsonRpcRequest`](modules.md#ethestimategasjsonrpcrequest)) => `Promise`\<[`EthEstimateGasJsonRpcResponse`](modules.md#ethestimategasjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthEstimateGasJsonRpcResponse`](modules.md#ethestimategasjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthEstimateGasJsonRpcRequest`](modules.md#ethestimategasjsonrpcrequest) |

##### Returns

`Promise`\<[`EthEstimateGasJsonRpcResponse`](modules.md#ethestimategasjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:103](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L103)

___

### EthEstimateGasJsonRpcRequest

Ƭ **EthEstimateGasJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_estimateGas"``, readonly [tx: Transaction]\>

JSON-RPC request for `eth_estimateGas` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L51)

___

### EthEstimateGasJsonRpcResponse

Ƭ **EthEstimateGasJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_estimateGas"``, `Hex`, `string`\>

JSON-RPC response for `eth_estimateGas` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:61](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L61)

___

### EthEstimateGasParams

Ƭ **EthEstimateGasParams**: `EstimateGasParameters`

JSON-RPC request for `eth_estimateGas` procedure

#### Defined in

[params/EthParams.ts:49](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L49)

___

### EthEstimateGasResult

Ƭ **EthEstimateGasResult**: `Hex`

JSON-RPC response for `eth_estimateGas` procedure

#### Defined in

[result/EthResult.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L42)

___

### EthGasPriceHandler

Ƭ **EthGasPriceHandler**: (`request`: [`EthGasPriceParams`](modules.md#ethgaspriceparams)) => `Promise`\<[`EthGasPriceResult`](modules.md#ethgaspriceresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGasPriceResult`](modules.md#ethgaspriceresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGasPriceParams`](modules.md#ethgaspriceparams) |

##### Returns

`Promise`\<[`EthGasPriceResult`](modules.md#ethgaspriceresult)\>

#### Defined in

[handlers/EthHandler.ts:109](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L109)

___

### EthGasPriceJsonRpcProcedure

Ƭ **EthGasPriceJsonRpcProcedure**: (`request`: [`EthGasPriceJsonRpcRequest`](modules.md#ethgaspricejsonrpcrequest)) => `Promise`\<[`EthGasPriceJsonRpcResponse`](modules.md#ethgaspricejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGasPriceJsonRpcResponse`](modules.md#ethgaspricejsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGasPriceJsonRpcRequest`](modules.md#ethgaspricejsonrpcrequest) |

##### Returns

`Promise`\<[`EthGasPriceJsonRpcResponse`](modules.md#ethgaspricejsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:111](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L111)

___

### EthGasPriceJsonRpcRequest

Ƭ **EthGasPriceJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_gasPrice"``, readonly []\>

JSON-RPC request for `eth_gasPrice` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:67](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L67)

___

### EthGasPriceJsonRpcResponse

Ƭ **EthGasPriceJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_gasPrice"``, `Hex`, `string`\>

JSON-RPC response for `eth_gasPrice` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:81](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L81)

___

### EthGasPriceParams

Ƭ **EthGasPriceParams**: `EmptyParams`

JSON-RPC request for `eth_gasPrice` procedure

#### Defined in

[params/EthParams.ts:59](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L59)

___

### EthGasPriceResult

Ƭ **EthGasPriceResult**: `Hex`

JSON-RPC response for `eth_gasPrice` procedure

#### Defined in

[result/EthResult.ts:54](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L54)

___

### EthGetBalanceHandler

Ƭ **EthGetBalanceHandler**: (`request`: [`EthGetBalanceParams`](modules.md#ethgetbalanceparams)) => `Promise`\<[`EthGetBalanceResult`](modules.md#ethgetbalanceresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBalanceResult`](modules.md#ethgetbalanceresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBalanceParams`](modules.md#ethgetbalanceparams) |

##### Returns

`Promise`\<[`EthGetBalanceResult`](modules.md#ethgetbalanceresult)\>

#### Defined in

[handlers/EthHandler.ts:113](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L113)

___

### EthGetBalanceJsonRpcProcedure

Ƭ **EthGetBalanceJsonRpcProcedure**: (`request`: [`EthGetBalanceJsonRpcRequest`](modules.md#ethgetbalancejsonrpcrequest)) => `Promise`\<[`EthGetBalanceJsonRpcResponse`](modules.md#ethgetbalancejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBalanceJsonRpcResponse`](modules.md#ethgetbalancejsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBalanceJsonRpcRequest`](modules.md#ethgetbalancejsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetBalanceJsonRpcResponse`](modules.md#ethgetbalancejsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:115](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L115)

___

### EthGetBalanceJsonRpcRequest

Ƭ **EthGetBalanceJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_getBalance"``, [address: Address, tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_getBalance` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:75](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L75)

___

### EthGetBalanceJsonRpcResponse

Ƭ **EthGetBalanceJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_getBalance"``, `Hex`, `string`\>

JSON-RPC response for `eth_getBalance` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:91](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L91)

___

### EthGetBalanceParams

Ƭ **EthGetBalanceParams**: `GetBalanceParameters`

JSON-RPC request for `eth_getBalance` procedure

#### Defined in

[params/EthParams.ts:64](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L64)

___

### EthGetBalanceResult

Ƭ **EthGetBalanceResult**: `Hex`

JSON-RPC response for `eth_getBalance` procedure

#### Defined in

[result/EthResult.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L60)

___

### EthGetBlockByHashHandler

Ƭ **EthGetBlockByHashHandler**: (`request`: [`EthGetBlockByHashParams`](modules.md#ethgetblockbyhashparams)) => `Promise`\<[`EthGetBlockByHashResult`](modules.md#ethgetblockbyhashresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBlockByHashResult`](modules.md#ethgetblockbyhashresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBlockByHashParams`](modules.md#ethgetblockbyhashparams) |

##### Returns

`Promise`\<[`EthGetBlockByHashResult`](modules.md#ethgetblockbyhashresult)\>

#### Defined in

[handlers/EthHandler.ts:117](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L117)

___

### EthGetBlockByHashJsonRpcProcedure

Ƭ **EthGetBlockByHashJsonRpcProcedure**: (`request`: [`EthGetBlockByHashJsonRpcRequest`](modules.md#ethgetblockbyhashjsonrpcrequest)) => `Promise`\<[`EthGetBlockByHashJsonRpcResponse`](modules.md#ethgetblockbyhashjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBlockByHashJsonRpcResponse`](modules.md#ethgetblockbyhashjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBlockByHashJsonRpcRequest`](modules.md#ethgetblockbyhashjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetBlockByHashJsonRpcResponse`](modules.md#ethgetblockbyhashjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:119](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L119)

___

### EthGetBlockByHashJsonRpcRequest

Ƭ **EthGetBlockByHashJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_getBlockByHash"``, readonly [blockHash: Hex, fullTransactionObjects: boolean]\>

JSON-RPC request for `eth_getBlockByHash` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:83](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L83)

___

### EthGetBlockByHashJsonRpcResponse

Ƭ **EthGetBlockByHashJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_getBlockByHash"``, [`BlockResult`](modules.md#blockresult), `string`\>

JSON-RPC response for `eth_getBlockByHash` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:101](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L101)

___

### EthGetBlockByHashParams

Ƭ **EthGetBlockByHashParams**: `Object`

JSON-RPC request for `eth_getBlockByHash` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockHash` | `Hex` |
| `fullTransactionObjects` | `boolean` |

#### Defined in

[params/EthParams.ts:69](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L69)

___

### EthGetBlockByHashResult

Ƭ **EthGetBlockByHashResult**: [`BlockResult`](modules.md#blockresult)

JSON-RPC response for `eth_getBlockByHash` procedure

#### Defined in

[result/EthResult.ts:66](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L66)

___

### EthGetBlockByNumberHandler

Ƭ **EthGetBlockByNumberHandler**: (`request`: [`EthGetBlockByNumberParams`](modules.md#ethgetblockbynumberparams)) => `Promise`\<[`EthGetBlockByNumberResult`](modules.md#ethgetblockbynumberresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBlockByNumberResult`](modules.md#ethgetblockbynumberresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBlockByNumberParams`](modules.md#ethgetblockbynumberparams) |

##### Returns

`Promise`\<[`EthGetBlockByNumberResult`](modules.md#ethgetblockbynumberresult)\>

#### Defined in

[handlers/EthHandler.ts:121](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L121)

___

### EthGetBlockByNumberJsonRpcProcedure

Ƭ **EthGetBlockByNumberJsonRpcProcedure**: (`request`: [`EthGetBlockByNumberJsonRpcRequest`](modules.md#ethgetblockbynumberjsonrpcrequest)) => `Promise`\<[`EthGetBlockByNumberJsonRpcResponse`](modules.md#ethgetblockbynumberjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBlockByNumberJsonRpcResponse`](modules.md#ethgetblockbynumberjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBlockByNumberJsonRpcRequest`](modules.md#ethgetblockbynumberjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetBlockByNumberJsonRpcResponse`](modules.md#ethgetblockbynumberjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:123](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L123)

___

### EthGetBlockByNumberJsonRpcRequest

Ƭ **EthGetBlockByNumberJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_getBlockByNumber"``, readonly [tag: BlockTag \| Hex, fullTransactionObjects: boolean]\>

JSON-RPC request for `eth_getBlockByNumber` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:91](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L91)

___

### EthGetBlockByNumberJsonRpcResponse

Ƭ **EthGetBlockByNumberJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_getBlockByNumber"``, [`BlockResult`](modules.md#blockresult), `string`\>

JSON-RPC response for `eth_getBlockByNumber` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:111](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L111)

___

### EthGetBlockByNumberParams

Ƭ **EthGetBlockByNumberParams**: `Object`

JSON-RPC request for `eth_getBlockByNumber` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fullTransactionObjects` | `boolean` |
| `tag` | `BlockTag` \| `Hex` |

#### Defined in

[params/EthParams.ts:77](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L77)

___

### EthGetBlockByNumberResult

Ƭ **EthGetBlockByNumberResult**: [`BlockResult`](modules.md#blockresult)

JSON-RPC response for `eth_getBlockByNumber` procedure

#### Defined in

[result/EthResult.ts:72](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L72)

___

### EthGetBlockTransactionCountByHashHandler

Ƭ **EthGetBlockTransactionCountByHashHandler**: (`request`: [`EthGetBlockTransactionCountByHashParams`](modules.md#ethgetblocktransactioncountbyhashparams)) => `Promise`\<[`EthGetBlockTransactionCountByHashResult`](modules.md#ethgetblocktransactioncountbyhashresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBlockTransactionCountByHashResult`](modules.md#ethgetblocktransactioncountbyhashresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBlockTransactionCountByHashParams`](modules.md#ethgetblocktransactioncountbyhashparams) |

##### Returns

`Promise`\<[`EthGetBlockTransactionCountByHashResult`](modules.md#ethgetblocktransactioncountbyhashresult)\>

#### Defined in

[handlers/EthHandler.ts:125](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L125)

___

### EthGetBlockTransactionCountByHashJsonRpcProcedure

Ƭ **EthGetBlockTransactionCountByHashJsonRpcProcedure**: (`request`: [`EthGetBlockTransactionCountByHashJsonRpcRequest`](modules.md#ethgetblocktransactioncountbyhashjsonrpcrequest)) => `Promise`\<[`EthGetBlockTransactionCountByHashJsonRpcResponse`](modules.md#ethgetblocktransactioncountbyhashjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBlockTransactionCountByHashJsonRpcResponse`](modules.md#ethgetblocktransactioncountbyhashjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBlockTransactionCountByHashJsonRpcRequest`](modules.md#ethgetblocktransactioncountbyhashjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetBlockTransactionCountByHashJsonRpcResponse`](modules.md#ethgetblocktransactioncountbyhashjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:127](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L127)

___

### EthGetBlockTransactionCountByHashJsonRpcRequest

Ƭ **EthGetBlockTransactionCountByHashJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_getBlockTransactionCountByHash"``, readonly [hash: Hex]\>

JSON-RPC request for `eth_getBlockTransactionCountByHash` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:99](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L99)

___

### EthGetBlockTransactionCountByHashJsonRpcResponse

Ƭ **EthGetBlockTransactionCountByHashJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_getBlockTransactionCountByHash"``, `Hex`, `string`\>

JSON-RPC response for `eth_getBlockTransactionCountByHash` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:121](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L121)

___

### EthGetBlockTransactionCountByHashParams

Ƭ **EthGetBlockTransactionCountByHashParams**: `Object`

JSON-RPC request for `eth_getBlockTransactionCountByHash` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `hash` | `Hex` |

#### Defined in

[params/EthParams.ts:85](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L85)

___

### EthGetBlockTransactionCountByHashResult

Ƭ **EthGetBlockTransactionCountByHashResult**: `Hex`

JSON-RPC response for `eth_getBlockTransactionCountByHash` procedure

#### Defined in

[result/EthResult.ts:77](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L77)

___

### EthGetBlockTransactionCountByNumberHandler

Ƭ **EthGetBlockTransactionCountByNumberHandler**: (`request`: [`EthGetBlockTransactionCountByNumberParams`](modules.md#ethgetblocktransactioncountbynumberparams)) => `Promise`\<[`EthGetBlockTransactionCountByNumberResult`](modules.md#ethgetblocktransactioncountbynumberresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBlockTransactionCountByNumberResult`](modules.md#ethgetblocktransactioncountbynumberresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBlockTransactionCountByNumberParams`](modules.md#ethgetblocktransactioncountbynumberparams) |

##### Returns

`Promise`\<[`EthGetBlockTransactionCountByNumberResult`](modules.md#ethgetblocktransactioncountbynumberresult)\>

#### Defined in

[handlers/EthHandler.ts:129](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L129)

___

### EthGetBlockTransactionCountByNumberJsonRpcProcedure

Ƭ **EthGetBlockTransactionCountByNumberJsonRpcProcedure**: (`request`: [`EthGetBlockTransactionCountByNumberJsonRpcRequest`](modules.md#ethgetblocktransactioncountbynumberjsonrpcrequest)) => `Promise`\<[`EthGetBlockTransactionCountByNumberJsonRpcResponse`](modules.md#ethgetblocktransactioncountbynumberjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBlockTransactionCountByNumberJsonRpcResponse`](modules.md#ethgetblocktransactioncountbynumberjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBlockTransactionCountByNumberJsonRpcRequest`](modules.md#ethgetblocktransactioncountbynumberjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetBlockTransactionCountByNumberJsonRpcResponse`](modules.md#ethgetblocktransactioncountbynumberjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:131](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L131)

___

### EthGetBlockTransactionCountByNumberJsonRpcRequest

Ƭ **EthGetBlockTransactionCountByNumberJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_getBlockTransactionCountByNumber"``, readonly [tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_getBlockTransactionCountByNumber` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:107](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L107)

___

### EthGetBlockTransactionCountByNumberJsonRpcResponse

Ƭ **EthGetBlockTransactionCountByNumberJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_getBlockTransactionCountByNumber"``, `Hex`, `string`\>

JSON-RPC response for `eth_getBlockTransactionCountByNumber` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:131](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L131)

___

### EthGetBlockTransactionCountByNumberParams

Ƭ **EthGetBlockTransactionCountByNumberParams**: `Object`

JSON-RPC request for `eth_getBlockTransactionCountByNumber` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `tag` | `BlockTag` \| `Hex` |

#### Defined in

[params/EthParams.ts:90](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L90)

___

### EthGetBlockTransactionCountByNumberResult

Ƭ **EthGetBlockTransactionCountByNumberResult**: `Hex`

JSON-RPC response for `eth_getBlockTransactionCountByNumber` procedure

#### Defined in

[result/EthResult.ts:83](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L83)

___

### EthGetCodeHandler

Ƭ **EthGetCodeHandler**: (`request`: [`EthGetCodeParams`](modules.md#ethgetcodeparams)) => `Promise`\<[`EthGetCodeResult`](modules.md#ethgetcoderesult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetCodeResult`](modules.md#ethgetcoderesult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetCodeParams`](modules.md#ethgetcodeparams) |

##### Returns

`Promise`\<[`EthGetCodeResult`](modules.md#ethgetcoderesult)\>

#### Defined in

[handlers/EthHandler.ts:133](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L133)

___

### EthGetCodeJsonRpcProcedure

Ƭ **EthGetCodeJsonRpcProcedure**: (`request`: [`EthGetCodeJsonRpcRequest`](modules.md#ethgetcodejsonrpcrequest)) => `Promise`\<[`EthGetCodeJsonRpcResponse`](modules.md#ethgetcodejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetCodeJsonRpcResponse`](modules.md#ethgetcodejsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetCodeJsonRpcRequest`](modules.md#ethgetcodejsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetCodeJsonRpcResponse`](modules.md#ethgetcodejsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:135](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L135)

___

### EthGetCodeJsonRpcRequest

Ƭ **EthGetCodeJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_getCode"``, readonly [address: Address, tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_getCode` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:115](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L115)

___

### EthGetCodeJsonRpcResponse

Ƭ **EthGetCodeJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_getCode"``, `Hex`, `string`\>

JSON-RPC response for `eth_getCode` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:138](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L138)

___

### EthGetCodeParams

Ƭ **EthGetCodeParams**: `Object`

JSON-RPC request for `eth_getCode` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `tag` | `BlockTag` \| `Hex` |

#### Defined in

[params/EthParams.ts:95](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L95)

___

### EthGetCodeResult

Ƭ **EthGetCodeResult**: `Hex`

JSON-RPC response for `eth_getCode` procedure

#### Defined in

[result/EthResult.ts:89](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L89)

___

### EthGetFilterChangesHandler

Ƭ **EthGetFilterChangesHandler**: (`request`: [`EthGetFilterChangesParams`](modules.md#ethgetfilterchangesparams)) => `Promise`\<[`EthGetFilterChangesResult`](modules.md#ethgetfilterchangesresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetFilterChangesResult`](modules.md#ethgetfilterchangesresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetFilterChangesParams`](modules.md#ethgetfilterchangesparams) |

##### Returns

`Promise`\<[`EthGetFilterChangesResult`](modules.md#ethgetfilterchangesresult)\>

#### Defined in

[handlers/EthHandler.ts:137](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L137)

___

### EthGetFilterChangesJsonRpcProcedure

Ƭ **EthGetFilterChangesJsonRpcProcedure**: (`request`: [`EthGetFilterChangesJsonRpcRequest`](modules.md#ethgetfilterchangesjsonrpcrequest)) => `Promise`\<[`EthGetFilterChangesJsonRpcResponse`](modules.md#ethgetfilterchangesjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetFilterChangesJsonRpcResponse`](modules.md#ethgetfilterchangesjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetFilterChangesJsonRpcRequest`](modules.md#ethgetfilterchangesjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetFilterChangesJsonRpcResponse`](modules.md#ethgetfilterchangesjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:139](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L139)

___

### EthGetFilterChangesJsonRpcRequest

Ƭ **EthGetFilterChangesJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_getFilterChanges"``, [filterId: Hex]\>

JSON-RPC request for `eth_getFilterChanges` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:123](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L123)

___

### EthGetFilterChangesJsonRpcResponse

Ƭ **EthGetFilterChangesJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_getFilterChanges"``, [`FilterLog`](modules.md#filterlog)[], `string`\>

JSON-RPC response for `eth_getFilterChanges` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:148](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L148)

___

### EthGetFilterChangesParams

Ƭ **EthGetFilterChangesParams**: `Object`

JSON-RPC request for `eth_getFilterChanges` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `filterId` | `Hex` |

#### Defined in

[params/EthParams.ts:100](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L100)

___

### EthGetFilterChangesResult

Ƭ **EthGetFilterChangesResult**: [`FilterLog`](modules.md#filterlog)[]

JSON-RPC response for `eth_getFilterChanges` procedure

#### Defined in

[result/EthResult.ts:95](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L95)

___

### EthGetFilterLogsHandler

Ƭ **EthGetFilterLogsHandler**: (`request`: [`EthGetFilterLogsParams`](modules.md#ethgetfilterlogsparams)) => `Promise`\<[`EthGetFilterLogsResult`](modules.md#ethgetfilterlogsresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetFilterLogsResult`](modules.md#ethgetfilterlogsresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetFilterLogsParams`](modules.md#ethgetfilterlogsparams) |

##### Returns

`Promise`\<[`EthGetFilterLogsResult`](modules.md#ethgetfilterlogsresult)\>

#### Defined in

[handlers/EthHandler.ts:141](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L141)

___

### EthGetFilterLogsJsonRpcProcedure

Ƭ **EthGetFilterLogsJsonRpcProcedure**: (`request`: [`EthGetFilterLogsJsonRpcRequest`](modules.md#ethgetfilterlogsjsonrpcrequest)) => `Promise`\<[`EthGetFilterLogsJsonRpcResponse`](modules.md#ethgetfilterlogsjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetFilterLogsJsonRpcResponse`](modules.md#ethgetfilterlogsjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetFilterLogsJsonRpcRequest`](modules.md#ethgetfilterlogsjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetFilterLogsJsonRpcResponse`](modules.md#ethgetfilterlogsjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:143](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L143)

___

### EthGetFilterLogsJsonRpcRequest

Ƭ **EthGetFilterLogsJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_getFilterLogs"``, [filterId: Hex]\>

JSON-RPC request for `eth_getFilterLogs` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:131](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L131)

___

### EthGetFilterLogsJsonRpcResponse

Ƭ **EthGetFilterLogsJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_getFilterLogs"``, [`FilterLog`](modules.md#filterlog)[], `string`\>

JSON-RPC response for `eth_getFilterLogs` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:158](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L158)

___

### EthGetFilterLogsParams

Ƭ **EthGetFilterLogsParams**: `Object`

JSON-RPC request for `eth_getFilterLogs` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `filterId` | `Hex` |

#### Defined in

[params/EthParams.ts:105](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L105)

___

### EthGetFilterLogsResult

Ƭ **EthGetFilterLogsResult**: [`FilterLog`](modules.md#filterlog)[]

JSON-RPC response for `eth_getFilterLogs` procedure

#### Defined in

[result/EthResult.ts:101](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L101)

___

### EthGetLogsHandler

Ƭ **EthGetLogsHandler**: (`request`: [`EthGetLogsParams`](modules.md#ethgetlogsparams)) => `Promise`\<[`EthGetLogsResult`](modules.md#ethgetlogsresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetLogsResult`](modules.md#ethgetlogsresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetLogsParams`](modules.md#ethgetlogsparams) |

##### Returns

`Promise`\<[`EthGetLogsResult`](modules.md#ethgetlogsresult)\>

#### Defined in

[handlers/EthHandler.ts:145](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L145)

___

### EthGetLogsJsonRpcProcedure

Ƭ **EthGetLogsJsonRpcProcedure**: (`request`: [`EthGetLogsJsonRpcRequest`](modules.md#ethgetlogsjsonrpcrequest)) => `Promise`\<[`EthGetLogsJsonRpcResponse`](modules.md#ethgetlogsjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetLogsJsonRpcResponse`](modules.md#ethgetlogsjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetLogsJsonRpcRequest`](modules.md#ethgetlogsjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetLogsJsonRpcResponse`](modules.md#ethgetlogsjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:147](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L147)

___

### EthGetLogsJsonRpcRequest

Ƭ **EthGetLogsJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_getLogs"``, [filterParams: FilterParams]\>

JSON-RPC request for `eth_getLogs` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:139](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L139)

___

### EthGetLogsJsonRpcResponse

Ƭ **EthGetLogsJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_getLogs"``, [`FilterLog`](modules.md#filterlog)[], `string`\>

JSON-RPC response for `eth_getLogs` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:168](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L168)

___

### EthGetLogsParams

Ƭ **EthGetLogsParams**: `Object`

JSON-RPC request for `eth_getLogs` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `filterParams` | `FilterParams` |

#### Defined in

[params/EthParams.ts:110](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L110)

___

### EthGetLogsResult

Ƭ **EthGetLogsResult**: [`FilterLog`](modules.md#filterlog)[]

JSON-RPC response for `eth_getLogs` procedure

#### Defined in

[result/EthResult.ts:107](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L107)

___

### EthGetStorageAtHandler

Ƭ **EthGetStorageAtHandler**: (`request`: [`EthGetStorageAtParams`](modules.md#ethgetstorageatparams)) => `Promise`\<[`EthGetStorageAtResult`](modules.md#ethgetstorageatresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetStorageAtResult`](modules.md#ethgetstorageatresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetStorageAtParams`](modules.md#ethgetstorageatparams) |

##### Returns

`Promise`\<[`EthGetStorageAtResult`](modules.md#ethgetstorageatresult)\>

#### Defined in

[handlers/EthHandler.ts:149](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L149)

___

### EthGetStorageAtJsonRpcProcedure

Ƭ **EthGetStorageAtJsonRpcProcedure**: (`request`: [`EthGetStorageAtJsonRpcRequest`](modules.md#ethgetstorageatjsonrpcrequest)) => `Promise`\<[`EthGetStorageAtJsonRpcResponse`](modules.md#ethgetstorageatjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetStorageAtJsonRpcResponse`](modules.md#ethgetstorageatjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetStorageAtJsonRpcRequest`](modules.md#ethgetstorageatjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetStorageAtJsonRpcResponse`](modules.md#ethgetstorageatjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:151](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L151)

___

### EthGetStorageAtJsonRpcRequest

Ƭ **EthGetStorageAtJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_getStorageAt"``, readonly [address: Address, position: Hex, tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_getStorageAt` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:147](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L147)

___

### EthGetStorageAtJsonRpcResponse

Ƭ **EthGetStorageAtJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_getStorageAt"``, `Hex`, `string`\>

JSON-RPC response for `eth_getStorageAt` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:178](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L178)

___

### EthGetStorageAtParams

Ƭ **EthGetStorageAtParams**: `Object`

JSON-RPC request for `eth_getStorageAt` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `position` | `Hex` |
| `tag` | `BlockTag` \| `Hex` |

#### Defined in

[params/EthParams.ts:115](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L115)

___

### EthGetStorageAtResult

Ƭ **EthGetStorageAtResult**: `Hex`

JSON-RPC response for `eth_getStorageAt` procedure

#### Defined in

[result/EthResult.ts:113](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L113)

___

### EthGetTransactionByBlockHashAndIndexHandler

Ƭ **EthGetTransactionByBlockHashAndIndexHandler**: (`request`: [`EthGetTransactionByBlockHashAndIndexParams`](modules.md#ethgettransactionbyblockhashandindexparams)) => `Promise`\<[`EthGetTransactionByBlockHashAndIndexResult`](modules.md#ethgettransactionbyblockhashandindexresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionByBlockHashAndIndexResult`](modules.md#ethgettransactionbyblockhashandindexresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionByBlockHashAndIndexParams`](modules.md#ethgettransactionbyblockhashandindexparams) |

##### Returns

`Promise`\<[`EthGetTransactionByBlockHashAndIndexResult`](modules.md#ethgettransactionbyblockhashandindexresult)\>

#### Defined in

[handlers/EthHandler.ts:169](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L169)

___

### EthGetTransactionByBlockHashAndIndexJsonRpcProcedure

Ƭ **EthGetTransactionByBlockHashAndIndexJsonRpcProcedure**: (`request`: [`EthGetTransactionByBlockHashAndIndexJsonRpcRequest`](modules.md#ethgettransactionbyblockhashandindexjsonrpcrequest)) => `Promise`\<[`EthGetTransactionByBlockHashAndIndexJsonRpcResponse`](modules.md#ethgettransactionbyblockhashandindexjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionByBlockHashAndIndexJsonRpcResponse`](modules.md#ethgettransactionbyblockhashandindexjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionByBlockHashAndIndexJsonRpcRequest`](modules.md#ethgettransactionbyblockhashandindexjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetTransactionByBlockHashAndIndexJsonRpcResponse`](modules.md#ethgettransactionbyblockhashandindexjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:171](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L171)

___

### EthGetTransactionByBlockHashAndIndexJsonRpcRequest

Ƭ **EthGetTransactionByBlockHashAndIndexJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_getTransactionByBlockHashAndIndex"``, readonly [tag: Hex, index: Hex]\>

JSON-RPC request for `eth_getTransactionByBlockHashAndIndex` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:187](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L187)

___

### EthGetTransactionByBlockHashAndIndexJsonRpcResponse

Ƭ **EthGetTransactionByBlockHashAndIndexJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_getTransactionByBlockHashAndIndex"``, [`TransactionResult`](modules.md#transactionresult), `string`\>

JSON-RPC response for `eth_getTransactionByBlockHashAndIndex` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:228](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L228)

___

### EthGetTransactionByBlockHashAndIndexParams

Ƭ **EthGetTransactionByBlockHashAndIndexParams**: `Object`

JSON-RPC request for `eth_getTransactionByBlockHashAndIndex` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `index` | `Hex` |
| `tag` | `Hex` |

#### Defined in

[params/EthParams.ts:147](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L147)

___

### EthGetTransactionByBlockHashAndIndexResult

Ƭ **EthGetTransactionByBlockHashAndIndexResult**: [`TransactionResult`](modules.md#transactionresult)

JSON-RPC response for `eth_getTransactionByBlockHashAndIndex` procedure

#### Defined in

[result/EthResult.ts:143](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L143)

___

### EthGetTransactionByBlockNumberAndIndexHandler

Ƭ **EthGetTransactionByBlockNumberAndIndexHandler**: (`request`: [`EthGetTransactionByBlockNumberAndIndexParams`](modules.md#ethgettransactionbyblocknumberandindexparams)) => `Promise`\<[`EthGetTransactionByBlockNumberAndIndexResult`](modules.md#ethgettransactionbyblocknumberandindexresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionByBlockNumberAndIndexResult`](modules.md#ethgettransactionbyblocknumberandindexresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionByBlockNumberAndIndexParams`](modules.md#ethgettransactionbyblocknumberandindexparams) |

##### Returns

`Promise`\<[`EthGetTransactionByBlockNumberAndIndexResult`](modules.md#ethgettransactionbyblocknumberandindexresult)\>

#### Defined in

[handlers/EthHandler.ts:173](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L173)

___

### EthGetTransactionByBlockNumberAndIndexJsonRpcProcedure

Ƭ **EthGetTransactionByBlockNumberAndIndexJsonRpcProcedure**: (`request`: [`EthGetTransactionByBlockNumberAndIndexJsonRpcRequest`](modules.md#ethgettransactionbyblocknumberandindexjsonrpcrequest)) => `Promise`\<[`EthGetTransactionByBlockNumberAndIndexJsonRpcResponse`](modules.md#ethgettransactionbyblocknumberandindexjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionByBlockNumberAndIndexJsonRpcResponse`](modules.md#ethgettransactionbyblocknumberandindexjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionByBlockNumberAndIndexJsonRpcRequest`](modules.md#ethgettransactionbyblocknumberandindexjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetTransactionByBlockNumberAndIndexJsonRpcResponse`](modules.md#ethgettransactionbyblocknumberandindexjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:175](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L175)

___

### EthGetTransactionByBlockNumberAndIndexJsonRpcRequest

Ƭ **EthGetTransactionByBlockNumberAndIndexJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_getTransactionByBlockNumberAndIndex"``, readonly [tag: BlockTag \| Hex, index: Hex]\>

JSON-RPC request for `eth_getTransactionByBlockNumberAndIndex` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:195](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L195)

___

### EthGetTransactionByBlockNumberAndIndexJsonRpcResponse

Ƭ **EthGetTransactionByBlockNumberAndIndexJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_getTransactionByBlockNumberAndIndex"``, [`TransactionResult`](modules.md#transactionresult), `string`\>

JSON-RPC response for `eth_getTransactionByBlockNumberAndIndex` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:239](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L239)

___

### EthGetTransactionByBlockNumberAndIndexParams

Ƭ **EthGetTransactionByBlockNumberAndIndexParams**: `Object`

JSON-RPC request for `eth_getTransactionByBlockNumberAndIndex` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `index` | `Hex` |
| `tag` | `BlockTag` \| `Hex` |

#### Defined in

[params/EthParams.ts:155](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L155)

___

### EthGetTransactionByBlockNumberAndIndexResult

Ƭ **EthGetTransactionByBlockNumberAndIndexResult**: [`TransactionResult`](modules.md#transactionresult)

JSON-RPC response for `eth_getTransactionByBlockNumberAndIndex` procedure

#### Defined in

[result/EthResult.ts:149](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L149)

___

### EthGetTransactionByHashHandler

Ƭ **EthGetTransactionByHashHandler**: (`request`: [`EthGetTransactionByHashParams`](modules.md#ethgettransactionbyhashparams)) => `Promise`\<[`EthGetTransactionByHashResult`](modules.md#ethgettransactionbyhashresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionByHashResult`](modules.md#ethgettransactionbyhashresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionByHashParams`](modules.md#ethgettransactionbyhashparams) |

##### Returns

`Promise`\<[`EthGetTransactionByHashResult`](modules.md#ethgettransactionbyhashresult)\>

#### Defined in

[handlers/EthHandler.ts:165](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L165)

___

### EthGetTransactionByHashJsonRpcProcedure

Ƭ **EthGetTransactionByHashJsonRpcProcedure**: (`request`: [`EthGetTransactionByHashJsonRpcRequest`](modules.md#ethgettransactionbyhashjsonrpcrequest)) => `Promise`\<[`EthGetTransactionByHashJsonRpcResponse`](modules.md#ethgettransactionbyhashjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionByHashJsonRpcResponse`](modules.md#ethgettransactionbyhashjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionByHashJsonRpcRequest`](modules.md#ethgettransactionbyhashjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetTransactionByHashJsonRpcResponse`](modules.md#ethgettransactionbyhashjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:167](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L167)

___

### EthGetTransactionByHashJsonRpcRequest

Ƭ **EthGetTransactionByHashJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_getTransactionByHash"``, readonly [data: Hex]\>

JSON-RPC request for `eth_getTransactionByHash` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:179](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L179)

___

### EthGetTransactionByHashJsonRpcResponse

Ƭ **EthGetTransactionByHashJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_getTransactionByHash"``, [`TransactionResult`](modules.md#transactionresult), `string`\>

JSON-RPC response for `eth_getTransactionByHash` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:218](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L218)

___

### EthGetTransactionByHashParams

Ƭ **EthGetTransactionByHashParams**: `Object`

JSON-RPC request for `eth_getTransactionByHash` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | `Hex` |

#### Defined in

[params/EthParams.ts:142](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L142)

___

### EthGetTransactionByHashResult

Ƭ **EthGetTransactionByHashResult**: [`TransactionResult`](modules.md#transactionresult)

JSON-RPC response for `eth_getTransactionByHash` procedure

#### Defined in

[result/EthResult.ts:137](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L137)

___

### EthGetTransactionCountHandler

Ƭ **EthGetTransactionCountHandler**: (`request`: [`EthGetTransactionCountParams`](modules.md#ethgettransactioncountparams)) => `Promise`\<[`EthGetTransactionCountResult`](modules.md#ethgettransactioncountresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionCountResult`](modules.md#ethgettransactioncountresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionCountParams`](modules.md#ethgettransactioncountparams) |

##### Returns

`Promise`\<[`EthGetTransactionCountResult`](modules.md#ethgettransactioncountresult)\>

#### Defined in

[handlers/EthHandler.ts:153](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L153)

___

### EthGetTransactionCountJsonRpcProcedure

Ƭ **EthGetTransactionCountJsonRpcProcedure**: (`request`: [`EthGetTransactionCountJsonRpcRequest`](modules.md#ethgettransactioncountjsonrpcrequest)) => `Promise`\<[`EthGetTransactionCountJsonRpcResponse`](modules.md#ethgettransactioncountjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionCountJsonRpcResponse`](modules.md#ethgettransactioncountjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionCountJsonRpcRequest`](modules.md#ethgettransactioncountjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetTransactionCountJsonRpcResponse`](modules.md#ethgettransactioncountjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:155](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L155)

___

### EthGetTransactionCountJsonRpcRequest

Ƭ **EthGetTransactionCountJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_getTransactionCount"``, readonly [address: Address, tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_getTransactionCount` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:155](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L155)

___

### EthGetTransactionCountJsonRpcResponse

Ƭ **EthGetTransactionCountJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_getTransactionCount"``, `Hex`, `string`\>

JSON-RPC response for `eth_getTransactionCount` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:188](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L188)

___

### EthGetTransactionCountParams

Ƭ **EthGetTransactionCountParams**: `Object`

JSON-RPC request for `eth_getTransactionCount` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `tag` | `BlockTag` \| `Hex` |

#### Defined in

[params/EthParams.ts:124](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L124)

___

### EthGetTransactionCountResult

Ƭ **EthGetTransactionCountResult**: `Hex`

JSON-RPC response for `eth_getTransactionCount` procedure

#### Defined in

[result/EthResult.ts:119](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L119)

___

### EthGetTransactionReceiptHandler

Ƭ **EthGetTransactionReceiptHandler**: (`request`: [`EthGetTransactionReceiptParams`](modules.md#ethgettransactionreceiptparams)) => `Promise`\<[`EthGetTransactionReceiptResult`](modules.md#ethgettransactionreceiptresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionReceiptResult`](modules.md#ethgettransactionreceiptresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionReceiptParams`](modules.md#ethgettransactionreceiptparams) |

##### Returns

`Promise`\<[`EthGetTransactionReceiptResult`](modules.md#ethgettransactionreceiptresult)\>

#### Defined in

[handlers/EthHandler.ts:177](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L177)

___

### EthGetTransactionReceiptJsonRpcProcedure

Ƭ **EthGetTransactionReceiptJsonRpcProcedure**: (`request`: [`EthGetTransactionReceiptJsonRpcRequest`](modules.md#ethgettransactionreceiptjsonrpcrequest)) => `Promise`\<[`EthGetTransactionReceiptJsonRpcResponse`](modules.md#ethgettransactionreceiptjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionReceiptJsonRpcResponse`](modules.md#ethgettransactionreceiptjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionReceiptJsonRpcRequest`](modules.md#ethgettransactionreceiptjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetTransactionReceiptJsonRpcResponse`](modules.md#ethgettransactionreceiptjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:179](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L179)

___

### EthGetTransactionReceiptJsonRpcRequest

Ƭ **EthGetTransactionReceiptJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_getTransactionReceipt"``, [txHash: Hex]\>

JSON-RPC request for `eth_getTransactionReceipt` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:204](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L204)

___

### EthGetTransactionReceiptJsonRpcResponse

Ƭ **EthGetTransactionReceiptJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_getTransactionReceipt"``, [`TransactionReceiptResult`](modules.md#transactionreceiptresult), `string`\>

JSON-RPC response for `eth_getTransactionReceipt` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:250](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L250)

___

### EthGetTransactionReceiptParams

Ƭ **EthGetTransactionReceiptParams**: `GetTransactionParameters`

JSON-RPC request for `eth_getTransactionReceipt` procedure

#### Defined in

[params/EthParams.ts:163](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L163)

___

### EthGetTransactionReceiptResult

Ƭ **EthGetTransactionReceiptResult**: [`TransactionReceiptResult`](modules.md#transactionreceiptresult)

JSON-RPC response for `eth_getTransactionReceipt` procedure

#### Defined in

[result/EthResult.ts:155](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L155)

___

### EthGetUncleByBlockHashAndIndexHandler

Ƭ **EthGetUncleByBlockHashAndIndexHandler**: (`request`: [`EthGetUncleByBlockHashAndIndexParams`](modules.md#ethgetunclebyblockhashandindexparams)) => `Promise`\<[`EthGetUncleByBlockHashAndIndexResult`](modules.md#ethgetunclebyblockhashandindexresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetUncleByBlockHashAndIndexResult`](modules.md#ethgetunclebyblockhashandindexresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetUncleByBlockHashAndIndexParams`](modules.md#ethgetunclebyblockhashandindexparams) |

##### Returns

`Promise`\<[`EthGetUncleByBlockHashAndIndexResult`](modules.md#ethgetunclebyblockhashandindexresult)\>

#### Defined in

[handlers/EthHandler.ts:181](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L181)

___

### EthGetUncleByBlockHashAndIndexJsonRpcProcedure

Ƭ **EthGetUncleByBlockHashAndIndexJsonRpcProcedure**: (`request`: [`EthGetUncleByBlockHashAndIndexJsonRpcRequest`](modules.md#ethgetunclebyblockhashandindexjsonrpcrequest)) => `Promise`\<[`EthGetUncleByBlockHashAndIndexJsonRpcResponse`](modules.md#ethgetunclebyblockhashandindexjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetUncleByBlockHashAndIndexJsonRpcResponse`](modules.md#ethgetunclebyblockhashandindexjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetUncleByBlockHashAndIndexJsonRpcRequest`](modules.md#ethgetunclebyblockhashandindexjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetUncleByBlockHashAndIndexJsonRpcResponse`](modules.md#ethgetunclebyblockhashandindexjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:183](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L183)

___

### EthGetUncleByBlockHashAndIndexJsonRpcRequest

Ƭ **EthGetUncleByBlockHashAndIndexJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_getUncleByBlockHashAndIndex"``, readonly [blockHash: Hex, uncleIndex: Hex]\>

JSON-RPC request for `eth_getUncleByBlockHashAndIndex` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:212](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L212)

___

### EthGetUncleByBlockHashAndIndexJsonRpcResponse

Ƭ **EthGetUncleByBlockHashAndIndexJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_getUncleByBlockHashAndIndex"``, `Hex`, `string`\>

JSON-RPC response for `eth_getUncleByBlockHashAndIndex` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:260](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L260)

___

### EthGetUncleByBlockHashAndIndexParams

Ƭ **EthGetUncleByBlockHashAndIndexParams**: `Object`

JSON-RPC request for `eth_getUncleByBlockHashAndIndex` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockHash` | `Hex` |
| `uncleIndex` | `Hex` |

#### Defined in

[params/EthParams.ts:168](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L168)

___

### EthGetUncleByBlockHashAndIndexResult

Ƭ **EthGetUncleByBlockHashAndIndexResult**: `Hex`

JSON-RPC response for `eth_getUncleByBlockHashAndIndex` procedure

#### Defined in

[result/EthResult.ts:161](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L161)

___

### EthGetUncleByBlockNumberAndIndexHandler

Ƭ **EthGetUncleByBlockNumberAndIndexHandler**: (`request`: [`EthGetUncleByBlockNumberAndIndexParams`](modules.md#ethgetunclebyblocknumberandindexparams)) => `Promise`\<[`EthGetUncleByBlockNumberAndIndexResult`](modules.md#ethgetunclebyblocknumberandindexresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetUncleByBlockNumberAndIndexResult`](modules.md#ethgetunclebyblocknumberandindexresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetUncleByBlockNumberAndIndexParams`](modules.md#ethgetunclebyblocknumberandindexparams) |

##### Returns

`Promise`\<[`EthGetUncleByBlockNumberAndIndexResult`](modules.md#ethgetunclebyblocknumberandindexresult)\>

#### Defined in

[handlers/EthHandler.ts:185](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L185)

___

### EthGetUncleByBlockNumberAndIndexJsonRpcProcedure

Ƭ **EthGetUncleByBlockNumberAndIndexJsonRpcProcedure**: (`request`: [`EthGetUncleByBlockNumberAndIndexJsonRpcRequest`](modules.md#ethgetunclebyblocknumberandindexjsonrpcrequest)) => `Promise`\<[`EthGetUncleByBlockNumberAndIndexJsonRpcResponse`](modules.md#ethgetunclebyblocknumberandindexjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetUncleByBlockNumberAndIndexJsonRpcResponse`](modules.md#ethgetunclebyblocknumberandindexjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetUncleByBlockNumberAndIndexJsonRpcRequest`](modules.md#ethgetunclebyblocknumberandindexjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetUncleByBlockNumberAndIndexJsonRpcResponse`](modules.md#ethgetunclebyblocknumberandindexjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:187](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L187)

___

### EthGetUncleByBlockNumberAndIndexJsonRpcRequest

Ƭ **EthGetUncleByBlockNumberAndIndexJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_getUncleByBlockNumberAndIndex"``, readonly [tag: BlockTag \| Hex, uncleIndex: Hex]\>

JSON-RPC request for `eth_getUncleByBlockNumberAndIndex` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:220](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L220)

___

### EthGetUncleByBlockNumberAndIndexJsonRpcResponse

Ƭ **EthGetUncleByBlockNumberAndIndexJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_getUncleByBlockNumberAndIndex"``, `Hex`, `string`\>

JSON-RPC response for `eth_getUncleByBlockNumberAndIndex` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:270](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L270)

___

### EthGetUncleByBlockNumberAndIndexParams

Ƭ **EthGetUncleByBlockNumberAndIndexParams**: `Object`

JSON-RPC request for `eth_getUncleByBlockNumberAndIndex` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `tag` | `BlockTag` \| `Hex` |
| `uncleIndex` | `Hex` |

#### Defined in

[params/EthParams.ts:176](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L176)

___

### EthGetUncleByBlockNumberAndIndexResult

Ƭ **EthGetUncleByBlockNumberAndIndexResult**: `Hex`

JSON-RPC response for `eth_getUncleByBlockNumberAndIndex` procedure

#### Defined in

[result/EthResult.ts:167](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L167)

___

### EthGetUncleCountByBlockHashHandler

Ƭ **EthGetUncleCountByBlockHashHandler**: (`request`: [`EthGetUncleCountByBlockHashParams`](modules.md#ethgetunclecountbyblockhashparams)) => `Promise`\<[`EthGetUncleCountByBlockHashResult`](modules.md#ethgetunclecountbyblockhashresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetUncleCountByBlockHashResult`](modules.md#ethgetunclecountbyblockhashresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetUncleCountByBlockHashParams`](modules.md#ethgetunclecountbyblockhashparams) |

##### Returns

`Promise`\<[`EthGetUncleCountByBlockHashResult`](modules.md#ethgetunclecountbyblockhashresult)\>

#### Defined in

[handlers/EthHandler.ts:157](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L157)

___

### EthGetUncleCountByBlockHashJsonRpcProcedure

Ƭ **EthGetUncleCountByBlockHashJsonRpcProcedure**: (`request`: [`EthGetUncleCountByBlockHashJsonRpcRequest`](modules.md#ethgetunclecountbyblockhashjsonrpcrequest)) => `Promise`\<[`EthGetUncleCountByBlockHashJsonRpcResponse`](modules.md#ethgetunclecountbyblockhashjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetUncleCountByBlockHashJsonRpcResponse`](modules.md#ethgetunclecountbyblockhashjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetUncleCountByBlockHashJsonRpcRequest`](modules.md#ethgetunclecountbyblockhashjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetUncleCountByBlockHashJsonRpcResponse`](modules.md#ethgetunclecountbyblockhashjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:159](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L159)

___

### EthGetUncleCountByBlockHashJsonRpcRequest

Ƭ **EthGetUncleCountByBlockHashJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_getUncleCountByBlockHash"``, readonly [hash: Hex]\>

JSON-RPC request for `eth_getUncleCountByBlockHash` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:163](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L163)

___

### EthGetUncleCountByBlockHashJsonRpcResponse

Ƭ **EthGetUncleCountByBlockHashJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_getUncleCountByBlockHash"``, `Hex`, `string`\>

JSON-RPC response for `eth_getUncleCountByBlockHash` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:198](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L198)

___

### EthGetUncleCountByBlockHashParams

Ƭ **EthGetUncleCountByBlockHashParams**: `Object`

JSON-RPC request for `eth_getUncleCountByBlockHash` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `hash` | `Hex` |

#### Defined in

[params/EthParams.ts:132](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L132)

___

### EthGetUncleCountByBlockHashResult

Ƭ **EthGetUncleCountByBlockHashResult**: `Hex`

JSON-RPC response for `eth_getUncleCountByBlockHash` procedure

#### Defined in

[result/EthResult.ts:125](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L125)

___

### EthGetUncleCountByBlockNumberHandler

Ƭ **EthGetUncleCountByBlockNumberHandler**: (`request`: [`EthGetUncleCountByBlockNumberParams`](modules.md#ethgetunclecountbyblocknumberparams)) => `Promise`\<[`EthGetUncleCountByBlockNumberResult`](modules.md#ethgetunclecountbyblocknumberresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetUncleCountByBlockNumberResult`](modules.md#ethgetunclecountbyblocknumberresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetUncleCountByBlockNumberParams`](modules.md#ethgetunclecountbyblocknumberparams) |

##### Returns

`Promise`\<[`EthGetUncleCountByBlockNumberResult`](modules.md#ethgetunclecountbyblocknumberresult)\>

#### Defined in

[handlers/EthHandler.ts:161](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L161)

___

### EthGetUncleCountByBlockNumberJsonRpcProcedure

Ƭ **EthGetUncleCountByBlockNumberJsonRpcProcedure**: (`request`: [`EthGetUncleCountByBlockNumberJsonRpcRequest`](modules.md#ethgetunclecountbyblocknumberjsonrpcrequest)) => `Promise`\<[`EthGetUncleCountByBlockNumberJsonRpcResponse`](modules.md#ethgetunclecountbyblocknumberjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetUncleCountByBlockNumberJsonRpcResponse`](modules.md#ethgetunclecountbyblocknumberjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetUncleCountByBlockNumberJsonRpcRequest`](modules.md#ethgetunclecountbyblocknumberjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetUncleCountByBlockNumberJsonRpcResponse`](modules.md#ethgetunclecountbyblocknumberjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:163](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L163)

___

### EthGetUncleCountByBlockNumberJsonRpcRequest

Ƭ **EthGetUncleCountByBlockNumberJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_getUncleCountByBlockNumber"``, readonly [tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_getUncleCountByBlockNumber` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:171](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L171)

___

### EthGetUncleCountByBlockNumberJsonRpcResponse

Ƭ **EthGetUncleCountByBlockNumberJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_getUncleCountByBlockNumber"``, `Hex`, `string`\>

JSON-RPC response for `eth_getUncleCountByBlockNumber` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:208](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L208)

___

### EthGetUncleCountByBlockNumberParams

Ƭ **EthGetUncleCountByBlockNumberParams**: `Object`

JSON-RPC request for `eth_getUncleCountByBlockNumber` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `tag` | `BlockTag` \| `Hex` |

#### Defined in

[params/EthParams.ts:137](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L137)

___

### EthGetUncleCountByBlockNumberResult

Ƭ **EthGetUncleCountByBlockNumberResult**: `Hex`

JSON-RPC response for `eth_getUncleCountByBlockNumber` procedure

#### Defined in

[result/EthResult.ts:131](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L131)

___

### EthHashrateHandler

Ƭ **EthHashrateHandler**: (`request`: [`EthHashrateParams`](modules.md#ethhashrateparams)) => `Promise`\<[`EthHashrateResult`](modules.md#ethhashrateresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthHashrateResult`](modules.md#ethhashrateresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthHashrateParams`](modules.md#ethhashrateparams) |

##### Returns

`Promise`\<[`EthHashrateResult`](modules.md#ethhashrateresult)\>

#### Defined in

[handlers/EthHandler.ts:105](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L105)

___

### EthHashrateJsonRpcProcedure

Ƭ **EthHashrateJsonRpcProcedure**: (`request`: [`EthHashrateJsonRpcRequest`](modules.md#ethhashratejsonrpcrequest)) => `Promise`\<[`EthHashrateJsonRpcResponse`](modules.md#ethhashratejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthHashrateJsonRpcResponse`](modules.md#ethhashratejsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthHashrateJsonRpcRequest`](modules.md#ethhashratejsonrpcrequest) |

##### Returns

`Promise`\<[`EthHashrateJsonRpcResponse`](modules.md#ethhashratejsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:107](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L107)

___

### EthHashrateJsonRpcRequest

Ƭ **EthHashrateJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_hashrate"``, readonly []\>

JSON-RPC request for `eth_hashrate` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:59](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L59)

___

### EthHashrateJsonRpcResponse

Ƭ **EthHashrateJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_hashrate"``, `Hex`, `string`\>

JSON-RPC response for `eth_hashrate` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:71](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L71)

___

### EthHashrateParams

Ƭ **EthHashrateParams**: `EmptyParams`

JSON-RPC request for `eth_hashrate` procedure

#### Defined in

[params/EthParams.ts:54](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L54)

___

### EthHashrateResult

Ƭ **EthHashrateResult**: `Hex`

JSON-RPC response for `eth_hashrate` procedure

#### Defined in

[result/EthResult.ts:48](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L48)

___

### EthJsonRpcRequestHandler

Ƭ **EthJsonRpcRequestHandler**: \<TRequest\>(`request`: `TRequest`) => `Promise`\<`EthReturnType`[`TRequest`[``"method"``]]\>

#### Type declaration

▸ \<`TRequest`\>(`request`): `Promise`\<`EthReturnType`[`TRequest`[``"method"``]]\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TRequest` | extends `EthJsonRpcRequest` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | `TRequest` |

##### Returns

`Promise`\<`EthReturnType`[`TRequest`[``"method"``]]\>

#### Defined in

[TevmJsonRpcRequestHandler.ts:107](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/TevmJsonRpcRequestHandler.ts#L107)

___

### EthMiningHandler

Ƭ **EthMiningHandler**: (`request`: [`EthMiningParams`](modules.md#ethminingparams)) => `Promise`\<[`EthMiningResult`](modules.md#ethminingresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthMiningResult`](modules.md#ethminingresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthMiningParams`](modules.md#ethminingparams) |

##### Returns

`Promise`\<[`EthMiningResult`](modules.md#ethminingresult)\>

#### Defined in

[handlers/EthHandler.ts:189](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L189)

___

### EthMiningJsonRpcProcedure

Ƭ **EthMiningJsonRpcProcedure**: (`request`: [`EthMiningJsonRpcRequest`](modules.md#ethminingjsonrpcrequest)) => `Promise`\<[`EthMiningJsonRpcResponse`](modules.md#ethminingjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthMiningJsonRpcResponse`](modules.md#ethminingjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthMiningJsonRpcRequest`](modules.md#ethminingjsonrpcrequest) |

##### Returns

`Promise`\<[`EthMiningJsonRpcResponse`](modules.md#ethminingjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:191](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L191)

___

### EthMiningJsonRpcRequest

Ƭ **EthMiningJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_mining"``, readonly []\>

JSON-RPC request for `eth_mining` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:228](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L228)

___

### EthMiningJsonRpcResponse

Ƭ **EthMiningJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_mining"``, `boolean`, `string`\>

JSON-RPC response for `eth_mining` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:280](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L280)

___

### EthMiningParams

Ƭ **EthMiningParams**: `EmptyParams`

JSON-RPC request for `eth_mining` procedure

#### Defined in

[params/EthParams.ts:184](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L184)

___

### EthMiningResult

Ƭ **EthMiningResult**: `boolean`

JSON-RPC response for `eth_mining` procedure

#### Defined in

[result/EthResult.ts:173](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L173)

___

### EthNewBlockFilterHandler

Ƭ **EthNewBlockFilterHandler**: (`request`: [`EthNewBlockFilterParams`](modules.md#ethnewblockfilterparams)) => `Promise`\<[`EthNewBlockFilterResult`](modules.md#ethnewblockfilterresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthNewBlockFilterResult`](modules.md#ethnewblockfilterresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthNewBlockFilterParams`](modules.md#ethnewblockfilterparams) |

##### Returns

`Promise`\<[`EthNewBlockFilterResult`](modules.md#ethnewblockfilterresult)\>

#### Defined in

[handlers/EthHandler.ts:219](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L219)

___

### EthNewBlockFilterJsonRpcProcedure

Ƭ **EthNewBlockFilterJsonRpcProcedure**: (`request`: [`EthNewBlockFilterJsonRpcRequest`](modules.md#ethnewblockfilterjsonrpcrequest)) => `Promise`\<[`EthNewBlockFilterJsonRpcResponse`](modules.md#ethnewblockfilterjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthNewBlockFilterJsonRpcResponse`](modules.md#ethnewblockfilterjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthNewBlockFilterJsonRpcRequest`](modules.md#ethnewblockfilterjsonrpcrequest) |

##### Returns

`Promise`\<[`EthNewBlockFilterJsonRpcResponse`](modules.md#ethnewblockfilterjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:223](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L223)

___

### EthNewBlockFilterJsonRpcRequest

Ƭ **EthNewBlockFilterJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_newBlockFilter"``, readonly []\>

JSON-RPC request for `eth_newBlockFilter` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:300](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L300)

___

### EthNewBlockFilterJsonRpcResponse

Ƭ **EthNewBlockFilterJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_newBlockFilter"``, `Hex`, `string`\>

JSON-RPC response for `eth_newBlockFilter` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:375](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L375)

___

### EthNewBlockFilterParams

Ƭ **EthNewBlockFilterParams**: `EmptyParams`

JSON-RPC request for `eth_newBlockFilter` procedure

#### Defined in

[params/EthParams.ts:224](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L224)

___

### EthNewBlockFilterResult

Ƭ **EthNewBlockFilterResult**: `Hex`

JSON-RPC response for `eth_newBlockFilter` procedure

#### Defined in

[result/EthResult.ts:241](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L241)

___

### EthNewFilterHandler

Ƭ **EthNewFilterHandler**: (`request`: [`EthNewFilterParams`](modules.md#ethnewfilterparams)) => `Promise`\<[`EthNewFilterResult`](modules.md#ethnewfilterresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthNewFilterResult`](modules.md#ethnewfilterresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthNewFilterParams`](modules.md#ethnewfilterparams) |

##### Returns

`Promise`\<[`EthNewFilterResult`](modules.md#ethnewfilterresult)\>

#### Defined in

[handlers/EthHandler.ts:215](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L215)

___

### EthNewFilterJsonRpcProcedure

Ƭ **EthNewFilterJsonRpcProcedure**: (`request`: [`EthNewFilterJsonRpcRequest`](modules.md#ethnewfilterjsonrpcrequest)) => `Promise`\<[`EthNewFilterJsonRpcResponse`](modules.md#ethnewfilterjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthNewFilterJsonRpcResponse`](modules.md#ethnewfilterjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthNewFilterJsonRpcRequest`](modules.md#ethnewfilterjsonrpcrequest) |

##### Returns

`Promise`\<[`EthNewFilterJsonRpcResponse`](modules.md#ethnewfilterjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:219](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L219)

___

### EthNewFilterJsonRpcRequest

Ƭ **EthNewFilterJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_newFilter"``, `SerializeToJson`\<`FilterParams`\>\>

JSON-RPC request for `eth_newFilter` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:292](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L292)

___

### EthNewFilterJsonRpcResponse

Ƭ **EthNewFilterJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_newFilter"``, `Hex`, `string`\>

JSON-RPC response for `eth_newFilter` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:365](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L365)

___

### EthNewFilterParams

Ƭ **EthNewFilterParams**: `FilterParams`

JSON-RPC request for `eth_newFilter` procedure

#### Defined in

[params/EthParams.ts:219](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L219)

___

### EthNewFilterResult

Ƭ **EthNewFilterResult**: `Hex`

JSON-RPC response for `eth_newFilter` procedure

#### Defined in

[result/EthResult.ts:235](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L235)

___

### EthNewPendingTransactionFilterHandler

Ƭ **EthNewPendingTransactionFilterHandler**: (`request`: [`EthNewPendingTransactionFilterParams`](modules.md#ethnewpendingtransactionfilterparams)) => `Promise`\<[`EthNewPendingTransactionFilterResult`](modules.md#ethnewpendingtransactionfilterresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthNewPendingTransactionFilterResult`](modules.md#ethnewpendingtransactionfilterresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthNewPendingTransactionFilterParams`](modules.md#ethnewpendingtransactionfilterparams) |

##### Returns

`Promise`\<[`EthNewPendingTransactionFilterResult`](modules.md#ethnewpendingtransactionfilterresult)\>

#### Defined in

[handlers/EthHandler.ts:223](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L223)

___

### EthNewPendingTransactionFilterJsonRpcProcedure

Ƭ **EthNewPendingTransactionFilterJsonRpcProcedure**: (`request`: [`EthNewPendingTransactionFilterJsonRpcRequest`](modules.md#ethnewpendingtransactionfilterjsonrpcrequest)) => `Promise`\<[`EthNewPendingTransactionFilterJsonRpcResponse`](modules.md#ethnewpendingtransactionfilterjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthNewPendingTransactionFilterJsonRpcResponse`](modules.md#ethnewpendingtransactionfilterjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthNewPendingTransactionFilterJsonRpcRequest`](modules.md#ethnewpendingtransactionfilterjsonrpcrequest) |

##### Returns

`Promise`\<[`EthNewPendingTransactionFilterJsonRpcResponse`](modules.md#ethnewpendingtransactionfilterjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:227](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L227)

___

### EthNewPendingTransactionFilterJsonRpcRequest

Ƭ **EthNewPendingTransactionFilterJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_newPendingTransactionFilter"``, readonly []\>

JSON-RPC request for `eth_newPendingTransactionFilter` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:308](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L308)

___

### EthNewPendingTransactionFilterJsonRpcResponse

Ƭ **EthNewPendingTransactionFilterJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_newPendingTransactionFilter"``, `Hex`, `string`\>

JSON-RPC response for `eth_newPendingTransactionFilter` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:386](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L386)

___

### EthNewPendingTransactionFilterParams

Ƭ **EthNewPendingTransactionFilterParams**: `EmptyParams`

JSON-RPC request for `eth_newPendingTransactionFilter` procedure

#### Defined in

[params/EthParams.ts:229](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L229)

___

### EthNewPendingTransactionFilterResult

Ƭ **EthNewPendingTransactionFilterResult**: `Hex`

JSON-RPC response for `eth_newPendingTransactionFilter` procedure

#### Defined in

[result/EthResult.ts:247](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L247)

___

### EthParams

Ƭ **EthParams**: [`EthAccountsParams`](modules.md#ethaccountsparams) \| [`EthAccountsParams`](modules.md#ethaccountsparams) \| [`EthBlockNumberParams`](modules.md#ethblocknumberparams) \| [`EthCallParams`](modules.md#ethcallparams) \| [`EthChainIdParams`](modules.md#ethchainidparams) \| [`EthCoinbaseParams`](modules.md#ethcoinbaseparams) \| [`EthEstimateGasParams`](modules.md#ethestimategasparams) \| [`EthHashrateParams`](modules.md#ethhashrateparams) \| [`EthGasPriceParams`](modules.md#ethgaspriceparams) \| [`EthGetBalanceParams`](modules.md#ethgetbalanceparams) \| [`EthGetBlockByHashParams`](modules.md#ethgetblockbyhashparams) \| [`EthGetBlockByNumberParams`](modules.md#ethgetblockbynumberparams) \| [`EthGetBlockTransactionCountByHashParams`](modules.md#ethgetblocktransactioncountbyhashparams) \| [`EthGetBlockTransactionCountByNumberParams`](modules.md#ethgetblocktransactioncountbynumberparams) \| [`EthGetCodeParams`](modules.md#ethgetcodeparams) \| [`EthGetFilterChangesParams`](modules.md#ethgetfilterchangesparams) \| [`EthGetFilterLogsParams`](modules.md#ethgetfilterlogsparams) \| [`EthGetLogsParams`](modules.md#ethgetlogsparams) \| [`EthGetStorageAtParams`](modules.md#ethgetstorageatparams) \| [`EthGetTransactionCountParams`](modules.md#ethgettransactioncountparams) \| [`EthGetUncleCountByBlockHashParams`](modules.md#ethgetunclecountbyblockhashparams) \| [`EthGetUncleCountByBlockNumberParams`](modules.md#ethgetunclecountbyblocknumberparams) \| [`EthGetTransactionByHashParams`](modules.md#ethgettransactionbyhashparams) \| [`EthGetTransactionByBlockHashAndIndexParams`](modules.md#ethgettransactionbyblockhashandindexparams) \| [`EthGetTransactionByBlockNumberAndIndexParams`](modules.md#ethgettransactionbyblocknumberandindexparams) \| [`EthGetTransactionReceiptParams`](modules.md#ethgettransactionreceiptparams) \| [`EthGetUncleByBlockHashAndIndexParams`](modules.md#ethgetunclebyblockhashandindexparams) \| [`EthGetUncleByBlockNumberAndIndexParams`](modules.md#ethgetunclebyblocknumberandindexparams) \| [`EthMiningParams`](modules.md#ethminingparams) \| [`EthProtocolVersionParams`](modules.md#ethprotocolversionparams) \| [`EthSendRawTransactionParams`](modules.md#ethsendrawtransactionparams) \| [`EthSendTransactionParams`](modules.md#ethsendtransactionparams) \| [`EthSignParams`](modules.md#ethsignparams) \| [`EthSignTransactionParams`](modules.md#ethsigntransactionparams) \| [`EthSyncingParams`](modules.md#ethsyncingparams) \| [`EthNewFilterParams`](modules.md#ethnewfilterparams) \| [`EthNewBlockFilterParams`](modules.md#ethnewblockfilterparams) \| [`EthNewPendingTransactionFilterParams`](modules.md#ethnewpendingtransactionfilterparams) \| [`EthUninstallFilterParams`](modules.md#ethuninstallfilterparams)

#### Defined in

[params/EthParams.ts:236](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L236)

___

### EthProtocolVersionHandler

Ƭ **EthProtocolVersionHandler**: (`request`: [`EthProtocolVersionParams`](modules.md#ethprotocolversionparams)) => `Promise`\<[`EthProtocolVersionResult`](modules.md#ethprotocolversionresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthProtocolVersionResult`](modules.md#ethprotocolversionresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthProtocolVersionParams`](modules.md#ethprotocolversionparams) |

##### Returns

`Promise`\<[`EthProtocolVersionResult`](modules.md#ethprotocolversionresult)\>

#### Defined in

[handlers/EthHandler.ts:193](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L193)

___

### EthProtocolVersionJsonRpcProcedure

Ƭ **EthProtocolVersionJsonRpcProcedure**: (`request`: [`EthProtocolVersionJsonRpcRequest`](modules.md#ethprotocolversionjsonrpcrequest)) => `Promise`\<[`EthProtocolVersionJsonRpcResponse`](modules.md#ethprotocolversionjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthProtocolVersionJsonRpcResponse`](modules.md#ethprotocolversionjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthProtocolVersionJsonRpcRequest`](modules.md#ethprotocolversionjsonrpcrequest) |

##### Returns

`Promise`\<[`EthProtocolVersionJsonRpcResponse`](modules.md#ethprotocolversionjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:195](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L195)

___

### EthProtocolVersionJsonRpcRequest

Ƭ **EthProtocolVersionJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_protocolVersion"``, readonly []\>

JSON-RPC request for `eth_protocolVersion` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:233](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L233)

___

### EthProtocolVersionJsonRpcResponse

Ƭ **EthProtocolVersionJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_protocolVersion"``, `Hex`, `string`\>

JSON-RPC response for `eth_protocolVersion` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:290](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L290)

___

### EthProtocolVersionParams

Ƭ **EthProtocolVersionParams**: `EmptyParams`

JSON-RPC request for `eth_protocolVersion` procedure

#### Defined in

[params/EthParams.ts:189](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L189)

___

### EthProtocolVersionResult

Ƭ **EthProtocolVersionResult**: `Hex`

JSON-RPC response for `eth_protocolVersion` procedure

#### Defined in

[result/EthResult.ts:179](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L179)

___

### EthSendRawTransactionHandler

Ƭ **EthSendRawTransactionHandler**: (`request`: [`EthSendRawTransactionParams`](modules.md#ethsendrawtransactionparams)) => `Promise`\<[`EthSendRawTransactionResult`](modules.md#ethsendrawtransactionresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSendRawTransactionResult`](modules.md#ethsendrawtransactionresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSendRawTransactionParams`](modules.md#ethsendrawtransactionparams) |

##### Returns

`Promise`\<[`EthSendRawTransactionResult`](modules.md#ethsendrawtransactionresult)\>

#### Defined in

[handlers/EthHandler.ts:197](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L197)

___

### EthSendRawTransactionJsonRpcProcedure

Ƭ **EthSendRawTransactionJsonRpcProcedure**: (`request`: [`EthSendRawTransactionJsonRpcRequest`](modules.md#ethsendrawtransactionjsonrpcrequest)) => `Promise`\<[`EthSendRawTransactionJsonRpcResponse`](modules.md#ethsendrawtransactionjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSendRawTransactionJsonRpcResponse`](modules.md#ethsendrawtransactionjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSendRawTransactionJsonRpcRequest`](modules.md#ethsendrawtransactionjsonrpcrequest) |

##### Returns

`Promise`\<[`EthSendRawTransactionJsonRpcResponse`](modules.md#ethsendrawtransactionjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:199](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L199)

___

### EthSendRawTransactionJsonRpcRequest

Ƭ **EthSendRawTransactionJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_sendRawTransaction"``, [data: Hex]\>

JSON-RPC request for `eth_sendRawTransaction` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:241](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L241)

___

### EthSendRawTransactionJsonRpcResponse

Ƭ **EthSendRawTransactionJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_sendRawTransaction"``, `Hex`, `string`\>

JSON-RPC response for `eth_sendRawTransaction` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:300](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L300)

___

### EthSendRawTransactionParams

Ƭ **EthSendRawTransactionParams**: `SendRawTransactionParameters`

JSON-RPC request for `eth_sendRawTransaction` procedure

#### Defined in

[params/EthParams.ts:194](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L194)

___

### EthSendRawTransactionResult

Ƭ **EthSendRawTransactionResult**: `Hex`

JSON-RPC response for `eth_sendRawTransaction` procedure

#### Defined in

[result/EthResult.ts:185](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L185)

___

### EthSendTransactionHandler

Ƭ **EthSendTransactionHandler**: (`request`: [`EthSendTransactionParams`](modules.md#ethsendtransactionparams)) => `Promise`\<[`EthSendTransactionResult`](modules.md#ethsendtransactionresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSendTransactionResult`](modules.md#ethsendtransactionresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSendTransactionParams`](modules.md#ethsendtransactionparams) |

##### Returns

`Promise`\<[`EthSendTransactionResult`](modules.md#ethsendtransactionresult)\>

#### Defined in

[handlers/EthHandler.ts:201](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L201)

___

### EthSendTransactionJsonRpcProcedure

Ƭ **EthSendTransactionJsonRpcProcedure**: (`request`: [`EthSendTransactionJsonRpcRequest`](modules.md#ethsendtransactionjsonrpcrequest)) => `Promise`\<[`EthSendTransactionJsonRpcResponse`](modules.md#ethsendtransactionjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSendTransactionJsonRpcResponse`](modules.md#ethsendtransactionjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSendTransactionJsonRpcRequest`](modules.md#ethsendtransactionjsonrpcrequest) |

##### Returns

`Promise`\<[`EthSendTransactionJsonRpcResponse`](modules.md#ethsendtransactionjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:203](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L203)

___

### EthSendTransactionJsonRpcRequest

Ƭ **EthSendTransactionJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_sendTransaction"``, [tx: Transaction]\>

JSON-RPC request for `eth_sendTransaction` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:249](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L249)

___

### EthSendTransactionJsonRpcResponse

Ƭ **EthSendTransactionJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_sendTransaction"``, `Hex`, `string`\>

JSON-RPC response for `eth_sendTransaction` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:310](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L310)

___

### EthSendTransactionParams

Ƭ **EthSendTransactionParams**: `SendTransactionParameters`

JSON-RPC request for `eth_sendTransaction` procedure

#### Defined in

[params/EthParams.ts:199](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L199)

___

### EthSendTransactionResult

Ƭ **EthSendTransactionResult**: `Hex`

JSON-RPC response for `eth_sendTransaction` procedure

#### Defined in

[result/EthResult.ts:191](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L191)

___

### EthSignHandler

Ƭ **EthSignHandler**: (`request`: [`EthSignParams`](modules.md#ethsignparams)) => `Promise`\<[`EthSignResult`](modules.md#ethsignresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSignResult`](modules.md#ethsignresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSignParams`](modules.md#ethsignparams) |

##### Returns

`Promise`\<[`EthSignResult`](modules.md#ethsignresult)\>

#### Defined in

[handlers/EthHandler.ts:205](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L205)

___

### EthSignJsonRpcProcedure

Ƭ **EthSignJsonRpcProcedure**: (`request`: [`EthSignJsonRpcRequest`](modules.md#ethsignjsonrpcrequest)) => `Promise`\<[`EthSignJsonRpcResponse`](modules.md#ethsignjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSignJsonRpcResponse`](modules.md#ethsignjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSignJsonRpcRequest`](modules.md#ethsignjsonrpcrequest) |

##### Returns

`Promise`\<[`EthSignJsonRpcResponse`](modules.md#ethsignjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:207](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L207)

___

### EthSignJsonRpcRequest

Ƭ **EthSignJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_sign"``, [address: Address, message: Hex]\>

JSON-RPC request for `eth_sign` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:257](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L257)

___

### EthSignJsonRpcResponse

Ƭ **EthSignJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_sign"``, `Hex`, `string`\>

JSON-RPC response for `eth_sign` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:320](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L320)

___

### EthSignParams

Ƭ **EthSignParams**: `SignMessageParameters`

JSON-RPC request for `eth_sign` procedure

#### Defined in

[params/EthParams.ts:204](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L204)

___

### EthSignResult

Ƭ **EthSignResult**: `Hex`

JSON-RPC response for `eth_sign` procedure

#### Defined in

[result/EthResult.ts:197](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L197)

___

### EthSignTransactionHandler

Ƭ **EthSignTransactionHandler**: (`request`: [`EthSignTransactionParams`](modules.md#ethsigntransactionparams)) => `Promise`\<[`EthSignTransactionResult`](modules.md#ethsigntransactionresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSignTransactionResult`](modules.md#ethsigntransactionresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSignTransactionParams`](modules.md#ethsigntransactionparams) |

##### Returns

`Promise`\<[`EthSignTransactionResult`](modules.md#ethsigntransactionresult)\>

#### Defined in

[handlers/EthHandler.ts:207](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L207)

___

### EthSignTransactionJsonRpcProcedure

Ƭ **EthSignTransactionJsonRpcProcedure**: (`request`: [`EthSignTransactionJsonRpcRequest`](modules.md#ethsigntransactionjsonrpcrequest)) => `Promise`\<[`EthSignTransactionJsonRpcResponse`](modules.md#ethsigntransactionjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSignTransactionJsonRpcResponse`](modules.md#ethsigntransactionjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSignTransactionJsonRpcRequest`](modules.md#ethsigntransactionjsonrpcrequest) |

##### Returns

`Promise`\<[`EthSignTransactionJsonRpcResponse`](modules.md#ethsigntransactionjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:211](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L211)

___

### EthSignTransactionJsonRpcRequest

Ƭ **EthSignTransactionJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_signTransaction"``, [\{ `chainId?`: `Hex` ; `data?`: `Hex` ; `from`: `Address` ; `gas?`: `Hex` ; `gasPrice?`: `Hex` ; `nonce?`: `Hex` ; `to?`: `Address` ; `value?`: `Hex`  }]\>

JSON-RPC request for `eth_signTransaction` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:265](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L265)

___

### EthSignTransactionJsonRpcResponse

Ƭ **EthSignTransactionJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_signTransaction"``, `Hex`, `string`\>

JSON-RPC response for `eth_signTransaction` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:326](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L326)

___

### EthSignTransactionParams

Ƭ **EthSignTransactionParams**: `SignMessageParameters`

JSON-RPC request for `eth_signTransaction` procedure

#### Defined in

[params/EthParams.ts:209](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L209)

___

### EthSignTransactionResult

Ƭ **EthSignTransactionResult**: `Hex`

JSON-RPC response for `eth_signTransaction` procedure

#### Defined in

[result/EthResult.ts:203](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L203)

___

### EthSyncingHandler

Ƭ **EthSyncingHandler**: (`request`: [`EthSyncingParams`](modules.md#ethsyncingparams)) => `Promise`\<[`EthSyncingResult`](modules.md#ethsyncingresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSyncingResult`](modules.md#ethsyncingresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSyncingParams`](modules.md#ethsyncingparams) |

##### Returns

`Promise`\<[`EthSyncingResult`](modules.md#ethsyncingresult)\>

#### Defined in

[handlers/EthHandler.ts:211](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L211)

___

### EthSyncingJsonRpcProcedure

Ƭ **EthSyncingJsonRpcProcedure**: (`request`: [`EthSyncingJsonRpcRequest`](modules.md#ethsyncingjsonrpcrequest)) => `Promise`\<[`EthSyncingJsonRpcResponse`](modules.md#ethsyncingjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSyncingJsonRpcResponse`](modules.md#ethsyncingjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSyncingJsonRpcRequest`](modules.md#ethsyncingjsonrpcrequest) |

##### Returns

`Promise`\<[`EthSyncingJsonRpcResponse`](modules.md#ethsyncingjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:215](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L215)

___

### EthSyncingJsonRpcRequest

Ƭ **EthSyncingJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_syncing"``, readonly []\>

JSON-RPC request for `eth_syncing` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:284](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L284)

___

### EthSyncingJsonRpcResponse

Ƭ **EthSyncingJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_syncing"``, `boolean` \| \{ `currentBlock`: `Hex` ; `headedBytecodebytes?`: `Hex` ; `healedBytecodes?`: `Hex` ; `healedTrienodes?`: `Hex` ; `healingBytecode?`: `Hex` ; `healingTrienodes?`: `Hex` ; `highestBlock`: `Hex` ; `knownStates`: `Hex` ; `pulledStates`: `Hex` ; `startingBlock`: `Hex` ; `syncedBytecodeBytes?`: `Hex` ; `syncedBytecodes?`: `Hex` ; `syncedStorage?`: `Hex` ; `syncedStorageBytes?`: `Hex`  }, `string`\>

JSON-RPC response for `eth_syncing` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:336](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L336)

___

### EthSyncingParams

Ƭ **EthSyncingParams**: `EmptyParams`

JSON-RPC request for `eth_syncing` procedure

#### Defined in

[params/EthParams.ts:214](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L214)

___

### EthSyncingResult

Ƭ **EthSyncingResult**: `boolean` \| \{ `currentBlock`: `Hex` ; `headedBytecodebytes?`: `Hex` ; `healedBytecodes?`: `Hex` ; `healedTrienodes?`: `Hex` ; `healingBytecode?`: `Hex` ; `healingTrienodes?`: `Hex` ; `highestBlock`: `Hex` ; `knownStates`: `Hex` ; `pulledStates`: `Hex` ; `startingBlock`: `Hex` ; `syncedBytecodeBytes?`: `Hex` ; `syncedBytecodes?`: `Hex` ; `syncedStorage?`: `Hex` ; `syncedStorageBytes?`: `Hex`  }

JSON-RPC response for `eth_syncing` procedure

#### Defined in

[result/EthResult.ts:209](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L209)

___

### EthUninstallFilterHandler

Ƭ **EthUninstallFilterHandler**: (`request`: [`EthUninstallFilterParams`](modules.md#ethuninstallfilterparams)) => `Promise`\<[`EthUninstallFilterResult`](modules.md#ethuninstallfilterresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthUninstallFilterResult`](modules.md#ethuninstallfilterresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthUninstallFilterParams`](modules.md#ethuninstallfilterparams) |

##### Returns

`Promise`\<[`EthUninstallFilterResult`](modules.md#ethuninstallfilterresult)\>

#### Defined in

[handlers/EthHandler.ts:227](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L227)

___

### EthUninstallFilterJsonRpcProcedure

Ƭ **EthUninstallFilterJsonRpcProcedure**: (`request`: [`EthUninstallFilterJsonRpcRequest`](modules.md#ethuninstallfilterjsonrpcrequest)) => `Promise`\<[`EthUninstallFilterJsonRpcResponse`](modules.md#ethuninstallfilterjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthUninstallFilterJsonRpcResponse`](modules.md#ethuninstallfilterjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthUninstallFilterJsonRpcRequest`](modules.md#ethuninstallfilterjsonrpcrequest) |

##### Returns

`Promise`\<[`EthUninstallFilterJsonRpcResponse`](modules.md#ethuninstallfilterjsonrpcresponse)\>

#### Defined in

[procedure/EthProcedure.ts:231](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L231)

___

### EthUninstallFilterJsonRpcRequest

Ƭ **EthUninstallFilterJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"eth_uninstallFilter"``, [filterId: Hex]\>

JSON-RPC request for `eth_uninstallFilter` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:316](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L316)

___

### EthUninstallFilterJsonRpcResponse

Ƭ **EthUninstallFilterJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"eth_uninstallFilter"``, `boolean`, `string`\>

JSON-RPC response for `eth_uninstallFilter` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:397](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L397)

___

### EthUninstallFilterParams

Ƭ **EthUninstallFilterParams**: `Object`

JSON-RPC request for `eth_uninstallFilter` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `filterId` | `Hex` |

#### Defined in

[params/EthParams.ts:234](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L234)

___

### EthUninstallFilterResult

Ƭ **EthUninstallFilterResult**: `boolean`

JSON-RPC response for `eth_uninstallFilter` procedure

#### Defined in

[result/EthResult.ts:253](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L253)

___

### EvmError

Ƭ **EvmError**\<`TEVMErrorMessage`\>: [`TypedError`](modules.md#typederror)\<`TEVMErrorMessage`\>

Error type of errors thrown while internally executing a call in the EVM

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEVMErrorMessage` | extends [`TevmEVMErrorMessage`](modules.md#tevmevmerrormessage) = [`TevmEVMErrorMessage`](modules.md#tevmevmerrormessage) |

#### Defined in

[errors/EvmError.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/EvmError.ts#L45)

___

### FilterLog

Ƭ **FilterLog**: `Object`

FilterLog type for eth JSON-RPC procedures

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | `Hex` |
| `blockHash` | `Hex` |
| `blockNumber` | `Hex` |
| `data` | `Hex` |
| `logIndex` | `Hex` |
| `removed` | `boolean` |
| `topics` | readonly `Hex`[] |
| `transactionHash` | `Hex` |
| `transactionIndex` | `Hex` |

#### Defined in

[common/FilterLog.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/common/FilterLog.ts#L6)

___

### InvalidAddressError

Ƭ **InvalidAddressError**: [`TypedError`](modules.md#typederror)\<``"InvalidAddressError"``\>

Error thrown when address is invalid

#### Defined in

[errors/InvalidAddressError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidAddressError.ts#L6)

___

### InvalidBalanceError

Ƭ **InvalidBalanceError**: [`TypedError`](modules.md#typederror)\<``"InvalidBalanceError"``\>

Error thrown when balance parameter is invalid

#### Defined in

[errors/InvalidBalanceError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidBalanceError.ts#L6)

___

### InvalidBlobVersionedHashesError

Ƭ **InvalidBlobVersionedHashesError**: [`TypedError`](modules.md#typederror)\<``"InvalidBlobVersionedHashesError"``\>

Error thrown when blobVersionedHashes parameter is invalid

#### Defined in

[errors/InvalidBlobVersionedHashesError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidBlobVersionedHashesError.ts#L6)

___

### InvalidBlockError

Ƭ **InvalidBlockError**: [`TypedError`](modules.md#typederror)\<``"InvalidBlockError"``\>

Error thrown when block parameter is invalid

#### Defined in

[errors/InvalidBlockError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidBlockError.ts#L6)

___

### InvalidBytecodeError

Ƭ **InvalidBytecodeError**: [`TypedError`](modules.md#typederror)\<``"InvalidBytecodeError"``\>

Error thrown when bytecode parameter is invalid

#### Defined in

[errors/InvalidBytecodeError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidBytecodeError.ts#L6)

___

### InvalidCallerError

Ƭ **InvalidCallerError**: [`TypedError`](modules.md#typederror)\<``"InvalidCallerError"``\>

Error thrown when caller parameter is invalid

#### Defined in

[errors/InvalidCallerError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidCallerError.ts#L6)

___

### InvalidDataError

Ƭ **InvalidDataError**: [`TypedError`](modules.md#typederror)\<``"InvalidDataError"``\>

Error thrown when data parameter is invalid

#### Defined in

[errors/InvalidDataError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidDataError.ts#L6)

___

### InvalidDeployedBytecodeError

Ƭ **InvalidDeployedBytecodeError**: [`TypedError`](modules.md#typederror)\<``"InvalidDeployedBytecodeError"``\>

Error thrown when deployedBytecode parameter is invalid

#### Defined in

[errors/InvalidDeployedBytecodeError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidDeployedBytecodeError.ts#L6)

___

### InvalidDepthError

Ƭ **InvalidDepthError**: [`TypedError`](modules.md#typederror)\<``"InvalidDepthError"``\>

Error thrown when depth parameter is invalid

#### Defined in

[errors/InvalidDepthError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidDepthError.ts#L6)

___

### InvalidFunctionNameError

Ƭ **InvalidFunctionNameError**: [`TypedError`](modules.md#typederror)\<``"InvalidFunctionNameError"``\>

Error thrown when function name is invalid

#### Defined in

[errors/InvalidFunctionNameError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidFunctionNameError.ts#L6)

___

### InvalidGasLimitError

Ƭ **InvalidGasLimitError**: [`TypedError`](modules.md#typederror)\<``"InvalidGasLimitError"``\>

Error thrown when gas limit is invalid

#### Defined in

[errors/InvalidGasLimitError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidGasLimitError.ts#L6)

___

### InvalidGasPriceError

Ƭ **InvalidGasPriceError**: [`TypedError`](modules.md#typederror)\<``"InvalidGasPriceError"``\>

Error thrown when gasPrice parameter is invalid

#### Defined in

[errors/InvalidGasPriceError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidGasPriceError.ts#L6)

___

### InvalidGasRefundError

Ƭ **InvalidGasRefundError**: [`TypedError`](modules.md#typederror)\<``"InvalidGasRefundError"``\>

Error thrown when gas refund is invalid

#### Defined in

[errors/InvalidGasRefundError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidGasRefundError.ts#L6)

___

### InvalidNonceError

Ƭ **InvalidNonceError**: [`TypedError`](modules.md#typederror)\<``"InvalidNonceError"``\>

Error thrown when nonce parameter is invalid

#### Defined in

[errors/InvalidNonceError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidNonceError.ts#L6)

___

### InvalidOriginError

Ƭ **InvalidOriginError**: [`TypedError`](modules.md#typederror)\<``"InvalidOriginError"``\>

Error thrown when origin parameter is invalid

#### Defined in

[errors/InvalidOriginError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidOriginError.ts#L6)

___

### InvalidRequestError

Ƭ **InvalidRequestError**: [`TypedError`](modules.md#typederror)\<``"InvalidRequestError"``\>

Error thrown when request is invalid

#### Defined in

[errors/InvalidRequestError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidRequestError.ts#L6)

___

### InvalidSaltError

Ƭ **InvalidSaltError**: [`TypedError`](modules.md#typederror)\<``"InvalidSaltError"``\>

Error thrown when salt parameter is invalid

#### Defined in

[errors/InvalidSaltError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidSaltError.ts#L6)

___

### InvalidSelfdestructError

Ƭ **InvalidSelfdestructError**: [`TypedError`](modules.md#typederror)\<``"InvalidSelfdestructError"``\>

Error thrown when selfdestruct parameter is invalid

#### Defined in

[errors/InvalidSelfdestructError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidSelfdestructError.ts#L6)

___

### InvalidSkipBalanceError

Ƭ **InvalidSkipBalanceError**: [`TypedError`](modules.md#typederror)\<``"InvalidSkipBalanceError"``\>

Error thrown when skipBalance parameter is invalid

#### Defined in

[errors/InvalidSkipBalanceError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidSkipBalanceError.ts#L6)

___

### InvalidStorageRootError

Ƭ **InvalidStorageRootError**: [`TypedError`](modules.md#typederror)\<``"InvalidStorageRootError"``\>

Error thrown when storage root parameter is invalid

#### Defined in

[errors/InvalidStorageRootError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidStorageRootError.ts#L6)

___

### InvalidToError

Ƭ **InvalidToError**: [`TypedError`](modules.md#typederror)\<``"InvalidToError"``\>

Error thrown when `to` parameter is invalid

#### Defined in

[errors/InvalidToError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidToError.ts#L6)

___

### InvalidValueError

Ƭ **InvalidValueError**: [`TypedError`](modules.md#typederror)\<``"InvalidValueError"``\>

Error thrown when value parameter is invalid

#### Defined in

[errors/InvalidValueError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidValueError.ts#L6)

___

### JsonRpcRequest

Ƭ **JsonRpcRequest**\<`TMethod`, `TParams`\>: \{ `id?`: `string` \| `number` \| ``null`` ; `jsonrpc`: ``"2.0"`` ; `method`: `TMethod`  } & `TParams` extends readonly [] ? \{ `params?`: `TParams`  } : \{ `params`: `TParams`  }

Helper type for creating JSON-RPC request types

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TMethod` | extends `string` |
| `TParams` | `TParams` |

#### Defined in

[requests/JsonRpcRequest.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/JsonRpcRequest.ts#L4)

___

### JsonRpcResponse

Ƭ **JsonRpcResponse**\<`TMethod`, `TResult`, `TErrorCode`\>: \{ `error?`: `never` ; `id?`: `string` \| `number` \| ``null`` ; `jsonrpc`: ``"2.0"`` ; `method`: `TMethod` ; `result`: `TResult`  } \| \{ `error`: \{ `code`: `TErrorCode` ; `message`: `string`  } ; `id?`: `string` \| `number` \| ``null`` ; `jsonrpc`: ``"2.0"`` ; `method`: `TMethod` ; `result?`: `never`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TMethod` | extends `string` |
| `TResult` | `TResult` |
| `TErrorCode` | extends `string` |

#### Defined in

[responses/JsonRpcResponse.ts:1](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/JsonRpcResponse.ts#L1)

___

### Log

Ƭ **Log**: `Object`

Generic log information

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `data` | `Hex` |
| `topics` | `Hex`[] |

#### Defined in

[common/Log.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/common/Log.ts#L7)

___

### ScriptError

Ƭ **ScriptError**: [`ContractError`](modules.md#contracterror) \| [`InvalidBytecodeError`](modules.md#invalidbytecodeerror) \| [`InvalidDeployedBytecodeError`](modules.md#invaliddeployedbytecodeerror)

Error type of errors thrown by the script procedure

**`Example`**

```ts
const {errors} = await tevm.script({address: '0x1234'})
if (errors?.length) {
 console.log(errors[0].name) // InvalidBytecodeError
 console.log(errors[0].message) // Invalid bytecode should be a hex string: 1234
}
```

#### Defined in

[errors/ScriptError.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/ScriptError.ts#L14)

___

### ScriptHandler

Ƭ **ScriptHandler**: \<TAbi, TFunctionName\>(`params`: [`ScriptParams`](modules.md#scriptparams)\<`TAbi`, `TFunctionName`\>) => `Promise`\<[`ScriptResult`](modules.md#scriptresult)\<`TAbi`, `TFunctionName`\>\>

#### Type declaration

▸ \<`TAbi`, `TFunctionName`\>(`params`): `Promise`\<[`ScriptResult`](modules.md#scriptresult)\<`TAbi`, `TFunctionName`\>\>

Handler for script tevm procedure

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\> |

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`ScriptParams`](modules.md#scriptparams)\<`TAbi`, `TFunctionName`\> |

##### Returns

`Promise`\<[`ScriptResult`](modules.md#scriptresult)\<`TAbi`, `TFunctionName`\>\>

#### Defined in

[handlers/ScriptHandler.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/ScriptHandler.ts#L8)

___

### ScriptJsonRpcProcedure

Ƭ **ScriptJsonRpcProcedure**: (`request`: [`ScriptJsonRpcRequest`](modules.md#scriptjsonrpcrequest)) => `Promise`\<[`ScriptJsonRpcResponse`](modules.md#scriptjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`ScriptJsonRpcResponse`](modules.md#scriptjsonrpcresponse)\>

Procedure for handling script JSON-RPC requests

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`ScriptJsonRpcRequest`](modules.md#scriptjsonrpcrequest) |

##### Returns

`Promise`\<[`ScriptJsonRpcResponse`](modules.md#scriptjsonrpcresponse)\>

#### Defined in

[procedure/ScriptJsonRpcProcedure.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/ScriptJsonRpcProcedure.ts#L6)

___

### ScriptJsonRpcRequest

Ƭ **ScriptJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"tevm_script"``, `SerializedParams`\>

The JSON-RPC request for the `tevm_script` method

#### Defined in

[requests/ScriptJsonRpcRequest.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/ScriptJsonRpcRequest.ts#L26)

___

### ScriptJsonRpcResponse

Ƭ **ScriptJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"tevm_script"``, `SerializeToJson`\<[`CallResult`](modules.md#callresult)\>, [`ScriptError`](modules.md#scripterror)[``"_tag"``]\>

JSON-RPC response for `tevm_script` procedure

#### Defined in

[responses/ScriptJsonRpcResponse.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/ScriptJsonRpcResponse.ts#L8)

___

### ScriptParams

Ƭ **ScriptParams**\<`TAbi`, `TFunctionName`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](modules.md#basecallparams) & \{ `deployedBytecode`: `Hex`  }

Tevm params for deploying and running a script

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\> |

#### Defined in

[params/ScriptParams.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/ScriptParams.ts#L12)

___

### ScriptResult

Ƭ **ScriptResult**\<`TAbi`, `TFunctionName`, `TErrorType`\>: [`ContractResult`](modules.md#contractresult)\<`TAbi`, `TFunctionName`, `TErrorType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\> |
| `TErrorType` | [`ScriptError`](modules.md#scripterror) |

#### Defined in

[result/ScriptResult.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/ScriptResult.ts#L6)

___

### Tevm

Ƭ **Tevm**: `Object`

The specification for the Tevm api
It has a request method for JSON-RPC requests and more ergonomic handler methods
for each type of request

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account` | [`AccountHandler`](modules.md#accounthandler) |
| `blockNumber` | [`EthBlockNumberHandler`](modules.md#ethblocknumberhandler) |
| `call` | [`CallHandler`](modules.md#callhandler) |
| `contract` | [`ContractHandler`](modules.md#contracthandler) |
| `request` | [`TevmJsonRpcRequestHandler`](modules.md#tevmjsonrpcrequesthandler) |
| `script` | [`ScriptHandler`](modules.md#scripthandler) |

#### Defined in

[Tevm.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/Tevm.ts#L15)

___

### TevmEVMErrorMessage

Ƭ **TevmEVMErrorMessage**: ``"out of gas"`` \| ``"code store out of gas"`` \| ``"code size to deposit exceeds maximum code size"`` \| ``"stack underflow"`` \| ``"stack overflow"`` \| ``"invalid JUMP"`` \| ``"invalid opcode"`` \| ``"value out of range"`` \| ``"revert"`` \| ``"static state change"`` \| ``"internal error"`` \| ``"create collision"`` \| ``"stop"`` \| ``"refund exhausted"`` \| ``"value overflow"`` \| ``"insufficient balance"`` \| ``"invalid BEGINSUB"`` \| ``"invalid RETURNSUB"`` \| ``"invalid JUMPSUB"`` \| ``"invalid bytecode deployed"`` \| ``"invalid EOF format"`` \| ``"initcode exceeds max initcode size"`` \| ``"invalid input length"`` \| ``"attempting to AUTHCALL without AUTH set"`` \| ``"attempting to execute AUTHCALL with nonzero external value"`` \| ``"invalid Signature: s-values greater than secp256k1n/2 are considered invalid"`` \| ``"invalid input length"`` \| ``"point not on curve"`` \| ``"input is empty"`` \| ``"fp point not in field"`` \| ``"kzg commitment does not match versioned hash"`` \| ``"kzg inputs invalid"`` \| ``"kzg proof invalid"``

#### Defined in

[errors/EvmError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/EvmError.ts#L3)

___

### TevmJsonRpcRequest

Ƭ **TevmJsonRpcRequest**: [`AccountJsonRpcRequest`](modules.md#accountjsonrpcrequest) \| [`CallJsonRpcRequest`](modules.md#calljsonrpcrequest) \| [`ContractJsonRpcRequest`](modules.md#contractjsonrpcrequest) \| [`ScriptJsonRpcRequest`](modules.md#scriptjsonrpcrequest)

A Tevm JSON-RPC request
`tevm_account`, `tevm_call`, `tevm_contract`, `tevm_script`

#### Defined in

[requests/TevmJsonRpcRequest.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/TevmJsonRpcRequest.ts#L10)

___

### TevmJsonRpcRequestHandler

Ƭ **TevmJsonRpcRequestHandler**: \<TRequest\>(`request`: `TRequest`) => `Promise`\<`ReturnType`\<`TRequest`[``"method"``]\>\>

#### Type declaration

▸ \<`TRequest`\>(`request`): `Promise`\<`ReturnType`\<`TRequest`[``"method"``]\>\>

Type of a JSON-RPC request handler for tevm procedures
Generic and returns the correct response type for a given request

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TRequest` | extends [`TevmJsonRpcRequest`](modules.md#tevmjsonrpcrequest) \| `EthJsonRpcRequest` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | `TRequest` |

##### Returns

`Promise`\<`ReturnType`\<`TRequest`[``"method"``]\>\>

#### Defined in

[TevmJsonRpcRequestHandler.ts:101](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/TevmJsonRpcRequestHandler.ts#L101)

___

### TransactionParams

Ƭ **TransactionParams**: `Object`

A transaction request object

#### Type declaration

| Name | Type |
| :------ | :------ |
| `from` | `Address` |
| `gas?` | `Hex` |
| `gasPrice?` | `Hex` |
| `input` | `Hex` |
| `nonce?` | `Hex` |
| `to?` | `Address` |
| `value?` | `Hex` |

#### Defined in

[common/TransactionParams.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/common/TransactionParams.ts#L7)

___

### TransactionReceiptResult

Ƭ **TransactionReceiptResult**: `Object`

Transaction receipt result type for eth JSON-RPC procedures

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockHash` | `Hex` |
| `blockNumber` | `Hex` |
| `contractAddress` | `Hex` |
| `cumulativeGasUsed` | `Hex` |
| `from` | `Hex` |
| `gasUsed` | `Hex` |
| `logs` | readonly [`FilterLog`](modules.md#filterlog)[] |
| `logsBloom` | `Hex` |
| `status` | `Hex` |
| `to` | `Hex` |
| `transactionHash` | `Hex` |
| `transactionIndex` | `Hex` |

#### Defined in

[common/TransactionReceiptResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/common/TransactionReceiptResult.ts#L7)

___

### TransactionResult

Ƭ **TransactionResult**: `Object`

The type returned by transaction related
json rpc procedures

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockHash` | `Hex` |
| `blockNumber` | `Hex` |
| `from` | `Hex` |
| `gas` | `Hex` |
| `gasPrice` | `Hex` |
| `hash` | `Hex` |
| `input` | `Hex` |
| `nonce` | `Hex` |
| `r` | `Hex` |
| `s` | `Hex` |
| `to` | `Hex` |
| `transactionIndex` | `Hex` |
| `v` | `Hex` |
| `value` | `Hex` |

#### Defined in

[common/TransactionResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/common/TransactionResult.ts#L7)

___

### TypedError

Ƭ **TypedError**\<`TName`, `TMeta`\>: `Object`

Internal utility for creating a typed error as typed by Tevm
`name` is analogous to `code` in a JSON RPC error and is the value used to discriminate errors
for tevm users.
`_tag` is same as name and used internally so it can be changed in non breaking way with regard to name
`message` is a human readable error message
`meta` is an optional object containing additional information about the error

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `TMeta` | `never` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_tag` | `TName` |
| `message` | `string` |
| `meta?` | `TMeta` |
| `name` | `TName` |

#### Defined in

[errors/TypedError.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/TypedError.ts#L9)

___

### UnexpectedError

Ƭ **UnexpectedError**: [`TypedError`](modules.md#typederror)\<``"UnexpectedError"``\>

Error representing an unknown error occurred
It should never get thrown. This error being thrown
means an error wasn't properly handled already

#### Defined in

[errors/UnexpectedError.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/UnexpectedError.ts#L8)

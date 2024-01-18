[tevm](../README.md) / [Modules](../modules.md) / api

# Module: api

## Table of contents

### References

- [AccountParams](api.md#accountparams)
- [AccountResult](api.md#accountresult)
- [CallParams](api.md#callparams)
- [CallResult](api.md#callresult)
- [ContractParams](api.md#contractparams)
- [ContractResult](api.md#contractresult)
- [ScriptParams](api.md#scriptparams)
- [ScriptResult](api.md#scriptresult)
- [TevmJsonRpcRequest](api.md#tevmjsonrpcrequest)
- [TevmJsonRpcRequestHandler](api.md#tevmjsonrpcrequesthandler)

### Type Aliases

- [AccountError](api.md#accounterror)
- [AccountHandler](api.md#accounthandler)
- [AccountJsonRpcProcedure](api.md#accountjsonrpcprocedure)
- [AccountJsonRpcRequest](api.md#accountjsonrpcrequest)
- [AccountJsonRpcResponse](api.md#accountjsonrpcresponse)
- [AnvilDropTransactionHandler](api.md#anvildroptransactionhandler)
- [AnvilDropTransactionJsonRpcRequest](api.md#anvildroptransactionjsonrpcrequest)
- [AnvilDropTransactionJsonRpcResponse](api.md#anvildroptransactionjsonrpcresponse)
- [AnvilDropTransactionParams](api.md#anvildroptransactionparams)
- [AnvilDropTransactionProcedure](api.md#anvildroptransactionprocedure)
- [AnvilDropTransactionResult](api.md#anvildroptransactionresult)
- [AnvilDumpStateHandler](api.md#anvildumpstatehandler)
- [AnvilDumpStateJsonRpcRequest](api.md#anvildumpstatejsonrpcrequest)
- [AnvilDumpStateJsonRpcResponse](api.md#anvildumpstatejsonrpcresponse)
- [AnvilDumpStateParams](api.md#anvildumpstateparams)
- [AnvilDumpStateProcedure](api.md#anvildumpstateprocedure)
- [AnvilDumpStateResult](api.md#anvildumpstateresult)
- [AnvilGetAutomineHandler](api.md#anvilgetautominehandler)
- [AnvilGetAutomineJsonRpcRequest](api.md#anvilgetautominejsonrpcrequest)
- [AnvilGetAutomineJsonRpcResponse](api.md#anvilgetautominejsonrpcresponse)
- [AnvilGetAutomineParams](api.md#anvilgetautomineparams)
- [AnvilGetAutomineProcedure](api.md#anvilgetautomineprocedure)
- [AnvilGetAutomineResult](api.md#anvilgetautomineresult)
- [AnvilImpersonateAccountHandler](api.md#anvilimpersonateaccounthandler)
- [AnvilImpersonateAccountJsonRpcRequest](api.md#anvilimpersonateaccountjsonrpcrequest)
- [AnvilImpersonateAccountJsonRpcResponse](api.md#anvilimpersonateaccountjsonrpcresponse)
- [AnvilImpersonateAccountParams](api.md#anvilimpersonateaccountparams)
- [AnvilImpersonateAccountProcedure](api.md#anvilimpersonateaccountprocedure)
- [AnvilImpersonateAccountResult](api.md#anvilimpersonateaccountresult)
- [AnvilLoadStateHandler](api.md#anvilloadstatehandler)
- [AnvilLoadStateJsonRpcRequest](api.md#anvilloadstatejsonrpcrequest)
- [AnvilLoadStateJsonRpcResponse](api.md#anvilloadstatejsonrpcresponse)
- [AnvilLoadStateParams](api.md#anvilloadstateparams)
- [AnvilLoadStateProcedure](api.md#anvilloadstateprocedure)
- [AnvilLoadStateResult](api.md#anvilloadstateresult)
- [AnvilMineHandler](api.md#anvilminehandler)
- [AnvilMineJsonRpcRequest](api.md#anvilminejsonrpcrequest)
- [AnvilMineJsonRpcResponse](api.md#anvilminejsonrpcresponse)
- [AnvilMineParams](api.md#anvilmineparams)
- [AnvilMineProcedure](api.md#anvilmineprocedure)
- [AnvilMineResult](api.md#anvilmineresult)
- [AnvilResetHandler](api.md#anvilresethandler)
- [AnvilResetJsonRpcRequest](api.md#anvilresetjsonrpcrequest)
- [AnvilResetJsonRpcResponse](api.md#anvilresetjsonrpcresponse)
- [AnvilResetParams](api.md#anvilresetparams)
- [AnvilResetProcedure](api.md#anvilresetprocedure)
- [AnvilResetResult](api.md#anvilresetresult)
- [AnvilSetBalanceHandler](api.md#anvilsetbalancehandler)
- [AnvilSetBalanceJsonRpcRequest](api.md#anvilsetbalancejsonrpcrequest)
- [AnvilSetBalanceJsonRpcResponse](api.md#anvilsetbalancejsonrpcresponse)
- [AnvilSetBalanceParams](api.md#anvilsetbalanceparams)
- [AnvilSetBalanceProcedure](api.md#anvilsetbalanceprocedure)
- [AnvilSetBalanceResult](api.md#anvilsetbalanceresult)
- [AnvilSetChainIdHandler](api.md#anvilsetchainidhandler)
- [AnvilSetChainIdJsonRpcRequest](api.md#anvilsetchainidjsonrpcrequest)
- [AnvilSetChainIdJsonRpcResponse](api.md#anvilsetchainidjsonrpcresponse)
- [AnvilSetChainIdParams](api.md#anvilsetchainidparams)
- [AnvilSetChainIdProcedure](api.md#anvilsetchainidprocedure)
- [AnvilSetChainIdResult](api.md#anvilsetchainidresult)
- [AnvilSetCodeHandler](api.md#anvilsetcodehandler)
- [AnvilSetCodeJsonRpcRequest](api.md#anvilsetcodejsonrpcrequest)
- [AnvilSetCodeJsonRpcResponse](api.md#anvilsetcodejsonrpcresponse)
- [AnvilSetCodeParams](api.md#anvilsetcodeparams)
- [AnvilSetCodeProcedure](api.md#anvilsetcodeprocedure)
- [AnvilSetCodeResult](api.md#anvilsetcoderesult)
- [AnvilSetNonceHandler](api.md#anvilsetnoncehandler)
- [AnvilSetNonceJsonRpcRequest](api.md#anvilsetnoncejsonrpcrequest)
- [AnvilSetNonceJsonRpcResponse](api.md#anvilsetnoncejsonrpcresponse)
- [AnvilSetNonceParams](api.md#anvilsetnonceparams)
- [AnvilSetNonceProcedure](api.md#anvilsetnonceprocedure)
- [AnvilSetNonceResult](api.md#anvilsetnonceresult)
- [AnvilSetStorageAtHandler](api.md#anvilsetstorageathandler)
- [AnvilSetStorageAtJsonRpcRequest](api.md#anvilsetstorageatjsonrpcrequest)
- [AnvilSetStorageAtJsonRpcResponse](api.md#anvilsetstorageatjsonrpcresponse)
- [AnvilSetStorageAtParams](api.md#anvilsetstorageatparams)
- [AnvilSetStorageAtProcedure](api.md#anvilsetstorageatprocedure)
- [AnvilSetStorageAtResult](api.md#anvilsetstorageatresult)
- [AnvilStopImpersonatingAccountHandler](api.md#anvilstopimpersonatingaccounthandler)
- [AnvilStopImpersonatingAccountJsonRpcRequest](api.md#anvilstopimpersonatingaccountjsonrpcrequest)
- [AnvilStopImpersonatingAccountJsonRpcResponse](api.md#anvilstopimpersonatingaccountjsonrpcresponse)
- [AnvilStopImpersonatingAccountParams](api.md#anvilstopimpersonatingaccountparams)
- [AnvilStopImpersonatingAccountProcedure](api.md#anvilstopimpersonatingaccountprocedure)
- [AnvilStopImpersonatingAccountResult](api.md#anvilstopimpersonatingaccountresult)
- [BaseCallError](api.md#basecallerror)
- [BaseCallParams](api.md#basecallparams)
- [Block](api.md#block)
- [BlockResult](api.md#blockresult)
- [CallError](api.md#callerror)
- [CallHandler](api.md#callhandler)
- [CallJsonRpcProcedure](api.md#calljsonrpcprocedure)
- [CallJsonRpcRequest](api.md#calljsonrpcrequest)
- [CallJsonRpcResponse](api.md#calljsonrpcresponse)
- [ContractError](api.md#contracterror)
- [ContractHandler](api.md#contracthandler)
- [ContractJsonRpcProcedure](api.md#contractjsonrpcprocedure)
- [ContractJsonRpcRequest](api.md#contractjsonrpcrequest)
- [ContractJsonRpcResponse](api.md#contractjsonrpcresponse)
- [DebugTraceCallHandler](api.md#debugtracecallhandler)
- [DebugTraceCallJsonRpcRequest](api.md#debugtracecalljsonrpcrequest)
- [DebugTraceCallJsonRpcResponse](api.md#debugtracecalljsonrpcresponse)
- [DebugTraceCallParams](api.md#debugtracecallparams)
- [DebugTraceCallProcedure](api.md#debugtracecallprocedure)
- [DebugTraceCallResult](api.md#debugtracecallresult)
- [DebugTraceTransactionHandler](api.md#debugtracetransactionhandler)
- [DebugTraceTransactionJsonRpcRequest](api.md#debugtracetransactionjsonrpcrequest)
- [DebugTraceTransactionJsonRpcResponse](api.md#debugtracetransactionjsonrpcresponse)
- [DebugTraceTransactionParams](api.md#debugtracetransactionparams)
- [DebugTraceTransactionProcedure](api.md#debugtracetransactionprocedure)
- [DebugTraceTransactionResult](api.md#debugtracetransactionresult)
- [EthAccountsHandler](api.md#ethaccountshandler)
- [EthAccountsJsonRpcProcedure](api.md#ethaccountsjsonrpcprocedure)
- [EthAccountsJsonRpcRequest](api.md#ethaccountsjsonrpcrequest)
- [EthAccountsJsonRpcResponse](api.md#ethaccountsjsonrpcresponse)
- [EthAccountsParams](api.md#ethaccountsparams)
- [EthAccountsResult](api.md#ethaccountsresult)
- [EthBlockNumberHandler](api.md#ethblocknumberhandler)
- [EthBlockNumberJsonRpcProcedure](api.md#ethblocknumberjsonrpcprocedure)
- [EthBlockNumberJsonRpcRequest](api.md#ethblocknumberjsonrpcrequest)
- [EthBlockNumberJsonRpcResponse](api.md#ethblocknumberjsonrpcresponse)
- [EthBlockNumberParams](api.md#ethblocknumberparams)
- [EthBlockNumberResult](api.md#ethblocknumberresult)
- [EthCallHandler](api.md#ethcallhandler)
- [EthCallJsonRpcProcedure](api.md#ethcalljsonrpcprocedure)
- [EthCallJsonRpcRequest](api.md#ethcalljsonrpcrequest)
- [EthCallJsonRpcResponse](api.md#ethcalljsonrpcresponse)
- [EthCallParams](api.md#ethcallparams)
- [EthCallResult](api.md#ethcallresult)
- [EthChainIdHandler](api.md#ethchainidhandler)
- [EthChainIdJsonRpcProcedure](api.md#ethchainidjsonrpcprocedure)
- [EthChainIdJsonRpcRequest](api.md#ethchainidjsonrpcrequest)
- [EthChainIdJsonRpcResponse](api.md#ethchainidjsonrpcresponse)
- [EthChainIdParams](api.md#ethchainidparams)
- [EthChainIdResult](api.md#ethchainidresult)
- [EthCoinbaseHandler](api.md#ethcoinbasehandler)
- [EthCoinbaseJsonRpcProcedure](api.md#ethcoinbasejsonrpcprocedure)
- [EthCoinbaseJsonRpcRequest](api.md#ethcoinbasejsonrpcrequest)
- [EthCoinbaseJsonRpcResponse](api.md#ethcoinbasejsonrpcresponse)
- [EthCoinbaseParams](api.md#ethcoinbaseparams)
- [EthCoinbaseResult](api.md#ethcoinbaseresult)
- [EthEstimateGasHandler](api.md#ethestimategashandler)
- [EthEstimateGasJsonRpcProcedure](api.md#ethestimategasjsonrpcprocedure)
- [EthEstimateGasJsonRpcRequest](api.md#ethestimategasjsonrpcrequest)
- [EthEstimateGasJsonRpcResponse](api.md#ethestimategasjsonrpcresponse)
- [EthEstimateGasParams](api.md#ethestimategasparams)
- [EthEstimateGasResult](api.md#ethestimategasresult)
- [EthGasPriceHandler](api.md#ethgaspricehandler)
- [EthGasPriceJsonRpcProcedure](api.md#ethgaspricejsonrpcprocedure)
- [EthGasPriceJsonRpcRequest](api.md#ethgaspricejsonrpcrequest)
- [EthGasPriceJsonRpcResponse](api.md#ethgaspricejsonrpcresponse)
- [EthGasPriceParams](api.md#ethgaspriceparams)
- [EthGasPriceResult](api.md#ethgaspriceresult)
- [EthGetBalanceHandler](api.md#ethgetbalancehandler)
- [EthGetBalanceJsonRpcProcedure](api.md#ethgetbalancejsonrpcprocedure)
- [EthGetBalanceJsonRpcRequest](api.md#ethgetbalancejsonrpcrequest)
- [EthGetBalanceJsonRpcResponse](api.md#ethgetbalancejsonrpcresponse)
- [EthGetBalanceParams](api.md#ethgetbalanceparams)
- [EthGetBalanceResult](api.md#ethgetbalanceresult)
- [EthGetBlockByHashHandler](api.md#ethgetblockbyhashhandler)
- [EthGetBlockByHashJsonRpcProcedure](api.md#ethgetblockbyhashjsonrpcprocedure)
- [EthGetBlockByHashJsonRpcRequest](api.md#ethgetblockbyhashjsonrpcrequest)
- [EthGetBlockByHashJsonRpcResponse](api.md#ethgetblockbyhashjsonrpcresponse)
- [EthGetBlockByHashParams](api.md#ethgetblockbyhashparams)
- [EthGetBlockByHashResult](api.md#ethgetblockbyhashresult)
- [EthGetBlockByNumberHandler](api.md#ethgetblockbynumberhandler)
- [EthGetBlockByNumberJsonRpcProcedure](api.md#ethgetblockbynumberjsonrpcprocedure)
- [EthGetBlockByNumberJsonRpcRequest](api.md#ethgetblockbynumberjsonrpcrequest)
- [EthGetBlockByNumberJsonRpcResponse](api.md#ethgetblockbynumberjsonrpcresponse)
- [EthGetBlockByNumberParams](api.md#ethgetblockbynumberparams)
- [EthGetBlockByNumberResult](api.md#ethgetblockbynumberresult)
- [EthGetBlockTransactionCountByHashHandler](api.md#ethgetblocktransactioncountbyhashhandler)
- [EthGetBlockTransactionCountByHashJsonRpcProcedure](api.md#ethgetblocktransactioncountbyhashjsonrpcprocedure)
- [EthGetBlockTransactionCountByHashJsonRpcRequest](api.md#ethgetblocktransactioncountbyhashjsonrpcrequest)
- [EthGetBlockTransactionCountByHashJsonRpcResponse](api.md#ethgetblocktransactioncountbyhashjsonrpcresponse)
- [EthGetBlockTransactionCountByHashParams](api.md#ethgetblocktransactioncountbyhashparams)
- [EthGetBlockTransactionCountByHashResult](api.md#ethgetblocktransactioncountbyhashresult)
- [EthGetBlockTransactionCountByNumberHandler](api.md#ethgetblocktransactioncountbynumberhandler)
- [EthGetBlockTransactionCountByNumberJsonRpcProcedure](api.md#ethgetblocktransactioncountbynumberjsonrpcprocedure)
- [EthGetBlockTransactionCountByNumberJsonRpcRequest](api.md#ethgetblocktransactioncountbynumberjsonrpcrequest)
- [EthGetBlockTransactionCountByNumberJsonRpcResponse](api.md#ethgetblocktransactioncountbynumberjsonrpcresponse)
- [EthGetBlockTransactionCountByNumberParams](api.md#ethgetblocktransactioncountbynumberparams)
- [EthGetBlockTransactionCountByNumberResult](api.md#ethgetblocktransactioncountbynumberresult)
- [EthGetCodeHandler](api.md#ethgetcodehandler)
- [EthGetCodeJsonRpcProcedure](api.md#ethgetcodejsonrpcprocedure)
- [EthGetCodeJsonRpcRequest](api.md#ethgetcodejsonrpcrequest)
- [EthGetCodeJsonRpcResponse](api.md#ethgetcodejsonrpcresponse)
- [EthGetCodeParams](api.md#ethgetcodeparams)
- [EthGetCodeResult](api.md#ethgetcoderesult)
- [EthGetFilterChangesHandler](api.md#ethgetfilterchangeshandler)
- [EthGetFilterChangesJsonRpcProcedure](api.md#ethgetfilterchangesjsonrpcprocedure)
- [EthGetFilterChangesJsonRpcRequest](api.md#ethgetfilterchangesjsonrpcrequest)
- [EthGetFilterChangesJsonRpcResponse](api.md#ethgetfilterchangesjsonrpcresponse)
- [EthGetFilterChangesParams](api.md#ethgetfilterchangesparams)
- [EthGetFilterChangesResult](api.md#ethgetfilterchangesresult)
- [EthGetFilterLogsHandler](api.md#ethgetfilterlogshandler)
- [EthGetFilterLogsJsonRpcProcedure](api.md#ethgetfilterlogsjsonrpcprocedure)
- [EthGetFilterLogsJsonRpcRequest](api.md#ethgetfilterlogsjsonrpcrequest)
- [EthGetFilterLogsJsonRpcResponse](api.md#ethgetfilterlogsjsonrpcresponse)
- [EthGetFilterLogsParams](api.md#ethgetfilterlogsparams)
- [EthGetFilterLogsResult](api.md#ethgetfilterlogsresult)
- [EthGetLogsHandler](api.md#ethgetlogshandler)
- [EthGetLogsJsonRpcProcedure](api.md#ethgetlogsjsonrpcprocedure)
- [EthGetLogsJsonRpcRequest](api.md#ethgetlogsjsonrpcrequest)
- [EthGetLogsJsonRpcResponse](api.md#ethgetlogsjsonrpcresponse)
- [EthGetLogsParams](api.md#ethgetlogsparams)
- [EthGetLogsResult](api.md#ethgetlogsresult)
- [EthGetStorageAtHandler](api.md#ethgetstorageathandler)
- [EthGetStorageAtJsonRpcProcedure](api.md#ethgetstorageatjsonrpcprocedure)
- [EthGetStorageAtJsonRpcRequest](api.md#ethgetstorageatjsonrpcrequest)
- [EthGetStorageAtJsonRpcResponse](api.md#ethgetstorageatjsonrpcresponse)
- [EthGetStorageAtParams](api.md#ethgetstorageatparams)
- [EthGetStorageAtResult](api.md#ethgetstorageatresult)
- [EthGetTransactionByBlockHashAndIndexHandler](api.md#ethgettransactionbyblockhashandindexhandler)
- [EthGetTransactionByBlockHashAndIndexJsonRpcProcedure](api.md#ethgettransactionbyblockhashandindexjsonrpcprocedure)
- [EthGetTransactionByBlockHashAndIndexJsonRpcRequest](api.md#ethgettransactionbyblockhashandindexjsonrpcrequest)
- [EthGetTransactionByBlockHashAndIndexJsonRpcResponse](api.md#ethgettransactionbyblockhashandindexjsonrpcresponse)
- [EthGetTransactionByBlockHashAndIndexParams](api.md#ethgettransactionbyblockhashandindexparams)
- [EthGetTransactionByBlockHashAndIndexResult](api.md#ethgettransactionbyblockhashandindexresult)
- [EthGetTransactionByBlockNumberAndIndexHandler](api.md#ethgettransactionbyblocknumberandindexhandler)
- [EthGetTransactionByBlockNumberAndIndexJsonRpcProcedure](api.md#ethgettransactionbyblocknumberandindexjsonrpcprocedure)
- [EthGetTransactionByBlockNumberAndIndexJsonRpcRequest](api.md#ethgettransactionbyblocknumberandindexjsonrpcrequest)
- [EthGetTransactionByBlockNumberAndIndexJsonRpcResponse](api.md#ethgettransactionbyblocknumberandindexjsonrpcresponse)
- [EthGetTransactionByBlockNumberAndIndexParams](api.md#ethgettransactionbyblocknumberandindexparams)
- [EthGetTransactionByBlockNumberAndIndexResult](api.md#ethgettransactionbyblocknumberandindexresult)
- [EthGetTransactionByHashHandler](api.md#ethgettransactionbyhashhandler)
- [EthGetTransactionByHashJsonRpcProcedure](api.md#ethgettransactionbyhashjsonrpcprocedure)
- [EthGetTransactionByHashJsonRpcRequest](api.md#ethgettransactionbyhashjsonrpcrequest)
- [EthGetTransactionByHashJsonRpcResponse](api.md#ethgettransactionbyhashjsonrpcresponse)
- [EthGetTransactionByHashParams](api.md#ethgettransactionbyhashparams)
- [EthGetTransactionByHashResult](api.md#ethgettransactionbyhashresult)
- [EthGetTransactionCountHandler](api.md#ethgettransactioncounthandler)
- [EthGetTransactionCountJsonRpcProcedure](api.md#ethgettransactioncountjsonrpcprocedure)
- [EthGetTransactionCountJsonRpcRequest](api.md#ethgettransactioncountjsonrpcrequest)
- [EthGetTransactionCountJsonRpcResponse](api.md#ethgettransactioncountjsonrpcresponse)
- [EthGetTransactionCountParams](api.md#ethgettransactioncountparams)
- [EthGetTransactionCountResult](api.md#ethgettransactioncountresult)
- [EthGetTransactionReceiptHandler](api.md#ethgettransactionreceipthandler)
- [EthGetTransactionReceiptJsonRpcProcedure](api.md#ethgettransactionreceiptjsonrpcprocedure)
- [EthGetTransactionReceiptJsonRpcRequest](api.md#ethgettransactionreceiptjsonrpcrequest)
- [EthGetTransactionReceiptJsonRpcResponse](api.md#ethgettransactionreceiptjsonrpcresponse)
- [EthGetTransactionReceiptParams](api.md#ethgettransactionreceiptparams)
- [EthGetTransactionReceiptResult](api.md#ethgettransactionreceiptresult)
- [EthGetUncleByBlockHashAndIndexHandler](api.md#ethgetunclebyblockhashandindexhandler)
- [EthGetUncleByBlockHashAndIndexJsonRpcProcedure](api.md#ethgetunclebyblockhashandindexjsonrpcprocedure)
- [EthGetUncleByBlockHashAndIndexJsonRpcRequest](api.md#ethgetunclebyblockhashandindexjsonrpcrequest)
- [EthGetUncleByBlockHashAndIndexJsonRpcResponse](api.md#ethgetunclebyblockhashandindexjsonrpcresponse)
- [EthGetUncleByBlockHashAndIndexParams](api.md#ethgetunclebyblockhashandindexparams)
- [EthGetUncleByBlockHashAndIndexResult](api.md#ethgetunclebyblockhashandindexresult)
- [EthGetUncleByBlockNumberAndIndexHandler](api.md#ethgetunclebyblocknumberandindexhandler)
- [EthGetUncleByBlockNumberAndIndexJsonRpcProcedure](api.md#ethgetunclebyblocknumberandindexjsonrpcprocedure)
- [EthGetUncleByBlockNumberAndIndexJsonRpcRequest](api.md#ethgetunclebyblocknumberandindexjsonrpcrequest)
- [EthGetUncleByBlockNumberAndIndexJsonRpcResponse](api.md#ethgetunclebyblocknumberandindexjsonrpcresponse)
- [EthGetUncleByBlockNumberAndIndexParams](api.md#ethgetunclebyblocknumberandindexparams)
- [EthGetUncleByBlockNumberAndIndexResult](api.md#ethgetunclebyblocknumberandindexresult)
- [EthGetUncleCountByBlockHashHandler](api.md#ethgetunclecountbyblockhashhandler)
- [EthGetUncleCountByBlockHashJsonRpcProcedure](api.md#ethgetunclecountbyblockhashjsonrpcprocedure)
- [EthGetUncleCountByBlockHashJsonRpcRequest](api.md#ethgetunclecountbyblockhashjsonrpcrequest)
- [EthGetUncleCountByBlockHashJsonRpcResponse](api.md#ethgetunclecountbyblockhashjsonrpcresponse)
- [EthGetUncleCountByBlockHashParams](api.md#ethgetunclecountbyblockhashparams)
- [EthGetUncleCountByBlockHashResult](api.md#ethgetunclecountbyblockhashresult)
- [EthGetUncleCountByBlockNumberHandler](api.md#ethgetunclecountbyblocknumberhandler)
- [EthGetUncleCountByBlockNumberJsonRpcProcedure](api.md#ethgetunclecountbyblocknumberjsonrpcprocedure)
- [EthGetUncleCountByBlockNumberJsonRpcRequest](api.md#ethgetunclecountbyblocknumberjsonrpcrequest)
- [EthGetUncleCountByBlockNumberJsonRpcResponse](api.md#ethgetunclecountbyblocknumberjsonrpcresponse)
- [EthGetUncleCountByBlockNumberParams](api.md#ethgetunclecountbyblocknumberparams)
- [EthGetUncleCountByBlockNumberResult](api.md#ethgetunclecountbyblocknumberresult)
- [EthHashrateHandler](api.md#ethhashratehandler)
- [EthHashrateJsonRpcProcedure](api.md#ethhashratejsonrpcprocedure)
- [EthHashrateJsonRpcRequest](api.md#ethhashratejsonrpcrequest)
- [EthHashrateJsonRpcResponse](api.md#ethhashratejsonrpcresponse)
- [EthHashrateParams](api.md#ethhashrateparams)
- [EthHashrateResult](api.md#ethhashrateresult)
- [EthJsonRpcRequest](api.md#ethjsonrpcrequest)
- [EthJsonRpcRequestHandler](api.md#ethjsonrpcrequesthandler)
- [EthMiningHandler](api.md#ethmininghandler)
- [EthMiningJsonRpcProcedure](api.md#ethminingjsonrpcprocedure)
- [EthMiningJsonRpcRequest](api.md#ethminingjsonrpcrequest)
- [EthMiningJsonRpcResponse](api.md#ethminingjsonrpcresponse)
- [EthMiningParams](api.md#ethminingparams)
- [EthMiningResult](api.md#ethminingresult)
- [EthNewBlockFilterHandler](api.md#ethnewblockfilterhandler)
- [EthNewBlockFilterJsonRpcProcedure](api.md#ethnewblockfilterjsonrpcprocedure)
- [EthNewBlockFilterJsonRpcRequest](api.md#ethnewblockfilterjsonrpcrequest)
- [EthNewBlockFilterJsonRpcResponse](api.md#ethnewblockfilterjsonrpcresponse)
- [EthNewBlockFilterParams](api.md#ethnewblockfilterparams)
- [EthNewBlockFilterResult](api.md#ethnewblockfilterresult)
- [EthNewFilterHandler](api.md#ethnewfilterhandler)
- [EthNewFilterJsonRpcProcedure](api.md#ethnewfilterjsonrpcprocedure)
- [EthNewFilterJsonRpcRequest](api.md#ethnewfilterjsonrpcrequest)
- [EthNewFilterJsonRpcResponse](api.md#ethnewfilterjsonrpcresponse)
- [EthNewFilterParams](api.md#ethnewfilterparams)
- [EthNewFilterResult](api.md#ethnewfilterresult)
- [EthNewPendingTransactionFilterHandler](api.md#ethnewpendingtransactionfilterhandler)
- [EthNewPendingTransactionFilterJsonRpcProcedure](api.md#ethnewpendingtransactionfilterjsonrpcprocedure)
- [EthNewPendingTransactionFilterJsonRpcRequest](api.md#ethnewpendingtransactionfilterjsonrpcrequest)
- [EthNewPendingTransactionFilterJsonRpcResponse](api.md#ethnewpendingtransactionfilterjsonrpcresponse)
- [EthNewPendingTransactionFilterParams](api.md#ethnewpendingtransactionfilterparams)
- [EthNewPendingTransactionFilterResult](api.md#ethnewpendingtransactionfilterresult)
- [EthParams](api.md#ethparams)
- [EthProtocolVersionHandler](api.md#ethprotocolversionhandler)
- [EthProtocolVersionJsonRpcProcedure](api.md#ethprotocolversionjsonrpcprocedure)
- [EthProtocolVersionJsonRpcRequest](api.md#ethprotocolversionjsonrpcrequest)
- [EthProtocolVersionJsonRpcResponse](api.md#ethprotocolversionjsonrpcresponse)
- [EthProtocolVersionParams](api.md#ethprotocolversionparams)
- [EthProtocolVersionResult](api.md#ethprotocolversionresult)
- [EthSendRawTransactionHandler](api.md#ethsendrawtransactionhandler)
- [EthSendRawTransactionJsonRpcProcedure](api.md#ethsendrawtransactionjsonrpcprocedure)
- [EthSendRawTransactionJsonRpcRequest](api.md#ethsendrawtransactionjsonrpcrequest)
- [EthSendRawTransactionJsonRpcResponse](api.md#ethsendrawtransactionjsonrpcresponse)
- [EthSendRawTransactionParams](api.md#ethsendrawtransactionparams)
- [EthSendRawTransactionResult](api.md#ethsendrawtransactionresult)
- [EthSendTransactionHandler](api.md#ethsendtransactionhandler)
- [EthSendTransactionJsonRpcProcedure](api.md#ethsendtransactionjsonrpcprocedure)
- [EthSendTransactionJsonRpcRequest](api.md#ethsendtransactionjsonrpcrequest)
- [EthSendTransactionJsonRpcResponse](api.md#ethsendtransactionjsonrpcresponse)
- [EthSendTransactionParams](api.md#ethsendtransactionparams)
- [EthSendTransactionResult](api.md#ethsendtransactionresult)
- [EthSignHandler](api.md#ethsignhandler)
- [EthSignJsonRpcProcedure](api.md#ethsignjsonrpcprocedure)
- [EthSignJsonRpcRequest](api.md#ethsignjsonrpcrequest)
- [EthSignJsonRpcResponse](api.md#ethsignjsonrpcresponse)
- [EthSignParams](api.md#ethsignparams)
- [EthSignResult](api.md#ethsignresult)
- [EthSignTransactionHandler](api.md#ethsigntransactionhandler)
- [EthSignTransactionJsonRpcProcedure](api.md#ethsigntransactionjsonrpcprocedure)
- [EthSignTransactionJsonRpcRequest](api.md#ethsigntransactionjsonrpcrequest)
- [EthSignTransactionJsonRpcResponse](api.md#ethsigntransactionjsonrpcresponse)
- [EthSignTransactionParams](api.md#ethsigntransactionparams)
- [EthSignTransactionResult](api.md#ethsigntransactionresult)
- [EthSyncingHandler](api.md#ethsyncinghandler)
- [EthSyncingJsonRpcProcedure](api.md#ethsyncingjsonrpcprocedure)
- [EthSyncingJsonRpcRequest](api.md#ethsyncingjsonrpcrequest)
- [EthSyncingJsonRpcResponse](api.md#ethsyncingjsonrpcresponse)
- [EthSyncingParams](api.md#ethsyncingparams)
- [EthSyncingResult](api.md#ethsyncingresult)
- [EthUninstallFilterHandler](api.md#ethuninstallfilterhandler)
- [EthUninstallFilterJsonRpcProcedure](api.md#ethuninstallfilterjsonrpcprocedure)
- [EthUninstallFilterJsonRpcRequest](api.md#ethuninstallfilterjsonrpcrequest)
- [EthUninstallFilterJsonRpcResponse](api.md#ethuninstallfilterjsonrpcresponse)
- [EthUninstallFilterParams](api.md#ethuninstallfilterparams)
- [EthUninstallFilterResult](api.md#ethuninstallfilterresult)
- [EvmError](api.md#evmerror)
- [FilterLog](api.md#filterlog)
- [InvalidAddressError](api.md#invalidaddresserror)
- [InvalidBalanceError](api.md#invalidbalanceerror)
- [InvalidBlobVersionedHashesError](api.md#invalidblobversionedhasheserror)
- [InvalidBlockError](api.md#invalidblockerror)
- [InvalidBytecodeError](api.md#invalidbytecodeerror)
- [InvalidCallerError](api.md#invalidcallererror)
- [InvalidDataError](api.md#invaliddataerror)
- [InvalidDeployedBytecodeError](api.md#invaliddeployedbytecodeerror)
- [InvalidDepthError](api.md#invaliddeptherror)
- [InvalidFunctionNameError](api.md#invalidfunctionnameerror)
- [InvalidGasLimitError](api.md#invalidgaslimiterror)
- [InvalidGasPriceError](api.md#invalidgaspriceerror)
- [InvalidGasRefundError](api.md#invalidgasrefunderror)
- [InvalidNonceError](api.md#invalidnonceerror)
- [InvalidOriginError](api.md#invalidoriginerror)
- [InvalidRequestError](api.md#invalidrequesterror)
- [InvalidSaltError](api.md#invalidsalterror)
- [InvalidSelfdestructError](api.md#invalidselfdestructerror)
- [InvalidSkipBalanceError](api.md#invalidskipbalanceerror)
- [InvalidStorageRootError](api.md#invalidstoragerooterror)
- [InvalidToError](api.md#invalidtoerror)
- [InvalidValueError](api.md#invalidvalueerror)
- [JsonRpcRequest](api.md#jsonrpcrequest)
- [JsonRpcResponse](api.md#jsonrpcresponse)
- [Log](api.md#log)
- [ScriptError](api.md#scripterror)
- [ScriptHandler](api.md#scripthandler)
- [ScriptJsonRpcProcedure](api.md#scriptjsonrpcprocedure)
- [ScriptJsonRpcRequest](api.md#scriptjsonrpcrequest)
- [ScriptJsonRpcResponse](api.md#scriptjsonrpcresponse)
- [Tevm](api.md#tevm)
- [TevmEVMErrorMessage](api.md#tevmevmerrormessage)
- [TraceCall](api.md#tracecall)
- [TraceParams](api.md#traceparams)
- [TraceResult](api.md#traceresult)
- [TraceType](api.md#tracetype)
- [TransactionParams](api.md#transactionparams)
- [TransactionReceiptResult](api.md#transactionreceiptresult)
- [TransactionResult](api.md#transactionresult)
- [TypedError](api.md#typederror)
- [UnexpectedError](api.md#unexpectederror)

## References

### AccountParams

Re-exports [AccountParams](index.md#accountparams)

___

### AccountResult

Re-exports [AccountResult](index.md#accountresult)

___

### CallParams

Re-exports [CallParams](index.md#callparams)

___

### CallResult

Re-exports [CallResult](index.md#callresult)

___

### ContractParams

Re-exports [ContractParams](index.md#contractparams)

___

### ContractResult

Re-exports [ContractResult](index.md#contractresult)

___

### ScriptParams

Re-exports [ScriptParams](index.md#scriptparams)

___

### ScriptResult

Re-exports [ScriptResult](index.md#scriptresult)

___

### TevmJsonRpcRequest

Re-exports [TevmJsonRpcRequest](index.md#tevmjsonrpcrequest)

___

### TevmJsonRpcRequestHandler

Re-exports [TevmJsonRpcRequestHandler](index.md#tevmjsonrpcrequesthandler)

## Type Aliases

### AccountError

Ƭ **AccountError**: [`InvalidAddressError`](api.md#invalidaddresserror) \| [`InvalidBalanceError`](api.md#invalidbalanceerror) \| [`InvalidNonceError`](api.md#invalidnonceerror) \| [`InvalidStorageRootError`](api.md#invalidstoragerooterror) \| [`InvalidBytecodeError`](api.md#invalidbytecodeerror) \| [`InvalidRequestError`](api.md#invalidrequesterror) \| [`UnexpectedError`](api.md#unexpectederror)

Errors returned by account tevm procedure

**`Example`**

```ts
const {errors} = await tevm.setAccount({address: '0x1234'})

if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
  console.log(errors[0].message) // Invalid address: 0x1234
}
```

#### Defined in

vm/api/dist/index.d.ts:905

___

### AccountHandler

Ƭ **AccountHandler**: (`params`: [`AccountParams`](index.md#accountparams)) => `Promise`\<[`AccountResult`](index.md#accountresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AccountResult`](index.md#accountresult)\>

Handler for account tevm procedure

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AccountParams`](index.md#accountparams) |

##### Returns

`Promise`\<[`AccountResult`](index.md#accountresult)\>

#### Defined in

vm/api/dist/index.d.ts:925

___

### AccountJsonRpcProcedure

Ƭ **AccountJsonRpcProcedure**: (`request`: [`AccountJsonRpcRequest`](api.md#accountjsonrpcrequest)) => `Promise`\<[`AccountJsonRpcResponse`](api.md#accountjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AccountJsonRpcResponse`](api.md#accountjsonrpcresponse)\>

Account JSON-RPC tevm procedure puts an account or contract into the tevm state

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AccountJsonRpcRequest`](api.md#accountjsonrpcrequest) |

##### Returns

`Promise`\<[`AccountJsonRpcResponse`](api.md#accountjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1866

___

### AccountJsonRpcRequest

Ƭ **AccountJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"tevm_account"``, `SerializeToJson`\<[`AccountParams`](index.md#accountparams)\>\>

JSON-RPC request for `tevm_account` method

#### Defined in

vm/api/dist/index.d.ts:1296

___

### AccountJsonRpcResponse

Ƭ **AccountJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"tevm_account"``, `SerializeToJson`\<[`AccountResult`](index.md#accountresult)\>, [`AccountError`](api.md#accounterror)[``"_tag"``]\>

JSON-RPC response for `tevm_account` procedure

#### Defined in

vm/api/dist/index.d.ts:1609

___

### AnvilDropTransactionHandler

Ƭ **AnvilDropTransactionHandler**: (`params`: [`AnvilDropTransactionParams`](api.md#anvildroptransactionparams)) => `Promise`\<[`AnvilDropTransactionResult`](api.md#anvildroptransactionresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilDropTransactionResult`](api.md#anvildroptransactionresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilDropTransactionParams`](api.md#anvildroptransactionparams) |

##### Returns

`Promise`\<[`AnvilDropTransactionResult`](api.md#anvildroptransactionresult)\>

#### Defined in

vm/api/dist/index.d.ts:962

___

### AnvilDropTransactionJsonRpcRequest

Ƭ **AnvilDropTransactionJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"anvil_dropTransaction"``, `SerializeToJson`\<[`AnvilDropTransactionParams`](api.md#anvildroptransactionparams)\>\>

JSON-RPC request for `anvil_dropTransaction` method

#### Defined in

vm/api/dist/index.d.ts:1548

___

### AnvilDropTransactionJsonRpcResponse

Ƭ **AnvilDropTransactionJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"anvil_dropTransaction"``, `SerializeToJson`\<[`AnvilDropTransactionResult`](api.md#anvildroptransactionresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_dropTransaction` procedure

#### Defined in

vm/api/dist/index.d.ts:1823

___

### AnvilDropTransactionParams

Ƭ **AnvilDropTransactionParams**: `Object`

Params for `anvil_dropTransaction` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactionHash` | `Hex` | The transaction hash |

#### Defined in

vm/api/dist/index.d.ts:452

___

### AnvilDropTransactionProcedure

Ƭ **AnvilDropTransactionProcedure**: (`request`: [`AnvilDropTransactionJsonRpcRequest`](api.md#anvildroptransactionjsonrpcrequest)) => `Promise`\<[`AnvilDropTransactionJsonRpcResponse`](api.md#anvildroptransactionjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilDropTransactionJsonRpcResponse`](api.md#anvildroptransactionjsonrpcresponse)\>

JSON-RPC procedure for `anvil_dropTransaction`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilDropTransactionJsonRpcRequest`](api.md#anvildroptransactionjsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilDropTransactionJsonRpcResponse`](api.md#anvildroptransactionjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1951

___

### AnvilDropTransactionResult

Ƭ **AnvilDropTransactionResult**: ``null``

#### Defined in

vm/api/dist/index.d.ts:948

___

### AnvilDumpStateHandler

Ƭ **AnvilDumpStateHandler**: (`params`: [`AnvilDumpStateParams`](api.md#anvildumpstateparams)) => `Promise`\<[`AnvilDumpStateResult`](api.md#anvildumpstateresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilDumpStateResult`](api.md#anvildumpstateresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilDumpStateParams`](api.md#anvildumpstateparams) |

##### Returns

`Promise`\<[`AnvilDumpStateResult`](api.md#anvildumpstateresult)\>

#### Defined in

vm/api/dist/index.d.ts:968

___

### AnvilDumpStateJsonRpcRequest

Ƭ **AnvilDumpStateJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"anvil_dumpState"``, `SerializeToJson`\<[`AnvilDumpStateParams`](api.md#anvildumpstateparams)\>\>

JSON-RPC request for `anvil_dumpState` method

#### Defined in

vm/api/dist/index.d.ts:1572

___

### AnvilDumpStateJsonRpcResponse

Ƭ **AnvilDumpStateJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"anvil_dumpState"``, `SerializeToJson`\<[`AnvilDumpStateResult`](api.md#anvildumpstateresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_dumpState` procedure

#### Defined in

vm/api/dist/index.d.ts:1847

___

### AnvilDumpStateParams

Ƭ **AnvilDumpStateParams**: {} \| `undefined` \| `never`

Params for `anvil_dumpState` handler

#### Defined in

vm/api/dist/index.d.ts:526

___

### AnvilDumpStateProcedure

Ƭ **AnvilDumpStateProcedure**: (`request`: [`AnvilDumpStateJsonRpcRequest`](api.md#anvildumpstatejsonrpcrequest)) => `Promise`\<[`AnvilDumpStateJsonRpcResponse`](api.md#anvildumpstatejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilDumpStateJsonRpcResponse`](api.md#anvildumpstatejsonrpcresponse)\>

JSON-RPC procedure for `anvil_dumpState`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilDumpStateJsonRpcRequest`](api.md#anvildumpstatejsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilDumpStateJsonRpcResponse`](api.md#anvildumpstatejsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1975

___

### AnvilDumpStateResult

Ƭ **AnvilDumpStateResult**: `Hex`

#### Defined in

vm/api/dist/index.d.ts:954

___

### AnvilGetAutomineHandler

Ƭ **AnvilGetAutomineHandler**: (`params`: [`AnvilGetAutomineParams`](api.md#anvilgetautomineparams)) => `Promise`\<[`AnvilGetAutomineResult`](api.md#anvilgetautomineresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilGetAutomineResult`](api.md#anvilgetautomineresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilGetAutomineParams`](api.md#anvilgetautomineparams) |

##### Returns

`Promise`\<[`AnvilGetAutomineResult`](api.md#anvilgetautomineresult)\>

#### Defined in

vm/api/dist/index.d.ts:959

___

### AnvilGetAutomineJsonRpcRequest

Ƭ **AnvilGetAutomineJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"anvil_getAutomine"``, `SerializeToJson`\<[`AnvilGetAutomineParams`](api.md#anvilgetautomineparams)\>\>

JSON-RPC request for `anvil_getAutomine` method

#### Defined in

vm/api/dist/index.d.ts:1536

___

### AnvilGetAutomineJsonRpcResponse

Ƭ **AnvilGetAutomineJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"anvil_getAutomine"``, `SerializeToJson`\<[`AnvilGetAutomineResult`](api.md#anvilgetautomineresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_getAutomine` procedure

#### Defined in

vm/api/dist/index.d.ts:1811

___

### AnvilGetAutomineParams

Ƭ **AnvilGetAutomineParams**: {} \| `undefined` \| `never`

Params for `anvil_getAutomine` handler

#### Defined in

vm/api/dist/index.d.ts:420

___

### AnvilGetAutomineProcedure

Ƭ **AnvilGetAutomineProcedure**: (`request`: [`AnvilGetAutomineJsonRpcRequest`](api.md#anvilgetautominejsonrpcrequest)) => `Promise`\<[`AnvilGetAutomineJsonRpcResponse`](api.md#anvilgetautominejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilGetAutomineJsonRpcResponse`](api.md#anvilgetautominejsonrpcresponse)\>

JSON-RPC procedure for `anvil_getAutomine`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilGetAutomineJsonRpcRequest`](api.md#anvilgetautominejsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilGetAutomineJsonRpcResponse`](api.md#anvilgetautominejsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1939

___

### AnvilGetAutomineResult

Ƭ **AnvilGetAutomineResult**: `boolean`

#### Defined in

vm/api/dist/index.d.ts:945

___

### AnvilImpersonateAccountHandler

Ƭ **AnvilImpersonateAccountHandler**: (`params`: [`AnvilImpersonateAccountParams`](api.md#anvilimpersonateaccountparams)) => `Promise`\<[`AnvilImpersonateAccountResult`](api.md#anvilimpersonateaccountresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilImpersonateAccountResult`](api.md#anvilimpersonateaccountresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilImpersonateAccountParams`](api.md#anvilimpersonateaccountparams) |

##### Returns

`Promise`\<[`AnvilImpersonateAccountResult`](api.md#anvilimpersonateaccountresult)\>

#### Defined in

vm/api/dist/index.d.ts:957

___

### AnvilImpersonateAccountJsonRpcRequest

Ƭ **AnvilImpersonateAccountJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"anvil_impersonateAccount"``, `SerializeToJson`\<[`AnvilImpersonateAccountParams`](api.md#anvilimpersonateaccountparams)\>\>

JSON-RPC request for `anvil_impersonateAccount` method

#### Defined in

vm/api/dist/index.d.ts:1524

___

### AnvilImpersonateAccountJsonRpcResponse

Ƭ **AnvilImpersonateAccountJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"anvil_impersonateAccount"``, `SerializeToJson`\<[`AnvilImpersonateAccountResult`](api.md#anvilimpersonateaccountresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_impersonateAccount` procedure

#### Defined in

vm/api/dist/index.d.ts:1799

___

### AnvilImpersonateAccountParams

Ƭ **AnvilImpersonateAccountParams**: `Object`

Params fro `anvil_impersonateAccount` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`Address`](index.md#address) | The address to impersonate |

#### Defined in

vm/api/dist/index.d.ts:398

___

### AnvilImpersonateAccountProcedure

Ƭ **AnvilImpersonateAccountProcedure**: (`request`: [`AnvilImpersonateAccountJsonRpcRequest`](api.md#anvilimpersonateaccountjsonrpcrequest)) => `Promise`\<[`AnvilImpersonateAccountJsonRpcResponse`](api.md#anvilimpersonateaccountjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilImpersonateAccountJsonRpcResponse`](api.md#anvilimpersonateaccountjsonrpcresponse)\>

JSON-RPC procedure for `anvil_impersonateAccount`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilImpersonateAccountJsonRpcRequest`](api.md#anvilimpersonateaccountjsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilImpersonateAccountJsonRpcResponse`](api.md#anvilimpersonateaccountjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1927

___

### AnvilImpersonateAccountResult

Ƭ **AnvilImpersonateAccountResult**: ``null``

#### Defined in

vm/api/dist/index.d.ts:943

___

### AnvilLoadStateHandler

Ƭ **AnvilLoadStateHandler**: (`params`: [`AnvilLoadStateParams`](api.md#anvilloadstateparams)) => `Promise`\<[`AnvilLoadStateResult`](api.md#anvilloadstateresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilLoadStateResult`](api.md#anvilloadstateresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilLoadStateParams`](api.md#anvilloadstateparams) |

##### Returns

`Promise`\<[`AnvilLoadStateResult`](api.md#anvilloadstateresult)\>

#### Defined in

vm/api/dist/index.d.ts:969

___

### AnvilLoadStateJsonRpcRequest

Ƭ **AnvilLoadStateJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"anvil_loadState"``, `SerializeToJson`\<[`AnvilLoadStateParams`](api.md#anvilloadstateparams)\>\>

JSON-RPC request for `anvil_loadState` method

#### Defined in

vm/api/dist/index.d.ts:1576

___

### AnvilLoadStateJsonRpcResponse

Ƭ **AnvilLoadStateJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"anvil_loadState"``, `SerializeToJson`\<[`AnvilLoadStateResult`](api.md#anvilloadstateresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_loadState` procedure

#### Defined in

vm/api/dist/index.d.ts:1851

___

### AnvilLoadStateParams

Ƭ **AnvilLoadStateParams**: `Object`

Params for `anvil_loadState` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | `Record`\<`Hex`, `Hex`\> | The state to load |

#### Defined in

vm/api/dist/index.d.ts:530

___

### AnvilLoadStateProcedure

Ƭ **AnvilLoadStateProcedure**: (`request`: [`AnvilLoadStateJsonRpcRequest`](api.md#anvilloadstatejsonrpcrequest)) => `Promise`\<[`AnvilLoadStateJsonRpcResponse`](api.md#anvilloadstatejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilLoadStateJsonRpcResponse`](api.md#anvilloadstatejsonrpcresponse)\>

JSON-RPC procedure for `anvil_loadState`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilLoadStateJsonRpcRequest`](api.md#anvilloadstatejsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilLoadStateJsonRpcResponse`](api.md#anvilloadstatejsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1979

___

### AnvilLoadStateResult

Ƭ **AnvilLoadStateResult**: ``null``

#### Defined in

vm/api/dist/index.d.ts:955

___

### AnvilMineHandler

Ƭ **AnvilMineHandler**: (`params`: [`AnvilMineParams`](api.md#anvilmineparams)) => `Promise`\<[`AnvilMineResult`](api.md#anvilmineresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilMineResult`](api.md#anvilmineresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilMineParams`](api.md#anvilmineparams) |

##### Returns

`Promise`\<[`AnvilMineResult`](api.md#anvilmineresult)\>

#### Defined in

vm/api/dist/index.d.ts:960

___

### AnvilMineJsonRpcRequest

Ƭ **AnvilMineJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"anvil_mine"``, `SerializeToJson`\<[`AnvilMineParams`](api.md#anvilmineparams)\>\>

JSON-RPC request for `anvil_mine` method

#### Defined in

vm/api/dist/index.d.ts:1540

___

### AnvilMineJsonRpcResponse

Ƭ **AnvilMineJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"anvil_mine"``, `SerializeToJson`\<[`AnvilMineResult`](api.md#anvilmineresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_mine` procedure

#### Defined in

vm/api/dist/index.d.ts:1815

___

### AnvilMineParams

Ƭ **AnvilMineParams**: `Object`

Params for `anvil_mine` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockCount?` | `number` | Number of blocks to mine. Defaults to 1 |
| `interval?` | `number` | mineing interval |

#### Defined in

vm/api/dist/index.d.ts:424

___

### AnvilMineProcedure

Ƭ **AnvilMineProcedure**: (`request`: [`AnvilMineJsonRpcRequest`](api.md#anvilminejsonrpcrequest)) => `Promise`\<[`AnvilMineJsonRpcResponse`](api.md#anvilminejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilMineJsonRpcResponse`](api.md#anvilminejsonrpcresponse)\>

JSON-RPC procedure for `anvil_mine`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilMineJsonRpcRequest`](api.md#anvilminejsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilMineJsonRpcResponse`](api.md#anvilminejsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1943

___

### AnvilMineResult

Ƭ **AnvilMineResult**: ``null``

#### Defined in

vm/api/dist/index.d.ts:946

___

### AnvilResetHandler

Ƭ **AnvilResetHandler**: (`params`: [`AnvilResetParams`](api.md#anvilresetparams)) => `Promise`\<[`AnvilResetResult`](api.md#anvilresetresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilResetResult`](api.md#anvilresetresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilResetParams`](api.md#anvilresetparams) |

##### Returns

`Promise`\<[`AnvilResetResult`](api.md#anvilresetresult)\>

#### Defined in

vm/api/dist/index.d.ts:961

___

### AnvilResetJsonRpcRequest

Ƭ **AnvilResetJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"anvil_reset"``, `SerializeToJson`\<[`AnvilResetParams`](api.md#anvilresetparams)\>\>

JSON-RPC request for `anvil_reset` method

#### Defined in

vm/api/dist/index.d.ts:1544

___

### AnvilResetJsonRpcResponse

Ƭ **AnvilResetJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"anvil_reset"``, `SerializeToJson`\<[`AnvilResetResult`](api.md#anvilresetresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_reset` procedure

#### Defined in

vm/api/dist/index.d.ts:1819

___

### AnvilResetParams

Ƭ **AnvilResetParams**: `Object`

Params for `anvil_reset` handler

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fork` | \{ `block?`: `BlockTag` \| `Hex` \| `BigInt` ; `url?`: `string`  } |
| `fork.block?` | `BlockTag` \| `Hex` \| `BigInt` |
| `fork.url?` | `string` |

#### Defined in

vm/api/dist/index.d.ts:437

___

### AnvilResetProcedure

Ƭ **AnvilResetProcedure**: (`request`: [`AnvilResetJsonRpcRequest`](api.md#anvilresetjsonrpcrequest)) => `Promise`\<[`AnvilResetJsonRpcResponse`](api.md#anvilresetjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilResetJsonRpcResponse`](api.md#anvilresetjsonrpcresponse)\>

JSON-RPC procedure for `anvil_reset`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilResetJsonRpcRequest`](api.md#anvilresetjsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilResetJsonRpcResponse`](api.md#anvilresetjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1947

___

### AnvilResetResult

Ƭ **AnvilResetResult**: ``null``

#### Defined in

vm/api/dist/index.d.ts:947

___

### AnvilSetBalanceHandler

Ƭ **AnvilSetBalanceHandler**: (`params`: [`AnvilSetBalanceParams`](api.md#anvilsetbalanceparams)) => `Promise`\<[`AnvilSetBalanceResult`](api.md#anvilsetbalanceresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilSetBalanceResult`](api.md#anvilsetbalanceresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilSetBalanceParams`](api.md#anvilsetbalanceparams) |

##### Returns

`Promise`\<[`AnvilSetBalanceResult`](api.md#anvilsetbalanceresult)\>

#### Defined in

vm/api/dist/index.d.ts:963

___

### AnvilSetBalanceJsonRpcRequest

Ƭ **AnvilSetBalanceJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"anvil_setBalance"``, `SerializeToJson`\<[`AnvilSetBalanceParams`](api.md#anvilsetbalanceparams)\>\>

JSON-RPC request for `anvil_setBalance` method

#### Defined in

vm/api/dist/index.d.ts:1552

___

### AnvilSetBalanceJsonRpcResponse

Ƭ **AnvilSetBalanceJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"anvil_setBalance"``, `SerializeToJson`\<[`AnvilSetBalanceResult`](api.md#anvilsetbalanceresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_setBalance` procedure

#### Defined in

vm/api/dist/index.d.ts:1827

___

### AnvilSetBalanceParams

Ƭ **AnvilSetBalanceParams**: `Object`

Params for `anvil_setBalance` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`Address`](index.md#address) | The address to set the balance for |
| `balance` | `Hex` \| `BigInt` | The balance to set |

#### Defined in

vm/api/dist/index.d.ts:461

___

### AnvilSetBalanceProcedure

Ƭ **AnvilSetBalanceProcedure**: (`request`: [`AnvilSetBalanceJsonRpcRequest`](api.md#anvilsetbalancejsonrpcrequest)) => `Promise`\<[`AnvilSetBalanceJsonRpcResponse`](api.md#anvilsetbalancejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilSetBalanceJsonRpcResponse`](api.md#anvilsetbalancejsonrpcresponse)\>

JSON-RPC procedure for `anvil_setBalance`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilSetBalanceJsonRpcRequest`](api.md#anvilsetbalancejsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilSetBalanceJsonRpcResponse`](api.md#anvilsetbalancejsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1955

___

### AnvilSetBalanceResult

Ƭ **AnvilSetBalanceResult**: ``null``

#### Defined in

vm/api/dist/index.d.ts:949

___

### AnvilSetChainIdHandler

Ƭ **AnvilSetChainIdHandler**: (`params`: [`AnvilSetChainIdParams`](api.md#anvilsetchainidparams)) => `Promise`\<[`AnvilSetChainIdResult`](api.md#anvilsetchainidresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilSetChainIdResult`](api.md#anvilsetchainidresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilSetChainIdParams`](api.md#anvilsetchainidparams) |

##### Returns

`Promise`\<[`AnvilSetChainIdResult`](api.md#anvilsetchainidresult)\>

#### Defined in

vm/api/dist/index.d.ts:967

___

### AnvilSetChainIdJsonRpcRequest

Ƭ **AnvilSetChainIdJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"anvil_setChainId"``, `SerializeToJson`\<[`AnvilSetChainIdParams`](api.md#anvilsetchainidparams)\>\>

JSON-RPC request for `anvil_setChainId` method

#### Defined in

vm/api/dist/index.d.ts:1568

___

### AnvilSetChainIdJsonRpcResponse

Ƭ **AnvilSetChainIdJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"anvil_setChainId"``, `SerializeToJson`\<[`AnvilSetChainIdResult`](api.md#anvilsetchainidresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_setChainId` procedure

#### Defined in

vm/api/dist/index.d.ts:1843

___

### AnvilSetChainIdParams

Ƭ **AnvilSetChainIdParams**: `Object`

Params for `anvil_setChainId` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `chainId` | `number` | The chain id to set |

#### Defined in

vm/api/dist/index.d.ts:517

___

### AnvilSetChainIdProcedure

Ƭ **AnvilSetChainIdProcedure**: (`request`: [`AnvilSetChainIdJsonRpcRequest`](api.md#anvilsetchainidjsonrpcrequest)) => `Promise`\<[`AnvilSetChainIdJsonRpcResponse`](api.md#anvilsetchainidjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilSetChainIdJsonRpcResponse`](api.md#anvilsetchainidjsonrpcresponse)\>

JSON-RPC procedure for `anvil_setChainId`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilSetChainIdJsonRpcRequest`](api.md#anvilsetchainidjsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilSetChainIdJsonRpcResponse`](api.md#anvilsetchainidjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1971

___

### AnvilSetChainIdResult

Ƭ **AnvilSetChainIdResult**: ``null``

#### Defined in

vm/api/dist/index.d.ts:953

___

### AnvilSetCodeHandler

Ƭ **AnvilSetCodeHandler**: (`params`: [`AnvilSetCodeParams`](api.md#anvilsetcodeparams)) => `Promise`\<[`AnvilSetCodeResult`](api.md#anvilsetcoderesult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilSetCodeResult`](api.md#anvilsetcoderesult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilSetCodeParams`](api.md#anvilsetcodeparams) |

##### Returns

`Promise`\<[`AnvilSetCodeResult`](api.md#anvilsetcoderesult)\>

#### Defined in

vm/api/dist/index.d.ts:964

___

### AnvilSetCodeJsonRpcRequest

Ƭ **AnvilSetCodeJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"anvil_setCode"``, `SerializeToJson`\<[`AnvilSetCodeParams`](api.md#anvilsetcodeparams)\>\>

JSON-RPC request for `anvil_setCode` method

#### Defined in

vm/api/dist/index.d.ts:1556

___

### AnvilSetCodeJsonRpcResponse

Ƭ **AnvilSetCodeJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"anvil_setCode"``, `SerializeToJson`\<[`AnvilSetCodeResult`](api.md#anvilsetcoderesult)\>, `AnvilError`\>

JSON-RPC response for `anvil_setCode` procedure

#### Defined in

vm/api/dist/index.d.ts:1831

___

### AnvilSetCodeParams

Ƭ **AnvilSetCodeParams**: `Object`

Params for `anvil_setCode` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`Address`](index.md#address) | The address to set the code for |
| `code` | `Hex` | The code to set |

#### Defined in

vm/api/dist/index.d.ts:474

___

### AnvilSetCodeProcedure

Ƭ **AnvilSetCodeProcedure**: (`request`: [`AnvilSetCodeJsonRpcRequest`](api.md#anvilsetcodejsonrpcrequest)) => `Promise`\<[`AnvilSetCodeJsonRpcResponse`](api.md#anvilsetcodejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilSetCodeJsonRpcResponse`](api.md#anvilsetcodejsonrpcresponse)\>

JSON-RPC procedure for `anvil_setCode`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilSetCodeJsonRpcRequest`](api.md#anvilsetcodejsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilSetCodeJsonRpcResponse`](api.md#anvilsetcodejsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1959

___

### AnvilSetCodeResult

Ƭ **AnvilSetCodeResult**: ``null``

#### Defined in

vm/api/dist/index.d.ts:950

___

### AnvilSetNonceHandler

Ƭ **AnvilSetNonceHandler**: (`params`: [`AnvilSetNonceParams`](api.md#anvilsetnonceparams)) => `Promise`\<[`AnvilSetNonceResult`](api.md#anvilsetnonceresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilSetNonceResult`](api.md#anvilsetnonceresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilSetNonceParams`](api.md#anvilsetnonceparams) |

##### Returns

`Promise`\<[`AnvilSetNonceResult`](api.md#anvilsetnonceresult)\>

#### Defined in

vm/api/dist/index.d.ts:965

___

### AnvilSetNonceJsonRpcRequest

Ƭ **AnvilSetNonceJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"anvil_setNonce"``, `SerializeToJson`\<[`AnvilSetNonceParams`](api.md#anvilsetnonceparams)\>\>

JSON-RPC request for `anvil_setNonce` method

#### Defined in

vm/api/dist/index.d.ts:1560

___

### AnvilSetNonceJsonRpcResponse

Ƭ **AnvilSetNonceJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"anvil_setNonce"``, `SerializeToJson`\<[`AnvilSetNonceResult`](api.md#anvilsetnonceresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_setNonce` procedure

#### Defined in

vm/api/dist/index.d.ts:1835

___

### AnvilSetNonceParams

Ƭ **AnvilSetNonceParams**: `Object`

Params for `anvil_setNonce` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`Address`](index.md#address) | The address to set the nonce for |
| `nonce` | `BigInt` | The nonce to set |

#### Defined in

vm/api/dist/index.d.ts:487

___

### AnvilSetNonceProcedure

Ƭ **AnvilSetNonceProcedure**: (`request`: [`AnvilSetNonceJsonRpcRequest`](api.md#anvilsetnoncejsonrpcrequest)) => `Promise`\<[`AnvilSetNonceJsonRpcResponse`](api.md#anvilsetnoncejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilSetNonceJsonRpcResponse`](api.md#anvilsetnoncejsonrpcresponse)\>

JSON-RPC procedure for `anvil_setNonce`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilSetNonceJsonRpcRequest`](api.md#anvilsetnoncejsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilSetNonceJsonRpcResponse`](api.md#anvilsetnoncejsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1963

___

### AnvilSetNonceResult

Ƭ **AnvilSetNonceResult**: ``null``

#### Defined in

vm/api/dist/index.d.ts:951

___

### AnvilSetStorageAtHandler

Ƭ **AnvilSetStorageAtHandler**: (`params`: [`AnvilSetStorageAtParams`](api.md#anvilsetstorageatparams)) => `Promise`\<[`AnvilSetStorageAtResult`](api.md#anvilsetstorageatresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilSetStorageAtResult`](api.md#anvilsetstorageatresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilSetStorageAtParams`](api.md#anvilsetstorageatparams) |

##### Returns

`Promise`\<[`AnvilSetStorageAtResult`](api.md#anvilsetstorageatresult)\>

#### Defined in

vm/api/dist/index.d.ts:966

___

### AnvilSetStorageAtJsonRpcRequest

Ƭ **AnvilSetStorageAtJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"anvil_setStorageAt"``, `SerializeToJson`\<[`AnvilSetStorageAtParams`](api.md#anvilsetstorageatparams)\>\>

JSON-RPC request for `anvil_setStorageAt` method

#### Defined in

vm/api/dist/index.d.ts:1564

___

### AnvilSetStorageAtJsonRpcResponse

Ƭ **AnvilSetStorageAtJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"anvil_setStorageAt"``, `SerializeToJson`\<[`AnvilSetStorageAtResult`](api.md#anvilsetstorageatresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_setStorageAt` procedure

#### Defined in

vm/api/dist/index.d.ts:1839

___

### AnvilSetStorageAtParams

Ƭ **AnvilSetStorageAtParams**: `Object`

Params for `anvil_setStorageAt` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`Address`](index.md#address) | The address to set the storage for |
| `position` | `Hex` \| `BigInt` | The position in storage to set |
| `value` | `Hex` \| `BigInt` | The value to set |

#### Defined in

vm/api/dist/index.d.ts:500

___

### AnvilSetStorageAtProcedure

Ƭ **AnvilSetStorageAtProcedure**: (`request`: [`AnvilSetStorageAtJsonRpcRequest`](api.md#anvilsetstorageatjsonrpcrequest)) => `Promise`\<[`AnvilSetStorageAtJsonRpcResponse`](api.md#anvilsetstorageatjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilSetStorageAtJsonRpcResponse`](api.md#anvilsetstorageatjsonrpcresponse)\>

JSON-RPC procedure for `anvil_setStorageAt`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilSetStorageAtJsonRpcRequest`](api.md#anvilsetstorageatjsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilSetStorageAtJsonRpcResponse`](api.md#anvilsetstorageatjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1967

___

### AnvilSetStorageAtResult

Ƭ **AnvilSetStorageAtResult**: ``null``

#### Defined in

vm/api/dist/index.d.ts:952

___

### AnvilStopImpersonatingAccountHandler

Ƭ **AnvilStopImpersonatingAccountHandler**: (`params`: [`AnvilStopImpersonatingAccountParams`](api.md#anvilstopimpersonatingaccountparams)) => `Promise`\<[`AnvilStopImpersonatingAccountResult`](api.md#anvilstopimpersonatingaccountresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilStopImpersonatingAccountResult`](api.md#anvilstopimpersonatingaccountresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilStopImpersonatingAccountParams`](api.md#anvilstopimpersonatingaccountparams) |

##### Returns

`Promise`\<[`AnvilStopImpersonatingAccountResult`](api.md#anvilstopimpersonatingaccountresult)\>

#### Defined in

vm/api/dist/index.d.ts:958

___

### AnvilStopImpersonatingAccountJsonRpcRequest

Ƭ **AnvilStopImpersonatingAccountJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"anvil_stopImpersonatingAccount"``, `SerializeToJson`\<[`AnvilStopImpersonatingAccountParams`](api.md#anvilstopimpersonatingaccountparams)\>\>

JSON-RPC request for `anvil_stopImpersonatingAccount` method

#### Defined in

vm/api/dist/index.d.ts:1528

___

### AnvilStopImpersonatingAccountJsonRpcResponse

Ƭ **AnvilStopImpersonatingAccountJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"anvil_stopImpersonatingAccount"``, `SerializeToJson`\<[`AnvilStopImpersonatingAccountResult`](api.md#anvilstopimpersonatingaccountresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_stopImpersonatingAccount` procedure

#### Defined in

vm/api/dist/index.d.ts:1803

___

### AnvilStopImpersonatingAccountParams

Ƭ **AnvilStopImpersonatingAccountParams**: `Object`

Params for `anvil_stopImpersonatingAccount` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`Address`](index.md#address) | The address to stop impersonating |

#### Defined in

vm/api/dist/index.d.ts:407

___

### AnvilStopImpersonatingAccountProcedure

Ƭ **AnvilStopImpersonatingAccountProcedure**: (`request`: [`AnvilStopImpersonatingAccountJsonRpcRequest`](api.md#anvilstopimpersonatingaccountjsonrpcrequest)) => `Promise`\<[`AnvilStopImpersonatingAccountJsonRpcResponse`](api.md#anvilstopimpersonatingaccountjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilStopImpersonatingAccountJsonRpcResponse`](api.md#anvilstopimpersonatingaccountjsonrpcresponse)\>

JSON-RPC procedure for `anvil_stopImpersonatingAccount`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilStopImpersonatingAccountJsonRpcRequest`](api.md#anvilstopimpersonatingaccountjsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilStopImpersonatingAccountJsonRpcResponse`](api.md#anvilstopimpersonatingaccountjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1931

___

### AnvilStopImpersonatingAccountResult

Ƭ **AnvilStopImpersonatingAccountResult**: ``null``

#### Defined in

vm/api/dist/index.d.ts:944

___

### BaseCallError

Ƭ **BaseCallError**: [`EvmError`](api.md#evmerror) \| [`InvalidRequestError`](api.md#invalidrequesterror) \| [`InvalidAddressError`](api.md#invalidaddresserror) \| [`InvalidBalanceError`](api.md#invalidbalanceerror) \| [`InvalidBlobVersionedHashesError`](api.md#invalidblobversionedhasheserror) \| [`InvalidBlockError`](api.md#invalidblockerror) \| [`InvalidCallerError`](api.md#invalidcallererror) \| [`InvalidDepthError`](api.md#invaliddeptherror) \| [`InvalidGasLimitError`](api.md#invalidgaslimiterror) \| [`InvalidGasPriceError`](api.md#invalidgaspriceerror) \| [`InvalidGasRefundError`](api.md#invalidgasrefunderror) \| [`InvalidNonceError`](api.md#invalidnonceerror) \| [`InvalidOriginError`](api.md#invalidoriginerror) \| [`InvalidSelfdestructError`](api.md#invalidselfdestructerror) \| [`InvalidSkipBalanceError`](api.md#invalidskipbalanceerror) \| [`InvalidStorageRootError`](api.md#invalidstoragerooterror) \| [`InvalidToError`](api.md#invalidtoerror) \| [`InvalidValueError`](api.md#invalidvalueerror) \| [`UnexpectedError`](api.md#unexpectederror)

Errors returned by all call based tevm procedures including call, contract, and script

#### Defined in

vm/api/dist/index.d.ts:837

___

### BaseCallParams

Ƭ **BaseCallParams**: `Object`

Properties shared accross call-like params

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `blobVersionedHashes?` | `Hex`[] | Versioned hashes for each blob in a blob transaction |
| `block?` | `Partial`\<[`Block`](api.md#block)\> | The `block` the `tx` belongs to. If omitted a default blank block will be used. |
| `caller?` | `Address$1` | The address that ran this code (`msg.sender`). Defaults to the zero address. |
| `depth?` | `number` | The call depth. Defaults to `0` |
| `gasLimit?` | `bigint` | The gas limit for the call. Defaults to `16777215` (`0xffffff`) |
| `gasPrice?` | `bigint` | The gas price for the call. Defaults to `0` |
| `gasRefund?` | `bigint` | Refund counter. Defaults to `0` |
| `origin?` | `Address$1` | The address where the call originated from. Defaults to the zero address. |
| `selfdestruct?` | `Set`\<`Address$1`\> | Addresses to selfdestruct. Defaults to the empty set. |
| `skipBalance?` | `boolean` | Set caller to msg.value of less than msg.value Defaults to false exceipt for when running scripts where it is set to true |
| `to?` | `Address$1` | The address of the account that is executing this code (`address(this)`). Defaults to the zero address. |
| `value?` | `bigint` | The value in ether that is being sent to `opts.address`. Defaults to `0` |

#### Defined in

vm/api/dist/index.d.ts:76

___

### Block

Ƭ **Block**: `Object`

Header information of an ethereum block

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseFeePerGas?` | `bigint` | (Optional) The base fee per gas in the block, introduced in EIP-1559 for dynamic transaction fee calculation. |
| `blobGasPrice?` | `bigint` | The gas price for the block; may be undefined in blocks after EIP-1559. |
| `coinbase` | [`Address`](index.md#address) | The address of the miner or validator who mined or validated the block. |
| `difficulty` | `bigint` | The difficulty level of the block (relevant in PoW chains). |
| `gasLimit` | `bigint` | The gas limit for the block, i.e., the maximum amount of gas that can be used by the transactions in the block. |
| `number` | `bigint` | The block number (height) in the blockchain. |
| `timestamp` | `bigint` | The timestamp at which the block was mined or validated. |

#### Defined in

vm/api/dist/index.d.ts:42

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

vm/api/dist/index.d.ts:592

___

### CallError

Ƭ **CallError**: [`BaseCallError`](api.md#basecallerror) \| [`InvalidSaltError`](api.md#invalidsalterror) \| [`InvalidDataError`](api.md#invaliddataerror) \| [`InvalidDeployedBytecodeError`](api.md#invaliddeployedbytecodeerror)

Error returned by call tevm procedure

**`Example`**

```ts
const {errors} = await tevm.call({address: '0x1234'})
if (errors?.length) {
 console.log(errors[0].name) // InvalidDataError
}
```

#### Defined in

vm/api/dist/index.d.ts:920

___

### CallHandler

Ƭ **CallHandler**: (`action`: [`CallParams`](index.md#callparams)) => `Promise`\<[`CallResult`](index.md#callresult)\>

#### Type declaration

▸ (`action`): `Promise`\<[`CallResult`](index.md#callresult)\>

Handler for call tevm procedure

##### Parameters

| Name | Type |
| :------ | :------ |
| `action` | [`CallParams`](index.md#callparams) |

##### Returns

`Promise`\<[`CallResult`](index.md#callresult)\>

#### Defined in

vm/api/dist/index.d.ts:930

___

### CallJsonRpcProcedure

Ƭ **CallJsonRpcProcedure**: (`request`: [`CallJsonRpcRequest`](api.md#calljsonrpcrequest)) => `Promise`\<[`CallJsonRpcResponse`](api.md#calljsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`CallJsonRpcResponse`](api.md#calljsonrpcresponse)\>

Call JSON-RPC procedure executes a call against the tevm EVM

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`CallJsonRpcRequest`](api.md#calljsonrpcrequest) |

##### Returns

`Promise`\<[`CallJsonRpcResponse`](api.md#calljsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1871

___

### CallJsonRpcRequest

Ƭ **CallJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"tevm_call"``, `SerializeToJson`\<[`CallParams`](index.md#callparams)\>\>

JSON-RPC request for `tevm_call`

#### Defined in

vm/api/dist/index.d.ts:1301

___

### CallJsonRpcResponse

Ƭ **CallJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"tevm_call"``, `SerializeToJson`\<[`CallResult`](index.md#callresult)\>, [`CallError`](api.md#callerror)[``"_tag"``]\>

JSON-RPC response for `tevm_call` procedure

#### Defined in

vm/api/dist/index.d.ts:1614

___

### ContractError

Ƭ **ContractError**: [`BaseCallError`](api.md#basecallerror) \| [`InvalidAddressError`](api.md#invalidaddresserror) \| [`EvmError`](api.md#evmerror) \| [`InvalidRequestError`](api.md#invalidrequesterror) \| [`UnexpectedError`](api.md#unexpectederror) \| `InvalidAbiError` \| [`InvalidDataError`](api.md#invaliddataerror) \| [`InvalidFunctionNameError`](api.md#invalidfunctionnameerror) \| `InvalidArgsError` \| `DecodeFunctionDataError` \| `EncodeFunctionReturnDataError`

Errors returned by contract tevm procedure

**`Example`**

```ts
const {errors} = await tevm.contract({address: '0x1234'})
if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
}
```

#### Defined in

vm/api/dist/index.d.ts:877

___

### ContractHandler

Ƭ **ContractHandler**: \<TAbi, TFunctionName\>(`action`: [`ContractParams`](index.md#contractparams)\<`TAbi`, `TFunctionName`\>) => `Promise`\<[`ContractResult`](index.md#contractresult)\<`TAbi`, `TFunctionName`\>\>

#### Type declaration

▸ \<`TAbi`, `TFunctionName`\>(`action`): `Promise`\<[`ContractResult`](index.md#contractresult)\<`TAbi`, `TFunctionName`\>\>

Handler for contract tevm procedure
It's API resuses the viem `contractRead`/`contractWrite` API to encode abi, functionName, and args

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends [`Abi`](index.md#abi) \| readonly `unknown`[] = [`Abi`](index.md#abi) |
| `TFunctionName` | extends `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\> |

##### Parameters

| Name | Type |
| :------ | :------ |
| `action` | [`ContractParams`](index.md#contractparams)\<`TAbi`, `TFunctionName`\> |

##### Returns

`Promise`\<[`ContractResult`](index.md#contractresult)\<`TAbi`, `TFunctionName`\>\>

#### Defined in

vm/api/dist/index.d.ts:936

___

### ContractJsonRpcProcedure

Ƭ **ContractJsonRpcProcedure**: [`CallJsonRpcRequest`](api.md#calljsonrpcrequest)

Since ContractJsonRpcProcedure is a quality of life wrapper around CallJsonRpcProcedure
 We choose to overload the type instead of creating a new one. Tevm contract handlers encode their
 contract call as a normal call request over JSON-rpc

#### Defined in

vm/api/dist/index.d.ts:1878

___

### ContractJsonRpcRequest

Ƭ **ContractJsonRpcRequest**: [`CallJsonRpcRequest`](api.md#calljsonrpcrequest)

Since contract calls are just a quality of life wrapper around call we avoid using tevm_contract
in favor of overloading tevm_call

#### Defined in

vm/api/dist/index.d.ts:1307

___

### ContractJsonRpcResponse

Ƭ **ContractJsonRpcResponse**: [`CallJsonRpcResponse`](api.md#calljsonrpcresponse)

Since contract calls are just a quality of life wrapper around call we avoid using tevm_contract
in favor of overloading tevm_call

#### Defined in

vm/api/dist/index.d.ts:1620

___

### DebugTraceCallHandler

Ƭ **DebugTraceCallHandler**: (`params`: [`DebugTraceCallParams`](api.md#debugtracecallparams)) => `Promise`\<[`DebugTraceCallResult`](api.md#debugtracecallresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`DebugTraceCallResult`](api.md#debugtracecallresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`DebugTraceCallParams`](api.md#debugtracecallparams) |

##### Returns

`Promise`\<[`DebugTraceCallResult`](api.md#debugtracecallresult)\>

#### Defined in

vm/api/dist/index.d.ts:1227

___

### DebugTraceCallJsonRpcRequest

Ƭ **DebugTraceCallJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"debug_traceCall"``, `SerializeToJson`\<[`DebugTraceCallParams`](api.md#debugtracecallparams)\>\>

JSON-RPC request for `debug_traceCall` method

#### Defined in

vm/api/dist/index.d.ts:1586

___

### DebugTraceCallJsonRpcResponse

Ƭ **DebugTraceCallJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"debug_traceCall"``, `SerializeToJson`\<[`DebugTraceCallResult`](api.md#debugtracecallresult)\>, `DebugError`\>

JSON-RPC response for `debug_traceCall` procedure

#### Defined in

vm/api/dist/index.d.ts:1861

___

### DebugTraceCallParams

Ƭ **DebugTraceCallParams**\<`TChain`\>: [`TraceParams`](api.md#traceparams) & \{ `block?`: `BlockTag` \| `Hex` \| `BigInt` ; `transaction`: `CallParameters`\<`TChain`\>  }

Params taken by `debug_traceCall` handler

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TChain` | extends `Chain` \| `undefined` = `Chain` \| `undefined` |

#### Defined in

vm/api/dist/index.d.ts:568

___

### DebugTraceCallProcedure

Ƭ **DebugTraceCallProcedure**: (`request`: [`DebugTraceCallJsonRpcRequest`](api.md#debugtracecalljsonrpcrequest)) => `Promise`\<[`DebugTraceCallJsonRpcResponse`](api.md#debugtracecalljsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`DebugTraceCallJsonRpcResponse`](api.md#debugtracecalljsonrpcresponse)\>

JSON-RPC procedure for `debug_traceCall`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`DebugTraceCallJsonRpcRequest`](api.md#debugtracecalljsonrpcrequest) |

##### Returns

`Promise`\<[`DebugTraceCallJsonRpcResponse`](api.md#debugtracecalljsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1988

___

### DebugTraceCallResult

Ƭ **DebugTraceCallResult**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `failed` | `boolean` |
| `gas` | `bigint` |
| `returnValue` | `Hex` |
| `structLogs` | `ReadonlyArray`\<`StructLog`\> |

#### Defined in

vm/api/dist/index.d.ts:1219

___

### DebugTraceTransactionHandler

Ƭ **DebugTraceTransactionHandler**: (`params`: [`DebugTraceTransactionParams`](api.md#debugtracetransactionparams)) => `Promise`\<[`DebugTraceTransactionResult`](api.md#debugtracetransactionresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`DebugTraceTransactionResult`](api.md#debugtracetransactionresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`DebugTraceTransactionParams`](api.md#debugtracetransactionparams) |

##### Returns

`Promise`\<[`DebugTraceTransactionResult`](api.md#debugtracetransactionresult)\>

#### Defined in

vm/api/dist/index.d.ts:1226

___

### DebugTraceTransactionJsonRpcRequest

Ƭ **DebugTraceTransactionJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"debug_traceTransaction"``, `SerializeToJson`\<[`DebugTraceTransactionParams`](api.md#debugtracetransactionparams)\>\>

JSON-RPC request for `debug_traceTransaction` method

#### Defined in

vm/api/dist/index.d.ts:1582

___

### DebugTraceTransactionJsonRpcResponse

Ƭ **DebugTraceTransactionJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"debug_traceTransaction"``, `SerializeToJson`\<[`DebugTraceTransactionResult`](api.md#debugtracetransactionresult)\>, `DebugError`\>

JSON-RPC response for `debug_traceTransaction` procedure

#### Defined in

vm/api/dist/index.d.ts:1857

___

### DebugTraceTransactionParams

Ƭ **DebugTraceTransactionParams**: [`TraceParams`](api.md#traceparams) & \{ `transactionHash`: `Hex`  }

Params taken by `debug_traceTransaction` handler

#### Defined in

vm/api/dist/index.d.ts:559

___

### DebugTraceTransactionProcedure

Ƭ **DebugTraceTransactionProcedure**: (`request`: [`DebugTraceTransactionJsonRpcRequest`](api.md#debugtracetransactionjsonrpcrequest)) => `Promise`\<[`DebugTraceTransactionJsonRpcResponse`](api.md#debugtracetransactionjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`DebugTraceTransactionJsonRpcResponse`](api.md#debugtracetransactionjsonrpcresponse)\>

JSON-RPC procedure for `debug_traceTransaction`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`DebugTraceTransactionJsonRpcRequest`](api.md#debugtracetransactionjsonrpcrequest) |

##### Returns

`Promise`\<[`DebugTraceTransactionJsonRpcResponse`](api.md#debugtracetransactionjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1984

___

### DebugTraceTransactionResult

Ƭ **DebugTraceTransactionResult**: [`TraceResult`](api.md#traceresult)

#### Defined in

vm/api/dist/index.d.ts:1218

___

### EthAccountsHandler

Ƭ **EthAccountsHandler**: (`request?`: [`EthAccountsParams`](api.md#ethaccountsparams)) => `Promise`\<[`EthAccountsResult`](api.md#ethaccountsresult)\>

#### Type declaration

▸ (`request?`): `Promise`\<[`EthAccountsResult`](api.md#ethaccountsresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request?` | [`EthAccountsParams`](api.md#ethaccountsparams) |

##### Returns

`Promise`\<[`EthAccountsResult`](api.md#ethaccountsresult)\>

#### Defined in

vm/api/dist/index.d.ts:1229

___

### EthAccountsJsonRpcProcedure

Ƭ **EthAccountsJsonRpcProcedure**: (`request`: [`EthAccountsJsonRpcRequest`](api.md#ethaccountsjsonrpcrequest)) => `Promise`\<[`EthAccountsJsonRpcResponse`](api.md#ethaccountsjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthAccountsJsonRpcResponse`](api.md#ethaccountsjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthAccountsJsonRpcRequest`](api.md#ethaccountsjsonrpcrequest) |

##### Returns

`Promise`\<[`EthAccountsJsonRpcResponse`](api.md#ethaccountsjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1885

___

### EthAccountsJsonRpcRequest

Ƭ **EthAccountsJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_accounts"``, readonly []\>

JSON-RPC request for `eth_accounts` procedure

#### Defined in

vm/api/dist/index.d.ts:1339

___

### EthAccountsJsonRpcResponse

Ƭ **EthAccountsJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_accounts"``, [`Address`](index.md#address)[], `string`\>

JSON-RPC response for `eth_accounts` procedure

#### Defined in

vm/api/dist/index.d.ts:1630

___

### EthAccountsParams

Ƭ **EthAccountsParams**: `EmptyParams`

Params taken by `eth_accounts` handler

#### Defined in

vm/api/dist/index.d.ts:194

___

### EthAccountsResult

Ƭ **EthAccountsResult**: `Address$1`[]

TODO I didn't update any of these jsdocs
TODO some of these types are not deserialized and/or don't match viem types and will
need to be updated as t hey are implemented

#### Defined in

vm/api/dist/index.d.ts:1045

___

### EthBlockNumberHandler

Ƭ **EthBlockNumberHandler**: (`request?`: [`EthBlockNumberParams`](api.md#ethblocknumberparams)) => `Promise`\<[`EthBlockNumberResult`](api.md#ethblocknumberresult)\>

#### Type declaration

▸ (`request?`): `Promise`\<[`EthBlockNumberResult`](api.md#ethblocknumberresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request?` | [`EthBlockNumberParams`](api.md#ethblocknumberparams) |

##### Returns

`Promise`\<[`EthBlockNumberResult`](api.md#ethblocknumberresult)\>

#### Defined in

vm/api/dist/index.d.ts:1230

___

### EthBlockNumberJsonRpcProcedure

Ƭ **EthBlockNumberJsonRpcProcedure**: (`request`: [`EthBlockNumberJsonRpcRequest`](api.md#ethblocknumberjsonrpcrequest)) => `Promise`\<[`EthBlockNumberJsonRpcResponse`](api.md#ethblocknumberjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthBlockNumberJsonRpcResponse`](api.md#ethblocknumberjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthBlockNumberJsonRpcRequest`](api.md#ethblocknumberjsonrpcrequest) |

##### Returns

`Promise`\<[`EthBlockNumberJsonRpcResponse`](api.md#ethblocknumberjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1886

___

### EthBlockNumberJsonRpcRequest

Ƭ **EthBlockNumberJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_blockNumber"``, readonly []\>

JSON-RPC request for `eth_blockNumber` procedure

#### Defined in

vm/api/dist/index.d.ts:1343

___

### EthBlockNumberJsonRpcResponse

Ƭ **EthBlockNumberJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_blockNumber"``, `SerializeToJson`\<[`EthBlockNumberResult`](api.md#ethblocknumberresult)\>, `string`\>

JSON-RPC response for `eth_blockNumber` procedure

#### Defined in

vm/api/dist/index.d.ts:1634

___

### EthBlockNumberParams

Ƭ **EthBlockNumberParams**: `EmptyParams`

JSON-RPC request for `eth_blockNumber` procedure

#### Defined in

vm/api/dist/index.d.ts:198

___

### EthBlockNumberResult

Ƭ **EthBlockNumberResult**: `bigint`

JSON-RPC response for `eth_blockNumber` procedure

#### Defined in

vm/api/dist/index.d.ts:1049

___

### EthCallHandler

Ƭ **EthCallHandler**: (`request`: [`EthCallParams`](api.md#ethcallparams)) => `Promise`\<[`EthCallResult`](api.md#ethcallresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthCallResult`](api.md#ethcallresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthCallParams`](api.md#ethcallparams) |

##### Returns

`Promise`\<[`EthCallResult`](api.md#ethcallresult)\>

#### Defined in

vm/api/dist/index.d.ts:1231

___

### EthCallJsonRpcProcedure

Ƭ **EthCallJsonRpcProcedure**: (`request`: [`EthCallJsonRpcRequest`](api.md#ethcalljsonrpcrequest)) => `Promise`\<[`EthCallJsonRpcResponse`](api.md#ethcalljsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthCallJsonRpcResponse`](api.md#ethcalljsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthCallJsonRpcRequest`](api.md#ethcalljsonrpcrequest) |

##### Returns

`Promise`\<[`EthCallJsonRpcResponse`](api.md#ethcalljsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1887

___

### EthCallJsonRpcRequest

Ƭ **EthCallJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_call"``, readonly [tx: Transaction, tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_call` procedure

#### Defined in

vm/api/dist/index.d.ts:1347

___

### EthCallJsonRpcResponse

Ƭ **EthCallJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_call"``, `Hex`, `string`\>

JSON-RPC response for `eth_call` procedure

#### Defined in

vm/api/dist/index.d.ts:1638

___

### EthCallParams

Ƭ **EthCallParams**: `CallParameters`

JSON-RPC request for `eth_call` procedure

#### Defined in

vm/api/dist/index.d.ts:202

___

### EthCallResult

Ƭ **EthCallResult**: `Hex`

JSON-RPC response for `eth_call` procedure

#### Defined in

vm/api/dist/index.d.ts:1053

___

### EthChainIdHandler

Ƭ **EthChainIdHandler**: (`request?`: [`EthChainIdParams`](api.md#ethchainidparams)) => `Promise`\<[`EthChainIdResult`](api.md#ethchainidresult)\>

#### Type declaration

▸ (`request?`): `Promise`\<[`EthChainIdResult`](api.md#ethchainidresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request?` | [`EthChainIdParams`](api.md#ethchainidparams) |

##### Returns

`Promise`\<[`EthChainIdResult`](api.md#ethchainidresult)\>

#### Defined in

vm/api/dist/index.d.ts:1232

___

### EthChainIdJsonRpcProcedure

Ƭ **EthChainIdJsonRpcProcedure**: (`request`: [`EthChainIdJsonRpcRequest`](api.md#ethchainidjsonrpcrequest)) => `Promise`\<[`EthChainIdJsonRpcResponse`](api.md#ethchainidjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthChainIdJsonRpcResponse`](api.md#ethchainidjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthChainIdJsonRpcRequest`](api.md#ethchainidjsonrpcrequest) |

##### Returns

`Promise`\<[`EthChainIdJsonRpcResponse`](api.md#ethchainidjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1888

___

### EthChainIdJsonRpcRequest

Ƭ **EthChainIdJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_chainId"``, readonly []\>

JSON-RPC request for `eth_chainId` procedure

#### Defined in

vm/api/dist/index.d.ts:1351

___

### EthChainIdJsonRpcResponse

Ƭ **EthChainIdJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_chainId"``, `Hex`, `string`\>

JSON-RPC response for `eth_chainId` procedure

#### Defined in

vm/api/dist/index.d.ts:1642

___

### EthChainIdParams

Ƭ **EthChainIdParams**: `EmptyParams`

JSON-RPC request for `eth_chainId` procedure

#### Defined in

vm/api/dist/index.d.ts:206

___

### EthChainIdResult

Ƭ **EthChainIdResult**: `bigint`

JSON-RPC response for `eth_chainId` procedure

#### Defined in

vm/api/dist/index.d.ts:1057

___

### EthCoinbaseHandler

Ƭ **EthCoinbaseHandler**: (`request`: [`EthCoinbaseParams`](api.md#ethcoinbaseparams)) => `Promise`\<[`EthCoinbaseResult`](api.md#ethcoinbaseresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthCoinbaseResult`](api.md#ethcoinbaseresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthCoinbaseParams`](api.md#ethcoinbaseparams) |

##### Returns

`Promise`\<[`EthCoinbaseResult`](api.md#ethcoinbaseresult)\>

#### Defined in

vm/api/dist/index.d.ts:1233

___

### EthCoinbaseJsonRpcProcedure

Ƭ **EthCoinbaseJsonRpcProcedure**: (`request`: [`EthCoinbaseJsonRpcRequest`](api.md#ethcoinbasejsonrpcrequest)) => `Promise`\<[`EthCoinbaseJsonRpcResponse`](api.md#ethcoinbasejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthCoinbaseJsonRpcResponse`](api.md#ethcoinbasejsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthCoinbaseJsonRpcRequest`](api.md#ethcoinbasejsonrpcrequest) |

##### Returns

`Promise`\<[`EthCoinbaseJsonRpcResponse`](api.md#ethcoinbasejsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1889

___

### EthCoinbaseJsonRpcRequest

Ƭ **EthCoinbaseJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_coinbase"``, readonly []\>

JSON-RPC request for `eth_coinbase` procedure

#### Defined in

vm/api/dist/index.d.ts:1355

___

### EthCoinbaseJsonRpcResponse

Ƭ **EthCoinbaseJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_coinbase"``, `Hex`, `string`\>

JSON-RPC response for `eth_coinbase` procedure

#### Defined in

vm/api/dist/index.d.ts:1646

___

### EthCoinbaseParams

Ƭ **EthCoinbaseParams**: `EmptyParams`

JSON-RPC request for `eth_coinbase` procedure

#### Defined in

vm/api/dist/index.d.ts:210

___

### EthCoinbaseResult

Ƭ **EthCoinbaseResult**: `Address$1`

JSON-RPC response for `eth_coinbase` procedure

#### Defined in

vm/api/dist/index.d.ts:1061

___

### EthEstimateGasHandler

Ƭ **EthEstimateGasHandler**: (`request`: [`EthEstimateGasParams`](api.md#ethestimategasparams)) => `Promise`\<[`EthEstimateGasResult`](api.md#ethestimategasresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthEstimateGasResult`](api.md#ethestimategasresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthEstimateGasParams`](api.md#ethestimategasparams) |

##### Returns

`Promise`\<[`EthEstimateGasResult`](api.md#ethestimategasresult)\>

#### Defined in

vm/api/dist/index.d.ts:1234

___

### EthEstimateGasJsonRpcProcedure

Ƭ **EthEstimateGasJsonRpcProcedure**: (`request`: [`EthEstimateGasJsonRpcRequest`](api.md#ethestimategasjsonrpcrequest)) => `Promise`\<[`EthEstimateGasJsonRpcResponse`](api.md#ethestimategasjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthEstimateGasJsonRpcResponse`](api.md#ethestimategasjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthEstimateGasJsonRpcRequest`](api.md#ethestimategasjsonrpcrequest) |

##### Returns

`Promise`\<[`EthEstimateGasJsonRpcResponse`](api.md#ethestimategasjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1890

___

### EthEstimateGasJsonRpcRequest

Ƭ **EthEstimateGasJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_estimateGas"``, readonly [tx: Transaction]\>

JSON-RPC request for `eth_estimateGas` procedure

#### Defined in

vm/api/dist/index.d.ts:1359

___

### EthEstimateGasJsonRpcResponse

Ƭ **EthEstimateGasJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_estimateGas"``, `Hex`, `string`\>

JSON-RPC response for `eth_estimateGas` procedure

#### Defined in

vm/api/dist/index.d.ts:1650

___

### EthEstimateGasParams

Ƭ **EthEstimateGasParams**: `EstimateGasParameters`

JSON-RPC request for `eth_estimateGas` procedure

#### Defined in

vm/api/dist/index.d.ts:214

___

### EthEstimateGasResult

Ƭ **EthEstimateGasResult**: `bigint`

JSON-RPC response for `eth_estimateGas` procedure

#### Defined in

vm/api/dist/index.d.ts:1065

___

### EthGasPriceHandler

Ƭ **EthGasPriceHandler**: (`request?`: [`EthGasPriceParams`](api.md#ethgaspriceparams)) => `Promise`\<[`EthGasPriceResult`](api.md#ethgaspriceresult)\>

#### Type declaration

▸ (`request?`): `Promise`\<[`EthGasPriceResult`](api.md#ethgaspriceresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request?` | [`EthGasPriceParams`](api.md#ethgaspriceparams) |

##### Returns

`Promise`\<[`EthGasPriceResult`](api.md#ethgaspriceresult)\>

#### Defined in

vm/api/dist/index.d.ts:1236

___

### EthGasPriceJsonRpcProcedure

Ƭ **EthGasPriceJsonRpcProcedure**: (`request`: [`EthGasPriceJsonRpcRequest`](api.md#ethgaspricejsonrpcrequest)) => `Promise`\<[`EthGasPriceJsonRpcResponse`](api.md#ethgaspricejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGasPriceJsonRpcResponse`](api.md#ethgaspricejsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGasPriceJsonRpcRequest`](api.md#ethgaspricejsonrpcrequest) |

##### Returns

`Promise`\<[`EthGasPriceJsonRpcResponse`](api.md#ethgaspricejsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1892

___

### EthGasPriceJsonRpcRequest

Ƭ **EthGasPriceJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_gasPrice"``, readonly []\>

JSON-RPC request for `eth_gasPrice` procedure

#### Defined in

vm/api/dist/index.d.ts:1367

___

### EthGasPriceJsonRpcResponse

Ƭ **EthGasPriceJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_gasPrice"``, `Hex`, `string`\>

JSON-RPC response for `eth_gasPrice` procedure

#### Defined in

vm/api/dist/index.d.ts:1658

___

### EthGasPriceParams

Ƭ **EthGasPriceParams**: `EmptyParams`

JSON-RPC request for `eth_gasPrice` procedure

#### Defined in

vm/api/dist/index.d.ts:222

___

### EthGasPriceResult

Ƭ **EthGasPriceResult**: `bigint`

JSON-RPC response for `eth_gasPrice` procedure

#### Defined in

vm/api/dist/index.d.ts:1073

___

### EthGetBalanceHandler

Ƭ **EthGetBalanceHandler**: (`request`: [`EthGetBalanceParams`](api.md#ethgetbalanceparams)) => `Promise`\<[`EthGetBalanceResult`](api.md#ethgetbalanceresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBalanceResult`](api.md#ethgetbalanceresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBalanceParams`](api.md#ethgetbalanceparams) |

##### Returns

`Promise`\<[`EthGetBalanceResult`](api.md#ethgetbalanceresult)\>

#### Defined in

vm/api/dist/index.d.ts:1237

___

### EthGetBalanceJsonRpcProcedure

Ƭ **EthGetBalanceJsonRpcProcedure**: (`request`: [`EthGetBalanceJsonRpcRequest`](api.md#ethgetbalancejsonrpcrequest)) => `Promise`\<[`EthGetBalanceJsonRpcResponse`](api.md#ethgetbalancejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBalanceJsonRpcResponse`](api.md#ethgetbalancejsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBalanceJsonRpcRequest`](api.md#ethgetbalancejsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetBalanceJsonRpcResponse`](api.md#ethgetbalancejsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1893

___

### EthGetBalanceJsonRpcRequest

Ƭ **EthGetBalanceJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_getBalance"``, [address: Address, tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_getBalance` procedure

#### Defined in

vm/api/dist/index.d.ts:1371

___

### EthGetBalanceJsonRpcResponse

Ƭ **EthGetBalanceJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_getBalance"``, `Hex`, `string`\>

JSON-RPC response for `eth_getBalance` procedure

#### Defined in

vm/api/dist/index.d.ts:1662

___

### EthGetBalanceParams

Ƭ **EthGetBalanceParams**: `GetBalanceParameters`

JSON-RPC request for `eth_getBalance` procedure

#### Defined in

vm/api/dist/index.d.ts:226

___

### EthGetBalanceResult

Ƭ **EthGetBalanceResult**: `bigint`

JSON-RPC response for `eth_getBalance` procedure

#### Defined in

vm/api/dist/index.d.ts:1077

___

### EthGetBlockByHashHandler

Ƭ **EthGetBlockByHashHandler**: (`request`: [`EthGetBlockByHashParams`](api.md#ethgetblockbyhashparams)) => `Promise`\<[`EthGetBlockByHashResult`](api.md#ethgetblockbyhashresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBlockByHashResult`](api.md#ethgetblockbyhashresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBlockByHashParams`](api.md#ethgetblockbyhashparams) |

##### Returns

`Promise`\<[`EthGetBlockByHashResult`](api.md#ethgetblockbyhashresult)\>

#### Defined in

vm/api/dist/index.d.ts:1238

___

### EthGetBlockByHashJsonRpcProcedure

Ƭ **EthGetBlockByHashJsonRpcProcedure**: (`request`: [`EthGetBlockByHashJsonRpcRequest`](api.md#ethgetblockbyhashjsonrpcrequest)) => `Promise`\<[`EthGetBlockByHashJsonRpcResponse`](api.md#ethgetblockbyhashjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBlockByHashJsonRpcResponse`](api.md#ethgetblockbyhashjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBlockByHashJsonRpcRequest`](api.md#ethgetblockbyhashjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetBlockByHashJsonRpcResponse`](api.md#ethgetblockbyhashjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1894

___

### EthGetBlockByHashJsonRpcRequest

Ƭ **EthGetBlockByHashJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_getBlockByHash"``, readonly [blockHash: Hex, fullTransactionObjects: boolean]\>

JSON-RPC request for `eth_getBlockByHash` procedure

#### Defined in

vm/api/dist/index.d.ts:1378

___

### EthGetBlockByHashJsonRpcResponse

Ƭ **EthGetBlockByHashJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_getBlockByHash"``, [`BlockResult`](api.md#blockresult), `string`\>

JSON-RPC response for `eth_getBlockByHash` procedure

#### Defined in

vm/api/dist/index.d.ts:1666

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

vm/api/dist/index.d.ts:230

___

### EthGetBlockByHashResult

Ƭ **EthGetBlockByHashResult**: [`BlockResult`](api.md#blockresult)

JSON-RPC response for `eth_getBlockByHash` procedure

#### Defined in

vm/api/dist/index.d.ts:1081

___

### EthGetBlockByNumberHandler

Ƭ **EthGetBlockByNumberHandler**: (`request`: [`EthGetBlockByNumberParams`](api.md#ethgetblockbynumberparams)) => `Promise`\<[`EthGetBlockByNumberResult`](api.md#ethgetblockbynumberresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBlockByNumberResult`](api.md#ethgetblockbynumberresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBlockByNumberParams`](api.md#ethgetblockbynumberparams) |

##### Returns

`Promise`\<[`EthGetBlockByNumberResult`](api.md#ethgetblockbynumberresult)\>

#### Defined in

vm/api/dist/index.d.ts:1239

___

### EthGetBlockByNumberJsonRpcProcedure

Ƭ **EthGetBlockByNumberJsonRpcProcedure**: (`request`: [`EthGetBlockByNumberJsonRpcRequest`](api.md#ethgetblockbynumberjsonrpcrequest)) => `Promise`\<[`EthGetBlockByNumberJsonRpcResponse`](api.md#ethgetblockbynumberjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBlockByNumberJsonRpcResponse`](api.md#ethgetblockbynumberjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBlockByNumberJsonRpcRequest`](api.md#ethgetblockbynumberjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetBlockByNumberJsonRpcResponse`](api.md#ethgetblockbynumberjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1895

___

### EthGetBlockByNumberJsonRpcRequest

Ƭ **EthGetBlockByNumberJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_getBlockByNumber"``, readonly [tag: BlockTag \| Hex, fullTransactionObjects: boolean]\>

JSON-RPC request for `eth_getBlockByNumber` procedure

#### Defined in

vm/api/dist/index.d.ts:1382

___

### EthGetBlockByNumberJsonRpcResponse

Ƭ **EthGetBlockByNumberJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_getBlockByNumber"``, [`BlockResult`](api.md#blockresult), `string`\>

JSON-RPC response for `eth_getBlockByNumber` procedure

#### Defined in

vm/api/dist/index.d.ts:1670

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

vm/api/dist/index.d.ts:237

___

### EthGetBlockByNumberResult

Ƭ **EthGetBlockByNumberResult**: [`BlockResult`](api.md#blockresult)

JSON-RPC response for `eth_getBlockByNumber` procedure

#### Defined in

vm/api/dist/index.d.ts:1085

___

### EthGetBlockTransactionCountByHashHandler

Ƭ **EthGetBlockTransactionCountByHashHandler**: (`request`: [`EthGetBlockTransactionCountByHashParams`](api.md#ethgetblocktransactioncountbyhashparams)) => `Promise`\<[`EthGetBlockTransactionCountByHashResult`](api.md#ethgetblocktransactioncountbyhashresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBlockTransactionCountByHashResult`](api.md#ethgetblocktransactioncountbyhashresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBlockTransactionCountByHashParams`](api.md#ethgetblocktransactioncountbyhashparams) |

##### Returns

`Promise`\<[`EthGetBlockTransactionCountByHashResult`](api.md#ethgetblocktransactioncountbyhashresult)\>

#### Defined in

vm/api/dist/index.d.ts:1240

___

### EthGetBlockTransactionCountByHashJsonRpcProcedure

Ƭ **EthGetBlockTransactionCountByHashJsonRpcProcedure**: (`request`: [`EthGetBlockTransactionCountByHashJsonRpcRequest`](api.md#ethgetblocktransactioncountbyhashjsonrpcrequest)) => `Promise`\<[`EthGetBlockTransactionCountByHashJsonRpcResponse`](api.md#ethgetblocktransactioncountbyhashjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBlockTransactionCountByHashJsonRpcResponse`](api.md#ethgetblocktransactioncountbyhashjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBlockTransactionCountByHashJsonRpcRequest`](api.md#ethgetblocktransactioncountbyhashjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetBlockTransactionCountByHashJsonRpcResponse`](api.md#ethgetblocktransactioncountbyhashjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1896

___

### EthGetBlockTransactionCountByHashJsonRpcRequest

Ƭ **EthGetBlockTransactionCountByHashJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_getBlockTransactionCountByHash"``, readonly [hash: Hex]\>

JSON-RPC request for `eth_getBlockTransactionCountByHash` procedure

#### Defined in

vm/api/dist/index.d.ts:1386

___

### EthGetBlockTransactionCountByHashJsonRpcResponse

Ƭ **EthGetBlockTransactionCountByHashJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_getBlockTransactionCountByHash"``, `Hex`, `string`\>

JSON-RPC response for `eth_getBlockTransactionCountByHash` procedure

#### Defined in

vm/api/dist/index.d.ts:1674

___

### EthGetBlockTransactionCountByHashParams

Ƭ **EthGetBlockTransactionCountByHashParams**: `Object`

JSON-RPC request for `eth_getBlockTransactionCountByHash` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `hash` | `Hex` |

#### Defined in

vm/api/dist/index.d.ts:244

___

### EthGetBlockTransactionCountByHashResult

Ƭ **EthGetBlockTransactionCountByHashResult**: `Hex`

JSON-RPC response for `eth_getBlockTransactionCountByHash` procedure

#### Defined in

vm/api/dist/index.d.ts:1089

___

### EthGetBlockTransactionCountByNumberHandler

Ƭ **EthGetBlockTransactionCountByNumberHandler**: (`request`: [`EthGetBlockTransactionCountByNumberParams`](api.md#ethgetblocktransactioncountbynumberparams)) => `Promise`\<[`EthGetBlockTransactionCountByNumberResult`](api.md#ethgetblocktransactioncountbynumberresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBlockTransactionCountByNumberResult`](api.md#ethgetblocktransactioncountbynumberresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBlockTransactionCountByNumberParams`](api.md#ethgetblocktransactioncountbynumberparams) |

##### Returns

`Promise`\<[`EthGetBlockTransactionCountByNumberResult`](api.md#ethgetblocktransactioncountbynumberresult)\>

#### Defined in

vm/api/dist/index.d.ts:1241

___

### EthGetBlockTransactionCountByNumberJsonRpcProcedure

Ƭ **EthGetBlockTransactionCountByNumberJsonRpcProcedure**: (`request`: [`EthGetBlockTransactionCountByNumberJsonRpcRequest`](api.md#ethgetblocktransactioncountbynumberjsonrpcrequest)) => `Promise`\<[`EthGetBlockTransactionCountByNumberJsonRpcResponse`](api.md#ethgetblocktransactioncountbynumberjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBlockTransactionCountByNumberJsonRpcResponse`](api.md#ethgetblocktransactioncountbynumberjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBlockTransactionCountByNumberJsonRpcRequest`](api.md#ethgetblocktransactioncountbynumberjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetBlockTransactionCountByNumberJsonRpcResponse`](api.md#ethgetblocktransactioncountbynumberjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1897

___

### EthGetBlockTransactionCountByNumberJsonRpcRequest

Ƭ **EthGetBlockTransactionCountByNumberJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_getBlockTransactionCountByNumber"``, readonly [tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_getBlockTransactionCountByNumber` procedure

#### Defined in

vm/api/dist/index.d.ts:1390

___

### EthGetBlockTransactionCountByNumberJsonRpcResponse

Ƭ **EthGetBlockTransactionCountByNumberJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_getBlockTransactionCountByNumber"``, `Hex`, `string`\>

JSON-RPC response for `eth_getBlockTransactionCountByNumber` procedure

#### Defined in

vm/api/dist/index.d.ts:1678

___

### EthGetBlockTransactionCountByNumberParams

Ƭ **EthGetBlockTransactionCountByNumberParams**: `Object`

JSON-RPC request for `eth_getBlockTransactionCountByNumber` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `tag` | `BlockTag` \| `Hex` |

#### Defined in

vm/api/dist/index.d.ts:250

___

### EthGetBlockTransactionCountByNumberResult

Ƭ **EthGetBlockTransactionCountByNumberResult**: `Hex`

JSON-RPC response for `eth_getBlockTransactionCountByNumber` procedure

#### Defined in

vm/api/dist/index.d.ts:1093

___

### EthGetCodeHandler

Ƭ **EthGetCodeHandler**: (`request`: [`EthGetCodeParams`](api.md#ethgetcodeparams)) => `Promise`\<[`EthGetCodeResult`](api.md#ethgetcoderesult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetCodeResult`](api.md#ethgetcoderesult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetCodeParams`](api.md#ethgetcodeparams) |

##### Returns

`Promise`\<[`EthGetCodeResult`](api.md#ethgetcoderesult)\>

#### Defined in

vm/api/dist/index.d.ts:1242

___

### EthGetCodeJsonRpcProcedure

Ƭ **EthGetCodeJsonRpcProcedure**: (`request`: [`EthGetCodeJsonRpcRequest`](api.md#ethgetcodejsonrpcrequest)) => `Promise`\<[`EthGetCodeJsonRpcResponse`](api.md#ethgetcodejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetCodeJsonRpcResponse`](api.md#ethgetcodejsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetCodeJsonRpcRequest`](api.md#ethgetcodejsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetCodeJsonRpcResponse`](api.md#ethgetcodejsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1898

___

### EthGetCodeJsonRpcRequest

Ƭ **EthGetCodeJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_getCode"``, readonly [address: Address, tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_getCode` procedure

#### Defined in

vm/api/dist/index.d.ts:1394

___

### EthGetCodeJsonRpcResponse

Ƭ **EthGetCodeJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_getCode"``, `Hex`, `string`\>

JSON-RPC response for `eth_getCode` procedure

#### Defined in

vm/api/dist/index.d.ts:1682

___

### EthGetCodeParams

Ƭ **EthGetCodeParams**: `Object`

JSON-RPC request for `eth_getCode` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | [`Address`](index.md#address) |
| `tag` | `BlockTag` \| `Hex` |

#### Defined in

vm/api/dist/index.d.ts:256

___

### EthGetCodeResult

Ƭ **EthGetCodeResult**: `Hex`

JSON-RPC response for `eth_getCode` procedure

#### Defined in

vm/api/dist/index.d.ts:1097

___

### EthGetFilterChangesHandler

Ƭ **EthGetFilterChangesHandler**: (`request`: [`EthGetFilterChangesParams`](api.md#ethgetfilterchangesparams)) => `Promise`\<[`EthGetFilterChangesResult`](api.md#ethgetfilterchangesresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetFilterChangesResult`](api.md#ethgetfilterchangesresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetFilterChangesParams`](api.md#ethgetfilterchangesparams) |

##### Returns

`Promise`\<[`EthGetFilterChangesResult`](api.md#ethgetfilterchangesresult)\>

#### Defined in

vm/api/dist/index.d.ts:1243

___

### EthGetFilterChangesJsonRpcProcedure

Ƭ **EthGetFilterChangesJsonRpcProcedure**: (`request`: [`EthGetFilterChangesJsonRpcRequest`](api.md#ethgetfilterchangesjsonrpcrequest)) => `Promise`\<[`EthGetFilterChangesJsonRpcResponse`](api.md#ethgetfilterchangesjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetFilterChangesJsonRpcResponse`](api.md#ethgetfilterchangesjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetFilterChangesJsonRpcRequest`](api.md#ethgetfilterchangesjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetFilterChangesJsonRpcResponse`](api.md#ethgetfilterchangesjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1899

___

### EthGetFilterChangesJsonRpcRequest

Ƭ **EthGetFilterChangesJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_getFilterChanges"``, [filterId: Hex]\>

JSON-RPC request for `eth_getFilterChanges` procedure

#### Defined in

vm/api/dist/index.d.ts:1398

___

### EthGetFilterChangesJsonRpcResponse

Ƭ **EthGetFilterChangesJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_getFilterChanges"``, [`FilterLog`](api.md#filterlog)[], `string`\>

JSON-RPC response for `eth_getFilterChanges` procedure

#### Defined in

vm/api/dist/index.d.ts:1686

___

### EthGetFilterChangesParams

Ƭ **EthGetFilterChangesParams**: `Object`

JSON-RPC request for `eth_getFilterChanges` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `filterId` | `Hex` |

#### Defined in

vm/api/dist/index.d.ts:263

___

### EthGetFilterChangesResult

Ƭ **EthGetFilterChangesResult**: [`FilterLog`](api.md#filterlog)[]

JSON-RPC response for `eth_getFilterChanges` procedure

#### Defined in

vm/api/dist/index.d.ts:1101

___

### EthGetFilterLogsHandler

Ƭ **EthGetFilterLogsHandler**: (`request`: [`EthGetFilterLogsParams`](api.md#ethgetfilterlogsparams)) => `Promise`\<[`EthGetFilterLogsResult`](api.md#ethgetfilterlogsresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetFilterLogsResult`](api.md#ethgetfilterlogsresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetFilterLogsParams`](api.md#ethgetfilterlogsparams) |

##### Returns

`Promise`\<[`EthGetFilterLogsResult`](api.md#ethgetfilterlogsresult)\>

#### Defined in

vm/api/dist/index.d.ts:1244

___

### EthGetFilterLogsJsonRpcProcedure

Ƭ **EthGetFilterLogsJsonRpcProcedure**: (`request`: [`EthGetFilterLogsJsonRpcRequest`](api.md#ethgetfilterlogsjsonrpcrequest)) => `Promise`\<[`EthGetFilterLogsJsonRpcResponse`](api.md#ethgetfilterlogsjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetFilterLogsJsonRpcResponse`](api.md#ethgetfilterlogsjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetFilterLogsJsonRpcRequest`](api.md#ethgetfilterlogsjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetFilterLogsJsonRpcResponse`](api.md#ethgetfilterlogsjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1900

___

### EthGetFilterLogsJsonRpcRequest

Ƭ **EthGetFilterLogsJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_getFilterLogs"``, [filterId: Hex]\>

JSON-RPC request for `eth_getFilterLogs` procedure

#### Defined in

vm/api/dist/index.d.ts:1404

___

### EthGetFilterLogsJsonRpcResponse

Ƭ **EthGetFilterLogsJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_getFilterLogs"``, [`FilterLog`](api.md#filterlog)[], `string`\>

JSON-RPC response for `eth_getFilterLogs` procedure

#### Defined in

vm/api/dist/index.d.ts:1690

___

### EthGetFilterLogsParams

Ƭ **EthGetFilterLogsParams**: `Object`

JSON-RPC request for `eth_getFilterLogs` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `filterId` | `Hex` |

#### Defined in

vm/api/dist/index.d.ts:269

___

### EthGetFilterLogsResult

Ƭ **EthGetFilterLogsResult**: [`FilterLog`](api.md#filterlog)[]

JSON-RPC response for `eth_getFilterLogs` procedure

#### Defined in

vm/api/dist/index.d.ts:1105

___

### EthGetLogsHandler

Ƭ **EthGetLogsHandler**: (`request`: [`EthGetLogsParams`](api.md#ethgetlogsparams)) => `Promise`\<[`EthGetLogsResult`](api.md#ethgetlogsresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetLogsResult`](api.md#ethgetlogsresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetLogsParams`](api.md#ethgetlogsparams) |

##### Returns

`Promise`\<[`EthGetLogsResult`](api.md#ethgetlogsresult)\>

#### Defined in

vm/api/dist/index.d.ts:1245

___

### EthGetLogsJsonRpcProcedure

Ƭ **EthGetLogsJsonRpcProcedure**: (`request`: [`EthGetLogsJsonRpcRequest`](api.md#ethgetlogsjsonrpcrequest)) => `Promise`\<[`EthGetLogsJsonRpcResponse`](api.md#ethgetlogsjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetLogsJsonRpcResponse`](api.md#ethgetlogsjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetLogsJsonRpcRequest`](api.md#ethgetlogsjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetLogsJsonRpcResponse`](api.md#ethgetlogsjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1901

___

### EthGetLogsJsonRpcRequest

Ƭ **EthGetLogsJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_getLogs"``, [filterParams: FilterParams]\>

JSON-RPC request for `eth_getLogs` procedure

#### Defined in

vm/api/dist/index.d.ts:1410

___

### EthGetLogsJsonRpcResponse

Ƭ **EthGetLogsJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_getLogs"``, [`FilterLog`](api.md#filterlog)[], `string`\>

JSON-RPC response for `eth_getLogs` procedure

#### Defined in

vm/api/dist/index.d.ts:1694

___

### EthGetLogsParams

Ƭ **EthGetLogsParams**: `Object`

JSON-RPC request for `eth_getLogs` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `filterParams` | `FilterParams` |

#### Defined in

vm/api/dist/index.d.ts:275

___

### EthGetLogsResult

Ƭ **EthGetLogsResult**: [`FilterLog`](api.md#filterlog)[]

JSON-RPC response for `eth_getLogs` procedure

#### Defined in

vm/api/dist/index.d.ts:1109

___

### EthGetStorageAtHandler

Ƭ **EthGetStorageAtHandler**: (`request`: [`EthGetStorageAtParams`](api.md#ethgetstorageatparams)) => `Promise`\<[`EthGetStorageAtResult`](api.md#ethgetstorageatresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetStorageAtResult`](api.md#ethgetstorageatresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetStorageAtParams`](api.md#ethgetstorageatparams) |

##### Returns

`Promise`\<[`EthGetStorageAtResult`](api.md#ethgetstorageatresult)\>

#### Defined in

vm/api/dist/index.d.ts:1246

___

### EthGetStorageAtJsonRpcProcedure

Ƭ **EthGetStorageAtJsonRpcProcedure**: (`request`: [`EthGetStorageAtJsonRpcRequest`](api.md#ethgetstorageatjsonrpcrequest)) => `Promise`\<[`EthGetStorageAtJsonRpcResponse`](api.md#ethgetstorageatjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetStorageAtJsonRpcResponse`](api.md#ethgetstorageatjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetStorageAtJsonRpcRequest`](api.md#ethgetstorageatjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetStorageAtJsonRpcResponse`](api.md#ethgetstorageatjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1902

___

### EthGetStorageAtJsonRpcRequest

Ƭ **EthGetStorageAtJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_getStorageAt"``, readonly [address: Address, position: Hex, tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_getStorageAt` procedure

#### Defined in

vm/api/dist/index.d.ts:1416

___

### EthGetStorageAtJsonRpcResponse

Ƭ **EthGetStorageAtJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_getStorageAt"``, `Hex`, `string`\>

JSON-RPC response for `eth_getStorageAt` procedure

#### Defined in

vm/api/dist/index.d.ts:1698

___

### EthGetStorageAtParams

Ƭ **EthGetStorageAtParams**: `Object`

JSON-RPC request for `eth_getStorageAt` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | [`Address`](index.md#address) |
| `position` | `Hex` |
| `tag` | `BlockTag` \| `Hex` |

#### Defined in

vm/api/dist/index.d.ts:281

___

### EthGetStorageAtResult

Ƭ **EthGetStorageAtResult**: `Hex`

JSON-RPC response for `eth_getStorageAt` procedure

#### Defined in

vm/api/dist/index.d.ts:1113

___

### EthGetTransactionByBlockHashAndIndexHandler

Ƭ **EthGetTransactionByBlockHashAndIndexHandler**: (`request`: [`EthGetTransactionByBlockHashAndIndexParams`](api.md#ethgettransactionbyblockhashandindexparams)) => `Promise`\<[`EthGetTransactionByBlockHashAndIndexResult`](api.md#ethgettransactionbyblockhashandindexresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionByBlockHashAndIndexResult`](api.md#ethgettransactionbyblockhashandindexresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionByBlockHashAndIndexParams`](api.md#ethgettransactionbyblockhashandindexparams) |

##### Returns

`Promise`\<[`EthGetTransactionByBlockHashAndIndexResult`](api.md#ethgettransactionbyblockhashandindexresult)\>

#### Defined in

vm/api/dist/index.d.ts:1251

___

### EthGetTransactionByBlockHashAndIndexJsonRpcProcedure

Ƭ **EthGetTransactionByBlockHashAndIndexJsonRpcProcedure**: (`request`: [`EthGetTransactionByBlockHashAndIndexJsonRpcRequest`](api.md#ethgettransactionbyblockhashandindexjsonrpcrequest)) => `Promise`\<[`EthGetTransactionByBlockHashAndIndexJsonRpcResponse`](api.md#ethgettransactionbyblockhashandindexjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionByBlockHashAndIndexJsonRpcResponse`](api.md#ethgettransactionbyblockhashandindexjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionByBlockHashAndIndexJsonRpcRequest`](api.md#ethgettransactionbyblockhashandindexjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetTransactionByBlockHashAndIndexJsonRpcResponse`](api.md#ethgettransactionbyblockhashandindexjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1907

___

### EthGetTransactionByBlockHashAndIndexJsonRpcRequest

Ƭ **EthGetTransactionByBlockHashAndIndexJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_getTransactionByBlockHashAndIndex"``, readonly [tag: Hex, index: Hex]\>

JSON-RPC request for `eth_getTransactionByBlockHashAndIndex` procedure

#### Defined in

vm/api/dist/index.d.ts:1436

___

### EthGetTransactionByBlockHashAndIndexJsonRpcResponse

Ƭ **EthGetTransactionByBlockHashAndIndexJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_getTransactionByBlockHashAndIndex"``, [`TransactionResult`](api.md#transactionresult), `string`\>

JSON-RPC response for `eth_getTransactionByBlockHashAndIndex` procedure

#### Defined in

vm/api/dist/index.d.ts:1718

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

vm/api/dist/index.d.ts:314

___

### EthGetTransactionByBlockHashAndIndexResult

Ƭ **EthGetTransactionByBlockHashAndIndexResult**: [`TransactionResult`](api.md#transactionresult)

JSON-RPC response for `eth_getTransactionByBlockHashAndIndex` procedure

#### Defined in

vm/api/dist/index.d.ts:1133

___

### EthGetTransactionByBlockNumberAndIndexHandler

Ƭ **EthGetTransactionByBlockNumberAndIndexHandler**: (`request`: [`EthGetTransactionByBlockNumberAndIndexParams`](api.md#ethgettransactionbyblocknumberandindexparams)) => `Promise`\<[`EthGetTransactionByBlockNumberAndIndexResult`](api.md#ethgettransactionbyblocknumberandindexresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionByBlockNumberAndIndexResult`](api.md#ethgettransactionbyblocknumberandindexresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionByBlockNumberAndIndexParams`](api.md#ethgettransactionbyblocknumberandindexparams) |

##### Returns

`Promise`\<[`EthGetTransactionByBlockNumberAndIndexResult`](api.md#ethgettransactionbyblocknumberandindexresult)\>

#### Defined in

vm/api/dist/index.d.ts:1252

___

### EthGetTransactionByBlockNumberAndIndexJsonRpcProcedure

Ƭ **EthGetTransactionByBlockNumberAndIndexJsonRpcProcedure**: (`request`: [`EthGetTransactionByBlockNumberAndIndexJsonRpcRequest`](api.md#ethgettransactionbyblocknumberandindexjsonrpcrequest)) => `Promise`\<[`EthGetTransactionByBlockNumberAndIndexJsonRpcResponse`](api.md#ethgettransactionbyblocknumberandindexjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionByBlockNumberAndIndexJsonRpcResponse`](api.md#ethgettransactionbyblocknumberandindexjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionByBlockNumberAndIndexJsonRpcRequest`](api.md#ethgettransactionbyblocknumberandindexjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetTransactionByBlockNumberAndIndexJsonRpcResponse`](api.md#ethgettransactionbyblocknumberandindexjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1908

___

### EthGetTransactionByBlockNumberAndIndexJsonRpcRequest

Ƭ **EthGetTransactionByBlockNumberAndIndexJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_getTransactionByBlockNumberAndIndex"``, readonly [tag: BlockTag \| Hex, index: Hex]\>

JSON-RPC request for `eth_getTransactionByBlockNumberAndIndex` procedure

#### Defined in

vm/api/dist/index.d.ts:1440

___

### EthGetTransactionByBlockNumberAndIndexJsonRpcResponse

Ƭ **EthGetTransactionByBlockNumberAndIndexJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_getTransactionByBlockNumberAndIndex"``, [`TransactionResult`](api.md#transactionresult), `string`\>

JSON-RPC response for `eth_getTransactionByBlockNumberAndIndex` procedure

#### Defined in

vm/api/dist/index.d.ts:1722

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

vm/api/dist/index.d.ts:321

___

### EthGetTransactionByBlockNumberAndIndexResult

Ƭ **EthGetTransactionByBlockNumberAndIndexResult**: [`TransactionResult`](api.md#transactionresult)

JSON-RPC response for `eth_getTransactionByBlockNumberAndIndex` procedure

#### Defined in

vm/api/dist/index.d.ts:1137

___

### EthGetTransactionByHashHandler

Ƭ **EthGetTransactionByHashHandler**: (`request`: [`EthGetTransactionByHashParams`](api.md#ethgettransactionbyhashparams)) => `Promise`\<[`EthGetTransactionByHashResult`](api.md#ethgettransactionbyhashresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionByHashResult`](api.md#ethgettransactionbyhashresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionByHashParams`](api.md#ethgettransactionbyhashparams) |

##### Returns

`Promise`\<[`EthGetTransactionByHashResult`](api.md#ethgettransactionbyhashresult)\>

#### Defined in

vm/api/dist/index.d.ts:1250

___

### EthGetTransactionByHashJsonRpcProcedure

Ƭ **EthGetTransactionByHashJsonRpcProcedure**: (`request`: [`EthGetTransactionByHashJsonRpcRequest`](api.md#ethgettransactionbyhashjsonrpcrequest)) => `Promise`\<[`EthGetTransactionByHashJsonRpcResponse`](api.md#ethgettransactionbyhashjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionByHashJsonRpcResponse`](api.md#ethgettransactionbyhashjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionByHashJsonRpcRequest`](api.md#ethgettransactionbyhashjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetTransactionByHashJsonRpcResponse`](api.md#ethgettransactionbyhashjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1906

___

### EthGetTransactionByHashJsonRpcRequest

Ƭ **EthGetTransactionByHashJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_getTransactionByHash"``, readonly [data: Hex]\>

JSON-RPC request for `eth_getTransactionByHash` procedure

#### Defined in

vm/api/dist/index.d.ts:1432

___

### EthGetTransactionByHashJsonRpcResponse

Ƭ **EthGetTransactionByHashJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_getTransactionByHash"``, [`TransactionResult`](api.md#transactionresult), `string`\>

JSON-RPC response for `eth_getTransactionByHash` procedure

#### Defined in

vm/api/dist/index.d.ts:1714

___

### EthGetTransactionByHashParams

Ƭ **EthGetTransactionByHashParams**: `Object`

JSON-RPC request for `eth_getTransactionByHash` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | `Hex` |

#### Defined in

vm/api/dist/index.d.ts:308

___

### EthGetTransactionByHashResult

Ƭ **EthGetTransactionByHashResult**: [`TransactionResult`](api.md#transactionresult)

JSON-RPC response for `eth_getTransactionByHash` procedure

#### Defined in

vm/api/dist/index.d.ts:1129

___

### EthGetTransactionCountHandler

Ƭ **EthGetTransactionCountHandler**: (`request`: [`EthGetTransactionCountParams`](api.md#ethgettransactioncountparams)) => `Promise`\<[`EthGetTransactionCountResult`](api.md#ethgettransactioncountresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionCountResult`](api.md#ethgettransactioncountresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionCountParams`](api.md#ethgettransactioncountparams) |

##### Returns

`Promise`\<[`EthGetTransactionCountResult`](api.md#ethgettransactioncountresult)\>

#### Defined in

vm/api/dist/index.d.ts:1247

___

### EthGetTransactionCountJsonRpcProcedure

Ƭ **EthGetTransactionCountJsonRpcProcedure**: (`request`: [`EthGetTransactionCountJsonRpcRequest`](api.md#ethgettransactioncountjsonrpcrequest)) => `Promise`\<[`EthGetTransactionCountJsonRpcResponse`](api.md#ethgettransactioncountjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionCountJsonRpcResponse`](api.md#ethgettransactioncountjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionCountJsonRpcRequest`](api.md#ethgettransactioncountjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetTransactionCountJsonRpcResponse`](api.md#ethgettransactioncountjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1903

___

### EthGetTransactionCountJsonRpcRequest

Ƭ **EthGetTransactionCountJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_getTransactionCount"``, readonly [address: Address, tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_getTransactionCount` procedure

#### Defined in

vm/api/dist/index.d.ts:1420

___

### EthGetTransactionCountJsonRpcResponse

Ƭ **EthGetTransactionCountJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_getTransactionCount"``, `Hex`, `string`\>

JSON-RPC response for `eth_getTransactionCount` procedure

#### Defined in

vm/api/dist/index.d.ts:1702

___

### EthGetTransactionCountParams

Ƭ **EthGetTransactionCountParams**: `Object`

JSON-RPC request for `eth_getTransactionCount` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | [`Address`](index.md#address) |
| `tag` | `BlockTag` \| `Hex` |

#### Defined in

vm/api/dist/index.d.ts:289

___

### EthGetTransactionCountResult

Ƭ **EthGetTransactionCountResult**: `Hex`

JSON-RPC response for `eth_getTransactionCount` procedure

#### Defined in

vm/api/dist/index.d.ts:1117

___

### EthGetTransactionReceiptHandler

Ƭ **EthGetTransactionReceiptHandler**: (`request`: [`EthGetTransactionReceiptParams`](api.md#ethgettransactionreceiptparams)) => `Promise`\<[`EthGetTransactionReceiptResult`](api.md#ethgettransactionreceiptresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionReceiptResult`](api.md#ethgettransactionreceiptresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionReceiptParams`](api.md#ethgettransactionreceiptparams) |

##### Returns

`Promise`\<[`EthGetTransactionReceiptResult`](api.md#ethgettransactionreceiptresult)\>

#### Defined in

vm/api/dist/index.d.ts:1253

___

### EthGetTransactionReceiptJsonRpcProcedure

Ƭ **EthGetTransactionReceiptJsonRpcProcedure**: (`request`: [`EthGetTransactionReceiptJsonRpcRequest`](api.md#ethgettransactionreceiptjsonrpcrequest)) => `Promise`\<[`EthGetTransactionReceiptJsonRpcResponse`](api.md#ethgettransactionreceiptjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionReceiptJsonRpcResponse`](api.md#ethgettransactionreceiptjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionReceiptJsonRpcRequest`](api.md#ethgettransactionreceiptjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetTransactionReceiptJsonRpcResponse`](api.md#ethgettransactionreceiptjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1909

___

### EthGetTransactionReceiptJsonRpcRequest

Ƭ **EthGetTransactionReceiptJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_getTransactionReceipt"``, [txHash: Hex]\>

JSON-RPC request for `eth_getTransactionReceipt` procedure

#### Defined in

vm/api/dist/index.d.ts:1444

___

### EthGetTransactionReceiptJsonRpcResponse

Ƭ **EthGetTransactionReceiptJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_getTransactionReceipt"``, [`TransactionReceiptResult`](api.md#transactionreceiptresult), `string`\>

JSON-RPC response for `eth_getTransactionReceipt` procedure

#### Defined in

vm/api/dist/index.d.ts:1726

___

### EthGetTransactionReceiptParams

Ƭ **EthGetTransactionReceiptParams**: `GetTransactionParameters`

JSON-RPC request for `eth_getTransactionReceipt` procedure

#### Defined in

vm/api/dist/index.d.ts:328

___

### EthGetTransactionReceiptResult

Ƭ **EthGetTransactionReceiptResult**: [`TransactionReceiptResult`](api.md#transactionreceiptresult)

JSON-RPC response for `eth_getTransactionReceipt` procedure

#### Defined in

vm/api/dist/index.d.ts:1141

___

### EthGetUncleByBlockHashAndIndexHandler

Ƭ **EthGetUncleByBlockHashAndIndexHandler**: (`request`: [`EthGetUncleByBlockHashAndIndexParams`](api.md#ethgetunclebyblockhashandindexparams)) => `Promise`\<[`EthGetUncleByBlockHashAndIndexResult`](api.md#ethgetunclebyblockhashandindexresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetUncleByBlockHashAndIndexResult`](api.md#ethgetunclebyblockhashandindexresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetUncleByBlockHashAndIndexParams`](api.md#ethgetunclebyblockhashandindexparams) |

##### Returns

`Promise`\<[`EthGetUncleByBlockHashAndIndexResult`](api.md#ethgetunclebyblockhashandindexresult)\>

#### Defined in

vm/api/dist/index.d.ts:1254

___

### EthGetUncleByBlockHashAndIndexJsonRpcProcedure

Ƭ **EthGetUncleByBlockHashAndIndexJsonRpcProcedure**: (`request`: [`EthGetUncleByBlockHashAndIndexJsonRpcRequest`](api.md#ethgetunclebyblockhashandindexjsonrpcrequest)) => `Promise`\<[`EthGetUncleByBlockHashAndIndexJsonRpcResponse`](api.md#ethgetunclebyblockhashandindexjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetUncleByBlockHashAndIndexJsonRpcResponse`](api.md#ethgetunclebyblockhashandindexjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetUncleByBlockHashAndIndexJsonRpcRequest`](api.md#ethgetunclebyblockhashandindexjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetUncleByBlockHashAndIndexJsonRpcResponse`](api.md#ethgetunclebyblockhashandindexjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1910

___

### EthGetUncleByBlockHashAndIndexJsonRpcRequest

Ƭ **EthGetUncleByBlockHashAndIndexJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_getUncleByBlockHashAndIndex"``, readonly [blockHash: Hex, uncleIndex: Hex]\>

JSON-RPC request for `eth_getUncleByBlockHashAndIndex` procedure

#### Defined in

vm/api/dist/index.d.ts:1450

___

### EthGetUncleByBlockHashAndIndexJsonRpcResponse

Ƭ **EthGetUncleByBlockHashAndIndexJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_getUncleByBlockHashAndIndex"``, `Hex`, `string`\>

JSON-RPC response for `eth_getUncleByBlockHashAndIndex` procedure

#### Defined in

vm/api/dist/index.d.ts:1730

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

vm/api/dist/index.d.ts:332

___

### EthGetUncleByBlockHashAndIndexResult

Ƭ **EthGetUncleByBlockHashAndIndexResult**: `Hex`

JSON-RPC response for `eth_getUncleByBlockHashAndIndex` procedure

#### Defined in

vm/api/dist/index.d.ts:1145

___

### EthGetUncleByBlockNumberAndIndexHandler

Ƭ **EthGetUncleByBlockNumberAndIndexHandler**: (`request`: [`EthGetUncleByBlockNumberAndIndexParams`](api.md#ethgetunclebyblocknumberandindexparams)) => `Promise`\<[`EthGetUncleByBlockNumberAndIndexResult`](api.md#ethgetunclebyblocknumberandindexresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetUncleByBlockNumberAndIndexResult`](api.md#ethgetunclebyblocknumberandindexresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetUncleByBlockNumberAndIndexParams`](api.md#ethgetunclebyblocknumberandindexparams) |

##### Returns

`Promise`\<[`EthGetUncleByBlockNumberAndIndexResult`](api.md#ethgetunclebyblocknumberandindexresult)\>

#### Defined in

vm/api/dist/index.d.ts:1255

___

### EthGetUncleByBlockNumberAndIndexJsonRpcProcedure

Ƭ **EthGetUncleByBlockNumberAndIndexJsonRpcProcedure**: (`request`: [`EthGetUncleByBlockNumberAndIndexJsonRpcRequest`](api.md#ethgetunclebyblocknumberandindexjsonrpcrequest)) => `Promise`\<[`EthGetUncleByBlockNumberAndIndexJsonRpcResponse`](api.md#ethgetunclebyblocknumberandindexjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetUncleByBlockNumberAndIndexJsonRpcResponse`](api.md#ethgetunclebyblocknumberandindexjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetUncleByBlockNumberAndIndexJsonRpcRequest`](api.md#ethgetunclebyblocknumberandindexjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetUncleByBlockNumberAndIndexJsonRpcResponse`](api.md#ethgetunclebyblocknumberandindexjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1911

___

### EthGetUncleByBlockNumberAndIndexJsonRpcRequest

Ƭ **EthGetUncleByBlockNumberAndIndexJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_getUncleByBlockNumberAndIndex"``, readonly [tag: BlockTag \| Hex, uncleIndex: Hex]\>

JSON-RPC request for `eth_getUncleByBlockNumberAndIndex` procedure

#### Defined in

vm/api/dist/index.d.ts:1454

___

### EthGetUncleByBlockNumberAndIndexJsonRpcResponse

Ƭ **EthGetUncleByBlockNumberAndIndexJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_getUncleByBlockNumberAndIndex"``, `Hex`, `string`\>

JSON-RPC response for `eth_getUncleByBlockNumberAndIndex` procedure

#### Defined in

vm/api/dist/index.d.ts:1734

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

vm/api/dist/index.d.ts:339

___

### EthGetUncleByBlockNumberAndIndexResult

Ƭ **EthGetUncleByBlockNumberAndIndexResult**: `Hex`

JSON-RPC response for `eth_getUncleByBlockNumberAndIndex` procedure

#### Defined in

vm/api/dist/index.d.ts:1149

___

### EthGetUncleCountByBlockHashHandler

Ƭ **EthGetUncleCountByBlockHashHandler**: (`request`: [`EthGetUncleCountByBlockHashParams`](api.md#ethgetunclecountbyblockhashparams)) => `Promise`\<[`EthGetUncleCountByBlockHashResult`](api.md#ethgetunclecountbyblockhashresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetUncleCountByBlockHashResult`](api.md#ethgetunclecountbyblockhashresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetUncleCountByBlockHashParams`](api.md#ethgetunclecountbyblockhashparams) |

##### Returns

`Promise`\<[`EthGetUncleCountByBlockHashResult`](api.md#ethgetunclecountbyblockhashresult)\>

#### Defined in

vm/api/dist/index.d.ts:1248

___

### EthGetUncleCountByBlockHashJsonRpcProcedure

Ƭ **EthGetUncleCountByBlockHashJsonRpcProcedure**: (`request`: [`EthGetUncleCountByBlockHashJsonRpcRequest`](api.md#ethgetunclecountbyblockhashjsonrpcrequest)) => `Promise`\<[`EthGetUncleCountByBlockHashJsonRpcResponse`](api.md#ethgetunclecountbyblockhashjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetUncleCountByBlockHashJsonRpcResponse`](api.md#ethgetunclecountbyblockhashjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetUncleCountByBlockHashJsonRpcRequest`](api.md#ethgetunclecountbyblockhashjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetUncleCountByBlockHashJsonRpcResponse`](api.md#ethgetunclecountbyblockhashjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1904

___

### EthGetUncleCountByBlockHashJsonRpcRequest

Ƭ **EthGetUncleCountByBlockHashJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_getUncleCountByBlockHash"``, readonly [hash: Hex]\>

JSON-RPC request for `eth_getUncleCountByBlockHash` procedure

#### Defined in

vm/api/dist/index.d.ts:1424

___

### EthGetUncleCountByBlockHashJsonRpcResponse

Ƭ **EthGetUncleCountByBlockHashJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_getUncleCountByBlockHash"``, `Hex`, `string`\>

JSON-RPC response for `eth_getUncleCountByBlockHash` procedure

#### Defined in

vm/api/dist/index.d.ts:1706

___

### EthGetUncleCountByBlockHashParams

Ƭ **EthGetUncleCountByBlockHashParams**: `Object`

JSON-RPC request for `eth_getUncleCountByBlockHash` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `hash` | `Hex` |

#### Defined in

vm/api/dist/index.d.ts:296

___

### EthGetUncleCountByBlockHashResult

Ƭ **EthGetUncleCountByBlockHashResult**: `Hex`

JSON-RPC response for `eth_getUncleCountByBlockHash` procedure

#### Defined in

vm/api/dist/index.d.ts:1121

___

### EthGetUncleCountByBlockNumberHandler

Ƭ **EthGetUncleCountByBlockNumberHandler**: (`request`: [`EthGetUncleCountByBlockNumberParams`](api.md#ethgetunclecountbyblocknumberparams)) => `Promise`\<[`EthGetUncleCountByBlockNumberResult`](api.md#ethgetunclecountbyblocknumberresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetUncleCountByBlockNumberResult`](api.md#ethgetunclecountbyblocknumberresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetUncleCountByBlockNumberParams`](api.md#ethgetunclecountbyblocknumberparams) |

##### Returns

`Promise`\<[`EthGetUncleCountByBlockNumberResult`](api.md#ethgetunclecountbyblocknumberresult)\>

#### Defined in

vm/api/dist/index.d.ts:1249

___

### EthGetUncleCountByBlockNumberJsonRpcProcedure

Ƭ **EthGetUncleCountByBlockNumberJsonRpcProcedure**: (`request`: [`EthGetUncleCountByBlockNumberJsonRpcRequest`](api.md#ethgetunclecountbyblocknumberjsonrpcrequest)) => `Promise`\<[`EthGetUncleCountByBlockNumberJsonRpcResponse`](api.md#ethgetunclecountbyblocknumberjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetUncleCountByBlockNumberJsonRpcResponse`](api.md#ethgetunclecountbyblocknumberjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetUncleCountByBlockNumberJsonRpcRequest`](api.md#ethgetunclecountbyblocknumberjsonrpcrequest) |

##### Returns

`Promise`\<[`EthGetUncleCountByBlockNumberJsonRpcResponse`](api.md#ethgetunclecountbyblocknumberjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1905

___

### EthGetUncleCountByBlockNumberJsonRpcRequest

Ƭ **EthGetUncleCountByBlockNumberJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_getUncleCountByBlockNumber"``, readonly [tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_getUncleCountByBlockNumber` procedure

#### Defined in

vm/api/dist/index.d.ts:1428

___

### EthGetUncleCountByBlockNumberJsonRpcResponse

Ƭ **EthGetUncleCountByBlockNumberJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_getUncleCountByBlockNumber"``, `Hex`, `string`\>

JSON-RPC response for `eth_getUncleCountByBlockNumber` procedure

#### Defined in

vm/api/dist/index.d.ts:1710

___

### EthGetUncleCountByBlockNumberParams

Ƭ **EthGetUncleCountByBlockNumberParams**: `Object`

JSON-RPC request for `eth_getUncleCountByBlockNumber` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `tag` | `BlockTag` \| `Hex` |

#### Defined in

vm/api/dist/index.d.ts:302

___

### EthGetUncleCountByBlockNumberResult

Ƭ **EthGetUncleCountByBlockNumberResult**: `Hex`

JSON-RPC response for `eth_getUncleCountByBlockNumber` procedure

#### Defined in

vm/api/dist/index.d.ts:1125

___

### EthHashrateHandler

Ƭ **EthHashrateHandler**: (`request?`: [`EthHashrateParams`](api.md#ethhashrateparams)) => `Promise`\<[`EthHashrateResult`](api.md#ethhashrateresult)\>

#### Type declaration

▸ (`request?`): `Promise`\<[`EthHashrateResult`](api.md#ethhashrateresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request?` | [`EthHashrateParams`](api.md#ethhashrateparams) |

##### Returns

`Promise`\<[`EthHashrateResult`](api.md#ethhashrateresult)\>

#### Defined in

vm/api/dist/index.d.ts:1235

___

### EthHashrateJsonRpcProcedure

Ƭ **EthHashrateJsonRpcProcedure**: (`request`: [`EthHashrateJsonRpcRequest`](api.md#ethhashratejsonrpcrequest)) => `Promise`\<[`EthHashrateJsonRpcResponse`](api.md#ethhashratejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthHashrateJsonRpcResponse`](api.md#ethhashratejsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthHashrateJsonRpcRequest`](api.md#ethhashratejsonrpcrequest) |

##### Returns

`Promise`\<[`EthHashrateJsonRpcResponse`](api.md#ethhashratejsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1891

___

### EthHashrateJsonRpcRequest

Ƭ **EthHashrateJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_hashrate"``, readonly []\>

JSON-RPC request for `eth_hashrate` procedure

#### Defined in

vm/api/dist/index.d.ts:1363

___

### EthHashrateJsonRpcResponse

Ƭ **EthHashrateJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_hashrate"``, `Hex`, `string`\>

JSON-RPC response for `eth_hashrate` procedure

#### Defined in

vm/api/dist/index.d.ts:1654

___

### EthHashrateParams

Ƭ **EthHashrateParams**: `EmptyParams`

JSON-RPC request for `eth_hashrate` procedure

#### Defined in

vm/api/dist/index.d.ts:218

___

### EthHashrateResult

Ƭ **EthHashrateResult**: `Hex`

JSON-RPC response for `eth_hashrate` procedure

#### Defined in

vm/api/dist/index.d.ts:1069

___

### EthJsonRpcRequest

Ƭ **EthJsonRpcRequest**: [`EthAccountsJsonRpcRequest`](api.md#ethaccountsjsonrpcrequest) \| [`EthAccountsJsonRpcRequest`](api.md#ethaccountsjsonrpcrequest) \| [`EthBlockNumberJsonRpcRequest`](api.md#ethblocknumberjsonrpcrequest) \| [`EthCallJsonRpcRequest`](api.md#ethcalljsonrpcrequest) \| [`EthChainIdJsonRpcRequest`](api.md#ethchainidjsonrpcrequest) \| [`EthCoinbaseJsonRpcRequest`](api.md#ethcoinbasejsonrpcrequest) \| [`EthEstimateGasJsonRpcRequest`](api.md#ethestimategasjsonrpcrequest) \| [`EthHashrateJsonRpcRequest`](api.md#ethhashratejsonrpcrequest) \| [`EthGasPriceJsonRpcRequest`](api.md#ethgaspricejsonrpcrequest) \| [`EthGetBalanceJsonRpcRequest`](api.md#ethgetbalancejsonrpcrequest) \| [`EthGetBlockByHashJsonRpcRequest`](api.md#ethgetblockbyhashjsonrpcrequest) \| [`EthGetBlockByNumberJsonRpcRequest`](api.md#ethgetblockbynumberjsonrpcrequest) \| [`EthGetBlockTransactionCountByHashJsonRpcRequest`](api.md#ethgetblocktransactioncountbyhashjsonrpcrequest) \| [`EthGetBlockTransactionCountByNumberJsonRpcRequest`](api.md#ethgetblocktransactioncountbynumberjsonrpcrequest) \| [`EthGetCodeJsonRpcRequest`](api.md#ethgetcodejsonrpcrequest) \| [`EthGetFilterChangesJsonRpcRequest`](api.md#ethgetfilterchangesjsonrpcrequest) \| [`EthGetFilterLogsJsonRpcRequest`](api.md#ethgetfilterlogsjsonrpcrequest) \| [`EthGetLogsJsonRpcRequest`](api.md#ethgetlogsjsonrpcrequest) \| [`EthGetStorageAtJsonRpcRequest`](api.md#ethgetstorageatjsonrpcrequest) \| [`EthGetTransactionCountJsonRpcRequest`](api.md#ethgettransactioncountjsonrpcrequest) \| [`EthGetUncleCountByBlockHashJsonRpcRequest`](api.md#ethgetunclecountbyblockhashjsonrpcrequest) \| [`EthGetUncleCountByBlockNumberJsonRpcRequest`](api.md#ethgetunclecountbyblocknumberjsonrpcrequest) \| [`EthGetTransactionByHashJsonRpcRequest`](api.md#ethgettransactionbyhashjsonrpcrequest) \| [`EthGetTransactionByBlockHashAndIndexJsonRpcRequest`](api.md#ethgettransactionbyblockhashandindexjsonrpcrequest) \| [`EthGetTransactionByBlockNumberAndIndexJsonRpcRequest`](api.md#ethgettransactionbyblocknumberandindexjsonrpcrequest) \| [`EthGetTransactionReceiptJsonRpcRequest`](api.md#ethgettransactionreceiptjsonrpcrequest) \| [`EthGetUncleByBlockHashAndIndexJsonRpcRequest`](api.md#ethgetunclebyblockhashandindexjsonrpcrequest) \| [`EthGetUncleByBlockNumberAndIndexJsonRpcRequest`](api.md#ethgetunclebyblocknumberandindexjsonrpcrequest) \| [`EthMiningJsonRpcRequest`](api.md#ethminingjsonrpcrequest) \| [`EthProtocolVersionJsonRpcRequest`](api.md#ethprotocolversionjsonrpcrequest) \| [`EthSendRawTransactionJsonRpcRequest`](api.md#ethsendrawtransactionjsonrpcrequest) \| [`EthSendTransactionJsonRpcRequest`](api.md#ethsendtransactionjsonrpcrequest) \| [`EthSignJsonRpcRequest`](api.md#ethsignjsonrpcrequest) \| [`EthSignTransactionJsonRpcRequest`](api.md#ethsigntransactionjsonrpcrequest) \| [`EthSyncingJsonRpcRequest`](api.md#ethsyncingjsonrpcrequest) \| [`EthNewFilterJsonRpcRequest`](api.md#ethnewfilterjsonrpcrequest) \| [`EthNewBlockFilterJsonRpcRequest`](api.md#ethnewblockfilterjsonrpcrequest) \| [`EthNewPendingTransactionFilterJsonRpcRequest`](api.md#ethnewpendingtransactionfilterjsonrpcrequest) \| [`EthUninstallFilterJsonRpcRequest`](api.md#ethuninstallfilterjsonrpcrequest)

#### Defined in

vm/api/dist/index.d.ts:1519

___

### EthJsonRpcRequestHandler

Ƭ **EthJsonRpcRequestHandler**: \<TRequest\>(`request`: `TRequest`) => `Promise`\<`EthReturnType`[`TRequest`[``"method"``]]\>

#### Type declaration

▸ \<`TRequest`\>(`request`): `Promise`\<`EthReturnType`[`TRequest`[``"method"``]]\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TRequest` | extends [`EthJsonRpcRequest`](api.md#ethjsonrpcrequest) |

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | `TRequest` |

##### Returns

`Promise`\<`EthReturnType`[`TRequest`[``"method"``]]\>

#### Defined in

vm/api/dist/index.d.ts:2060

___

### EthMiningHandler

Ƭ **EthMiningHandler**: (`request`: [`EthMiningParams`](api.md#ethminingparams)) => `Promise`\<[`EthMiningResult`](api.md#ethminingresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthMiningResult`](api.md#ethminingresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthMiningParams`](api.md#ethminingparams) |

##### Returns

`Promise`\<[`EthMiningResult`](api.md#ethminingresult)\>

#### Defined in

vm/api/dist/index.d.ts:1256

___

### EthMiningJsonRpcProcedure

Ƭ **EthMiningJsonRpcProcedure**: (`request`: [`EthMiningJsonRpcRequest`](api.md#ethminingjsonrpcrequest)) => `Promise`\<[`EthMiningJsonRpcResponse`](api.md#ethminingjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthMiningJsonRpcResponse`](api.md#ethminingjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthMiningJsonRpcRequest`](api.md#ethminingjsonrpcrequest) |

##### Returns

`Promise`\<[`EthMiningJsonRpcResponse`](api.md#ethminingjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1912

___

### EthMiningJsonRpcRequest

Ƭ **EthMiningJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_mining"``, readonly []\>

JSON-RPC request for `eth_mining` procedure

#### Defined in

vm/api/dist/index.d.ts:1458

___

### EthMiningJsonRpcResponse

Ƭ **EthMiningJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_mining"``, `boolean`, `string`\>

JSON-RPC response for `eth_mining` procedure

#### Defined in

vm/api/dist/index.d.ts:1738

___

### EthMiningParams

Ƭ **EthMiningParams**: `EmptyParams`

JSON-RPC request for `eth_mining` procedure

#### Defined in

vm/api/dist/index.d.ts:346

___

### EthMiningResult

Ƭ **EthMiningResult**: `boolean`

JSON-RPC response for `eth_mining` procedure

#### Defined in

vm/api/dist/index.d.ts:1153

___

### EthNewBlockFilterHandler

Ƭ **EthNewBlockFilterHandler**: (`request`: [`EthNewBlockFilterParams`](api.md#ethnewblockfilterparams)) => `Promise`\<[`EthNewBlockFilterResult`](api.md#ethnewblockfilterresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthNewBlockFilterResult`](api.md#ethnewblockfilterresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthNewBlockFilterParams`](api.md#ethnewblockfilterparams) |

##### Returns

`Promise`\<[`EthNewBlockFilterResult`](api.md#ethnewblockfilterresult)\>

#### Defined in

vm/api/dist/index.d.ts:1264

___

### EthNewBlockFilterJsonRpcProcedure

Ƭ **EthNewBlockFilterJsonRpcProcedure**: (`request`: [`EthNewBlockFilterJsonRpcRequest`](api.md#ethnewblockfilterjsonrpcrequest)) => `Promise`\<[`EthNewBlockFilterJsonRpcResponse`](api.md#ethnewblockfilterjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthNewBlockFilterJsonRpcResponse`](api.md#ethnewblockfilterjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthNewBlockFilterJsonRpcRequest`](api.md#ethnewblockfilterjsonrpcrequest) |

##### Returns

`Promise`\<[`EthNewBlockFilterJsonRpcResponse`](api.md#ethnewblockfilterjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1920

___

### EthNewBlockFilterJsonRpcRequest

Ƭ **EthNewBlockFilterJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_newBlockFilter"``, readonly []\>

JSON-RPC request for `eth_newBlockFilter` procedure

#### Defined in

vm/api/dist/index.d.ts:1508

___

### EthNewBlockFilterJsonRpcResponse

Ƭ **EthNewBlockFilterJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_newBlockFilter"``, `Hex`, `string`\>

JSON-RPC response for `eth_newBlockFilter` procedure

#### Defined in

vm/api/dist/index.d.ts:1785

___

### EthNewBlockFilterParams

Ƭ **EthNewBlockFilterParams**: `EmptyParams`

JSON-RPC request for `eth_newBlockFilter` procedure

#### Defined in

vm/api/dist/index.d.ts:378

___

### EthNewBlockFilterResult

Ƭ **EthNewBlockFilterResult**: `Hex`

JSON-RPC response for `eth_newBlockFilter` procedure

#### Defined in

vm/api/dist/index.d.ts:1200

___

### EthNewFilterHandler

Ƭ **EthNewFilterHandler**: (`request`: [`EthNewFilterParams`](api.md#ethnewfilterparams)) => `Promise`\<[`EthNewFilterResult`](api.md#ethnewfilterresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthNewFilterResult`](api.md#ethnewfilterresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthNewFilterParams`](api.md#ethnewfilterparams) |

##### Returns

`Promise`\<[`EthNewFilterResult`](api.md#ethnewfilterresult)\>

#### Defined in

vm/api/dist/index.d.ts:1263

___

### EthNewFilterJsonRpcProcedure

Ƭ **EthNewFilterJsonRpcProcedure**: (`request`: [`EthNewFilterJsonRpcRequest`](api.md#ethnewfilterjsonrpcrequest)) => `Promise`\<[`EthNewFilterJsonRpcResponse`](api.md#ethnewfilterjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthNewFilterJsonRpcResponse`](api.md#ethnewfilterjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthNewFilterJsonRpcRequest`](api.md#ethnewfilterjsonrpcrequest) |

##### Returns

`Promise`\<[`EthNewFilterJsonRpcResponse`](api.md#ethnewfilterjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1919

___

### EthNewFilterJsonRpcRequest

Ƭ **EthNewFilterJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_newFilter"``, `SerializeToJson`\<`FilterParams`\>\>

JSON-RPC request for `eth_newFilter` procedure

#### Defined in

vm/api/dist/index.d.ts:1504

___

### EthNewFilterJsonRpcResponse

Ƭ **EthNewFilterJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_newFilter"``, `Hex`, `string`\>

JSON-RPC response for `eth_newFilter` procedure

#### Defined in

vm/api/dist/index.d.ts:1781

___

### EthNewFilterParams

Ƭ **EthNewFilterParams**: `FilterParams`

JSON-RPC request for `eth_newFilter` procedure

#### Defined in

vm/api/dist/index.d.ts:374

___

### EthNewFilterResult

Ƭ **EthNewFilterResult**: `Hex`

JSON-RPC response for `eth_newFilter` procedure

#### Defined in

vm/api/dist/index.d.ts:1196

___

### EthNewPendingTransactionFilterHandler

Ƭ **EthNewPendingTransactionFilterHandler**: (`request`: [`EthNewPendingTransactionFilterParams`](api.md#ethnewpendingtransactionfilterparams)) => `Promise`\<[`EthNewPendingTransactionFilterResult`](api.md#ethnewpendingtransactionfilterresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthNewPendingTransactionFilterResult`](api.md#ethnewpendingtransactionfilterresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthNewPendingTransactionFilterParams`](api.md#ethnewpendingtransactionfilterparams) |

##### Returns

`Promise`\<[`EthNewPendingTransactionFilterResult`](api.md#ethnewpendingtransactionfilterresult)\>

#### Defined in

vm/api/dist/index.d.ts:1265

___

### EthNewPendingTransactionFilterJsonRpcProcedure

Ƭ **EthNewPendingTransactionFilterJsonRpcProcedure**: (`request`: [`EthNewPendingTransactionFilterJsonRpcRequest`](api.md#ethnewpendingtransactionfilterjsonrpcrequest)) => `Promise`\<[`EthNewPendingTransactionFilterJsonRpcResponse`](api.md#ethnewpendingtransactionfilterjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthNewPendingTransactionFilterJsonRpcResponse`](api.md#ethnewpendingtransactionfilterjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthNewPendingTransactionFilterJsonRpcRequest`](api.md#ethnewpendingtransactionfilterjsonrpcrequest) |

##### Returns

`Promise`\<[`EthNewPendingTransactionFilterJsonRpcResponse`](api.md#ethnewpendingtransactionfilterjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1921

___

### EthNewPendingTransactionFilterJsonRpcRequest

Ƭ **EthNewPendingTransactionFilterJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_newPendingTransactionFilter"``, readonly []\>

JSON-RPC request for `eth_newPendingTransactionFilter` procedure

#### Defined in

vm/api/dist/index.d.ts:1512

___

### EthNewPendingTransactionFilterJsonRpcResponse

Ƭ **EthNewPendingTransactionFilterJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_newPendingTransactionFilter"``, `Hex`, `string`\>

JSON-RPC response for `eth_newPendingTransactionFilter` procedure

#### Defined in

vm/api/dist/index.d.ts:1789

___

### EthNewPendingTransactionFilterParams

Ƭ **EthNewPendingTransactionFilterParams**: `EmptyParams`

JSON-RPC request for `eth_newPendingTransactionFilter` procedure

#### Defined in

vm/api/dist/index.d.ts:382

___

### EthNewPendingTransactionFilterResult

Ƭ **EthNewPendingTransactionFilterResult**: `Hex`

JSON-RPC response for `eth_newPendingTransactionFilter` procedure

#### Defined in

vm/api/dist/index.d.ts:1204

___

### EthParams

Ƭ **EthParams**: [`EthAccountsParams`](api.md#ethaccountsparams) \| [`EthAccountsParams`](api.md#ethaccountsparams) \| [`EthBlockNumberParams`](api.md#ethblocknumberparams) \| [`EthCallParams`](api.md#ethcallparams) \| [`EthChainIdParams`](api.md#ethchainidparams) \| [`EthCoinbaseParams`](api.md#ethcoinbaseparams) \| [`EthEstimateGasParams`](api.md#ethestimategasparams) \| [`EthHashrateParams`](api.md#ethhashrateparams) \| [`EthGasPriceParams`](api.md#ethgaspriceparams) \| [`EthGetBalanceParams`](api.md#ethgetbalanceparams) \| [`EthGetBlockByHashParams`](api.md#ethgetblockbyhashparams) \| [`EthGetBlockByNumberParams`](api.md#ethgetblockbynumberparams) \| [`EthGetBlockTransactionCountByHashParams`](api.md#ethgetblocktransactioncountbyhashparams) \| [`EthGetBlockTransactionCountByNumberParams`](api.md#ethgetblocktransactioncountbynumberparams) \| [`EthGetCodeParams`](api.md#ethgetcodeparams) \| [`EthGetFilterChangesParams`](api.md#ethgetfilterchangesparams) \| [`EthGetFilterLogsParams`](api.md#ethgetfilterlogsparams) \| [`EthGetLogsParams`](api.md#ethgetlogsparams) \| [`EthGetStorageAtParams`](api.md#ethgetstorageatparams) \| [`EthGetTransactionCountParams`](api.md#ethgettransactioncountparams) \| [`EthGetUncleCountByBlockHashParams`](api.md#ethgetunclecountbyblockhashparams) \| [`EthGetUncleCountByBlockNumberParams`](api.md#ethgetunclecountbyblocknumberparams) \| [`EthGetTransactionByHashParams`](api.md#ethgettransactionbyhashparams) \| [`EthGetTransactionByBlockHashAndIndexParams`](api.md#ethgettransactionbyblockhashandindexparams) \| [`EthGetTransactionByBlockNumberAndIndexParams`](api.md#ethgettransactionbyblocknumberandindexparams) \| [`EthGetTransactionReceiptParams`](api.md#ethgettransactionreceiptparams) \| [`EthGetUncleByBlockHashAndIndexParams`](api.md#ethgetunclebyblockhashandindexparams) \| [`EthGetUncleByBlockNumberAndIndexParams`](api.md#ethgetunclebyblocknumberandindexparams) \| [`EthMiningParams`](api.md#ethminingparams) \| [`EthProtocolVersionParams`](api.md#ethprotocolversionparams) \| [`EthSendRawTransactionParams`](api.md#ethsendrawtransactionparams) \| [`EthSendTransactionParams`](api.md#ethsendtransactionparams) \| [`EthSignParams`](api.md#ethsignparams) \| [`EthSignTransactionParams`](api.md#ethsigntransactionparams) \| [`EthSyncingParams`](api.md#ethsyncingparams) \| [`EthNewFilterParams`](api.md#ethnewfilterparams) \| [`EthNewBlockFilterParams`](api.md#ethnewblockfilterparams) \| [`EthNewPendingTransactionFilterParams`](api.md#ethnewpendingtransactionfilterparams) \| [`EthUninstallFilterParams`](api.md#ethuninstallfilterparams)

#### Defined in

vm/api/dist/index.d.ts:389

___

### EthProtocolVersionHandler

Ƭ **EthProtocolVersionHandler**: (`request`: [`EthProtocolVersionParams`](api.md#ethprotocolversionparams)) => `Promise`\<[`EthProtocolVersionResult`](api.md#ethprotocolversionresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthProtocolVersionResult`](api.md#ethprotocolversionresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthProtocolVersionParams`](api.md#ethprotocolversionparams) |

##### Returns

`Promise`\<[`EthProtocolVersionResult`](api.md#ethprotocolversionresult)\>

#### Defined in

vm/api/dist/index.d.ts:1257

___

### EthProtocolVersionJsonRpcProcedure

Ƭ **EthProtocolVersionJsonRpcProcedure**: (`request`: [`EthProtocolVersionJsonRpcRequest`](api.md#ethprotocolversionjsonrpcrequest)) => `Promise`\<[`EthProtocolVersionJsonRpcResponse`](api.md#ethprotocolversionjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthProtocolVersionJsonRpcResponse`](api.md#ethprotocolversionjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthProtocolVersionJsonRpcRequest`](api.md#ethprotocolversionjsonrpcrequest) |

##### Returns

`Promise`\<[`EthProtocolVersionJsonRpcResponse`](api.md#ethprotocolversionjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1913

___

### EthProtocolVersionJsonRpcRequest

Ƭ **EthProtocolVersionJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_protocolVersion"``, readonly []\>

JSON-RPC request for `eth_protocolVersion` procedure

#### Defined in

vm/api/dist/index.d.ts:1462

___

### EthProtocolVersionJsonRpcResponse

Ƭ **EthProtocolVersionJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_protocolVersion"``, `Hex`, `string`\>

JSON-RPC response for `eth_protocolVersion` procedure

#### Defined in

vm/api/dist/index.d.ts:1742

___

### EthProtocolVersionParams

Ƭ **EthProtocolVersionParams**: `EmptyParams`

JSON-RPC request for `eth_protocolVersion` procedure

#### Defined in

vm/api/dist/index.d.ts:350

___

### EthProtocolVersionResult

Ƭ **EthProtocolVersionResult**: `Hex`

JSON-RPC response for `eth_protocolVersion` procedure

#### Defined in

vm/api/dist/index.d.ts:1157

___

### EthSendRawTransactionHandler

Ƭ **EthSendRawTransactionHandler**: (`request`: [`EthSendRawTransactionParams`](api.md#ethsendrawtransactionparams)) => `Promise`\<[`EthSendRawTransactionResult`](api.md#ethsendrawtransactionresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSendRawTransactionResult`](api.md#ethsendrawtransactionresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSendRawTransactionParams`](api.md#ethsendrawtransactionparams) |

##### Returns

`Promise`\<[`EthSendRawTransactionResult`](api.md#ethsendrawtransactionresult)\>

#### Defined in

vm/api/dist/index.d.ts:1258

___

### EthSendRawTransactionJsonRpcProcedure

Ƭ **EthSendRawTransactionJsonRpcProcedure**: (`request`: [`EthSendRawTransactionJsonRpcRequest`](api.md#ethsendrawtransactionjsonrpcrequest)) => `Promise`\<[`EthSendRawTransactionJsonRpcResponse`](api.md#ethsendrawtransactionjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSendRawTransactionJsonRpcResponse`](api.md#ethsendrawtransactionjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSendRawTransactionJsonRpcRequest`](api.md#ethsendrawtransactionjsonrpcrequest) |

##### Returns

`Promise`\<[`EthSendRawTransactionJsonRpcResponse`](api.md#ethsendrawtransactionjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1914

___

### EthSendRawTransactionJsonRpcRequest

Ƭ **EthSendRawTransactionJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_sendRawTransaction"``, [data: Hex]\>

JSON-RPC request for `eth_sendRawTransaction` procedure

#### Defined in

vm/api/dist/index.d.ts:1466

___

### EthSendRawTransactionJsonRpcResponse

Ƭ **EthSendRawTransactionJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_sendRawTransaction"``, `Hex`, `string`\>

JSON-RPC response for `eth_sendRawTransaction` procedure

#### Defined in

vm/api/dist/index.d.ts:1746

___

### EthSendRawTransactionParams

Ƭ **EthSendRawTransactionParams**: `SendRawTransactionParameters`

JSON-RPC request for `eth_sendRawTransaction` procedure

#### Defined in

vm/api/dist/index.d.ts:354

___

### EthSendRawTransactionResult

Ƭ **EthSendRawTransactionResult**: `Hex`

JSON-RPC response for `eth_sendRawTransaction` procedure

#### Defined in

vm/api/dist/index.d.ts:1161

___

### EthSendTransactionHandler

Ƭ **EthSendTransactionHandler**: (`request`: [`EthSendTransactionParams`](api.md#ethsendtransactionparams)) => `Promise`\<[`EthSendTransactionResult`](api.md#ethsendtransactionresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSendTransactionResult`](api.md#ethsendtransactionresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSendTransactionParams`](api.md#ethsendtransactionparams) |

##### Returns

`Promise`\<[`EthSendTransactionResult`](api.md#ethsendtransactionresult)\>

#### Defined in

vm/api/dist/index.d.ts:1259

___

### EthSendTransactionJsonRpcProcedure

Ƭ **EthSendTransactionJsonRpcProcedure**: (`request`: [`EthSendTransactionJsonRpcRequest`](api.md#ethsendtransactionjsonrpcrequest)) => `Promise`\<[`EthSendTransactionJsonRpcResponse`](api.md#ethsendtransactionjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSendTransactionJsonRpcResponse`](api.md#ethsendtransactionjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSendTransactionJsonRpcRequest`](api.md#ethsendtransactionjsonrpcrequest) |

##### Returns

`Promise`\<[`EthSendTransactionJsonRpcResponse`](api.md#ethsendtransactionjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1915

___

### EthSendTransactionJsonRpcRequest

Ƭ **EthSendTransactionJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_sendTransaction"``, [tx: Transaction]\>

JSON-RPC request for `eth_sendTransaction` procedure

#### Defined in

vm/api/dist/index.d.ts:1472

___

### EthSendTransactionJsonRpcResponse

Ƭ **EthSendTransactionJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_sendTransaction"``, `Hex`, `string`\>

JSON-RPC response for `eth_sendTransaction` procedure

#### Defined in

vm/api/dist/index.d.ts:1750

___

### EthSendTransactionParams

Ƭ **EthSendTransactionParams**: `SendTransactionParameters`

JSON-RPC request for `eth_sendTransaction` procedure

#### Defined in

vm/api/dist/index.d.ts:358

___

### EthSendTransactionResult

Ƭ **EthSendTransactionResult**: `Hex`

JSON-RPC response for `eth_sendTransaction` procedure

#### Defined in

vm/api/dist/index.d.ts:1165

___

### EthSignHandler

Ƭ **EthSignHandler**: (`request`: [`EthSignParams`](api.md#ethsignparams)) => `Promise`\<[`EthSignResult`](api.md#ethsignresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSignResult`](api.md#ethsignresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSignParams`](api.md#ethsignparams) |

##### Returns

`Promise`\<[`EthSignResult`](api.md#ethsignresult)\>

#### Defined in

vm/api/dist/index.d.ts:1260

___

### EthSignJsonRpcProcedure

Ƭ **EthSignJsonRpcProcedure**: (`request`: [`EthSignJsonRpcRequest`](api.md#ethsignjsonrpcrequest)) => `Promise`\<[`EthSignJsonRpcResponse`](api.md#ethsignjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSignJsonRpcResponse`](api.md#ethsignjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSignJsonRpcRequest`](api.md#ethsignjsonrpcrequest) |

##### Returns

`Promise`\<[`EthSignJsonRpcResponse`](api.md#ethsignjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1916

___

### EthSignJsonRpcRequest

Ƭ **EthSignJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_sign"``, [address: Address, message: Hex]\>

JSON-RPC request for `eth_sign` procedure

#### Defined in

vm/api/dist/index.d.ts:1478

___

### EthSignJsonRpcResponse

Ƭ **EthSignJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_sign"``, `Hex`, `string`\>

JSON-RPC response for `eth_sign` procedure

#### Defined in

vm/api/dist/index.d.ts:1754

___

### EthSignParams

Ƭ **EthSignParams**: `SignMessageParameters`

JSON-RPC request for `eth_sign` procedure

#### Defined in

vm/api/dist/index.d.ts:362

___

### EthSignResult

Ƭ **EthSignResult**: `Hex`

JSON-RPC response for `eth_sign` procedure

#### Defined in

vm/api/dist/index.d.ts:1169

___

### EthSignTransactionHandler

Ƭ **EthSignTransactionHandler**: (`request`: [`EthSignTransactionParams`](api.md#ethsigntransactionparams)) => `Promise`\<[`EthSignTransactionResult`](api.md#ethsigntransactionresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSignTransactionResult`](api.md#ethsigntransactionresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSignTransactionParams`](api.md#ethsigntransactionparams) |

##### Returns

`Promise`\<[`EthSignTransactionResult`](api.md#ethsigntransactionresult)\>

#### Defined in

vm/api/dist/index.d.ts:1261

___

### EthSignTransactionJsonRpcProcedure

Ƭ **EthSignTransactionJsonRpcProcedure**: (`request`: [`EthSignTransactionJsonRpcRequest`](api.md#ethsigntransactionjsonrpcrequest)) => `Promise`\<[`EthSignTransactionJsonRpcResponse`](api.md#ethsigntransactionjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSignTransactionJsonRpcResponse`](api.md#ethsigntransactionjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSignTransactionJsonRpcRequest`](api.md#ethsigntransactionjsonrpcrequest) |

##### Returns

`Promise`\<[`EthSignTransactionJsonRpcResponse`](api.md#ethsigntransactionjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1917

___

### EthSignTransactionJsonRpcRequest

Ƭ **EthSignTransactionJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_signTransaction"``, [\{ `chainId?`: `Hex` ; `data?`: `Hex` ; `from`: [`Address`](index.md#address) ; `gas?`: `Hex` ; `gasPrice?`: `Hex` ; `nonce?`: `Hex` ; `to?`: [`Address`](index.md#address) ; `value?`: `Hex`  }]\>

JSON-RPC request for `eth_signTransaction` procedure

#### Defined in

vm/api/dist/index.d.ts:1485

___

### EthSignTransactionJsonRpcResponse

Ƭ **EthSignTransactionJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_signTransaction"``, `Hex`, `string`\>

JSON-RPC response for `eth_signTransaction` procedure

#### Defined in

vm/api/dist/index.d.ts:1758

___

### EthSignTransactionParams

Ƭ **EthSignTransactionParams**: `SignMessageParameters`

JSON-RPC request for `eth_signTransaction` procedure

#### Defined in

vm/api/dist/index.d.ts:366

___

### EthSignTransactionResult

Ƭ **EthSignTransactionResult**: `Hex`

JSON-RPC response for `eth_signTransaction` procedure

#### Defined in

vm/api/dist/index.d.ts:1173

___

### EthSyncingHandler

Ƭ **EthSyncingHandler**: (`request`: [`EthSyncingParams`](api.md#ethsyncingparams)) => `Promise`\<[`EthSyncingResult`](api.md#ethsyncingresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSyncingResult`](api.md#ethsyncingresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSyncingParams`](api.md#ethsyncingparams) |

##### Returns

`Promise`\<[`EthSyncingResult`](api.md#ethsyncingresult)\>

#### Defined in

vm/api/dist/index.d.ts:1262

___

### EthSyncingJsonRpcProcedure

Ƭ **EthSyncingJsonRpcProcedure**: (`request`: [`EthSyncingJsonRpcRequest`](api.md#ethsyncingjsonrpcrequest)) => `Promise`\<[`EthSyncingJsonRpcResponse`](api.md#ethsyncingjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSyncingJsonRpcResponse`](api.md#ethsyncingjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSyncingJsonRpcRequest`](api.md#ethsyncingjsonrpcrequest) |

##### Returns

`Promise`\<[`EthSyncingJsonRpcResponse`](api.md#ethsyncingjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1918

___

### EthSyncingJsonRpcRequest

Ƭ **EthSyncingJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_syncing"``, readonly []\>

JSON-RPC request for `eth_syncing` procedure

#### Defined in

vm/api/dist/index.d.ts:1500

___

### EthSyncingJsonRpcResponse

Ƭ **EthSyncingJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_syncing"``, `boolean` \| \{ `currentBlock`: `Hex` ; `headedBytecodebytes?`: `Hex` ; `healedBytecodes?`: `Hex` ; `healedTrienodes?`: `Hex` ; `healingBytecode?`: `Hex` ; `healingTrienodes?`: `Hex` ; `highestBlock`: `Hex` ; `knownStates`: `Hex` ; `pulledStates`: `Hex` ; `startingBlock`: `Hex` ; `syncedBytecodeBytes?`: `Hex` ; `syncedBytecodes?`: `Hex` ; `syncedStorage?`: `Hex` ; `syncedStorageBytes?`: `Hex`  }, `string`\>

JSON-RPC response for `eth_syncing` procedure

#### Defined in

vm/api/dist/index.d.ts:1762

___

### EthSyncingParams

Ƭ **EthSyncingParams**: `EmptyParams`

JSON-RPC request for `eth_syncing` procedure

#### Defined in

vm/api/dist/index.d.ts:370

___

### EthSyncingResult

Ƭ **EthSyncingResult**: `boolean` \| \{ `currentBlock`: `Hex` ; `headedBytecodebytes?`: `Hex` ; `healedBytecodes?`: `Hex` ; `healedTrienodes?`: `Hex` ; `healingBytecode?`: `Hex` ; `healingTrienodes?`: `Hex` ; `highestBlock`: `Hex` ; `knownStates`: `Hex` ; `pulledStates`: `Hex` ; `startingBlock`: `Hex` ; `syncedBytecodeBytes?`: `Hex` ; `syncedBytecodes?`: `Hex` ; `syncedStorage?`: `Hex` ; `syncedStorageBytes?`: `Hex`  }

JSON-RPC response for `eth_syncing` procedure

#### Defined in

vm/api/dist/index.d.ts:1177

___

### EthUninstallFilterHandler

Ƭ **EthUninstallFilterHandler**: (`request`: [`EthUninstallFilterParams`](api.md#ethuninstallfilterparams)) => `Promise`\<[`EthUninstallFilterResult`](api.md#ethuninstallfilterresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthUninstallFilterResult`](api.md#ethuninstallfilterresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthUninstallFilterParams`](api.md#ethuninstallfilterparams) |

##### Returns

`Promise`\<[`EthUninstallFilterResult`](api.md#ethuninstallfilterresult)\>

#### Defined in

vm/api/dist/index.d.ts:1266

___

### EthUninstallFilterJsonRpcProcedure

Ƭ **EthUninstallFilterJsonRpcProcedure**: (`request`: [`EthUninstallFilterJsonRpcRequest`](api.md#ethuninstallfilterjsonrpcrequest)) => `Promise`\<[`EthUninstallFilterJsonRpcResponse`](api.md#ethuninstallfilterjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthUninstallFilterJsonRpcResponse`](api.md#ethuninstallfilterjsonrpcresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthUninstallFilterJsonRpcRequest`](api.md#ethuninstallfilterjsonrpcrequest) |

##### Returns

`Promise`\<[`EthUninstallFilterJsonRpcResponse`](api.md#ethuninstallfilterjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1922

___

### EthUninstallFilterJsonRpcRequest

Ƭ **EthUninstallFilterJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"eth_uninstallFilter"``, [filterId: Hex]\>

JSON-RPC request for `eth_uninstallFilter` procedure

#### Defined in

vm/api/dist/index.d.ts:1516

___

### EthUninstallFilterJsonRpcResponse

Ƭ **EthUninstallFilterJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"eth_uninstallFilter"``, `boolean`, `string`\>

JSON-RPC response for `eth_uninstallFilter` procedure

#### Defined in

vm/api/dist/index.d.ts:1793

___

### EthUninstallFilterParams

Ƭ **EthUninstallFilterParams**: `Object`

JSON-RPC request for `eth_uninstallFilter` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `filterId` | `Hex` |

#### Defined in

vm/api/dist/index.d.ts:386

___

### EthUninstallFilterResult

Ƭ **EthUninstallFilterResult**: `boolean`

JSON-RPC response for `eth_uninstallFilter` procedure

#### Defined in

vm/api/dist/index.d.ts:1208

___

### EvmError

Ƭ **EvmError**\<`TEVMErrorMessage`\>: [`TypedError`](api.md#typederror)\<`TEVMErrorMessage`\>

Error type of errors thrown while internally executing a call in the EVM

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEVMErrorMessage` | extends [`TevmEVMErrorMessage`](api.md#tevmevmerrormessage) = [`TevmEVMErrorMessage`](api.md#tevmevmerrormessage) |

#### Defined in

vm/api/dist/index.d.ts:750

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

vm/api/dist/index.d.ts:616

___

### InvalidAddressError

Ƭ **InvalidAddressError**: [`TypedError`](api.md#typederror)\<``"InvalidAddressError"``\>

Error thrown when address is invalid

#### Defined in

vm/api/dist/index.d.ts:755

___

### InvalidBalanceError

Ƭ **InvalidBalanceError**: [`TypedError`](api.md#typederror)\<``"InvalidBalanceError"``\>

Error thrown when balance parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:739

___

### InvalidBlobVersionedHashesError

Ƭ **InvalidBlobVersionedHashesError**: [`TypedError`](api.md#typederror)\<``"InvalidBlobVersionedHashesError"``\>

Error thrown when blobVersionedHashes parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:760

___

### InvalidBlockError

Ƭ **InvalidBlockError**: [`TypedError`](api.md#typederror)\<``"InvalidBlockError"``\>

Error thrown when block parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:765

___

### InvalidBytecodeError

Ƭ **InvalidBytecodeError**: [`TypedError`](api.md#typederror)\<``"InvalidBytecodeError"``\>

Error thrown when bytecode parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:724

___

### InvalidCallerError

Ƭ **InvalidCallerError**: [`TypedError`](api.md#typederror)\<``"InvalidCallerError"``\>

Error thrown when caller parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:770

___

### InvalidDataError

Ƭ **InvalidDataError**: [`TypedError`](api.md#typederror)\<``"InvalidDataError"``\>

Error thrown when data parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:734

___

### InvalidDeployedBytecodeError

Ƭ **InvalidDeployedBytecodeError**: [`TypedError`](api.md#typederror)\<``"InvalidDeployedBytecodeError"``\>

Error thrown when deployedBytecode parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:882

___

### InvalidDepthError

Ƭ **InvalidDepthError**: [`TypedError`](api.md#typederror)\<``"InvalidDepthError"``\>

Error thrown when depth parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:775

___

### InvalidFunctionNameError

Ƭ **InvalidFunctionNameError**: [`TypedError`](api.md#typederror)\<``"InvalidFunctionNameError"``\>

Error thrown when function name is invalid

#### Defined in

vm/api/dist/index.d.ts:744

___

### InvalidGasLimitError

Ƭ **InvalidGasLimitError**: [`TypedError`](api.md#typederror)\<``"InvalidGasLimitError"``\>

Error thrown when gas limit is invalid

#### Defined in

vm/api/dist/index.d.ts:780

___

### InvalidGasPriceError

Ƭ **InvalidGasPriceError**: [`TypedError`](api.md#typederror)\<``"InvalidGasPriceError"``\>

Error thrown when gasPrice parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:785

___

### InvalidGasRefundError

Ƭ **InvalidGasRefundError**: [`TypedError`](api.md#typederror)\<``"InvalidGasRefundError"``\>

Error thrown when gas refund is invalid

#### Defined in

vm/api/dist/index.d.ts:790

___

### InvalidNonceError

Ƭ **InvalidNonceError**: [`TypedError`](api.md#typederror)\<``"InvalidNonceError"``\>

Error thrown when nonce parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:795

___

### InvalidOriginError

Ƭ **InvalidOriginError**: [`TypedError`](api.md#typederror)\<``"InvalidOriginError"``\>

Error thrown when origin parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:800

___

### InvalidRequestError

Ƭ **InvalidRequestError**: [`TypedError`](api.md#typederror)\<``"InvalidRequestError"``\>

Error thrown when request is invalid

#### Defined in

vm/api/dist/index.d.ts:805

___

### InvalidSaltError

Ƭ **InvalidSaltError**: [`TypedError`](api.md#typederror)\<``"InvalidSaltError"``\>

Error thrown when salt parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:910

___

### InvalidSelfdestructError

Ƭ **InvalidSelfdestructError**: [`TypedError`](api.md#typederror)\<``"InvalidSelfdestructError"``\>

Error thrown when selfdestruct parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:810

___

### InvalidSkipBalanceError

Ƭ **InvalidSkipBalanceError**: [`TypedError`](api.md#typederror)\<``"InvalidSkipBalanceError"``\>

Error thrown when skipBalance parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:815

___

### InvalidStorageRootError

Ƭ **InvalidStorageRootError**: [`TypedError`](api.md#typederror)\<``"InvalidStorageRootError"``\>

Error thrown when storage root parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:729

___

### InvalidToError

Ƭ **InvalidToError**: [`TypedError`](api.md#typederror)\<``"InvalidToError"``\>

Error thrown when `to` parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:820

___

### InvalidValueError

Ƭ **InvalidValueError**: [`TypedError`](api.md#typederror)\<``"InvalidValueError"``\>

Error thrown when value parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:825

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

vm/api/dist/index.d.ts:1283

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

vm/api/dist/index.d.ts:1589

___

### Log

Ƭ **Log**: `Object`

Generic log information

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | [`Address`](index.md#address) |
| `data` | `Hex` |
| `topics` | `Hex`[] |

#### Defined in

vm/api/dist/index.d.ts:582

___

### ScriptError

Ƭ **ScriptError**: [`ContractError`](api.md#contracterror) \| [`InvalidBytecodeError`](api.md#invalidbytecodeerror) \| [`InvalidDeployedBytecodeError`](api.md#invaliddeployedbytecodeerror)

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

vm/api/dist/index.d.ts:893

___

### ScriptHandler

Ƭ **ScriptHandler**: \<TAbi, TFunctionName\>(`params`: [`ScriptParams`](index.md#scriptparams)\<`TAbi`, `TFunctionName`\>) => `Promise`\<[`ScriptResult`](index.md#scriptresult)\<`TAbi`, `TFunctionName`\>\>

#### Type declaration

▸ \<`TAbi`, `TFunctionName`\>(`params`): `Promise`\<[`ScriptResult`](index.md#scriptresult)\<`TAbi`, `TFunctionName`\>\>

Handler for script tevm procedure

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends [`Abi`](index.md#abi) \| readonly `unknown`[] = [`Abi`](index.md#abi) |
| `TFunctionName` | extends `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\> |

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`ScriptParams`](index.md#scriptparams)\<`TAbi`, `TFunctionName`\> |

##### Returns

`Promise`\<[`ScriptResult`](index.md#scriptresult)\<`TAbi`, `TFunctionName`\>\>

#### Defined in

vm/api/dist/index.d.ts:941

___

### ScriptJsonRpcProcedure

Ƭ **ScriptJsonRpcProcedure**: (`request`: [`ScriptJsonRpcRequest`](api.md#scriptjsonrpcrequest)) => `Promise`\<[`ScriptJsonRpcResponse`](api.md#scriptjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`ScriptJsonRpcResponse`](api.md#scriptjsonrpcresponse)\>

Procedure for handling script JSON-RPC requests

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`ScriptJsonRpcRequest`](api.md#scriptjsonrpcrequest) |

##### Returns

`Promise`\<[`ScriptJsonRpcResponse`](api.md#scriptjsonrpcresponse)\>

#### Defined in

vm/api/dist/index.d.ts:1883

___

### ScriptJsonRpcRequest

Ƭ **ScriptJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"tevm_script"``, `SerializedParams`\>

The JSON-RPC request for the `tevm_script` method

#### Defined in

vm/api/dist/index.d.ts:1328

___

### ScriptJsonRpcResponse

Ƭ **ScriptJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"tevm_script"``, `SerializeToJson`\<[`CallResult`](index.md#callresult)\>, [`ScriptError`](api.md#scripterror)[``"_tag"``]\>

JSON-RPC response for `tevm_script` procedure

#### Defined in

vm/api/dist/index.d.ts:1625

___

### Tevm

Ƭ **Tevm**: `Object`

The specification for the Tevm api
It has a request method for JSON-RPC requests and more ergonomic handler methods
for each type of request

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account` | [`AccountHandler`](api.md#accounthandler) |
| `call` | [`CallHandler`](api.md#callhandler) |
| `contract` | [`ContractHandler`](api.md#contracthandler) |
| `eth` | \{ `blockNumber`: [`EthBlockNumberHandler`](api.md#ethblocknumberhandler) ; `chainId`: [`EthChainIdHandler`](api.md#ethchainidhandler) ; `gasPrice`: [`EthGasPriceHandler`](api.md#ethgaspricehandler) ; `getBalance`: [`EthGetBalanceHandler`](api.md#ethgetbalancehandler) ; `getCode`: [`EthGetCodeHandler`](api.md#ethgetcodehandler) ; `getStorageAt`: [`EthGetStorageAtHandler`](api.md#ethgetstorageathandler)  } |
| `eth.blockNumber` | [`EthBlockNumberHandler`](api.md#ethblocknumberhandler) |
| `eth.chainId` | [`EthChainIdHandler`](api.md#ethchainidhandler) |
| `eth.gasPrice` | [`EthGasPriceHandler`](api.md#ethgaspricehandler) |
| `eth.getBalance` | [`EthGetBalanceHandler`](api.md#ethgetbalancehandler) |
| `eth.getCode` | [`EthGetCodeHandler`](api.md#ethgetcodehandler) |
| `eth.getStorageAt` | [`EthGetStorageAtHandler`](api.md#ethgetstorageathandler) |
| `request` | [`TevmJsonRpcRequestHandler`](index.md#tevmjsonrpcrequesthandler) |
| `script` | [`ScriptHandler`](api.md#scripthandler) |

#### Defined in

vm/api/dist/index.d.ts:2067

___

### TevmEVMErrorMessage

Ƭ **TevmEVMErrorMessage**: ``"out of gas"`` \| ``"code store out of gas"`` \| ``"code size to deposit exceeds maximum code size"`` \| ``"stack underflow"`` \| ``"stack overflow"`` \| ``"invalid JUMP"`` \| ``"invalid opcode"`` \| ``"value out of range"`` \| ``"revert"`` \| ``"static state change"`` \| ``"internal error"`` \| ``"create collision"`` \| ``"stop"`` \| ``"refund exhausted"`` \| ``"value overflow"`` \| ``"insufficient balance"`` \| ``"invalid BEGINSUB"`` \| ``"invalid RETURNSUB"`` \| ``"invalid JUMPSUB"`` \| ``"invalid bytecode deployed"`` \| ``"invalid EOF format"`` \| ``"initcode exceeds max initcode size"`` \| ``"invalid input length"`` \| ``"attempting to AUTHCALL without AUTH set"`` \| ``"attempting to execute AUTHCALL with nonzero external value"`` \| ``"invalid Signature: s-values greater than secp256k1n/2 are considered invalid"`` \| ``"invalid input length"`` \| ``"point not on curve"`` \| ``"input is empty"`` \| ``"fp point not in field"`` \| ``"kzg commitment does not match versioned hash"`` \| ``"kzg inputs invalid"`` \| ``"kzg proof invalid"``

#### Defined in

vm/api/dist/index.d.ts:746

___

### TraceCall

Ƭ **TraceCall**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `calls?` | [`TraceCall`](api.md#tracecall)[] |
| `from` | [`Address`](index.md#address) |
| `gas?` | `bigint` |
| `gasUsed?` | `bigint` |
| `input` | `Hex` |
| `output` | `Hex` |
| `to` | [`Address`](index.md#address) |
| `type` | [`TraceType`](api.md#tracetype) |
| `value?` | `bigint` |

#### Defined in

vm/api/dist/index.d.ts:682

___

### TraceParams

Ƭ **TraceParams**: `Object`

Config params for trace calls

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `timeout?` | `string` | A duration string of decimal numbers that overrides the default timeout of 5 seconds for JavaScript-based tracing calls. Max timeout is "10s". Valid time units are "ns", "us", "ms", "s" each with optional fraction, such as "300ms" or "2s45ms". **`Example`** ```ts "10s" ``` |
| `tracer` | ``"callTracer"`` \| ``"prestateTracer"`` | The type of tracer Currently only callTracer supported |
| `tracerConfig?` | {} | object to specify configurations for the tracer |

#### Defined in

vm/api/dist/index.d.ts:540

___

### TraceResult

Ƭ **TraceResult**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `calls?` | [`TraceCall`](api.md#tracecall)[] |
| `from` | [`Address`](index.md#address) |
| `gas` | `bigint` |
| `gasUsed` | `bigint` |
| `input` | `Hex` |
| `output` | `Hex` |
| `to` | [`Address`](index.md#address) |
| `type` | [`TraceType`](api.md#tracetype) |
| `value` | `bigint` |

#### Defined in

vm/api/dist/index.d.ts:694

___

### TraceType

Ƭ **TraceType**: ``"CALL"`` \| ``"DELEGATECALL"`` \| ``"STATICCALL"`` \| ``"CREATE"`` \| ``"CREATE2"`` \| ``"SELFDESTRUCT"`` \| ``"REWARD"``

#### Defined in

vm/api/dist/index.d.ts:680

___

### TransactionParams

Ƭ **TransactionParams**: `Object`

A transaction request object

#### Type declaration

| Name | Type |
| :------ | :------ |
| `from` | [`Address`](index.md#address) |
| `gas?` | `Hex` |
| `gasPrice?` | `Hex` |
| `input` | `Hex` |
| `nonce?` | `Hex` |
| `to?` | [`Address`](index.md#address) |
| `value?` | `Hex` |

#### Defined in

vm/api/dist/index.d.ts:631

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
| `logs` | readonly [`FilterLog`](api.md#filterlog)[] |
| `logsBloom` | `Hex` |
| `status` | `Hex` |
| `to` | `Hex` |
| `transactionHash` | `Hex` |
| `transactionIndex` | `Hex` |

#### Defined in

vm/api/dist/index.d.ts:644

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

vm/api/dist/index.d.ts:663

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

vm/api/dist/index.d.ts:714

___

### UnexpectedError

Ƭ **UnexpectedError**: [`TypedError`](api.md#typederror)\<``"UnexpectedError"``\>

Error representing an unknown error occurred
It should never get thrown. This error being thrown
means an error wasn't properly handled already

#### Defined in

vm/api/dist/index.d.ts:832

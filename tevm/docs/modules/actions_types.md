[tevm](../README.md) / [Modules](../modules.md) / actions-types

# Module: actions-types

## Table of contents

### References

- [BlockParam](actions_types.md#blockparam)
- [CallParams](actions_types.md#callparams)
- [CallResult](actions_types.md#callresult)
- [ContractParams](actions_types.md#contractparams)
- [ContractResult](actions_types.md#contractresult)
- [GetAccountParams](actions_types.md#getaccountparams)
- [GetAccountResult](actions_types.md#getaccountresult)
- [ScriptParams](actions_types.md#scriptparams)
- [ScriptResult](actions_types.md#scriptresult)
- [SetAccountParams](actions_types.md#setaccountparams)
- [SetAccountResult](actions_types.md#setaccountresult)
- [TraceCall](actions_types.md#tracecall)
- [TraceParams](actions_types.md#traceparams)
- [TraceResult](actions_types.md#traceresult)

### Type Aliases

- [Abi](actions_types.md#abi)
- [Address](actions_types.md#address)
- [AnvilDropTransactionHandler](actions_types.md#anvildroptransactionhandler)
- [AnvilDropTransactionParams](actions_types.md#anvildroptransactionparams)
- [AnvilDropTransactionResult](actions_types.md#anvildroptransactionresult)
- [AnvilDumpStateHandler](actions_types.md#anvildumpstatehandler)
- [AnvilDumpStateParams](actions_types.md#anvildumpstateparams)
- [AnvilDumpStateResult](actions_types.md#anvildumpstateresult)
- [AnvilGetAutomineHandler](actions_types.md#anvilgetautominehandler)
- [AnvilGetAutomineParams](actions_types.md#anvilgetautomineparams)
- [AnvilGetAutomineResult](actions_types.md#anvilgetautomineresult)
- [AnvilImpersonateAccountHandler](actions_types.md#anvilimpersonateaccounthandler)
- [AnvilImpersonateAccountParams](actions_types.md#anvilimpersonateaccountparams)
- [AnvilImpersonateAccountResult](actions_types.md#anvilimpersonateaccountresult)
- [AnvilLoadStateHandler](actions_types.md#anvilloadstatehandler)
- [AnvilLoadStateParams](actions_types.md#anvilloadstateparams)
- [AnvilLoadStateResult](actions_types.md#anvilloadstateresult)
- [AnvilMineHandler](actions_types.md#anvilminehandler)
- [AnvilMineParams](actions_types.md#anvilmineparams)
- [AnvilMineResult](actions_types.md#anvilmineresult)
- [AnvilResetHandler](actions_types.md#anvilresethandler)
- [AnvilResetParams](actions_types.md#anvilresetparams)
- [AnvilResetResult](actions_types.md#anvilresetresult)
- [AnvilSetBalanceHandler](actions_types.md#anvilsetbalancehandler)
- [AnvilSetBalanceParams](actions_types.md#anvilsetbalanceparams)
- [AnvilSetBalanceResult](actions_types.md#anvilsetbalanceresult)
- [AnvilSetChainIdHandler](actions_types.md#anvilsetchainidhandler)
- [AnvilSetChainIdParams](actions_types.md#anvilsetchainidparams)
- [AnvilSetChainIdResult](actions_types.md#anvilsetchainidresult)
- [AnvilSetCodeHandler](actions_types.md#anvilsetcodehandler)
- [AnvilSetCodeParams](actions_types.md#anvilsetcodeparams)
- [AnvilSetCodeResult](actions_types.md#anvilsetcoderesult)
- [AnvilSetNonceHandler](actions_types.md#anvilsetnoncehandler)
- [AnvilSetNonceParams](actions_types.md#anvilsetnonceparams)
- [AnvilSetNonceResult](actions_types.md#anvilsetnonceresult)
- [AnvilSetStorageAtHandler](actions_types.md#anvilsetstorageathandler)
- [AnvilSetStorageAtParams](actions_types.md#anvilsetstorageatparams)
- [AnvilSetStorageAtResult](actions_types.md#anvilsetstorageatresult)
- [AnvilStopImpersonatingAccountHandler](actions_types.md#anvilstopimpersonatingaccounthandler)
- [AnvilStopImpersonatingAccountParams](actions_types.md#anvilstopimpersonatingaccountparams)
- [AnvilStopImpersonatingAccountResult](actions_types.md#anvilstopimpersonatingaccountresult)
- [BaseCallParams](actions_types.md#basecallparams)
- [Block](actions_types.md#block)
- [BlockResult](actions_types.md#blockresult)
- [BlockTag](actions_types.md#blocktag)
- [CallHandler](actions_types.md#callhandler)
- [ContractHandler](actions_types.md#contracthandler)
- [DebugTraceCallHandler](actions_types.md#debugtracecallhandler)
- [DebugTraceCallParams](actions_types.md#debugtracecallparams)
- [DebugTraceCallResult](actions_types.md#debugtracecallresult)
- [DebugTraceTransactionHandler](actions_types.md#debugtracetransactionhandler)
- [DebugTraceTransactionParams](actions_types.md#debugtracetransactionparams)
- [DebugTraceTransactionResult](actions_types.md#debugtracetransactionresult)
- [DumpStateHandler](actions_types.md#dumpstatehandler)
- [DumpStateResult](actions_types.md#dumpstateresult)
- [EmptyParams](actions_types.md#emptyparams)
- [EthAccountsHandler](actions_types.md#ethaccountshandler)
- [EthAccountsParams](actions_types.md#ethaccountsparams)
- [EthAccountsResult](actions_types.md#ethaccountsresult)
- [EthBlockNumberHandler](actions_types.md#ethblocknumberhandler)
- [EthBlockNumberParams](actions_types.md#ethblocknumberparams)
- [EthBlockNumberResult](actions_types.md#ethblocknumberresult)
- [EthCallHandler](actions_types.md#ethcallhandler)
- [EthCallParams](actions_types.md#ethcallparams)
- [EthCallResult](actions_types.md#ethcallresult)
- [EthChainIdHandler](actions_types.md#ethchainidhandler)
- [EthChainIdParams](actions_types.md#ethchainidparams)
- [EthChainIdResult](actions_types.md#ethchainidresult)
- [EthCoinbaseHandler](actions_types.md#ethcoinbasehandler)
- [EthCoinbaseParams](actions_types.md#ethcoinbaseparams)
- [EthCoinbaseResult](actions_types.md#ethcoinbaseresult)
- [EthEstimateGasHandler](actions_types.md#ethestimategashandler)
- [EthEstimateGasParams](actions_types.md#ethestimategasparams)
- [EthEstimateGasResult](actions_types.md#ethestimategasresult)
- [EthGasPriceHandler](actions_types.md#ethgaspricehandler)
- [EthGasPriceParams](actions_types.md#ethgaspriceparams)
- [EthGasPriceResult](actions_types.md#ethgaspriceresult)
- [EthGetBalanceHandler](actions_types.md#ethgetbalancehandler)
- [EthGetBalanceParams](actions_types.md#ethgetbalanceparams)
- [EthGetBalanceResult](actions_types.md#ethgetbalanceresult)
- [EthGetBlockByHashHandler](actions_types.md#ethgetblockbyhashhandler)
- [EthGetBlockByHashParams](actions_types.md#ethgetblockbyhashparams)
- [EthGetBlockByHashResult](actions_types.md#ethgetblockbyhashresult)
- [EthGetBlockByNumberHandler](actions_types.md#ethgetblockbynumberhandler)
- [EthGetBlockByNumberParams](actions_types.md#ethgetblockbynumberparams)
- [EthGetBlockByNumberResult](actions_types.md#ethgetblockbynumberresult)
- [EthGetBlockTransactionCountByHashHandler](actions_types.md#ethgetblocktransactioncountbyhashhandler)
- [EthGetBlockTransactionCountByHashParams](actions_types.md#ethgetblocktransactioncountbyhashparams)
- [EthGetBlockTransactionCountByHashResult](actions_types.md#ethgetblocktransactioncountbyhashresult)
- [EthGetBlockTransactionCountByNumberHandler](actions_types.md#ethgetblocktransactioncountbynumberhandler)
- [EthGetBlockTransactionCountByNumberParams](actions_types.md#ethgetblocktransactioncountbynumberparams)
- [EthGetBlockTransactionCountByNumberResult](actions_types.md#ethgetblocktransactioncountbynumberresult)
- [EthGetCodeHandler](actions_types.md#ethgetcodehandler)
- [EthGetCodeParams](actions_types.md#ethgetcodeparams)
- [EthGetCodeResult](actions_types.md#ethgetcoderesult)
- [EthGetFilterChangesHandler](actions_types.md#ethgetfilterchangeshandler)
- [EthGetFilterChangesParams](actions_types.md#ethgetfilterchangesparams)
- [EthGetFilterChangesResult](actions_types.md#ethgetfilterchangesresult)
- [EthGetFilterLogsHandler](actions_types.md#ethgetfilterlogshandler)
- [EthGetFilterLogsParams](actions_types.md#ethgetfilterlogsparams)
- [EthGetFilterLogsResult](actions_types.md#ethgetfilterlogsresult)
- [EthGetLogsHandler](actions_types.md#ethgetlogshandler)
- [EthGetLogsParams](actions_types.md#ethgetlogsparams)
- [EthGetLogsResult](actions_types.md#ethgetlogsresult)
- [EthGetStorageAtHandler](actions_types.md#ethgetstorageathandler)
- [EthGetStorageAtParams](actions_types.md#ethgetstorageatparams)
- [EthGetStorageAtResult](actions_types.md#ethgetstorageatresult)
- [EthGetTransactionByBlockHashAndIndexHandler](actions_types.md#ethgettransactionbyblockhashandindexhandler)
- [EthGetTransactionByBlockHashAndIndexParams](actions_types.md#ethgettransactionbyblockhashandindexparams)
- [EthGetTransactionByBlockHashAndIndexResult](actions_types.md#ethgettransactionbyblockhashandindexresult)
- [EthGetTransactionByBlockNumberAndIndexHandler](actions_types.md#ethgettransactionbyblocknumberandindexhandler)
- [EthGetTransactionByBlockNumberAndIndexParams](actions_types.md#ethgettransactionbyblocknumberandindexparams)
- [EthGetTransactionByBlockNumberAndIndexResult](actions_types.md#ethgettransactionbyblocknumberandindexresult)
- [EthGetTransactionByHashHandler](actions_types.md#ethgettransactionbyhashhandler)
- [EthGetTransactionByHashParams](actions_types.md#ethgettransactionbyhashparams)
- [EthGetTransactionByHashResult](actions_types.md#ethgettransactionbyhashresult)
- [EthGetTransactionCountHandler](actions_types.md#ethgettransactioncounthandler)
- [EthGetTransactionCountParams](actions_types.md#ethgettransactioncountparams)
- [EthGetTransactionCountResult](actions_types.md#ethgettransactioncountresult)
- [EthGetTransactionReceiptHandler](actions_types.md#ethgettransactionreceipthandler)
- [EthGetTransactionReceiptParams](actions_types.md#ethgettransactionreceiptparams)
- [EthGetTransactionReceiptResult](actions_types.md#ethgettransactionreceiptresult)
- [EthGetUncleByBlockHashAndIndexHandler](actions_types.md#ethgetunclebyblockhashandindexhandler)
- [EthGetUncleByBlockHashAndIndexParams](actions_types.md#ethgetunclebyblockhashandindexparams)
- [EthGetUncleByBlockHashAndIndexResult](actions_types.md#ethgetunclebyblockhashandindexresult)
- [EthGetUncleByBlockNumberAndIndexHandler](actions_types.md#ethgetunclebyblocknumberandindexhandler)
- [EthGetUncleByBlockNumberAndIndexParams](actions_types.md#ethgetunclebyblocknumberandindexparams)
- [EthGetUncleByBlockNumberAndIndexResult](actions_types.md#ethgetunclebyblocknumberandindexresult)
- [EthGetUncleCountByBlockHashHandler](actions_types.md#ethgetunclecountbyblockhashhandler)
- [EthGetUncleCountByBlockHashParams](actions_types.md#ethgetunclecountbyblockhashparams)
- [EthGetUncleCountByBlockHashResult](actions_types.md#ethgetunclecountbyblockhashresult)
- [EthGetUncleCountByBlockNumberHandler](actions_types.md#ethgetunclecountbyblocknumberhandler)
- [EthGetUncleCountByBlockNumberParams](actions_types.md#ethgetunclecountbyblocknumberparams)
- [EthGetUncleCountByBlockNumberResult](actions_types.md#ethgetunclecountbyblocknumberresult)
- [EthHashrateHandler](actions_types.md#ethhashratehandler)
- [EthHashrateParams](actions_types.md#ethhashrateparams)
- [EthHashrateResult](actions_types.md#ethhashrateresult)
- [EthMiningHandler](actions_types.md#ethmininghandler)
- [EthMiningParams](actions_types.md#ethminingparams)
- [EthMiningResult](actions_types.md#ethminingresult)
- [EthNewBlockFilterHandler](actions_types.md#ethnewblockfilterhandler)
- [EthNewBlockFilterParams](actions_types.md#ethnewblockfilterparams)
- [EthNewBlockFilterResult](actions_types.md#ethnewblockfilterresult)
- [EthNewFilterHandler](actions_types.md#ethnewfilterhandler)
- [EthNewFilterParams](actions_types.md#ethnewfilterparams)
- [EthNewFilterResult](actions_types.md#ethnewfilterresult)
- [EthNewPendingTransactionFilterHandler](actions_types.md#ethnewpendingtransactionfilterhandler)
- [EthNewPendingTransactionFilterParams](actions_types.md#ethnewpendingtransactionfilterparams)
- [EthNewPendingTransactionFilterResult](actions_types.md#ethnewpendingtransactionfilterresult)
- [EthParams](actions_types.md#ethparams)
- [EthProtocolVersionHandler](actions_types.md#ethprotocolversionhandler)
- [EthProtocolVersionParams](actions_types.md#ethprotocolversionparams)
- [EthProtocolVersionResult](actions_types.md#ethprotocolversionresult)
- [EthSendRawTransactionHandler](actions_types.md#ethsendrawtransactionhandler)
- [EthSendRawTransactionParams](actions_types.md#ethsendrawtransactionparams)
- [EthSendRawTransactionResult](actions_types.md#ethsendrawtransactionresult)
- [EthSendTransactionHandler](actions_types.md#ethsendtransactionhandler)
- [EthSendTransactionParams](actions_types.md#ethsendtransactionparams)
- [EthSendTransactionResult](actions_types.md#ethsendtransactionresult)
- [EthSignHandler](actions_types.md#ethsignhandler)
- [EthSignParams](actions_types.md#ethsignparams)
- [EthSignResult](actions_types.md#ethsignresult)
- [EthSignTransactionHandler](actions_types.md#ethsigntransactionhandler)
- [EthSignTransactionParams](actions_types.md#ethsigntransactionparams)
- [EthSignTransactionResult](actions_types.md#ethsigntransactionresult)
- [EthSyncingHandler](actions_types.md#ethsyncinghandler)
- [EthSyncingParams](actions_types.md#ethsyncingparams)
- [EthSyncingResult](actions_types.md#ethsyncingresult)
- [EthUninstallFilterHandler](actions_types.md#ethuninstallfilterhandler)
- [EthUninstallFilterParams](actions_types.md#ethuninstallfilterparams)
- [EthUninstallFilterResult](actions_types.md#ethuninstallfilterresult)
- [FilterLog](actions_types.md#filterlog)
- [FilterParams](actions_types.md#filterparams)
- [GetAccountHandler](actions_types.md#getaccounthandler)
- [Hex](actions_types.md#hex)
- [LoadStateHandler](actions_types.md#loadstatehandler)
- [LoadStateParams](actions_types.md#loadstateparams)
- [LoadStateResult](actions_types.md#loadstateresult)
- [Log](actions_types.md#log)
- [NetworkConfig](actions_types.md#networkconfig)
- [ScriptHandler](actions_types.md#scripthandler)
- [SetAccountHandler](actions_types.md#setaccounthandler)
- [StructLog](actions_types.md#structlog)
- [TraceType](actions_types.md#tracetype)
- [TransactionParams](actions_types.md#transactionparams)
- [TransactionReceiptResult](actions_types.md#transactionreceiptresult)
- [TransactionResult](actions_types.md#transactionresult)

## References

### BlockParam

Re-exports [BlockParam](index.md#blockparam)

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

### GetAccountParams

Re-exports [GetAccountParams](index.md#getaccountparams)

___

### GetAccountResult

Re-exports [GetAccountResult](index.md#getaccountresult)

___

### ScriptParams

Re-exports [ScriptParams](index.md#scriptparams)

___

### ScriptResult

Re-exports [ScriptResult](index.md#scriptresult)

___

### SetAccountParams

Re-exports [SetAccountParams](index.md#setaccountparams)

___

### SetAccountResult

Re-exports [SetAccountResult](index.md#setaccountresult)

___

### TraceCall

Re-exports [TraceCall](index.md#tracecall)

___

### TraceParams

Re-exports [TraceParams](index.md#traceparams)

___

### TraceResult

Re-exports [TraceResult](index.md#traceresult)

## Type Aliases

### Abi

Ƭ **Abi**: [`Abi`](index.md#abi)

A valid [Ethereum JSON ABI](https://docs.soliditylang.org/en/latest/abi-spec.html#json)

#### Defined in

evmts-monorepo/packages/actions-types/types/common/Abi.d.ts:5

___

### Address

Ƭ **Address**: [`Address`](index.md#address)

An ethereum address represented as a hex string

**`See`**

https://abitype.dev/config#addresstype for configuration options to change type to being a string if preferred

#### Defined in

evmts-monorepo/packages/actions-types/types/common/Address.d.ts:6

___

### AnvilDropTransactionHandler

Ƭ **AnvilDropTransactionHandler**: (`params`: [`AnvilDropTransactionParams`](actions_types.md#anvildroptransactionparams)) => `Promise`\<[`AnvilDropTransactionResult`](actions_types.md#anvildroptransactionresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilDropTransactionResult`](actions_types.md#anvildroptransactionresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilDropTransactionParams`](actions_types.md#anvildroptransactionparams) |

##### Returns

`Promise`\<[`AnvilDropTransactionResult`](actions_types.md#anvildroptransactionresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/AnvilHandler.d.ts:8

___

### AnvilDropTransactionParams

Ƭ **AnvilDropTransactionParams**: `Object`

Params for `anvil_dropTransaction` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactionHash` | [`Hex`](actions_types.md#hex) | The transaction hash |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/AnvilParams.d.ts:62

___

### AnvilDropTransactionResult

Ƭ **AnvilDropTransactionResult**: ``null``

#### Defined in

evmts-monorepo/packages/actions-types/types/result/AnvilResult.d.ts:7

___

### AnvilDumpStateHandler

Ƭ **AnvilDumpStateHandler**: (`params`: [`AnvilDumpStateParams`](actions_types.md#anvildumpstateparams)) => `Promise`\<[`AnvilDumpStateResult`](actions_types.md#anvildumpstateresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilDumpStateResult`](actions_types.md#anvildumpstateresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilDumpStateParams`](actions_types.md#anvildumpstateparams) |

##### Returns

`Promise`\<[`AnvilDumpStateResult`](actions_types.md#anvildumpstateresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/AnvilHandler.d.ts:14

___

### AnvilDumpStateParams

Ƭ **AnvilDumpStateParams**: {} \| `undefined` \| `never`

Params for `anvil_dumpState` handler

#### Defined in

evmts-monorepo/packages/actions-types/types/params/AnvilParams.d.ts:136

___

### AnvilDumpStateResult

Ƭ **AnvilDumpStateResult**: [`Hex`](actions_types.md#hex)

#### Defined in

evmts-monorepo/packages/actions-types/types/result/AnvilResult.d.ts:13

___

### AnvilGetAutomineHandler

Ƭ **AnvilGetAutomineHandler**: (`params`: [`AnvilGetAutomineParams`](actions_types.md#anvilgetautomineparams)) => `Promise`\<[`AnvilGetAutomineResult`](actions_types.md#anvilgetautomineresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilGetAutomineResult`](actions_types.md#anvilgetautomineresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilGetAutomineParams`](actions_types.md#anvilgetautomineparams) |

##### Returns

`Promise`\<[`AnvilGetAutomineResult`](actions_types.md#anvilgetautomineresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/AnvilHandler.d.ts:5

___

### AnvilGetAutomineParams

Ƭ **AnvilGetAutomineParams**: {} \| `undefined` \| `never`

Params for `anvil_getAutomine` handler

#### Defined in

evmts-monorepo/packages/actions-types/types/params/AnvilParams.d.ts:30

___

### AnvilGetAutomineResult

Ƭ **AnvilGetAutomineResult**: `boolean`

#### Defined in

evmts-monorepo/packages/actions-types/types/result/AnvilResult.d.ts:4

___

### AnvilImpersonateAccountHandler

Ƭ **AnvilImpersonateAccountHandler**: (`params`: [`AnvilImpersonateAccountParams`](actions_types.md#anvilimpersonateaccountparams)) => `Promise`\<[`AnvilImpersonateAccountResult`](actions_types.md#anvilimpersonateaccountresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilImpersonateAccountResult`](actions_types.md#anvilimpersonateaccountresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilImpersonateAccountParams`](actions_types.md#anvilimpersonateaccountparams) |

##### Returns

`Promise`\<[`AnvilImpersonateAccountResult`](actions_types.md#anvilimpersonateaccountresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/AnvilHandler.d.ts:3

___

### AnvilImpersonateAccountParams

Ƭ **AnvilImpersonateAccountParams**: `Object`

Params fro `anvil_impersonateAccount` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`Address`](actions_types.md#address) | The address to impersonate |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/AnvilParams.d.ts:8

___

### AnvilImpersonateAccountResult

Ƭ **AnvilImpersonateAccountResult**: ``null``

#### Defined in

evmts-monorepo/packages/actions-types/types/result/AnvilResult.d.ts:2

___

### AnvilLoadStateHandler

Ƭ **AnvilLoadStateHandler**: (`params`: [`AnvilLoadStateParams`](actions_types.md#anvilloadstateparams)) => `Promise`\<[`AnvilLoadStateResult`](actions_types.md#anvilloadstateresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilLoadStateResult`](actions_types.md#anvilloadstateresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilLoadStateParams`](actions_types.md#anvilloadstateparams) |

##### Returns

`Promise`\<[`AnvilLoadStateResult`](actions_types.md#anvilloadstateresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/AnvilHandler.d.ts:15

___

### AnvilLoadStateParams

Ƭ **AnvilLoadStateParams**: `Object`

Params for `anvil_loadState` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | `Record`\<[`Hex`](actions_types.md#hex), [`Hex`](actions_types.md#hex)\> | The state to load |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/AnvilParams.d.ts:140

___

### AnvilLoadStateResult

Ƭ **AnvilLoadStateResult**: ``null``

#### Defined in

evmts-monorepo/packages/actions-types/types/result/AnvilResult.d.ts:14

___

### AnvilMineHandler

Ƭ **AnvilMineHandler**: (`params`: [`AnvilMineParams`](actions_types.md#anvilmineparams)) => `Promise`\<[`AnvilMineResult`](actions_types.md#anvilmineresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilMineResult`](actions_types.md#anvilmineresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilMineParams`](actions_types.md#anvilmineparams) |

##### Returns

`Promise`\<[`AnvilMineResult`](actions_types.md#anvilmineresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/AnvilHandler.d.ts:6

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

evmts-monorepo/packages/actions-types/types/params/AnvilParams.d.ts:34

___

### AnvilMineResult

Ƭ **AnvilMineResult**: ``null``

#### Defined in

evmts-monorepo/packages/actions-types/types/result/AnvilResult.d.ts:5

___

### AnvilResetHandler

Ƭ **AnvilResetHandler**: (`params`: [`AnvilResetParams`](actions_types.md#anvilresetparams)) => `Promise`\<[`AnvilResetResult`](actions_types.md#anvilresetresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilResetResult`](actions_types.md#anvilresetresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilResetParams`](actions_types.md#anvilresetparams) |

##### Returns

`Promise`\<[`AnvilResetResult`](actions_types.md#anvilresetresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/AnvilHandler.d.ts:7

___

### AnvilResetParams

Ƭ **AnvilResetParams**: `Object`

Params for `anvil_reset` handler

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fork` | \{ `block?`: [`BlockTag`](actions_types.md#blocktag) \| [`Hex`](actions_types.md#hex) \| `BigInt` ; `url?`: `string`  } |
| `fork.block?` | [`BlockTag`](actions_types.md#blocktag) \| [`Hex`](actions_types.md#hex) \| `BigInt` |
| `fork.url?` | `string` |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/AnvilParams.d.ts:47

___

### AnvilResetResult

Ƭ **AnvilResetResult**: ``null``

#### Defined in

evmts-monorepo/packages/actions-types/types/result/AnvilResult.d.ts:6

___

### AnvilSetBalanceHandler

Ƭ **AnvilSetBalanceHandler**: (`params`: [`AnvilSetBalanceParams`](actions_types.md#anvilsetbalanceparams)) => `Promise`\<[`AnvilSetBalanceResult`](actions_types.md#anvilsetbalanceresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilSetBalanceResult`](actions_types.md#anvilsetbalanceresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilSetBalanceParams`](actions_types.md#anvilsetbalanceparams) |

##### Returns

`Promise`\<[`AnvilSetBalanceResult`](actions_types.md#anvilsetbalanceresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/AnvilHandler.d.ts:9

___

### AnvilSetBalanceParams

Ƭ **AnvilSetBalanceParams**: `Object`

Params for `anvil_setBalance` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`Address`](actions_types.md#address) | The address to set the balance for |
| `balance` | [`Hex`](actions_types.md#hex) \| `BigInt` | The balance to set |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/AnvilParams.d.ts:71

___

### AnvilSetBalanceResult

Ƭ **AnvilSetBalanceResult**: ``null``

#### Defined in

evmts-monorepo/packages/actions-types/types/result/AnvilResult.d.ts:8

___

### AnvilSetChainIdHandler

Ƭ **AnvilSetChainIdHandler**: (`params`: [`AnvilSetChainIdParams`](actions_types.md#anvilsetchainidparams)) => `Promise`\<[`AnvilSetChainIdResult`](actions_types.md#anvilsetchainidresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilSetChainIdResult`](actions_types.md#anvilsetchainidresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilSetChainIdParams`](actions_types.md#anvilsetchainidparams) |

##### Returns

`Promise`\<[`AnvilSetChainIdResult`](actions_types.md#anvilsetchainidresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/AnvilHandler.d.ts:13

___

### AnvilSetChainIdParams

Ƭ **AnvilSetChainIdParams**: `Object`

Params for `anvil_setChainId` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `chainId` | `number` | The chain id to set |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/AnvilParams.d.ts:127

___

### AnvilSetChainIdResult

Ƭ **AnvilSetChainIdResult**: ``null``

#### Defined in

evmts-monorepo/packages/actions-types/types/result/AnvilResult.d.ts:12

___

### AnvilSetCodeHandler

Ƭ **AnvilSetCodeHandler**: (`params`: [`AnvilSetCodeParams`](actions_types.md#anvilsetcodeparams)) => `Promise`\<[`AnvilSetCodeResult`](actions_types.md#anvilsetcoderesult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilSetCodeResult`](actions_types.md#anvilsetcoderesult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilSetCodeParams`](actions_types.md#anvilsetcodeparams) |

##### Returns

`Promise`\<[`AnvilSetCodeResult`](actions_types.md#anvilsetcoderesult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/AnvilHandler.d.ts:10

___

### AnvilSetCodeParams

Ƭ **AnvilSetCodeParams**: `Object`

Params for `anvil_setCode` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`Address`](actions_types.md#address) | The address to set the code for |
| `code` | [`Hex`](actions_types.md#hex) | The code to set |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/AnvilParams.d.ts:84

___

### AnvilSetCodeResult

Ƭ **AnvilSetCodeResult**: ``null``

#### Defined in

evmts-monorepo/packages/actions-types/types/result/AnvilResult.d.ts:9

___

### AnvilSetNonceHandler

Ƭ **AnvilSetNonceHandler**: (`params`: [`AnvilSetNonceParams`](actions_types.md#anvilsetnonceparams)) => `Promise`\<[`AnvilSetNonceResult`](actions_types.md#anvilsetnonceresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilSetNonceResult`](actions_types.md#anvilsetnonceresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilSetNonceParams`](actions_types.md#anvilsetnonceparams) |

##### Returns

`Promise`\<[`AnvilSetNonceResult`](actions_types.md#anvilsetnonceresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/AnvilHandler.d.ts:11

___

### AnvilSetNonceParams

Ƭ **AnvilSetNonceParams**: `Object`

Params for `anvil_setNonce` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`Address`](actions_types.md#address) | The address to set the nonce for |
| `nonce` | `BigInt` | The nonce to set |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/AnvilParams.d.ts:97

___

### AnvilSetNonceResult

Ƭ **AnvilSetNonceResult**: ``null``

#### Defined in

evmts-monorepo/packages/actions-types/types/result/AnvilResult.d.ts:10

___

### AnvilSetStorageAtHandler

Ƭ **AnvilSetStorageAtHandler**: (`params`: [`AnvilSetStorageAtParams`](actions_types.md#anvilsetstorageatparams)) => `Promise`\<[`AnvilSetStorageAtResult`](actions_types.md#anvilsetstorageatresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilSetStorageAtResult`](actions_types.md#anvilsetstorageatresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilSetStorageAtParams`](actions_types.md#anvilsetstorageatparams) |

##### Returns

`Promise`\<[`AnvilSetStorageAtResult`](actions_types.md#anvilsetstorageatresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/AnvilHandler.d.ts:12

___

### AnvilSetStorageAtParams

Ƭ **AnvilSetStorageAtParams**: `Object`

Params for `anvil_setStorageAt` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`Address`](actions_types.md#address) | The address to set the storage for |
| `position` | [`Hex`](actions_types.md#hex) \| `BigInt` | The position in storage to set |
| `value` | [`Hex`](actions_types.md#hex) \| `BigInt` | The value to set |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/AnvilParams.d.ts:110

___

### AnvilSetStorageAtResult

Ƭ **AnvilSetStorageAtResult**: ``null``

#### Defined in

evmts-monorepo/packages/actions-types/types/result/AnvilResult.d.ts:11

___

### AnvilStopImpersonatingAccountHandler

Ƭ **AnvilStopImpersonatingAccountHandler**: (`params`: [`AnvilStopImpersonatingAccountParams`](actions_types.md#anvilstopimpersonatingaccountparams)) => `Promise`\<[`AnvilStopImpersonatingAccountResult`](actions_types.md#anvilstopimpersonatingaccountresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilStopImpersonatingAccountResult`](actions_types.md#anvilstopimpersonatingaccountresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilStopImpersonatingAccountParams`](actions_types.md#anvilstopimpersonatingaccountparams) |

##### Returns

`Promise`\<[`AnvilStopImpersonatingAccountResult`](actions_types.md#anvilstopimpersonatingaccountresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/AnvilHandler.d.ts:4

___

### AnvilStopImpersonatingAccountParams

Ƭ **AnvilStopImpersonatingAccountParams**: `Object`

Params for `anvil_stopImpersonatingAccount` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`Address`](actions_types.md#address) | The address to stop impersonating |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/AnvilParams.d.ts:17

___

### AnvilStopImpersonatingAccountResult

Ƭ **AnvilStopImpersonatingAccountResult**: ``null``

#### Defined in

evmts-monorepo/packages/actions-types/types/result/AnvilResult.d.ts:3

___

### BaseCallParams

Ƭ **BaseCallParams**\<`TThrowOnFail`\>: `BaseParams`\<`TThrowOnFail`\> & \{ `blobVersionedHashes?`: [`Hex`](actions_types.md#hex)[] ; `blockTag?`: [`BlockParam`](index.md#blockparam) ; `caller?`: [`Address`](actions_types.md#address) ; `createTransaction?`: `boolean` ; `depth?`: `number` ; `from?`: [`Address`](actions_types.md#address) ; `gas?`: `bigint` ; `gasPrice?`: `bigint` ; `gasRefund?`: `bigint` ; `origin?`: [`Address`](actions_types.md#address) ; `selfdestruct?`: `Set`\<[`Address`](actions_types.md#address)\> ; `skipBalance?`: `boolean` ; `to?`: [`Address`](actions_types.md#address) ; `value?`: `bigint`  }

Properties shared accross call-like params

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TThrowOnFail` | extends `boolean` = `boolean` |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/BaseCallParams.d.ts:6

___

### Block

Ƭ **Block**: `Object`

Header information of an ethereum block

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseFeePerGas?` | `bigint` | (Optional) The base fee per gas in the block, introduced in EIP-1559 for dynamic transaction fee calculation. |
| `blobGasPrice?` | `bigint` | The gas price for the block; may be undefined in blocks after EIP-1559. |
| `coinbase` | [`Address`](actions_types.md#address) | The address of the miner or validator who mined or validated the block. |
| `difficulty` | `bigint` | The difficulty level of the block (relevant in PoW chains). |
| `gasLimit` | `bigint` | The gas limit for the block, i.e., the maximum amount of gas that can be used by the transactions in the block. |
| `number` | `bigint` | The block number (height) in the blockchain. |
| `timestamp` | `bigint` | The timestamp at which the block was mined or validated. |

#### Defined in

evmts-monorepo/packages/actions-types/types/common/Block.d.ts:5

___

### BlockResult

Ƭ **BlockResult**: `Object`

The type returned by block related
json rpc procedures

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `difficulty` | [`Hex`](actions_types.md#hex) | - |
| `extraData` | [`Hex`](actions_types.md#hex) | - |
| `gasLimit` | [`Hex`](actions_types.md#hex) | - |
| `gasUsed` | [`Hex`](actions_types.md#hex) | - |
| `hash` | [`Hex`](actions_types.md#hex) | The hex stringhash of the block. |
| `logsBloom` | [`Hex`](actions_types.md#hex) | - |
| `miner` | [`Hex`](actions_types.md#hex) | - |
| `nonce` | [`Hex`](actions_types.md#hex) | - |
| `number` | [`Hex`](actions_types.md#hex) | The block number (height) in the blockchain. |
| `parentHash` | [`Hex`](actions_types.md#hex) | The hex stringhash of the parent block. |
| `sha3Uncles` | [`Hex`](actions_types.md#hex) | The hex stringhash of the uncles of the block. |
| `size` | [`Hex`](actions_types.md#hex) | - |
| `stateRoot` | [`Hex`](actions_types.md#hex) | - |
| `timestamp` | [`Hex`](actions_types.md#hex) | - |
| `totalDifficulty` | [`Hex`](actions_types.md#hex) | - |
| `transactions` | [`Hex`](actions_types.md#hex)[] | - |
| `transactionsRoot` | [`Hex`](actions_types.md#hex) | - |
| `uncles` | [`Hex`](actions_types.md#hex)[] | - |

#### Defined in

evmts-monorepo/packages/actions-types/types/common/BlockResult.d.ts:6

___

### BlockTag

Ƭ **BlockTag**: ``"latest"`` \| ``"earliest"`` \| ``"pending"`` \| ``"safe"`` \| ``"finalized"``

#### Defined in

evmts-monorepo/packages/actions-types/types/common/BlockTag.d.ts:1

___

### CallHandler

Ƭ **CallHandler**: (`action`: [`CallParams`](index.md#callparams)) => `Promise`\<[`CallResult`](index.md#callresult)\>

Executes a call against the VM. It is similar to `eth_call` but has more
options for controlling the execution environment

See `contract` and `script` which executes calls specifically against deployed contracts
or undeployed scripts

**`Example`**

```ts
const res = tevm.call({
to: '0x123...',
data: '0x123...',
from: '0x123...',
gas: 1000000,
gasPrice: 1n,
skipBalance: true,
}
```

#### Type declaration

▸ (`action`): `Promise`\<[`CallResult`](index.md#callresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `action` | [`CallParams`](index.md#callparams) |

##### Returns

`Promise`\<[`CallResult`](index.md#callresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/CallHandler.d.ts:19

___

### ContractHandler

Ƭ **ContractHandler**: \<TAbi, TFunctionName\>(`action`: [`ContractParams`](index.md#contractparams)\<`TAbi`, `TFunctionName`\>) => `Promise`\<[`ContractResult`](index.md#contractresult)\<`TAbi`, `TFunctionName`\>\>

Handler for contract tevm procedure
It's API resuses the viem `contractRead`/`contractWrite` API to encode abi, functionName, and args

#### Type declaration

▸ \<`TAbi`, `TFunctionName`\>(`action`): `Promise`\<[`ContractResult`](index.md#contractresult)\<`TAbi`, `TFunctionName`\>\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends [`Abi`](index.md#abi) \| readonly `unknown`[] = [`Abi`](index.md#abi) |
| `TFunctionName` | extends [`ContractFunctionName`](index.md#contractfunctionname)\<`TAbi`\> = [`ContractFunctionName`](index.md#contractfunctionname)\<`TAbi`\> |

##### Parameters

| Name | Type |
| :------ | :------ |
| `action` | [`ContractParams`](index.md#contractparams)\<`TAbi`, `TFunctionName`\> |

##### Returns

`Promise`\<[`ContractResult`](index.md#contractresult)\<`TAbi`, `TFunctionName`\>\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/ContractHandler.d.ts:8

___

### DebugTraceCallHandler

Ƭ **DebugTraceCallHandler**: (`params`: [`DebugTraceCallParams`](actions_types.md#debugtracecallparams)) => `Promise`\<[`DebugTraceCallResult`](actions_types.md#debugtracecallresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`DebugTraceCallResult`](actions_types.md#debugtracecallresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`DebugTraceCallParams`](actions_types.md#debugtracecallparams) |

##### Returns

`Promise`\<[`DebugTraceCallResult`](actions_types.md#debugtracecallresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/DebugHandler.d.ts:4

___

### DebugTraceCallParams

Ƭ **DebugTraceCallParams**: [`TraceParams`](index.md#traceparams) & [`EthCallParams`](actions_types.md#ethcallparams)

Params taken by `debug_traceCall` handler

#### Defined in

evmts-monorepo/packages/actions-types/types/params/DebugParams.d.ts:35

___

### DebugTraceCallResult

Ƭ **DebugTraceCallResult**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `failed` | `boolean` |
| `gas` | `bigint` |
| `returnValue` | [`Hex`](actions_types.md#hex) |
| `structLogs` | `ReadonlyArray`\<[`StructLog`](actions_types.md#structlog)\> |

#### Defined in

evmts-monorepo/packages/actions-types/types/result/DebugResult.d.ts:12

___

### DebugTraceTransactionHandler

Ƭ **DebugTraceTransactionHandler**: (`params`: [`DebugTraceTransactionParams`](actions_types.md#debugtracetransactionparams)\<`boolean`\>) => `Promise`\<[`DebugTraceTransactionResult`](actions_types.md#debugtracetransactionresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`DebugTraceTransactionResult`](actions_types.md#debugtracetransactionresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`DebugTraceTransactionParams`](actions_types.md#debugtracetransactionparams)\<`boolean`\> |

##### Returns

`Promise`\<[`DebugTraceTransactionResult`](actions_types.md#debugtracetransactionresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/DebugHandler.d.ts:3

___

### DebugTraceTransactionParams

Ƭ **DebugTraceTransactionParams**\<`TThrowOnError`\>: `BaseParams`\<`TThrowOnError`\> & [`TraceParams`](index.md#traceparams) & \{ `transactionHash`: [`Hex`](actions_types.md#hex)  }

Params taken by `debug_traceTransaction` handler

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TThrowOnError` | extends `boolean` = `boolean` |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/DebugParams.d.ts:26

___

### DebugTraceTransactionResult

Ƭ **DebugTraceTransactionResult**: [`TraceResult`](index.md#traceresult)

#### Defined in

evmts-monorepo/packages/actions-types/types/result/DebugResult.d.ts:11

___

### DumpStateHandler

Ƭ **DumpStateHandler**: (`params?`: `BaseParams`) => `Promise`\<[`DumpStateResult`](actions_types.md#dumpstateresult)\>

Dumps the current state of the VM into a JSON-seralizable object

State can be dumped as follows

**`Example`**

```typescript
const {state} = await tevm.dumpState()
fs.writeFileSync('state.json', JSON.stringify(state))
```

And then loaded as follows

**`Example`**

```typescript
const state = JSON.parse(fs.readFileSync('state.json'))
await tevm.loadState({state})
```

#### Type declaration

▸ (`params?`): `Promise`\<[`DumpStateResult`](actions_types.md#dumpstateresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `BaseParams` |

##### Returns

`Promise`\<[`DumpStateResult`](actions_types.md#dumpstateresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/DumpStateHandler.d.ts:20

___

### DumpStateResult

Ƭ **DumpStateResult**\<`ErrorType`\>: `Object`

Result of the dumpState method

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ErrorType` | [`DumpStateError`](errors.md#dumpstateerror) |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `errors?` | `ErrorType`[] | Description of the exception, if any occurred |
| `state` | [`SerializableTevmState`](index.md#serializabletevmstate) | The serialized tevm state |

#### Defined in

evmts-monorepo/packages/actions-types/types/result/DumpStateResult.d.ts:6

___

### EmptyParams

Ƭ **EmptyParams**: readonly [] \| {} \| `undefined` \| `never`

#### Defined in

evmts-monorepo/packages/actions-types/types/common/EmptyParams.d.ts:1

___

### EthAccountsHandler

Ƭ **EthAccountsHandler**: (`request?`: [`EthAccountsParams`](actions_types.md#ethaccountsparams)) => `Promise`\<[`EthAccountsResult`](actions_types.md#ethaccountsresult)\>

#### Type declaration

▸ (`request?`): `Promise`\<[`EthAccountsResult`](actions_types.md#ethaccountsresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request?` | [`EthAccountsParams`](actions_types.md#ethaccountsparams) |

##### Returns

`Promise`\<[`EthAccountsResult`](actions_types.md#ethaccountsresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:3

___

### EthAccountsParams

Ƭ **EthAccountsParams**: [`EmptyParams`](actions_types.md#emptyparams)

Params taken by `eth_accounts` handler (no params)

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:6

___

### EthAccountsResult

Ƭ **EthAccountsResult**: [`Address`](actions_types.md#address)[]

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:11

___

### EthBlockNumberHandler

Ƭ **EthBlockNumberHandler**: (`request?`: [`EthBlockNumberParams`](actions_types.md#ethblocknumberparams)) => `Promise`\<[`EthBlockNumberResult`](actions_types.md#ethblocknumberresult)\>

#### Type declaration

▸ (`request?`): `Promise`\<[`EthBlockNumberResult`](actions_types.md#ethblocknumberresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request?` | [`EthBlockNumberParams`](actions_types.md#ethblocknumberparams) |

##### Returns

`Promise`\<[`EthBlockNumberResult`](actions_types.md#ethblocknumberresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:4

___

### EthBlockNumberParams

Ƭ **EthBlockNumberParams**: [`EmptyParams`](actions_types.md#emptyparams)

Based on the JSON-RPC request for `eth_blockNumber` procedure (no params)

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:10

___

### EthBlockNumberResult

Ƭ **EthBlockNumberResult**: `bigint`

JSON-RPC response for `eth_blockNumber` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:15

___

### EthCallHandler

Ƭ **EthCallHandler**: (`request`: [`EthCallParams`](actions_types.md#ethcallparams)) => `Promise`\<[`EthCallResult`](actions_types.md#ethcallresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthCallResult`](actions_types.md#ethcallresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthCallParams`](actions_types.md#ethcallparams) |

##### Returns

`Promise`\<[`EthCallResult`](actions_types.md#ethcallresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:5

___

### EthCallParams

Ƭ **EthCallParams**: `Object`

Based on the JSON-RPC request for `eth_call` procedure

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockTag?` | [`BlockParam`](index.md#blockparam) | The block number hash or block tag |
| `data?` | [`Hex`](actions_types.md#hex) | The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation Defaults to zero data |
| `from?` | [`Address`](actions_types.md#address) | The address from which the transaction is sent. Defaults to zero address |
| `gas?` | `bigint` | The integer of gas provided for the transaction execution |
| `gasPrice?` | `bigint` | The integer of gasPrice used for each paid gas |
| `to?` | [`Address`](actions_types.md#address) | The address to which the transaction is addressed. Defaults to zero address |
| `value?` | `bigint` | The integer of value sent with this transaction |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:14

___

### EthCallResult

Ƭ **EthCallResult**: [`Hex`](actions_types.md#hex)

JSON-RPC response for `eth_call` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:19

___

### EthChainIdHandler

Ƭ **EthChainIdHandler**: (`request?`: [`EthChainIdParams`](actions_types.md#ethchainidparams)) => `Promise`\<[`EthChainIdResult`](actions_types.md#ethchainidresult)\>

#### Type declaration

▸ (`request?`): `Promise`\<[`EthChainIdResult`](actions_types.md#ethchainidresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request?` | [`EthChainIdParams`](actions_types.md#ethchainidparams) |

##### Returns

`Promise`\<[`EthChainIdResult`](actions_types.md#ethchainidresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:6

___

### EthChainIdParams

Ƭ **EthChainIdParams**: [`EmptyParams`](actions_types.md#emptyparams)

Based on the JSON-RPC request for `eth_chainId` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:48

___

### EthChainIdResult

Ƭ **EthChainIdResult**: `bigint`

JSON-RPC response for `eth_chainId` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:23

___

### EthCoinbaseHandler

Ƭ **EthCoinbaseHandler**: (`request`: [`EthCoinbaseParams`](actions_types.md#ethcoinbaseparams)) => `Promise`\<[`EthCoinbaseResult`](actions_types.md#ethcoinbaseresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthCoinbaseResult`](actions_types.md#ethcoinbaseresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthCoinbaseParams`](actions_types.md#ethcoinbaseparams) |

##### Returns

`Promise`\<[`EthCoinbaseResult`](actions_types.md#ethcoinbaseresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:7

___

### EthCoinbaseParams

Ƭ **EthCoinbaseParams**: [`EmptyParams`](actions_types.md#emptyparams)

Based on the JSON-RPC request for `eth_coinbase` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:52

___

### EthCoinbaseResult

Ƭ **EthCoinbaseResult**: [`Address`](actions_types.md#address)

JSON-RPC response for `eth_coinbase` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:27

___

### EthEstimateGasHandler

Ƭ **EthEstimateGasHandler**: (`request`: [`EthEstimateGasParams`](actions_types.md#ethestimategasparams)) => `Promise`\<[`EthEstimateGasResult`](actions_types.md#ethestimategasresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthEstimateGasResult`](actions_types.md#ethestimategasresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthEstimateGasParams`](actions_types.md#ethestimategasparams) |

##### Returns

`Promise`\<[`EthEstimateGasResult`](actions_types.md#ethestimategasresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:8

___

### EthEstimateGasParams

Ƭ **EthEstimateGasParams**: [`CallParams`](index.md#callparams)

Based on the JSON-RPC request for `eth_estimateGas` procedure
This type is a placeholder

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:57

___

### EthEstimateGasResult

Ƭ **EthEstimateGasResult**: `bigint`

JSON-RPC response for `eth_estimateGas` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:31

___

### EthGasPriceHandler

Ƭ **EthGasPriceHandler**: (`request?`: [`EthGasPriceParams`](actions_types.md#ethgaspriceparams)) => `Promise`\<[`EthGasPriceResult`](actions_types.md#ethgaspriceresult)\>

#### Type declaration

▸ (`request?`): `Promise`\<[`EthGasPriceResult`](actions_types.md#ethgaspriceresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request?` | [`EthGasPriceParams`](actions_types.md#ethgaspriceparams) |

##### Returns

`Promise`\<[`EthGasPriceResult`](actions_types.md#ethgaspriceresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:10

___

### EthGasPriceParams

Ƭ **EthGasPriceParams**: [`EmptyParams`](actions_types.md#emptyparams)

Based on the JSON-RPC request for `eth_gasPrice` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:65

___

### EthGasPriceResult

Ƭ **EthGasPriceResult**: `bigint`

JSON-RPC response for `eth_gasPrice` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:39

___

### EthGetBalanceHandler

Ƭ **EthGetBalanceHandler**: (`request`: [`EthGetBalanceParams`](actions_types.md#ethgetbalanceparams)) => `Promise`\<[`EthGetBalanceResult`](actions_types.md#ethgetbalanceresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBalanceResult`](actions_types.md#ethgetbalanceresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBalanceParams`](actions_types.md#ethgetbalanceparams) |

##### Returns

`Promise`\<[`EthGetBalanceResult`](actions_types.md#ethgetbalanceresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:11

___

### EthGetBalanceParams

Ƭ **EthGetBalanceParams**: `Object`

Based on the  JSON-RPC request for `eth_getBalance` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | [`Address`](actions_types.md#address) |
| `blockTag?` | [`BlockParam`](index.md#blockparam) |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:69

___

### EthGetBalanceResult

Ƭ **EthGetBalanceResult**: `bigint`

JSON-RPC response for `eth_getBalance` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:43

___

### EthGetBlockByHashHandler

Ƭ **EthGetBlockByHashHandler**: (`request`: [`EthGetBlockByHashParams`](actions_types.md#ethgetblockbyhashparams)) => `Promise`\<[`EthGetBlockByHashResult`](actions_types.md#ethgetblockbyhashresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBlockByHashResult`](actions_types.md#ethgetblockbyhashresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBlockByHashParams`](actions_types.md#ethgetblockbyhashparams) |

##### Returns

`Promise`\<[`EthGetBlockByHashResult`](actions_types.md#ethgetblockbyhashresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:12

___

### EthGetBlockByHashParams

Ƭ **EthGetBlockByHashParams**: `Object`

Based on the JSON-RPC request for `eth_getBlockByHash` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockHash` | [`Hex`](actions_types.md#hex) |
| `fullTransactionObjects` | `boolean` |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:76

___

### EthGetBlockByHashResult

Ƭ **EthGetBlockByHashResult**: [`BlockResult`](actions_types.md#blockresult)

JSON-RPC response for `eth_getBlockByHash` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:47

___

### EthGetBlockByNumberHandler

Ƭ **EthGetBlockByNumberHandler**: (`request`: [`EthGetBlockByNumberParams`](actions_types.md#ethgetblockbynumberparams)) => `Promise`\<[`EthGetBlockByNumberResult`](actions_types.md#ethgetblockbynumberresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBlockByNumberResult`](actions_types.md#ethgetblockbynumberresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBlockByNumberParams`](actions_types.md#ethgetblockbynumberparams) |

##### Returns

`Promise`\<[`EthGetBlockByNumberResult`](actions_types.md#ethgetblockbynumberresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:13

___

### EthGetBlockByNumberParams

Ƭ **EthGetBlockByNumberParams**: `Object`

Based on the JSON-RPC request for `eth_getBlockByNumber` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockTag?` | [`BlockParam`](index.md#blockparam) |
| `fullTransactionObjects` | `boolean` |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:83

___

### EthGetBlockByNumberResult

Ƭ **EthGetBlockByNumberResult**: [`BlockResult`](actions_types.md#blockresult)

JSON-RPC response for `eth_getBlockByNumber` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:51

___

### EthGetBlockTransactionCountByHashHandler

Ƭ **EthGetBlockTransactionCountByHashHandler**: (`request`: [`EthGetBlockTransactionCountByHashParams`](actions_types.md#ethgetblocktransactioncountbyhashparams)) => `Promise`\<[`EthGetBlockTransactionCountByHashResult`](actions_types.md#ethgetblocktransactioncountbyhashresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBlockTransactionCountByHashResult`](actions_types.md#ethgetblocktransactioncountbyhashresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBlockTransactionCountByHashParams`](actions_types.md#ethgetblocktransactioncountbyhashparams) |

##### Returns

`Promise`\<[`EthGetBlockTransactionCountByHashResult`](actions_types.md#ethgetblocktransactioncountbyhashresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:14

___

### EthGetBlockTransactionCountByHashParams

Ƭ **EthGetBlockTransactionCountByHashParams**: `Object`

Based on the JSON-RPC request for `eth_getBlockTransactionCountByHash` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `hash` | [`Hex`](actions_types.md#hex) |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:90

___

### EthGetBlockTransactionCountByHashResult

Ƭ **EthGetBlockTransactionCountByHashResult**: [`Hex`](actions_types.md#hex)

JSON-RPC response for `eth_getBlockTransactionCountByHash` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:55

___

### EthGetBlockTransactionCountByNumberHandler

Ƭ **EthGetBlockTransactionCountByNumberHandler**: (`request`: [`EthGetBlockTransactionCountByNumberParams`](actions_types.md#ethgetblocktransactioncountbynumberparams)) => `Promise`\<[`EthGetBlockTransactionCountByNumberResult`](actions_types.md#ethgetblocktransactioncountbynumberresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetBlockTransactionCountByNumberResult`](actions_types.md#ethgetblocktransactioncountbynumberresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetBlockTransactionCountByNumberParams`](actions_types.md#ethgetblocktransactioncountbynumberparams) |

##### Returns

`Promise`\<[`EthGetBlockTransactionCountByNumberResult`](actions_types.md#ethgetblocktransactioncountbynumberresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:15

___

### EthGetBlockTransactionCountByNumberParams

Ƭ **EthGetBlockTransactionCountByNumberParams**: `Object`

Based on the JSON-RPC request for `eth_getBlockTransactionCountByNumber` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockTag?` | [`BlockParam`](index.md#blockparam) |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:96

___

### EthGetBlockTransactionCountByNumberResult

Ƭ **EthGetBlockTransactionCountByNumberResult**: [`Hex`](actions_types.md#hex)

JSON-RPC response for `eth_getBlockTransactionCountByNumber` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:59

___

### EthGetCodeHandler

Ƭ **EthGetCodeHandler**: (`request`: [`EthGetCodeParams`](actions_types.md#ethgetcodeparams)) => `Promise`\<[`EthGetCodeResult`](actions_types.md#ethgetcoderesult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetCodeResult`](actions_types.md#ethgetcoderesult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetCodeParams`](actions_types.md#ethgetcodeparams) |

##### Returns

`Promise`\<[`EthGetCodeResult`](actions_types.md#ethgetcoderesult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:16

___

### EthGetCodeParams

Ƭ **EthGetCodeParams**: `Object`

Based on the JSON-RPC request for `eth_getCode` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | [`Address`](actions_types.md#address) |
| `blockTag?` | [`BlockParam`](index.md#blockparam) |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:102

___

### EthGetCodeResult

Ƭ **EthGetCodeResult**: [`Hex`](actions_types.md#hex)

JSON-RPC response for `eth_getCode` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:63

___

### EthGetFilterChangesHandler

Ƭ **EthGetFilterChangesHandler**: (`request`: [`EthGetFilterChangesParams`](actions_types.md#ethgetfilterchangesparams)) => `Promise`\<[`EthGetFilterChangesResult`](actions_types.md#ethgetfilterchangesresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetFilterChangesResult`](actions_types.md#ethgetfilterchangesresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetFilterChangesParams`](actions_types.md#ethgetfilterchangesparams) |

##### Returns

`Promise`\<[`EthGetFilterChangesResult`](actions_types.md#ethgetfilterchangesresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:17

___

### EthGetFilterChangesParams

Ƭ **EthGetFilterChangesParams**: `Object`

Based on the JSON-RPC request for `eth_getFilterChanges` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `filterId` | [`Hex`](actions_types.md#hex) |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:109

___

### EthGetFilterChangesResult

Ƭ **EthGetFilterChangesResult**: [`FilterLog`](actions_types.md#filterlog)[]

JSON-RPC response for `eth_getFilterChanges` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:67

___

### EthGetFilterLogsHandler

Ƭ **EthGetFilterLogsHandler**: (`request`: [`EthGetFilterLogsParams`](actions_types.md#ethgetfilterlogsparams)) => `Promise`\<[`EthGetFilterLogsResult`](actions_types.md#ethgetfilterlogsresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetFilterLogsResult`](actions_types.md#ethgetfilterlogsresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetFilterLogsParams`](actions_types.md#ethgetfilterlogsparams) |

##### Returns

`Promise`\<[`EthGetFilterLogsResult`](actions_types.md#ethgetfilterlogsresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:18

___

### EthGetFilterLogsParams

Ƭ **EthGetFilterLogsParams**: `Object`

Based on the JSON-RPC request for `eth_getFilterLogs` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `filterId` | [`Hex`](actions_types.md#hex) |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:115

___

### EthGetFilterLogsResult

Ƭ **EthGetFilterLogsResult**: [`FilterLog`](actions_types.md#filterlog)[]

JSON-RPC response for `eth_getFilterLogs` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:71

___

### EthGetLogsHandler

Ƭ **EthGetLogsHandler**: (`request`: [`EthGetLogsParams`](actions_types.md#ethgetlogsparams)) => `Promise`\<[`EthGetLogsResult`](actions_types.md#ethgetlogsresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetLogsResult`](actions_types.md#ethgetlogsresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetLogsParams`](actions_types.md#ethgetlogsparams) |

##### Returns

`Promise`\<[`EthGetLogsResult`](actions_types.md#ethgetlogsresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:19

___

### EthGetLogsParams

Ƭ **EthGetLogsParams**: `Object`

Based on the JSON-RPC request for `eth_getLogs` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `filterParams` | [`FilterParams`](actions_types.md#filterparams) |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:121

___

### EthGetLogsResult

Ƭ **EthGetLogsResult**: [`FilterLog`](actions_types.md#filterlog)[]

JSON-RPC response for `eth_getLogs` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:75

___

### EthGetStorageAtHandler

Ƭ **EthGetStorageAtHandler**: (`request`: [`EthGetStorageAtParams`](actions_types.md#ethgetstorageatparams)) => `Promise`\<[`EthGetStorageAtResult`](actions_types.md#ethgetstorageatresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetStorageAtResult`](actions_types.md#ethgetstorageatresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetStorageAtParams`](actions_types.md#ethgetstorageatparams) |

##### Returns

`Promise`\<[`EthGetStorageAtResult`](actions_types.md#ethgetstorageatresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:20

___

### EthGetStorageAtParams

Ƭ **EthGetStorageAtParams**: `Object`

Based on the JSON-RPC request for `eth_getStorageAt` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | [`Address`](actions_types.md#address) |
| `blockTag?` | [`BlockParam`](index.md#blockparam) |
| `position` | [`Hex`](actions_types.md#hex) |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:127

___

### EthGetStorageAtResult

Ƭ **EthGetStorageAtResult**: [`Hex`](actions_types.md#hex)

JSON-RPC response for `eth_getStorageAt` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:79

___

### EthGetTransactionByBlockHashAndIndexHandler

Ƭ **EthGetTransactionByBlockHashAndIndexHandler**: (`request`: [`EthGetTransactionByBlockHashAndIndexParams`](actions_types.md#ethgettransactionbyblockhashandindexparams)) => `Promise`\<[`EthGetTransactionByBlockHashAndIndexResult`](actions_types.md#ethgettransactionbyblockhashandindexresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionByBlockHashAndIndexResult`](actions_types.md#ethgettransactionbyblockhashandindexresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionByBlockHashAndIndexParams`](actions_types.md#ethgettransactionbyblockhashandindexparams) |

##### Returns

`Promise`\<[`EthGetTransactionByBlockHashAndIndexResult`](actions_types.md#ethgettransactionbyblockhashandindexresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:25

___

### EthGetTransactionByBlockHashAndIndexParams

Ƭ **EthGetTransactionByBlockHashAndIndexParams**: `Object`

Based on the JSON-RPC request for `eth_getTransactionByBlockHashAndIndex` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockTag?` | [`Hex`](actions_types.md#hex) |
| `index` | [`Hex`](actions_types.md#hex) |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:160

___

### EthGetTransactionByBlockHashAndIndexResult

Ƭ **EthGetTransactionByBlockHashAndIndexResult**: [`TransactionResult`](actions_types.md#transactionresult)

JSON-RPC response for `eth_getTransactionByBlockHashAndIndex` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:99

___

### EthGetTransactionByBlockNumberAndIndexHandler

Ƭ **EthGetTransactionByBlockNumberAndIndexHandler**: (`request`: [`EthGetTransactionByBlockNumberAndIndexParams`](actions_types.md#ethgettransactionbyblocknumberandindexparams)) => `Promise`\<[`EthGetTransactionByBlockNumberAndIndexResult`](actions_types.md#ethgettransactionbyblocknumberandindexresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionByBlockNumberAndIndexResult`](actions_types.md#ethgettransactionbyblocknumberandindexresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionByBlockNumberAndIndexParams`](actions_types.md#ethgettransactionbyblocknumberandindexparams) |

##### Returns

`Promise`\<[`EthGetTransactionByBlockNumberAndIndexResult`](actions_types.md#ethgettransactionbyblocknumberandindexresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:26

___

### EthGetTransactionByBlockNumberAndIndexParams

Ƭ **EthGetTransactionByBlockNumberAndIndexParams**: `Object`

Based on the JSON-RPC request for `eth_getTransactionByBlockNumberAndIndex` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockTag?` | [`BlockParam`](index.md#blockparam) |
| `index` | [`Hex`](actions_types.md#hex) |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:167

___

### EthGetTransactionByBlockNumberAndIndexResult

Ƭ **EthGetTransactionByBlockNumberAndIndexResult**: [`TransactionResult`](actions_types.md#transactionresult)

JSON-RPC response for `eth_getTransactionByBlockNumberAndIndex` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:103

___

### EthGetTransactionByHashHandler

Ƭ **EthGetTransactionByHashHandler**: (`request`: [`EthGetTransactionByHashParams`](actions_types.md#ethgettransactionbyhashparams)) => `Promise`\<[`EthGetTransactionByHashResult`](actions_types.md#ethgettransactionbyhashresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionByHashResult`](actions_types.md#ethgettransactionbyhashresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionByHashParams`](actions_types.md#ethgettransactionbyhashparams) |

##### Returns

`Promise`\<[`EthGetTransactionByHashResult`](actions_types.md#ethgettransactionbyhashresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:24

___

### EthGetTransactionByHashParams

Ƭ **EthGetTransactionByHashParams**: `Object`

Based on the JSON-RPC request for `eth_getTransactionByHash` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | [`Hex`](actions_types.md#hex) |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:154

___

### EthGetTransactionByHashResult

Ƭ **EthGetTransactionByHashResult**: [`TransactionResult`](actions_types.md#transactionresult)

JSON-RPC response for `eth_getTransactionByHash` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:95

___

### EthGetTransactionCountHandler

Ƭ **EthGetTransactionCountHandler**: (`request`: [`EthGetTransactionCountParams`](actions_types.md#ethgettransactioncountparams)) => `Promise`\<[`EthGetTransactionCountResult`](actions_types.md#ethgettransactioncountresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionCountResult`](actions_types.md#ethgettransactioncountresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionCountParams`](actions_types.md#ethgettransactioncountparams) |

##### Returns

`Promise`\<[`EthGetTransactionCountResult`](actions_types.md#ethgettransactioncountresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:21

___

### EthGetTransactionCountParams

Ƭ **EthGetTransactionCountParams**: `Object`

Based on the JSON-RPC request for `eth_getTransactionCount` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | [`Address`](actions_types.md#address) |
| `blockTag?` | [`BlockParam`](index.md#blockparam) |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:135

___

### EthGetTransactionCountResult

Ƭ **EthGetTransactionCountResult**: [`Hex`](actions_types.md#hex)

JSON-RPC response for `eth_getTransactionCount` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:83

___

### EthGetTransactionReceiptHandler

Ƭ **EthGetTransactionReceiptHandler**: (`request`: [`EthGetTransactionReceiptParams`](actions_types.md#ethgettransactionreceiptparams)) => `Promise`\<[`EthGetTransactionReceiptResult`](actions_types.md#ethgettransactionreceiptresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetTransactionReceiptResult`](actions_types.md#ethgettransactionreceiptresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetTransactionReceiptParams`](actions_types.md#ethgettransactionreceiptparams) |

##### Returns

`Promise`\<[`EthGetTransactionReceiptResult`](actions_types.md#ethgettransactionreceiptresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:27

___

### EthGetTransactionReceiptParams

Ƭ **EthGetTransactionReceiptParams**: `Object`

Based on the JSON-RPC request for `eth_getTransactionReceipt` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `hash` | [`Hex`](actions_types.md#hex) |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:174

___

### EthGetTransactionReceiptResult

Ƭ **EthGetTransactionReceiptResult**: [`TransactionReceiptResult`](actions_types.md#transactionreceiptresult)

JSON-RPC response for `eth_getTransactionReceipt` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:107

___

### EthGetUncleByBlockHashAndIndexHandler

Ƭ **EthGetUncleByBlockHashAndIndexHandler**: (`request`: [`EthGetUncleByBlockHashAndIndexParams`](actions_types.md#ethgetunclebyblockhashandindexparams)) => `Promise`\<[`EthGetUncleByBlockHashAndIndexResult`](actions_types.md#ethgetunclebyblockhashandindexresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetUncleByBlockHashAndIndexResult`](actions_types.md#ethgetunclebyblockhashandindexresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetUncleByBlockHashAndIndexParams`](actions_types.md#ethgetunclebyblockhashandindexparams) |

##### Returns

`Promise`\<[`EthGetUncleByBlockHashAndIndexResult`](actions_types.md#ethgetunclebyblockhashandindexresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:28

___

### EthGetUncleByBlockHashAndIndexParams

Ƭ **EthGetUncleByBlockHashAndIndexParams**: `Object`

Based on the JSON-RPC request for `eth_getUncleByBlockHashAndIndex` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockHash` | [`Hex`](actions_types.md#hex) |
| `uncleIndex` | [`Hex`](actions_types.md#hex) |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:180

___

### EthGetUncleByBlockHashAndIndexResult

Ƭ **EthGetUncleByBlockHashAndIndexResult**: [`Hex`](actions_types.md#hex)

JSON-RPC response for `eth_getUncleByBlockHashAndIndex` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:111

___

### EthGetUncleByBlockNumberAndIndexHandler

Ƭ **EthGetUncleByBlockNumberAndIndexHandler**: (`request`: [`EthGetUncleByBlockNumberAndIndexParams`](actions_types.md#ethgetunclebyblocknumberandindexparams)) => `Promise`\<[`EthGetUncleByBlockNumberAndIndexResult`](actions_types.md#ethgetunclebyblocknumberandindexresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetUncleByBlockNumberAndIndexResult`](actions_types.md#ethgetunclebyblocknumberandindexresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetUncleByBlockNumberAndIndexParams`](actions_types.md#ethgetunclebyblocknumberandindexparams) |

##### Returns

`Promise`\<[`EthGetUncleByBlockNumberAndIndexResult`](actions_types.md#ethgetunclebyblocknumberandindexresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:29

___

### EthGetUncleByBlockNumberAndIndexParams

Ƭ **EthGetUncleByBlockNumberAndIndexParams**: `Object`

Based on the JSON-RPC request for `eth_getUncleByBlockNumberAndIndex` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockTag?` | [`BlockParam`](index.md#blockparam) |
| `uncleIndex` | [`Hex`](actions_types.md#hex) |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:187

___

### EthGetUncleByBlockNumberAndIndexResult

Ƭ **EthGetUncleByBlockNumberAndIndexResult**: [`Hex`](actions_types.md#hex)

JSON-RPC response for `eth_getUncleByBlockNumberAndIndex` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:115

___

### EthGetUncleCountByBlockHashHandler

Ƭ **EthGetUncleCountByBlockHashHandler**: (`request`: [`EthGetUncleCountByBlockHashParams`](actions_types.md#ethgetunclecountbyblockhashparams)) => `Promise`\<[`EthGetUncleCountByBlockHashResult`](actions_types.md#ethgetunclecountbyblockhashresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetUncleCountByBlockHashResult`](actions_types.md#ethgetunclecountbyblockhashresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetUncleCountByBlockHashParams`](actions_types.md#ethgetunclecountbyblockhashparams) |

##### Returns

`Promise`\<[`EthGetUncleCountByBlockHashResult`](actions_types.md#ethgetunclecountbyblockhashresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:22

___

### EthGetUncleCountByBlockHashParams

Ƭ **EthGetUncleCountByBlockHashParams**: `Object`

Based on the JSON-RPC request for `eth_getUncleCountByBlockHash` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `hash` | [`Hex`](actions_types.md#hex) |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:142

___

### EthGetUncleCountByBlockHashResult

Ƭ **EthGetUncleCountByBlockHashResult**: [`Hex`](actions_types.md#hex)

JSON-RPC response for `eth_getUncleCountByBlockHash` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:87

___

### EthGetUncleCountByBlockNumberHandler

Ƭ **EthGetUncleCountByBlockNumberHandler**: (`request`: [`EthGetUncleCountByBlockNumberParams`](actions_types.md#ethgetunclecountbyblocknumberparams)) => `Promise`\<[`EthGetUncleCountByBlockNumberResult`](actions_types.md#ethgetunclecountbyblocknumberresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthGetUncleCountByBlockNumberResult`](actions_types.md#ethgetunclecountbyblocknumberresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthGetUncleCountByBlockNumberParams`](actions_types.md#ethgetunclecountbyblocknumberparams) |

##### Returns

`Promise`\<[`EthGetUncleCountByBlockNumberResult`](actions_types.md#ethgetunclecountbyblocknumberresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:23

___

### EthGetUncleCountByBlockNumberParams

Ƭ **EthGetUncleCountByBlockNumberParams**: `Object`

Based on the JSON-RPC request for `eth_getUncleCountByBlockNumber` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockTag?` | [`BlockParam`](index.md#blockparam) |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:148

___

### EthGetUncleCountByBlockNumberResult

Ƭ **EthGetUncleCountByBlockNumberResult**: [`Hex`](actions_types.md#hex)

JSON-RPC response for `eth_getUncleCountByBlockNumber` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:91

___

### EthHashrateHandler

Ƭ **EthHashrateHandler**: (`request?`: [`EthHashrateParams`](actions_types.md#ethhashrateparams)) => `Promise`\<[`EthHashrateResult`](actions_types.md#ethhashrateresult)\>

#### Type declaration

▸ (`request?`): `Promise`\<[`EthHashrateResult`](actions_types.md#ethhashrateresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request?` | [`EthHashrateParams`](actions_types.md#ethhashrateparams) |

##### Returns

`Promise`\<[`EthHashrateResult`](actions_types.md#ethhashrateresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:9

___

### EthHashrateParams

Ƭ **EthHashrateParams**: [`EmptyParams`](actions_types.md#emptyparams)

Based on the JSON-RPC request for `eth_hashrate` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:61

___

### EthHashrateResult

Ƭ **EthHashrateResult**: [`Hex`](actions_types.md#hex)

JSON-RPC response for `eth_hashrate` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:35

___

### EthMiningHandler

Ƭ **EthMiningHandler**: (`request`: [`EthMiningParams`](actions_types.md#ethminingparams)) => `Promise`\<[`EthMiningResult`](actions_types.md#ethminingresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthMiningResult`](actions_types.md#ethminingresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthMiningParams`](actions_types.md#ethminingparams) |

##### Returns

`Promise`\<[`EthMiningResult`](actions_types.md#ethminingresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:30

___

### EthMiningParams

Ƭ **EthMiningParams**: [`EmptyParams`](actions_types.md#emptyparams)

Based on the JSON-RPC request for `eth_mining` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:194

___

### EthMiningResult

Ƭ **EthMiningResult**: `boolean`

JSON-RPC response for `eth_mining` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:119

___

### EthNewBlockFilterHandler

Ƭ **EthNewBlockFilterHandler**: (`request`: [`EthNewBlockFilterParams`](actions_types.md#ethnewblockfilterparams)) => `Promise`\<[`EthNewBlockFilterResult`](actions_types.md#ethnewblockfilterresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthNewBlockFilterResult`](actions_types.md#ethnewblockfilterresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthNewBlockFilterParams`](actions_types.md#ethnewblockfilterparams) |

##### Returns

`Promise`\<[`EthNewBlockFilterResult`](actions_types.md#ethnewblockfilterresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:38

___

### EthNewBlockFilterParams

Ƭ **EthNewBlockFilterParams**: [`EmptyParams`](actions_types.md#emptyparams)

Based on the JSON-RPC request for `eth_newBlockFilter` procedure (no params)

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:267

___

### EthNewBlockFilterResult

Ƭ **EthNewBlockFilterResult**: [`Hex`](actions_types.md#hex)

JSON-RPC response for `eth_newBlockFilter` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:166

___

### EthNewFilterHandler

Ƭ **EthNewFilterHandler**: (`request`: [`EthNewFilterParams`](actions_types.md#ethnewfilterparams)) => `Promise`\<[`EthNewFilterResult`](actions_types.md#ethnewfilterresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthNewFilterResult`](actions_types.md#ethnewfilterresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthNewFilterParams`](actions_types.md#ethnewfilterparams) |

##### Returns

`Promise`\<[`EthNewFilterResult`](actions_types.md#ethnewfilterresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:37

___

### EthNewFilterParams

Ƭ **EthNewFilterParams**: [`FilterParams`](actions_types.md#filterparams)

Based on the JSON-RPC request for `eth_newFilter` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:263

___

### EthNewFilterResult

Ƭ **EthNewFilterResult**: [`Hex`](actions_types.md#hex)

JSON-RPC response for `eth_newFilter` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:162

___

### EthNewPendingTransactionFilterHandler

Ƭ **EthNewPendingTransactionFilterHandler**: (`request`: [`EthNewPendingTransactionFilterParams`](actions_types.md#ethnewpendingtransactionfilterparams)) => `Promise`\<[`EthNewPendingTransactionFilterResult`](actions_types.md#ethnewpendingtransactionfilterresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthNewPendingTransactionFilterResult`](actions_types.md#ethnewpendingtransactionfilterresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthNewPendingTransactionFilterParams`](actions_types.md#ethnewpendingtransactionfilterparams) |

##### Returns

`Promise`\<[`EthNewPendingTransactionFilterResult`](actions_types.md#ethnewpendingtransactionfilterresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:39

___

### EthNewPendingTransactionFilterParams

Ƭ **EthNewPendingTransactionFilterParams**: [`EmptyParams`](actions_types.md#emptyparams)

Based on the JSON-RPC request for `eth_newPendingTransactionFilter` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:271

___

### EthNewPendingTransactionFilterResult

Ƭ **EthNewPendingTransactionFilterResult**: [`Hex`](actions_types.md#hex)

JSON-RPC response for `eth_newPendingTransactionFilter` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:170

___

### EthParams

Ƭ **EthParams**: [`EthAccountsParams`](actions_types.md#ethaccountsparams) \| [`EthAccountsParams`](actions_types.md#ethaccountsparams) \| [`EthBlockNumberParams`](actions_types.md#ethblocknumberparams) \| [`EthCallParams`](actions_types.md#ethcallparams) \| [`EthChainIdParams`](actions_types.md#ethchainidparams) \| [`EthCoinbaseParams`](actions_types.md#ethcoinbaseparams) \| [`EthEstimateGasParams`](actions_types.md#ethestimategasparams) \| [`EthHashrateParams`](actions_types.md#ethhashrateparams) \| [`EthGasPriceParams`](actions_types.md#ethgaspriceparams) \| [`EthGetBalanceParams`](actions_types.md#ethgetbalanceparams) \| [`EthGetBlockByHashParams`](actions_types.md#ethgetblockbyhashparams) \| [`EthGetBlockByNumberParams`](actions_types.md#ethgetblockbynumberparams) \| [`EthGetBlockTransactionCountByHashParams`](actions_types.md#ethgetblocktransactioncountbyhashparams) \| [`EthGetBlockTransactionCountByNumberParams`](actions_types.md#ethgetblocktransactioncountbynumberparams) \| [`EthGetCodeParams`](actions_types.md#ethgetcodeparams) \| [`EthGetFilterChangesParams`](actions_types.md#ethgetfilterchangesparams) \| [`EthGetFilterLogsParams`](actions_types.md#ethgetfilterlogsparams) \| [`EthGetLogsParams`](actions_types.md#ethgetlogsparams) \| [`EthGetStorageAtParams`](actions_types.md#ethgetstorageatparams) \| [`EthGetTransactionCountParams`](actions_types.md#ethgettransactioncountparams) \| [`EthGetUncleCountByBlockHashParams`](actions_types.md#ethgetunclecountbyblockhashparams) \| [`EthGetUncleCountByBlockNumberParams`](actions_types.md#ethgetunclecountbyblocknumberparams) \| [`EthGetTransactionByHashParams`](actions_types.md#ethgettransactionbyhashparams) \| [`EthGetTransactionByBlockHashAndIndexParams`](actions_types.md#ethgettransactionbyblockhashandindexparams) \| [`EthGetTransactionByBlockNumberAndIndexParams`](actions_types.md#ethgettransactionbyblocknumberandindexparams) \| [`EthGetTransactionReceiptParams`](actions_types.md#ethgettransactionreceiptparams) \| [`EthGetUncleByBlockHashAndIndexParams`](actions_types.md#ethgetunclebyblockhashandindexparams) \| [`EthGetUncleByBlockNumberAndIndexParams`](actions_types.md#ethgetunclebyblocknumberandindexparams) \| [`EthMiningParams`](actions_types.md#ethminingparams) \| [`EthProtocolVersionParams`](actions_types.md#ethprotocolversionparams) \| [`EthSendRawTransactionParams`](actions_types.md#ethsendrawtransactionparams) \| [`EthSendTransactionParams`](actions_types.md#ethsendtransactionparams) \| [`EthSignParams`](actions_types.md#ethsignparams) \| [`EthSignTransactionParams`](actions_types.md#ethsigntransactionparams) \| [`EthSyncingParams`](actions_types.md#ethsyncingparams) \| [`EthNewFilterParams`](actions_types.md#ethnewfilterparams) \| [`EthNewBlockFilterParams`](actions_types.md#ethnewblockfilterparams) \| [`EthNewPendingTransactionFilterParams`](actions_types.md#ethnewpendingtransactionfilterparams) \| [`EthUninstallFilterParams`](actions_types.md#ethuninstallfilterparams)

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:278

___

### EthProtocolVersionHandler

Ƭ **EthProtocolVersionHandler**: (`request`: [`EthProtocolVersionParams`](actions_types.md#ethprotocolversionparams)) => `Promise`\<[`EthProtocolVersionResult`](actions_types.md#ethprotocolversionresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthProtocolVersionResult`](actions_types.md#ethprotocolversionresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthProtocolVersionParams`](actions_types.md#ethprotocolversionparams) |

##### Returns

`Promise`\<[`EthProtocolVersionResult`](actions_types.md#ethprotocolversionresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:31

___

### EthProtocolVersionParams

Ƭ **EthProtocolVersionParams**: [`EmptyParams`](actions_types.md#emptyparams)

Based on the JSON-RPC request for `eth_protocolVersion` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:198

___

### EthProtocolVersionResult

Ƭ **EthProtocolVersionResult**: [`Hex`](actions_types.md#hex)

JSON-RPC response for `eth_protocolVersion` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:123

___

### EthSendRawTransactionHandler

Ƭ **EthSendRawTransactionHandler**: (`request`: [`EthSendRawTransactionParams`](actions_types.md#ethsendrawtransactionparams)) => `Promise`\<[`EthSendRawTransactionResult`](actions_types.md#ethsendrawtransactionresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSendRawTransactionResult`](actions_types.md#ethsendrawtransactionresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSendRawTransactionParams`](actions_types.md#ethsendrawtransactionparams) |

##### Returns

`Promise`\<[`EthSendRawTransactionResult`](actions_types.md#ethsendrawtransactionresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:32

___

### EthSendRawTransactionParams

Ƭ **EthSendRawTransactionParams**: [`CallParams`](index.md#callparams)

Based on the JSON-RPC request for `eth_sendRawTransaction` procedure
This type is a placeholder

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:203

___

### EthSendRawTransactionResult

Ƭ **EthSendRawTransactionResult**: [`Hex`](actions_types.md#hex)

JSON-RPC response for `eth_sendRawTransaction` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:127

___

### EthSendTransactionHandler

Ƭ **EthSendTransactionHandler**: (`request`: [`EthSendTransactionParams`](actions_types.md#ethsendtransactionparams)) => `Promise`\<[`EthSendTransactionResult`](actions_types.md#ethsendtransactionresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSendTransactionResult`](actions_types.md#ethsendtransactionresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSendTransactionParams`](actions_types.md#ethsendtransactionparams) |

##### Returns

`Promise`\<[`EthSendTransactionResult`](actions_types.md#ethsendtransactionresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:33

___

### EthSendTransactionParams

Ƭ **EthSendTransactionParams**: [`CallParams`](index.md#callparams)

Based on the JSON-RPC request for `eth_sendTransaction` procedure
This type is a placeholder

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:209

___

### EthSendTransactionResult

Ƭ **EthSendTransactionResult**: [`Hex`](actions_types.md#hex)

JSON-RPC response for `eth_sendTransaction` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:131

___

### EthSignHandler

Ƭ **EthSignHandler**: (`request`: [`EthSignParams`](actions_types.md#ethsignparams)) => `Promise`\<[`EthSignResult`](actions_types.md#ethsignresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSignResult`](actions_types.md#ethsignresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSignParams`](actions_types.md#ethsignparams) |

##### Returns

`Promise`\<[`EthSignResult`](actions_types.md#ethsignresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:34

___

### EthSignParams

Ƭ **EthSignParams**: `Object`

Based on the JSON-RPC request for `eth_sign` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | [`Address`](actions_types.md#address) |
| `data` | [`Hex`](actions_types.md#hex) |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:214

___

### EthSignResult

Ƭ **EthSignResult**: [`Hex`](actions_types.md#hex)

JSON-RPC response for `eth_sign` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:135

___

### EthSignTransactionHandler

Ƭ **EthSignTransactionHandler**: (`request`: [`EthSignTransactionParams`](actions_types.md#ethsigntransactionparams)) => `Promise`\<[`EthSignTransactionResult`](actions_types.md#ethsigntransactionresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSignTransactionResult`](actions_types.md#ethsigntransactionresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSignTransactionParams`](actions_types.md#ethsigntransactionparams) |

##### Returns

`Promise`\<[`EthSignTransactionResult`](actions_types.md#ethsigntransactionresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:35

___

### EthSignTransactionParams

Ƭ **EthSignTransactionParams**: `Object`

Based on the JSON-RPC request for `eth_signTransaction` procedure

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `data?` | [`Hex`](actions_types.md#hex) | The compiled code of a contract OR the hash of the invoked method signature and encoded parameters. Optional if creating a contract. |
| `from` | [`Address`](actions_types.md#address) | The address from which the transaction is sent from |
| `gas?` | `bigint` | The gas provded for transaction execution. It will return unused gas. Default value is 90000 |
| `gasPrice?` | `bigint` | Integer of the gasPrice used for each paid gas, in Wei. If not provided tevm will default to the eth_gasPrice value |
| `nonce?` | `bigint` | Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce. |
| `to?` | [`Address`](actions_types.md#address) | The address the transaction is directed to. Optional if creating a contract |
| `value?` | `bigint` | Integer of the value sent with this transaction, in Wei. |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:222

___

### EthSignTransactionResult

Ƭ **EthSignTransactionResult**: [`Hex`](actions_types.md#hex)

JSON-RPC response for `eth_signTransaction` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:139

___

### EthSyncingHandler

Ƭ **EthSyncingHandler**: (`request`: [`EthSyncingParams`](actions_types.md#ethsyncingparams)) => `Promise`\<[`EthSyncingResult`](actions_types.md#ethsyncingresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthSyncingResult`](actions_types.md#ethsyncingresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthSyncingParams`](actions_types.md#ethsyncingparams) |

##### Returns

`Promise`\<[`EthSyncingResult`](actions_types.md#ethsyncingresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:36

___

### EthSyncingParams

Ƭ **EthSyncingParams**: [`EmptyParams`](actions_types.md#emptyparams)

Based on the JSON-RPC request for `eth_syncing` procedure (no params)

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:259

___

### EthSyncingResult

Ƭ **EthSyncingResult**: `boolean` \| \{ `currentBlock`: [`Hex`](actions_types.md#hex) ; `headedBytecodebytes?`: [`Hex`](actions_types.md#hex) ; `healedBytecodes?`: [`Hex`](actions_types.md#hex) ; `healedTrienodes?`: [`Hex`](actions_types.md#hex) ; `healingBytecode?`: [`Hex`](actions_types.md#hex) ; `healingTrienodes?`: [`Hex`](actions_types.md#hex) ; `highestBlock`: [`Hex`](actions_types.md#hex) ; `knownStates`: [`Hex`](actions_types.md#hex) ; `pulledStates`: [`Hex`](actions_types.md#hex) ; `startingBlock`: [`Hex`](actions_types.md#hex) ; `syncedBytecodeBytes?`: [`Hex`](actions_types.md#hex) ; `syncedBytecodes?`: [`Hex`](actions_types.md#hex) ; `syncedStorage?`: [`Hex`](actions_types.md#hex) ; `syncedStorageBytes?`: [`Hex`](actions_types.md#hex)  }

JSON-RPC response for `eth_syncing` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:143

___

### EthUninstallFilterHandler

Ƭ **EthUninstallFilterHandler**: (`request`: [`EthUninstallFilterParams`](actions_types.md#ethuninstallfilterparams)) => `Promise`\<[`EthUninstallFilterResult`](actions_types.md#ethuninstallfilterresult)\>

#### Type declaration

▸ (`request`): `Promise`\<[`EthUninstallFilterResult`](actions_types.md#ethuninstallfilterresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthUninstallFilterParams`](actions_types.md#ethuninstallfilterparams) |

##### Returns

`Promise`\<[`EthUninstallFilterResult`](actions_types.md#ethuninstallfilterresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/EthHandler.d.ts:40

___

### EthUninstallFilterParams

Ƭ **EthUninstallFilterParams**: `Object`

Based on the JSON-RPC request for `eth_uninstallFilter` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `filterId` | [`Hex`](actions_types.md#hex) |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/EthParams.d.ts:275

___

### EthUninstallFilterResult

Ƭ **EthUninstallFilterResult**: `boolean`

JSON-RPC response for `eth_uninstallFilter` procedure

#### Defined in

evmts-monorepo/packages/actions-types/types/result/EthResult.d.ts:174

___

### FilterLog

Ƭ **FilterLog**: `Object`

FilterLog type for eth JSON-RPC procedures

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | [`Hex`](actions_types.md#hex) |
| `blockHash` | [`Hex`](actions_types.md#hex) |
| `blockNumber` | [`Hex`](actions_types.md#hex) |
| `data` | [`Hex`](actions_types.md#hex) |
| `logIndex` | [`Hex`](actions_types.md#hex) |
| `removed` | `boolean` |
| `topics` | readonly [`Hex`](actions_types.md#hex)[] |
| `transactionHash` | [`Hex`](actions_types.md#hex) |
| `transactionIndex` | [`Hex`](actions_types.md#hex) |

#### Defined in

evmts-monorepo/packages/actions-types/types/common/FilterLog.d.ts:5

___

### FilterParams

Ƭ **FilterParams**: `Object`

An event filter optionsobject

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | [`Address`](actions_types.md#address) |
| `fromBlock` | [`BlockParam`](index.md#blockparam) |
| `toBlock` | [`BlockParam`](index.md#blockparam) |
| `topics` | `ReadonlyArray`\<[`Hex`](actions_types.md#hex)\> |

#### Defined in

evmts-monorepo/packages/actions-types/types/common/FilterParams.d.ts:7

___

### GetAccountHandler

Ƭ **GetAccountHandler**: (`params`: [`GetAccountParams`](index.md#getaccountparams)) => `Promise`\<[`GetAccountResult`](index.md#getaccountresult)\>

Gets the state of a specific ethereum address

**`Example`**

```ts
const res = tevm.getAccount({address: '0x123...'})
console.log(res.deployedBytecode)
console.log(res.nonce)
console.log(res.balance)
```

#### Type declaration

▸ (`params`): `Promise`\<[`GetAccountResult`](index.md#getaccountresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`GetAccountParams`](index.md#getaccountparams) |

##### Returns

`Promise`\<[`GetAccountResult`](index.md#getaccountresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/GetAccountHandler.d.ts:10

___

### Hex

Ƭ **Hex**: \`0x$\{string}\`

A hex string

**`Example`**

```ts
const hex: Hex = '0x1234ff'
```

#### Defined in

evmts-monorepo/packages/actions-types/types/common/Hex.d.ts:6

___

### LoadStateHandler

Ƭ **LoadStateHandler**: (`params`: [`LoadStateParams`](actions_types.md#loadstateparams)) => `Promise`\<[`LoadStateResult`](actions_types.md#loadstateresult)\>

Loads a previously dumped state into the VM

State can be dumped as follows

**`Example`**

```typescript
const {state} = await tevm.dumpState()
fs.writeFileSync('state.json', JSON.stringify(state))
```

And then loaded as follows

**`Example`**

```typescript
const state = JSON.parse(fs.readFileSync('state.json'))
await tevm.loadState({state})
```

#### Type declaration

▸ (`params`): `Promise`\<[`LoadStateResult`](actions_types.md#loadstateresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`LoadStateParams`](actions_types.md#loadstateparams) |

##### Returns

`Promise`\<[`LoadStateResult`](actions_types.md#loadstateresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/LoadStateHandler.d.ts:20

___

### LoadStateParams

Ƭ **LoadStateParams**\<`TThrowOnFail`\>: `BaseParams`\<`TThrowOnFail`\> & \{ `state`: [`SerializableTevmState`](index.md#serializabletevmstate)  }

params for `tevm_loadState` method. Takes a [SerializableTevmState](index.md#serializabletevmstate) to load into state.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TThrowOnFail` | extends `boolean` = `boolean` |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/LoadStateParams.d.ts:6

___

### LoadStateResult

Ƭ **LoadStateResult**\<`ErrorType`\>: `Object`

Result of LoadState Method

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ErrorType` | [`LoadStateError`](errors.md#loadstateerror) |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `errors?` | `ErrorType`[] | Description of the exception, if any occurred |

#### Defined in

evmts-monorepo/packages/actions-types/types/result/LoadStateResult.d.ts:5

___

### Log

Ƭ **Log**: `Object`

Generic log information

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | [`Address`](actions_types.md#address) |
| `data` | [`Hex`](actions_types.md#hex) |
| `topics` | [`Hex`](actions_types.md#hex)[] |

#### Defined in

evmts-monorepo/packages/actions-types/types/common/Log.d.ts:6

___

### NetworkConfig

Ƭ **NetworkConfig**: `Object`

Represents a configuration for a forked or proxied network

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockTag` | [`BlockParam`](index.md#blockparam) | the block tag to fork from |
| `url` | `string` | The URL to the RPC endpoint |

#### Defined in

evmts-monorepo/packages/actions-types/types/common/NetworkConfig.d.ts:5

___

### ScriptHandler

Ƭ **ScriptHandler**: \<TAbi, TFunctionName\>(`params`: [`ScriptParams`](index.md#scriptparams)\<`TAbi`, `TFunctionName`\>) => `Promise`\<[`ScriptResult`](index.md#scriptresult)\<`TAbi`, `TFunctionName`\>\>

Executes scripts against the Tevm EVM. By default the script is sandboxed
and the state is reset after each execution unless the `persist` option is set
to true.

**`Example`**

```typescript
const res = tevm.script({
  deployedBytecode: '0x6080604...',
  abi: [...],
  function: 'run',
  args: ['hello world']
})
```
Contract handlers provide a more ergonomic way to execute scripts

**`Example`**

```typescript
ipmort {MyScript} from './MyScript.s.sol'

const res = tevm.script(
   MyScript.read.run('hello world')
)
```

#### Type declaration

▸ \<`TAbi`, `TFunctionName`\>(`params`): `Promise`\<[`ScriptResult`](index.md#scriptresult)\<`TAbi`, `TFunctionName`\>\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends [`Abi`](index.md#abi) \| readonly `unknown`[] = [`Abi`](index.md#abi) |
| `TFunctionName` | extends [`ContractFunctionName`](index.md#contractfunctionname)\<`TAbi`\> = [`ContractFunctionName`](index.md#contractfunctionname)\<`TAbi`\> |

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`ScriptParams`](index.md#scriptparams)\<`TAbi`, `TFunctionName`\> |

##### Returns

`Promise`\<[`ScriptResult`](index.md#scriptresult)\<`TAbi`, `TFunctionName`\>\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/ScriptHandler.d.ts:27

___

### SetAccountHandler

Ƭ **SetAccountHandler**: (`params`: [`SetAccountParams`](index.md#setaccountparams)) => `Promise`\<[`SetAccountResult`](index.md#setaccountresult)\>

Sets the state of a specific ethereum address

**`Example`**

```ts
import {parseEther} from 'tevm'

await tevm.setAccount({
 address: '0x123...',
 deployedBytecode: '0x6080604...',
 balance: parseEther('1.0')
})
```

#### Type declaration

▸ (`params`): `Promise`\<[`SetAccountResult`](index.md#setaccountresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`SetAccountParams`](index.md#setaccountparams) |

##### Returns

`Promise`\<[`SetAccountResult`](index.md#setaccountresult)\>

#### Defined in

evmts-monorepo/packages/actions-types/types/handlers/SetAccountHandler.d.ts:13

___

### StructLog

Ƭ **StructLog**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `depth` | `number` |
| `gas` | `bigint` |
| `gasCost` | `bigint` |
| `op` | `string` |
| `pc` | `number` |
| `stack` | `ReadonlyArray`\<[`Hex`](actions_types.md#hex)\> |

#### Defined in

evmts-monorepo/packages/actions-types/types/result/DebugResult.d.ts:3

___

### TraceType

Ƭ **TraceType**: ``"CALL"`` \| ``"DELEGATECALL"`` \| ``"STATICCALL"`` \| ``"CREATE"`` \| ``"CREATE2"`` \| ``"SELFDESTRUCT"`` \| ``"REWARD"``

#### Defined in

evmts-monorepo/packages/actions-types/types/common/TraceType.d.ts:1

___

### TransactionParams

Ƭ **TransactionParams**: `Object`

A transaction request object

#### Type declaration

| Name | Type |
| :------ | :------ |
| `from` | [`Address`](actions_types.md#address) |
| `gas?` | [`Hex`](actions_types.md#hex) |
| `gasPrice?` | [`Hex`](actions_types.md#hex) |
| `input` | [`Hex`](actions_types.md#hex) |
| `nonce?` | [`Hex`](actions_types.md#hex) |
| `to?` | [`Address`](actions_types.md#address) |
| `value?` | [`Hex`](actions_types.md#hex) |

#### Defined in

evmts-monorepo/packages/actions-types/types/common/TransactionParams.d.ts:6

___

### TransactionReceiptResult

Ƭ **TransactionReceiptResult**: `Object`

Transaction receipt result type for eth JSON-RPC procedures

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockHash` | [`Hex`](actions_types.md#hex) |
| `blockNumber` | [`Hex`](actions_types.md#hex) |
| `contractAddress` | [`Hex`](actions_types.md#hex) |
| `cumulativeGasUsed` | [`Hex`](actions_types.md#hex) |
| `from` | [`Hex`](actions_types.md#hex) |
| `gasUsed` | [`Hex`](actions_types.md#hex) |
| `logs` | readonly [`FilterLog`](actions_types.md#filterlog)[] |
| `logsBloom` | [`Hex`](actions_types.md#hex) |
| `status` | [`Hex`](actions_types.md#hex) |
| `to` | [`Hex`](actions_types.md#hex) |
| `transactionHash` | [`Hex`](actions_types.md#hex) |
| `transactionIndex` | [`Hex`](actions_types.md#hex) |

#### Defined in

evmts-monorepo/packages/actions-types/types/common/TransactionReceiptResult.d.ts:6

___

### TransactionResult

Ƭ **TransactionResult**: `Object`

The type returned by transaction related
json rpc procedures

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockHash` | [`Hex`](actions_types.md#hex) |
| `blockNumber` | [`Hex`](actions_types.md#hex) |
| `from` | [`Hex`](actions_types.md#hex) |
| `gas` | [`Hex`](actions_types.md#hex) |
| `gasPrice` | [`Hex`](actions_types.md#hex) |
| `hash` | [`Hex`](actions_types.md#hex) |
| `input` | [`Hex`](actions_types.md#hex) |
| `nonce` | [`Hex`](actions_types.md#hex) |
| `r` | [`Hex`](actions_types.md#hex) |
| `s` | [`Hex`](actions_types.md#hex) |
| `to` | [`Hex`](actions_types.md#hex) |
| `transactionIndex` | [`Hex`](actions_types.md#hex) |
| `v` | [`Hex`](actions_types.md#hex) |
| `value` | [`Hex`](actions_types.md#hex) |

#### Defined in

evmts-monorepo/packages/actions-types/types/common/TransactionResult.d.ts:6

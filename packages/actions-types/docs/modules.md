[@tevm/actions-types](README.md) / Exports

# @tevm/actions-types

## Table of contents

### Type Aliases

- [Abi](modules.md#abi)
- [Address](modules.md#address)
- [AnvilDropTransactionHandler](modules.md#anvildroptransactionhandler)
- [AnvilDropTransactionParams](modules.md#anvildroptransactionparams)
- [AnvilDropTransactionResult](modules.md#anvildroptransactionresult)
- [AnvilDumpStateHandler](modules.md#anvildumpstatehandler)
- [AnvilDumpStateParams](modules.md#anvildumpstateparams)
- [AnvilDumpStateResult](modules.md#anvildumpstateresult)
- [AnvilGetAutomineHandler](modules.md#anvilgetautominehandler)
- [AnvilGetAutomineParams](modules.md#anvilgetautomineparams)
- [AnvilGetAutomineResult](modules.md#anvilgetautomineresult)
- [AnvilImpersonateAccountHandler](modules.md#anvilimpersonateaccounthandler)
- [AnvilImpersonateAccountParams](modules.md#anvilimpersonateaccountparams)
- [AnvilImpersonateAccountResult](modules.md#anvilimpersonateaccountresult)
- [AnvilLoadStateHandler](modules.md#anvilloadstatehandler)
- [AnvilLoadStateParams](modules.md#anvilloadstateparams)
- [AnvilLoadStateResult](modules.md#anvilloadstateresult)
- [AnvilMineHandler](modules.md#anvilminehandler)
- [AnvilMineParams](modules.md#anvilmineparams)
- [AnvilMineResult](modules.md#anvilmineresult)
- [AnvilResetHandler](modules.md#anvilresethandler)
- [AnvilResetParams](modules.md#anvilresetparams)
- [AnvilResetResult](modules.md#anvilresetresult)
- [AnvilSetBalanceHandler](modules.md#anvilsetbalancehandler)
- [AnvilSetBalanceParams](modules.md#anvilsetbalanceparams)
- [AnvilSetBalanceResult](modules.md#anvilsetbalanceresult)
- [AnvilSetChainIdHandler](modules.md#anvilsetchainidhandler)
- [AnvilSetChainIdParams](modules.md#anvilsetchainidparams)
- [AnvilSetChainIdResult](modules.md#anvilsetchainidresult)
- [AnvilSetCodeHandler](modules.md#anvilsetcodehandler)
- [AnvilSetCodeParams](modules.md#anvilsetcodeparams)
- [AnvilSetCodeResult](modules.md#anvilsetcoderesult)
- [AnvilSetNonceHandler](modules.md#anvilsetnoncehandler)
- [AnvilSetNonceParams](modules.md#anvilsetnonceparams)
- [AnvilSetNonceResult](modules.md#anvilsetnonceresult)
- [AnvilSetStorageAtHandler](modules.md#anvilsetstorageathandler)
- [AnvilSetStorageAtParams](modules.md#anvilsetstorageatparams)
- [AnvilSetStorageAtResult](modules.md#anvilsetstorageatresult)
- [AnvilStopImpersonatingAccountHandler](modules.md#anvilstopimpersonatingaccounthandler)
- [AnvilStopImpersonatingAccountParams](modules.md#anvilstopimpersonatingaccountparams)
- [AnvilStopImpersonatingAccountResult](modules.md#anvilstopimpersonatingaccountresult)
- [BaseCallParams](modules.md#basecallparams)
- [Block](modules.md#block)
- [BlockParam](modules.md#blockparam)
- [BlockResult](modules.md#blockresult)
- [BlockTag](modules.md#blocktag)
- [CallHandler](modules.md#callhandler)
- [CallParams](modules.md#callparams)
- [CallResult](modules.md#callresult)
- [ContractHandler](modules.md#contracthandler)
- [ContractParams](modules.md#contractparams)
- [ContractResult](modules.md#contractresult)
- [DebugTraceCallHandler](modules.md#debugtracecallhandler)
- [DebugTraceCallParams](modules.md#debugtracecallparams)
- [DebugTraceCallResult](modules.md#debugtracecallresult)
- [DebugTraceTransactionHandler](modules.md#debugtracetransactionhandler)
- [DebugTraceTransactionParams](modules.md#debugtracetransactionparams)
- [DebugTraceTransactionResult](modules.md#debugtracetransactionresult)
- [DumpStateHandler](modules.md#dumpstatehandler)
- [DumpStateResult](modules.md#dumpstateresult)
- [EmptyParams](modules.md#emptyparams)
- [EthAccountsHandler](modules.md#ethaccountshandler)
- [EthAccountsParams](modules.md#ethaccountsparams)
- [EthAccountsResult](modules.md#ethaccountsresult)
- [EthBlockNumberHandler](modules.md#ethblocknumberhandler)
- [EthBlockNumberParams](modules.md#ethblocknumberparams)
- [EthBlockNumberResult](modules.md#ethblocknumberresult)
- [EthCallHandler](modules.md#ethcallhandler)
- [EthCallParams](modules.md#ethcallparams)
- [EthCallResult](modules.md#ethcallresult)
- [EthChainIdHandler](modules.md#ethchainidhandler)
- [EthChainIdParams](modules.md#ethchainidparams)
- [EthChainIdResult](modules.md#ethchainidresult)
- [EthCoinbaseHandler](modules.md#ethcoinbasehandler)
- [EthCoinbaseParams](modules.md#ethcoinbaseparams)
- [EthCoinbaseResult](modules.md#ethcoinbaseresult)
- [EthEstimateGasHandler](modules.md#ethestimategashandler)
- [EthEstimateGasParams](modules.md#ethestimategasparams)
- [EthEstimateGasResult](modules.md#ethestimategasresult)
- [EthGasPriceHandler](modules.md#ethgaspricehandler)
- [EthGasPriceParams](modules.md#ethgaspriceparams)
- [EthGasPriceResult](modules.md#ethgaspriceresult)
- [EthGetBalanceHandler](modules.md#ethgetbalancehandler)
- [EthGetBalanceParams](modules.md#ethgetbalanceparams)
- [EthGetBalanceResult](modules.md#ethgetbalanceresult)
- [EthGetBlockByHashHandler](modules.md#ethgetblockbyhashhandler)
- [EthGetBlockByHashParams](modules.md#ethgetblockbyhashparams)
- [EthGetBlockByHashResult](modules.md#ethgetblockbyhashresult)
- [EthGetBlockByNumberHandler](modules.md#ethgetblockbynumberhandler)
- [EthGetBlockByNumberParams](modules.md#ethgetblockbynumberparams)
- [EthGetBlockByNumberResult](modules.md#ethgetblockbynumberresult)
- [EthGetBlockTransactionCountByHashHandler](modules.md#ethgetblocktransactioncountbyhashhandler)
- [EthGetBlockTransactionCountByHashParams](modules.md#ethgetblocktransactioncountbyhashparams)
- [EthGetBlockTransactionCountByHashResult](modules.md#ethgetblocktransactioncountbyhashresult)
- [EthGetBlockTransactionCountByNumberHandler](modules.md#ethgetblocktransactioncountbynumberhandler)
- [EthGetBlockTransactionCountByNumberParams](modules.md#ethgetblocktransactioncountbynumberparams)
- [EthGetBlockTransactionCountByNumberResult](modules.md#ethgetblocktransactioncountbynumberresult)
- [EthGetCodeHandler](modules.md#ethgetcodehandler)
- [EthGetCodeParams](modules.md#ethgetcodeparams)
- [EthGetCodeResult](modules.md#ethgetcoderesult)
- [EthGetFilterChangesHandler](modules.md#ethgetfilterchangeshandler)
- [EthGetFilterChangesParams](modules.md#ethgetfilterchangesparams)
- [EthGetFilterChangesResult](modules.md#ethgetfilterchangesresult)
- [EthGetFilterLogsHandler](modules.md#ethgetfilterlogshandler)
- [EthGetFilterLogsParams](modules.md#ethgetfilterlogsparams)
- [EthGetFilterLogsResult](modules.md#ethgetfilterlogsresult)
- [EthGetLogsHandler](modules.md#ethgetlogshandler)
- [EthGetLogsParams](modules.md#ethgetlogsparams)
- [EthGetLogsResult](modules.md#ethgetlogsresult)
- [EthGetStorageAtHandler](modules.md#ethgetstorageathandler)
- [EthGetStorageAtParams](modules.md#ethgetstorageatparams)
- [EthGetStorageAtResult](modules.md#ethgetstorageatresult)
- [EthGetTransactionByBlockHashAndIndexHandler](modules.md#ethgettransactionbyblockhashandindexhandler)
- [EthGetTransactionByBlockHashAndIndexParams](modules.md#ethgettransactionbyblockhashandindexparams)
- [EthGetTransactionByBlockHashAndIndexResult](modules.md#ethgettransactionbyblockhashandindexresult)
- [EthGetTransactionByBlockNumberAndIndexHandler](modules.md#ethgettransactionbyblocknumberandindexhandler)
- [EthGetTransactionByBlockNumberAndIndexParams](modules.md#ethgettransactionbyblocknumberandindexparams)
- [EthGetTransactionByBlockNumberAndIndexResult](modules.md#ethgettransactionbyblocknumberandindexresult)
- [EthGetTransactionByHashHandler](modules.md#ethgettransactionbyhashhandler)
- [EthGetTransactionByHashParams](modules.md#ethgettransactionbyhashparams)
- [EthGetTransactionByHashResult](modules.md#ethgettransactionbyhashresult)
- [EthGetTransactionCountHandler](modules.md#ethgettransactioncounthandler)
- [EthGetTransactionCountParams](modules.md#ethgettransactioncountparams)
- [EthGetTransactionCountResult](modules.md#ethgettransactioncountresult)
- [EthGetTransactionReceiptHandler](modules.md#ethgettransactionreceipthandler)
- [EthGetTransactionReceiptParams](modules.md#ethgettransactionreceiptparams)
- [EthGetTransactionReceiptResult](modules.md#ethgettransactionreceiptresult)
- [EthGetUncleByBlockHashAndIndexHandler](modules.md#ethgetunclebyblockhashandindexhandler)
- [EthGetUncleByBlockHashAndIndexParams](modules.md#ethgetunclebyblockhashandindexparams)
- [EthGetUncleByBlockHashAndIndexResult](modules.md#ethgetunclebyblockhashandindexresult)
- [EthGetUncleByBlockNumberAndIndexHandler](modules.md#ethgetunclebyblocknumberandindexhandler)
- [EthGetUncleByBlockNumberAndIndexParams](modules.md#ethgetunclebyblocknumberandindexparams)
- [EthGetUncleByBlockNumberAndIndexResult](modules.md#ethgetunclebyblocknumberandindexresult)
- [EthGetUncleCountByBlockHashHandler](modules.md#ethgetunclecountbyblockhashhandler)
- [EthGetUncleCountByBlockHashParams](modules.md#ethgetunclecountbyblockhashparams)
- [EthGetUncleCountByBlockHashResult](modules.md#ethgetunclecountbyblockhashresult)
- [EthGetUncleCountByBlockNumberHandler](modules.md#ethgetunclecountbyblocknumberhandler)
- [EthGetUncleCountByBlockNumberParams](modules.md#ethgetunclecountbyblocknumberparams)
- [EthGetUncleCountByBlockNumberResult](modules.md#ethgetunclecountbyblocknumberresult)
- [EthHashrateHandler](modules.md#ethhashratehandler)
- [EthHashrateParams](modules.md#ethhashrateparams)
- [EthHashrateResult](modules.md#ethhashrateresult)
- [EthMiningHandler](modules.md#ethmininghandler)
- [EthMiningParams](modules.md#ethminingparams)
- [EthMiningResult](modules.md#ethminingresult)
- [EthNewBlockFilterHandler](modules.md#ethnewblockfilterhandler)
- [EthNewBlockFilterParams](modules.md#ethnewblockfilterparams)
- [EthNewBlockFilterResult](modules.md#ethnewblockfilterresult)
- [EthNewFilterHandler](modules.md#ethnewfilterhandler)
- [EthNewFilterParams](modules.md#ethnewfilterparams)
- [EthNewFilterResult](modules.md#ethnewfilterresult)
- [EthNewPendingTransactionFilterHandler](modules.md#ethnewpendingtransactionfilterhandler)
- [EthNewPendingTransactionFilterParams](modules.md#ethnewpendingtransactionfilterparams)
- [EthNewPendingTransactionFilterResult](modules.md#ethnewpendingtransactionfilterresult)
- [EthParams](modules.md#ethparams)
- [EthProtocolVersionHandler](modules.md#ethprotocolversionhandler)
- [EthProtocolVersionParams](modules.md#ethprotocolversionparams)
- [EthProtocolVersionResult](modules.md#ethprotocolversionresult)
- [EthSendRawTransactionHandler](modules.md#ethsendrawtransactionhandler)
- [EthSendRawTransactionParams](modules.md#ethsendrawtransactionparams)
- [EthSendRawTransactionResult](modules.md#ethsendrawtransactionresult)
- [EthSendTransactionHandler](modules.md#ethsendtransactionhandler)
- [EthSendTransactionParams](modules.md#ethsendtransactionparams)
- [EthSendTransactionResult](modules.md#ethsendtransactionresult)
- [EthSignHandler](modules.md#ethsignhandler)
- [EthSignParams](modules.md#ethsignparams)
- [EthSignResult](modules.md#ethsignresult)
- [EthSignTransactionHandler](modules.md#ethsigntransactionhandler)
- [EthSignTransactionParams](modules.md#ethsigntransactionparams)
- [EthSignTransactionResult](modules.md#ethsigntransactionresult)
- [EthSyncingHandler](modules.md#ethsyncinghandler)
- [EthSyncingParams](modules.md#ethsyncingparams)
- [EthSyncingResult](modules.md#ethsyncingresult)
- [EthUninstallFilterHandler](modules.md#ethuninstallfilterhandler)
- [EthUninstallFilterParams](modules.md#ethuninstallfilterparams)
- [EthUninstallFilterResult](modules.md#ethuninstallfilterresult)
- [FilterLog](modules.md#filterlog)
- [FilterParams](modules.md#filterparams)
- [GetAccountHandler](modules.md#getaccounthandler)
- [GetAccountParams](modules.md#getaccountparams)
- [GetAccountResult](modules.md#getaccountresult)
- [Hex](modules.md#hex)
- [LoadStateHandler](modules.md#loadstatehandler)
- [LoadStateParams](modules.md#loadstateparams)
- [LoadStateResult](modules.md#loadstateresult)
- [Log](modules.md#log)
- [NetworkConfig](modules.md#networkconfig)
- [ScriptHandler](modules.md#scripthandler)
- [ScriptParams](modules.md#scriptparams)
- [ScriptResult](modules.md#scriptresult)
- [SetAccountHandler](modules.md#setaccounthandler)
- [SetAccountParams](modules.md#setaccountparams)
- [SetAccountResult](modules.md#setaccountresult)
- [StructLog](modules.md#structlog)
- [TraceCall](modules.md#tracecall)
- [TraceParams](modules.md#traceparams)
- [TraceResult](modules.md#traceresult)
- [TraceType](modules.md#tracetype)
- [TransactionParams](modules.md#transactionparams)
- [TransactionReceiptResult](modules.md#transactionreceiptresult)
- [TransactionResult](modules.md#transactionresult)

## Type Aliases

### Abi

Ƭ **Abi**: `_Abi`

A valid [Ethereum JSON ABI](https://docs.soliditylang.org/en/latest/abi-spec.html#json)

#### Defined in

[common/Abi.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/common/Abi.ts#L6)

___

### Address

Ƭ **Address**: `_Address`

An ethereum address represented as a hex string

**`See`**

https://abitype.dev/config#addresstype for configuration options to change type to being a string if preferred

#### Defined in

[common/Address.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/common/Address.ts#L7)

___

### AnvilDropTransactionHandler

Ƭ **AnvilDropTransactionHandler**: (`params`: [`AnvilDropTransactionParams`](modules.md#anvildroptransactionparams)) => `Promise`\<[`AnvilDropTransactionResult`](modules.md#anvildroptransactionresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilDropTransactionResult`](modules.md#anvildroptransactionresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilDropTransactionParams`](modules.md#anvildroptransactionparams) |

##### Returns

`Promise`\<[`AnvilDropTransactionResult`](modules.md#anvildroptransactionresult)\>

#### Defined in

[handlers/AnvilHandler.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/AnvilHandler.ts#L56)

___

### AnvilDropTransactionParams

Ƭ **AnvilDropTransactionParams**: `Object`

Params for `anvil_dropTransaction` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactionHash` | [`Hex`](modules.md#hex) | The transaction hash |

#### Defined in

[params/AnvilParams.ts:77](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/AnvilParams.ts#L77)

___

### AnvilDropTransactionResult

Ƭ **AnvilDropTransactionResult**: ``null``

#### Defined in

[result/AnvilResult.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/AnvilResult.ts#L17)

___

### AnvilDumpStateHandler

Ƭ **AnvilDumpStateHandler**: (`params`: [`AnvilDumpStateParams`](modules.md#anvildumpstateparams)) => `Promise`\<[`AnvilDumpStateResult`](modules.md#anvildumpstateresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilDumpStateResult`](modules.md#anvildumpstateresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilDumpStateParams`](modules.md#anvildumpstateparams) |

##### Returns

`Promise`\<[`AnvilDumpStateResult`](modules.md#anvildumpstateresult)\>

#### Defined in

[handlers/AnvilHandler.ts:81](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/AnvilHandler.ts#L81)

___

### AnvilDumpStateParams

Ƭ **AnvilDumpStateParams**: {} \| `undefined` \| `never`

Params for `anvil_dumpState` handler

#### Defined in

[params/AnvilParams.ts:164](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/AnvilParams.ts#L164)

___

### AnvilDumpStateResult

Ƭ **AnvilDumpStateResult**: [`Hex`](modules.md#hex)

#### Defined in

[result/AnvilResult.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/AnvilResult.ts#L30)

___

### AnvilGetAutomineHandler

Ƭ **AnvilGetAutomineHandler**: (`params`: [`AnvilGetAutomineParams`](modules.md#anvilgetautomineparams)) => `Promise`\<[`AnvilGetAutomineResult`](modules.md#anvilgetautomineresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilGetAutomineResult`](modules.md#anvilgetautomineresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilGetAutomineParams`](modules.md#anvilgetautomineparams) |

##### Returns

`Promise`\<[`AnvilGetAutomineResult`](modules.md#anvilgetautomineresult)\>

#### Defined in

[handlers/AnvilHandler.ts:44](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/AnvilHandler.ts#L44)

___

### AnvilGetAutomineParams

Ƭ **AnvilGetAutomineParams**: {} \| `undefined` \| `never`

Params for `anvil_getAutomine` handler

#### Defined in

[params/AnvilParams.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/AnvilParams.ts#L39)

___

### AnvilGetAutomineResult

Ƭ **AnvilGetAutomineResult**: `boolean`

#### Defined in

[result/AnvilResult.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/AnvilResult.ts#L11)

___

### AnvilImpersonateAccountHandler

Ƭ **AnvilImpersonateAccountHandler**: (`params`: [`AnvilImpersonateAccountParams`](modules.md#anvilimpersonateaccountparams)) => `Promise`\<[`AnvilImpersonateAccountResult`](modules.md#anvilimpersonateaccountresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilImpersonateAccountResult`](modules.md#anvilimpersonateaccountresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilImpersonateAccountParams`](modules.md#anvilimpersonateaccountparams) |

##### Returns

`Promise`\<[`AnvilImpersonateAccountResult`](modules.md#anvilimpersonateaccountresult)\>

#### Defined in

[handlers/AnvilHandler.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/AnvilHandler.ts#L33)

___

### AnvilImpersonateAccountParams

Ƭ **AnvilImpersonateAccountParams**: `Object`

Params fro `anvil_impersonateAccount` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`Address`](modules.md#address) | The address to impersonate |

#### Defined in

[params/AnvilParams.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/AnvilParams.ts#L10)

___

### AnvilImpersonateAccountResult

Ƭ **AnvilImpersonateAccountResult**: ``null``

#### Defined in

[result/AnvilResult.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/AnvilResult.ts#L4)

___

### AnvilLoadStateHandler

Ƭ **AnvilLoadStateHandler**: (`params`: [`AnvilLoadStateParams`](modules.md#anvilloadstateparams)) => `Promise`\<[`AnvilLoadStateResult`](modules.md#anvilloadstateresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilLoadStateResult`](modules.md#anvilloadstateresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilLoadStateParams`](modules.md#anvilloadstateparams) |

##### Returns

`Promise`\<[`AnvilLoadStateResult`](modules.md#anvilloadstateresult)\>

#### Defined in

[handlers/AnvilHandler.ts:86](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/AnvilHandler.ts#L86)

___

### AnvilLoadStateParams

Ƭ **AnvilLoadStateParams**: `Object`

Params for `anvil_loadState` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | `Record`\<[`Hex`](modules.md#hex), [`Hex`](modules.md#hex)\> | The state to load |

#### Defined in

[params/AnvilParams.ts:171](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/AnvilParams.ts#L171)

___

### AnvilLoadStateResult

Ƭ **AnvilLoadStateResult**: ``null``

#### Defined in

[result/AnvilResult.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/AnvilResult.ts#L33)

___

### AnvilMineHandler

Ƭ **AnvilMineHandler**: (`params`: [`AnvilMineParams`](modules.md#anvilmineparams)) => `Promise`\<[`AnvilMineResult`](modules.md#anvilmineresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilMineResult`](modules.md#anvilmineresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilMineParams`](modules.md#anvilmineparams) |

##### Returns

`Promise`\<[`AnvilMineResult`](modules.md#anvilmineresult)\>

#### Defined in

[handlers/AnvilHandler.ts:48](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/AnvilHandler.ts#L48)

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

[params/AnvilParams.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/AnvilParams.ts#L45)

___

### AnvilMineResult

Ƭ **AnvilMineResult**: ``null``

#### Defined in

[result/AnvilResult.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/AnvilResult.ts#L13)

___

### AnvilResetHandler

Ƭ **AnvilResetHandler**: (`params`: [`AnvilResetParams`](modules.md#anvilresetparams)) => `Promise`\<[`AnvilResetResult`](modules.md#anvilresetresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilResetResult`](modules.md#anvilresetresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilResetParams`](modules.md#anvilresetparams) |

##### Returns

`Promise`\<[`AnvilResetResult`](modules.md#anvilresetresult)\>

#### Defined in

[handlers/AnvilHandler.ts:52](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/AnvilHandler.ts#L52)

___

### AnvilResetParams

Ƭ **AnvilResetParams**: `Object`

Params for `anvil_reset` handler

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fork` | \{ `block?`: [`BlockTag`](modules.md#blocktag) \| [`Hex`](modules.md#hex) \| `BigInt` ; `url?`: `string`  } |
| `fork.block?` | [`BlockTag`](modules.md#blocktag) \| [`Hex`](modules.md#hex) \| `BigInt` |
| `fork.url?` | `string` |

#### Defined in

[params/AnvilParams.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/AnvilParams.ts#L60)

___

### AnvilResetResult

Ƭ **AnvilResetResult**: ``null``

#### Defined in

[result/AnvilResult.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/AnvilResult.ts#L15)

___

### AnvilSetBalanceHandler

Ƭ **AnvilSetBalanceHandler**: (`params`: [`AnvilSetBalanceParams`](modules.md#anvilsetbalanceparams)) => `Promise`\<[`AnvilSetBalanceResult`](modules.md#anvilsetbalanceresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilSetBalanceResult`](modules.md#anvilsetbalanceresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilSetBalanceParams`](modules.md#anvilsetbalanceparams) |

##### Returns

`Promise`\<[`AnvilSetBalanceResult`](modules.md#anvilsetbalanceresult)\>

#### Defined in

[handlers/AnvilHandler.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/AnvilHandler.ts#L60)

___

### AnvilSetBalanceParams

Ƭ **AnvilSetBalanceParams**: `Object`

Params for `anvil_setBalance` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`Address`](modules.md#address) | The address to set the balance for |
| `balance` | [`Hex`](modules.md#hex) \| `BigInt` | The balance to set |

#### Defined in

[params/AnvilParams.ts:88](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/AnvilParams.ts#L88)

___

### AnvilSetBalanceResult

Ƭ **AnvilSetBalanceResult**: ``null``

#### Defined in

[result/AnvilResult.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/AnvilResult.ts#L19)

___

### AnvilSetChainIdHandler

Ƭ **AnvilSetChainIdHandler**: (`params`: [`AnvilSetChainIdParams`](modules.md#anvilsetchainidparams)) => `Promise`\<[`AnvilSetChainIdResult`](modules.md#anvilsetchainidresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilSetChainIdResult`](modules.md#anvilsetchainidresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilSetChainIdParams`](modules.md#anvilsetchainidparams) |

##### Returns

`Promise`\<[`AnvilSetChainIdResult`](modules.md#anvilsetchainidresult)\>

#### Defined in

[handlers/AnvilHandler.ts:76](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/AnvilHandler.ts#L76)

___

### AnvilSetChainIdParams

Ƭ **AnvilSetChainIdParams**: `Object`

Params for `anvil_setChainId` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `chainId` | `number` | The chain id to set |

#### Defined in

[params/AnvilParams.ts:152](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/AnvilParams.ts#L152)

___

### AnvilSetChainIdResult

Ƭ **AnvilSetChainIdResult**: ``null``

#### Defined in

[result/AnvilResult.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/AnvilResult.ts#L27)

___

### AnvilSetCodeHandler

Ƭ **AnvilSetCodeHandler**: (`params`: [`AnvilSetCodeParams`](modules.md#anvilsetcodeparams)) => `Promise`\<[`AnvilSetCodeResult`](modules.md#anvilsetcoderesult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilSetCodeResult`](modules.md#anvilsetcoderesult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilSetCodeParams`](modules.md#anvilsetcodeparams) |

##### Returns

`Promise`\<[`AnvilSetCodeResult`](modules.md#anvilsetcoderesult)\>

#### Defined in

[handlers/AnvilHandler.ts:64](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/AnvilHandler.ts#L64)

___

### AnvilSetCodeParams

Ƭ **AnvilSetCodeParams**: `Object`

Params for `anvil_setCode` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`Address`](modules.md#address) | The address to set the code for |
| `code` | [`Hex`](modules.md#hex) | The code to set |

#### Defined in

[params/AnvilParams.ts:103](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/AnvilParams.ts#L103)

___

### AnvilSetCodeResult

Ƭ **AnvilSetCodeResult**: ``null``

#### Defined in

[result/AnvilResult.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/AnvilResult.ts#L21)

___

### AnvilSetNonceHandler

Ƭ **AnvilSetNonceHandler**: (`params`: [`AnvilSetNonceParams`](modules.md#anvilsetnonceparams)) => `Promise`\<[`AnvilSetNonceResult`](modules.md#anvilsetnonceresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilSetNonceResult`](modules.md#anvilsetnonceresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilSetNonceParams`](modules.md#anvilsetnonceparams) |

##### Returns

`Promise`\<[`AnvilSetNonceResult`](modules.md#anvilsetnonceresult)\>

#### Defined in

[handlers/AnvilHandler.ts:68](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/AnvilHandler.ts#L68)

___

### AnvilSetNonceParams

Ƭ **AnvilSetNonceParams**: `Object`

Params for `anvil_setNonce` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`Address`](modules.md#address) | The address to set the nonce for |
| `nonce` | `BigInt` | The nonce to set |

#### Defined in

[params/AnvilParams.ts:118](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/AnvilParams.ts#L118)

___

### AnvilSetNonceResult

Ƭ **AnvilSetNonceResult**: ``null``

#### Defined in

[result/AnvilResult.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/AnvilResult.ts#L23)

___

### AnvilSetStorageAtHandler

Ƭ **AnvilSetStorageAtHandler**: (`params`: [`AnvilSetStorageAtParams`](modules.md#anvilsetstorageatparams)) => `Promise`\<[`AnvilSetStorageAtResult`](modules.md#anvilsetstorageatresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilSetStorageAtResult`](modules.md#anvilsetstorageatresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilSetStorageAtParams`](modules.md#anvilsetstorageatparams) |

##### Returns

`Promise`\<[`AnvilSetStorageAtResult`](modules.md#anvilsetstorageatresult)\>

#### Defined in

[handlers/AnvilHandler.ts:72](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/AnvilHandler.ts#L72)

___

### AnvilSetStorageAtParams

Ƭ **AnvilSetStorageAtParams**: `Object`

Params for `anvil_setStorageAt` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`Address`](modules.md#address) | The address to set the storage for |
| `position` | [`Hex`](modules.md#hex) \| `BigInt` | The position in storage to set |
| `value` | [`Hex`](modules.md#hex) \| `BigInt` | The value to set |

#### Defined in

[params/AnvilParams.ts:133](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/AnvilParams.ts#L133)

___

### AnvilSetStorageAtResult

Ƭ **AnvilSetStorageAtResult**: ``null``

#### Defined in

[result/AnvilResult.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/AnvilResult.ts#L25)

___

### AnvilStopImpersonatingAccountHandler

Ƭ **AnvilStopImpersonatingAccountHandler**: (`params`: [`AnvilStopImpersonatingAccountParams`](modules.md#anvilstopimpersonatingaccountparams)) => `Promise`\<[`AnvilStopImpersonatingAccountResult`](modules.md#anvilstopimpersonatingaccountresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilStopImpersonatingAccountResult`](modules.md#anvilstopimpersonatingaccountresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilStopImpersonatingAccountParams`](modules.md#anvilstopimpersonatingaccountparams) |

##### Returns

`Promise`\<[`AnvilStopImpersonatingAccountResult`](modules.md#anvilstopimpersonatingaccountresult)\>

#### Defined in

[handlers/AnvilHandler.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/AnvilHandler.ts#L37)

___

### AnvilStopImpersonatingAccountParams

Ƭ **AnvilStopImpersonatingAccountParams**: `Object`

Params for `anvil_stopImpersonatingAccount` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`Address`](modules.md#address) | The address to stop impersonating |

#### Defined in

[params/AnvilParams.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/AnvilParams.ts#L21)

___

### AnvilStopImpersonatingAccountResult

Ƭ **AnvilStopImpersonatingAccountResult**: ``null``

#### Defined in

[result/AnvilResult.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/AnvilResult.ts#L6)

___

### BaseCallParams

Ƭ **BaseCallParams**\<`TThrowOnFail`\>: `BaseParams`\<`TThrowOnFail`\> & \{ `blobVersionedHashes?`: [`Hex`](modules.md#hex)[] ; `blockTag?`: [`BlockParam`](modules.md#blockparam) ; `caller?`: [`Address`](modules.md#address) ; `createTransaction?`: `boolean` ; `depth?`: `number` ; `from?`: [`Address`](modules.md#address) ; `gas?`: `bigint` ; `gasPrice?`: `bigint` ; `gasRefund?`: `bigint` ; `origin?`: [`Address`](modules.md#address) ; `selfdestruct?`: `Set`\<[`Address`](modules.md#address)\> ; `skipBalance?`: `boolean` ; `to?`: [`Address`](modules.md#address) ; `value?`: `bigint`  }

Properties shared accross call-like params

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TThrowOnFail` | extends `boolean` = `boolean` |

#### Defined in

[params/BaseCallParams.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/BaseCallParams.ts#L7)

___

### Block

Ƭ **Block**: `Object`

Header information of an ethereum block

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseFeePerGas?` | `bigint` | (Optional) The base fee per gas in the block, introduced in EIP-1559 for dynamic transaction fee calculation. |
| `blobGasPrice?` | `bigint` | The gas price for the block; may be undefined in blocks after EIP-1559. |
| `coinbase` | [`Address`](modules.md#address) | The address of the miner or validator who mined or validated the block. |
| `difficulty` | `bigint` | The difficulty level of the block (relevant in PoW chains). |
| `gasLimit` | `bigint` | The gas limit for the block, i.e., the maximum amount of gas that can be used by the transactions in the block. |
| `number` | `bigint` | The block number (height) in the blockchain. |
| `timestamp` | `bigint` | The timestamp at which the block was mined or validated. |

#### Defined in

[common/Block.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/common/Block.ts#L6)

___

### BlockParam

Ƭ **BlockParam**: [`BlockTag`](modules.md#blocktag) \| `Hex` \| `bigint`

#### Defined in

[common/BlockParam.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/common/BlockParam.ts#L4)

___

### BlockResult

Ƭ **BlockResult**: `Object`

The type returned by block related
json rpc procedures

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `difficulty` | [`Hex`](modules.md#hex) | - |
| `extraData` | [`Hex`](modules.md#hex) | - |
| `gasLimit` | [`Hex`](modules.md#hex) | - |
| `gasUsed` | [`Hex`](modules.md#hex) | - |
| `hash` | [`Hex`](modules.md#hex) | The hex stringhash of the block. |
| `logsBloom` | [`Hex`](modules.md#hex) | - |
| `miner` | [`Hex`](modules.md#hex) | - |
| `nonce` | [`Hex`](modules.md#hex) | - |
| `number` | [`Hex`](modules.md#hex) | The block number (height) in the blockchain. |
| `parentHash` | [`Hex`](modules.md#hex) | The hex stringhash of the parent block. |
| `sha3Uncles` | [`Hex`](modules.md#hex) | The hex stringhash of the uncles of the block. |
| `size` | [`Hex`](modules.md#hex) | - |
| `stateRoot` | [`Hex`](modules.md#hex) | - |
| `timestamp` | [`Hex`](modules.md#hex) | - |
| `totalDifficulty` | [`Hex`](modules.md#hex) | - |
| `transactions` | [`Hex`](modules.md#hex)[] | - |
| `transactionsRoot` | [`Hex`](modules.md#hex) | - |
| `uncles` | [`Hex`](modules.md#hex)[] | - |

#### Defined in

[common/BlockResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/common/BlockResult.ts#L7)

___

### BlockTag

Ƭ **BlockTag**: ``"latest"`` \| ``"earliest"`` \| ``"pending"`` \| ``"safe"`` \| ``"finalized"``

#### Defined in

[common/BlockTag.ts:1](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/common/BlockTag.ts#L1)

___

### CallHandler

Ƭ **CallHandler**: (`action`: [`CallParams`](modules.md#callparams)) => `Promise`\<[`CallResult`](modules.md#callresult)\>

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

▸ (`action`): `Promise`\<[`CallResult`](modules.md#callresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `action` | [`CallParams`](modules.md#callparams) |

##### Returns

`Promise`\<[`CallResult`](modules.md#callresult)\>

#### Defined in

[handlers/CallHandler.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/CallHandler.ts#L20)

___

### CallParams

Ƭ **CallParams**\<`TThrowOnFail`\>: [`BaseCallParams`](modules.md#basecallparams)\<`TThrowOnFail`\> & \{ `data?`: [`Hex`](modules.md#hex) ; `deployedBytecode?`: [`Hex`](modules.md#hex) ; `salt?`: [`Hex`](modules.md#hex)  }

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

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TThrowOnFail` | extends `boolean` = `boolean` |

#### Defined in

[params/CallParams.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/CallParams.ts#L16)

___

### CallResult

Ƭ **CallResult**\<`ErrorType`\>: `Object`

Result of a Tevm VM Call method

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ErrorType` | `CallError` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `blobGasUsed?` | `bigint` | Amount of blob gas consumed by the transaction |
| `createdAddress?` | [`Address`](modules.md#address) | Address of created account during transaction, if any |
| `createdAddresses?` | `Set`\<[`Address`](modules.md#address)\> | Map of addresses which were created (used in EIP 6780) |
| `errors?` | `ErrorType`[] | Description of the exception, if any occurred |
| `executionGasUsed` | `bigint` | Amount of gas the code used to run |
| `gas?` | `bigint` | Amount of gas left |
| `gasRefund?` | `bigint` | The gas refund counter as a uint256 |
| `logs?` | [`Log`](modules.md#log)[] | Array of logs that the contract emitted |
| `rawData` | [`Hex`](modules.md#hex) | Encoded return value from the contract as hex string |
| `selfdestruct?` | `Set`\<[`Address`](modules.md#address)\> | A set of accounts to selfdestruct |

#### Defined in

[result/CallResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/CallResult.ts#L7)

___

### ContractHandler

Ƭ **ContractHandler**: \<TAbi, TFunctionName\>(`action`: [`ContractParams`](modules.md#contractparams)\<`TAbi`, `TFunctionName`\>) => `Promise`\<[`ContractResult`](modules.md#contractresult)\<`TAbi`, `TFunctionName`\>\>

Handler for contract tevm procedure
It's API resuses the viem `contractRead`/`contractWrite` API to encode abi, functionName, and args

#### Type declaration

▸ \<`TAbi`, `TFunctionName`\>(`action`): `Promise`\<[`ContractResult`](modules.md#contractresult)\<`TAbi`, `TFunctionName`\>\>

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

[handlers/ContractHandler.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/ContractHandler.ts#L11)

___

### ContractParams

Ƭ **ContractParams**\<`TAbi`, `TFunctionName`, `TThrowOnFail`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](modules.md#basecallparams)\<`TThrowOnFail`\> & \{ `to`: [`Address`](modules.md#address)  }

Tevm params to execute a call on a contract

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends [`Abi`](modules.md#abi) \| readonly `unknown`[] = [`Abi`](modules.md#abi) |
| `TFunctionName` | extends `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\> |
| `TThrowOnFail` | extends `boolean` = `boolean` |

#### Defined in

[params/ContractParams.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/ContractParams.ts#L11)

___

### ContractResult

Ƭ **ContractResult**\<`TAbi`, `TFunctionName`, `ErrorType`\>: `Omit`\<[`CallResult`](modules.md#callresult), ``"errors"``\> & \{ `data`: `DecodeFunctionResultReturnType`\<`TAbi`, `TFunctionName`\> ; `errors?`: `never`  } \| [`CallResult`](modules.md#callresult)\<`ErrorType`\> & \{ `data?`: `never`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends [`Abi`](modules.md#abi) \| readonly `unknown`[] = [`Abi`](modules.md#abi) |
| `TFunctionName` | extends `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\> |
| `ErrorType` | `ContractError` |

#### Defined in

[result/ContractResult.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/ContractResult.ts#L9)

___

### DebugTraceCallHandler

Ƭ **DebugTraceCallHandler**: (`params`: [`DebugTraceCallParams`](modules.md#debugtracecallparams)) => `Promise`\<[`DebugTraceCallResult`](modules.md#debugtracecallresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`DebugTraceCallResult`](modules.md#debugtracecallresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`DebugTraceCallParams`](modules.md#debugtracecallparams) |

##### Returns

`Promise`\<[`DebugTraceCallResult`](modules.md#debugtracecallresult)\>

#### Defined in

[handlers/DebugHandler.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/DebugHandler.ts#L16)

___

### DebugTraceCallParams

Ƭ **DebugTraceCallParams**: [`TraceParams`](modules.md#traceparams) & [`EthCallParams`](modules.md#ethcallparams)

Params taken by `debug_traceCall` handler

#### Defined in

[params/DebugParams.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/DebugParams.ts#L60)

___

### DebugTraceCallResult

Ƭ **DebugTraceCallResult**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `failed` | `boolean` |
| `gas` | `bigint` |
| `returnValue` | [`Hex`](modules.md#hex) |
| `structLogs` | `ReadonlyArray`\<[`StructLog`](modules.md#structlog)\> |

#### Defined in

[result/DebugResult.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/DebugResult.ts#L16)

___

### DebugTraceTransactionHandler

Ƭ **DebugTraceTransactionHandler**: (`params`: [`DebugTraceTransactionParams`](modules.md#debugtracetransactionparams)\<`boolean`\>) => `Promise`\<[`DebugTraceTransactionResult`](modules.md#debugtracetransactionresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`DebugTraceTransactionResult`](modules.md#debugtracetransactionresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`DebugTraceTransactionParams`](modules.md#debugtracetransactionparams)\<`boolean`\> |

##### Returns

`Promise`\<[`DebugTraceTransactionResult`](modules.md#debugtracetransactionresult)\>

#### Defined in

[handlers/DebugHandler.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/DebugHandler.ts#L12)

___

### DebugTraceTransactionParams

Ƭ **DebugTraceTransactionParams**\<`TThrowOnError`\>: `BaseParams`\<`TThrowOnError`\> & [`TraceParams`](modules.md#traceparams) & \{ `transactionHash`: [`Hex`](modules.md#hex)  }

Params taken by `debug_traceTransaction` handler

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TThrowOnError` | extends `boolean` = `boolean` |

#### Defined in

[params/DebugParams.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/DebugParams.ts#L46)

___

### DebugTraceTransactionResult

Ƭ **DebugTraceTransactionResult**: [`TraceResult`](modules.md#traceresult)

#### Defined in

[result/DebugResult.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/DebugResult.ts#L14)

___

### DumpStateHandler

Ƭ **DumpStateHandler**: (`params?`: `BaseParams`) => `Promise`\<[`DumpStateResult`](modules.md#dumpstateresult)\>

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

▸ (`params?`): `Promise`\<[`DumpStateResult`](modules.md#dumpstateresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `BaseParams` |

##### Returns

`Promise`\<[`DumpStateResult`](modules.md#dumpstateresult)\>

#### Defined in

[handlers/DumpStateHandler.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/DumpStateHandler.ts#L21)

___

### DumpStateResult

Ƭ **DumpStateResult**\<`ErrorType`\>: `Object`

Result of the dumpState method

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ErrorType` | `DumpStateError` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `errors?` | `ErrorType`[] | Description of the exception, if any occurred |
| `state` | `SerializableTevmState` | The serialized tevm state |

#### Defined in

[result/DumpStateResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/DumpStateResult.ts#L7)

___

### EmptyParams

Ƭ **EmptyParams**: readonly [] \| {} \| `undefined` \| `never`

#### Defined in

[common/EmptyParams.ts:1](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/common/EmptyParams.ts#L1)

___

### EthAccountsHandler

Ƭ **EthAccountsHandler**: (`request?`: [`EthAccountsParams`](modules.md#ethaccountsparams)) => `Promise`\<[`EthAccountsResult`](modules.md#ethaccountsresult)\>

#### Type declaration

▸ (`request?`): `Promise`\<[`EthAccountsResult`](modules.md#ethaccountsresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request?` | [`EthAccountsParams`](modules.md#ethaccountsparams) |

##### Returns

`Promise`\<[`EthAccountsResult`](modules.md#ethaccountsresult)\>

#### Defined in

[handlers/EthHandler.ts:83](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L83)

___

### EthAccountsParams

Ƭ **EthAccountsParams**: [`EmptyParams`](modules.md#emptyparams)

Params taken by `eth_accounts` handler (no params)

#### Defined in

[params/EthParams.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L14)

___

### EthAccountsResult

Ƭ **EthAccountsResult**: [`Address`](modules.md#address)[]

#### Defined in

[result/EthResult.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L13)

___

### EthBlockNumberHandler

Ƭ **EthBlockNumberHandler**: (`request?`: [`EthBlockNumberParams`](modules.md#ethblocknumberparams)) => `Promise`\<[`EthBlockNumberResult`](modules.md#ethblocknumberresult)\>

#### Type declaration

▸ (`request?`): `Promise`\<[`EthBlockNumberResult`](modules.md#ethblocknumberresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request?` | [`EthBlockNumberParams`](modules.md#ethblocknumberparams) |

##### Returns

`Promise`\<[`EthBlockNumberResult`](modules.md#ethblocknumberresult)\>

#### Defined in

[handlers/EthHandler.ts:87](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L87)

___

### EthBlockNumberParams

Ƭ **EthBlockNumberParams**: [`EmptyParams`](modules.md#emptyparams)

Based on the JSON-RPC request for `eth_blockNumber` procedure (no params)

#### Defined in

[params/EthParams.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L19)

___

### EthBlockNumberResult

Ƭ **EthBlockNumberResult**: `bigint`

JSON-RPC response for `eth_blockNumber` procedure

#### Defined in

[result/EthResult.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L18)

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

[handlers/EthHandler.ts:91](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L91)

___

### EthCallParams

Ƭ **EthCallParams**: `Object`

Based on the JSON-RPC request for `eth_call` procedure

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockTag?` | [`BlockParam`](modules.md#blockparam) | The block number hash or block tag |
| `data?` | [`Hex`](modules.md#hex) | The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation Defaults to zero data |
| `from?` | [`Address`](modules.md#address) | The address from which the transaction is sent. Defaults to zero address |
| `gas?` | `bigint` | The integer of gas provided for the transaction execution |
| `gasPrice?` | `bigint` | The integer of gasPrice used for each paid gas |
| `to?` | [`Address`](modules.md#address) | The address to which the transaction is addressed. Defaults to zero address |
| `value?` | `bigint` | The integer of value sent with this transaction |

#### Defined in

[params/EthParams.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L24)

___

### EthCallResult

Ƭ **EthCallResult**: [`Hex`](modules.md#hex)

JSON-RPC response for `eth_call` procedure

#### Defined in

[result/EthResult.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L24)

___

### EthChainIdHandler

Ƭ **EthChainIdHandler**: (`request?`: [`EthChainIdParams`](modules.md#ethchainidparams)) => `Promise`\<[`EthChainIdResult`](modules.md#ethchainidresult)\>

#### Type declaration

▸ (`request?`): `Promise`\<[`EthChainIdResult`](modules.md#ethchainidresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request?` | [`EthChainIdParams`](modules.md#ethchainidparams) |

##### Returns

`Promise`\<[`EthChainIdResult`](modules.md#ethchainidresult)\>

#### Defined in

[handlers/EthHandler.ts:93](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L93)

___

### EthChainIdParams

Ƭ **EthChainIdParams**: [`EmptyParams`](modules.md#emptyparams)

Based on the JSON-RPC request for `eth_chainId` procedure

#### Defined in

[params/EthParams.ts:61](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L61)

___

### EthChainIdResult

Ƭ **EthChainIdResult**: `bigint`

JSON-RPC response for `eth_chainId` procedure

#### Defined in

[result/EthResult.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L30)

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

[handlers/EthHandler.ts:97](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L97)

___

### EthCoinbaseParams

Ƭ **EthCoinbaseParams**: [`EmptyParams`](modules.md#emptyparams)

Based on the JSON-RPC request for `eth_coinbase` procedure

#### Defined in

[params/EthParams.ts:66](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L66)

___

### EthCoinbaseResult

Ƭ **EthCoinbaseResult**: [`Address`](modules.md#address)

JSON-RPC response for `eth_coinbase` procedure

#### Defined in

[result/EthResult.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L36)

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

[handlers/EthHandler.ts:101](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L101)

___

### EthEstimateGasParams

Ƭ **EthEstimateGasParams**: [`CallParams`](modules.md#callparams)

Based on the JSON-RPC request for `eth_estimateGas` procedure
This type is a placeholder

#### Defined in

[params/EthParams.ts:72](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L72)

___

### EthEstimateGasResult

Ƭ **EthEstimateGasResult**: `bigint`

JSON-RPC response for `eth_estimateGas` procedure

#### Defined in

[result/EthResult.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L42)

___

### EthGasPriceHandler

Ƭ **EthGasPriceHandler**: (`request?`: [`EthGasPriceParams`](modules.md#ethgaspriceparams)) => `Promise`\<[`EthGasPriceResult`](modules.md#ethgaspriceresult)\>

#### Type declaration

▸ (`request?`): `Promise`\<[`EthGasPriceResult`](modules.md#ethgaspriceresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request?` | [`EthGasPriceParams`](modules.md#ethgaspriceparams) |

##### Returns

`Promise`\<[`EthGasPriceResult`](modules.md#ethgaspriceresult)\>

#### Defined in

[handlers/EthHandler.ts:109](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L109)

___

### EthGasPriceParams

Ƭ **EthGasPriceParams**: [`EmptyParams`](modules.md#emptyparams)

Based on the JSON-RPC request for `eth_gasPrice` procedure

#### Defined in

[params/EthParams.ts:82](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L82)

___

### EthGasPriceResult

Ƭ **EthGasPriceResult**: `bigint`

JSON-RPC response for `eth_gasPrice` procedure

#### Defined in

[result/EthResult.ts:54](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L54)

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

[handlers/EthHandler.ts:113](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L113)

___

### EthGetBalanceParams

Ƭ **EthGetBalanceParams**: `Object`

Based on the  JSON-RPC request for `eth_getBalance` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | [`Address`](modules.md#address) |
| `blockTag?` | [`BlockParam`](modules.md#blockparam) |

#### Defined in

[params/EthParams.ts:87](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L87)

___

### EthGetBalanceResult

Ƭ **EthGetBalanceResult**: `bigint`

JSON-RPC response for `eth_getBalance` procedure

#### Defined in

[result/EthResult.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L60)

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

[handlers/EthHandler.ts:117](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L117)

___

### EthGetBlockByHashParams

Ƭ **EthGetBlockByHashParams**: `Object`

Based on the JSON-RPC request for `eth_getBlockByHash` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockHash` | [`Hex`](modules.md#hex) |
| `fullTransactionObjects` | `boolean` |

#### Defined in

[params/EthParams.ts:92](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L92)

___

### EthGetBlockByHashResult

Ƭ **EthGetBlockByHashResult**: [`BlockResult`](modules.md#blockresult)

JSON-RPC response for `eth_getBlockByHash` procedure

#### Defined in

[result/EthResult.ts:66](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L66)

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

[handlers/EthHandler.ts:121](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L121)

___

### EthGetBlockByNumberParams

Ƭ **EthGetBlockByNumberParams**: `Object`

Based on the JSON-RPC request for `eth_getBlockByNumber` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockTag?` | [`BlockParam`](modules.md#blockparam) |
| `fullTransactionObjects` | `boolean` |

#### Defined in

[params/EthParams.ts:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L100)

___

### EthGetBlockByNumberResult

Ƭ **EthGetBlockByNumberResult**: [`BlockResult`](modules.md#blockresult)

JSON-RPC response for `eth_getBlockByNumber` procedure

#### Defined in

[result/EthResult.ts:72](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L72)

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

[handlers/EthHandler.ts:125](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L125)

___

### EthGetBlockTransactionCountByHashParams

Ƭ **EthGetBlockTransactionCountByHashParams**: `Object`

Based on the JSON-RPC request for `eth_getBlockTransactionCountByHash` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `hash` | [`Hex`](modules.md#hex) |

#### Defined in

[params/EthParams.ts:108](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L108)

___

### EthGetBlockTransactionCountByHashResult

Ƭ **EthGetBlockTransactionCountByHashResult**: [`Hex`](modules.md#hex)

JSON-RPC response for `eth_getBlockTransactionCountByHash` procedure

#### Defined in

[result/EthResult.ts:77](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L77)

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

[handlers/EthHandler.ts:129](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L129)

___

### EthGetBlockTransactionCountByNumberParams

Ƭ **EthGetBlockTransactionCountByNumberParams**: `Object`

Based on the JSON-RPC request for `eth_getBlockTransactionCountByNumber` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockTag?` | [`BlockParam`](modules.md#blockparam) |

#### Defined in

[params/EthParams.ts:113](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L113)

___

### EthGetBlockTransactionCountByNumberResult

Ƭ **EthGetBlockTransactionCountByNumberResult**: [`Hex`](modules.md#hex)

JSON-RPC response for `eth_getBlockTransactionCountByNumber` procedure

#### Defined in

[result/EthResult.ts:83](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L83)

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

[handlers/EthHandler.ts:133](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L133)

___

### EthGetCodeParams

Ƭ **EthGetCodeParams**: `Object`

Based on the JSON-RPC request for `eth_getCode` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | [`Address`](modules.md#address) |
| `blockTag?` | [`BlockParam`](modules.md#blockparam) |

#### Defined in

[params/EthParams.ts:120](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L120)

___

### EthGetCodeResult

Ƭ **EthGetCodeResult**: [`Hex`](modules.md#hex)

JSON-RPC response for `eth_getCode` procedure

#### Defined in

[result/EthResult.ts:89](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L89)

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

[handlers/EthHandler.ts:137](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L137)

___

### EthGetFilterChangesParams

Ƭ **EthGetFilterChangesParams**: `Object`

Based on the JSON-RPC request for `eth_getFilterChanges` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `filterId` | [`Hex`](modules.md#hex) |

#### Defined in

[params/EthParams.ts:125](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L125)

___

### EthGetFilterChangesResult

Ƭ **EthGetFilterChangesResult**: [`FilterLog`](modules.md#filterlog)[]

JSON-RPC response for `eth_getFilterChanges` procedure

#### Defined in

[result/EthResult.ts:95](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L95)

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

[handlers/EthHandler.ts:141](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L141)

___

### EthGetFilterLogsParams

Ƭ **EthGetFilterLogsParams**: `Object`

Based on the JSON-RPC request for `eth_getFilterLogs` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `filterId` | [`Hex`](modules.md#hex) |

#### Defined in

[params/EthParams.ts:130](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L130)

___

### EthGetFilterLogsResult

Ƭ **EthGetFilterLogsResult**: [`FilterLog`](modules.md#filterlog)[]

JSON-RPC response for `eth_getFilterLogs` procedure

#### Defined in

[result/EthResult.ts:101](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L101)

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

[handlers/EthHandler.ts:145](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L145)

___

### EthGetLogsParams

Ƭ **EthGetLogsParams**: `Object`

Based on the JSON-RPC request for `eth_getLogs` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `filterParams` | [`FilterParams`](modules.md#filterparams) |

#### Defined in

[params/EthParams.ts:135](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L135)

___

### EthGetLogsResult

Ƭ **EthGetLogsResult**: [`FilterLog`](modules.md#filterlog)[]

JSON-RPC response for `eth_getLogs` procedure

#### Defined in

[result/EthResult.ts:107](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L107)

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

[handlers/EthHandler.ts:149](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L149)

___

### EthGetStorageAtParams

Ƭ **EthGetStorageAtParams**: `Object`

Based on the JSON-RPC request for `eth_getStorageAt` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | [`Address`](modules.md#address) |
| `blockTag?` | [`BlockParam`](modules.md#blockparam) |
| `position` | [`Hex`](modules.md#hex) |

#### Defined in

[params/EthParams.ts:140](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L140)

___

### EthGetStorageAtResult

Ƭ **EthGetStorageAtResult**: [`Hex`](modules.md#hex)

JSON-RPC response for `eth_getStorageAt` procedure

#### Defined in

[result/EthResult.ts:113](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L113)

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

[handlers/EthHandler.ts:169](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L169)

___

### EthGetTransactionByBlockHashAndIndexParams

Ƭ **EthGetTransactionByBlockHashAndIndexParams**: `Object`

Based on the JSON-RPC request for `eth_getTransactionByBlockHashAndIndex` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockTag?` | [`Hex`](modules.md#hex) |
| `index` | [`Hex`](modules.md#hex) |

#### Defined in

[params/EthParams.ts:172](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L172)

___

### EthGetTransactionByBlockHashAndIndexResult

Ƭ **EthGetTransactionByBlockHashAndIndexResult**: [`TransactionResult`](modules.md#transactionresult)

JSON-RPC response for `eth_getTransactionByBlockHashAndIndex` procedure

#### Defined in

[result/EthResult.ts:143](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L143)

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

[handlers/EthHandler.ts:173](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L173)

___

### EthGetTransactionByBlockNumberAndIndexParams

Ƭ **EthGetTransactionByBlockNumberAndIndexParams**: `Object`

Based on the JSON-RPC request for `eth_getTransactionByBlockNumberAndIndex` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockTag?` | [`BlockParam`](modules.md#blockparam) |
| `index` | [`Hex`](modules.md#hex) |

#### Defined in

[params/EthParams.ts:180](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L180)

___

### EthGetTransactionByBlockNumberAndIndexResult

Ƭ **EthGetTransactionByBlockNumberAndIndexResult**: [`TransactionResult`](modules.md#transactionresult)

JSON-RPC response for `eth_getTransactionByBlockNumberAndIndex` procedure

#### Defined in

[result/EthResult.ts:149](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L149)

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

[handlers/EthHandler.ts:165](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L165)

___

### EthGetTransactionByHashParams

Ƭ **EthGetTransactionByHashParams**: `Object`

Based on the JSON-RPC request for `eth_getTransactionByHash` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | [`Hex`](modules.md#hex) |

#### Defined in

[params/EthParams.ts:167](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L167)

___

### EthGetTransactionByHashResult

Ƭ **EthGetTransactionByHashResult**: [`TransactionResult`](modules.md#transactionresult)

JSON-RPC response for `eth_getTransactionByHash` procedure

#### Defined in

[result/EthResult.ts:137](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L137)

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

[handlers/EthHandler.ts:153](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L153)

___

### EthGetTransactionCountParams

Ƭ **EthGetTransactionCountParams**: `Object`

Based on the JSON-RPC request for `eth_getTransactionCount` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | [`Address`](modules.md#address) |
| `blockTag?` | [`BlockParam`](modules.md#blockparam) |

#### Defined in

[params/EthParams.ts:149](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L149)

___

### EthGetTransactionCountResult

Ƭ **EthGetTransactionCountResult**: [`Hex`](modules.md#hex)

JSON-RPC response for `eth_getTransactionCount` procedure

#### Defined in

[result/EthResult.ts:119](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L119)

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

[handlers/EthHandler.ts:177](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L177)

___

### EthGetTransactionReceiptParams

Ƭ **EthGetTransactionReceiptParams**: `Object`

Based on the JSON-RPC request for `eth_getTransactionReceipt` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `hash` | [`Hex`](modules.md#hex) |

#### Defined in

[params/EthParams.ts:188](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L188)

___

### EthGetTransactionReceiptResult

Ƭ **EthGetTransactionReceiptResult**: [`TransactionReceiptResult`](modules.md#transactionreceiptresult)

JSON-RPC response for `eth_getTransactionReceipt` procedure

#### Defined in

[result/EthResult.ts:155](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L155)

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

[handlers/EthHandler.ts:181](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L181)

___

### EthGetUncleByBlockHashAndIndexParams

Ƭ **EthGetUncleByBlockHashAndIndexParams**: `Object`

Based on the JSON-RPC request for `eth_getUncleByBlockHashAndIndex` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockHash` | [`Hex`](modules.md#hex) |
| `uncleIndex` | [`Hex`](modules.md#hex) |

#### Defined in

[params/EthParams.ts:193](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L193)

___

### EthGetUncleByBlockHashAndIndexResult

Ƭ **EthGetUncleByBlockHashAndIndexResult**: [`Hex`](modules.md#hex)

JSON-RPC response for `eth_getUncleByBlockHashAndIndex` procedure

#### Defined in

[result/EthResult.ts:161](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L161)

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

[handlers/EthHandler.ts:185](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L185)

___

### EthGetUncleByBlockNumberAndIndexParams

Ƭ **EthGetUncleByBlockNumberAndIndexParams**: `Object`

Based on the JSON-RPC request for `eth_getUncleByBlockNumberAndIndex` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockTag?` | [`BlockParam`](modules.md#blockparam) |
| `uncleIndex` | [`Hex`](modules.md#hex) |

#### Defined in

[params/EthParams.ts:201](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L201)

___

### EthGetUncleByBlockNumberAndIndexResult

Ƭ **EthGetUncleByBlockNumberAndIndexResult**: [`Hex`](modules.md#hex)

JSON-RPC response for `eth_getUncleByBlockNumberAndIndex` procedure

#### Defined in

[result/EthResult.ts:167](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L167)

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

[handlers/EthHandler.ts:157](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L157)

___

### EthGetUncleCountByBlockHashParams

Ƭ **EthGetUncleCountByBlockHashParams**: `Object`

Based on the JSON-RPC request for `eth_getUncleCountByBlockHash` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `hash` | [`Hex`](modules.md#hex) |

#### Defined in

[params/EthParams.ts:157](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L157)

___

### EthGetUncleCountByBlockHashResult

Ƭ **EthGetUncleCountByBlockHashResult**: [`Hex`](modules.md#hex)

JSON-RPC response for `eth_getUncleCountByBlockHash` procedure

#### Defined in

[result/EthResult.ts:125](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L125)

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

[handlers/EthHandler.ts:161](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L161)

___

### EthGetUncleCountByBlockNumberParams

Ƭ **EthGetUncleCountByBlockNumberParams**: `Object`

Based on the JSON-RPC request for `eth_getUncleCountByBlockNumber` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockTag?` | [`BlockParam`](modules.md#blockparam) |

#### Defined in

[params/EthParams.ts:162](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L162)

___

### EthGetUncleCountByBlockNumberResult

Ƭ **EthGetUncleCountByBlockNumberResult**: [`Hex`](modules.md#hex)

JSON-RPC response for `eth_getUncleCountByBlockNumber` procedure

#### Defined in

[result/EthResult.ts:131](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L131)

___

### EthHashrateHandler

Ƭ **EthHashrateHandler**: (`request?`: [`EthHashrateParams`](modules.md#ethhashrateparams)) => `Promise`\<[`EthHashrateResult`](modules.md#ethhashrateresult)\>

#### Type declaration

▸ (`request?`): `Promise`\<[`EthHashrateResult`](modules.md#ethhashrateresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request?` | [`EthHashrateParams`](modules.md#ethhashrateparams) |

##### Returns

`Promise`\<[`EthHashrateResult`](modules.md#ethhashrateresult)\>

#### Defined in

[handlers/EthHandler.ts:105](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L105)

___

### EthHashrateParams

Ƭ **EthHashrateParams**: [`EmptyParams`](modules.md#emptyparams)

Based on the JSON-RPC request for `eth_hashrate` procedure

#### Defined in

[params/EthParams.ts:77](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L77)

___

### EthHashrateResult

Ƭ **EthHashrateResult**: [`Hex`](modules.md#hex)

JSON-RPC response for `eth_hashrate` procedure

#### Defined in

[result/EthResult.ts:48](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L48)

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

[handlers/EthHandler.ts:189](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L189)

___

### EthMiningParams

Ƭ **EthMiningParams**: [`EmptyParams`](modules.md#emptyparams)

Based on the JSON-RPC request for `eth_mining` procedure

#### Defined in

[params/EthParams.ts:209](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L209)

___

### EthMiningResult

Ƭ **EthMiningResult**: `boolean`

JSON-RPC response for `eth_mining` procedure

#### Defined in

[result/EthResult.ts:173](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L173)

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

[handlers/EthHandler.ts:219](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L219)

___

### EthNewBlockFilterParams

Ƭ **EthNewBlockFilterParams**: [`EmptyParams`](modules.md#emptyparams)

Based on the JSON-RPC request for `eth_newBlockFilter` procedure (no params)

#### Defined in

[params/EthParams.ts:288](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L288)

___

### EthNewBlockFilterResult

Ƭ **EthNewBlockFilterResult**: [`Hex`](modules.md#hex)

JSON-RPC response for `eth_newBlockFilter` procedure

#### Defined in

[result/EthResult.ts:241](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L241)

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

[handlers/EthHandler.ts:215](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L215)

___

### EthNewFilterParams

Ƭ **EthNewFilterParams**: [`FilterParams`](modules.md#filterparams)

Based on the JSON-RPC request for `eth_newFilter` procedure

#### Defined in

[params/EthParams.ts:283](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L283)

___

### EthNewFilterResult

Ƭ **EthNewFilterResult**: [`Hex`](modules.md#hex)

JSON-RPC response for `eth_newFilter` procedure

#### Defined in

[result/EthResult.ts:235](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L235)

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

[handlers/EthHandler.ts:223](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L223)

___

### EthNewPendingTransactionFilterParams

Ƭ **EthNewPendingTransactionFilterParams**: [`EmptyParams`](modules.md#emptyparams)

Based on the JSON-RPC request for `eth_newPendingTransactionFilter` procedure

#### Defined in

[params/EthParams.ts:293](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L293)

___

### EthNewPendingTransactionFilterResult

Ƭ **EthNewPendingTransactionFilterResult**: [`Hex`](modules.md#hex)

JSON-RPC response for `eth_newPendingTransactionFilter` procedure

#### Defined in

[result/EthResult.ts:247](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L247)

___

### EthParams

Ƭ **EthParams**: [`EthAccountsParams`](modules.md#ethaccountsparams) \| [`EthAccountsParams`](modules.md#ethaccountsparams) \| [`EthBlockNumberParams`](modules.md#ethblocknumberparams) \| [`EthCallParams`](modules.md#ethcallparams) \| [`EthChainIdParams`](modules.md#ethchainidparams) \| [`EthCoinbaseParams`](modules.md#ethcoinbaseparams) \| [`EthEstimateGasParams`](modules.md#ethestimategasparams) \| [`EthHashrateParams`](modules.md#ethhashrateparams) \| [`EthGasPriceParams`](modules.md#ethgaspriceparams) \| [`EthGetBalanceParams`](modules.md#ethgetbalanceparams) \| [`EthGetBlockByHashParams`](modules.md#ethgetblockbyhashparams) \| [`EthGetBlockByNumberParams`](modules.md#ethgetblockbynumberparams) \| [`EthGetBlockTransactionCountByHashParams`](modules.md#ethgetblocktransactioncountbyhashparams) \| [`EthGetBlockTransactionCountByNumberParams`](modules.md#ethgetblocktransactioncountbynumberparams) \| [`EthGetCodeParams`](modules.md#ethgetcodeparams) \| [`EthGetFilterChangesParams`](modules.md#ethgetfilterchangesparams) \| [`EthGetFilterLogsParams`](modules.md#ethgetfilterlogsparams) \| [`EthGetLogsParams`](modules.md#ethgetlogsparams) \| [`EthGetStorageAtParams`](modules.md#ethgetstorageatparams) \| [`EthGetTransactionCountParams`](modules.md#ethgettransactioncountparams) \| [`EthGetUncleCountByBlockHashParams`](modules.md#ethgetunclecountbyblockhashparams) \| [`EthGetUncleCountByBlockNumberParams`](modules.md#ethgetunclecountbyblocknumberparams) \| [`EthGetTransactionByHashParams`](modules.md#ethgettransactionbyhashparams) \| [`EthGetTransactionByBlockHashAndIndexParams`](modules.md#ethgettransactionbyblockhashandindexparams) \| [`EthGetTransactionByBlockNumberAndIndexParams`](modules.md#ethgettransactionbyblocknumberandindexparams) \| [`EthGetTransactionReceiptParams`](modules.md#ethgettransactionreceiptparams) \| [`EthGetUncleByBlockHashAndIndexParams`](modules.md#ethgetunclebyblockhashandindexparams) \| [`EthGetUncleByBlockNumberAndIndexParams`](modules.md#ethgetunclebyblocknumberandindexparams) \| [`EthMiningParams`](modules.md#ethminingparams) \| [`EthProtocolVersionParams`](modules.md#ethprotocolversionparams) \| [`EthSendRawTransactionParams`](modules.md#ethsendrawtransactionparams) \| [`EthSendTransactionParams`](modules.md#ethsendtransactionparams) \| [`EthSignParams`](modules.md#ethsignparams) \| [`EthSignTransactionParams`](modules.md#ethsigntransactionparams) \| [`EthSyncingParams`](modules.md#ethsyncingparams) \| [`EthNewFilterParams`](modules.md#ethnewfilterparams) \| [`EthNewBlockFilterParams`](modules.md#ethnewblockfilterparams) \| [`EthNewPendingTransactionFilterParams`](modules.md#ethnewpendingtransactionfilterparams) \| [`EthUninstallFilterParams`](modules.md#ethuninstallfilterparams)

#### Defined in

[params/EthParams.ts:300](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L300)

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

[handlers/EthHandler.ts:193](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L193)

___

### EthProtocolVersionParams

Ƭ **EthProtocolVersionParams**: [`EmptyParams`](modules.md#emptyparams)

Based on the JSON-RPC request for `eth_protocolVersion` procedure

#### Defined in

[params/EthParams.ts:214](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L214)

___

### EthProtocolVersionResult

Ƭ **EthProtocolVersionResult**: [`Hex`](modules.md#hex)

JSON-RPC response for `eth_protocolVersion` procedure

#### Defined in

[result/EthResult.ts:179](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L179)

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

[handlers/EthHandler.ts:197](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L197)

___

### EthSendRawTransactionParams

Ƭ **EthSendRawTransactionParams**: [`CallParams`](modules.md#callparams)

Based on the JSON-RPC request for `eth_sendRawTransaction` procedure
This type is a placeholder

#### Defined in

[params/EthParams.ts:220](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L220)

___

### EthSendRawTransactionResult

Ƭ **EthSendRawTransactionResult**: [`Hex`](modules.md#hex)

JSON-RPC response for `eth_sendRawTransaction` procedure

#### Defined in

[result/EthResult.ts:185](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L185)

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

[handlers/EthHandler.ts:201](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L201)

___

### EthSendTransactionParams

Ƭ **EthSendTransactionParams**: [`CallParams`](modules.md#callparams)

Based on the JSON-RPC request for `eth_sendTransaction` procedure
This type is a placeholder

#### Defined in

[params/EthParams.ts:227](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L227)

___

### EthSendTransactionResult

Ƭ **EthSendTransactionResult**: [`Hex`](modules.md#hex)

JSON-RPC response for `eth_sendTransaction` procedure

#### Defined in

[result/EthResult.ts:191](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L191)

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

[handlers/EthHandler.ts:205](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L205)

___

### EthSignParams

Ƭ **EthSignParams**: `Object`

Based on the JSON-RPC request for `eth_sign` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | [`Address`](modules.md#address) |
| `data` | [`Hex`](modules.md#hex) |

#### Defined in

[params/EthParams.ts:233](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L233)

___

### EthSignResult

Ƭ **EthSignResult**: [`Hex`](modules.md#hex)

JSON-RPC response for `eth_sign` procedure

#### Defined in

[result/EthResult.ts:197](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L197)

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

[handlers/EthHandler.ts:207](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L207)

___

### EthSignTransactionParams

Ƭ **EthSignTransactionParams**: `Object`

Based on the JSON-RPC request for `eth_signTransaction` procedure

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `data?` | [`Hex`](modules.md#hex) | The compiled code of a contract OR the hash of the invoked method signature and encoded parameters. Optional if creating a contract. |
| `from` | [`Address`](modules.md#address) | The address from which the transaction is sent from |
| `gas?` | `bigint` | The gas provded for transaction execution. It will return unused gas. Default value is 90000 |
| `gasPrice?` | `bigint` | Integer of the gasPrice used for each paid gas, in Wei. If not provided tevm will default to the eth_gasPrice value |
| `nonce?` | `bigint` | Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce. |
| `to?` | [`Address`](modules.md#address) | The address the transaction is directed to. Optional if creating a contract |
| `value?` | `bigint` | Integer of the value sent with this transaction, in Wei. |

#### Defined in

[params/EthParams.ts:239](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L239)

___

### EthSignTransactionResult

Ƭ **EthSignTransactionResult**: [`Hex`](modules.md#hex)

JSON-RPC response for `eth_signTransaction` procedure

#### Defined in

[result/EthResult.ts:203](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L203)

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

[handlers/EthHandler.ts:211](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L211)

___

### EthSyncingParams

Ƭ **EthSyncingParams**: [`EmptyParams`](modules.md#emptyparams)

Based on the JSON-RPC request for `eth_syncing` procedure (no params)

#### Defined in

[params/EthParams.ts:278](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L278)

___

### EthSyncingResult

Ƭ **EthSyncingResult**: `boolean` \| \{ `currentBlock`: [`Hex`](modules.md#hex) ; `headedBytecodebytes?`: [`Hex`](modules.md#hex) ; `healedBytecodes?`: [`Hex`](modules.md#hex) ; `healedTrienodes?`: [`Hex`](modules.md#hex) ; `healingBytecode?`: [`Hex`](modules.md#hex) ; `healingTrienodes?`: [`Hex`](modules.md#hex) ; `highestBlock`: [`Hex`](modules.md#hex) ; `knownStates`: [`Hex`](modules.md#hex) ; `pulledStates`: [`Hex`](modules.md#hex) ; `startingBlock`: [`Hex`](modules.md#hex) ; `syncedBytecodeBytes?`: [`Hex`](modules.md#hex) ; `syncedBytecodes?`: [`Hex`](modules.md#hex) ; `syncedStorage?`: [`Hex`](modules.md#hex) ; `syncedStorageBytes?`: [`Hex`](modules.md#hex)  }

JSON-RPC response for `eth_syncing` procedure

#### Defined in

[result/EthResult.ts:209](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L209)

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

[handlers/EthHandler.ts:227](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/EthHandler.ts#L227)

___

### EthUninstallFilterParams

Ƭ **EthUninstallFilterParams**: `Object`

Based on the JSON-RPC request for `eth_uninstallFilter` procedure

#### Type declaration

| Name | Type |
| :------ | :------ |
| `filterId` | [`Hex`](modules.md#hex) |

#### Defined in

[params/EthParams.ts:298](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L298)

___

### EthUninstallFilterResult

Ƭ **EthUninstallFilterResult**: `boolean`

JSON-RPC response for `eth_uninstallFilter` procedure

#### Defined in

[result/EthResult.ts:253](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/EthResult.ts#L253)

___

### FilterLog

Ƭ **FilterLog**: `Object`

FilterLog type for eth JSON-RPC procedures

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | [`Hex`](modules.md#hex) |
| `blockHash` | [`Hex`](modules.md#hex) |
| `blockNumber` | [`Hex`](modules.md#hex) |
| `data` | [`Hex`](modules.md#hex) |
| `logIndex` | [`Hex`](modules.md#hex) |
| `removed` | `boolean` |
| `topics` | readonly [`Hex`](modules.md#hex)[] |
| `transactionHash` | [`Hex`](modules.md#hex) |
| `transactionIndex` | [`Hex`](modules.md#hex) |

#### Defined in

[common/FilterLog.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/common/FilterLog.ts#L6)

___

### FilterParams

Ƭ **FilterParams**: `Object`

An event filter optionsobject

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | [`Address`](modules.md#address) |
| `fromBlock` | [`BlockParam`](modules.md#blockparam) |
| `toBlock` | [`BlockParam`](modules.md#blockparam) |
| `topics` | `ReadonlyArray`\<[`Hex`](modules.md#hex)\> |

#### Defined in

[common/FilterParams.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/common/FilterParams.ts#L8)

___

### GetAccountHandler

Ƭ **GetAccountHandler**: (`params`: [`GetAccountParams`](modules.md#getaccountparams)) => `Promise`\<[`GetAccountResult`](modules.md#getaccountresult)\>

Gets the state of a specific ethereum address

**`Example`**

```ts
const res = tevm.getAccount({address: '0x123...'})
console.log(res.deployedBytecode)
console.log(res.nonce)
console.log(res.balance)
```

#### Type declaration

▸ (`params`): `Promise`\<[`GetAccountResult`](modules.md#getaccountresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`GetAccountParams`](modules.md#getaccountparams) |

##### Returns

`Promise`\<[`GetAccountResult`](modules.md#getaccountresult)\>

#### Defined in

[handlers/GetAccountHandler.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/GetAccountHandler.ts#L11)

___

### GetAccountParams

Ƭ **GetAccountParams**\<`TThrowOnFail`\>: `BaseParams`\<`TThrowOnFail`\> & \{ `address`: [`Address`](modules.md#address)  }

Tevm params to get an account

**`Example`**

```ts
const getAccountParams: import('@tevm/api').GetAccountParams = {
  address: '0x...',
}
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TThrowOnFail` | extends `boolean` = `boolean` |

#### Defined in

[params/GetAccountParams.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/GetAccountParams.ts#L11)

___

### GetAccountResult

Ƭ **GetAccountResult**\<`ErrorType`\>: `Object`

Result of GetAccount Action

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ErrorType` | `GetAccountError` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`Address`](modules.md#address) | Address of account |
| `balance?` | `bigint` | Balance to set account to |
| `codeHash?` | [`Hex`](modules.md#hex) | Code hash to set account to |
| `deployedBytecode?` | [`Hex`](modules.md#hex) | Contract bytecode to set account to |
| `errors?` | `ErrorType`[] | Description of the exception, if any occurred |
| `isContract?` | `boolean` | True if account is a contract |
| `isEmpty?` | `boolean` | True if account is empty |
| `nonce?` | `bigint` | Nonce to set account to |
| `storageRoot?` | [`Hex`](modules.md#hex) | Storage root to set account to |

#### Defined in

[result/GetAccountResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/GetAccountResult.ts#L7)

___

### Hex

Ƭ **Hex**: \`0x$\{string}\`

A hex string

**`Example`**

```ts
const hex: Hex = '0x1234ff'
```

#### Defined in

[common/Hex.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/common/Hex.ts#L6)

___

### LoadStateHandler

Ƭ **LoadStateHandler**: (`params`: [`LoadStateParams`](modules.md#loadstateparams)) => `Promise`\<[`LoadStateResult`](modules.md#loadstateresult)\>

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

▸ (`params`): `Promise`\<[`LoadStateResult`](modules.md#loadstateresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`LoadStateParams`](modules.md#loadstateparams) |

##### Returns

`Promise`\<[`LoadStateResult`](modules.md#loadstateresult)\>

#### Defined in

[handlers/LoadStateHandler.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/LoadStateHandler.ts#L21)

___

### LoadStateParams

Ƭ **LoadStateParams**\<`TThrowOnFail`\>: `BaseParams`\<`TThrowOnFail`\> & \{ `state`: `SerializableTevmState`  }

params for `tevm_loadState` method. Takes a SerializableTevmState to load into state.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TThrowOnFail` | extends `boolean` = `boolean` |

#### Defined in

[params/LoadStateParams.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/LoadStateParams.ts#L7)

___

### LoadStateResult

Ƭ **LoadStateResult**\<`ErrorType`\>: `Object`

Result of LoadState Method

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ErrorType` | `LoadStateError` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `errors?` | `ErrorType`[] | Description of the exception, if any occurred |

#### Defined in

[result/LoadStateResult.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/LoadStateResult.ts#L6)

___

### Log

Ƭ **Log**: `Object`

Generic log information

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | [`Address`](modules.md#address) |
| `data` | [`Hex`](modules.md#hex) |
| `topics` | [`Hex`](modules.md#hex)[] |

#### Defined in

[common/Log.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/common/Log.ts#L7)

___

### NetworkConfig

Ƭ **NetworkConfig**: `Object`

Represents a configuration for a forked or proxied network

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockTag` | [`BlockParam`](modules.md#blockparam) | the block tag to fork from |
| `url` | `string` | The URL to the RPC endpoint |

#### Defined in

[common/NetworkConfig.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/common/NetworkConfig.ts#L6)

___

### ScriptHandler

Ƭ **ScriptHandler**: \<TAbi, TFunctionName\>(`params`: [`ScriptParams`](modules.md#scriptparams)\<`TAbi`, `TFunctionName`\>) => `Promise`\<[`ScriptResult`](modules.md#scriptresult)\<`TAbi`, `TFunctionName`\>\>

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

▸ \<`TAbi`, `TFunctionName`\>(`params`): `Promise`\<[`ScriptResult`](modules.md#scriptresult)\<`TAbi`, `TFunctionName`\>\>

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

[handlers/ScriptHandler.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/ScriptHandler.ts#L30)

___

### ScriptParams

Ƭ **ScriptParams**\<`TAbi`, `TFunctionName`, `TThrowOnFail`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](modules.md#basecallparams)\<`TThrowOnFail`\> & \{ `deployedBytecode`: `Hex`  }

Tevm params for deploying and running a script

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\> |
| `TThrowOnFail` | extends `boolean` = `boolean` |

#### Defined in

[params/ScriptParams.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/ScriptParams.ts#L12)

___

### ScriptResult

Ƭ **ScriptResult**\<`TAbi`, `TFunctionName`, `TErrorType`\>: [`ContractResult`](modules.md#contractresult)\<`TAbi`, `TFunctionName`, `TErrorType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends [`Abi`](modules.md#abi) \| readonly `unknown`[] = [`Abi`](modules.md#abi) |
| `TFunctionName` | extends `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\> |
| `TErrorType` | `ScriptError` |

#### Defined in

[result/ScriptResult.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/ScriptResult.ts#L6)

___

### SetAccountHandler

Ƭ **SetAccountHandler**: (`params`: [`SetAccountParams`](modules.md#setaccountparams)) => `Promise`\<[`SetAccountResult`](modules.md#setaccountresult)\>

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

▸ (`params`): `Promise`\<[`SetAccountResult`](modules.md#setaccountresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`SetAccountParams`](modules.md#setaccountparams) |

##### Returns

`Promise`\<[`SetAccountResult`](modules.md#setaccountresult)\>

#### Defined in

[handlers/SetAccountHandler.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/SetAccountHandler.ts#L14)

___

### SetAccountParams

Ƭ **SetAccountParams**\<`TThrowOnFail`\>: `BaseParams`\<`TThrowOnFail`\> & \{ `address`: `Address` ; `balance?`: `bigint` ; `deployedBytecode?`: `Hex` ; `nonce?`: `bigint` ; `storageRoot?`: `Hex`  }

Tevm params to set an account in the vm state
all fields are optional except address

**`Example`**

```ts
const accountParams: import('tevm/api').SetAccountParams = {
  account: '0x...',
  nonce: 5n,
  balance: 9000000000000n,
  storageRoot: '0x....',
  deployedBytecode: '0x....'
}
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TThrowOnFail` | extends `boolean` = `boolean` |

#### Defined in

[params/SetAccountParams.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/SetAccountParams.ts#L17)

___

### SetAccountResult

Ƭ **SetAccountResult**\<`ErrorType`\>: `Object`

Result of SetAccount Action

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ErrorType` | `SetAccountError` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `errors?` | `ErrorType`[] | Description of the exception, if any occurred |

#### Defined in

[result/SetAccountResult.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/SetAccountResult.ts#L6)

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
| `stack` | `ReadonlyArray`\<[`Hex`](modules.md#hex)\> |

#### Defined in

[result/DebugResult.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/DebugResult.ts#L4)

___

### TraceCall

Ƭ **TraceCall**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `calls?` | [`TraceCall`](modules.md#tracecall)[] |
| `from` | [`Address`](modules.md#address) |
| `gas?` | `bigint` |
| `gasUsed?` | `bigint` |
| `input` | [`Hex`](modules.md#hex) |
| `output` | [`Hex`](modules.md#hex) |
| `to` | [`Address`](modules.md#address) |
| `type` | [`TraceType`](modules.md#tracetype) |
| `value?` | `bigint` |

#### Defined in

[common/TraceCall.ts:5](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/common/TraceCall.ts#L5)

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

[params/DebugParams.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/DebugParams.ts#L8)

___

### TraceResult

Ƭ **TraceResult**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `calls?` | [`TraceCall`](modules.md#tracecall)[] |
| `from` | [`Address`](modules.md#address) |
| `gas` | `bigint` |
| `gasUsed` | `bigint` |
| `input` | [`Hex`](modules.md#hex) |
| `output` | [`Hex`](modules.md#hex) |
| `to` | [`Address`](modules.md#address) |
| `type` | [`TraceType`](modules.md#tracetype) |
| `value` | `bigint` |

#### Defined in

[common/TraceResult.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/common/TraceResult.ts#L6)

___

### TraceType

Ƭ **TraceType**: ``"CALL"`` \| ``"DELEGATECALL"`` \| ``"STATICCALL"`` \| ``"CREATE"`` \| ``"CREATE2"`` \| ``"SELFDESTRUCT"`` \| ``"REWARD"``

#### Defined in

[common/TraceType.ts:1](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/common/TraceType.ts#L1)

___

### TransactionParams

Ƭ **TransactionParams**: `Object`

A transaction request object

#### Type declaration

| Name | Type |
| :------ | :------ |
| `from` | [`Address`](modules.md#address) |
| `gas?` | [`Hex`](modules.md#hex) |
| `gasPrice?` | [`Hex`](modules.md#hex) |
| `input` | [`Hex`](modules.md#hex) |
| `nonce?` | [`Hex`](modules.md#hex) |
| `to?` | [`Address`](modules.md#address) |
| `value?` | [`Hex`](modules.md#hex) |

#### Defined in

[common/TransactionParams.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/common/TransactionParams.ts#L7)

___

### TransactionReceiptResult

Ƭ **TransactionReceiptResult**: `Object`

Transaction receipt result type for eth JSON-RPC procedures

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockHash` | [`Hex`](modules.md#hex) |
| `blockNumber` | [`Hex`](modules.md#hex) |
| `contractAddress` | [`Hex`](modules.md#hex) |
| `cumulativeGasUsed` | [`Hex`](modules.md#hex) |
| `from` | [`Hex`](modules.md#hex) |
| `gasUsed` | [`Hex`](modules.md#hex) |
| `logs` | readonly [`FilterLog`](modules.md#filterlog)[] |
| `logsBloom` | [`Hex`](modules.md#hex) |
| `status` | [`Hex`](modules.md#hex) |
| `to` | [`Hex`](modules.md#hex) |
| `transactionHash` | [`Hex`](modules.md#hex) |
| `transactionIndex` | [`Hex`](modules.md#hex) |

#### Defined in

[common/TransactionReceiptResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/common/TransactionReceiptResult.ts#L7)

___

### TransactionResult

Ƭ **TransactionResult**: `Object`

The type returned by transaction related
json rpc procedures

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockHash` | [`Hex`](modules.md#hex) |
| `blockNumber` | [`Hex`](modules.md#hex) |
| `from` | [`Hex`](modules.md#hex) |
| `gas` | [`Hex`](modules.md#hex) |
| `gasPrice` | [`Hex`](modules.md#hex) |
| `hash` | [`Hex`](modules.md#hex) |
| `input` | [`Hex`](modules.md#hex) |
| `nonce` | [`Hex`](modules.md#hex) |
| `r` | [`Hex`](modules.md#hex) |
| `s` | [`Hex`](modules.md#hex) |
| `to` | [`Hex`](modules.md#hex) |
| `transactionIndex` | [`Hex`](modules.md#hex) |
| `v` | [`Hex`](modules.md#hex) |
| `value` | [`Hex`](modules.md#hex) |

#### Defined in

[common/TransactionResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/common/TransactionResult.ts#L7)

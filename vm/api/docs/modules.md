[@tevm/api](README.md) / Exports

# @tevm/api

## Table of contents

### Type Aliases

- [AccountError](undefined)
- [AccountHandler](undefined)
- [AccountJsonRpcProcedure](undefined)
- [AccountJsonRpcRequest](undefined)
- [AccountJsonRpcResponse](undefined)
- [AccountParams](undefined)
- [AccountResult](undefined)
- [AnvilDropTransactionHandler](undefined)
- [AnvilDropTransactionJsonRpcRequest](undefined)
- [AnvilDropTransactionJsonRpcResponse](undefined)
- [AnvilDropTransactionParams](undefined)
- [AnvilDropTransactionProcedure](undefined)
- [AnvilDropTransactionResult](undefined)
- [AnvilDumpStateHandler](undefined)
- [AnvilDumpStateJsonRpcRequest](undefined)
- [AnvilDumpStateJsonRpcResponse](undefined)
- [AnvilDumpStateParams](undefined)
- [AnvilDumpStateProcedure](undefined)
- [AnvilDumpStateResult](undefined)
- [AnvilGetAutomineHandler](undefined)
- [AnvilGetAutomineJsonRpcRequest](undefined)
- [AnvilGetAutomineJsonRpcResponse](undefined)
- [AnvilGetAutomineParams](undefined)
- [AnvilGetAutomineProcedure](undefined)
- [AnvilGetAutomineResult](undefined)
- [AnvilImpersonateAccountHandler](undefined)
- [AnvilImpersonateAccountJsonRpcRequest](undefined)
- [AnvilImpersonateAccountJsonRpcResponse](undefined)
- [AnvilImpersonateAccountParams](undefined)
- [AnvilImpersonateAccountProcedure](undefined)
- [AnvilImpersonateAccountResult](undefined)
- [AnvilLoadStateHandler](undefined)
- [AnvilLoadStateJsonRpcRequest](undefined)
- [AnvilLoadStateJsonRpcResponse](undefined)
- [AnvilLoadStateParams](undefined)
- [AnvilLoadStateProcedure](undefined)
- [AnvilLoadStateResult](undefined)
- [AnvilMineHandler](undefined)
- [AnvilMineJsonRpcRequest](undefined)
- [AnvilMineJsonRpcResponse](undefined)
- [AnvilMineParams](undefined)
- [AnvilMineProcedure](undefined)
- [AnvilMineResult](undefined)
- [AnvilResetHandler](undefined)
- [AnvilResetJsonRpcRequest](undefined)
- [AnvilResetJsonRpcResponse](undefined)
- [AnvilResetParams](undefined)
- [AnvilResetProcedure](undefined)
- [AnvilResetResult](undefined)
- [AnvilSetBalanceHandler](undefined)
- [AnvilSetBalanceJsonRpcRequest](undefined)
- [AnvilSetBalanceJsonRpcResponse](undefined)
- [AnvilSetBalanceParams](undefined)
- [AnvilSetBalanceProcedure](undefined)
- [AnvilSetBalanceResult](undefined)
- [AnvilSetChainIdHandler](undefined)
- [AnvilSetChainIdJsonRpcRequest](undefined)
- [AnvilSetChainIdJsonRpcResponse](undefined)
- [AnvilSetChainIdParams](undefined)
- [AnvilSetChainIdProcedure](undefined)
- [AnvilSetChainIdResult](undefined)
- [AnvilSetCodeHandler](undefined)
- [AnvilSetCodeJsonRpcRequest](undefined)
- [AnvilSetCodeJsonRpcResponse](undefined)
- [AnvilSetCodeParams](undefined)
- [AnvilSetCodeProcedure](undefined)
- [AnvilSetCodeResult](undefined)
- [AnvilSetNonceHandler](undefined)
- [AnvilSetNonceJsonRpcRequest](undefined)
- [AnvilSetNonceJsonRpcResponse](undefined)
- [AnvilSetNonceParams](undefined)
- [AnvilSetNonceProcedure](undefined)
- [AnvilSetNonceResult](undefined)
- [AnvilSetStorageAtHandler](undefined)
- [AnvilSetStorageAtJsonRpcRequest](undefined)
- [AnvilSetStorageAtJsonRpcResponse](undefined)
- [AnvilSetStorageAtParams](undefined)
- [AnvilSetStorageAtProcedure](undefined)
- [AnvilSetStorageAtResult](undefined)
- [AnvilStopImpersonatingAccountHandler](undefined)
- [AnvilStopImpersonatingAccountJsonRpcRequest](undefined)
- [AnvilStopImpersonatingAccountJsonRpcResponse](undefined)
- [AnvilStopImpersonatingAccountParams](undefined)
- [AnvilStopImpersonatingAccountProcedure](undefined)
- [AnvilStopImpersonatingAccountResult](undefined)
- [BaseCallError](undefined)
- [BaseCallParams](undefined)
- [Block](undefined)
- [BlockResult](undefined)
- [CallError](undefined)
- [CallHandler](undefined)
- [CallJsonRpcProcedure](undefined)
- [CallJsonRpcRequest](undefined)
- [CallJsonRpcResponse](undefined)
- [CallParams](undefined)
- [CallResult](undefined)
- [ContractError](undefined)
- [ContractHandler](undefined)
- [ContractJsonRpcProcedure](undefined)
- [ContractJsonRpcRequest](undefined)
- [ContractJsonRpcResponse](undefined)
- [ContractParams](undefined)
- [ContractResult](undefined)
- [DebugTraceCallHandler](undefined)
- [DebugTraceCallJsonRpcRequest](undefined)
- [DebugTraceCallJsonRpcResponse](undefined)
- [DebugTraceCallParams](undefined)
- [DebugTraceCallProcedure](undefined)
- [DebugTraceCallResult](undefined)
- [DebugTraceTransactionHandler](undefined)
- [DebugTraceTransactionJsonRpcRequest](undefined)
- [DebugTraceTransactionJsonRpcResponse](undefined)
- [DebugTraceTransactionParams](undefined)
- [DebugTraceTransactionProcedure](undefined)
- [DebugTraceTransactionResult](undefined)
- [EthAccountsHandler](undefined)
- [EthAccountsJsonRpcProcedure](undefined)
- [EthAccountsJsonRpcRequest](undefined)
- [EthAccountsJsonRpcResponse](undefined)
- [EthAccountsParams](undefined)
- [EthAccountsResult](undefined)
- [EthBlockNumberHandler](undefined)
- [EthBlockNumberJsonRpcProcedure](undefined)
- [EthBlockNumberJsonRpcRequest](undefined)
- [EthBlockNumberJsonRpcResponse](undefined)
- [EthBlockNumberParams](undefined)
- [EthBlockNumberResult](undefined)
- [EthCallHandler](undefined)
- [EthCallJsonRpcProcedure](undefined)
- [EthCallJsonRpcRequest](undefined)
- [EthCallJsonRpcResponse](undefined)
- [EthCallParams](undefined)
- [EthCallResult](undefined)
- [EthChainIdHandler](undefined)
- [EthChainIdJsonRpcProcedure](undefined)
- [EthChainIdJsonRpcRequest](undefined)
- [EthChainIdJsonRpcResponse](undefined)
- [EthChainIdParams](undefined)
- [EthChainIdResult](undefined)
- [EthCoinbaseHandler](undefined)
- [EthCoinbaseJsonRpcProcedure](undefined)
- [EthCoinbaseJsonRpcRequest](undefined)
- [EthCoinbaseJsonRpcResponse](undefined)
- [EthCoinbaseParams](undefined)
- [EthCoinbaseResult](undefined)
- [EthEstimateGasHandler](undefined)
- [EthEstimateGasJsonRpcProcedure](undefined)
- [EthEstimateGasJsonRpcRequest](undefined)
- [EthEstimateGasJsonRpcResponse](undefined)
- [EthEstimateGasParams](undefined)
- [EthEstimateGasResult](undefined)
- [EthGasPriceHandler](undefined)
- [EthGasPriceJsonRpcProcedure](undefined)
- [EthGasPriceJsonRpcRequest](undefined)
- [EthGasPriceJsonRpcResponse](undefined)
- [EthGasPriceParams](undefined)
- [EthGasPriceResult](undefined)
- [EthGetBalanceHandler](undefined)
- [EthGetBalanceJsonRpcProcedure](undefined)
- [EthGetBalanceJsonRpcRequest](undefined)
- [EthGetBalanceJsonRpcResponse](undefined)
- [EthGetBalanceParams](undefined)
- [EthGetBalanceResult](undefined)
- [EthGetBlockByHashHandler](undefined)
- [EthGetBlockByHashJsonRpcProcedure](undefined)
- [EthGetBlockByHashJsonRpcRequest](undefined)
- [EthGetBlockByHashJsonRpcResponse](undefined)
- [EthGetBlockByHashParams](undefined)
- [EthGetBlockByHashResult](undefined)
- [EthGetBlockByNumberHandler](undefined)
- [EthGetBlockByNumberJsonRpcProcedure](undefined)
- [EthGetBlockByNumberJsonRpcRequest](undefined)
- [EthGetBlockByNumberJsonRpcResponse](undefined)
- [EthGetBlockByNumberParams](undefined)
- [EthGetBlockByNumberResult](undefined)
- [EthGetBlockTransactionCountByHashHandler](undefined)
- [EthGetBlockTransactionCountByHashJsonRpcProcedure](undefined)
- [EthGetBlockTransactionCountByHashJsonRpcRequest](undefined)
- [EthGetBlockTransactionCountByHashJsonRpcResponse](undefined)
- [EthGetBlockTransactionCountByHashParams](undefined)
- [EthGetBlockTransactionCountByHashResult](undefined)
- [EthGetBlockTransactionCountByNumberHandler](undefined)
- [EthGetBlockTransactionCountByNumberJsonRpcProcedure](undefined)
- [EthGetBlockTransactionCountByNumberJsonRpcRequest](undefined)
- [EthGetBlockTransactionCountByNumberJsonRpcResponse](undefined)
- [EthGetBlockTransactionCountByNumberParams](undefined)
- [EthGetBlockTransactionCountByNumberResult](undefined)
- [EthGetCodeHandler](undefined)
- [EthGetCodeJsonRpcProcedure](undefined)
- [EthGetCodeJsonRpcRequest](undefined)
- [EthGetCodeJsonRpcResponse](undefined)
- [EthGetCodeParams](undefined)
- [EthGetCodeResult](undefined)
- [EthGetFilterChangesHandler](undefined)
- [EthGetFilterChangesJsonRpcProcedure](undefined)
- [EthGetFilterChangesJsonRpcRequest](undefined)
- [EthGetFilterChangesJsonRpcResponse](undefined)
- [EthGetFilterChangesParams](undefined)
- [EthGetFilterChangesResult](undefined)
- [EthGetFilterLogsHandler](undefined)
- [EthGetFilterLogsJsonRpcProcedure](undefined)
- [EthGetFilterLogsJsonRpcRequest](undefined)
- [EthGetFilterLogsJsonRpcResponse](undefined)
- [EthGetFilterLogsParams](undefined)
- [EthGetFilterLogsResult](undefined)
- [EthGetLogsHandler](undefined)
- [EthGetLogsJsonRpcProcedure](undefined)
- [EthGetLogsJsonRpcRequest](undefined)
- [EthGetLogsJsonRpcResponse](undefined)
- [EthGetLogsParams](undefined)
- [EthGetLogsResult](undefined)
- [EthGetStorageAtHandler](undefined)
- [EthGetStorageAtJsonRpcProcedure](undefined)
- [EthGetStorageAtJsonRpcRequest](undefined)
- [EthGetStorageAtJsonRpcResponse](undefined)
- [EthGetStorageAtParams](undefined)
- [EthGetStorageAtResult](undefined)
- [EthGetTransactionByBlockHashAndIndexHandler](undefined)
- [EthGetTransactionByBlockHashAndIndexJsonRpcProcedure](undefined)
- [EthGetTransactionByBlockHashAndIndexJsonRpcRequest](undefined)
- [EthGetTransactionByBlockHashAndIndexJsonRpcResponse](undefined)
- [EthGetTransactionByBlockHashAndIndexParams](undefined)
- [EthGetTransactionByBlockHashAndIndexResult](undefined)
- [EthGetTransactionByBlockNumberAndIndexHandler](undefined)
- [EthGetTransactionByBlockNumberAndIndexJsonRpcProcedure](undefined)
- [EthGetTransactionByBlockNumberAndIndexJsonRpcRequest](undefined)
- [EthGetTransactionByBlockNumberAndIndexJsonRpcResponse](undefined)
- [EthGetTransactionByBlockNumberAndIndexParams](undefined)
- [EthGetTransactionByBlockNumberAndIndexResult](undefined)
- [EthGetTransactionByHashHandler](undefined)
- [EthGetTransactionByHashJsonRpcProcedure](undefined)
- [EthGetTransactionByHashJsonRpcRequest](undefined)
- [EthGetTransactionByHashJsonRpcResponse](undefined)
- [EthGetTransactionByHashParams](undefined)
- [EthGetTransactionByHashResult](undefined)
- [EthGetTransactionCountHandler](undefined)
- [EthGetTransactionCountJsonRpcProcedure](undefined)
- [EthGetTransactionCountJsonRpcRequest](undefined)
- [EthGetTransactionCountJsonRpcResponse](undefined)
- [EthGetTransactionCountParams](undefined)
- [EthGetTransactionCountResult](undefined)
- [EthGetTransactionReceiptHandler](undefined)
- [EthGetTransactionReceiptJsonRpcProcedure](undefined)
- [EthGetTransactionReceiptJsonRpcRequest](undefined)
- [EthGetTransactionReceiptJsonRpcResponse](undefined)
- [EthGetTransactionReceiptParams](undefined)
- [EthGetTransactionReceiptResult](undefined)
- [EthGetUncleByBlockHashAndIndexHandler](undefined)
- [EthGetUncleByBlockHashAndIndexJsonRpcProcedure](undefined)
- [EthGetUncleByBlockHashAndIndexJsonRpcRequest](undefined)
- [EthGetUncleByBlockHashAndIndexJsonRpcResponse](undefined)
- [EthGetUncleByBlockHashAndIndexParams](undefined)
- [EthGetUncleByBlockHashAndIndexResult](undefined)
- [EthGetUncleByBlockNumberAndIndexHandler](undefined)
- [EthGetUncleByBlockNumberAndIndexJsonRpcProcedure](undefined)
- [EthGetUncleByBlockNumberAndIndexJsonRpcRequest](undefined)
- [EthGetUncleByBlockNumberAndIndexJsonRpcResponse](undefined)
- [EthGetUncleByBlockNumberAndIndexParams](undefined)
- [EthGetUncleByBlockNumberAndIndexResult](undefined)
- [EthGetUncleCountByBlockHashHandler](undefined)
- [EthGetUncleCountByBlockHashJsonRpcProcedure](undefined)
- [EthGetUncleCountByBlockHashJsonRpcRequest](undefined)
- [EthGetUncleCountByBlockHashJsonRpcResponse](undefined)
- [EthGetUncleCountByBlockHashParams](undefined)
- [EthGetUncleCountByBlockHashResult](undefined)
- [EthGetUncleCountByBlockNumberHandler](undefined)
- [EthGetUncleCountByBlockNumberJsonRpcProcedure](undefined)
- [EthGetUncleCountByBlockNumberJsonRpcRequest](undefined)
- [EthGetUncleCountByBlockNumberJsonRpcResponse](undefined)
- [EthGetUncleCountByBlockNumberParams](undefined)
- [EthGetUncleCountByBlockNumberResult](undefined)
- [EthHashrateHandler](undefined)
- [EthHashrateJsonRpcProcedure](undefined)
- [EthHashrateJsonRpcRequest](undefined)
- [EthHashrateJsonRpcResponse](undefined)
- [EthHashrateParams](undefined)
- [EthHashrateResult](undefined)
- [EthJsonRpcRequest](undefined)
- [EthJsonRpcRequestHandler](undefined)
- [EthMiningHandler](undefined)
- [EthMiningJsonRpcProcedure](undefined)
- [EthMiningJsonRpcRequest](undefined)
- [EthMiningJsonRpcResponse](undefined)
- [EthMiningParams](undefined)
- [EthMiningResult](undefined)
- [EthNewBlockFilterHandler](undefined)
- [EthNewBlockFilterJsonRpcProcedure](undefined)
- [EthNewBlockFilterJsonRpcRequest](undefined)
- [EthNewBlockFilterJsonRpcResponse](undefined)
- [EthNewBlockFilterParams](undefined)
- [EthNewBlockFilterResult](undefined)
- [EthNewFilterHandler](undefined)
- [EthNewFilterJsonRpcProcedure](undefined)
- [EthNewFilterJsonRpcRequest](undefined)
- [EthNewFilterJsonRpcResponse](undefined)
- [EthNewFilterParams](undefined)
- [EthNewFilterResult](undefined)
- [EthNewPendingTransactionFilterHandler](undefined)
- [EthNewPendingTransactionFilterJsonRpcProcedure](undefined)
- [EthNewPendingTransactionFilterJsonRpcRequest](undefined)
- [EthNewPendingTransactionFilterJsonRpcResponse](undefined)
- [EthNewPendingTransactionFilterParams](undefined)
- [EthNewPendingTransactionFilterResult](undefined)
- [EthParams](undefined)
- [EthProtocolVersionHandler](undefined)
- [EthProtocolVersionJsonRpcProcedure](undefined)
- [EthProtocolVersionJsonRpcRequest](undefined)
- [EthProtocolVersionJsonRpcResponse](undefined)
- [EthProtocolVersionParams](undefined)
- [EthProtocolVersionResult](undefined)
- [EthSendRawTransactionHandler](undefined)
- [EthSendRawTransactionJsonRpcProcedure](undefined)
- [EthSendRawTransactionJsonRpcRequest](undefined)
- [EthSendRawTransactionJsonRpcResponse](undefined)
- [EthSendRawTransactionParams](undefined)
- [EthSendRawTransactionResult](undefined)
- [EthSendTransactionHandler](undefined)
- [EthSendTransactionJsonRpcProcedure](undefined)
- [EthSendTransactionJsonRpcRequest](undefined)
- [EthSendTransactionJsonRpcResponse](undefined)
- [EthSendTransactionParams](undefined)
- [EthSendTransactionResult](undefined)
- [EthSignHandler](undefined)
- [EthSignJsonRpcProcedure](undefined)
- [EthSignJsonRpcRequest](undefined)
- [EthSignJsonRpcResponse](undefined)
- [EthSignParams](undefined)
- [EthSignResult](undefined)
- [EthSignTransactionHandler](undefined)
- [EthSignTransactionJsonRpcProcedure](undefined)
- [EthSignTransactionJsonRpcRequest](undefined)
- [EthSignTransactionJsonRpcResponse](undefined)
- [EthSignTransactionParams](undefined)
- [EthSignTransactionResult](undefined)
- [EthSyncingHandler](undefined)
- [EthSyncingJsonRpcProcedure](undefined)
- [EthSyncingJsonRpcRequest](undefined)
- [EthSyncingJsonRpcResponse](undefined)
- [EthSyncingParams](undefined)
- [EthSyncingResult](undefined)
- [EthUninstallFilterHandler](undefined)
- [EthUninstallFilterJsonRpcProcedure](undefined)
- [EthUninstallFilterJsonRpcRequest](undefined)
- [EthUninstallFilterJsonRpcResponse](undefined)
- [EthUninstallFilterParams](undefined)
- [EthUninstallFilterResult](undefined)
- [EvmError](undefined)
- [FilterLog](undefined)
- [InvalidAddressError](undefined)
- [InvalidBalanceError](undefined)
- [InvalidBlobVersionedHashesError](undefined)
- [InvalidBlockError](undefined)
- [InvalidBytecodeError](undefined)
- [InvalidCallerError](undefined)
- [InvalidDataError](undefined)
- [InvalidDeployedBytecodeError](undefined)
- [InvalidDepthError](undefined)
- [InvalidFunctionNameError](undefined)
- [InvalidGasLimitError](undefined)
- [InvalidGasPriceError](undefined)
- [InvalidGasRefundError](undefined)
- [InvalidNonceError](undefined)
- [InvalidOriginError](undefined)
- [InvalidRequestError](undefined)
- [InvalidSaltError](undefined)
- [InvalidSelfdestructError](undefined)
- [InvalidSkipBalanceError](undefined)
- [InvalidStorageRootError](undefined)
- [InvalidToError](undefined)
- [InvalidValueError](undefined)
- [JsonRpcRequest](undefined)
- [JsonRpcResponse](undefined)
- [Log](undefined)
- [ScriptError](undefined)
- [ScriptHandler](undefined)
- [ScriptJsonRpcProcedure](undefined)
- [ScriptJsonRpcRequest](undefined)
- [ScriptJsonRpcResponse](undefined)
- [ScriptParams](undefined)
- [ScriptResult](undefined)
- [Tevm](undefined)
- [TevmEVMErrorMessage](undefined)
- [TevmJsonRpcRequest](undefined)
- [TevmJsonRpcRequestHandler](undefined)
- [TraceCall](undefined)
- [TraceParams](undefined)
- [TraceResult](undefined)
- [TraceType](undefined)
- [TransactionParams](undefined)
- [TransactionReceiptResult](undefined)
- [TransactionResult](undefined)
- [TypedError](undefined)
- [UnexpectedError](undefined)

## Type Aliases

### AccountError

Ƭ **AccountError**: InvalidAddressError \| InvalidBalanceError \| InvalidNonceError \| InvalidStorageRootError \| InvalidBytecodeError \| InvalidRequestError \| UnexpectedError

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

[errors/AccountError.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/AccountError.ts#L19)

___

### AccountHandler

Ƭ **AccountHandler**: Function

Handler for account tevm procedure

#### Type declaration

▸ (`params`): Promise\<AccountResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | AccountParams |

##### Returns

Promise\<AccountResult\>

#### Defined in

[handlers/AccountHandler.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AccountHandler.ts#L6)

___

### AccountJsonRpcProcedure

Ƭ **AccountJsonRpcProcedure**: Function

Account JSON-RPC tevm procedure puts an account or contract into the tevm state

#### Type declaration

▸ (`request`): Promise\<AccountJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | AccountJsonRpcRequest |

##### Returns

Promise\<AccountJsonRpcResponse\>

#### Defined in

[procedure/AccountJsonRpcProcedure.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AccountJsonRpcProcedure.ts#L6)

___

### AccountJsonRpcRequest

Ƭ **AccountJsonRpcRequest**: JsonRpcRequest\<"tevm\_account", SerializeToJson\<AccountParams\>\>

JSON-RPC request for `tevm_account` method

#### Defined in

[requests/AccountJsonRpcRequest.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AccountJsonRpcRequest.ts#L8)

___

### AccountJsonRpcResponse

Ƭ **AccountJsonRpcResponse**: JsonRpcResponse\<"tevm\_account", SerializeToJson\<AccountResult\>, AccountError["\_tag"]\>

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
| `address` | Address | Address of account |
| `balance?` | bigint | Balance to set account to |
| `deployedBytecode?` | Hex | Contract bytecode to set account to |
| `nonce?` | bigint | Nonce to set account to |
| `storageRoot?` | Hex | Storage root to set account to |

#### Defined in

[params/AccountParams.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AccountParams.ts#L16)

___

### AccountResult

Ƭ **AccountResult**: `Object`

Result of Account Action

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ErrorType` | AccountError |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `errors?` | ErrorType[] | Description of the exception, if any occurred |

#### Defined in

[result/AccountResult.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AccountResult.ts#L6)

___

### AnvilDropTransactionHandler

Ƭ **AnvilDropTransactionHandler**: Function

#### Type declaration

▸ (`params`): Promise\<AnvilDropTransactionResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | AnvilDropTransactionParams |

##### Returns

Promise\<AnvilDropTransactionResult\>

#### Defined in

[handlers/AnvilHandler.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AnvilHandler.ts#L56)

___

### AnvilDropTransactionJsonRpcRequest

Ƭ **AnvilDropTransactionJsonRpcRequest**: JsonRpcRequest\<"anvil\_dropTransaction", SerializeToJson\<AnvilDropTransactionParams\>\>

JSON-RPC request for `anvil_dropTransaction` method

#### Defined in

[requests/AnvilJsonRpcRequest.ts:69](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AnvilJsonRpcRequest.ts#L69)

___

### AnvilDropTransactionJsonRpcResponse

Ƭ **AnvilDropTransactionJsonRpcResponse**: JsonRpcResponse\<"anvil\_dropTransaction", SerializeToJson\<AnvilDropTransactionResult\>, AnvilError\>

JSON-RPC response for `anvil_dropTransaction` procedure

#### Defined in

[responses/AnvilJsonRpcResponse.ts:79](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AnvilJsonRpcResponse.ts#L79)

___

### AnvilDropTransactionParams

Ƭ **AnvilDropTransactionParams**: `Object`

Params for `anvil_dropTransaction` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactionHash` | Hex | The transaction hash |

#### Defined in

[params/AnvilParams.ts:78](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AnvilParams.ts#L78)

___

### AnvilDropTransactionProcedure

Ƭ **AnvilDropTransactionProcedure**: Function

JSON-RPC procedure for `anvil_dropTransaction`

#### Type declaration

▸ (`request`): Promise\<AnvilDropTransactionJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | AnvilDropTransactionJsonRpcRequest |

##### Returns

Promise\<AnvilDropTransactionJsonRpcResponse\>

#### Defined in

[procedure/AnvilProcedure.ts:76](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AnvilProcedure.ts#L76)

___

### AnvilDropTransactionResult

Ƭ **AnvilDropTransactionResult**: null

#### Defined in

[result/AnvilResult.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AnvilResult.ts#L17)

___

### AnvilDumpStateHandler

Ƭ **AnvilDumpStateHandler**: Function

#### Type declaration

▸ (`params`): Promise\<AnvilDumpStateResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | AnvilDumpStateParams |

##### Returns

Promise\<AnvilDumpStateResult\>

#### Defined in

[handlers/AnvilHandler.ts:81](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AnvilHandler.ts#L81)

___

### AnvilDumpStateJsonRpcRequest

Ƭ **AnvilDumpStateJsonRpcRequest**: JsonRpcRequest\<"anvil\_dumpState", SerializeToJson\<AnvilDumpStateParams\>\>

JSON-RPC request for `anvil_dumpState` method

#### Defined in

[requests/AnvilJsonRpcRequest.ts:118](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AnvilJsonRpcRequest.ts#L118)

___

### AnvilDumpStateJsonRpcResponse

Ƭ **AnvilDumpStateJsonRpcResponse**: JsonRpcResponse\<"anvil\_dumpState", SerializeToJson\<AnvilDumpStateResult\>, AnvilError\>

JSON-RPC response for `anvil_dumpState` procedure

#### Defined in

[responses/AnvilJsonRpcResponse.ts:134](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AnvilJsonRpcResponse.ts#L134)

___

### AnvilDumpStateParams

Ƭ **AnvilDumpStateParams**: Object \| undefined \| never

Params for `anvil_dumpState` handler

#### Defined in

[params/AnvilParams.ts:165](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AnvilParams.ts#L165)

___

### AnvilDumpStateProcedure

Ƭ **AnvilDumpStateProcedure**: Function

JSON-RPC procedure for `anvil_dumpState`

#### Type declaration

▸ (`request`): Promise\<AnvilDumpStateJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | AnvilDumpStateJsonRpcRequest |

##### Returns

Promise\<AnvilDumpStateJsonRpcResponse\>

#### Defined in

[procedure/AnvilProcedure.ts:119](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AnvilProcedure.ts#L119)

___

### AnvilDumpStateResult

Ƭ **AnvilDumpStateResult**: Hex

#### Defined in

[result/AnvilResult.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AnvilResult.ts#L30)

___

### AnvilGetAutomineHandler

Ƭ **AnvilGetAutomineHandler**: Function

#### Type declaration

▸ (`params`): Promise\<AnvilGetAutomineResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | AnvilGetAutomineParams |

##### Returns

Promise\<AnvilGetAutomineResult\>

#### Defined in

[handlers/AnvilHandler.ts:44](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AnvilHandler.ts#L44)

___

### AnvilGetAutomineJsonRpcRequest

Ƭ **AnvilGetAutomineJsonRpcRequest**: JsonRpcRequest\<"anvil\_getAutomine", SerializeToJson\<AnvilGetAutomineParams\>\>

JSON-RPC request for `anvil_getAutomine` method

#### Defined in

[requests/AnvilJsonRpcRequest.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AnvilJsonRpcRequest.ts#L45)

___

### AnvilGetAutomineJsonRpcResponse

Ƭ **AnvilGetAutomineJsonRpcResponse**: JsonRpcResponse\<"anvil\_getAutomine", SerializeToJson\<AnvilGetAutomineResult\>, AnvilError\>

JSON-RPC response for `anvil_getAutomine` procedure

#### Defined in

[responses/AnvilJsonRpcResponse.ts:52](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AnvilJsonRpcResponse.ts#L52)

___

### AnvilGetAutomineParams

Ƭ **AnvilGetAutomineParams**: Object \| undefined \| never

Params for `anvil_getAutomine` handler

#### Defined in

[params/AnvilParams.ts:40](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AnvilParams.ts#L40)

___

### AnvilGetAutomineProcedure

Ƭ **AnvilGetAutomineProcedure**: Function

JSON-RPC procedure for `anvil_getAutomine`

#### Type declaration

▸ (`request`): Promise\<AnvilGetAutomineJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | AnvilGetAutomineJsonRpcRequest |

##### Returns

Promise\<AnvilGetAutomineJsonRpcResponse\>

#### Defined in

[procedure/AnvilProcedure.ts:55](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AnvilProcedure.ts#L55)

___

### AnvilGetAutomineResult

Ƭ **AnvilGetAutomineResult**: boolean

#### Defined in

[result/AnvilResult.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AnvilResult.ts#L11)

___

### AnvilImpersonateAccountHandler

Ƭ **AnvilImpersonateAccountHandler**: Function

#### Type declaration

▸ (`params`): Promise\<AnvilImpersonateAccountResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | AnvilImpersonateAccountParams |

##### Returns

Promise\<AnvilImpersonateAccountResult\>

#### Defined in

[handlers/AnvilHandler.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AnvilHandler.ts#L33)

___

### AnvilImpersonateAccountJsonRpcRequest

Ƭ **AnvilImpersonateAccountJsonRpcRequest**: JsonRpcRequest\<"anvil\_impersonateAccount", SerializeToJson\<AnvilImpersonateAccountParams\>\>

JSON-RPC request for `anvil_impersonateAccount` method

#### Defined in

[requests/AnvilJsonRpcRequest.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AnvilJsonRpcRequest.ts#L23)

___

### AnvilImpersonateAccountJsonRpcResponse

Ƭ **AnvilImpersonateAccountJsonRpcResponse**: JsonRpcResponse\<"anvil\_impersonateAccount", SerializeToJson\<AnvilImpersonateAccountResult\>, AnvilError\>

JSON-RPC response for `anvil_impersonateAccount` procedure

#### Defined in

[responses/AnvilJsonRpcResponse.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AnvilJsonRpcResponse.ts#L28)

___

### AnvilImpersonateAccountParams

Ƭ **AnvilImpersonateAccountParams**: `Object`

Params fro `anvil_impersonateAccount` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | Address | The address to impersonate |

#### Defined in

[params/AnvilParams.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AnvilParams.ts#L11)

___

### AnvilImpersonateAccountProcedure

Ƭ **AnvilImpersonateAccountProcedure**: Function

JSON-RPC procedure for `anvil_impersonateAccount`

#### Type declaration

▸ (`request`): Promise\<AnvilImpersonateAccountJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | AnvilImpersonateAccountJsonRpcRequest |

##### Returns

Promise\<AnvilImpersonateAccountJsonRpcResponse\>

#### Defined in

[procedure/AnvilProcedure.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AnvilProcedure.ts#L36)

___

### AnvilImpersonateAccountResult

Ƭ **AnvilImpersonateAccountResult**: null

#### Defined in

[result/AnvilResult.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AnvilResult.ts#L4)

___

### AnvilLoadStateHandler

Ƭ **AnvilLoadStateHandler**: Function

#### Type declaration

▸ (`params`): Promise\<AnvilLoadStateResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | AnvilLoadStateParams |

##### Returns

Promise\<AnvilLoadStateResult\>

#### Defined in

[handlers/AnvilHandler.ts:86](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AnvilHandler.ts#L86)

___

### AnvilLoadStateJsonRpcRequest

Ƭ **AnvilLoadStateJsonRpcRequest**: JsonRpcRequest\<"anvil\_loadState", SerializeToJson\<AnvilLoadStateParams\>\>

JSON-RPC request for `anvil_loadState` method

#### Defined in

[requests/AnvilJsonRpcRequest.ts:127](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AnvilJsonRpcRequest.ts#L127)

___

### AnvilLoadStateJsonRpcResponse

Ƭ **AnvilLoadStateJsonRpcResponse**: JsonRpcResponse\<"anvil\_loadState", SerializeToJson\<AnvilLoadStateResult\>, AnvilError\>

JSON-RPC response for `anvil_loadState` procedure

#### Defined in

[responses/AnvilJsonRpcResponse.ts:144](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AnvilJsonRpcResponse.ts#L144)

___

### AnvilLoadStateParams

Ƭ **AnvilLoadStateParams**: `Object`

Params for `anvil_loadState` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | Record\<Hex, Hex\> | The state to load |

#### Defined in

[params/AnvilParams.ts:172](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AnvilParams.ts#L172)

___

### AnvilLoadStateProcedure

Ƭ **AnvilLoadStateProcedure**: Function

JSON-RPC procedure for `anvil_loadState`

#### Type declaration

▸ (`request`): Promise\<AnvilLoadStateJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | AnvilLoadStateJsonRpcRequest |

##### Returns

Promise\<AnvilLoadStateJsonRpcResponse\>

#### Defined in

[procedure/AnvilProcedure.ts:127](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AnvilProcedure.ts#L127)

___

### AnvilLoadStateResult

Ƭ **AnvilLoadStateResult**: null

#### Defined in

[result/AnvilResult.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AnvilResult.ts#L33)

___

### AnvilMineHandler

Ƭ **AnvilMineHandler**: Function

#### Type declaration

▸ (`params`): Promise\<AnvilMineResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | AnvilMineParams |

##### Returns

Promise\<AnvilMineResult\>

#### Defined in

[handlers/AnvilHandler.ts:48](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AnvilHandler.ts#L48)

___

### AnvilMineJsonRpcRequest

Ƭ **AnvilMineJsonRpcRequest**: JsonRpcRequest\<"anvil\_mine", SerializeToJson\<AnvilMineParams\>\>

JSON-RPC request for `anvil_mine` method

#### Defined in

[requests/AnvilJsonRpcRequest.ts:53](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AnvilJsonRpcRequest.ts#L53)

___

### AnvilMineJsonRpcResponse

Ƭ **AnvilMineJsonRpcResponse**: JsonRpcResponse\<"anvil\_mine", SerializeToJson\<AnvilMineResult\>, AnvilError\>

JSON-RPC response for `anvil_mine` procedure

#### Defined in

[responses/AnvilJsonRpcResponse.ts:61](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AnvilJsonRpcResponse.ts#L61)

___

### AnvilMineParams

Ƭ **AnvilMineParams**: `Object`

Params for `anvil_mine` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockCount?` | number | Number of blocks to mine. Defaults to 1 |
| `interval?` | number | mineing interval |

#### Defined in

[params/AnvilParams.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AnvilParams.ts#L46)

___

### AnvilMineProcedure

Ƭ **AnvilMineProcedure**: Function

JSON-RPC procedure for `anvil_mine`

#### Type declaration

▸ (`request`): Promise\<AnvilMineJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | AnvilMineJsonRpcRequest |

##### Returns

Promise\<AnvilMineJsonRpcResponse\>

#### Defined in

[procedure/AnvilProcedure.ts:62](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AnvilProcedure.ts#L62)

___

### AnvilMineResult

Ƭ **AnvilMineResult**: null

#### Defined in

[result/AnvilResult.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AnvilResult.ts#L13)

___

### AnvilResetHandler

Ƭ **AnvilResetHandler**: Function

#### Type declaration

▸ (`params`): Promise\<AnvilResetResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | AnvilResetParams |

##### Returns

Promise\<AnvilResetResult\>

#### Defined in

[handlers/AnvilHandler.ts:52](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AnvilHandler.ts#L52)

___

### AnvilResetJsonRpcRequest

Ƭ **AnvilResetJsonRpcRequest**: JsonRpcRequest\<"anvil\_reset", SerializeToJson\<AnvilResetParams\>\>

JSON-RPC request for `anvil_reset` method

#### Defined in

[requests/AnvilJsonRpcRequest.ts:61](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AnvilJsonRpcRequest.ts#L61)

___

### AnvilResetJsonRpcResponse

Ƭ **AnvilResetJsonRpcResponse**: JsonRpcResponse\<"anvil\_reset", SerializeToJson\<AnvilResetResult\>, AnvilError\>

JSON-RPC response for `anvil_reset` procedure

#### Defined in

[responses/AnvilJsonRpcResponse.ts:70](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AnvilJsonRpcResponse.ts#L70)

___

### AnvilResetParams

Ƭ **AnvilResetParams**: `Object`

Params for `anvil_reset` handler

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fork` | Object |
| `fork.block?` | BlockTag \| Hex \| BigInt |
| `fork.url?` | string |

#### Defined in

[params/AnvilParams.ts:61](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AnvilParams.ts#L61)

___

### AnvilResetProcedure

Ƭ **AnvilResetProcedure**: Function

JSON-RPC procedure for `anvil_reset`

#### Type declaration

▸ (`request`): Promise\<AnvilResetJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | AnvilResetJsonRpcRequest |

##### Returns

Promise\<AnvilResetJsonRpcResponse\>

#### Defined in

[procedure/AnvilProcedure.ts:69](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AnvilProcedure.ts#L69)

___

### AnvilResetResult

Ƭ **AnvilResetResult**: null

#### Defined in

[result/AnvilResult.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AnvilResult.ts#L15)

___

### AnvilSetBalanceHandler

Ƭ **AnvilSetBalanceHandler**: Function

#### Type declaration

▸ (`params`): Promise\<AnvilSetBalanceResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | AnvilSetBalanceParams |

##### Returns

Promise\<AnvilSetBalanceResult\>

#### Defined in

[handlers/AnvilHandler.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AnvilHandler.ts#L60)

___

### AnvilSetBalanceJsonRpcRequest

Ƭ **AnvilSetBalanceJsonRpcRequest**: JsonRpcRequest\<"anvil\_setBalance", SerializeToJson\<AnvilSetBalanceParams\>\>

JSON-RPC request for `anvil_setBalance` method

#### Defined in

[requests/AnvilJsonRpcRequest.ts:77](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AnvilJsonRpcRequest.ts#L77)

___

### AnvilSetBalanceJsonRpcResponse

Ƭ **AnvilSetBalanceJsonRpcResponse**: JsonRpcResponse\<"anvil\_setBalance", SerializeToJson\<AnvilSetBalanceResult\>, AnvilError\>

JSON-RPC response for `anvil_setBalance` procedure

#### Defined in

[responses/AnvilJsonRpcResponse.ts:88](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AnvilJsonRpcResponse.ts#L88)

___

### AnvilSetBalanceParams

Ƭ **AnvilSetBalanceParams**: `Object`

Params for `anvil_setBalance` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | Address | The address to set the balance for |
| `balance` | Hex \| BigInt | The balance to set |

#### Defined in

[params/AnvilParams.ts:89](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AnvilParams.ts#L89)

___

### AnvilSetBalanceProcedure

Ƭ **AnvilSetBalanceProcedure**: Function

JSON-RPC procedure for `anvil_setBalance`

#### Type declaration

▸ (`request`): Promise\<AnvilSetBalanceJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | AnvilSetBalanceJsonRpcRequest |

##### Returns

Promise\<AnvilSetBalanceJsonRpcResponse\>

#### Defined in

[procedure/AnvilProcedure.ts:83](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AnvilProcedure.ts#L83)

___

### AnvilSetBalanceResult

Ƭ **AnvilSetBalanceResult**: null

#### Defined in

[result/AnvilResult.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AnvilResult.ts#L19)

___

### AnvilSetChainIdHandler

Ƭ **AnvilSetChainIdHandler**: Function

#### Type declaration

▸ (`params`): Promise\<AnvilSetChainIdResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | AnvilSetChainIdParams |

##### Returns

Promise\<AnvilSetChainIdResult\>

#### Defined in

[handlers/AnvilHandler.ts:76](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AnvilHandler.ts#L76)

___

### AnvilSetChainIdJsonRpcRequest

Ƭ **AnvilSetChainIdJsonRpcRequest**: JsonRpcRequest\<"anvil\_setChainId", SerializeToJson\<AnvilSetChainIdParams\>\>

JSON-RPC request for `anvil_setChainId` method

#### Defined in

[requests/AnvilJsonRpcRequest.ts:109](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AnvilJsonRpcRequest.ts#L109)

___

### AnvilSetChainIdJsonRpcResponse

Ƭ **AnvilSetChainIdJsonRpcResponse**: JsonRpcResponse\<"anvil\_setChainId", SerializeToJson\<AnvilSetChainIdResult\>, AnvilError\>

JSON-RPC response for `anvil_setChainId` procedure

#### Defined in

[responses/AnvilJsonRpcResponse.ts:124](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AnvilJsonRpcResponse.ts#L124)

___

### AnvilSetChainIdParams

Ƭ **AnvilSetChainIdParams**: `Object`

Params for `anvil_setChainId` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `chainId` | number | The chain id to set |

#### Defined in

[params/AnvilParams.ts:153](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AnvilParams.ts#L153)

___

### AnvilSetChainIdProcedure

Ƭ **AnvilSetChainIdProcedure**: Function

JSON-RPC procedure for `anvil_setChainId`

#### Type declaration

▸ (`request`): Promise\<AnvilSetChainIdJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | AnvilSetChainIdJsonRpcRequest |

##### Returns

Promise\<AnvilSetChainIdJsonRpcResponse\>

#### Defined in

[procedure/AnvilProcedure.ts:111](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AnvilProcedure.ts#L111)

___

### AnvilSetChainIdResult

Ƭ **AnvilSetChainIdResult**: null

#### Defined in

[result/AnvilResult.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AnvilResult.ts#L27)

___

### AnvilSetCodeHandler

Ƭ **AnvilSetCodeHandler**: Function

#### Type declaration

▸ (`params`): Promise\<AnvilSetCodeResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | AnvilSetCodeParams |

##### Returns

Promise\<AnvilSetCodeResult\>

#### Defined in

[handlers/AnvilHandler.ts:64](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AnvilHandler.ts#L64)

___

### AnvilSetCodeJsonRpcRequest

Ƭ **AnvilSetCodeJsonRpcRequest**: JsonRpcRequest\<"anvil\_setCode", SerializeToJson\<AnvilSetCodeParams\>\>

JSON-RPC request for `anvil_setCode` method

#### Defined in

[requests/AnvilJsonRpcRequest.ts:85](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AnvilJsonRpcRequest.ts#L85)

___

### AnvilSetCodeJsonRpcResponse

Ƭ **AnvilSetCodeJsonRpcResponse**: JsonRpcResponse\<"anvil\_setCode", SerializeToJson\<AnvilSetCodeResult\>, AnvilError\>

JSON-RPC response for `anvil_setCode` procedure

#### Defined in

[responses/AnvilJsonRpcResponse.ts:97](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AnvilJsonRpcResponse.ts#L97)

___

### AnvilSetCodeParams

Ƭ **AnvilSetCodeParams**: `Object`

Params for `anvil_setCode` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | Address | The address to set the code for |
| `code` | Hex | The code to set |

#### Defined in

[params/AnvilParams.ts:104](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AnvilParams.ts#L104)

___

### AnvilSetCodeProcedure

Ƭ **AnvilSetCodeProcedure**: Function

JSON-RPC procedure for `anvil_setCode`

#### Type declaration

▸ (`request`): Promise\<AnvilSetCodeJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | AnvilSetCodeJsonRpcRequest |

##### Returns

Promise\<AnvilSetCodeJsonRpcResponse\>

#### Defined in

[procedure/AnvilProcedure.ts:90](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AnvilProcedure.ts#L90)

___

### AnvilSetCodeResult

Ƭ **AnvilSetCodeResult**: null

#### Defined in

[result/AnvilResult.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AnvilResult.ts#L21)

___

### AnvilSetNonceHandler

Ƭ **AnvilSetNonceHandler**: Function

#### Type declaration

▸ (`params`): Promise\<AnvilSetNonceResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | AnvilSetNonceParams |

##### Returns

Promise\<AnvilSetNonceResult\>

#### Defined in

[handlers/AnvilHandler.ts:68](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AnvilHandler.ts#L68)

___

### AnvilSetNonceJsonRpcRequest

Ƭ **AnvilSetNonceJsonRpcRequest**: JsonRpcRequest\<"anvil\_setNonce", SerializeToJson\<AnvilSetNonceParams\>\>

JSON-RPC request for `anvil_setNonce` method

#### Defined in

[requests/AnvilJsonRpcRequest.ts:93](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AnvilJsonRpcRequest.ts#L93)

___

### AnvilSetNonceJsonRpcResponse

Ƭ **AnvilSetNonceJsonRpcResponse**: JsonRpcResponse\<"anvil\_setNonce", SerializeToJson\<AnvilSetNonceResult\>, AnvilError\>

JSON-RPC response for `anvil_setNonce` procedure

#### Defined in

[responses/AnvilJsonRpcResponse.ts:106](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AnvilJsonRpcResponse.ts#L106)

___

### AnvilSetNonceParams

Ƭ **AnvilSetNonceParams**: `Object`

Params for `anvil_setNonce` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | Address | The address to set the nonce for |
| `nonce` | BigInt | The nonce to set |

#### Defined in

[params/AnvilParams.ts:119](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AnvilParams.ts#L119)

___

### AnvilSetNonceProcedure

Ƭ **AnvilSetNonceProcedure**: Function

JSON-RPC procedure for `anvil_setNonce`

#### Type declaration

▸ (`request`): Promise\<AnvilSetNonceJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | AnvilSetNonceJsonRpcRequest |

##### Returns

Promise\<AnvilSetNonceJsonRpcResponse\>

#### Defined in

[procedure/AnvilProcedure.ts:97](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AnvilProcedure.ts#L97)

___

### AnvilSetNonceResult

Ƭ **AnvilSetNonceResult**: null

#### Defined in

[result/AnvilResult.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AnvilResult.ts#L23)

___

### AnvilSetStorageAtHandler

Ƭ **AnvilSetStorageAtHandler**: Function

#### Type declaration

▸ (`params`): Promise\<AnvilSetStorageAtResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | AnvilSetStorageAtParams |

##### Returns

Promise\<AnvilSetStorageAtResult\>

#### Defined in

[handlers/AnvilHandler.ts:72](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AnvilHandler.ts#L72)

___

### AnvilSetStorageAtJsonRpcRequest

Ƭ **AnvilSetStorageAtJsonRpcRequest**: JsonRpcRequest\<"anvil\_setStorageAt", SerializeToJson\<AnvilSetStorageAtParams\>\>

JSON-RPC request for `anvil_setStorageAt` method

#### Defined in

[requests/AnvilJsonRpcRequest.ts:101](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AnvilJsonRpcRequest.ts#L101)

___

### AnvilSetStorageAtJsonRpcResponse

Ƭ **AnvilSetStorageAtJsonRpcResponse**: JsonRpcResponse\<"anvil\_setStorageAt", SerializeToJson\<AnvilSetStorageAtResult\>, AnvilError\>

JSON-RPC response for `anvil_setStorageAt` procedure

#### Defined in

[responses/AnvilJsonRpcResponse.ts:115](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AnvilJsonRpcResponse.ts#L115)

___

### AnvilSetStorageAtParams

Ƭ **AnvilSetStorageAtParams**: `Object`

Params for `anvil_setStorageAt` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | Address | The address to set the storage for |
| `position` | Hex \| BigInt | The position in storage to set |
| `value` | Hex \| BigInt | The value to set |

#### Defined in

[params/AnvilParams.ts:134](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AnvilParams.ts#L134)

___

### AnvilSetStorageAtProcedure

Ƭ **AnvilSetStorageAtProcedure**: Function

JSON-RPC procedure for `anvil_setStorageAt`

#### Type declaration

▸ (`request`): Promise\<AnvilSetStorageAtJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | AnvilSetStorageAtJsonRpcRequest |

##### Returns

Promise\<AnvilSetStorageAtJsonRpcResponse\>

#### Defined in

[procedure/AnvilProcedure.ts:104](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AnvilProcedure.ts#L104)

___

### AnvilSetStorageAtResult

Ƭ **AnvilSetStorageAtResult**: null

#### Defined in

[result/AnvilResult.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AnvilResult.ts#L25)

___

### AnvilStopImpersonatingAccountHandler

Ƭ **AnvilStopImpersonatingAccountHandler**: Function

#### Type declaration

▸ (`params`): Promise\<AnvilStopImpersonatingAccountResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | AnvilStopImpersonatingAccountParams |

##### Returns

Promise\<AnvilStopImpersonatingAccountResult\>

#### Defined in

[handlers/AnvilHandler.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AnvilHandler.ts#L37)

___

### AnvilStopImpersonatingAccountJsonRpcRequest

Ƭ **AnvilStopImpersonatingAccountJsonRpcRequest**: JsonRpcRequest\<"anvil\_stopImpersonatingAccount", SerializeToJson\<AnvilStopImpersonatingAccountParams\>\>

JSON-RPC request for `anvil_stopImpersonatingAccount` method

#### Defined in

[requests/AnvilJsonRpcRequest.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AnvilJsonRpcRequest.ts#L31)

___

### AnvilStopImpersonatingAccountJsonRpcResponse

Ƭ **AnvilStopImpersonatingAccountJsonRpcResponse**: JsonRpcResponse\<"anvil\_stopImpersonatingAccount", SerializeToJson\<AnvilStopImpersonatingAccountResult\>, AnvilError\>

JSON-RPC response for `anvil_stopImpersonatingAccount` procedure

#### Defined in

[responses/AnvilJsonRpcResponse.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AnvilJsonRpcResponse.ts#L37)

___

### AnvilStopImpersonatingAccountParams

Ƭ **AnvilStopImpersonatingAccountParams**: `Object`

Params for `anvil_stopImpersonatingAccount` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | Address | The address to stop impersonating |

#### Defined in

[params/AnvilParams.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AnvilParams.ts#L22)

___

### AnvilStopImpersonatingAccountProcedure

Ƭ **AnvilStopImpersonatingAccountProcedure**: Function

JSON-RPC procedure for `anvil_stopImpersonatingAccount`

#### Type declaration

▸ (`request`): Promise\<AnvilStopImpersonatingAccountJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | AnvilStopImpersonatingAccountJsonRpcRequest |

##### Returns

Promise\<AnvilStopImpersonatingAccountJsonRpcResponse\>

#### Defined in

[procedure/AnvilProcedure.ts:43](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AnvilProcedure.ts#L43)

___

### AnvilStopImpersonatingAccountResult

Ƭ **AnvilStopImpersonatingAccountResult**: null

#### Defined in

[result/AnvilResult.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AnvilResult.ts#L6)

___

### BaseCallError

Ƭ **BaseCallError**: EvmError \| InvalidRequestError \| InvalidAddressError \| InvalidBalanceError \| InvalidBlobVersionedHashesError \| InvalidBlockError \| InvalidCallerError \| InvalidDepthError \| InvalidGasLimitError \| InvalidGasPriceError \| InvalidGasRefundError \| InvalidNonceError \| InvalidOriginError \| InvalidSelfdestructError \| InvalidSkipBalanceError \| InvalidStorageRootError \| InvalidToError \| InvalidValueError \| UnexpectedError

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
| `blobVersionedHashes?` | Hex[] | Versioned hashes for each blob in a blob transaction |
| `block?` | Partial\<Block\> | The `block` the `tx` belongs to. If omitted a default blank block will be used. |
| `caller?` | Address | The address that ran this code (`msg.sender`). Defaults to the zero address. |
| `depth?` | number | The call depth. Defaults to `0` |
| `gasLimit?` | bigint | The gas limit for the call. Defaults to `16777215` (`0xffffff`) |
| `gasPrice?` | bigint | The gas price for the call. Defaults to `0` |
| `gasRefund?` | bigint | Refund counter. Defaults to `0` |
| `origin?` | Address | The address where the call originated from. Defaults to the zero address. |
| `selfdestruct?` | Set\<Address\> | Addresses to selfdestruct. Defaults to the empty set. |
| `skipBalance?` | boolean | Set caller to msg.value of less than msg.value Defaults to false exceipt for when running scripts where it is set to true |
| `to?` | Address | The address of the account that is executing this code (`address(this)`). Defaults to the zero address. |
| `value?` | bigint | The value in ether that is being sent to `opts.address`. Defaults to `0` |

#### Defined in

[params/BaseCallParams.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/BaseCallParams.ts#L7)

___

### Block

Ƭ **Block**: `Object`

Header information of an ethereum block

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseFeePerGas?` | bigint | (Optional) The base fee per gas in the block, introduced in EIP-1559 for dynamic transaction fee calculation. |
| `blobGasPrice?` | bigint | The gas price for the block; may be undefined in blocks after EIP-1559. |
| `coinbase` | Address | The address of the miner or validator who mined or validated the block. |
| `difficulty` | bigint | The difficulty level of the block (relevant in PoW chains). |
| `gasLimit` | bigint | The gas limit for the block, i.e., the maximum amount of gas that can be used by the transactions in the block. |
| `number` | bigint | The block number (height) in the blockchain. |
| `timestamp` | bigint | The timestamp at which the block was mined or validated. |

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
| `difficulty` | Hex |
| `extraData` | Hex |
| `gasLimit` | Hex |
| `gasUsed` | Hex |
| `hash` | Hex |
| `logsBloom` | Hex |
| `miner` | Hex |
| `nonce` | Hex |
| `number` | Hex |
| `parentHash` | Hex |
| `sha3Uncles` | Hex |
| `size` | Hex |
| `stateRoot` | Hex |
| `timestamp` | Hex |
| `totalDifficulty` | Hex |
| `transactions` | Hex[] |
| `transactionsRoot` | Hex |
| `uncles` | Hex[] |

#### Defined in

[common/BlockResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/common/BlockResult.ts#L7)

___

### CallError

Ƭ **CallError**: BaseCallError \| InvalidSaltError \| InvalidDataError \| InvalidDeployedBytecodeError

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

Ƭ **CallHandler**: Function

Handler for call tevm procedure

#### Type declaration

▸ (`action`): Promise\<CallResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `action` | CallParams |

##### Returns

Promise\<CallResult\>

#### Defined in

[handlers/CallHandler.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/CallHandler.ts#L6)

___

### CallJsonRpcProcedure

Ƭ **CallJsonRpcProcedure**: Function

Call JSON-RPC procedure executes a call against the tevm EVM

#### Type declaration

▸ (`request`): Promise\<CallJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | CallJsonRpcRequest |

##### Returns

Promise\<CallJsonRpcResponse\>

#### Defined in

[procedure/CallJsonRpcProcedure.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/CallJsonRpcProcedure.ts#L6)

___

### CallJsonRpcRequest

Ƭ **CallJsonRpcRequest**: JsonRpcRequest\<"tevm\_call", SerializeToJson\<CallParams\>\>

JSON-RPC request for `tevm_call`

#### Defined in

[requests/CallJsonRpcRequest.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/CallJsonRpcRequest.ts#L8)

___

### CallJsonRpcResponse

Ƭ **CallJsonRpcResponse**: JsonRpcResponse\<"tevm\_call", SerializeToJson\<CallResult\>, CallError["\_tag"]\>

JSON-RPC response for `tevm_call` procedure

#### Defined in

[responses/CallJsonRpcResponse.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/CallJsonRpcResponse.ts#L8)

___

### CallParams

Ƭ **CallParams**: BaseCallParams & Object

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

Ƭ **CallResult**: `Object`

Result of a Tevm VM Call method

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ErrorType` | CallError |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `blobGasUsed?` | bigint | Amount of blob gas consumed by the transaction |
| `createdAddress?` | Address | Address of created account during transaction, if any |
| `createdAddresses?` | Set\<Address\> | Map of addresses which were created (used in EIP 6780) |
| `errors?` | ErrorType[] | Description of the exception, if any occurred |
| `executionGasUsed` | bigint | Amount of gas the code used to run |
| `gas?` | bigint | Amount of gas left |
| `gasRefund?` | bigint | The gas refund counter as a uint256 |
| `logs?` | Log[] | Array of logs that the contract emitted |
| `rawData` | Hex | Encoded return value from the contract as hex string |
| `selfdestruct?` | Set\<Address\> | A set of accounts to selfdestruct |

#### Defined in

[result/CallResult.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/CallResult.ts#L9)

___

### ContractError

Ƭ **ContractError**: BaseCallError \| InvalidAddressError \| EvmError \| InvalidRequestError \| UnexpectedError \| InvalidAbiError \| InvalidDataError \| InvalidFunctionNameError \| InvalidArgsError \| DecodeFunctionDataError \| EncodeFunctionReturnDataError

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

Ƭ **ContractHandler**: Function

Handler for contract tevm procedure
It's API resuses the viem `contractRead`/`contractWrite` API to encode abi, functionName, and args

#### Type declaration

▸ \<`TAbi`, `TFunctionName`\>(`action`): Promise\<ContractResult\<TAbi, TFunctionName\>\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends Abi \| readonly unknown[] = Abi |
| `TFunctionName` | extends ContractFunctionName\<TAbi\> = ContractFunctionName\<TAbi\> |

##### Parameters

| Name | Type |
| :------ | :------ |
| `action` | ContractParams\<TAbi, TFunctionName\> |

##### Returns

Promise\<ContractResult\<TAbi, TFunctionName\>\>

#### Defined in

[handlers/ContractHandler.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/ContractHandler.ts#L9)

___

### ContractJsonRpcProcedure

Ƭ **ContractJsonRpcProcedure**: CallJsonRpcRequest

Since ContractJsonRpcProcedure is a quality of life wrapper around CallJsonRpcProcedure
 We choose to overload the type instead of creating a new one. Tevm contract handlers encode their
 contract call as a normal call request over JSON-rpc

#### Defined in

[procedure/ContractJsonRpcProcedure.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/ContractJsonRpcProcedure.ts#L8)

___

### ContractJsonRpcRequest

Ƭ **ContractJsonRpcRequest**: CallJsonRpcRequest

Since contract calls are just a quality of life wrapper around call we avoid using tevm_contract
in favor of overloading tevm_call

#### Defined in

[requests/ContractJsonRpcRequest.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/ContractJsonRpcRequest.ts#L7)

___

### ContractJsonRpcResponse

Ƭ **ContractJsonRpcResponse**: CallJsonRpcResponse

Since contract calls are just a quality of life wrapper around call we avoid using tevm_contract
in favor of overloading tevm_call

#### Defined in

[responses/ContractJsonRpcResponse.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/ContractJsonRpcResponse.ts#L7)

___

### ContractParams

Ƭ **ContractParams**: EncodeFunctionDataParameters\<TAbi, TFunctionName\> & BaseCallParams & Object

Tevm params to execute a call on a contract

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends Abi \| readonly unknown[] = Abi |
| `TFunctionName` | extends ContractFunctionName\<TAbi\> = ContractFunctionName\<TAbi\> |

#### Defined in

[params/ContractParams.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/ContractParams.ts#L11)

___

### ContractResult

Ƭ **ContractResult**: Omit\<CallResult, "errors"\> & Object \| CallResult\<ErrorType\> & Object

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends Abi \| readonly unknown[] = Abi |
| `TFunctionName` | extends ContractFunctionName\<TAbi\> = ContractFunctionName\<TAbi\> |
| `ErrorType` | ContractError |

#### Defined in

[result/ContractResult.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/ContractResult.ts#L9)

___

### DebugTraceCallHandler

Ƭ **DebugTraceCallHandler**: Function

#### Type declaration

▸ (`params`): Promise\<DebugTraceCallResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | DebugTraceCallParams |

##### Returns

Promise\<DebugTraceCallResult\>

#### Defined in

[handlers/DebugHandler.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/DebugHandler.ts#L15)

___

### DebugTraceCallJsonRpcRequest

Ƭ **DebugTraceCallJsonRpcRequest**: JsonRpcRequest\<"debug\_traceCall", SerializeToJson\<DebugTraceCallParams\>\>

JSON-RPC request for `debug_traceCall` method

#### Defined in

[requests/DebugJsonRpcRequest.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/DebugJsonRpcRequest.ts#L20)

___

### DebugTraceCallJsonRpcResponse

Ƭ **DebugTraceCallJsonRpcResponse**: JsonRpcResponse\<"debug\_traceCall", SerializeToJson\<DebugTraceCallResult\>, DebugError\>

JSON-RPC response for `debug_traceCall` procedure

#### Defined in

[responses/DebugJsonRpcResponse.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/DebugJsonRpcResponse.ts#L25)

___

### DebugTraceCallParams

Ƭ **DebugTraceCallParams**: TraceParams & Object

Params taken by `debug_traceCall` handler

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TChain` | extends Chain \| undefined = Chain \| undefined |

#### Defined in

[params/DebugParams.ts:55](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/DebugParams.ts#L55)

___

### DebugTraceCallProcedure

Ƭ **DebugTraceCallProcedure**: Function

JSON-RPC procedure for `debug_traceCall`

#### Type declaration

▸ (`request`): Promise\<DebugTraceCallJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | DebugTraceCallJsonRpcRequest |

##### Returns

Promise\<DebugTraceCallJsonRpcResponse\>

#### Defined in

[procedure/DebugProcedure.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/DebugProcedure.ts#L20)

___

### DebugTraceCallResult

Ƭ **DebugTraceCallResult**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `failed` | boolean |
| `gas` | bigint |
| `returnValue` | Hex |
| `structLogs` | ReadonlyArray\<StructLog\> |

#### Defined in

[result/DebugResult.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/DebugResult.ts#L16)

___

### DebugTraceTransactionHandler

Ƭ **DebugTraceTransactionHandler**: Function

#### Type declaration

▸ (`params`): Promise\<DebugTraceTransactionResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | DebugTraceTransactionParams |

##### Returns

Promise\<DebugTraceTransactionResult\>

#### Defined in

[handlers/DebugHandler.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/DebugHandler.ts#L11)

___

### DebugTraceTransactionJsonRpcRequest

Ƭ **DebugTraceTransactionJsonRpcRequest**: JsonRpcRequest\<"debug\_traceTransaction", SerializeToJson\<DebugTraceTransactionParams\>\>

JSON-RPC request for `debug_traceTransaction` method

#### Defined in

[requests/DebugJsonRpcRequest.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/DebugJsonRpcRequest.ts#L12)

___

### DebugTraceTransactionJsonRpcResponse

Ƭ **DebugTraceTransactionJsonRpcResponse**: JsonRpcResponse\<"debug\_traceTransaction", SerializeToJson\<DebugTraceTransactionResult\>, DebugError\>

JSON-RPC response for `debug_traceTransaction` procedure

#### Defined in

[responses/DebugJsonRpcResponse.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/DebugJsonRpcResponse.ts#L16)

___

### DebugTraceTransactionParams

Ƭ **DebugTraceTransactionParams**: TraceParams & Object

Params taken by `debug_traceTransaction` handler

#### Defined in

[params/DebugParams.ts:44](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/DebugParams.ts#L44)

___

### DebugTraceTransactionProcedure

Ƭ **DebugTraceTransactionProcedure**: Function

JSON-RPC procedure for `debug_traceTransaction`

#### Type declaration

▸ (`request`): Promise\<DebugTraceTransactionJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | DebugTraceTransactionJsonRpcRequest |

##### Returns

Promise\<DebugTraceTransactionJsonRpcResponse\>

#### Defined in

[procedure/DebugProcedure.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/DebugProcedure.ts#L13)

___

### DebugTraceTransactionResult

Ƭ **DebugTraceTransactionResult**: TraceResult

#### Defined in

[result/DebugResult.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/DebugResult.ts#L14)

___

### EthAccountsHandler

Ƭ **EthAccountsHandler**: Function

#### Type declaration

▸ (`request?`): Promise\<EthAccountsResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request?` | EthAccountsParams |

##### Returns

Promise\<EthAccountsResult\>

#### Defined in

[handlers/EthHandler.ts:83](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L83)

___

### EthAccountsJsonRpcProcedure

Ƭ **EthAccountsJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthAccountsJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthAccountsJsonRpcRequest |

##### Returns

Promise\<EthAccountsJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:83](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L83)

___

### EthAccountsJsonRpcRequest

Ƭ **EthAccountsJsonRpcRequest**: JsonRpcRequest\<"eth\_accounts", readonly []\>

JSON-RPC request for `eth_accounts` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L11)

___

### EthAccountsJsonRpcResponse

Ƭ **EthAccountsJsonRpcResponse**: JsonRpcResponse\<"eth\_accounts", Address[], string\>

JSON-RPC response for `eth_accounts` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L15)

___

### EthAccountsParams

Ƭ **EthAccountsParams**: EmptyParams

Params taken by `eth_accounts` handler

#### Defined in

[params/EthParams.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L24)

___

### EthAccountsResult

Ƭ **EthAccountsResult**: Address[]

#### Defined in

[result/EthResult.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L13)

___

### EthBlockNumberHandler

Ƭ **EthBlockNumberHandler**: Function

#### Type declaration

▸ (`request?`): Promise\<EthBlockNumberResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request?` | EthBlockNumberParams |

##### Returns

Promise\<EthBlockNumberResult\>

#### Defined in

[handlers/EthHandler.ts:87](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L87)

___

### EthBlockNumberJsonRpcProcedure

Ƭ **EthBlockNumberJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthBlockNumberJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthBlockNumberJsonRpcRequest |

##### Returns

Promise\<EthBlockNumberJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:87](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L87)

___

### EthBlockNumberJsonRpcRequest

Ƭ **EthBlockNumberJsonRpcRequest**: JsonRpcRequest\<"eth\_blockNumber", readonly []\>

JSON-RPC request for `eth_blockNumber` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L19)

___

### EthBlockNumberJsonRpcResponse

Ƭ **EthBlockNumberJsonRpcResponse**: JsonRpcResponse\<"eth\_blockNumber", SerializeToJson\<EthBlockNumberResult\>, string\>

JSON-RPC response for `eth_blockNumber` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L25)

___

### EthBlockNumberParams

Ƭ **EthBlockNumberParams**: EmptyParams

JSON-RPC request for `eth_blockNumber` procedure

#### Defined in

[params/EthParams.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L29)

___

### EthBlockNumberResult

Ƭ **EthBlockNumberResult**: bigint

JSON-RPC response for `eth_blockNumber` procedure

#### Defined in

[result/EthResult.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L18)

___

### EthCallHandler

Ƭ **EthCallHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthCallResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthCallParams |

##### Returns

Promise\<EthCallResult\>

#### Defined in

[handlers/EthHandler.ts:91](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L91)

___

### EthCallJsonRpcProcedure

Ƭ **EthCallJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthCallJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthCallJsonRpcRequest |

##### Returns

Promise\<EthCallJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:91](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L91)

___

### EthCallJsonRpcRequest

Ƭ **EthCallJsonRpcRequest**: JsonRpcRequest\<"eth\_call", readonly [tx: Transaction, tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_call` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L27)

___

### EthCallJsonRpcResponse

Ƭ **EthCallJsonRpcResponse**: JsonRpcResponse\<"eth\_call", Hex, string\>

JSON-RPC response for `eth_call` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L35)

___

### EthCallParams

Ƭ **EthCallParams**: CallParameters

JSON-RPC request for `eth_call` procedure

#### Defined in

[params/EthParams.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L34)

___

### EthCallResult

Ƭ **EthCallResult**: Hex

JSON-RPC response for `eth_call` procedure

#### Defined in

[result/EthResult.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L24)

___

### EthChainIdHandler

Ƭ **EthChainIdHandler**: Function

#### Type declaration

▸ (`request?`): Promise\<EthChainIdResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request?` | EthChainIdParams |

##### Returns

Promise\<EthChainIdResult\>

#### Defined in

[handlers/EthHandler.ts:93](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L93)

___

### EthChainIdJsonRpcProcedure

Ƭ **EthChainIdJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthChainIdJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthChainIdJsonRpcRequest |

##### Returns

Promise\<EthChainIdJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:95](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L95)

___

### EthChainIdJsonRpcRequest

Ƭ **EthChainIdJsonRpcRequest**: JsonRpcRequest\<"eth\_chainId", readonly []\>

JSON-RPC request for `eth_chainId` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L35)

___

### EthChainIdJsonRpcResponse

Ƭ **EthChainIdJsonRpcResponse**: JsonRpcResponse\<"eth\_chainId", Hex, string\>

JSON-RPC response for `eth_chainId` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L41)

___

### EthChainIdParams

Ƭ **EthChainIdParams**: EmptyParams

JSON-RPC request for `eth_chainId` procedure

#### Defined in

[params/EthParams.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L39)

___

### EthChainIdResult

Ƭ **EthChainIdResult**: bigint

JSON-RPC response for `eth_chainId` procedure

#### Defined in

[result/EthResult.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L30)

___

### EthCoinbaseHandler

Ƭ **EthCoinbaseHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthCoinbaseResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthCoinbaseParams |

##### Returns

Promise\<EthCoinbaseResult\>

#### Defined in

[handlers/EthHandler.ts:97](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L97)

___

### EthCoinbaseJsonRpcProcedure

Ƭ **EthCoinbaseJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthCoinbaseJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthCoinbaseJsonRpcRequest |

##### Returns

Promise\<EthCoinbaseJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:99](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L99)

___

### EthCoinbaseJsonRpcRequest

Ƭ **EthCoinbaseJsonRpcRequest**: JsonRpcRequest\<"eth\_coinbase", readonly []\>

JSON-RPC request for `eth_coinbase` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:43](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L43)

___

### EthCoinbaseJsonRpcResponse

Ƭ **EthCoinbaseJsonRpcResponse**: JsonRpcResponse\<"eth\_coinbase", Hex, string\>

JSON-RPC response for `eth_coinbase` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L51)

___

### EthCoinbaseParams

Ƭ **EthCoinbaseParams**: EmptyParams

JSON-RPC request for `eth_coinbase` procedure

#### Defined in

[params/EthParams.ts:44](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L44)

___

### EthCoinbaseResult

Ƭ **EthCoinbaseResult**: Address

JSON-RPC response for `eth_coinbase` procedure

#### Defined in

[result/EthResult.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L36)

___

### EthEstimateGasHandler

Ƭ **EthEstimateGasHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthEstimateGasResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthEstimateGasParams |

##### Returns

Promise\<EthEstimateGasResult\>

#### Defined in

[handlers/EthHandler.ts:101](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L101)

___

### EthEstimateGasJsonRpcProcedure

Ƭ **EthEstimateGasJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthEstimateGasJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthEstimateGasJsonRpcRequest |

##### Returns

Promise\<EthEstimateGasJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:103](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L103)

___

### EthEstimateGasJsonRpcRequest

Ƭ **EthEstimateGasJsonRpcRequest**: JsonRpcRequest\<"eth\_estimateGas", readonly [tx: Transaction]\>

JSON-RPC request for `eth_estimateGas` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L51)

___

### EthEstimateGasJsonRpcResponse

Ƭ **EthEstimateGasJsonRpcResponse**: JsonRpcResponse\<"eth\_estimateGas", Hex, string\>

JSON-RPC response for `eth_estimateGas` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:61](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L61)

___

### EthEstimateGasParams

Ƭ **EthEstimateGasParams**: EstimateGasParameters

JSON-RPC request for `eth_estimateGas` procedure

#### Defined in

[params/EthParams.ts:49](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L49)

___

### EthEstimateGasResult

Ƭ **EthEstimateGasResult**: bigint

JSON-RPC response for `eth_estimateGas` procedure

#### Defined in

[result/EthResult.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L42)

___

### EthGasPriceHandler

Ƭ **EthGasPriceHandler**: Function

#### Type declaration

▸ (`request?`): Promise\<EthGasPriceResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request?` | EthGasPriceParams |

##### Returns

Promise\<EthGasPriceResult\>

#### Defined in

[handlers/EthHandler.ts:109](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L109)

___

### EthGasPriceJsonRpcProcedure

Ƭ **EthGasPriceJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthGasPriceJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGasPriceJsonRpcRequest |

##### Returns

Promise\<EthGasPriceJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:111](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L111)

___

### EthGasPriceJsonRpcRequest

Ƭ **EthGasPriceJsonRpcRequest**: JsonRpcRequest\<"eth\_gasPrice", readonly []\>

JSON-RPC request for `eth_gasPrice` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:67](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L67)

___

### EthGasPriceJsonRpcResponse

Ƭ **EthGasPriceJsonRpcResponse**: JsonRpcResponse\<"eth\_gasPrice", Hex, string\>

JSON-RPC response for `eth_gasPrice` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:81](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L81)

___

### EthGasPriceParams

Ƭ **EthGasPriceParams**: EmptyParams

JSON-RPC request for `eth_gasPrice` procedure

#### Defined in

[params/EthParams.ts:59](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L59)

___

### EthGasPriceResult

Ƭ **EthGasPriceResult**: bigint

JSON-RPC response for `eth_gasPrice` procedure

#### Defined in

[result/EthResult.ts:54](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L54)

___

### EthGetBalanceHandler

Ƭ **EthGetBalanceHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetBalanceResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetBalanceParams |

##### Returns

Promise\<EthGetBalanceResult\>

#### Defined in

[handlers/EthHandler.ts:113](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L113)

___

### EthGetBalanceJsonRpcProcedure

Ƭ **EthGetBalanceJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetBalanceJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetBalanceJsonRpcRequest |

##### Returns

Promise\<EthGetBalanceJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:115](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L115)

___

### EthGetBalanceJsonRpcRequest

Ƭ **EthGetBalanceJsonRpcRequest**: JsonRpcRequest\<"eth\_getBalance", [address: Address, tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_getBalance` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:75](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L75)

___

### EthGetBalanceJsonRpcResponse

Ƭ **EthGetBalanceJsonRpcResponse**: JsonRpcResponse\<"eth\_getBalance", Hex, string\>

JSON-RPC response for `eth_getBalance` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:91](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L91)

___

### EthGetBalanceParams

Ƭ **EthGetBalanceParams**: GetBalanceParameters

JSON-RPC request for `eth_getBalance` procedure

#### Defined in

[params/EthParams.ts:64](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L64)

___

### EthGetBalanceResult

Ƭ **EthGetBalanceResult**: bigint

JSON-RPC response for `eth_getBalance` procedure

#### Defined in

[result/EthResult.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L60)

___

### EthGetBlockByHashHandler

Ƭ **EthGetBlockByHashHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetBlockByHashResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetBlockByHashParams |

##### Returns

Promise\<EthGetBlockByHashResult\>

#### Defined in

[handlers/EthHandler.ts:117](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L117)

___

### EthGetBlockByHashJsonRpcProcedure

Ƭ **EthGetBlockByHashJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetBlockByHashJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetBlockByHashJsonRpcRequest |

##### Returns

Promise\<EthGetBlockByHashJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:119](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L119)

___

### EthGetBlockByHashJsonRpcRequest

Ƭ **EthGetBlockByHashJsonRpcRequest**: JsonRpcRequest\<"eth\_getBlockByHash", readonly [blockHash: Hex, fullTransactionObjects: boolean]\>

JSON-RPC request for `eth_getBlockByHash` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:83](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L83)

___

### EthGetBlockByHashJsonRpcResponse

Ƭ **EthGetBlockByHashJsonRpcResponse**: JsonRpcResponse\<"eth\_getBlockByHash", BlockResult, string\>

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
| `blockHash` | Hex |
| `fullTransactionObjects` | boolean |

#### Defined in

[params/EthParams.ts:69](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L69)

___

### EthGetBlockByHashResult

Ƭ **EthGetBlockByHashResult**: BlockResult

JSON-RPC response for `eth_getBlockByHash` procedure

#### Defined in

[result/EthResult.ts:66](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L66)

___

### EthGetBlockByNumberHandler

Ƭ **EthGetBlockByNumberHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetBlockByNumberResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetBlockByNumberParams |

##### Returns

Promise\<EthGetBlockByNumberResult\>

#### Defined in

[handlers/EthHandler.ts:121](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L121)

___

### EthGetBlockByNumberJsonRpcProcedure

Ƭ **EthGetBlockByNumberJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetBlockByNumberJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetBlockByNumberJsonRpcRequest |

##### Returns

Promise\<EthGetBlockByNumberJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:123](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L123)

___

### EthGetBlockByNumberJsonRpcRequest

Ƭ **EthGetBlockByNumberJsonRpcRequest**: JsonRpcRequest\<"eth\_getBlockByNumber", readonly [tag: BlockTag \| Hex, fullTransactionObjects: boolean]\>

JSON-RPC request for `eth_getBlockByNumber` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:91](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L91)

___

### EthGetBlockByNumberJsonRpcResponse

Ƭ **EthGetBlockByNumberJsonRpcResponse**: JsonRpcResponse\<"eth\_getBlockByNumber", BlockResult, string\>

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
| `fullTransactionObjects` | boolean |
| `tag` | BlockTag \| Hex |

#### Defined in

[params/EthParams.ts:77](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L77)

___

### EthGetBlockByNumberResult

Ƭ **EthGetBlockByNumberResult**: BlockResult

JSON-RPC response for `eth_getBlockByNumber` procedure

#### Defined in

[result/EthResult.ts:72](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L72)

___

### EthGetBlockTransactionCountByHashHandler

Ƭ **EthGetBlockTransactionCountByHashHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetBlockTransactionCountByHashResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetBlockTransactionCountByHashParams |

##### Returns

Promise\<EthGetBlockTransactionCountByHashResult\>

#### Defined in

[handlers/EthHandler.ts:125](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L125)

___

### EthGetBlockTransactionCountByHashJsonRpcProcedure

Ƭ **EthGetBlockTransactionCountByHashJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetBlockTransactionCountByHashJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetBlockTransactionCountByHashJsonRpcRequest |

##### Returns

Promise\<EthGetBlockTransactionCountByHashJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:127](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L127)

___

### EthGetBlockTransactionCountByHashJsonRpcRequest

Ƭ **EthGetBlockTransactionCountByHashJsonRpcRequest**: JsonRpcRequest\<"eth\_getBlockTransactionCountByHash", readonly [hash: Hex]\>

JSON-RPC request for `eth_getBlockTransactionCountByHash` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:99](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L99)

___

### EthGetBlockTransactionCountByHashJsonRpcResponse

Ƭ **EthGetBlockTransactionCountByHashJsonRpcResponse**: JsonRpcResponse\<"eth\_getBlockTransactionCountByHash", Hex, string\>

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
| `hash` | Hex |

#### Defined in

[params/EthParams.ts:85](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L85)

___

### EthGetBlockTransactionCountByHashResult

Ƭ **EthGetBlockTransactionCountByHashResult**: Hex

JSON-RPC response for `eth_getBlockTransactionCountByHash` procedure

#### Defined in

[result/EthResult.ts:77](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L77)

___

### EthGetBlockTransactionCountByNumberHandler

Ƭ **EthGetBlockTransactionCountByNumberHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetBlockTransactionCountByNumberResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetBlockTransactionCountByNumberParams |

##### Returns

Promise\<EthGetBlockTransactionCountByNumberResult\>

#### Defined in

[handlers/EthHandler.ts:129](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L129)

___

### EthGetBlockTransactionCountByNumberJsonRpcProcedure

Ƭ **EthGetBlockTransactionCountByNumberJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetBlockTransactionCountByNumberJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetBlockTransactionCountByNumberJsonRpcRequest |

##### Returns

Promise\<EthGetBlockTransactionCountByNumberJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:131](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L131)

___

### EthGetBlockTransactionCountByNumberJsonRpcRequest

Ƭ **EthGetBlockTransactionCountByNumberJsonRpcRequest**: JsonRpcRequest\<"eth\_getBlockTransactionCountByNumber", readonly [tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_getBlockTransactionCountByNumber` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:107](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L107)

___

### EthGetBlockTransactionCountByNumberJsonRpcResponse

Ƭ **EthGetBlockTransactionCountByNumberJsonRpcResponse**: JsonRpcResponse\<"eth\_getBlockTransactionCountByNumber", Hex, string\>

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
| `tag` | BlockTag \| Hex |

#### Defined in

[params/EthParams.ts:90](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L90)

___

### EthGetBlockTransactionCountByNumberResult

Ƭ **EthGetBlockTransactionCountByNumberResult**: Hex

JSON-RPC response for `eth_getBlockTransactionCountByNumber` procedure

#### Defined in

[result/EthResult.ts:83](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L83)

___

### EthGetCodeHandler

Ƭ **EthGetCodeHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetCodeResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetCodeParams |

##### Returns

Promise\<EthGetCodeResult\>

#### Defined in

[handlers/EthHandler.ts:133](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L133)

___

### EthGetCodeJsonRpcProcedure

Ƭ **EthGetCodeJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetCodeJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetCodeJsonRpcRequest |

##### Returns

Promise\<EthGetCodeJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:135](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L135)

___

### EthGetCodeJsonRpcRequest

Ƭ **EthGetCodeJsonRpcRequest**: JsonRpcRequest\<"eth\_getCode", readonly [address: Address, tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_getCode` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:115](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L115)

___

### EthGetCodeJsonRpcResponse

Ƭ **EthGetCodeJsonRpcResponse**: JsonRpcResponse\<"eth\_getCode", Hex, string\>

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
| `address` | Address |
| `tag` | BlockTag \| Hex |

#### Defined in

[params/EthParams.ts:95](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L95)

___

### EthGetCodeResult

Ƭ **EthGetCodeResult**: Hex

JSON-RPC response for `eth_getCode` procedure

#### Defined in

[result/EthResult.ts:89](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L89)

___

### EthGetFilterChangesHandler

Ƭ **EthGetFilterChangesHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetFilterChangesResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetFilterChangesParams |

##### Returns

Promise\<EthGetFilterChangesResult\>

#### Defined in

[handlers/EthHandler.ts:137](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L137)

___

### EthGetFilterChangesJsonRpcProcedure

Ƭ **EthGetFilterChangesJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetFilterChangesJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetFilterChangesJsonRpcRequest |

##### Returns

Promise\<EthGetFilterChangesJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:139](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L139)

___

### EthGetFilterChangesJsonRpcRequest

Ƭ **EthGetFilterChangesJsonRpcRequest**: JsonRpcRequest\<"eth\_getFilterChanges", [filterId: Hex]\>

JSON-RPC request for `eth_getFilterChanges` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:123](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L123)

___

### EthGetFilterChangesJsonRpcResponse

Ƭ **EthGetFilterChangesJsonRpcResponse**: JsonRpcResponse\<"eth\_getFilterChanges", FilterLog[], string\>

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
| `filterId` | Hex |

#### Defined in

[params/EthParams.ts:100](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L100)

___

### EthGetFilterChangesResult

Ƭ **EthGetFilterChangesResult**: FilterLog[]

JSON-RPC response for `eth_getFilterChanges` procedure

#### Defined in

[result/EthResult.ts:95](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L95)

___

### EthGetFilterLogsHandler

Ƭ **EthGetFilterLogsHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetFilterLogsResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetFilterLogsParams |

##### Returns

Promise\<EthGetFilterLogsResult\>

#### Defined in

[handlers/EthHandler.ts:141](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L141)

___

### EthGetFilterLogsJsonRpcProcedure

Ƭ **EthGetFilterLogsJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetFilterLogsJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetFilterLogsJsonRpcRequest |

##### Returns

Promise\<EthGetFilterLogsJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:143](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L143)

___

### EthGetFilterLogsJsonRpcRequest

Ƭ **EthGetFilterLogsJsonRpcRequest**: JsonRpcRequest\<"eth\_getFilterLogs", [filterId: Hex]\>

JSON-RPC request for `eth_getFilterLogs` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:131](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L131)

___

### EthGetFilterLogsJsonRpcResponse

Ƭ **EthGetFilterLogsJsonRpcResponse**: JsonRpcResponse\<"eth\_getFilterLogs", FilterLog[], string\>

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
| `filterId` | Hex |

#### Defined in

[params/EthParams.ts:105](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L105)

___

### EthGetFilterLogsResult

Ƭ **EthGetFilterLogsResult**: FilterLog[]

JSON-RPC response for `eth_getFilterLogs` procedure

#### Defined in

[result/EthResult.ts:101](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L101)

___

### EthGetLogsHandler

Ƭ **EthGetLogsHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetLogsResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetLogsParams |

##### Returns

Promise\<EthGetLogsResult\>

#### Defined in

[handlers/EthHandler.ts:145](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L145)

___

### EthGetLogsJsonRpcProcedure

Ƭ **EthGetLogsJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetLogsJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetLogsJsonRpcRequest |

##### Returns

Promise\<EthGetLogsJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:147](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L147)

___

### EthGetLogsJsonRpcRequest

Ƭ **EthGetLogsJsonRpcRequest**: JsonRpcRequest\<"eth\_getLogs", [filterParams: FilterParams]\>

JSON-RPC request for `eth_getLogs` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:139](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L139)

___

### EthGetLogsJsonRpcResponse

Ƭ **EthGetLogsJsonRpcResponse**: JsonRpcResponse\<"eth\_getLogs", FilterLog[], string\>

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
| `filterParams` | FilterParams |

#### Defined in

[params/EthParams.ts:110](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L110)

___

### EthGetLogsResult

Ƭ **EthGetLogsResult**: FilterLog[]

JSON-RPC response for `eth_getLogs` procedure

#### Defined in

[result/EthResult.ts:107](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L107)

___

### EthGetStorageAtHandler

Ƭ **EthGetStorageAtHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetStorageAtResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetStorageAtParams |

##### Returns

Promise\<EthGetStorageAtResult\>

#### Defined in

[handlers/EthHandler.ts:149](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L149)

___

### EthGetStorageAtJsonRpcProcedure

Ƭ **EthGetStorageAtJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetStorageAtJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetStorageAtJsonRpcRequest |

##### Returns

Promise\<EthGetStorageAtJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:151](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L151)

___

### EthGetStorageAtJsonRpcRequest

Ƭ **EthGetStorageAtJsonRpcRequest**: JsonRpcRequest\<"eth\_getStorageAt", readonly [address: Address, position: Hex, tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_getStorageAt` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:147](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L147)

___

### EthGetStorageAtJsonRpcResponse

Ƭ **EthGetStorageAtJsonRpcResponse**: JsonRpcResponse\<"eth\_getStorageAt", Hex, string\>

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
| `address` | Address |
| `position` | Hex |
| `tag` | BlockTag \| Hex |

#### Defined in

[params/EthParams.ts:115](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L115)

___

### EthGetStorageAtResult

Ƭ **EthGetStorageAtResult**: Hex

JSON-RPC response for `eth_getStorageAt` procedure

#### Defined in

[result/EthResult.ts:113](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L113)

___

### EthGetTransactionByBlockHashAndIndexHandler

Ƭ **EthGetTransactionByBlockHashAndIndexHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetTransactionByBlockHashAndIndexResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetTransactionByBlockHashAndIndexParams |

##### Returns

Promise\<EthGetTransactionByBlockHashAndIndexResult\>

#### Defined in

[handlers/EthHandler.ts:169](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L169)

___

### EthGetTransactionByBlockHashAndIndexJsonRpcProcedure

Ƭ **EthGetTransactionByBlockHashAndIndexJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetTransactionByBlockHashAndIndexJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetTransactionByBlockHashAndIndexJsonRpcRequest |

##### Returns

Promise\<EthGetTransactionByBlockHashAndIndexJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:171](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L171)

___

### EthGetTransactionByBlockHashAndIndexJsonRpcRequest

Ƭ **EthGetTransactionByBlockHashAndIndexJsonRpcRequest**: JsonRpcRequest\<"eth\_getTransactionByBlockHashAndIndex", readonly [tag: Hex, index: Hex]\>

JSON-RPC request for `eth_getTransactionByBlockHashAndIndex` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:187](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L187)

___

### EthGetTransactionByBlockHashAndIndexJsonRpcResponse

Ƭ **EthGetTransactionByBlockHashAndIndexJsonRpcResponse**: JsonRpcResponse\<"eth\_getTransactionByBlockHashAndIndex", TransactionResult, string\>

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
| `index` | Hex |
| `tag` | Hex |

#### Defined in

[params/EthParams.ts:147](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L147)

___

### EthGetTransactionByBlockHashAndIndexResult

Ƭ **EthGetTransactionByBlockHashAndIndexResult**: TransactionResult

JSON-RPC response for `eth_getTransactionByBlockHashAndIndex` procedure

#### Defined in

[result/EthResult.ts:143](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L143)

___

### EthGetTransactionByBlockNumberAndIndexHandler

Ƭ **EthGetTransactionByBlockNumberAndIndexHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetTransactionByBlockNumberAndIndexResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetTransactionByBlockNumberAndIndexParams |

##### Returns

Promise\<EthGetTransactionByBlockNumberAndIndexResult\>

#### Defined in

[handlers/EthHandler.ts:173](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L173)

___

### EthGetTransactionByBlockNumberAndIndexJsonRpcProcedure

Ƭ **EthGetTransactionByBlockNumberAndIndexJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetTransactionByBlockNumberAndIndexJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetTransactionByBlockNumberAndIndexJsonRpcRequest |

##### Returns

Promise\<EthGetTransactionByBlockNumberAndIndexJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:175](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L175)

___

### EthGetTransactionByBlockNumberAndIndexJsonRpcRequest

Ƭ **EthGetTransactionByBlockNumberAndIndexJsonRpcRequest**: JsonRpcRequest\<"eth\_getTransactionByBlockNumberAndIndex", readonly [tag: BlockTag \| Hex, index: Hex]\>

JSON-RPC request for `eth_getTransactionByBlockNumberAndIndex` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:195](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L195)

___

### EthGetTransactionByBlockNumberAndIndexJsonRpcResponse

Ƭ **EthGetTransactionByBlockNumberAndIndexJsonRpcResponse**: JsonRpcResponse\<"eth\_getTransactionByBlockNumberAndIndex", TransactionResult, string\>

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
| `index` | Hex |
| `tag` | BlockTag \| Hex |

#### Defined in

[params/EthParams.ts:155](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L155)

___

### EthGetTransactionByBlockNumberAndIndexResult

Ƭ **EthGetTransactionByBlockNumberAndIndexResult**: TransactionResult

JSON-RPC response for `eth_getTransactionByBlockNumberAndIndex` procedure

#### Defined in

[result/EthResult.ts:149](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L149)

___

### EthGetTransactionByHashHandler

Ƭ **EthGetTransactionByHashHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetTransactionByHashResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetTransactionByHashParams |

##### Returns

Promise\<EthGetTransactionByHashResult\>

#### Defined in

[handlers/EthHandler.ts:165](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L165)

___

### EthGetTransactionByHashJsonRpcProcedure

Ƭ **EthGetTransactionByHashJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetTransactionByHashJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetTransactionByHashJsonRpcRequest |

##### Returns

Promise\<EthGetTransactionByHashJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:167](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L167)

___

### EthGetTransactionByHashJsonRpcRequest

Ƭ **EthGetTransactionByHashJsonRpcRequest**: JsonRpcRequest\<"eth\_getTransactionByHash", readonly [data: Hex]\>

JSON-RPC request for `eth_getTransactionByHash` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:179](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L179)

___

### EthGetTransactionByHashJsonRpcResponse

Ƭ **EthGetTransactionByHashJsonRpcResponse**: JsonRpcResponse\<"eth\_getTransactionByHash", TransactionResult, string\>

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
| `data` | Hex |

#### Defined in

[params/EthParams.ts:142](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L142)

___

### EthGetTransactionByHashResult

Ƭ **EthGetTransactionByHashResult**: TransactionResult

JSON-RPC response for `eth_getTransactionByHash` procedure

#### Defined in

[result/EthResult.ts:137](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L137)

___

### EthGetTransactionCountHandler

Ƭ **EthGetTransactionCountHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetTransactionCountResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetTransactionCountParams |

##### Returns

Promise\<EthGetTransactionCountResult\>

#### Defined in

[handlers/EthHandler.ts:153](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L153)

___

### EthGetTransactionCountJsonRpcProcedure

Ƭ **EthGetTransactionCountJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetTransactionCountJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetTransactionCountJsonRpcRequest |

##### Returns

Promise\<EthGetTransactionCountJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:155](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L155)

___

### EthGetTransactionCountJsonRpcRequest

Ƭ **EthGetTransactionCountJsonRpcRequest**: JsonRpcRequest\<"eth\_getTransactionCount", readonly [address: Address, tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_getTransactionCount` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:155](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L155)

___

### EthGetTransactionCountJsonRpcResponse

Ƭ **EthGetTransactionCountJsonRpcResponse**: JsonRpcResponse\<"eth\_getTransactionCount", Hex, string\>

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
| `address` | Address |
| `tag` | BlockTag \| Hex |

#### Defined in

[params/EthParams.ts:124](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L124)

___

### EthGetTransactionCountResult

Ƭ **EthGetTransactionCountResult**: Hex

JSON-RPC response for `eth_getTransactionCount` procedure

#### Defined in

[result/EthResult.ts:119](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L119)

___

### EthGetTransactionReceiptHandler

Ƭ **EthGetTransactionReceiptHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetTransactionReceiptResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetTransactionReceiptParams |

##### Returns

Promise\<EthGetTransactionReceiptResult\>

#### Defined in

[handlers/EthHandler.ts:177](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L177)

___

### EthGetTransactionReceiptJsonRpcProcedure

Ƭ **EthGetTransactionReceiptJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetTransactionReceiptJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetTransactionReceiptJsonRpcRequest |

##### Returns

Promise\<EthGetTransactionReceiptJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:179](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L179)

___

### EthGetTransactionReceiptJsonRpcRequest

Ƭ **EthGetTransactionReceiptJsonRpcRequest**: JsonRpcRequest\<"eth\_getTransactionReceipt", [txHash: Hex]\>

JSON-RPC request for `eth_getTransactionReceipt` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:204](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L204)

___

### EthGetTransactionReceiptJsonRpcResponse

Ƭ **EthGetTransactionReceiptJsonRpcResponse**: JsonRpcResponse\<"eth\_getTransactionReceipt", TransactionReceiptResult, string\>

JSON-RPC response for `eth_getTransactionReceipt` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:250](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L250)

___

### EthGetTransactionReceiptParams

Ƭ **EthGetTransactionReceiptParams**: GetTransactionParameters

JSON-RPC request for `eth_getTransactionReceipt` procedure

#### Defined in

[params/EthParams.ts:163](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L163)

___

### EthGetTransactionReceiptResult

Ƭ **EthGetTransactionReceiptResult**: TransactionReceiptResult

JSON-RPC response for `eth_getTransactionReceipt` procedure

#### Defined in

[result/EthResult.ts:155](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L155)

___

### EthGetUncleByBlockHashAndIndexHandler

Ƭ **EthGetUncleByBlockHashAndIndexHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetUncleByBlockHashAndIndexResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetUncleByBlockHashAndIndexParams |

##### Returns

Promise\<EthGetUncleByBlockHashAndIndexResult\>

#### Defined in

[handlers/EthHandler.ts:181](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L181)

___

### EthGetUncleByBlockHashAndIndexJsonRpcProcedure

Ƭ **EthGetUncleByBlockHashAndIndexJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetUncleByBlockHashAndIndexJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetUncleByBlockHashAndIndexJsonRpcRequest |

##### Returns

Promise\<EthGetUncleByBlockHashAndIndexJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:183](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L183)

___

### EthGetUncleByBlockHashAndIndexJsonRpcRequest

Ƭ **EthGetUncleByBlockHashAndIndexJsonRpcRequest**: JsonRpcRequest\<"eth\_getUncleByBlockHashAndIndex", readonly [blockHash: Hex, uncleIndex: Hex]\>

JSON-RPC request for `eth_getUncleByBlockHashAndIndex` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:212](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L212)

___

### EthGetUncleByBlockHashAndIndexJsonRpcResponse

Ƭ **EthGetUncleByBlockHashAndIndexJsonRpcResponse**: JsonRpcResponse\<"eth\_getUncleByBlockHashAndIndex", Hex, string\>

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
| `blockHash` | Hex |
| `uncleIndex` | Hex |

#### Defined in

[params/EthParams.ts:168](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L168)

___

### EthGetUncleByBlockHashAndIndexResult

Ƭ **EthGetUncleByBlockHashAndIndexResult**: Hex

JSON-RPC response for `eth_getUncleByBlockHashAndIndex` procedure

#### Defined in

[result/EthResult.ts:161](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L161)

___

### EthGetUncleByBlockNumberAndIndexHandler

Ƭ **EthGetUncleByBlockNumberAndIndexHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetUncleByBlockNumberAndIndexResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetUncleByBlockNumberAndIndexParams |

##### Returns

Promise\<EthGetUncleByBlockNumberAndIndexResult\>

#### Defined in

[handlers/EthHandler.ts:185](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L185)

___

### EthGetUncleByBlockNumberAndIndexJsonRpcProcedure

Ƭ **EthGetUncleByBlockNumberAndIndexJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetUncleByBlockNumberAndIndexJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetUncleByBlockNumberAndIndexJsonRpcRequest |

##### Returns

Promise\<EthGetUncleByBlockNumberAndIndexJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:187](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L187)

___

### EthGetUncleByBlockNumberAndIndexJsonRpcRequest

Ƭ **EthGetUncleByBlockNumberAndIndexJsonRpcRequest**: JsonRpcRequest\<"eth\_getUncleByBlockNumberAndIndex", readonly [tag: BlockTag \| Hex, uncleIndex: Hex]\>

JSON-RPC request for `eth_getUncleByBlockNumberAndIndex` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:220](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L220)

___

### EthGetUncleByBlockNumberAndIndexJsonRpcResponse

Ƭ **EthGetUncleByBlockNumberAndIndexJsonRpcResponse**: JsonRpcResponse\<"eth\_getUncleByBlockNumberAndIndex", Hex, string\>

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
| `tag` | BlockTag \| Hex |
| `uncleIndex` | Hex |

#### Defined in

[params/EthParams.ts:176](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L176)

___

### EthGetUncleByBlockNumberAndIndexResult

Ƭ **EthGetUncleByBlockNumberAndIndexResult**: Hex

JSON-RPC response for `eth_getUncleByBlockNumberAndIndex` procedure

#### Defined in

[result/EthResult.ts:167](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L167)

___

### EthGetUncleCountByBlockHashHandler

Ƭ **EthGetUncleCountByBlockHashHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetUncleCountByBlockHashResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetUncleCountByBlockHashParams |

##### Returns

Promise\<EthGetUncleCountByBlockHashResult\>

#### Defined in

[handlers/EthHandler.ts:157](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L157)

___

### EthGetUncleCountByBlockHashJsonRpcProcedure

Ƭ **EthGetUncleCountByBlockHashJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetUncleCountByBlockHashJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetUncleCountByBlockHashJsonRpcRequest |

##### Returns

Promise\<EthGetUncleCountByBlockHashJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:159](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L159)

___

### EthGetUncleCountByBlockHashJsonRpcRequest

Ƭ **EthGetUncleCountByBlockHashJsonRpcRequest**: JsonRpcRequest\<"eth\_getUncleCountByBlockHash", readonly [hash: Hex]\>

JSON-RPC request for `eth_getUncleCountByBlockHash` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:163](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L163)

___

### EthGetUncleCountByBlockHashJsonRpcResponse

Ƭ **EthGetUncleCountByBlockHashJsonRpcResponse**: JsonRpcResponse\<"eth\_getUncleCountByBlockHash", Hex, string\>

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
| `hash` | Hex |

#### Defined in

[params/EthParams.ts:132](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L132)

___

### EthGetUncleCountByBlockHashResult

Ƭ **EthGetUncleCountByBlockHashResult**: Hex

JSON-RPC response for `eth_getUncleCountByBlockHash` procedure

#### Defined in

[result/EthResult.ts:125](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L125)

___

### EthGetUncleCountByBlockNumberHandler

Ƭ **EthGetUncleCountByBlockNumberHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetUncleCountByBlockNumberResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetUncleCountByBlockNumberParams |

##### Returns

Promise\<EthGetUncleCountByBlockNumberResult\>

#### Defined in

[handlers/EthHandler.ts:161](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L161)

___

### EthGetUncleCountByBlockNumberJsonRpcProcedure

Ƭ **EthGetUncleCountByBlockNumberJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthGetUncleCountByBlockNumberJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthGetUncleCountByBlockNumberJsonRpcRequest |

##### Returns

Promise\<EthGetUncleCountByBlockNumberJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:163](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L163)

___

### EthGetUncleCountByBlockNumberJsonRpcRequest

Ƭ **EthGetUncleCountByBlockNumberJsonRpcRequest**: JsonRpcRequest\<"eth\_getUncleCountByBlockNumber", readonly [tag: BlockTag \| Hex]\>

JSON-RPC request for `eth_getUncleCountByBlockNumber` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:171](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L171)

___

### EthGetUncleCountByBlockNumberJsonRpcResponse

Ƭ **EthGetUncleCountByBlockNumberJsonRpcResponse**: JsonRpcResponse\<"eth\_getUncleCountByBlockNumber", Hex, string\>

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
| `tag` | BlockTag \| Hex |

#### Defined in

[params/EthParams.ts:137](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L137)

___

### EthGetUncleCountByBlockNumberResult

Ƭ **EthGetUncleCountByBlockNumberResult**: Hex

JSON-RPC response for `eth_getUncleCountByBlockNumber` procedure

#### Defined in

[result/EthResult.ts:131](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L131)

___

### EthHashrateHandler

Ƭ **EthHashrateHandler**: Function

#### Type declaration

▸ (`request?`): Promise\<EthHashrateResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request?` | EthHashrateParams |

##### Returns

Promise\<EthHashrateResult\>

#### Defined in

[handlers/EthHandler.ts:105](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L105)

___

### EthHashrateJsonRpcProcedure

Ƭ **EthHashrateJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthHashrateJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthHashrateJsonRpcRequest |

##### Returns

Promise\<EthHashrateJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:107](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L107)

___

### EthHashrateJsonRpcRequest

Ƭ **EthHashrateJsonRpcRequest**: JsonRpcRequest\<"eth\_hashrate", readonly []\>

JSON-RPC request for `eth_hashrate` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:59](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L59)

___

### EthHashrateJsonRpcResponse

Ƭ **EthHashrateJsonRpcResponse**: JsonRpcResponse\<"eth\_hashrate", Hex, string\>

JSON-RPC response for `eth_hashrate` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:71](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L71)

___

### EthHashrateParams

Ƭ **EthHashrateParams**: EmptyParams

JSON-RPC request for `eth_hashrate` procedure

#### Defined in

[params/EthParams.ts:54](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L54)

___

### EthHashrateResult

Ƭ **EthHashrateResult**: Hex

JSON-RPC response for `eth_hashrate` procedure

#### Defined in

[result/EthResult.ts:48](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L48)

___

### EthJsonRpcRequest

Ƭ **EthJsonRpcRequest**: EthAccountsJsonRpcRequest \| EthAccountsJsonRpcRequest \| EthBlockNumberJsonRpcRequest \| EthCallJsonRpcRequest \| EthChainIdJsonRpcRequest \| EthCoinbaseJsonRpcRequest \| EthEstimateGasJsonRpcRequest \| EthHashrateJsonRpcRequest \| EthGasPriceJsonRpcRequest \| EthGetBalanceJsonRpcRequest \| EthGetBlockByHashJsonRpcRequest \| EthGetBlockByNumberJsonRpcRequest \| EthGetBlockTransactionCountByHashJsonRpcRequest \| EthGetBlockTransactionCountByNumberJsonRpcRequest \| EthGetCodeJsonRpcRequest \| EthGetFilterChangesJsonRpcRequest \| EthGetFilterLogsJsonRpcRequest \| EthGetLogsJsonRpcRequest \| EthGetStorageAtJsonRpcRequest \| EthGetTransactionCountJsonRpcRequest \| EthGetUncleCountByBlockHashJsonRpcRequest \| EthGetUncleCountByBlockNumberJsonRpcRequest \| EthGetTransactionByHashJsonRpcRequest \| EthGetTransactionByBlockHashAndIndexJsonRpcRequest \| EthGetTransactionByBlockNumberAndIndexJsonRpcRequest \| EthGetTransactionReceiptJsonRpcRequest \| EthGetUncleByBlockHashAndIndexJsonRpcRequest \| EthGetUncleByBlockNumberAndIndexJsonRpcRequest \| EthMiningJsonRpcRequest \| EthProtocolVersionJsonRpcRequest \| EthSendRawTransactionJsonRpcRequest \| EthSendTransactionJsonRpcRequest \| EthSignJsonRpcRequest \| EthSignTransactionJsonRpcRequest \| EthSyncingJsonRpcRequest \| EthNewFilterJsonRpcRequest \| EthNewBlockFilterJsonRpcRequest \| EthNewPendingTransactionFilterJsonRpcRequest \| EthUninstallFilterJsonRpcRequest

#### Defined in

[requests/EthJsonRpcRequest.ts:321](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L321)

___

### EthJsonRpcRequestHandler

Ƭ **EthJsonRpcRequestHandler**: Function

#### Type declaration

▸ \<`TRequest`\>(`request`): Promise\<EthReturnType[TRequest["method"]]\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TRequest` | extends EthJsonRpcRequest |

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | TRequest |

##### Returns

Promise\<EthReturnType[TRequest["method"]]\>

#### Defined in

[TevmJsonRpcRequestHandler.ts:158](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/TevmJsonRpcRequestHandler.ts#L158)

___

### EthMiningHandler

Ƭ **EthMiningHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthMiningResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthMiningParams |

##### Returns

Promise\<EthMiningResult\>

#### Defined in

[handlers/EthHandler.ts:189](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L189)

___

### EthMiningJsonRpcProcedure

Ƭ **EthMiningJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthMiningJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthMiningJsonRpcRequest |

##### Returns

Promise\<EthMiningJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:191](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L191)

___

### EthMiningJsonRpcRequest

Ƭ **EthMiningJsonRpcRequest**: JsonRpcRequest\<"eth\_mining", readonly []\>

JSON-RPC request for `eth_mining` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:228](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L228)

___

### EthMiningJsonRpcResponse

Ƭ **EthMiningJsonRpcResponse**: JsonRpcResponse\<"eth\_mining", boolean, string\>

JSON-RPC response for `eth_mining` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:280](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L280)

___

### EthMiningParams

Ƭ **EthMiningParams**: EmptyParams

JSON-RPC request for `eth_mining` procedure

#### Defined in

[params/EthParams.ts:184](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L184)

___

### EthMiningResult

Ƭ **EthMiningResult**: boolean

JSON-RPC response for `eth_mining` procedure

#### Defined in

[result/EthResult.ts:173](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L173)

___

### EthNewBlockFilterHandler

Ƭ **EthNewBlockFilterHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthNewBlockFilterResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthNewBlockFilterParams |

##### Returns

Promise\<EthNewBlockFilterResult\>

#### Defined in

[handlers/EthHandler.ts:219](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L219)

___

### EthNewBlockFilterJsonRpcProcedure

Ƭ **EthNewBlockFilterJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthNewBlockFilterJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthNewBlockFilterJsonRpcRequest |

##### Returns

Promise\<EthNewBlockFilterJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:223](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L223)

___

### EthNewBlockFilterJsonRpcRequest

Ƭ **EthNewBlockFilterJsonRpcRequest**: JsonRpcRequest\<"eth\_newBlockFilter", readonly []\>

JSON-RPC request for `eth_newBlockFilter` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:300](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L300)

___

### EthNewBlockFilterJsonRpcResponse

Ƭ **EthNewBlockFilterJsonRpcResponse**: JsonRpcResponse\<"eth\_newBlockFilter", Hex, string\>

JSON-RPC response for `eth_newBlockFilter` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:375](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L375)

___

### EthNewBlockFilterParams

Ƭ **EthNewBlockFilterParams**: EmptyParams

JSON-RPC request for `eth_newBlockFilter` procedure

#### Defined in

[params/EthParams.ts:224](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L224)

___

### EthNewBlockFilterResult

Ƭ **EthNewBlockFilterResult**: Hex

JSON-RPC response for `eth_newBlockFilter` procedure

#### Defined in

[result/EthResult.ts:241](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L241)

___

### EthNewFilterHandler

Ƭ **EthNewFilterHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthNewFilterResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthNewFilterParams |

##### Returns

Promise\<EthNewFilterResult\>

#### Defined in

[handlers/EthHandler.ts:215](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L215)

___

### EthNewFilterJsonRpcProcedure

Ƭ **EthNewFilterJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthNewFilterJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthNewFilterJsonRpcRequest |

##### Returns

Promise\<EthNewFilterJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:219](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L219)

___

### EthNewFilterJsonRpcRequest

Ƭ **EthNewFilterJsonRpcRequest**: JsonRpcRequest\<"eth\_newFilter", SerializeToJson\<FilterParams\>\>

JSON-RPC request for `eth_newFilter` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:292](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L292)

___

### EthNewFilterJsonRpcResponse

Ƭ **EthNewFilterJsonRpcResponse**: JsonRpcResponse\<"eth\_newFilter", Hex, string\>

JSON-RPC response for `eth_newFilter` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:365](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L365)

___

### EthNewFilterParams

Ƭ **EthNewFilterParams**: FilterParams

JSON-RPC request for `eth_newFilter` procedure

#### Defined in

[params/EthParams.ts:219](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L219)

___

### EthNewFilterResult

Ƭ **EthNewFilterResult**: Hex

JSON-RPC response for `eth_newFilter` procedure

#### Defined in

[result/EthResult.ts:235](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L235)

___

### EthNewPendingTransactionFilterHandler

Ƭ **EthNewPendingTransactionFilterHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthNewPendingTransactionFilterResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthNewPendingTransactionFilterParams |

##### Returns

Promise\<EthNewPendingTransactionFilterResult\>

#### Defined in

[handlers/EthHandler.ts:223](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L223)

___

### EthNewPendingTransactionFilterJsonRpcProcedure

Ƭ **EthNewPendingTransactionFilterJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthNewPendingTransactionFilterJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthNewPendingTransactionFilterJsonRpcRequest |

##### Returns

Promise\<EthNewPendingTransactionFilterJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:227](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L227)

___

### EthNewPendingTransactionFilterJsonRpcRequest

Ƭ **EthNewPendingTransactionFilterJsonRpcRequest**: JsonRpcRequest\<"eth\_newPendingTransactionFilter", readonly []\>

JSON-RPC request for `eth_newPendingTransactionFilter` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:308](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L308)

___

### EthNewPendingTransactionFilterJsonRpcResponse

Ƭ **EthNewPendingTransactionFilterJsonRpcResponse**: JsonRpcResponse\<"eth\_newPendingTransactionFilter", Hex, string\>

JSON-RPC response for `eth_newPendingTransactionFilter` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:386](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L386)

___

### EthNewPendingTransactionFilterParams

Ƭ **EthNewPendingTransactionFilterParams**: EmptyParams

JSON-RPC request for `eth_newPendingTransactionFilter` procedure

#### Defined in

[params/EthParams.ts:229](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L229)

___

### EthNewPendingTransactionFilterResult

Ƭ **EthNewPendingTransactionFilterResult**: Hex

JSON-RPC response for `eth_newPendingTransactionFilter` procedure

#### Defined in

[result/EthResult.ts:247](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L247)

___

### EthParams

Ƭ **EthParams**: EthAccountsParams \| EthAccountsParams \| EthBlockNumberParams \| EthCallParams \| EthChainIdParams \| EthCoinbaseParams \| EthEstimateGasParams \| EthHashrateParams \| EthGasPriceParams \| EthGetBalanceParams \| EthGetBlockByHashParams \| EthGetBlockByNumberParams \| EthGetBlockTransactionCountByHashParams \| EthGetBlockTransactionCountByNumberParams \| EthGetCodeParams \| EthGetFilterChangesParams \| EthGetFilterLogsParams \| EthGetLogsParams \| EthGetStorageAtParams \| EthGetTransactionCountParams \| EthGetUncleCountByBlockHashParams \| EthGetUncleCountByBlockNumberParams \| EthGetTransactionByHashParams \| EthGetTransactionByBlockHashAndIndexParams \| EthGetTransactionByBlockNumberAndIndexParams \| EthGetTransactionReceiptParams \| EthGetUncleByBlockHashAndIndexParams \| EthGetUncleByBlockNumberAndIndexParams \| EthMiningParams \| EthProtocolVersionParams \| EthSendRawTransactionParams \| EthSendTransactionParams \| EthSignParams \| EthSignTransactionParams \| EthSyncingParams \| EthNewFilterParams \| EthNewBlockFilterParams \| EthNewPendingTransactionFilterParams \| EthUninstallFilterParams

#### Defined in

[params/EthParams.ts:236](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L236)

___

### EthProtocolVersionHandler

Ƭ **EthProtocolVersionHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthProtocolVersionResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthProtocolVersionParams |

##### Returns

Promise\<EthProtocolVersionResult\>

#### Defined in

[handlers/EthHandler.ts:193](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L193)

___

### EthProtocolVersionJsonRpcProcedure

Ƭ **EthProtocolVersionJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthProtocolVersionJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthProtocolVersionJsonRpcRequest |

##### Returns

Promise\<EthProtocolVersionJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:195](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L195)

___

### EthProtocolVersionJsonRpcRequest

Ƭ **EthProtocolVersionJsonRpcRequest**: JsonRpcRequest\<"eth\_protocolVersion", readonly []\>

JSON-RPC request for `eth_protocolVersion` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:233](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L233)

___

### EthProtocolVersionJsonRpcResponse

Ƭ **EthProtocolVersionJsonRpcResponse**: JsonRpcResponse\<"eth\_protocolVersion", Hex, string\>

JSON-RPC response for `eth_protocolVersion` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:290](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L290)

___

### EthProtocolVersionParams

Ƭ **EthProtocolVersionParams**: EmptyParams

JSON-RPC request for `eth_protocolVersion` procedure

#### Defined in

[params/EthParams.ts:189](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L189)

___

### EthProtocolVersionResult

Ƭ **EthProtocolVersionResult**: Hex

JSON-RPC response for `eth_protocolVersion` procedure

#### Defined in

[result/EthResult.ts:179](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L179)

___

### EthSendRawTransactionHandler

Ƭ **EthSendRawTransactionHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthSendRawTransactionResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthSendRawTransactionParams |

##### Returns

Promise\<EthSendRawTransactionResult\>

#### Defined in

[handlers/EthHandler.ts:197](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L197)

___

### EthSendRawTransactionJsonRpcProcedure

Ƭ **EthSendRawTransactionJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthSendRawTransactionJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthSendRawTransactionJsonRpcRequest |

##### Returns

Promise\<EthSendRawTransactionJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:199](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L199)

___

### EthSendRawTransactionJsonRpcRequest

Ƭ **EthSendRawTransactionJsonRpcRequest**: JsonRpcRequest\<"eth\_sendRawTransaction", [data: Hex]\>

JSON-RPC request for `eth_sendRawTransaction` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:241](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L241)

___

### EthSendRawTransactionJsonRpcResponse

Ƭ **EthSendRawTransactionJsonRpcResponse**: JsonRpcResponse\<"eth\_sendRawTransaction", Hex, string\>

JSON-RPC response for `eth_sendRawTransaction` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:300](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L300)

___

### EthSendRawTransactionParams

Ƭ **EthSendRawTransactionParams**: SendRawTransactionParameters

JSON-RPC request for `eth_sendRawTransaction` procedure

#### Defined in

[params/EthParams.ts:194](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L194)

___

### EthSendRawTransactionResult

Ƭ **EthSendRawTransactionResult**: Hex

JSON-RPC response for `eth_sendRawTransaction` procedure

#### Defined in

[result/EthResult.ts:185](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L185)

___

### EthSendTransactionHandler

Ƭ **EthSendTransactionHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthSendTransactionResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthSendTransactionParams |

##### Returns

Promise\<EthSendTransactionResult\>

#### Defined in

[handlers/EthHandler.ts:201](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L201)

___

### EthSendTransactionJsonRpcProcedure

Ƭ **EthSendTransactionJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthSendTransactionJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthSendTransactionJsonRpcRequest |

##### Returns

Promise\<EthSendTransactionJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:203](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L203)

___

### EthSendTransactionJsonRpcRequest

Ƭ **EthSendTransactionJsonRpcRequest**: JsonRpcRequest\<"eth\_sendTransaction", [tx: Transaction]\>

JSON-RPC request for `eth_sendTransaction` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:249](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L249)

___

### EthSendTransactionJsonRpcResponse

Ƭ **EthSendTransactionJsonRpcResponse**: JsonRpcResponse\<"eth\_sendTransaction", Hex, string\>

JSON-RPC response for `eth_sendTransaction` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:310](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L310)

___

### EthSendTransactionParams

Ƭ **EthSendTransactionParams**: SendTransactionParameters

JSON-RPC request for `eth_sendTransaction` procedure

#### Defined in

[params/EthParams.ts:199](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L199)

___

### EthSendTransactionResult

Ƭ **EthSendTransactionResult**: Hex

JSON-RPC response for `eth_sendTransaction` procedure

#### Defined in

[result/EthResult.ts:191](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L191)

___

### EthSignHandler

Ƭ **EthSignHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthSignResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthSignParams |

##### Returns

Promise\<EthSignResult\>

#### Defined in

[handlers/EthHandler.ts:205](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L205)

___

### EthSignJsonRpcProcedure

Ƭ **EthSignJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthSignJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthSignJsonRpcRequest |

##### Returns

Promise\<EthSignJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:207](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L207)

___

### EthSignJsonRpcRequest

Ƭ **EthSignJsonRpcRequest**: JsonRpcRequest\<"eth\_sign", [address: Address, message: Hex]\>

JSON-RPC request for `eth_sign` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:257](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L257)

___

### EthSignJsonRpcResponse

Ƭ **EthSignJsonRpcResponse**: JsonRpcResponse\<"eth\_sign", Hex, string\>

JSON-RPC response for `eth_sign` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:320](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L320)

___

### EthSignParams

Ƭ **EthSignParams**: SignMessageParameters

JSON-RPC request for `eth_sign` procedure

#### Defined in

[params/EthParams.ts:204](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L204)

___

### EthSignResult

Ƭ **EthSignResult**: Hex

JSON-RPC response for `eth_sign` procedure

#### Defined in

[result/EthResult.ts:197](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L197)

___

### EthSignTransactionHandler

Ƭ **EthSignTransactionHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthSignTransactionResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthSignTransactionParams |

##### Returns

Promise\<EthSignTransactionResult\>

#### Defined in

[handlers/EthHandler.ts:207](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L207)

___

### EthSignTransactionJsonRpcProcedure

Ƭ **EthSignTransactionJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthSignTransactionJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthSignTransactionJsonRpcRequest |

##### Returns

Promise\<EthSignTransactionJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:211](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L211)

___

### EthSignTransactionJsonRpcRequest

Ƭ **EthSignTransactionJsonRpcRequest**: JsonRpcRequest\<"eth\_signTransaction", [Object]\>

JSON-RPC request for `eth_signTransaction` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:265](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L265)

___

### EthSignTransactionJsonRpcResponse

Ƭ **EthSignTransactionJsonRpcResponse**: JsonRpcResponse\<"eth\_signTransaction", Hex, string\>

JSON-RPC response for `eth_signTransaction` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:326](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L326)

___

### EthSignTransactionParams

Ƭ **EthSignTransactionParams**: SignMessageParameters

JSON-RPC request for `eth_signTransaction` procedure

#### Defined in

[params/EthParams.ts:209](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L209)

___

### EthSignTransactionResult

Ƭ **EthSignTransactionResult**: Hex

JSON-RPC response for `eth_signTransaction` procedure

#### Defined in

[result/EthResult.ts:203](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L203)

___

### EthSyncingHandler

Ƭ **EthSyncingHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthSyncingResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthSyncingParams |

##### Returns

Promise\<EthSyncingResult\>

#### Defined in

[handlers/EthHandler.ts:211](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L211)

___

### EthSyncingJsonRpcProcedure

Ƭ **EthSyncingJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthSyncingJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthSyncingJsonRpcRequest |

##### Returns

Promise\<EthSyncingJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:215](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L215)

___

### EthSyncingJsonRpcRequest

Ƭ **EthSyncingJsonRpcRequest**: JsonRpcRequest\<"eth\_syncing", readonly []\>

JSON-RPC request for `eth_syncing` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:284](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L284)

___

### EthSyncingJsonRpcResponse

Ƭ **EthSyncingJsonRpcResponse**: JsonRpcResponse\<"eth\_syncing", boolean \| Object, string\>

JSON-RPC response for `eth_syncing` procedure

#### Defined in

[responses/EthJsonRpcResponse.ts:336](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/EthJsonRpcResponse.ts#L336)

___

### EthSyncingParams

Ƭ **EthSyncingParams**: EmptyParams

JSON-RPC request for `eth_syncing` procedure

#### Defined in

[params/EthParams.ts:214](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L214)

___

### EthSyncingResult

Ƭ **EthSyncingResult**: boolean \| Object

JSON-RPC response for `eth_syncing` procedure

#### Defined in

[result/EthResult.ts:209](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L209)

___

### EthUninstallFilterHandler

Ƭ **EthUninstallFilterHandler**: Function

#### Type declaration

▸ (`request`): Promise\<EthUninstallFilterResult\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthUninstallFilterParams |

##### Returns

Promise\<EthUninstallFilterResult\>

#### Defined in

[handlers/EthHandler.ts:227](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/EthHandler.ts#L227)

___

### EthUninstallFilterJsonRpcProcedure

Ƭ **EthUninstallFilterJsonRpcProcedure**: Function

#### Type declaration

▸ (`request`): Promise\<EthUninstallFilterJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | EthUninstallFilterJsonRpcRequest |

##### Returns

Promise\<EthUninstallFilterJsonRpcResponse\>

#### Defined in

[procedure/EthProcedure.ts:231](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/EthProcedure.ts#L231)

___

### EthUninstallFilterJsonRpcRequest

Ƭ **EthUninstallFilterJsonRpcRequest**: JsonRpcRequest\<"eth\_uninstallFilter", [filterId: Hex]\>

JSON-RPC request for `eth_uninstallFilter` procedure

#### Defined in

[requests/EthJsonRpcRequest.ts:316](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/EthJsonRpcRequest.ts#L316)

___

### EthUninstallFilterJsonRpcResponse

Ƭ **EthUninstallFilterJsonRpcResponse**: JsonRpcResponse\<"eth\_uninstallFilter", boolean, string\>

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
| `filterId` | Hex |

#### Defined in

[params/EthParams.ts:234](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/EthParams.ts#L234)

___

### EthUninstallFilterResult

Ƭ **EthUninstallFilterResult**: boolean

JSON-RPC response for `eth_uninstallFilter` procedure

#### Defined in

[result/EthResult.ts:253](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/EthResult.ts#L253)

___

### EvmError

Ƭ **EvmError**: TypedError\<TEVMErrorMessage\>

Error type of errors thrown while internally executing a call in the EVM

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEVMErrorMessage` | extends TevmEVMErrorMessage = TevmEVMErrorMessage |

#### Defined in

[errors/EvmError.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/EvmError.ts#L45)

___

### FilterLog

Ƭ **FilterLog**: `Object`

FilterLog type for eth JSON-RPC procedures

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | Hex |
| `blockHash` | Hex |
| `blockNumber` | Hex |
| `data` | Hex |
| `logIndex` | Hex |
| `removed` | boolean |
| `topics` | readonly Hex[] |
| `transactionHash` | Hex |
| `transactionIndex` | Hex |

#### Defined in

[common/FilterLog.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/common/FilterLog.ts#L6)

___

### InvalidAddressError

Ƭ **InvalidAddressError**: TypedError\<"InvalidAddressError"\>

Error thrown when address is invalid

#### Defined in

[errors/InvalidAddressError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidAddressError.ts#L6)

___

### InvalidBalanceError

Ƭ **InvalidBalanceError**: TypedError\<"InvalidBalanceError"\>

Error thrown when balance parameter is invalid

#### Defined in

[errors/InvalidBalanceError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidBalanceError.ts#L6)

___

### InvalidBlobVersionedHashesError

Ƭ **InvalidBlobVersionedHashesError**: TypedError\<"InvalidBlobVersionedHashesError"\>

Error thrown when blobVersionedHashes parameter is invalid

#### Defined in

[errors/InvalidBlobVersionedHashesError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidBlobVersionedHashesError.ts#L6)

___

### InvalidBlockError

Ƭ **InvalidBlockError**: TypedError\<"InvalidBlockError"\>

Error thrown when block parameter is invalid

#### Defined in

[errors/InvalidBlockError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidBlockError.ts#L6)

___

### InvalidBytecodeError

Ƭ **InvalidBytecodeError**: TypedError\<"InvalidBytecodeError"\>

Error thrown when bytecode parameter is invalid

#### Defined in

[errors/InvalidBytecodeError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidBytecodeError.ts#L6)

___

### InvalidCallerError

Ƭ **InvalidCallerError**: TypedError\<"InvalidCallerError"\>

Error thrown when caller parameter is invalid

#### Defined in

[errors/InvalidCallerError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidCallerError.ts#L6)

___

### InvalidDataError

Ƭ **InvalidDataError**: TypedError\<"InvalidDataError"\>

Error thrown when data parameter is invalid

#### Defined in

[errors/InvalidDataError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidDataError.ts#L6)

___

### InvalidDeployedBytecodeError

Ƭ **InvalidDeployedBytecodeError**: TypedError\<"InvalidDeployedBytecodeError"\>

Error thrown when deployedBytecode parameter is invalid

#### Defined in

[errors/InvalidDeployedBytecodeError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidDeployedBytecodeError.ts#L6)

___

### InvalidDepthError

Ƭ **InvalidDepthError**: TypedError\<"InvalidDepthError"\>

Error thrown when depth parameter is invalid

#### Defined in

[errors/InvalidDepthError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidDepthError.ts#L6)

___

### InvalidFunctionNameError

Ƭ **InvalidFunctionNameError**: TypedError\<"InvalidFunctionNameError"\>

Error thrown when function name is invalid

#### Defined in

[errors/InvalidFunctionNameError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidFunctionNameError.ts#L6)

___

### InvalidGasLimitError

Ƭ **InvalidGasLimitError**: TypedError\<"InvalidGasLimitError"\>

Error thrown when gas limit is invalid

#### Defined in

[errors/InvalidGasLimitError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidGasLimitError.ts#L6)

___

### InvalidGasPriceError

Ƭ **InvalidGasPriceError**: TypedError\<"InvalidGasPriceError"\>

Error thrown when gasPrice parameter is invalid

#### Defined in

[errors/InvalidGasPriceError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidGasPriceError.ts#L6)

___

### InvalidGasRefundError

Ƭ **InvalidGasRefundError**: TypedError\<"InvalidGasRefundError"\>

Error thrown when gas refund is invalid

#### Defined in

[errors/InvalidGasRefundError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidGasRefundError.ts#L6)

___

### InvalidNonceError

Ƭ **InvalidNonceError**: TypedError\<"InvalidNonceError"\>

Error thrown when nonce parameter is invalid

#### Defined in

[errors/InvalidNonceError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidNonceError.ts#L6)

___

### InvalidOriginError

Ƭ **InvalidOriginError**: TypedError\<"InvalidOriginError"\>

Error thrown when origin parameter is invalid

#### Defined in

[errors/InvalidOriginError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidOriginError.ts#L6)

___

### InvalidRequestError

Ƭ **InvalidRequestError**: TypedError\<"InvalidRequestError"\>

Error thrown when request is invalid

#### Defined in

[errors/InvalidRequestError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidRequestError.ts#L6)

___

### InvalidSaltError

Ƭ **InvalidSaltError**: TypedError\<"InvalidSaltError"\>

Error thrown when salt parameter is invalid

#### Defined in

[errors/InvalidSaltError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidSaltError.ts#L6)

___

### InvalidSelfdestructError

Ƭ **InvalidSelfdestructError**: TypedError\<"InvalidSelfdestructError"\>

Error thrown when selfdestruct parameter is invalid

#### Defined in

[errors/InvalidSelfdestructError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidSelfdestructError.ts#L6)

___

### InvalidSkipBalanceError

Ƭ **InvalidSkipBalanceError**: TypedError\<"InvalidSkipBalanceError"\>

Error thrown when skipBalance parameter is invalid

#### Defined in

[errors/InvalidSkipBalanceError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidSkipBalanceError.ts#L6)

___

### InvalidStorageRootError

Ƭ **InvalidStorageRootError**: TypedError\<"InvalidStorageRootError"\>

Error thrown when storage root parameter is invalid

#### Defined in

[errors/InvalidStorageRootError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidStorageRootError.ts#L6)

___

### InvalidToError

Ƭ **InvalidToError**: TypedError\<"InvalidToError"\>

Error thrown when `to` parameter is invalid

#### Defined in

[errors/InvalidToError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidToError.ts#L6)

___

### InvalidValueError

Ƭ **InvalidValueError**: TypedError\<"InvalidValueError"\>

Error thrown when value parameter is invalid

#### Defined in

[errors/InvalidValueError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidValueError.ts#L6)

___

### JsonRpcRequest

Ƭ **JsonRpcRequest**: Object & (TParams extends readonly [] ? Object : Object)

Helper type for creating JSON-RPC request types

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TMethod` | extends string |
| `TParams` | `TParams` |

#### Defined in

[requests/JsonRpcRequest.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/JsonRpcRequest.ts#L4)

___

### JsonRpcResponse

Ƭ **JsonRpcResponse**: Object \| Object

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TMethod` | extends string |
| `TResult` | `TResult` |
| `TErrorCode` | extends string |

#### Defined in

[responses/JsonRpcResponse.ts:1](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/JsonRpcResponse.ts#L1)

___

### Log

Ƭ **Log**: `Object`

Generic log information

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | Address |
| `data` | Hex |
| `topics` | Hex[] |

#### Defined in

[common/Log.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/common/Log.ts#L7)

___

### ScriptError

Ƭ **ScriptError**: ContractError \| InvalidBytecodeError \| InvalidDeployedBytecodeError

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

Ƭ **ScriptHandler**: Function

Handler for script tevm procedure

#### Type declaration

▸ \<`TAbi`, `TFunctionName`\>(`params`): Promise\<ScriptResult\<TAbi, TFunctionName\>\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends Abi \| readonly unknown[] = Abi |
| `TFunctionName` | extends ContractFunctionName\<TAbi\> = ContractFunctionName\<TAbi\> |

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | ScriptParams\<TAbi, TFunctionName\> |

##### Returns

Promise\<ScriptResult\<TAbi, TFunctionName\>\>

#### Defined in

[handlers/ScriptHandler.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/ScriptHandler.ts#L8)

___

### ScriptJsonRpcProcedure

Ƭ **ScriptJsonRpcProcedure**: Function

Procedure for handling script JSON-RPC requests

#### Type declaration

▸ (`request`): Promise\<ScriptJsonRpcResponse\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | ScriptJsonRpcRequest |

##### Returns

Promise\<ScriptJsonRpcResponse\>

#### Defined in

[procedure/ScriptJsonRpcProcedure.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/ScriptJsonRpcProcedure.ts#L6)

___

### ScriptJsonRpcRequest

Ƭ **ScriptJsonRpcRequest**: JsonRpcRequest\<"tevm\_script", SerializedParams\>

The JSON-RPC request for the `tevm_script` method

#### Defined in

[requests/ScriptJsonRpcRequest.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/ScriptJsonRpcRequest.ts#L26)

___

### ScriptJsonRpcResponse

Ƭ **ScriptJsonRpcResponse**: JsonRpcResponse\<"tevm\_script", SerializeToJson\<CallResult\>, ScriptError["\_tag"]\>

JSON-RPC response for `tevm_script` procedure

#### Defined in

[responses/ScriptJsonRpcResponse.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/ScriptJsonRpcResponse.ts#L8)

___

### ScriptParams

Ƭ **ScriptParams**: EncodeFunctionDataParameters\<TAbi, TFunctionName\> & BaseCallParams & Object

Tevm params for deploying and running a script

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends Abi \| readonly unknown[] = Abi |
| `TFunctionName` | extends ContractFunctionName\<TAbi\> = ContractFunctionName\<TAbi\> |

#### Defined in

[params/ScriptParams.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/ScriptParams.ts#L12)

___

### ScriptResult

Ƭ **ScriptResult**: ContractResult\<TAbi, TFunctionName, TErrorType\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends Abi \| readonly unknown[] = Abi |
| `TFunctionName` | extends ContractFunctionName\<TAbi\> = ContractFunctionName\<TAbi\> |
| `TErrorType` | ScriptError |

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
| `account` | AccountHandler |
| `call` | CallHandler |
| `contract` | ContractHandler |
| `eth` | Object |
| `eth.blockNumber` | EthBlockNumberHandler |
| `eth.chainId` | EthChainIdHandler |
| `eth.gasPrice` | EthGasPriceHandler |
| `eth.getBalance` | EthGetBalanceHandler |
| `eth.getCode` | EthGetCodeHandler |
| `eth.getStorageAt` | EthGetStorageAtHandler |
| `request` | TevmJsonRpcRequestHandler |
| `script` | ScriptHandler |

#### Defined in

[Tevm.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/Tevm.ts#L23)

___

### TevmEVMErrorMessage

Ƭ **TevmEVMErrorMessage**: "out of gas" \| "code store out of gas" \| "code size to deposit exceeds maximum code size" \| "stack underflow" \| "stack overflow" \| "invalid JUMP" \| "invalid opcode" \| "value out of range" \| "revert" \| "static state change" \| "internal error" \| "create collision" \| "stop" \| "refund exhausted" \| "value overflow" \| "insufficient balance" \| "invalid BEGINSUB" \| "invalid RETURNSUB" \| "invalid JUMPSUB" \| "invalid bytecode deployed" \| "invalid EOF format" \| "initcode exceeds max initcode size" \| "invalid input length" \| "attempting to AUTHCALL without AUTH set" \| "attempting to execute AUTHCALL with nonzero external value" \| "invalid Signature: s-values greater than secp256k1n/2 are considered invalid" \| "invalid input length" \| "point not on curve" \| "input is empty" \| "fp point not in field" \| "kzg commitment does not match versioned hash" \| "kzg inputs invalid" \| "kzg proof invalid"

#### Defined in

[errors/EvmError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/EvmError.ts#L3)

___

### TevmJsonRpcRequest

Ƭ **TevmJsonRpcRequest**: AccountJsonRpcRequest \| CallJsonRpcRequest \| ContractJsonRpcRequest \| ScriptJsonRpcRequest

A Tevm JSON-RPC request
`tevm_account`, `tevm_call`, `tevm_contract`, `tevm_script`

#### Defined in

[requests/TevmJsonRpcRequest.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/TevmJsonRpcRequest.ts#L10)

___

### TevmJsonRpcRequestHandler

Ƭ **TevmJsonRpcRequestHandler**: Function

Type of a JSON-RPC request handler for tevm procedures
Generic and returns the correct response type for a given request

#### Type declaration

▸ \<`TRequest`\>(`request`): Promise\<ReturnType\<TRequest["method"]\>\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TRequest` | extends TevmJsonRpcRequest \| EthJsonRpcRequest \| AnvilJsonRpcRequest \| DebugJsonRpcRequest |

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | TRequest |

##### Returns

Promise\<ReturnType\<TRequest["method"]\>\>

#### Defined in

[TevmJsonRpcRequestHandler.ts:148](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/TevmJsonRpcRequestHandler.ts#L148)

___

### TraceCall

Ƭ **TraceCall**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `calls?` | TraceCall[] |
| `from` | Address |
| `gas?` | bigint |
| `gasUsed?` | bigint |
| `input` | Hex |
| `output` | Hex |
| `to` | Address |
| `type` | TraceType |
| `value?` | bigint |

#### Defined in

[common/TraceCall.ts:5](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/common/TraceCall.ts#L5)

___

### TraceParams

Ƭ **TraceParams**: `Object`

Config params for trace calls

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `timeout?` | string | A duration string of decimal numbers that overrides the default timeout of 5 seconds for JavaScript-based tracing calls. Max timeout is "10s". Valid time units are "ns", "us", "ms", "s" each with optional fraction, such as "300ms" or "2s45ms". **`Example`** ```ts "10s" ``` |
| `tracer` | "callTracer" \| "prestateTracer" | The type of tracer Currently only callTracer supported |
| `tracerConfig?` | Object | object to specify configurations for the tracer |

#### Defined in

[params/DebugParams.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/DebugParams.ts#L6)

___

### TraceResult

Ƭ **TraceResult**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `calls?` | TraceCall[] |
| `from` | Address |
| `gas` | bigint |
| `gasUsed` | bigint |
| `input` | Hex |
| `output` | Hex |
| `to` | Address |
| `type` | TraceType |
| `value` | bigint |

#### Defined in

[common/TraceResult.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/common/TraceResult.ts#L6)

___

### TraceType

Ƭ **TraceType**: "CALL" \| "DELEGATECALL" \| "STATICCALL" \| "CREATE" \| "CREATE2" \| "SELFDESTRUCT" \| "REWARD"

#### Defined in

[common/TraceType.ts:1](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/common/TraceType.ts#L1)

___

### TransactionParams

Ƭ **TransactionParams**: `Object`

A transaction request object

#### Type declaration

| Name | Type |
| :------ | :------ |
| `from` | Address |
| `gas?` | Hex |
| `gasPrice?` | Hex |
| `input` | Hex |
| `nonce?` | Hex |
| `to?` | Address |
| `value?` | Hex |

#### Defined in

[common/TransactionParams.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/common/TransactionParams.ts#L7)

___

### TransactionReceiptResult

Ƭ **TransactionReceiptResult**: `Object`

Transaction receipt result type for eth JSON-RPC procedures

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockHash` | Hex |
| `blockNumber` | Hex |
| `contractAddress` | Hex |
| `cumulativeGasUsed` | Hex |
| `from` | Hex |
| `gasUsed` | Hex |
| `logs` | readonly FilterLog[] |
| `logsBloom` | Hex |
| `status` | Hex |
| `to` | Hex |
| `transactionHash` | Hex |
| `transactionIndex` | Hex |

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
| `blockHash` | Hex |
| `blockNumber` | Hex |
| `from` | Hex |
| `gas` | Hex |
| `gasPrice` | Hex |
| `hash` | Hex |
| `input` | Hex |
| `nonce` | Hex |
| `r` | Hex |
| `s` | Hex |
| `to` | Hex |
| `transactionIndex` | Hex |
| `v` | Hex |
| `value` | Hex |

#### Defined in

[common/TransactionResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/common/TransactionResult.ts#L7)

___

### TypedError

Ƭ **TypedError**: `Object`

Internal utility for creating a typed error as typed by Tevm
`name` is analogous to `code` in a JSON RPC error and is the value used to discriminate errors
for tevm users.
`_tag` is same as name and used internally so it can be changed in non breaking way with regard to name
`message` is a human readable error message
`meta` is an optional object containing additional information about the error

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends string |
| `TMeta` | never |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_tag` | TName |
| `message` | string |
| `meta?` | TMeta |
| `name` | TName |

#### Defined in

[errors/TypedError.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/TypedError.ts#L9)

___

### UnexpectedError

Ƭ **UnexpectedError**: TypedError\<"UnexpectedError"\>

Error representing an unknown error occurred
It should never get thrown. This error being thrown
means an error wasn't properly handled already

#### Defined in

[errors/UnexpectedError.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/UnexpectedError.ts#L8)

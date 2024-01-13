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
- [BaseCallError](api.md#basecallerror)
- [BaseCallParams](api.md#basecallparams)
- [Block](api.md#block)
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
- [EvmError](api.md#evmerror)
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
const {errors} = await tevm.account({address: '0x1234'})

if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
  console.log(errors[0].message) // Invalid address: 0x1234
}
```

#### Defined in

vm/api/dist/index.d.ts:691

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

vm/api/dist/index.d.ts:711

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

vm/api/dist/index.d.ts:1469

___

### AccountJsonRpcRequest

Ƭ **AccountJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"tevm_account"``, `SerializeToJson`\<[`AccountParams`](index.md#accountparams)\>\>

JSON-RPC request for `tevm_account` method

#### Defined in

vm/api/dist/index.d.ts:1035

___

### AccountJsonRpcResponse

Ƭ **AccountJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"tevm_account"``, `SerializeToJson`\<[`AccountResult`](index.md#accountresult)\>, [`AccountError`](api.md#accounterror)[``"_tag"``]\>

JSON-RPC response for `tevm_account` procedure

#### Defined in

vm/api/dist/index.d.ts:1280

___

### BaseCallError

Ƭ **BaseCallError**: [`EvmError`](api.md#evmerror) \| [`InvalidRequestError`](api.md#invalidrequesterror) \| [`InvalidAddressError`](api.md#invalidaddresserror) \| [`InvalidBalanceError`](api.md#invalidbalanceerror) \| [`InvalidBlobVersionedHashesError`](api.md#invalidblobversionedhasheserror) \| [`InvalidBlockError`](api.md#invalidblockerror) \| [`InvalidCallerError`](api.md#invalidcallererror) \| [`InvalidDepthError`](api.md#invaliddeptherror) \| [`InvalidGasLimitError`](api.md#invalidgaslimiterror) \| [`InvalidGasPriceError`](api.md#invalidgaspriceerror) \| [`InvalidGasRefundError`](api.md#invalidgasrefunderror) \| [`InvalidNonceError`](api.md#invalidnonceerror) \| [`InvalidOriginError`](api.md#invalidoriginerror) \| [`InvalidSelfdestructError`](api.md#invalidselfdestructerror) \| [`InvalidSkipBalanceError`](api.md#invalidskipbalanceerror) \| [`InvalidStorageRootError`](api.md#invalidstoragerooterror) \| [`InvalidToError`](api.md#invalidtoerror) \| [`InvalidValueError`](api.md#invalidvalueerror) \| [`UnexpectedError`](api.md#unexpectederror)

Errors returned by all call based tevm procedures including call, contract, and script

#### Defined in

vm/api/dist/index.d.ts:623

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

vm/api/dist/index.d.ts:706

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

vm/api/dist/index.d.ts:716

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

vm/api/dist/index.d.ts:1474

___

### CallJsonRpcRequest

Ƭ **CallJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"tevm_call"``, `SerializeToJson`\<[`CallParams`](index.md#callparams)\>\>

JSON-RPC request for `tevm_call`

#### Defined in

vm/api/dist/index.d.ts:1040

___

### CallJsonRpcResponse

Ƭ **CallJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"tevm_call"``, `SerializeToJson`\<[`CallResult`](index.md#callresult)\>, [`CallError`](api.md#callerror)[``"_tag"``]\>

JSON-RPC response for `tevm_call` procedure

#### Defined in

vm/api/dist/index.d.ts:1285

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

vm/api/dist/index.d.ts:663

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

vm/api/dist/index.d.ts:722

___

### ContractJsonRpcProcedure

Ƭ **ContractJsonRpcProcedure**: [`CallJsonRpcRequest`](api.md#calljsonrpcrequest)

Since ContractJsonRpcProcedure is a quality of life wrapper around CallJsonRpcProcedure
 We choose to overload the type instead of creating a new one. Tevm contract handlers encode their
 contract call as a normal call request over JSON-rpc

#### Defined in

vm/api/dist/index.d.ts:1481

___

### ContractJsonRpcRequest

Ƭ **ContractJsonRpcRequest**: [`CallJsonRpcRequest`](api.md#calljsonrpcrequest)

Since contract calls are just a quality of life wrapper around call we avoid using tevm_contract
in favor of overloading tevm_call

#### Defined in

vm/api/dist/index.d.ts:1046

___

### ContractJsonRpcResponse

Ƭ **ContractJsonRpcResponse**: [`CallJsonRpcResponse`](api.md#calljsonrpcresponse)

Since contract calls are just a quality of life wrapper around call we avoid using tevm_contract
in favor of overloading tevm_call

#### Defined in

vm/api/dist/index.d.ts:1291

___

### EvmError

Ƭ **EvmError**\<`TEVMErrorMessage`\>: [`TypedError`](api.md#typederror)\<`TEVMErrorMessage`\>

Error type of errors thrown while internally executing a call in the EVM

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEVMErrorMessage` | extends `TevmEVMErrorMessage` = `TevmEVMErrorMessage` |

#### Defined in

vm/api/dist/index.d.ts:536

___

### InvalidAddressError

Ƭ **InvalidAddressError**: [`TypedError`](api.md#typederror)\<``"InvalidAddressError"``\>

Error thrown when address is invalid

#### Defined in

vm/api/dist/index.d.ts:541

___

### InvalidBalanceError

Ƭ **InvalidBalanceError**: [`TypedError`](api.md#typederror)\<``"InvalidBalanceError"``\>

Error thrown when balance parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:525

___

### InvalidBlobVersionedHashesError

Ƭ **InvalidBlobVersionedHashesError**: [`TypedError`](api.md#typederror)\<``"InvalidBlobVersionedHashesError"``\>

Error thrown when blobVersionedHashes parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:546

___

### InvalidBlockError

Ƭ **InvalidBlockError**: [`TypedError`](api.md#typederror)\<``"InvalidBlockError"``\>

Error thrown when block parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:551

___

### InvalidBytecodeError

Ƭ **InvalidBytecodeError**: [`TypedError`](api.md#typederror)\<``"InvalidBytecodeError"``\>

Error thrown when bytecode parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:510

___

### InvalidCallerError

Ƭ **InvalidCallerError**: [`TypedError`](api.md#typederror)\<``"InvalidCallerError"``\>

Error thrown when caller parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:556

___

### InvalidDataError

Ƭ **InvalidDataError**: [`TypedError`](api.md#typederror)\<``"InvalidDataError"``\>

Error thrown when data parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:520

___

### InvalidDeployedBytecodeError

Ƭ **InvalidDeployedBytecodeError**: [`TypedError`](api.md#typederror)\<``"InvalidDeployedBytecodeError"``\>

Error thrown when deployedBytecode parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:668

___

### InvalidDepthError

Ƭ **InvalidDepthError**: [`TypedError`](api.md#typederror)\<``"InvalidDepthError"``\>

Error thrown when depth parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:561

___

### InvalidFunctionNameError

Ƭ **InvalidFunctionNameError**: [`TypedError`](api.md#typederror)\<``"InvalidFunctionNameError"``\>

Error thrown when function name is invalid

#### Defined in

vm/api/dist/index.d.ts:530

___

### InvalidGasLimitError

Ƭ **InvalidGasLimitError**: [`TypedError`](api.md#typederror)\<``"InvalidGasLimitError"``\>

Error thrown when gas limit is invalid

#### Defined in

vm/api/dist/index.d.ts:566

___

### InvalidGasPriceError

Ƭ **InvalidGasPriceError**: [`TypedError`](api.md#typederror)\<``"InvalidGasPriceError"``\>

Error thrown when gasPrice parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:571

___

### InvalidGasRefundError

Ƭ **InvalidGasRefundError**: [`TypedError`](api.md#typederror)\<``"InvalidGasRefundError"``\>

Error thrown when gas refund is invalid

#### Defined in

vm/api/dist/index.d.ts:576

___

### InvalidNonceError

Ƭ **InvalidNonceError**: [`TypedError`](api.md#typederror)\<``"InvalidNonceError"``\>

Error thrown when nonce parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:581

___

### InvalidOriginError

Ƭ **InvalidOriginError**: [`TypedError`](api.md#typederror)\<``"InvalidOriginError"``\>

Error thrown when origin parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:586

___

### InvalidRequestError

Ƭ **InvalidRequestError**: [`TypedError`](api.md#typederror)\<``"InvalidRequestError"``\>

Error thrown when request is invalid

#### Defined in

vm/api/dist/index.d.ts:591

___

### InvalidSaltError

Ƭ **InvalidSaltError**: [`TypedError`](api.md#typederror)\<``"InvalidSaltError"``\>

Error thrown when salt parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:696

___

### InvalidSelfdestructError

Ƭ **InvalidSelfdestructError**: [`TypedError`](api.md#typederror)\<``"InvalidSelfdestructError"``\>

Error thrown when selfdestruct parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:596

___

### InvalidSkipBalanceError

Ƭ **InvalidSkipBalanceError**: [`TypedError`](api.md#typederror)\<``"InvalidSkipBalanceError"``\>

Error thrown when skipBalance parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:601

___

### InvalidStorageRootError

Ƭ **InvalidStorageRootError**: [`TypedError`](api.md#typederror)\<``"InvalidStorageRootError"``\>

Error thrown when storage root parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:515

___

### InvalidToError

Ƭ **InvalidToError**: [`TypedError`](api.md#typederror)\<``"InvalidToError"``\>

Error thrown when `to` parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:606

___

### InvalidValueError

Ƭ **InvalidValueError**: [`TypedError`](api.md#typederror)\<``"InvalidValueError"``\>

Error thrown when value parameter is invalid

#### Defined in

vm/api/dist/index.d.ts:611

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

vm/api/dist/index.d.ts:1022

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

vm/api/dist/index.d.ts:1260

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

vm/api/dist/index.d.ts:394

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

vm/api/dist/index.d.ts:679

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

vm/api/dist/index.d.ts:727

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

vm/api/dist/index.d.ts:1486

___

### ScriptJsonRpcRequest

Ƭ **ScriptJsonRpcRequest**: [`JsonRpcRequest`](api.md#jsonrpcrequest)\<``"tevm_script"``, `SerializedParams`\>

The JSON-RPC request for the `tevm_script` method

#### Defined in

vm/api/dist/index.d.ts:1067

___

### ScriptJsonRpcResponse

Ƭ **ScriptJsonRpcResponse**: [`JsonRpcResponse`](api.md#jsonrpcresponse)\<``"tevm_script"``, `SerializeToJson`\<[`CallResult`](index.md#callresult)\>, [`ScriptError`](api.md#scripterror)[``"_tag"``]\>

JSON-RPC response for `tevm_script` procedure

#### Defined in

vm/api/dist/index.d.ts:1296

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
| `blockNumber` | `EthBlockNumberHandler` |
| `call` | [`CallHandler`](api.md#callhandler) |
| `contract` | [`ContractHandler`](api.md#contracthandler) |
| `request` | [`TevmJsonRpcRequestHandler`](index.md#tevmjsonrpcrequesthandler) |
| `script` | [`ScriptHandler`](api.md#scripthandler) |

#### Defined in

vm/api/dist/index.d.ts:1585

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

vm/api/dist/index.d.ts:500

___

### UnexpectedError

Ƭ **UnexpectedError**: [`TypedError`](api.md#typederror)\<``"UnexpectedError"``\>

Error representing an unknown error occurred
It should never get thrown. This error being thrown
means an error wasn't properly handled already

#### Defined in

vm/api/dist/index.d.ts:618

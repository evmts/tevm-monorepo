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
- [EvmError](modules.md#evmerror)
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
- [JsonRpcProcedure](modules.md#jsonrpcprocedure)
- [JsonRpcRequest](modules.md#jsonrpcrequest)
- [JsonRpcResponse](modules.md#jsonrpcresponse)
- [JsonRpcResponseFromRequest](modules.md#jsonrpcresponsefromrequest)
- [Log](modules.md#log)
- [ScriptError](modules.md#scripterror)
- [ScriptHandler](modules.md#scripthandler)
- [ScriptJsonRpcProcedure](modules.md#scriptjsonrpcprocedure)
- [ScriptJsonRpcRequest](modules.md#scriptjsonrpcrequest)
- [ScriptJsonRpcResponse](modules.md#scriptjsonrpcresponse)
- [ScriptParams](modules.md#scriptparams)
- [ScriptResult](modules.md#scriptresult)
- [TevmClient](modules.md#tevmclient)
- [TevmJsonRpcRequest](modules.md#tevmjsonrpcrequest)
- [TevmJsonRpcRequestHandler](modules.md#tevmjsonrpcrequesthandler)
- [TypedError](modules.md#typederror)
- [UnexpectedError](modules.md#unexpectederror)

## Type Aliases

### AccountError

Ƭ **AccountError**: [`InvalidAddressError`](modules.md#invalidaddresserror) \| [`InvalidBalanceError`](modules.md#invalidbalanceerror) \| [`InvalidNonceError`](modules.md#invalidnonceerror) \| [`InvalidStorageRootError`](modules.md#invalidstoragerooterror) \| [`InvalidBytecodeError`](modules.md#invalidbytecodeerror) \| [`InvalidRequestError`](modules.md#invalidrequesterror) \| [`UnexpectedError`](modules.md#unexpectederror)

#### Defined in

[errors/AccountError.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/AccountError.ts#L9)

___

### AccountHandler

Ƭ **AccountHandler**: (`params`: [`AccountParams`](modules.md#accountparams)) => `Promise`\<[`AccountResult`](modules.md#accountresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AccountResult`](modules.md#accountresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AccountParams`](modules.md#accountparams) |

##### Returns

`Promise`\<[`AccountResult`](modules.md#accountresult)\>

#### Defined in

[handlers/AccountHandler.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AccountHandler.ts#L3)

___

### AccountJsonRpcProcedure

Ƭ **AccountJsonRpcProcedure**: [`JsonRpcProcedure`](modules.md#jsonrpcprocedure)\<``"tevm_account"``, [`AccountParams`](modules.md#accountparams), [`AccountResult`](modules.md#accountresult)\<`never`\>, [`AccountError`](modules.md#accounterror)[``"_tag"``]\>

#### Defined in

[procedure/AccountJsonRpcProcedure.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AccountJsonRpcProcedure.ts#L4)

___

### AccountJsonRpcRequest

Ƭ **AccountJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"tevm_account"``, [`AccountParams`](modules.md#accountparams)\>

#### Defined in

[requests/AccountJsonRpcRequest.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AccountJsonRpcRequest.ts#L4)

___

### AccountJsonRpcResponse

Ƭ **AccountJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"tevm_account"``, [`AccountResult`](modules.md#accountresult), [`AccountError`](modules.md#accounterror)[``"_tag"``]\>

#### Defined in

[responses/AccountJsonRpcResponse.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AccountJsonRpcResponse.ts#L4)

___

### AccountParams

Ƭ **AccountParams**: `Object`

Tevm action to put an account into the vm state

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

#### Defined in

[errors/BaseCallError.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/BaseCallError.ts#L21)

___

### BaseCallParams

Ƭ **BaseCallParams**: `Object`

Properties shared accross call-like actions

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

### CallError

Ƭ **CallError**: [`BaseCallError`](modules.md#basecallerror) \| [`InvalidSaltError`](modules.md#invalidsalterror) \| [`InvalidDataError`](modules.md#invaliddataerror) \| [`InvalidDeployedBytecodeError`](modules.md#invaliddeployedbytecodeerror)

#### Defined in

[errors/CallError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/CallError.ts#L6)

___

### CallHandler

Ƭ **CallHandler**: (`action`: [`CallParams`](modules.md#callparams)) => `Promise`\<[`CallResult`](modules.md#callresult)\>

#### Type declaration

▸ (`action`): `Promise`\<[`CallResult`](modules.md#callresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `action` | [`CallParams`](modules.md#callparams) |

##### Returns

`Promise`\<[`CallResult`](modules.md#callresult)\>

#### Defined in

[handlers/CallHandler.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/CallHandler.ts#L3)

___

### CallJsonRpcProcedure

Ƭ **CallJsonRpcProcedure**: [`JsonRpcProcedure`](modules.md#jsonrpcprocedure)\<``"tevm_call"``, [`CallParams`](modules.md#callparams), [`CallResult`](modules.md#callresult)\<`never`\>, [`CallError`](modules.md#callerror)[``"_tag"``]\>

#### Defined in

[procedure/CallJsonRpcProcedure.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/CallJsonRpcProcedure.ts#L4)

___

### CallJsonRpcRequest

Ƭ **CallJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"tevm_call"``, [`CallParams`](modules.md#callparams)\>

#### Defined in

[requests/CallJsonRpcRequest.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/CallJsonRpcRequest.ts#L4)

___

### CallJsonRpcResponse

Ƭ **CallJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"tevm_call"``, [`CallResult`](modules.md#callresult), [`CallError`](modules.md#callerror)[``"_tag"``]\>

#### Defined in

[responses/CallJsonRpcResponse.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/CallJsonRpcResponse.ts#L4)

___

### CallParams

Ƭ **CallParams**: [`BaseCallParams`](modules.md#basecallparams) & \{ `data?`: `Hex` ; `deployedBytecode?`: `Hex` ; `salt?`: `Hex`  }

Tevm action to execute a call on the vm
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

#### Defined in

[errors/ContractError.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/ContractError.ts#L13)

___

### ContractHandler

Ƭ **ContractHandler**: \<TAbi, TFunctionName\>(`action`: [`ContractParams`](modules.md#contractparams)\<`TAbi`, `TFunctionName`\>) => `Promise`\<[`ContractResult`](modules.md#contractresult)\<`TAbi`, `TFunctionName`\>\>

#### Type declaration

▸ \<`TAbi`, `TFunctionName`\>(`action`): `Promise`\<[`ContractResult`](modules.md#contractresult)\<`TAbi`, `TFunctionName`\>\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `action` | [`ContractParams`](modules.md#contractparams)\<`TAbi`, `TFunctionName`\> |

##### Returns

`Promise`\<[`ContractResult`](modules.md#contractresult)\<`TAbi`, `TFunctionName`\>\>

#### Defined in

[handlers/ContractHandler.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/ContractHandler.ts#L4)

___

### ContractJsonRpcProcedure

Ƭ **ContractJsonRpcProcedure**: \<TAbi, TFunctionName\>(`request`: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"tevm_contract"``, [`ContractParams`](modules.md#contractparams)\<`TAbi`, `TFunctionName`\>\>) => `Promise`\<[`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"tevm_contract"``, [`ContractResult`](modules.md#contractresult)\<`TAbi`, `TFunctionName`, `never`\>, [`ContractError`](modules.md#contracterror)[``"_tag"``]\>\>

#### Type declaration

▸ \<`TAbi`, `TFunctionName`\>(`request`): `Promise`\<[`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"tevm_contract"``, [`ContractResult`](modules.md#contractresult)\<`TAbi`, `TFunctionName`, `never`\>, [`ContractError`](modules.md#contracterror)[``"_tag"``]\>\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` |
| `TFunctionName` | extends `string` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"tevm_contract"``, [`ContractParams`](modules.md#contractparams)\<`TAbi`, `TFunctionName`\>\> |

##### Returns

`Promise`\<[`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"tevm_contract"``, [`ContractResult`](modules.md#contractresult)\<`TAbi`, `TFunctionName`, `never`\>, [`ContractError`](modules.md#contracterror)[``"_tag"``]\>\>

#### Defined in

[procedure/ContractJsonRpcProcedure.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/ContractJsonRpcProcedure.ts#L10)

___

### ContractJsonRpcRequest

Ƭ **ContractJsonRpcRequest**\<`TAbi`, `TFunctionName`\>: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"tevm_contract"``, [`ContractParams`](modules.md#contractparams)\<`TAbi`, `TFunctionName`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Defined in

[requests/ContractJsonRpcRequest.ts:5](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/ContractJsonRpcRequest.ts#L5)

___

### ContractJsonRpcResponse

Ƭ **ContractJsonRpcResponse**\<`TAbi`, `TFunctionName`\>: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"tevm_contract"``, [`ContractResult`](modules.md#contractresult)\<`TAbi`, `TFunctionName`\>, [`ContractError`](modules.md#contracterror)[``"_tag"``]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Defined in

[responses/ContractJsonRpcResponse.ts:5](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/ContractJsonRpcResponse.ts#L5)

___

### ContractParams

Ƭ **ContractParams**\<`TAbi`, `TFunctionName`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](modules.md#basecallparams) & \{ `to`: `Address`  }

Tevm action to execute a call on a contract

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Defined in

[params/ContractParams.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/ContractParams.ts#L8)

___

### ContractResult

Ƭ **ContractResult**\<`TAbi`, `TFunctionName`, `ErrorType`\>: [`CallResult`](modules.md#callresult)\<`ErrorType`\> & \{ `data`: `DecodeFunctionResultReturnType`\<`TAbi`, `TFunctionName`\>  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |
| `ErrorType` | [`ContractError`](modules.md#contracterror) |

#### Defined in

[result/ContractResult.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/ContractResult.ts#L6)

___

### EvmError

Ƭ **EvmError**\<`TEVMErrorMessage`\>: [`TypedError`](modules.md#typederror)\<`TEVMErrorMessage`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEVMErrorMessage` | extends `EVMErrorMessage` = `EVMErrorMessage` |

#### Defined in

[errors/EvmError.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/EvmError.ts#L4)

___

### InvalidAddressError

Ƭ **InvalidAddressError**: [`TypedError`](modules.md#typederror)\<``"InvalidAddressError"``\>

#### Defined in

[errors/InvalidAddressError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidAddressError.ts#L3)

___

### InvalidBalanceError

Ƭ **InvalidBalanceError**: [`TypedError`](modules.md#typederror)\<``"InvalidBalanceError"``\>

#### Defined in

[errors/InvalidBalanceError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidBalanceError.ts#L3)

___

### InvalidBlobVersionedHashesError

Ƭ **InvalidBlobVersionedHashesError**: [`TypedError`](modules.md#typederror)\<``"InvalidBlobVersionedHashesError"``\>

#### Defined in

[errors/InvalidBlobVersionedHashesError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidBlobVersionedHashesError.ts#L3)

___

### InvalidBlockError

Ƭ **InvalidBlockError**: [`TypedError`](modules.md#typederror)\<``"InvalidBlockError"``\>

#### Defined in

[errors/InvalidBlockError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidBlockError.ts#L3)

___

### InvalidBytecodeError

Ƭ **InvalidBytecodeError**: [`TypedError`](modules.md#typederror)\<``"InvalidBytecodeError"``\>

#### Defined in

[errors/InvalidBytecodeError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidBytecodeError.ts#L3)

___

### InvalidCallerError

Ƭ **InvalidCallerError**: [`TypedError`](modules.md#typederror)\<``"InvalidCallerError"``\>

#### Defined in

[errors/InvalidCallerError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidCallerError.ts#L3)

___

### InvalidDataError

Ƭ **InvalidDataError**: [`TypedError`](modules.md#typederror)\<``"InvalidDataError"``\>

#### Defined in

[errors/InvalidDataError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidDataError.ts#L3)

___

### InvalidDeployedBytecodeError

Ƭ **InvalidDeployedBytecodeError**: [`TypedError`](modules.md#typederror)\<``"InvalidDeployedBytecodeError"``\>

#### Defined in

[errors/InvalidDeployedBytecodeError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidDeployedBytecodeError.ts#L3)

___

### InvalidDepthError

Ƭ **InvalidDepthError**: [`TypedError`](modules.md#typederror)\<``"InvalidDepthError"``\>

#### Defined in

[errors/InvalidDepthError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidDepthError.ts#L3)

___

### InvalidFunctionNameError

Ƭ **InvalidFunctionNameError**: [`TypedError`](modules.md#typederror)\<``"InvalidFunctionNameError"``\>

#### Defined in

[errors/InvalidFunctionNameError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidFunctionNameError.ts#L3)

___

### InvalidGasLimitError

Ƭ **InvalidGasLimitError**: [`TypedError`](modules.md#typederror)\<``"InvalidGasLimitError"``\>

#### Defined in

[errors/InvalidGasLimitError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidGasLimitError.ts#L3)

___

### InvalidGasPriceError

Ƭ **InvalidGasPriceError**: [`TypedError`](modules.md#typederror)\<``"InvalidGasPriceError"``\>

#### Defined in

[errors/InvalidGasPriceError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidGasPriceError.ts#L3)

___

### InvalidGasRefundError

Ƭ **InvalidGasRefundError**: [`TypedError`](modules.md#typederror)\<``"InvalidGasRefundError"``\>

#### Defined in

[errors/InvalidGasRefundError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidGasRefundError.ts#L3)

___

### InvalidNonceError

Ƭ **InvalidNonceError**: [`TypedError`](modules.md#typederror)\<``"InvalidNonceError"``\>

#### Defined in

[errors/InvalidNonceError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidNonceError.ts#L3)

___

### InvalidOriginError

Ƭ **InvalidOriginError**: [`TypedError`](modules.md#typederror)\<``"InvalidOriginError"``\>

#### Defined in

[errors/InvalidOriginError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidOriginError.ts#L3)

___

### InvalidRequestError

Ƭ **InvalidRequestError**: [`TypedError`](modules.md#typederror)\<``"InvalidRequestError"``\>

#### Defined in

[errors/InvalidRequestError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidRequestError.ts#L3)

___

### InvalidSaltError

Ƭ **InvalidSaltError**: [`TypedError`](modules.md#typederror)\<``"InvalidSaltError"``\>

#### Defined in

[errors/InvalidSaltError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidSaltError.ts#L3)

___

### InvalidSelfdestructError

Ƭ **InvalidSelfdestructError**: [`TypedError`](modules.md#typederror)\<``"InvalidSelfdestructError"``\>

#### Defined in

[errors/InvalidSelfdestructError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidSelfdestructError.ts#L3)

___

### InvalidSkipBalanceError

Ƭ **InvalidSkipBalanceError**: [`TypedError`](modules.md#typederror)\<``"InvalidSkipBalanceError"``\>

#### Defined in

[errors/InvalidSkipBalanceError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidSkipBalanceError.ts#L3)

___

### InvalidStorageRootError

Ƭ **InvalidStorageRootError**: [`TypedError`](modules.md#typederror)\<``"InvalidStorageRootError"``\>

#### Defined in

[errors/InvalidStorageRootError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidStorageRootError.ts#L3)

___

### InvalidToError

Ƭ **InvalidToError**: [`TypedError`](modules.md#typederror)\<``"InvalidToError"``\>

#### Defined in

[errors/InvalidToError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidToError.ts#L3)

___

### InvalidValueError

Ƭ **InvalidValueError**: [`TypedError`](modules.md#typederror)\<``"InvalidValueError"``\>

#### Defined in

[errors/InvalidValueError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/InvalidValueError.ts#L3)

___

### JsonRpcProcedure

Ƭ **JsonRpcProcedure**\<`TMethod`, `TParams`, `TResult`, `TErrorCode`, `TRequest`, `TResponse`\>: (`request`: `TRequest`) => `Promise`\<`TResponse`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TMethod` | extends `string` |
| `TParams` | `TParams` |
| `TResult` | `TResult` |
| `TErrorCode` | extends `string` |
| `TRequest` | extends [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<`TMethod`, `TParams`\> = [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<`TMethod`, `TParams`\> |
| `TResponse` | extends [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<`TMethod`, `TResult`, `TErrorCode`\> = [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<`TMethod`, `TResult`, `TErrorCode`\> |

#### Type declaration

▸ (`request`): `Promise`\<`TResponse`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | `TRequest` |

##### Returns

`Promise`\<`TResponse`\>

#### Defined in

[procedure/JsonRpcProcedure.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/JsonRpcProcedure.ts#L3)

___

### JsonRpcRequest

Ƭ **JsonRpcRequest**\<`TMethod`, `TParams`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TMethod` | extends `string` |
| `TParams` | `TParams` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id?` | `string` \| `number` \| ``null`` |
| `jsonrpc` | ``"2.0"`` |
| `method` | `TMethod` |
| `params` | `TParams` |

#### Defined in

[requests/JsonRpcRequest.ts:1](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/JsonRpcRequest.ts#L1)

___

### JsonRpcResponse

Ƭ **JsonRpcResponse**\<`TMethod`, `TResult`, `TErrorCode`\>: \{ `id?`: `string` \| `number` \| ``null`` ; `jsonrpc`: ``"2.0"`` ; `method`: `TMethod` ; `result`: `TResult`  } \| \{ `error`: \{ `code`: `TErrorCode` ; `message`: `string`  } ; `id?`: `string` \| `number` \| ``null`` ; `jsonrpc`: ``"2.0"`` ; `method`: `TMethod`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TMethod` | extends `string` |
| `TResult` | `TResult` |
| `TErrorCode` | extends `string` |

#### Defined in

[responses/JsonRpcResponse.ts:1](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/JsonRpcResponse.ts#L1)

___

### JsonRpcResponseFromRequest

Ƭ **JsonRpcResponseFromRequest**\<`T`\>: `T` extends `Pick`\<[`CallJsonRpcRequest`](modules.md#calljsonrpcrequest), ``"method"``\> ? [`CallJsonRpcResponse`](modules.md#calljsonrpcresponse) : `T` extends `Pick`\<[`ContractJsonRpcRequest`](modules.md#contractjsonrpcrequest), ``"method"``\> ? [`ContractJsonRpcResponse`](modules.md#contractjsonrpcresponse)\<`T`[``"params"``][``"abi"``], `T`[``"params"``][``"functionName"``] & `string`\> : `T` extends `Pick`\<[`AccountJsonRpcRequest`](modules.md#accountjsonrpcrequest), ``"method"``\> ? [`AccountJsonRpcResponse`](modules.md#accountjsonrpcresponse) : `T` extends `Pick`\<[`ScriptJsonRpcRequest`](modules.md#scriptjsonrpcrequest), ``"method"``\> ? [`ScriptJsonRpcResponse`](modules.md#scriptjsonrpcresponse)\<`T`[``"params"``][``"abi"``], `T`[``"params"``][``"functionName"``] & `string`\> : `never`

Correctly types a JSON-RPC response based on the request.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`TevmJsonRpcRequest`](modules.md#tevmjsonrpcrequest) |

#### Defined in

[responses/JsonRpcResponseFromRequest.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/JsonRpcResponseFromRequest.ts#L16)

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

#### Defined in

[errors/ScriptError.ts:5](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/ScriptError.ts#L5)

___

### ScriptHandler

Ƭ **ScriptHandler**: \<TAbi, TFunctionName\>(`params`: [`ScriptParams`](modules.md#scriptparams)\<`TAbi`, `TFunctionName`\>) => `Promise`\<[`ScriptResult`](modules.md#scriptresult)\<`TAbi`, `TFunctionName`\>\>

#### Type declaration

▸ \<`TAbi`, `TFunctionName`\>(`params`): `Promise`\<[`ScriptResult`](modules.md#scriptresult)\<`TAbi`, `TFunctionName`\>\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`ScriptParams`](modules.md#scriptparams)\<`TAbi`, `TFunctionName`\> |

##### Returns

`Promise`\<[`ScriptResult`](modules.md#scriptresult)\<`TAbi`, `TFunctionName`\>\>

#### Defined in

[handlers/ScriptHandler.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/ScriptHandler.ts#L4)

___

### ScriptJsonRpcProcedure

Ƭ **ScriptJsonRpcProcedure**: \<TAbi, TFunctionName\>(`request`: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"tevm_script"``, [`ScriptParams`](modules.md#scriptparams)\<`TAbi`, `TFunctionName`\>\>) => `Promise`\<[`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"tevm_script"``, [`ScriptResult`](modules.md#scriptresult)\<`TAbi`, `TFunctionName`, `never`\>, [`ScriptError`](modules.md#scripterror)[``"_tag"``]\>\>

#### Type declaration

▸ \<`TAbi`, `TFunctionName`\>(`request`): `Promise`\<[`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"tevm_script"``, [`ScriptResult`](modules.md#scriptresult)\<`TAbi`, `TFunctionName`, `never`\>, [`ScriptError`](modules.md#scripterror)[``"_tag"``]\>\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` |
| `TFunctionName` | extends `string` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"tevm_script"``, [`ScriptParams`](modules.md#scriptparams)\<`TAbi`, `TFunctionName`\>\> |

##### Returns

`Promise`\<[`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"tevm_script"``, [`ScriptResult`](modules.md#scriptresult)\<`TAbi`, `TFunctionName`, `never`\>, [`ScriptError`](modules.md#scripterror)[``"_tag"``]\>\>

#### Defined in

[procedure/ScriptJsonRpcProcedure.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/ScriptJsonRpcProcedure.ts#L10)

___

### ScriptJsonRpcRequest

Ƭ **ScriptJsonRpcRequest**\<`TAbi`, `TFunctionName`\>: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"tevm_script"``, [`ScriptParams`](modules.md#scriptparams)\<`TAbi`, `TFunctionName`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Defined in

[requests/ScriptJsonRpcRequest.ts:5](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/ScriptJsonRpcRequest.ts#L5)

___

### ScriptJsonRpcResponse

Ƭ **ScriptJsonRpcResponse**\<`TAbi`, `TFunctionName`\>: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"tevm_script"``, [`ScriptResult`](modules.md#scriptresult)\<`TAbi`, `TFunctionName`\>, [`ScriptError`](modules.md#scripterror)[``"_tag"``]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Defined in

[responses/ScriptJsonRpcResponse.ts:5](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/ScriptJsonRpcResponse.ts#L5)

___

### ScriptParams

Ƭ **ScriptParams**\<`TAbi`, `TFunctionName`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](modules.md#basecallparams) & \{ `deployedBytecode`: `Hex`  }

Tevm action to deploy and execute a script or contract

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Defined in

[params/ScriptParams.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/ScriptParams.ts#L8)

___

### ScriptResult

Ƭ **ScriptResult**\<`TAbi`, `TFunctionName`, `TErrorType`\>: [`ContractResult`](modules.md#contractresult)\<`TAbi`, `TFunctionName`, `TErrorType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |
| `TErrorType` | [`ScriptError`](modules.md#scripterror) |

#### Defined in

[result/ScriptResult.ts:5](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/ScriptResult.ts#L5)

___

### TevmClient

Ƭ **TevmClient**: `Object`

The specification for a Tevm client
It has a request method and quality of life methods for each type of request

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account` | [`AccountHandler`](modules.md#accounthandler) |
| `call` | [`CallHandler`](modules.md#callhandler) |
| `contract` | [`ContractHandler`](modules.md#contracthandler) |
| `request` | [`TevmJsonRpcRequestHandler`](modules.md#tevmjsonrpcrequesthandler) |
| `script` | [`ScriptHandler`](modules.md#scripthandler) |

#### Defined in

[TevmClient.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/TevmClient.ts#L13)

___

### TevmJsonRpcRequest

Ƭ **TevmJsonRpcRequest**: [`AccountJsonRpcRequest`](modules.md#accountjsonrpcrequest) \| [`CallJsonRpcRequest`](modules.md#calljsonrpcrequest) \| [`ContractJsonRpcRequest`](modules.md#contractjsonrpcrequest) \| [`ScriptJsonRpcRequest`](modules.md#scriptjsonrpcrequest)

Any valid tevm jsonrpc request

#### Defined in

[requests/TevmJsonRpcRequest.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/TevmJsonRpcRequest.ts#L9)

___

### TevmJsonRpcRequestHandler

Ƭ **TevmJsonRpcRequestHandler**: \<TRequest\>(`request`: `TRequest`) => `Promise`\<[`JsonRpcResponseFromRequest`](modules.md#jsonrpcresponsefromrequest)\<`TRequest`\>\>

#### Type declaration

▸ \<`TRequest`\>(`request`): `Promise`\<[`JsonRpcResponseFromRequest`](modules.md#jsonrpcresponsefromrequest)\<`TRequest`\>\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TRequest` | extends [`TevmJsonRpcRequest`](modules.md#tevmjsonrpcrequest) |

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | `TRequest` |

##### Returns

`Promise`\<[`JsonRpcResponseFromRequest`](modules.md#jsonrpcresponsefromrequest)\<`TRequest`\>\>

#### Defined in

[TevmJsonRpcRequestHandler.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/TevmJsonRpcRequestHandler.ts#L4)

___

### TypedError

Ƭ **TypedError**\<`TName`, `TMeta`\>: `Object`

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

[errors/TypedError.ts:1](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/TypedError.ts#L1)

___

### UnexpectedError

Ƭ **UnexpectedError**: [`TypedError`](modules.md#typederror)\<``"UnexpectedError"``\>

#### Defined in

[errors/UnexpectedError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/UnexpectedError.ts#L3)

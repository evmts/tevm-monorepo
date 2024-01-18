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


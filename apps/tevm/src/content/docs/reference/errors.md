---
title: Example Reference
description: A reference page in my new Starlight docs site.
---
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

### AccountError

Ƭ **AccountError**: [`InvalidAddressError`](modules.md#invalidaddresserror) \| [`InvalidBalanceError`](modules.md#invalidbalanceerror) \| [`InvalidNonceError`](modules.md#invalidnonceerror) \| [`InvalidStorageRootError`](modules.md#invalidstoragerooterror) \| [`InvalidBytecodeError`](modules.md#invalidbytecodeerror) \| [`InvalidRequestError`](modules.md#invalidrequesterror) \| [`UnexpectedError`](modules.md#unexpectederror)

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

___

### TevmEVMErrorMessage

Ƭ **TevmEVMErrorMessage**: ``"out of gas"`` \| ``"code store out of gas"`` \| ``"code size to deposit exceeds maximum code size"`` \| ``"stack underflow"`` \| ``"stack overflow"`` \| ``"invalid JUMP"`` \| ``"invalid opcode"`` \| ``"value out of range"`` \| ``"revert"`` \| ``"static state change"`` \| ``"internal error"`` \| ``"create collision"`` \| ``"stop"`` \| ``"refund exhausted"`` \| ``"value overflow"`` \| ``"insufficient balance"`` \| ``"invalid BEGINSUB"`` \| ``"invalid RETURNSUB"`` \| ``"invalid JUMPSUB"`` \| ``"invalid bytecode deployed"`` \| ``"invalid EOF format"`` \| ``"initcode exceeds max initcode size"`` \| ``"invalid input length"`` \| ``"attempting to AUTHCALL without AUTH set"`` \| ``"attempting to execute AUTHCALL with nonzero external value"`` \| ``"invalid Signature: s-values greater than secp256k1n/2 are considered invalid"`` \| ``"invalid input length"`` \| ``"point not on curve"`` \| ``"input is empty"`` \| ``"fp point not in field"`` \| ``"kzg commitment does not match versioned hash"`` \| ``"kzg inputs invalid"`` \| ``"kzg proof invalid"``

#### Defined in

[errors/EvmError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/EvmError.ts#L3)

___


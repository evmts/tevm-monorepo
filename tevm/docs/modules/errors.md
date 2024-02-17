[tevm](../README.md) / [Modules](../modules.md) / errors

# Module: errors

## Table of contents

### Classes

- [NoProxyConfiguredError](../classes/errors.NoProxyConfiguredError.md)
- [ProxyFetchError](../classes/errors.ProxyFetchError.md)
- [UnexpectedInternalServerError](../classes/errors.UnexpectedInternalServerError.md)
- [UnknownMethodError](../classes/errors.UnknownMethodError.md)
- [UnsupportedMethodError](../classes/errors.UnsupportedMethodError.md)

### Type Aliases

- [AccountNotFoundError](errors.md#accountnotfounderror)
- [BaseCallError](errors.md#basecallerror)
- [CallError](errors.md#callerror)
- [ContractError](errors.md#contracterror)
- [DecodeFunctionDataError](errors.md#decodefunctiondataerror)
- [DumpStateError](errors.md#dumpstateerror)
- [EncodeFunctionReturnDataError](errors.md#encodefunctionreturndataerror)
- [EvmError](errors.md#evmerror)
- [FailedToForkError](errors.md#failedtoforkerror)
- [ForkError](errors.md#forkerror)
- [GetAccountError](errors.md#getaccounterror)
- [InvalidAbiError](errors.md#invalidabierror)
- [InvalidAddressError](errors.md#invalidaddresserror)
- [InvalidArgsError](errors.md#invalidargserror)
- [InvalidBalanceError](errors.md#invalidbalanceerror)
- [InvalidBlobVersionedHashesError](errors.md#invalidblobversionedhasheserror)
- [InvalidBlockError](errors.md#invalidblockerror)
- [InvalidBytecodeError](errors.md#invalidbytecodeerror)
- [InvalidCallerError](errors.md#invalidcallererror)
- [InvalidDataError](errors.md#invaliddataerror)
- [InvalidDeployedBytecodeError](errors.md#invaliddeployedbytecodeerror)
- [InvalidDepthError](errors.md#invaliddeptherror)
- [InvalidFunctionNameError](errors.md#invalidfunctionnameerror)
- [InvalidGasLimitError](errors.md#invalidgaslimiterror)
- [InvalidGasPriceError](errors.md#invalidgaspriceerror)
- [InvalidGasRefundError](errors.md#invalidgasrefunderror)
- [InvalidNonceError](errors.md#invalidnonceerror)
- [InvalidOriginError](errors.md#invalidoriginerror)
- [InvalidRequestError](errors.md#invalidrequesterror)
- [InvalidSaltError](errors.md#invalidsalterror)
- [InvalidSelfdestructError](errors.md#invalidselfdestructerror)
- [InvalidSkipBalanceError](errors.md#invalidskipbalanceerror)
- [InvalidStorageRootError](errors.md#invalidstoragerooterror)
- [InvalidToError](errors.md#invalidtoerror)
- [InvalidUrlError](errors.md#invalidurlerror)
- [InvalidValueError](errors.md#invalidvalueerror)
- [LoadStateError](errors.md#loadstateerror)
- [ScriptError](errors.md#scripterror)
- [SetAccountError](errors.md#setaccounterror)
- [TevmEVMErrorMessage](errors.md#tevmevmerrormessage)
- [TypedError](errors.md#typederror)
- [UnexpectedError](errors.md#unexpectederror)

## Type Aliases

### AccountNotFoundError

Ƭ **AccountNotFoundError**: [`TypedError`](errors.md#typederror)\<``"AccountNotFoundError"``\>

Error thrown when account cannot be found in the state

#### Defined in

evmts-monorepo/packages/errors/types/ethereumjs/AccountNotFoundError.d.ts:5

___

### BaseCallError

Ƭ **BaseCallError**: [`EvmError`](errors.md#evmerror) \| [`InvalidRequestError`](errors.md#invalidrequesterror) \| [`InvalidAddressError`](errors.md#invalidaddresserror) \| [`InvalidBalanceError`](errors.md#invalidbalanceerror) \| [`InvalidBlobVersionedHashesError`](errors.md#invalidblobversionedhasheserror) \| [`InvalidBlockError`](errors.md#invalidblockerror) \| [`InvalidCallerError`](errors.md#invalidcallererror) \| [`InvalidDepthError`](errors.md#invaliddeptherror) \| [`InvalidGasLimitError`](errors.md#invalidgaslimiterror) \| [`InvalidGasPriceError`](errors.md#invalidgaspriceerror) \| [`InvalidGasRefundError`](errors.md#invalidgasrefunderror) \| [`InvalidNonceError`](errors.md#invalidnonceerror) \| [`InvalidOriginError`](errors.md#invalidoriginerror) \| [`InvalidSelfdestructError`](errors.md#invalidselfdestructerror) \| [`InvalidSkipBalanceError`](errors.md#invalidskipbalanceerror) \| [`InvalidStorageRootError`](errors.md#invalidstoragerooterror) \| [`InvalidToError`](errors.md#invalidtoerror) \| [`InvalidValueError`](errors.md#invalidvalueerror) \| [`UnexpectedError`](errors.md#unexpectederror)

Errors returned by all call based tevm procedures including call, contract, and script

#### Defined in

evmts-monorepo/packages/errors/types/actions/BaseCallError.d.ts:7

___

### CallError

Ƭ **CallError**: [`BaseCallError`](errors.md#basecallerror) \| [`InvalidSaltError`](errors.md#invalidsalterror) \| [`InvalidDataError`](errors.md#invaliddataerror) \| [`InvalidDeployedBytecodeError`](errors.md#invaliddeployedbytecodeerror)

Error returned by call tevm procedure

**`Example`**

```ts
const {errors} = await tevm.call({address: '0x1234'})
if (errors?.length) {
 console.log(errors[0].name) // InvalidDataError
}
```

#### Defined in

evmts-monorepo/packages/errors/types/actions/CallError.d.ts:11

___

### ContractError

Ƭ **ContractError**: [`BaseCallError`](errors.md#basecallerror) \| [`InvalidAddressError`](errors.md#invalidaddresserror) \| [`EvmError`](errors.md#evmerror) \| [`InvalidRequestError`](errors.md#invalidrequesterror) \| [`UnexpectedError`](errors.md#unexpectederror) \| [`InvalidAbiError`](errors.md#invalidabierror) \| [`InvalidDataError`](errors.md#invaliddataerror) \| [`InvalidFunctionNameError`](errors.md#invalidfunctionnameerror) \| [`InvalidArgsError`](errors.md#invalidargserror) \| [`DecodeFunctionDataError`](errors.md#decodefunctiondataerror) \| [`EncodeFunctionReturnDataError`](errors.md#encodefunctionreturndataerror)

Errors returned by contract tevm procedure

**`Example`**

```ts
const {errors} = await tevm.contract({address: '0x1234'})
if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
}
```

#### Defined in

evmts-monorepo/packages/errors/types/actions/ContractError.d.ts:14

___

### DecodeFunctionDataError

Ƭ **DecodeFunctionDataError**: [`TypedError`](errors.md#typederror)\<``"DecodeFunctionDataError"``\>

Error thrown when decoding function data fails
Not expected to be thrown unless ABI is incorrect

**`Example`**

```ts
const {errors} = await tevm.call({address: '0x1234'})
errors.forEach(error => {
  if (error.name === 'DecodeFunctionDataError') {
    console.log(error.message)
  }
})
```

#### Defined in

evmts-monorepo/packages/errors/types/utils/DecodeFunctionDataError.d.ts:13

___

### DumpStateError

Ƭ **DumpStateError**: [`InvalidRequestError`](errors.md#invalidrequesterror) \| [`UnexpectedError`](errors.md#unexpectederror)

Error Returned by dump state procedure

**`Example`**

```ts
const {errors} = await tevm.dumpState()

if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
  console.log(errors[0].message) // Invalid address: 0x1234
}
```

#### Defined in

evmts-monorepo/packages/errors/types/actions/DumpStateError.d.ts:13

___

### EncodeFunctionReturnDataError

Ƭ **EncodeFunctionReturnDataError**: [`TypedError`](errors.md#typederror)\<``"EncodeFunctionReturnDataError"``\>

Error thrown when encoding function data fails
Not expected to be thrown because the initial validation
should have caught any errors and thrown more specific errors

#### Defined in

evmts-monorepo/packages/errors/types/utils/EncodeFunctionReturnDataError.d.ts:7

___

### EvmError

Ƭ **EvmError**\<`TEVMErrorMessage`\>: [`TypedError`](errors.md#typederror)\<`TEVMErrorMessage`\>

Error type of errors thrown while internally executing a call in the EVM

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEVMErrorMessage` | extends [`TevmEVMErrorMessage`](errors.md#tevmevmerrormessage) = [`TevmEVMErrorMessage`](errors.md#tevmevmerrormessage) |

#### Defined in

evmts-monorepo/packages/errors/types/ethereumjs/EvmError.d.ts:6

___

### FailedToForkError

Ƭ **FailedToForkError**: [`TypedError`](errors.md#typederror)\<``"FailedToForkError"``\>

#### Defined in

evmts-monorepo/packages/errors/types/actions/ForkError.d.ts:4

___

### ForkError

Ƭ **ForkError**: [`InvalidUrlError`](errors.md#invalidurlerror) \| [`InvalidBlockError`](errors.md#invalidblockerror) \| [`FailedToForkError`](errors.md#failedtoforkerror) \| [`UnexpectedError`](errors.md#unexpectederror)

Error Returned by `tevm_fork` procedure

**`Example`**

```ts
const res = await tevm.fork()

if (res.errors?.length) {
  console.log(res.errors[0].name) // Unable to fork because eth_blockNumber returned an error
  console.log(res.errors[0].message) // fork url returned a 503 forbidden error
}
```

**`See`**

 - [InvalidBlockError](errors.md#invalidblockerror)
 - [FailedToForkError](errors.md#failedtoforkerror)
 - [UnexpectedError](errors.md#unexpectederror)
 - [InvalidUrlError](errors.md#invalidurlerror)

#### Defined in

evmts-monorepo/packages/errors/types/actions/ForkError.d.ts:19

___

### GetAccountError

Ƭ **GetAccountError**: [`AccountNotFoundError`](errors.md#accountnotfounderror) \| [`InvalidAddressError`](errors.md#invalidaddresserror) \| [`InvalidRequestError`](errors.md#invalidrequesterror) \| [`UnexpectedError`](errors.md#unexpectederror)

Errors returned by tevm_getAccount procedure

**`Example`**

```ts
const {errors} = await tevm.getAccount({address: '0x1234'})

if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
  console.log(errors[0].message) // Invalid address: 0x1234
}
```

#### Defined in

evmts-monorepo/packages/errors/types/actions/GetAccountError.d.ts:14

___

### InvalidAbiError

Ƭ **InvalidAbiError**: [`TypedError`](errors.md#typederror)\<``"InvalidAbiError"``\>

Error thrown when ABI shape is invalid

#### Defined in

evmts-monorepo/packages/errors/types/input/InvalidAbiError.d.ts:5

___

### InvalidAddressError

Ƭ **InvalidAddressError**: [`TypedError`](errors.md#typederror)\<``"InvalidAddressError"``\>

Error thrown when address is invalid

#### Defined in

evmts-monorepo/packages/errors/types/input/InvalidAddressError.d.ts:5

___

### InvalidArgsError

Ƭ **InvalidArgsError**: [`TypedError`](errors.md#typederror)\<``"InvalidArgsError"``\>

Error thrown when arguments provided to a contract or script call are invalid

#### Defined in

evmts-monorepo/packages/errors/types/input/InvalidArgsError.d.ts:5

___

### InvalidBalanceError

Ƭ **InvalidBalanceError**: [`TypedError`](errors.md#typederror)\<``"InvalidBalanceError"``\>

Error thrown when balance parameter is invalid

#### Defined in

evmts-monorepo/packages/errors/types/input/InvalidBalanceError.d.ts:5

___

### InvalidBlobVersionedHashesError

Ƭ **InvalidBlobVersionedHashesError**: [`TypedError`](errors.md#typederror)\<``"InvalidBlobVersionedHashesError"``\>

Error thrown when blobVersionedHashes parameter is invalid

#### Defined in

evmts-monorepo/packages/errors/types/input/InvalidBlobVersionedHashesError.d.ts:5

___

### InvalidBlockError

Ƭ **InvalidBlockError**: [`TypedError`](errors.md#typederror)\<``"InvalidBlockError"``\>

Error thrown when block parameter is invalid

#### Defined in

evmts-monorepo/packages/errors/types/input/InvalidBlockError.d.ts:5

___

### InvalidBytecodeError

Ƭ **InvalidBytecodeError**: [`TypedError`](errors.md#typederror)\<``"InvalidBytecodeError"``\>

Error thrown when bytecode parameter is invalid

#### Defined in

evmts-monorepo/packages/errors/types/input/InvalidBytecodeError.d.ts:5

___

### InvalidCallerError

Ƭ **InvalidCallerError**: [`TypedError`](errors.md#typederror)\<``"InvalidCallerError"``\>

Error thrown when caller parameter is invalid

#### Defined in

evmts-monorepo/packages/errors/types/input/InvalidCallerError.d.ts:5

___

### InvalidDataError

Ƭ **InvalidDataError**: [`TypedError`](errors.md#typederror)\<``"InvalidDataError"``\>

Error thrown when data parameter is invalid

#### Defined in

evmts-monorepo/packages/errors/types/input/InvalidDataError.d.ts:5

___

### InvalidDeployedBytecodeError

Ƭ **InvalidDeployedBytecodeError**: [`TypedError`](errors.md#typederror)\<``"InvalidDeployedBytecodeError"``\>

Error thrown when deployedBytecode parameter is invalid

#### Defined in

evmts-monorepo/packages/errors/types/input/InvalidDeployedBytecodeError.d.ts:5

___

### InvalidDepthError

Ƭ **InvalidDepthError**: [`TypedError`](errors.md#typederror)\<``"InvalidDepthError"``\>

Error thrown when depth parameter is invalid

#### Defined in

evmts-monorepo/packages/errors/types/input/InvalidDepthError.d.ts:5

___

### InvalidFunctionNameError

Ƭ **InvalidFunctionNameError**: [`TypedError`](errors.md#typederror)\<``"InvalidFunctionNameError"``\>

Error thrown when function name is invalid

#### Defined in

evmts-monorepo/packages/errors/types/input/InvalidFunctionNameError.d.ts:5

___

### InvalidGasLimitError

Ƭ **InvalidGasLimitError**: [`TypedError`](errors.md#typederror)\<``"InvalidGasLimitError"``\>

Error thrown when gas limit is invalid

#### Defined in

evmts-monorepo/packages/errors/types/input/InvalidGasLimitError.d.ts:5

___

### InvalidGasPriceError

Ƭ **InvalidGasPriceError**: [`TypedError`](errors.md#typederror)\<``"InvalidGasPriceError"``\>

Error thrown when gasPrice parameter is invalid

#### Defined in

evmts-monorepo/packages/errors/types/input/InvalidGasPriceError.d.ts:5

___

### InvalidGasRefundError

Ƭ **InvalidGasRefundError**: [`TypedError`](errors.md#typederror)\<``"InvalidGasRefundError"``\>

Error thrown when gas refund is invalid

#### Defined in

evmts-monorepo/packages/errors/types/input/InvalidGasRefundError.d.ts:5

___

### InvalidNonceError

Ƭ **InvalidNonceError**: [`TypedError`](errors.md#typederror)\<``"InvalidNonceError"``\>

Error thrown when nonce parameter is invalid

#### Defined in

evmts-monorepo/packages/errors/types/input/InvalidNonceError.d.ts:5

___

### InvalidOriginError

Ƭ **InvalidOriginError**: [`TypedError`](errors.md#typederror)\<``"InvalidOriginError"``\>

Error thrown when origin parameter is invalid

#### Defined in

evmts-monorepo/packages/errors/types/input/InvalidOriginError.d.ts:5

___

### InvalidRequestError

Ƭ **InvalidRequestError**: [`TypedError`](errors.md#typederror)\<``"InvalidRequestError"``\>

Error thrown when request is invalid

#### Defined in

evmts-monorepo/packages/errors/types/input/InvalidRequestError.d.ts:5

___

### InvalidSaltError

Ƭ **InvalidSaltError**: [`TypedError`](errors.md#typederror)\<``"InvalidSaltError"``\>

Error thrown when salt parameter is invalid

#### Defined in

evmts-monorepo/packages/errors/types/input/InvalidSaltError.d.ts:5

___

### InvalidSelfdestructError

Ƭ **InvalidSelfdestructError**: [`TypedError`](errors.md#typederror)\<``"InvalidSelfdestructError"``\>

Error thrown when selfdestruct parameter is invalid

#### Defined in

evmts-monorepo/packages/errors/types/input/InvalidSelfdestructError.d.ts:5

___

### InvalidSkipBalanceError

Ƭ **InvalidSkipBalanceError**: [`TypedError`](errors.md#typederror)\<``"InvalidSkipBalanceError"``\>

Error thrown when skipBalance parameter is invalid

#### Defined in

evmts-monorepo/packages/errors/types/input/InvalidSkipBalanceError.d.ts:5

___

### InvalidStorageRootError

Ƭ **InvalidStorageRootError**: [`TypedError`](errors.md#typederror)\<``"InvalidStorageRootError"``\>

Error thrown when storage root parameter is invalid

#### Defined in

evmts-monorepo/packages/errors/types/input/InvalidStorageRootError.d.ts:5

___

### InvalidToError

Ƭ **InvalidToError**: [`TypedError`](errors.md#typederror)\<``"InvalidToError"``\>

Error thrown when `to` parameter is invalid

#### Defined in

evmts-monorepo/packages/errors/types/input/InvalidToError.d.ts:5

___

### InvalidUrlError

Ƭ **InvalidUrlError**: [`TypedError`](errors.md#typederror)\<``"InvalidUrlError"``\>

Error thrown when `url` parameter is invalid

#### Defined in

evmts-monorepo/packages/errors/types/input/InvalidUrlError.d.ts:5

___

### InvalidValueError

Ƭ **InvalidValueError**: [`TypedError`](errors.md#typederror)\<``"InvalidValueError"``\>

Error thrown when value parameter is invalid

#### Defined in

evmts-monorepo/packages/errors/types/input/InvalidValueError.d.ts:5

___

### LoadStateError

Ƭ **LoadStateError**: [`InvalidRequestError`](errors.md#invalidrequesterror) \| [`UnexpectedError`](errors.md#unexpectederror)

Error Returned by load state procedure

**`Example`**

```ts
const {errors} = await tevm.loadState()

if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
  console.log(errors[0].message) // Invalid address: 0x1234
}
```

#### Defined in

evmts-monorepo/packages/errors/types/actions/LoadStateError.d.ts:13

___

### ScriptError

Ƭ **ScriptError**: [`ContractError`](errors.md#contracterror) \| [`InvalidBytecodeError`](errors.md#invalidbytecodeerror) \| [`InvalidDeployedBytecodeError`](errors.md#invaliddeployedbytecodeerror)

Error type of errors thrown by the tevm_script procedure

**`Example`**

```ts
const {errors} = await tevm.script({address: '0x1234'})
if (errors?.length) {
 console.log(errors[0].name) // InvalidBytecodeError
 console.log(errors[0].message) // Invalid bytecode should be a hex string: 1234
}
```

#### Defined in

evmts-monorepo/packages/errors/types/actions/ScriptError.d.ts:12

___

### SetAccountError

Ƭ **SetAccountError**: [`InvalidAddressError`](errors.md#invalidaddresserror) \| [`InvalidBalanceError`](errors.md#invalidbalanceerror) \| [`InvalidNonceError`](errors.md#invalidnonceerror) \| [`InvalidStorageRootError`](errors.md#invalidstoragerooterror) \| [`InvalidBytecodeError`](errors.md#invalidbytecodeerror) \| [`InvalidRequestError`](errors.md#invalidrequesterror) \| [`UnexpectedError`](errors.md#unexpectederror)

Errors returned by tevm_setAccount method

**`Example`**

```ts
const {errors} = await tevm.setAccount({address: '0x1234'})

if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
  console.log(errors[0].message) // Invalid address: 0x1234
}
```

#### Defined in

evmts-monorepo/packages/errors/types/actions/SetAccountError.d.ts:13

___

### TevmEVMErrorMessage

Ƭ **TevmEVMErrorMessage**: ``"out of gas"`` \| ``"code store out of gas"`` \| ``"code size to deposit exceeds maximum code size"`` \| ``"stack underflow"`` \| ``"stack overflow"`` \| ``"invalid JUMP"`` \| ``"invalid opcode"`` \| ``"value out of range"`` \| ``"revert"`` \| ``"static state change"`` \| ``"internal error"`` \| ``"create collision"`` \| ``"stop"`` \| ``"refund exhausted"`` \| ``"value overflow"`` \| ``"insufficient balance"`` \| ``"invalid BEGINSUB"`` \| ``"invalid RETURNSUB"`` \| ``"invalid JUMPSUB"`` \| ``"invalid bytecode deployed"`` \| ``"invalid EOF format"`` \| ``"initcode exceeds max initcode size"`` \| ``"invalid input length"`` \| ``"attempting to AUTHCALL without AUTH set"`` \| ``"attempting to execute AUTHCALL with nonzero external value"`` \| ``"invalid Signature: s-values greater than secp256k1n/2 are considered invalid"`` \| ``"invalid input length"`` \| ``"point not on curve"`` \| ``"input is empty"`` \| ``"fp point not in field"`` \| ``"kzg commitment does not match versioned hash"`` \| ``"kzg inputs invalid"`` \| ``"kzg proof invalid"``

#### Defined in

evmts-monorepo/packages/errors/types/ethereumjs/EvmError.d.ts:2

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

evmts-monorepo/packages/errors/types/TypedError.d.ts:9

___

### UnexpectedError

Ƭ **UnexpectedError**: [`TypedError`](errors.md#typederror)\<``"UnexpectedError"``\>

Error representing an unknown error occurred
It should never get thrown. This error being thrown
means an error wasn't properly handled already

#### Defined in

evmts-monorepo/packages/errors/types/UnexpectedError.d.ts:7

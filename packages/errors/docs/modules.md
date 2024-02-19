[@tevm/errors](README.md) / Exports

# @tevm/errors

## Table of contents

### Classes

- [NoProxyConfiguredError](classes/NoProxyConfiguredError.md)
- [ProxyFetchError](classes/ProxyFetchError.md)
- [UnexpectedInternalServerError](classes/UnexpectedInternalServerError.md)
- [UnknownMethodError](classes/UnknownMethodError.md)
- [UnsupportedMethodError](classes/UnsupportedMethodError.md)

### Type Aliases

- [AccountNotFoundError](modules.md#accountnotfounderror)
- [BaseCallError](modules.md#basecallerror)
- [CallError](modules.md#callerror)
- [ContractError](modules.md#contracterror)
- [DecodeFunctionDataError](modules.md#decodefunctiondataerror)
- [DumpStateError](modules.md#dumpstateerror)
- [EncodeFunctionReturnDataError](modules.md#encodefunctionreturndataerror)
- [EvmError](modules.md#evmerror)
- [FailedToForkError](modules.md#failedtoforkerror)
- [ForkError](modules.md#forkerror)
- [GetAccountError](modules.md#getaccounterror)
- [InvalidAbiError](modules.md#invalidabierror)
- [InvalidAddressError](modules.md#invalidaddresserror)
- [InvalidArgsError](modules.md#invalidargserror)
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
- [InvalidUrlError](modules.md#invalidurlerror)
- [InvalidValueError](modules.md#invalidvalueerror)
- [LoadStateError](modules.md#loadstateerror)
- [ScriptError](modules.md#scripterror)
- [SetAccountError](modules.md#setaccounterror)
- [TevmEVMErrorMessage](modules.md#tevmevmerrormessage)
- [TypedError](modules.md#typederror)
- [UnexpectedError](modules.md#unexpectederror)

## Type Aliases

### AccountNotFoundError

Ƭ **AccountNotFoundError**: [`TypedError`](modules.md#typederror)\<``"AccountNotFoundError"``\>

Error thrown when account cannot be found in the state

#### Defined in

[evmts-monorepo/packages/errors/src/ethereumjs/AccountNotFoundError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereumjs/AccountNotFoundError.ts#L6)

___

### BaseCallError

Ƭ **BaseCallError**: [`EvmError`](modules.md#evmerror) \| [`InvalidRequestError`](modules.md#invalidrequesterror) \| [`InvalidAddressError`](modules.md#invalidaddresserror) \| [`InvalidBalanceError`](modules.md#invalidbalanceerror) \| [`InvalidBlobVersionedHashesError`](modules.md#invalidblobversionedhasheserror) \| [`InvalidBlockError`](modules.md#invalidblockerror) \| [`InvalidCallerError`](modules.md#invalidcallererror) \| [`InvalidDepthError`](modules.md#invaliddeptherror) \| [`InvalidGasLimitError`](modules.md#invalidgaslimiterror) \| [`InvalidGasPriceError`](modules.md#invalidgaspriceerror) \| [`InvalidGasRefundError`](modules.md#invalidgasrefunderror) \| [`InvalidNonceError`](modules.md#invalidnonceerror) \| [`InvalidOriginError`](modules.md#invalidoriginerror) \| [`InvalidSelfdestructError`](modules.md#invalidselfdestructerror) \| [`InvalidSkipBalanceError`](modules.md#invalidskipbalanceerror) \| [`InvalidStorageRootError`](modules.md#invalidstoragerooterror) \| [`InvalidToError`](modules.md#invalidtoerror) \| [`InvalidValueError`](modules.md#invalidvalueerror) \| [`UnexpectedError`](modules.md#unexpectederror)

Errors returned by all call based tevm procedures including call, contract, and script

#### Defined in

[evmts-monorepo/packages/errors/src/actions/BaseCallError.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/actions/BaseCallError.ts#L26)

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

[evmts-monorepo/packages/errors/src/actions/CallError.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/actions/CallError.ts#L16)

___

### ContractError

Ƭ **ContractError**: [`BaseCallError`](modules.md#basecallerror) \| [`InvalidAddressError`](modules.md#invalidaddresserror) \| [`EvmError`](modules.md#evmerror) \| [`InvalidRequestError`](modules.md#invalidrequesterror) \| [`UnexpectedError`](modules.md#unexpectederror) \| [`InvalidAbiError`](modules.md#invalidabierror) \| [`InvalidDataError`](modules.md#invaliddataerror) \| [`InvalidFunctionNameError`](modules.md#invalidfunctionnameerror) \| [`InvalidArgsError`](modules.md#invalidargserror) \| [`DecodeFunctionDataError`](modules.md#decodefunctiondataerror) \| [`EncodeFunctionReturnDataError`](modules.md#encodefunctionreturndataerror)

Errors returned by contract tevm procedure

**`Example`**

```ts
const {errors} = await tevm.contract({address: '0x1234'})
if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
}
```

#### Defined in

[evmts-monorepo/packages/errors/src/actions/ContractError.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/actions/ContractError.ts#L25)

___

### DecodeFunctionDataError

Ƭ **DecodeFunctionDataError**: [`TypedError`](modules.md#typederror)\<``"DecodeFunctionDataError"``\>

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

[evmts-monorepo/packages/errors/src/utils/DecodeFunctionDataError.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/utils/DecodeFunctionDataError.ts#L14)

___

### DumpStateError

Ƭ **DumpStateError**: [`InvalidRequestError`](modules.md#invalidrequesterror) \| [`UnexpectedError`](modules.md#unexpectederror)

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

[evmts-monorepo/packages/errors/src/actions/DumpStateError.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/actions/DumpStateError.ts#L14)

___

### EncodeFunctionReturnDataError

Ƭ **EncodeFunctionReturnDataError**: [`TypedError`](modules.md#typederror)\<``"EncodeFunctionReturnDataError"``\>

Error thrown when encoding function data fails
Not expected to be thrown because the initial validation
should have caught any errors and thrown more specific errors

#### Defined in

[evmts-monorepo/packages/errors/src/utils/EncodeFunctionReturnDataError.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/utils/EncodeFunctionReturnDataError.ts#L8)

___

### EvmError

Ƭ **EvmError**\<`TEVMErrorMessage`\>: [`TypedError`](modules.md#typederror)\<`TEVMErrorMessage`\>

Error type of errors thrown while internally executing a call in the EVM

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEVMErrorMessage` | extends [`TevmEVMErrorMessage`](modules.md#tevmevmerrormessage) = [`TevmEVMErrorMessage`](modules.md#tevmevmerrormessage) |

#### Defined in

[evmts-monorepo/packages/errors/src/ethereumjs/EvmError.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereumjs/EvmError.ts#L45)

___

### FailedToForkError

Ƭ **FailedToForkError**: [`TypedError`](modules.md#typederror)\<``"FailedToForkError"``\>

#### Defined in

[evmts-monorepo/packages/errors/src/actions/ForkError.ts:5](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/actions/ForkError.ts#L5)

___

### ForkError

Ƭ **ForkError**: [`InvalidUrlError`](modules.md#invalidurlerror) \| [`InvalidBlockError`](modules.md#invalidblockerror) \| [`FailedToForkError`](modules.md#failedtoforkerror) \| [`UnexpectedError`](modules.md#unexpectederror)

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

 - [InvalidBlockError](modules.md#invalidblockerror)
 - [FailedToForkError](modules.md#failedtoforkerror)
 - [UnexpectedError](modules.md#unexpectederror)
 - [InvalidUrlError](modules.md#invalidurlerror)

#### Defined in

[evmts-monorepo/packages/errors/src/actions/ForkError.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/actions/ForkError.ts#L21)

___

### GetAccountError

Ƭ **GetAccountError**: [`AccountNotFoundError`](modules.md#accountnotfounderror) \| [`InvalidAddressError`](modules.md#invalidaddresserror) \| [`InvalidRequestError`](modules.md#invalidrequesterror) \| [`UnexpectedError`](modules.md#unexpectederror)

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

[evmts-monorepo/packages/errors/src/actions/GetAccountError.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/actions/GetAccountError.ts#L18)

___

### InvalidAbiError

Ƭ **InvalidAbiError**: [`TypedError`](modules.md#typederror)\<``"InvalidAbiError"``\>

Error thrown when ABI shape is invalid

#### Defined in

[evmts-monorepo/packages/errors/src/input/InvalidAbiError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidAbiError.ts#L6)

___

### InvalidAddressError

Ƭ **InvalidAddressError**: [`TypedError`](modules.md#typederror)\<``"InvalidAddressError"``\>

Error thrown when address is invalid

#### Defined in

[evmts-monorepo/packages/errors/src/input/InvalidAddressError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidAddressError.ts#L6)

___

### InvalidArgsError

Ƭ **InvalidArgsError**: [`TypedError`](modules.md#typederror)\<``"InvalidArgsError"``\>

Error thrown when arguments provided to a contract or script call are invalid

#### Defined in

[evmts-monorepo/packages/errors/src/input/InvalidArgsError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidArgsError.ts#L6)

___

### InvalidBalanceError

Ƭ **InvalidBalanceError**: [`TypedError`](modules.md#typederror)\<``"InvalidBalanceError"``\>

Error thrown when balance parameter is invalid

#### Defined in

[evmts-monorepo/packages/errors/src/input/InvalidBalanceError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidBalanceError.ts#L6)

___

### InvalidBlobVersionedHashesError

Ƭ **InvalidBlobVersionedHashesError**: [`TypedError`](modules.md#typederror)\<``"InvalidBlobVersionedHashesError"``\>

Error thrown when blobVersionedHashes parameter is invalid

#### Defined in

[evmts-monorepo/packages/errors/src/input/InvalidBlobVersionedHashesError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidBlobVersionedHashesError.ts#L6)

___

### InvalidBlockError

Ƭ **InvalidBlockError**: [`TypedError`](modules.md#typederror)\<``"InvalidBlockError"``\>

Error thrown when block parameter is invalid

#### Defined in

[evmts-monorepo/packages/errors/src/input/InvalidBlockError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidBlockError.ts#L6)

___

### InvalidBytecodeError

Ƭ **InvalidBytecodeError**: [`TypedError`](modules.md#typederror)\<``"InvalidBytecodeError"``\>

Error thrown when bytecode parameter is invalid

#### Defined in

[evmts-monorepo/packages/errors/src/input/InvalidBytecodeError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidBytecodeError.ts#L6)

___

### InvalidCallerError

Ƭ **InvalidCallerError**: [`TypedError`](modules.md#typederror)\<``"InvalidCallerError"``\>

Error thrown when caller parameter is invalid

#### Defined in

[evmts-monorepo/packages/errors/src/input/InvalidCallerError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidCallerError.ts#L6)

___

### InvalidDataError

Ƭ **InvalidDataError**: [`TypedError`](modules.md#typederror)\<``"InvalidDataError"``\>

Error thrown when data parameter is invalid

#### Defined in

[evmts-monorepo/packages/errors/src/input/InvalidDataError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidDataError.ts#L6)

___

### InvalidDeployedBytecodeError

Ƭ **InvalidDeployedBytecodeError**: [`TypedError`](modules.md#typederror)\<``"InvalidDeployedBytecodeError"``\>

Error thrown when deployedBytecode parameter is invalid

#### Defined in

[evmts-monorepo/packages/errors/src/input/InvalidDeployedBytecodeError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidDeployedBytecodeError.ts#L6)

___

### InvalidDepthError

Ƭ **InvalidDepthError**: [`TypedError`](modules.md#typederror)\<``"InvalidDepthError"``\>

Error thrown when depth parameter is invalid

#### Defined in

[evmts-monorepo/packages/errors/src/input/InvalidDepthError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidDepthError.ts#L6)

___

### InvalidFunctionNameError

Ƭ **InvalidFunctionNameError**: [`TypedError`](modules.md#typederror)\<``"InvalidFunctionNameError"``\>

Error thrown when function name is invalid

#### Defined in

[evmts-monorepo/packages/errors/src/input/InvalidFunctionNameError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidFunctionNameError.ts#L6)

___

### InvalidGasLimitError

Ƭ **InvalidGasLimitError**: [`TypedError`](modules.md#typederror)\<``"InvalidGasLimitError"``\>

Error thrown when gas limit is invalid

#### Defined in

[evmts-monorepo/packages/errors/src/input/InvalidGasLimitError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidGasLimitError.ts#L6)

___

### InvalidGasPriceError

Ƭ **InvalidGasPriceError**: [`TypedError`](modules.md#typederror)\<``"InvalidGasPriceError"``\>

Error thrown when gasPrice parameter is invalid

#### Defined in

[evmts-monorepo/packages/errors/src/input/InvalidGasPriceError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidGasPriceError.ts#L6)

___

### InvalidGasRefundError

Ƭ **InvalidGasRefundError**: [`TypedError`](modules.md#typederror)\<``"InvalidGasRefundError"``\>

Error thrown when gas refund is invalid

#### Defined in

[evmts-monorepo/packages/errors/src/input/InvalidGasRefundError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidGasRefundError.ts#L6)

___

### InvalidNonceError

Ƭ **InvalidNonceError**: [`TypedError`](modules.md#typederror)\<``"InvalidNonceError"``\>

Error thrown when nonce parameter is invalid

#### Defined in

[evmts-monorepo/packages/errors/src/input/InvalidNonceError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidNonceError.ts#L6)

___

### InvalidOriginError

Ƭ **InvalidOriginError**: [`TypedError`](modules.md#typederror)\<``"InvalidOriginError"``\>

Error thrown when origin parameter is invalid

#### Defined in

[evmts-monorepo/packages/errors/src/input/InvalidOriginError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidOriginError.ts#L6)

___

### InvalidRequestError

Ƭ **InvalidRequestError**: [`TypedError`](modules.md#typederror)\<``"InvalidRequestError"``\>

Error thrown when request is invalid

#### Defined in

[evmts-monorepo/packages/errors/src/input/InvalidRequestError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidRequestError.ts#L6)

___

### InvalidSaltError

Ƭ **InvalidSaltError**: [`TypedError`](modules.md#typederror)\<``"InvalidSaltError"``\>

Error thrown when salt parameter is invalid

#### Defined in

[evmts-monorepo/packages/errors/src/input/InvalidSaltError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidSaltError.ts#L6)

___

### InvalidSelfdestructError

Ƭ **InvalidSelfdestructError**: [`TypedError`](modules.md#typederror)\<``"InvalidSelfdestructError"``\>

Error thrown when selfdestruct parameter is invalid

#### Defined in

[evmts-monorepo/packages/errors/src/input/InvalidSelfdestructError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidSelfdestructError.ts#L6)

___

### InvalidSkipBalanceError

Ƭ **InvalidSkipBalanceError**: [`TypedError`](modules.md#typederror)\<``"InvalidSkipBalanceError"``\>

Error thrown when skipBalance parameter is invalid

#### Defined in

[evmts-monorepo/packages/errors/src/input/InvalidSkipBalanceError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidSkipBalanceError.ts#L6)

___

### InvalidStorageRootError

Ƭ **InvalidStorageRootError**: [`TypedError`](modules.md#typederror)\<``"InvalidStorageRootError"``\>

Error thrown when storage root parameter is invalid

#### Defined in

[evmts-monorepo/packages/errors/src/input/InvalidStorageRootError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidStorageRootError.ts#L6)

___

### InvalidToError

Ƭ **InvalidToError**: [`TypedError`](modules.md#typederror)\<``"InvalidToError"``\>

Error thrown when `to` parameter is invalid

#### Defined in

[evmts-monorepo/packages/errors/src/input/InvalidToError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidToError.ts#L6)

___

### InvalidUrlError

Ƭ **InvalidUrlError**: [`TypedError`](modules.md#typederror)\<``"InvalidUrlError"``\>

Error thrown when `url` parameter is invalid

#### Defined in

[evmts-monorepo/packages/errors/src/input/InvalidUrlError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidUrlError.ts#L6)

___

### InvalidValueError

Ƭ **InvalidValueError**: [`TypedError`](modules.md#typederror)\<``"InvalidValueError"``\>

Error thrown when value parameter is invalid

#### Defined in

[evmts-monorepo/packages/errors/src/input/InvalidValueError.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidValueError.ts#L6)

___

### LoadStateError

Ƭ **LoadStateError**: [`InvalidRequestError`](modules.md#invalidrequesterror) \| [`UnexpectedError`](modules.md#unexpectederror)

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

[evmts-monorepo/packages/errors/src/actions/LoadStateError.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/actions/LoadStateError.ts#L14)

___

### ScriptError

Ƭ **ScriptError**: [`ContractError`](modules.md#contracterror) \| [`InvalidBytecodeError`](modules.md#invalidbytecodeerror) \| [`InvalidDeployedBytecodeError`](modules.md#invaliddeployedbytecodeerror)

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

[evmts-monorepo/packages/errors/src/actions/ScriptError.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/actions/ScriptError.ts#L16)

___

### SetAccountError

Ƭ **SetAccountError**: [`InvalidAddressError`](modules.md#invalidaddresserror) \| [`InvalidBalanceError`](modules.md#invalidbalanceerror) \| [`InvalidNonceError`](modules.md#invalidnonceerror) \| [`InvalidStorageRootError`](modules.md#invalidstoragerooterror) \| [`InvalidBytecodeError`](modules.md#invalidbytecodeerror) \| [`InvalidRequestError`](modules.md#invalidrequesterror) \| [`UnexpectedError`](modules.md#unexpectederror)

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

[evmts-monorepo/packages/errors/src/actions/SetAccountError.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/actions/SetAccountError.ts#L21)

___

### TevmEVMErrorMessage

Ƭ **TevmEVMErrorMessage**: ``"out of gas"`` \| ``"code store out of gas"`` \| ``"code size to deposit exceeds maximum code size"`` \| ``"stack underflow"`` \| ``"stack overflow"`` \| ``"invalid JUMP"`` \| ``"invalid opcode"`` \| ``"value out of range"`` \| ``"revert"`` \| ``"static state change"`` \| ``"internal error"`` \| ``"create collision"`` \| ``"stop"`` \| ``"refund exhausted"`` \| ``"value overflow"`` \| ``"insufficient balance"`` \| ``"invalid BEGINSUB"`` \| ``"invalid RETURNSUB"`` \| ``"invalid JUMPSUB"`` \| ``"invalid bytecode deployed"`` \| ``"invalid EOF format"`` \| ``"initcode exceeds max initcode size"`` \| ``"invalid input length"`` \| ``"attempting to AUTHCALL without AUTH set"`` \| ``"attempting to execute AUTHCALL with nonzero external value"`` \| ``"invalid Signature: s-values greater than secp256k1n/2 are considered invalid"`` \| ``"invalid input length"`` \| ``"point not on curve"`` \| ``"input is empty"`` \| ``"fp point not in field"`` \| ``"kzg commitment does not match versioned hash"`` \| ``"kzg inputs invalid"`` \| ``"kzg proof invalid"``

#### Defined in

[evmts-monorepo/packages/errors/src/ethereumjs/EvmError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereumjs/EvmError.ts#L3)

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

[evmts-monorepo/packages/errors/src/TypedError.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/TypedError.ts#L9)

___

### UnexpectedError

Ƭ **UnexpectedError**: [`TypedError`](modules.md#typederror)\<``"UnexpectedError"``\>

Error representing an unknown error occurred
It should never get thrown. This error being thrown
means an error wasn't properly handled already

#### Defined in

[evmts-monorepo/packages/errors/src/UnexpectedError.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/UnexpectedError.ts#L8)

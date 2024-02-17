[@tevm/precompiles](README.md) / Exports

# @tevm/precompiles

## Table of contents

### Type Aliases

- [CallResult](modules.md#callresult)
- [ConstructorArgument](modules.md#constructorargument)
- [CustomPrecompile](modules.md#customprecompile)
- [TypedError](modules.md#typederror)

### Functions

- [defineCall](modules.md#definecall)
- [definePrecompile](modules.md#defineprecompile)

## Type Aliases

### CallResult

Ƭ **CallResult**\<`TAbi`, `TFunctionName`\>: `Object`

A result of a precompile javascript call

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` |
| `TFunctionName` | extends `string` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `blobGasUsed?` | `bigint` | Amount of blob gas consumed by the transaction |
| `error?` | [`TypedError`](modules.md#typederror)\<`string`\> | Any Error thrown during execution |
| `executionGasUsed` | `bigint` | The amount of gas used during execution. |
| `logs?` | `ReadonlyArray`\<`ExtractAbiEvents`\<`TAbi`\> & \{ `address`: `Address`  }\> | Logs emitted during contract execution. Logs must match the interface of the ABI |
| `returnValue` | `AbiParametersToPrimitiveTypes`\<`ExtractAbiFunction`\<`TAbi`, `TFunctionName`\>[``"outputs"``]\>[``0``] | The return value of the call. Required even on exceptions |
| `selfdestruct?` | `Set`\<`Address`\> | A set of accounts to selfdestruct |

#### Defined in

[precompiles/src/CallResult.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/CallResult.ts#L13)

___

### ConstructorArgument

Ƭ **ConstructorArgument**\<`T`\>: `T` extends (...`args`: infer P) => `any` ? `P`[``0``] : `never`

Infers the the first argument of a class

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[precompiles/src/ConstructorArgument.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/ConstructorArgument.ts#L4)

___

### CustomPrecompile

Ƭ **CustomPrecompile**: `Exclude`\<`Exclude`\<[`ConstructorArgument`](modules.md#constructorargument)\<`EVM`\>, `undefined`\>[``"customPrecompiles"``], `undefined`\>[`number`]

Custom precompiles allow you to run arbitrary JavaScript code in the EVM

#### Defined in

[precompiles/src/CustomPrecompile.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/CustomPrecompile.ts#L13)

___

### TypedError

Ƭ **TypedError**\<`TName`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_tag` | `TName` |
| `message` | `string` |
| `name` | `TName` |

#### Defined in

[precompiles/src/TypedError.ts:1](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/TypedError.ts#L1)

## Functions

### defineCall

▸ **defineCall**\<`TAbi`\>(`abi`, `handlers`): (`__namedParameters`: \{ `data`: \`0x$\{string}\` ; `gasLimit`: `bigint`  }) => `Promise`\<`ExecResult`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `abi` | `TAbi` |
| `handlers` | \{ [TFunctionName in string]: Handler\<TAbi, TFunctionName\> } |

#### Returns

`fn`

▸ (`«destructured»`): `Promise`\<`ExecResult`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `data` | \`0x$\{string}\` |
| › `gasLimit` | `bigint` |

##### Returns

`Promise`\<`ExecResult`\>

#### Defined in

[precompiles/src/defineCall.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/defineCall.ts#L26)

___

### definePrecompile

▸ **definePrecompile**\<`TName`, `THumanReadableAbi`\>(`«destructured»`): `Precompile`\<`TName`, `THumanReadableAbi`, `ReturnType`\<\<TAddress\>(`address`: `TAddress`) => `Omit`\<`Script`\<`TName`, `THumanReadableAbi`\>, ``"events"`` \| ``"read"`` \| ``"write"`` \| ``"address"``\> & \{ `address`: `TAddress` ; `events`: `EventActionCreator`\<`THumanReadableAbi`, \`0x$\{string}\`, \`0x$\{string}\`, `TAddress`\> ; `read`: `ReadActionCreator`\<`THumanReadableAbi`, \`0x$\{string}\`, \`0x$\{string}\`, `TAddress`\> ; `write`: `WriteActionCreator`\<`THumanReadableAbi`, \`0x$\{string}\`, \`0x$\{string}\`, `TAddress`\>  }\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Pick`\<`Precompile`\<`TName`, `THumanReadableAbi`, `ReturnType`\<\<TAddress\>(`address`: `TAddress`) => `Omit`\<`Script`\<`TName`, `THumanReadableAbi`\>, ``"events"`` \| ``"read"`` \| ``"write"`` \| ``"address"``\> & \{ `address`: `TAddress` ; `events`: `EventActionCreator`\<`THumanReadableAbi`, \`0x$\{string}\`, \`0x$\{string}\`, `TAddress`\> ; `read`: `ReadActionCreator`\<`THumanReadableAbi`, \`0x$\{string}\`, \`0x$\{string}\`, `TAddress`\> ; `write`: `WriteActionCreator`\<`THumanReadableAbi`, \`0x$\{string}\`, \`0x$\{string}\`, `TAddress`\>  }\>\>, ``"contract"`` \| ``"call"``\> |

#### Returns

`Precompile`\<`TName`, `THumanReadableAbi`, `ReturnType`\<\<TAddress\>(`address`: `TAddress`) => `Omit`\<`Script`\<`TName`, `THumanReadableAbi`\>, ``"events"`` \| ``"read"`` \| ``"write"`` \| ``"address"``\> & \{ `address`: `TAddress` ; `events`: `EventActionCreator`\<`THumanReadableAbi`, \`0x$\{string}\`, \`0x$\{string}\`, `TAddress`\> ; `read`: `ReadActionCreator`\<`THumanReadableAbi`, \`0x$\{string}\`, \`0x$\{string}\`, `TAddress`\> ; `write`: `WriteActionCreator`\<`THumanReadableAbi`, \`0x$\{string}\`, \`0x$\{string}\`, `TAddress`\>  }\>\>

#### Defined in

[precompiles/src/definePrecompile.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/definePrecompile.ts#L4)

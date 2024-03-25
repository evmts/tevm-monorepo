[tevm](../README.md) / [Modules](../modules.md) / precompiles

# Module: precompiles

## Table of contents

### References

- [ConstructorArgument](precompiles.md#constructorargument)
- [defineCall](precompiles.md#definecall)
- [definePrecompile](precompiles.md#defineprecompile)

### Type Aliases

- [CallResult](precompiles.md#callresult)
- [CustomPrecompile](precompiles.md#customprecompile)
- [TypedError](precompiles.md#typederror)

## References

### ConstructorArgument

Re-exports [ConstructorArgument](index.md#constructorargument)

___

### defineCall

Re-exports [defineCall](index.md#definecall)

___

### definePrecompile

Re-exports [definePrecompile](index.md#defineprecompile)

## Type Aliases

### CallResult

Ƭ **CallResult**\<`TAbi`, `TFunctionName`\>: `Object`

A result of a precompile javascript call

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends [`Abi`](index.md#abi) |
| `TFunctionName` | extends `string` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `blobGasUsed?` | `bigint` | Amount of blob gas consumed by the transaction |
| `error?` | [`TypedError`](precompiles.md#typederror)\<`string`\> | Any Error thrown during execution |
| `executionGasUsed` | `bigint` | The amount of gas used during execution. |
| `logs?` | `ReadonlyArray`\<[`ExtractAbiEvents`](index.md#extractabievents)\<`TAbi`\> & \{ `address`: [`Address`](index.md#address)  }\> | Logs emitted during contract execution. Logs must match the interface of the ABI |
| `returnValue` | [`AbiParametersToPrimitiveTypes`](index.md#abiparameterstoprimitivetypes)\<[`ExtractAbiFunction`](index.md#extractabifunction)\<`TAbi`, `TFunctionName`\>[``"outputs"``]\>[``0``] | The return value of the call. Required even on exceptions |
| `selfdestruct?` | `Set`\<[`Address`](index.md#address)\> | A set of accounts to selfdestruct |

#### Defined in

evmts-monorepo/packages/precompiles/dist/index.d.ts:26

___

### CustomPrecompile

Ƭ **CustomPrecompile**: `Exclude`\<`Exclude`\<[`ConstructorArgument`](index.md#constructorargument)\<typeof `_tevm_evm.Evm`\>, `undefined`\>[``"customPrecompiles"``], `undefined`\>[`number`]

Custom precompiles allow you to run arbitrary JavaScript code in the EVM

#### Defined in

evmts-monorepo/packages/precompiles/dist/index.d.ts:15

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

evmts-monorepo/packages/precompiles/dist/index.d.ts:17

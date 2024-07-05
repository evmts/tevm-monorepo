[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / CreateContractParams

# Type Alias: CreateContractParams\<TName, THumanReadableAbi, TAddress, TBytecode, TDeployedBytecode, TCode\>

> **CreateContractParams**\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>: `object`

Params for creating a [Contract](Contract.md) instance

## Type Parameters

• **TName** *extends* `string` \| `undefined` \| `never`

• **THumanReadableAbi** *extends* readonly `string`[]

• **TAddress** *extends* `undefined` \| [`Address`](Address.md) \| `never`

• **TBytecode** *extends* `undefined` \| [`Hex`](Hex.md) \| `never`

• **TDeployedBytecode** *extends* `undefined` \| [`Hex`](Hex.md) \| `never`

• **TCode** *extends* `undefined` \| [`Hex`](Hex.md) \| `never`

## Type declaration

### address?

> `optional` **address**: `TAddress`

### bytecode?

> `optional` **bytecode**: `TBytecode`

### code?

> `optional` **code**: `TCode`

### deployedBytecode?

> `optional` **deployedBytecode**: `TDeployedBytecode`

### humanReadableAbi

> **humanReadableAbi**: `THumanReadableAbi`

### name?

> `optional` **name**: `TName`

## See

CreateContract

## Defined in

packages/contract/types/CreateContractParams.d.ts:6

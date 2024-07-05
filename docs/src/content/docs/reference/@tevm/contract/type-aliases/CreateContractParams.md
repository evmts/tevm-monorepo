---
editUrl: false
next: false
prev: false
title: "CreateContractParams"
---

> **CreateContractParams**\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>: `object`

Params for creating a [Contract](../../../../../../../reference/tevm/contract/type-aliases/contract) instance

## Type Parameters

• **TName** *extends* `string` \| `undefined` \| `never`

• **THumanReadableAbi** *extends* readonly `string`[]

• **TAddress** *extends* `undefined` \| [`Address`](/reference/tevm/utils/type-aliases/address/) \| `never`

• **TBytecode** *extends* `undefined` \| [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `never`

• **TDeployedBytecode** *extends* `undefined` \| [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `never`

• **TCode** *extends* `undefined` \| [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `never`

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

[CreateContractParams.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/CreateContractParams.ts#L8)

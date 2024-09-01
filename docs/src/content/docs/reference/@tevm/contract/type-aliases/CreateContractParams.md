---
editUrl: false
next: false
prev: false
title: "CreateContractParams"
---

> **CreateContractParams**\<`TName`, `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>: `object` \| `object`

Params for creating a [Contract](../../../../../../../reference/tevm/contract/type-aliases/contract) instance

## See

CreateContract

## Type Parameters

• **TName** *extends* `string` \| `undefined` \| `never`

• **TAbi** *extends* readonly `string`[] \| [`Abi`](/reference/tevm/utils/type-aliases/abi/)

• **TAddress** *extends* `undefined` \| [`Address`](/reference/tevm/utils/type-aliases/address/) \| `never`

• **TBytecode** *extends* `undefined` \| [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `never`

• **TDeployedBytecode** *extends* `undefined` \| [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `never`

• **TCode** *extends* `undefined` \| [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `never`

## Defined in

[CreateContractParams.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/CreateContractParams.ts#L8)

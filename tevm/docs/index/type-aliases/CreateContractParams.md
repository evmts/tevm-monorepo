[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / CreateContractParams

# Type Alias: CreateContractParams\<TName, TAbi, TAddress, TBytecode, TDeployedBytecode, TCode\>

> **CreateContractParams**\<`TName`, `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>: `object` \| `object`

Params for creating a [Contract](Contract.md) instance

## Type Parameters

• **TName** *extends* `string` \| `undefined` \| `never`

• **TAbi** *extends* readonly `string`[] \| [`Abi`](Abi.md)

• **TAddress** *extends* `undefined` \| [`Address`](Address.md) \| `never`

• **TBytecode** *extends* `undefined` \| [`Hex`](Hex.md) \| `never`

• **TDeployedBytecode** *extends* `undefined` \| [`Hex`](Hex.md) \| `never`

• **TCode** *extends* `undefined` \| [`Hex`](Hex.md) \| `never`

## See

CreateContract

## Defined in

packages/contract/types/CreateContractParams.d.ts:6

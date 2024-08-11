[**@tevm/contract**](../README.md) • **Docs**

***

[@tevm/contract](../globals.md) / CreateContractParams

# Type Alias: CreateContractParams\<TName, TAbi, TAddress, TBytecode, TDeployedBytecode, TCode\>

> **CreateContractParams**\<`TName`, `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>: `object` \| `object`

Params for creating a [Contract](Contract.md) instance

## Type Parameters

• **TName** *extends* `string` \| `undefined` \| `never`

• **TAbi** *extends* readonly `string`[] \| `Abi`

• **TAddress** *extends* `undefined` \| `Address` \| `never`

• **TBytecode** *extends* `undefined` \| `Hex` \| `never`

• **TDeployedBytecode** *extends* `undefined` \| `Hex` \| `never`

• **TCode** *extends* `undefined` \| `Hex` \| `never`

## See

CreateContract

## Defined in

[CreateContractParams.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/CreateContractParams.ts#L8)

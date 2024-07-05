[**@tevm/contract**](../README.md) • **Docs**

***

[@tevm/contract](../globals.md) / CreateContractParams

# Type Alias: CreateContractParams\<TName, THumanReadableAbi, TAddress, TBytecode, TDeployedBytecode, TCode\>

> **CreateContractParams**\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>: `object`

Params for creating a [Contract](Contract.md) instance

## Type Parameters

• **TName** *extends* `string` \| `undefined` \| `never`

• **THumanReadableAbi** *extends* readonly `string`[]

• **TAddress** *extends* `undefined` \| `Address` \| `never`

• **TBytecode** *extends* `undefined` \| `Hex` \| `never`

• **TDeployedBytecode** *extends* `undefined` \| `Hex` \| `never`

• **TCode** *extends* `undefined` \| `Hex` \| `never`

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

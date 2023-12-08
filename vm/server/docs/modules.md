[@tevm/server](README.md) / Exports

# @tevm/server

## Table of contents

### Type Aliases

- [TevmTrpcRouter](modules.md#tevmtrpcrouter)

### Functions

- [createTevmServer](modules.md#createtevmserver)

## Type Aliases

### TevmTrpcRouter

Ƭ **TevmTrpcRouter**: `TrpcApi`[``"handler"``]

The TRPC Router type for the Tevm server
Note: It is recomended to use @tevm/vm-client rather than this directly
as it's more typesafe via generics

#### Defined in

[index.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/server/src/index.ts#L8)

## Functions

### createTevmServer

▸ **createTevmServer**(`vm`): `TrpcApi`

#### Parameters

| Name | Type |
| :------ | :------ |
| `vm` | `Tevm` |

#### Returns

`TrpcApi`

#### Defined in

[createTevmServer.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/vm/server/src/createTevmServer.ts#L12)

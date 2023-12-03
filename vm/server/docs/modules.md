[@evmts/server](README.md) / Exports

# @evmts/server

## Table of contents

### Type Aliases

- [EvmtsTrpcRouter](modules.md#evmtstrpcrouter)

### Functions

- [createEvmtsServer](modules.md#createevmtsserver)

## Type Aliases

### EvmtsTrpcRouter

Ƭ **EvmtsTrpcRouter**: `TrpcApi`[``"handler"``]

The TRPC Router type for the EVMts server
Note: It is recomended to use @evmts/vm-client rather than this directly
as it's more typesafe via generics

#### Defined in

[index.ts:8](https://github.com/evmts/evmts-monorepo/blob/main/vm/server/src/index.ts#L8)

## Functions

### createEvmtsServer

▸ **createEvmtsServer**(`vm`): `TrpcApi`

#### Parameters

| Name | Type |
| :------ | :------ |
| `vm` | `EVMts` |

#### Returns

`TrpcApi`

#### Defined in

[createEvmtsServer.ts:12](https://github.com/evmts/evmts-monorepo/blob/main/vm/server/src/createEvmtsServer.ts#L12)

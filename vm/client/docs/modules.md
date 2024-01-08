[@tevm/client](README.md) / Exports

# @tevm/client

## Table of contents

### Type Aliases

- [MemoryClient](modules.md#memoryclient)
- [RemoteClient](modules.md#remoteclient)

### Functions

- [createMemoryClient](modules.md#creatememoryclient)
- [createRemoteClient](modules.md#createremoteclient)

## Type Aliases

### MemoryClient

Ƭ **MemoryClient**\<\>: `Awaited`\<`ReturnType`\<typeof [`createMemoryClient`](modules.md#creatememoryclient)\>\>

#### Defined in

[vm/client/src/createMemoryClient.js:19](https://github.com/evmts/tevm-monorepo/blob/main/vm/client/src/createMemoryClient.js#L19)

___

### RemoteClient

Ƭ **RemoteClient**\<\>: `ReturnType`\<typeof [`createRemoteClient`](modules.md#createremoteclient)\>

#### Defined in

[vm/client/src/createRemoteClient.js:16](https://github.com/evmts/tevm-monorepo/blob/main/vm/client/src/createRemoteClient.js#L16)

## Functions

### createMemoryClient

▸ **createMemoryClient**(`params`): `Promise`\<`Client`\<`HttpTransport`, `undefined`, `undefined`, `PublicRpcSchema`, \{ `tevm`: `Tevm`  } & `PublicActions`\<`HttpTransport`, `undefined`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `CreateEVMOptions` & \{ `fork`: \{ `url`: `string`  }  } |

#### Returns

`Promise`\<`Client`\<`HttpTransport`, `undefined`, `undefined`, `PublicRpcSchema`, \{ `tevm`: `Tevm`  } & `PublicActions`\<`HttpTransport`, `undefined`\>\>\>

#### Defined in

[vm/client/src/createMemoryClient.js:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/client/src/createMemoryClient.js#L7)

___

### createRemoteClient

▸ **createRemoteClient**(`params`): `Client`\<`HttpTransport`, `undefined`, `undefined`, `PublicRpcSchema`, \{ `tevm`: `Omit`\<`Tevm`, ``"request"``\>  } & `PublicActions`\<`HttpTransport`, `undefined`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.url` | `string` |

#### Returns

`Client`\<`HttpTransport`, `undefined`, `undefined`, `PublicRpcSchema`, \{ `tevm`: `Omit`\<`Tevm`, ``"request"``\>  } & `PublicActions`\<`HttpTransport`, `undefined`\>\>

#### Defined in

[vm/client/src/createRemoteClient.js:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/client/src/createRemoteClient.js#L7)

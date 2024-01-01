[@tevm/server](README.md) / Exports

# @tevm/server

## Table of contents

### Functions

- [createHttpHandler](modules.md#createhttphandler)

## Functions

### createHttpHandler

▸ **createHttpHandler**(`parameters`): (`req`: `IncomingMessage`, `res`: `ServerResponse`\<`IncomingMessage`\>) => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `CreateHttpHandlerParameters` |

#### Returns

`fn`

▸ (`req`, `res`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `IncomingMessage` |
| `res` | `ServerResponse`\<`IncomingMessage`\> |

##### Returns

`void`

#### Defined in

[createHttpHandler.js:13](https://github.com/evmts/tevm-monorepo/blob/main/vm/server/src/createHttpHandler.js#L13)

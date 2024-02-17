[@tevm/http-client](README.md) / Exports

# @tevm/http-client

## Table of contents

### Type Aliases

- [HttpClient](modules.md#httpclient)
- [HttpClientOptions](modules.md#httpclientoptions)

### Functions

- [createHttpClient](modules.md#createhttpclient)

## Type Aliases

### HttpClient

Ƭ **HttpClient**: `TevmClient` & \{ `name`: `string` ; `url`: `string`  }

A remote Tevm client for talking to a Tevm backend over HTTP JSON-RPC
Implements the tevm interface so interacting with it is the same api
as interacting with a `MemoryTevm` instance directly

**`See`**

TevmClient

**`Example`**

```typescript
import { TevmClient, createTevmClient } from "tevm/client";

#### Defined in

[HttpClient.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/http-client/src/HttpClient.ts#L12)

___

### HttpClientOptions

Ƭ **HttpClientOptions**: `Object`

Options for a HttpClient

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `name?` | `string` | Optional name for the client |
| `url` | `string` | Remote URL to connect to |

#### Defined in

[HttpClientOptions.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/http-client/src/HttpClientOptions.ts#L4)

## Functions

### createHttpClient

▸ **createHttpClient**(`params`): [`HttpClient`](modules.md#httpclient)

Creates a remote tevm client for interacting with an http server
over HTTP.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`HttpClientOptions`](modules.md#httpclientoptions) |

#### Returns

[`HttpClient`](modules.md#httpclient)

**`Example`**

```typescript
import { createHttpClient } from '@tevm/client'

const client = createHttpClient({ url: 'http://localhost:8080' })

const chainId = await client.eth.getChainId()
const account = await client.eth.getAccount({
  address: '0x420234...'
})
```

**`See`**

 - [createServer](https://todo.todo.todo) - for creating a tevm server
 - [httpHandler](https://todo.todo.todo) - for an http handler that can be used in Next.js or anything that supports HTTP handler api

#### Defined in

[createHttpClient.js:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/http-client/src/createHttpClient.js#L23)

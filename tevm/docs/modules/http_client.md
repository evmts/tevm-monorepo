[tevm](../README.md) / [Modules](../modules.md) / http-client

# Module: http-client

## Table of contents

### Type Aliases

- [HttpClient](http_client.md#httpclient)
- [HttpClientOptions](http_client.md#httpclientoptions)

### Functions

- [createHttpClient](http_client.md#createhttpclient)

## Type Aliases

### HttpClient

Ƭ **HttpClient**: [`TevmClient`](index.md#tevmclient) & \{ `name`: `string` ; `url`: `string`  }

A remote Tevm client for talking to a Tevm backend over HTTP JSON-RPC
Implements the tevm interface so interacting with it is the same api
as interacting with a `MemoryTevm` instance directly

**`See`**

[TevmClient](index.md#tevmclient)

**`Example`**

```typescript
import { TevmClient, createTevmClient } from "tevm/client";

#### Defined in

evmts-monorepo/packages/http-client/types/HttpClient.d.ts:11

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

evmts-monorepo/packages/http-client/types/HttpClientOptions.d.ts:4

## Functions

### createHttpClient

▸ **createHttpClient**(`«destructured»`): `HttpClient`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`HttpClientOptions`](http_client.md#httpclientoptions) |

#### Returns

`HttpClient`

#### Defined in

evmts-monorepo/packages/http-client/types/createHttpClient.d.ts:1

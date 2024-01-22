---
editUrl: false
next: false
prev: false
title: "HttpClient"
---

> **HttpClient**: [`TevmClient`](/reference/tevm/client-types/type-aliases/tevmclient/) & `object`

A remote Tevm client for talking to a Tevm backend over HTTP JSON-RPC
Implements the tevm interface so interacting with it is the same api
as interacting with a `MemoryTevm` instance directly

## See

[TevmClient](../../client-types/type-aliases/TevmClient.md)

## Example

```typescript
import { TevmClient, createTevmClient } from "tevm/client";

## Type declaration

### name

> **name**: `string`

Name of the client

### url

> **url**: `string`

The url being used to connect to the remote Tevm backend

## Source

[HttpClient.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/http-client/src/HttpClient.ts#L12)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

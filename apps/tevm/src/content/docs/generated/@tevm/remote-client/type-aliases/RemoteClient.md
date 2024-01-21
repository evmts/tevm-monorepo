---
editUrl: false
next: false
prev: false
title: "RemoteClient"
---

> **RemoteClient**: [`TevmClient`](/generated/tevm/client-types/type-aliases/tevmclient/) & `object`

A remote Tevm client for talking to a Tevm backend over HTTP JSON-RPC
Implements the tevm interface so interacting with it is the same api
as interacting with a `MemoryTevm` instance directly

## See

Tevm

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

[RemoteClient.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/remote-client/src/RemoteClient.ts#L12)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

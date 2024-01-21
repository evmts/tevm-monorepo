**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [remote-client](../README.md) > RemoteClient

# Type alias: RemoteClient

> **RemoteClient**: [`TevmClient`](../../index/type-aliases/TevmClient.md) & `object`

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

packages/remote-client/types/RemoteClient.d.ts:11

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

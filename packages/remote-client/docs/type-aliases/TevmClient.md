**@tevm/remote-client** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > TevmClient

# Type alias: TevmClient

> **TevmClient**: `Tevm` & `object`

A remote Tevm client for talking to a Tevm backend over HTTP JSON-RPC
Implements the tevm interface so interacting with it is the same api
as interacting with a `MemoryTevm` instance directly

## See

[Tevm]([object Object])

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

[TevmClient.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/core/remote-client/src/TevmClient.ts#L12)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

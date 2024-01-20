**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > TevmClient

# Type alias: TevmClient

> **TevmClient**: [`Tevm`](../../api/type-aliases/Tevm.md) & `object`

A remote Tevm client for talking to a Tevm backend over HTTP JSON-RPC
Implements the tevm interface so interacting with it is the same api
as interacting with a `MemoryTevm` instance directly

## See

[Tevm](../../api/type-aliases/Tevm.md)

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

vm/client/dist/index.d.ts:12

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

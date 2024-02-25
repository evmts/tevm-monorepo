---
editUrl: false
next: false
prev: false
title: "createNextApiHandler"
---

> **createNextApiHandler**(`client`): `NextApiHandler`\<`any`\>

Creates a Next.js API handler for a Tevm JSON-RPC server

## Parameters

▪ **client**: `Pick`\<[`MemoryClient`](/reference/tevm/memory-client/type-aliases/memoryclient/), `"send"`\>

## Returns

## Example

```typescript
import { createNextApiHandler } from 'tevm/server'
import { createMemoryClient } from 'tevm'

const tevm = createMemoryClient()
export default createNextApiHandler({ request: tevm.request })
```

## Source

[packages/server/src/adapters/createNextApiHandler.js:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/server/src/adapters/createNextApiHandler.js#L16)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

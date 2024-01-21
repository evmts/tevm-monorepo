**@tevm/server** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > createNextApiHandler

# Function: createNextApiHandler()

> **createNextApiHandler**(`options`): `NextApiHandler`\<`any`\>

Creates a Next.js API handler for a Tevm JSON-RPC server

## Parameters

▪ **options**: `object`

▪ **options.request**: `TevmJsonRpcRequestHandler`

## Returns

## Example

```typescript
import { createNextApiHandler } from 'tevm/server'
import { createMemoryTevm } from 'tevm'

const tevm = createMemoryTevm()
export default createNextApiHandler({ request: tevm.request })
```

## Source

[core/server/src/adapters/createNextApiHandler.js:16](https://github.com/evmts/tevm-monorepo/blob/main/core/server/src/adapters/createNextApiHandler.js#L16)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

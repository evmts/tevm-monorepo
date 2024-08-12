[**@tevm/server**](../README.md) • **Docs**

***

[@tevm/server](../globals.md) / createNextApiHandler

# Function: createNextApiHandler()

> **createNextApiHandler**(`client`): `NextApiHandler`\<`any`\>

Creates a Next.js API handler for a Tevm JSON-RPC server

## Parameters

• **client**: [`Client`](../type-aliases/Client.md)

## Returns

`NextApiHandler`\<`any`\>

## Example

```typescript
import { createNextApiHandler } from 'tevm/server'
import { createMemoryClient } from 'tevm'

const tevm = createMemoryClient()
export default createNextApiHandler({ request: tevm.request })
```

## Defined in

[packages/server/src/adapters/createNextApiHandler.js:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/server/src/adapters/createNextApiHandler.js#L16)

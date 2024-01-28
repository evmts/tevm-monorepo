---
editUrl: false
next: false
prev: false
title: "createExpressMiddleware"
---

> **createExpressMiddleware**(`options`): `RequestHandler`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\>

Creates express middleware for a Tevm JSON-RPC server

## Parameters

▪ **options**: `object`

▪ **options.request**: `TevmJsonRpcRequestHandler`

A request handler for the JSON-RPC requests

## Returns

## Example

```typescript
import express from 'express'
import { createExpressMiddleware } from 'tevm/server'
import { createMemoryClient } from 'tevm'

const tevm = createMemoryClient()

const app = express()
app.use(express.json())
app.use(createExpressMiddleware({ request: tevm.request }))
app.listen(8080, () => console.log('listening on 8080'))
```

After creating an express server it can be interacted with using any JSON-RPC client
including viem, ethers or the built in tevm client
```typescript
import { createClient } from 'tevm/client'

const client = createClient({
 url: 'http://localhost:8080'
 })

 const blockNumber = await client.eth.getBlockNumber()
 const chainId = await client.eth.getChainId()
 ```

## Source

[packages/server/src/adapters/createExpressMiddleware.js:35](https://github.com/evmts/tevm-monorepo/blob/main/packages/server/src/adapters/createExpressMiddleware.js#L35)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

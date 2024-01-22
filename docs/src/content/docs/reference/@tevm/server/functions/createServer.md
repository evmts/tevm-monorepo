---
editUrl: false
next: false
prev: false
title: "createServer"
---

> **createServer**(`options`): `Promise`\<`Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\>\>

Creates a lightweight http server for handling requests

## Parameters

▪ **options**: `object`

▪ **options.request**: `TevmJsonRpcRequestHandler`

A request handler for the JSON-RPC requests

To use pass in the Tevm['request'] request handler

▪ **options.serverOptions**: `undefined` \| `ServerOptions`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\>

Optional options to pass to the http server

## Returns

## Example

```typescript
import { createMemoryClient } from 'tevm'
import { createServer } from 'tevm/server'

const tevm = createMemoryClient()

const server = createServer({
  request: tevm.request,
})

server.listen(8080, () => console.log('listening on 8080'))
```
To interact with the HTTP server you can create a Tevm client

## Example

```typescript
import { createTevmClient } from '@tevm/client'

const client = createTevmClient()
```

## Source

[packages/server/src/createServer.js:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/server/src/createServer.js#L32)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

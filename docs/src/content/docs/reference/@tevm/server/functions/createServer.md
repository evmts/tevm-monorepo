---
editUrl: false
next: false
prev: false
title: "createServer"
---

> **createServer**(`client`, `serverOptions`?): `Promise`\<`Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\>\>

Creates a lightweight http server for handling requests

## Parameters

• **client**: `Pick`\<[`MemoryClient`](/reference/memory-client/type-aliases/memoryclient/), `"send"`\>

• **serverOptions?**: `ServerOptions`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\>

Optional options to pass to the http server

To use pass in the Tevm['request'] request handler

## Returns

`Promise`\<`Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\>\>

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

[packages/server/src/createServer.js:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/server/src/createServer.js#L31)

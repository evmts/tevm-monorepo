---
editUrl: false
next: false
prev: false
title: "createHttpHandler"
---

> **createHttpHandler**(`parameters`): `RequestListener`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\>

Creates a Node.js http handler for handling JSON-RPC requests with Ethereumjs EVM
Any unimplemented methods will be proxied to the given proxyUrl
This handler works for any server that supports the Node.js http module

## Parameters

▪ **parameters**: [`CreateHttpHandlerParameters`](/reference/tevm/server/type-aliases/createhttphandlerparameters/)

## Returns

## Example

```ts
import { createHttpHandler } from 'tevm/server'
import { createTevm } from 'tevm'
import { createServer } from 'http'

const PORT = 8080

const tevm = createTevm({
  fork: {
    url: 'https://mainnet.optimism.io'
  }
})

const server = createServer(
  createHttpHandler(tevm)
)
server.listen(PORT, () => console.log({ listening: PORT }))
```

## Source

[packages/server/src/createHttpHandler.js:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/server/src/createHttpHandler.js#L34)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

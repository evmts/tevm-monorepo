---
editUrl: false
next: false
prev: false
title: "createHttpClient"
---

> **createHttpClient**(`params`): [`HttpClient`](/reference/tevm/http-client/type-aliases/httpclient/)

Creates a remote tevm client for interacting with an http server
over HTTP.

## Parameters

▪ **params**: [`HttpClientOptions`](/reference/tevm/http-client/type-aliases/httpclientoptions/)

## Returns

## Example

```typescript
import { createHttpClient } from '@tevm/client'

const client = createHttpClient({ url: 'http://localhost:8080' })

const chainId = await client.eth.getChainId()
const account = await client.eth.getAccount({
  address: '0x420234...'
})
```

## See

 - [createServer](https://todo.todo.todo) - for creating a tevm server
 - [httpHandler](https://todo.todo.todo) - for an http handler that can be used in Next.js or anything that supports HTTP handler api

## Source

[createHttpClient.js:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/http-client/src/createHttpClient.js#L23)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

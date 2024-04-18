**@tevm/http-client** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/http-client](../README.md) / createHttpClient

# Function: createHttpClient()

> **createHttpClient**(`params`): `Client`\<`HttpTransport`, `undefined`, `undefined`, `undefined`, `object` & `object` & `object`\>

Creates a remote tevm client for interacting with an http server
over HTTP.

## Parameters

• **params**: [`HttpClientOptions`](../type-aliases/HttpClientOptions.md)

## Returns

`Client`\<`HttpTransport`, `undefined`, `undefined`, `undefined`, `object` & `object` & `object`\>

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

[packages/http-client/src/createHttpClient.js:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/http-client/src/createHttpClient.js#L22)

**@tevm/http-client** ∙ [README](../README.md) ∙ [API](../API.md)

<<<<<<< HEAD:packages/http-client/docs/functions/createHttpClient.md
***

[API](../API.md) > createHttpClient

# Function: createHttpClient()

> **createHttpClient**(`params`): [`HttpClient`](../type-aliases/HttpClient.md)
=======
> **createRemoteClient**(`params`): [`HttpClient`](/generated/tevm/http-client/type-aliases/remoteclient/)
>>>>>>> 6064f9a79 (:memo: Feat: Docs):apps/tevm/src/content/docs/generated/@tevm/remote-client/functions/createRemoteClient.md

Creates a remote tevm client for interacting with an http server
over HTTP.

## Parameters

<<<<<<< HEAD:packages/http-client/docs/functions/createHttpClient.md
▪ **params**: [`HttpClientOptions`](../type-aliases/HttpClientOptions.md)
=======
▪ **params**: [`RemoteClientOptions`](/generated/tevm/http-client/type-aliases/remoteclientoptions/)
>>>>>>> 6064f9a79 (:memo: Feat: Docs):apps/tevm/src/content/docs/generated/@tevm/remote-client/functions/createRemoteClient.md

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

<<<<<<< HEAD:packages/http-client/docs/functions/createHttpClient.md
[createHttpClient.js:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/http-client/src/createHttpClient.js#L23)
=======
[createRemoteClient.js:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/http-client/src/createRemoteClient.js#L23)
>>>>>>> 6064f9a79 (:memo: Feat: Docs):apps/tevm/src/content/docs/generated/@tevm/remote-client/functions/createRemoteClient.md

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

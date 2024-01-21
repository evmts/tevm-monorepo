**@tevm/remote-client** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > createRemoteClient

# Function: createRemoteClient()

> **createRemoteClient**(`params`): [`RemoteClient`](../type-aliases/RemoteClient.md)

Creates a remote tevm client for interacting with an http server
over HTTP.

## Parameters

▪ **params**: [`RemoteClientOptions`](../type-aliases/RemoteClientOptions.md)

## Returns

## Example

```typescript
import { createRemoteClient } from '@tevm/client'

const client = createRemoteClient({ url: 'http://localhost:8080' })

const chainId = await client.eth.getChainId()
const account = await client.eth.getAccount({
  address: '0x420234...'
})
```

## See

 - [createServer](https://todo.todo.todo) - for creating a tevm server
 - [httpHandler](https://todo.todo.todo) - for an http handler that can be used in Next.js or anything that supports HTTP handler api

## Source

[createRemoteClient.js:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/remote-client/src/createRemoteClient.js#L23)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

**@tevm/client** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > createTevmClient

# Function: createTevmClient()

> **createTevmClient**(`params`): [`TevmClient`](../type-aliases/TevmClient.md)

Creates a remote tevm client for interacting with an http server
over HTTP.

## Parameters

▪ **params**: [`ClientOptions`](../type-aliases/ClientOptions.md)

## Returns

## Example

```typescript
import { createTevmClient } from '@tevm/client'

const client = createTevmClient({ url: 'http://localhost:8080' })

const chainId = await client.eth.getChainId()
const account = await client.eth.getAccount({
  address: '0x420234...'
})
```

## See

 - [createServer](https://todo.todo.todo) - for creating a tevm server
 - [httpHandler](https://todo.todo.todo) - for an http handler that can be used in Next.js or anything that supports HTTP handler api

## Source

[createTevmClient.js:23](https://github.com/evmts/tevm-monorepo/blob/main/vm/client/src/createTevmClient.js#L23)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

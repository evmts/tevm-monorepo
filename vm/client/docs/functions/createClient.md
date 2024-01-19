**@tevm/client** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > createClient

# Function: createClient()

> **createClient**(`params`): `Tevm`

Creates a remote tevm client for interacting with an http server
over HTTP.

## Parameters

▪ **params**: `ClientOptions`

## Returns

## Example

```typescript
import { createClient } from '@tevm/client'

const client = createClient({ url: 'http://localhost:8080' })

const chainId = await client.eth.getChainId()
const account = await client.eth.getAccount({
  address: '0x420234...'
})
```

## See

 - import('@tevm/server').createServer - for creating a tevm server
 - import('@tevm/server').httpHandler - for an http handler that can be used in Next.js or anything that supports HTTP handler api

## Source

[createClient.js:30](https://github.com/evmts/tevm-monorepo/blob/main/vm/client/src/createClient.js#L30)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

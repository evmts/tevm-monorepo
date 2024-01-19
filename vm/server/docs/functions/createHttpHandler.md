**@tevm/server** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > createHttpHandler

# Function: createHttpHandler()

> **createHttpHandler**(`parameters`): `RequestListener`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\>

Creates a Node.js http handler for handling JSON-RPC requests with Ethereumjs EVM
Any unimplemented methods will be proxied to the given proxyUrl
This handler works for any server that supports the Node.js http module

## Parameters

▪ **parameters**: `CreateHttpHandlerParameters`

## Returns

## Example

```ts
import { createHttpHandler } from '@tevm/http'
import { Tevm } from '@tevm/vm'
import { createServer } from 'http'

const PORT = 8080

const vm = new Tevm({
  fork: {
    url: 'https://mainnet.optimism.io'
  }
})

const server = createServer(
  createHttpHandler({
    evm: vm,
    proxyUrl: 'https://mainnet.optimism.io'
  })
)
server.listen(PORT, () => console.log({ listening: PORT }))
```

## Source

[createHttpHandler.js:37](https://github.com/evmts/tevm-monorepo/blob/main/vm/server/src/createHttpHandler.js#L37)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

[@tevm/server](README.md) / Exports

# @tevm/server

## Table of contents

### Functions

- [createHttpHandler](modules.md#createhttphandler)

## Functions

### createHttpHandler

▸ **createHttpHandler**(`parameters`): `RequestListener`\<typeof `IncomingMessage`, typeof `ServerResponse`\>

Creates a Node.js http handler for handling JSON-RPC requests with Ethereumjs EVM
Any unimplemented methods will be proxied to the given proxyUrl
This handler works for any server that supports the Node.js http module

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `CreateHttpHandlerParameters` |

#### Returns

`RequestListener`\<typeof `IncomingMessage`, typeof `ServerResponse`\>

**`Example`**

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

#### Defined in

[createHttpHandler.js:37](https://github.com/evmts/tevm-monorepo/blob/main/vm/server/src/createHttpHandler.js#L37)

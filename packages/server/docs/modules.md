[@tevm/server](README.md) / Exports

# @tevm/server

## Table of contents

### Classes

- [BadRequestError](classes/BadRequestError.md)

### Type Aliases

- [CreateHttpHandlerParameters](modules.md#createhttphandlerparameters)

### Functions

- [createExpressMiddleware](modules.md#createexpressmiddleware)
- [createHttpHandler](modules.md#createhttphandler)
- [createNextApiHandler](modules.md#createnextapihandler)
- [createServer](modules.md#createserver)

## Type Aliases

### CreateHttpHandlerParameters

Ƭ **CreateHttpHandlerParameters**\<\>: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `request` | `TevmJsonRpcRequestHandler` |

#### Defined in

[evmts-monorepo/packages/server/src/createHttpHandler.js:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/server/src/createHttpHandler.js#L6)

## Functions

### createExpressMiddleware

▸ **createExpressMiddleware**(`options`): `RequestHandler`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\>

Creates express middleware for a Tevm JSON-RPC server

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` |  |
| `options.request` | `TevmJsonRpcRequestHandler` | A request handler for the JSON-RPC requests |

#### Returns

`RequestHandler`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\>

**`Example`**

```typescript
import express from 'express'
import { createExpressMiddleware } from 'tevm/server'
import { createMemoryClient } from 'tevm'

const tevm = createMemoryClient()

const app = express()
app.use(express.json())
app.use(createExpressMiddleware({ request: tevm.request }))
app.listen(8080, () => console.log('listening on 8080'))
```

After creating an express server it can be interacted with using any JSON-RPC client
including viem, ethers or the built in tevm client
```typescript
import { createClient } from 'tevm/client'

const client = createClient({
 url: 'http://localhost:8080'
 })

 const blockNumber = await client.eth.getBlockNumber()
 const chainId = await client.eth.getChainId()
 ```

#### Defined in

[evmts-monorepo/packages/server/src/adapters/createExpressMiddleware.js:35](https://github.com/evmts/tevm-monorepo/blob/main/packages/server/src/adapters/createExpressMiddleware.js#L35)

___

### createHttpHandler

▸ **createHttpHandler**(`parameters`): `RequestListener`\<typeof `IncomingMessage`, typeof `ServerResponse`\>

Creates a Node.js http handler for handling JSON-RPC requests with Ethereumjs EVM
Any unimplemented methods will be proxied to the given proxyUrl
This handler works for any server that supports the Node.js http module

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | [`CreateHttpHandlerParameters`](modules.md#createhttphandlerparameters) |

#### Returns

`RequestListener`\<typeof `IncomingMessage`, typeof `ServerResponse`\>

**`Example`**

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

#### Defined in

[evmts-monorepo/packages/server/src/createHttpHandler.js:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/server/src/createHttpHandler.js#L34)

___

### createNextApiHandler

▸ **createNextApiHandler**(`options`): `NextApiHandler`\<`any`\>

Creates a Next.js API handler for a Tevm JSON-RPC server

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.request` | `TevmJsonRpcRequestHandler` |

#### Returns

`NextApiHandler`\<`any`\>

**`Example`**

```typescript
import { createNextApiHandler } from 'tevm/server'
import { createMemoryClient } from 'tevm'

const tevm = createMemoryClient()
export default createNextApiHandler({ request: tevm.request })
```

#### Defined in

[evmts-monorepo/packages/server/src/adapters/createNextApiHandler.js:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/server/src/adapters/createNextApiHandler.js#L16)

___

### createServer

▸ **createServer**(`options`): `Promise`\<`Server`\<typeof `IncomingMessage`, typeof `ServerResponse`\>\>

Creates a lightweight http server for handling requests

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` |  |
| `options.request` | `TevmJsonRpcRequestHandler` | A request handler for the JSON-RPC requests To use pass in the Tevm['request'] request handler |
| `options.serverOptions` | `undefined` \| `ServerOptions`\<typeof `IncomingMessage`, typeof `ServerResponse`\> | Optional options to pass to the http server |

#### Returns

`Promise`\<`Server`\<typeof `IncomingMessage`, typeof `ServerResponse`\>\>

**`Example`**

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

**`Example`**

```typescript
import { createTevmClient } from '@tevm/client'

const client = createTevmClient()
```

#### Defined in

[evmts-monorepo/packages/server/src/createServer.js:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/server/src/createServer.js#L32)

[tevm](../README.md) / [Modules](../modules.md) / server

# Module: server

## Table of contents

### Classes

- [BadRequestError](../classes/server.BadRequestError.md)

### Type Aliases

- [CreateHttpHandlerParameters](server.md#createhttphandlerparameters)

### Functions

- [createExpressMiddleware](server.md#createexpressmiddleware)
- [createHttpHandler](server.md#createhttphandler)
- [createNextApiHandler](server.md#createnextapihandler)
- [createServer](server.md#createserver)

## Type Aliases

### CreateHttpHandlerParameters

Ƭ **CreateHttpHandlerParameters**: `Pick`\<`MemoryClient`, ``"send"``\>

#### Defined in

evmts-monorepo/packages/server/types/createHttpHandler.d.ts:2

## Functions

### createExpressMiddleware

▸ **createExpressMiddleware**(`client`): `RequestHandler`

Creates express middleware for a Tevm JSON-RPC server

#### Parameters

| Name | Type |
| :------ | :------ |
| `client` | `Pick`\<[`MemoryClient`](index.md#memoryclient), ``"send"``\> |

#### Returns

`RequestHandler`

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

evmts-monorepo/packages/server/types/adapters/createExpressMiddleware.d.ts:32

___

### createHttpHandler

▸ **createHttpHandler**(`parameters`): `RequestListener`

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | [`CreateHttpHandlerParameters`](server.md#createhttphandlerparameters) |

#### Returns

`RequestListener`

#### Defined in

evmts-monorepo/packages/server/types/createHttpHandler.d.ts:1

___

### createNextApiHandler

▸ **createNextApiHandler**(`client`): `NextApiHandler`

#### Parameters

| Name | Type |
| :------ | :------ |
| `client` | `Pick`\<[`MemoryClient`](index.md#memoryclient), ``"send"``\> |

#### Returns

`NextApiHandler`

#### Defined in

evmts-monorepo/packages/server/types/adapters/createNextApiHandler.d.ts:1

___

### createServer

▸ **createServer**(`«destructured»`, `serverOptions?`): `Promise`\<`Server`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Pick`\<[`MemoryClient`](index.md#memoryclient), ``"send"``\> |
| `serverOptions?` | `ServerOptions`\<typeof `IncomingMessage`, typeof `ServerResponse`\> |

#### Returns

`Promise`\<`Server`\>

#### Defined in

evmts-monorepo/packages/server/types/createServer.d.ts:2

**@tevm/server** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > createServer

# Function: createServer()

> **createServer**(`options`): `Promise`\<`Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\>\>

Creates a lightweight http server for handling requests

## Parameters

▪ **options**: `object`

▪ **options.request**: `TevmJsonRpcRequestHandler`

A request handler for the JSON-RPC requests

To use pass in the Tevm['request'] request handler

▪ **options.serverOptions**: `undefined` \| `ServerOptions`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\>

Optional options to pass to the http server

## Returns

## Example

```typescript
import { createMemoryTevm } from 'tevm'
import { createServer } from 'tevm/server'

const tevm = createMemoryTevm()

const server = createServer({
  request: tevm.request,
})

server.listen(8080, () => console.log('listening on 8080'))
```
import { createServer } from '@tevm/http'
import { Tevm } from '@tevm/vm'
import { createServer as httpCreateServer } from 'http'

## Source

[vm/server/src/createServer.js:29](https://github.com/evmts/tevm-monorepo/blob/main/vm/server/src/createServer.js#L29)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

[**@tevm/server**](../README.md) • **Docs**

***

[@tevm/server](../globals.md) / createHttpHandler

# Function: createHttpHandler()

> **createHttpHandler**(`client`): `RequestListener`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\>

/**
* Creates a Node.js http handler for handling JSON-RPC requests with Ethereumjs EVM
* Any unimplemented methods will be proxied to the given proxyUrl
* This handler works for any server that supports the Node.js http module
*

## Parameters

• **client**: [`Client`](../type-aliases/Client.md)

*

## Returns

`RequestListener`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\>

*

## Throws

*

## Example

```ts
* import { createHttpHandler } from 'tevm/server'
* import { createTevm } from 'tevm'
* import { createServer } from 'http'
*
* const PORT = 8080
*
* const tevm = createTevm({
*   fork: {
*     transport: http('https://mainnet.optimism.io')({})
*   }
* })
*
* const server = createServer(
*   createHttpHandler(tevm)
* )
* server.listen(PORT, () => console.log({ listening: PORT }))
*
```

## Defined in

[packages/server/src/createHttpHandler.js:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/server/src/createHttpHandler.js#L37)

[**@tevm/server**](../README.md)

***

[@tevm/server](../globals.md) / createHttpHandler

# Function: createHttpHandler()

> **createHttpHandler**(`client`, `options?`): `RequestListener`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\>

Defined in: [packages/server/src/createHttpHandler.js:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/server/src/createHttpHandler.js#L32)

Creates a Node.js HTTP handler for handling JSON-RPC requests with a Tevm node.
Any unimplemented methods will be proxied to the given proxyUrl
This handler works for any server that supports the Node.js http module

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | [`Client`](../type-aliases/Client.md) | - |
| `options?` | \{ `compatibility?`: `boolean`; `cors?`: `boolean`; `maxBatchSize?`: `number`; `maxBodySize?`: `number`; `maxHeaderSize?`: `number`; `requestTimeout?`: `number`; \} | - |
| `options.compatibility?` | `boolean` | - |
| `options.cors?` | `boolean` | - |
| `options.maxBatchSize?` | `number` | - |
| `options.maxBodySize?` | `number` | - |
| `options.maxHeaderSize?` | `number` | - |
| `options.requestTimeout?` | `number` | - |

## Returns

`RequestListener`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\>

## Throws

## Example

```ts
const handler = createHttpHandler(client, {
  compatibility: true,
  maxBodySize: 1024 * 1024,
  maxHeaderSize: 16 * 1024,
})
```

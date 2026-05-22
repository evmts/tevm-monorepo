[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [server](../README.md) / createHttpHandler

# Function: createHttpHandler()

> **createHttpHandler**(`client`, `options?`): `RequestListener`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\>

## Parameters

| Parameter | Type |
| ------ | ------ |
| `client` | [`Client`](../type-aliases/Client.md) |
| `options?` | \{ `compatibility?`: `boolean`; `cors?`: `boolean`; `maxBatchSize?`: `number`; `maxBodySize?`: `number`; `maxHeaderSize?`: `number`; `requestTimeout?`: `number`; \} |
| `options.compatibility?` | `boolean` |
| `options.cors?` | `boolean` |
| `options.maxBatchSize?` | `number` |
| `options.maxBodySize?` | `number` |
| `options.maxHeaderSize?` | `number` |
| `options.requestTimeout?` | `number` |

## Returns

`RequestListener`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\>

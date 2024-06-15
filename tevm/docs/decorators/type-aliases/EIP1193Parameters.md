[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [decorators](../README.md) / EIP1193Parameters

# Type alias: EIP1193Parameters\<TRpcSchema\>

> **EIP1193Parameters**\<`TRpcSchema`\>: `TRpcSchema` *extends* [`RpcSchema`](RpcSchema.md) ? `{ [K in keyof TRpcSchema]: Object & (TRpcSchema[K] extends TRpcSchema[number] ? TRpcSchema[K]["Parameters"] extends undefined ? Object : Object : never) }`\[`number`\] : `object`

## Type parameters

• **TRpcSchema** *extends* [`RpcSchema`](RpcSchema.md) \| `undefined` = `undefined`

## Source

packages/decorators/dist/index.d.ts:260

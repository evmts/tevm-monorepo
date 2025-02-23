[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [decorators](../README.md) / EIP1193Parameters

# Type Alias: EIP1193Parameters\<TRpcSchema\>

> **EIP1193Parameters**\<`TRpcSchema`\>: `TRpcSchema` *extends* [`RpcSchema`](RpcSchema.md) ? `{ [K in keyof TRpcSchema]: Object & (TRpcSchema[K] extends TRpcSchema[number] ? TRpcSchema[K]["Parameters"] extends undefined ? Object : Object : never) }`\[`number`\] : `object`

## Type Parameters

• **TRpcSchema** *extends* [`RpcSchema`](RpcSchema.md) \| `undefined` = `undefined`

## Defined in

packages/decorators/dist/index.d.ts:247

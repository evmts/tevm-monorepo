[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [decorators](../README.md) / EIP1193Parameters

# Type Alias: EIP1193Parameters\<TRpcSchema\>

> **EIP1193Parameters**\<`TRpcSchema`\>: `TRpcSchema` *extends* [`RpcSchema`](RpcSchema.md) ? `{ [K in keyof TRpcSchema]: { method: TRpcSchema[K] extends TRpcSchema[number] ? TRpcSchema[K]["Method"] : never } & (TRpcSchema[K] extends TRpcSchema[number] ? TRpcSchema[K]["Parameters"] extends undefined ? { params?: never } : { params: TRpcSchema[K]["Parameters"] } : never) }`\[`number`\] : `object`

Defined in: packages/decorators/dist/index.d.ts:247

## Type Parameters

• **TRpcSchema** *extends* [`RpcSchema`](RpcSchema.md) \| `undefined` = `undefined`

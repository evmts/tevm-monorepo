[**@tevm/decorators**](../README.md) • **Docs**

***

[@tevm/decorators](../globals.md) / EIP1193Parameters

# Type Alias: EIP1193Parameters\<TRpcSchema\>

> **EIP1193Parameters**\<`TRpcSchema`\>: `TRpcSchema` *extends* [`RpcSchema`](RpcSchema.md) ? `{ [K in keyof TRpcSchema]: Object & (TRpcSchema[K] extends TRpcSchema[number] ? TRpcSchema[K]["Parameters"] extends undefined ? Object : Object : never) }`\[`number`\] : `object`

## Type Parameters

• **TRpcSchema** *extends* [`RpcSchema`](RpcSchema.md) \| `undefined` = `undefined`

## Defined in

[eip1193/EIP1193Parameters.ts:10](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/decorators/src/eip1193/EIP1193Parameters.ts#L10)

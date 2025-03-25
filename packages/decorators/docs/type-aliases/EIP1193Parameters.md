[**@tevm/decorators**](../README.md)

***

[@tevm/decorators](../globals.md) / EIP1193Parameters

# Type Alias: EIP1193Parameters\<TRpcSchema\>

> **EIP1193Parameters**\<`TRpcSchema`\> = `TRpcSchema` *extends* [`RpcSchema`](RpcSchema.md) ? `{ [K in keyof TRpcSchema]: { method: TRpcSchema[K] extends TRpcSchema[number] ? TRpcSchema[K]["Method"] : never } & (TRpcSchema[K] extends TRpcSchema[number] ? TRpcSchema[K]["Parameters"] extends undefined ? { params?: never } : { params: TRpcSchema[K]["Parameters"] } : never) }`\[`number`\] : `object`

Defined in: [eip1193/EIP1193Parameters.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/EIP1193Parameters.ts#L10)

## Type Parameters

### TRpcSchema

`TRpcSchema` *extends* [`RpcSchema`](RpcSchema.md) \| `undefined` = `undefined`

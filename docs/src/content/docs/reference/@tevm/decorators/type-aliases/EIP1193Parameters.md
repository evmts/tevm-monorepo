---
editUrl: false
next: false
prev: false
title: "EIP1193Parameters"
---

> **EIP1193Parameters**\<`TRpcSchema`\>: `TRpcSchema` *extends* [`RpcSchema`](/reference/tevm/decorators/type-aliases/rpcschema/) ? `{ [K in keyof TRpcSchema]: Object & (TRpcSchema[K] extends TRpcSchema[number] ? TRpcSchema[K]["Parameters"] extends undefined ? Object : Object : never) }`\[`number`\] : `object`

## Type Parameters

• **TRpcSchema** *extends* [`RpcSchema`](/reference/tevm/decorators/type-aliases/rpcschema/) \| `undefined` = `undefined`

## Defined in

[eip1193/EIP1193Parameters.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/EIP1193Parameters.ts#L10)

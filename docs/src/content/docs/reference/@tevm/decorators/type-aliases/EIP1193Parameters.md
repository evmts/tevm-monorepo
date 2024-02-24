---
editUrl: false
next: false
prev: false
title: "EIP1193Parameters"
---

> **EIP1193Parameters**\<`TRpcSchema`\>: `TRpcSchema` extends [`RpcSchema`](/reference/tevm/decorators/type-aliases/rpcschema/) ? `{ [K in keyof TRpcSchema]: Object & (TRpcSchema[K] extends TRpcSchema[number] ? TRpcSchema[K]["Parameters"] extends undefined ? Object : Object : never) }`[`number`] : `object`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TRpcSchema` extends [`RpcSchema`](/reference/tevm/decorators/type-aliases/rpcschema/) \| `undefined` | `undefined` |

## Source

[packages/decorators/src/eip1193/EIP1193Parameters.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/EIP1193Parameters.ts#L10)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

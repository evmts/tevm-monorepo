**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [decorators](../README.md) > EIP1193Parameters

# Type alias: EIP1193Parameters`<TRpcSchema>`

> **EIP1193Parameters**\<`TRpcSchema`\>: `TRpcSchema` extends [`RpcSchema`](RpcSchema.md) ? `{ [K in keyof TRpcSchema]: Object & (TRpcSchema[K] extends TRpcSchema[number] ? TRpcSchema[K]["Parameters"] extends undefined ? Object : Object : never) }`[`number`] : `object`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TRpcSchema` extends [`RpcSchema`](RpcSchema.md) \| `undefined` | `undefined` |

## Source

packages/decorators/dist/index.d.ts:279

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

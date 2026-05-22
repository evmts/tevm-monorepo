[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / callHandlerOpts

# Function: callHandlerOpts()

> **callHandlerOpts**(`client`, `params`): `Promise`\<\{ `data`: [`EvmRunCallOpts`](../../evm/interfaces/EvmRunCallOpts.md); `errors?`: `undefined`; \} \| \{ `data?`: `undefined`; `errors`: [`CallHandlerOptsError`](../type-aliases/CallHandlerOptsError.md)[]; \}\>

## Parameters

| Parameter | Type |
| ------ | ------ |
| `client` | [`TevmNode`](../../index/type-aliases/TevmNode.md)\<`"fork"` \| `"normal"`, \{ \}\> |
| `params` | [`CallParams`](../type-aliases/CallParams.md)\<`boolean`\> |

## Returns

`Promise`\<\{ `data`: [`EvmRunCallOpts`](../../evm/interfaces/EvmRunCallOpts.md); `errors?`: `undefined`; \} \| \{ `data?`: `undefined`; `errors`: [`CallHandlerOptsError`](../type-aliases/CallHandlerOptsError.md)[]; \}\>

[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / callHandlerOpts

# Function: callHandlerOpts()

> **callHandlerOpts**(`client`, `params`): `Promise`\<\{ `data`: [`EvmRunCallOpts`](../../evm/interfaces/EvmRunCallOpts.md); `errors`: `undefined`; \} \| \{ `data`: `undefined`; `errors`: [`CallHandlerOptsError`](../type-aliases/CallHandlerOptsError.md)[]; \}\>

Defined in: packages/actions/types/Call/callHandlerOpts.d.ts:1

## Parameters

### client

[`TevmNode`](../../index/type-aliases/TevmNode.md)\<`"fork"` \| `"normal"`, \{\}\>

### params

[`CallParams`](../../index/type-aliases/CallParams.md)\<`boolean`\>

## Returns

`Promise`\<\{ `data`: [`EvmRunCallOpts`](../../evm/interfaces/EvmRunCallOpts.md); `errors`: `undefined`; \} \| \{ `data`: `undefined`; `errors`: [`CallHandlerOptsError`](../type-aliases/CallHandlerOptsError.md)[]; \}\>

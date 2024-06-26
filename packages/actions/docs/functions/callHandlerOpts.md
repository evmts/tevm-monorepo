[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / callHandlerOpts

# Function: callHandlerOpts()

> **callHandlerOpts**(`client`, `params`): `Promise`\<`object`\>

## Parameters

• **client**: `BaseClient`\<`"fork"` \| `"normal"`, `object`\>

• **params**: [`CallParams`](../type-aliases/CallParams.md)\<`boolean`\>

## Returns

`Promise`\<`object`\>

### data?

> `optional` **data**: `EVMRunCallOpts`

### errors?

> `optional` **errors**: [`CallHandlerOptsError`](../type-aliases/CallHandlerOptsError.md)[]

## Defined in

[packages/actions/src/Call/callHandlerOpts.js:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/callHandlerOpts.js#L19)

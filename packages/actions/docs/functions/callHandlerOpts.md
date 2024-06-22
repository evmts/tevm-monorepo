[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / callHandlerOpts

# Function: callHandlerOpts()

`Internal`

> **callHandlerOpts**(`client`, `params`): `Promise`\<`object`\>

Parses user provided params into ethereumjs options to pass into the EVM

## Parameters

• **client**: `BaseClient`\<`"fork"` \| `"normal"`, `object`\>

• **params**: [`CallParams`](../type-aliases/CallParams.md)\<`boolean`\>

## Returns

`Promise`\<`object`\>

### data?

> `optional` **data**: `EVMRunCallOpts`

### errors?

> `optional` **errors**: [`CallHandlerOptsError`](../type-aliases/CallHandlerOptsError.md)[]

## Throws

Returns all errors as values

## Source

[packages/actions/src/Call/callHandlerOpts.js:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/callHandlerOpts.js#L19)

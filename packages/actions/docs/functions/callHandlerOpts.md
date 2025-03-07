[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / callHandlerOpts

# Function: callHandlerOpts()

> **callHandlerOpts**(`client`, `params`): `Promise`\<\{ `data`: `EVMRunCallOpts`; `errors`: `undefined`; \} \| \{ `data`: `undefined`; `errors`: [`CallHandlerOptsError`](../type-aliases/CallHandlerOptsError.md)[]; \}\>

Defined in: [packages/actions/src/Call/callHandlerOpts.js:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/callHandlerOpts.js#L18)

Parses user provided params into ethereumjs options to pass into the EVM

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{\}\>

### params

[`CallParams`](../type-aliases/CallParams.md)\<`boolean`\>

## Returns

`Promise`\<\{ `data`: `EVMRunCallOpts`; `errors`: `undefined`; \} \| \{ `data`: `undefined`; `errors`: [`CallHandlerOptsError`](../type-aliases/CallHandlerOptsError.md)[]; \}\>

## Throws

Returns all errors as values

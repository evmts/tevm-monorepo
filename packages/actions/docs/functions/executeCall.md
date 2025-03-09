[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / executeCall

# Function: executeCall()

> **executeCall**(`client`, `evmInput`, `params`, `events`?): `Promise`\<[`ExecuteCallResult`](../type-aliases/ExecuteCallResult.md) & `object` \| \{ `errors`: \[[`ExecuteCallError`](../type-aliases/ExecuteCallError.md)\]; \}\>

Defined in: [packages/actions/src/Call/executeCall.js:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/executeCall.js#L29)

executeCall encapsalates the internal logic of running a call in the EVM

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{\}\>

### evmInput

`EVMRunCallOpts`

### params

[`CallParams`](../type-aliases/CallParams.md)\<`boolean`\>

### events?

[`CallEvents`](../type-aliases/CallEvents.md)

Optional event handlers for EVM execution

## Returns

`Promise`\<[`ExecuteCallResult`](../type-aliases/ExecuteCallResult.md) & `object` \| \{ `errors`: \[[`ExecuteCallError`](../type-aliases/ExecuteCallError.md)\]; \}\>

## Throws

returns errors as values

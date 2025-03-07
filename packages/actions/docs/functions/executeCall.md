[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / executeCall

# Function: executeCall()

> **executeCall**(`client`, `evmInput`, `params`): `Promise`\<[`ExecuteCallResult`](../type-aliases/ExecuteCallResult.md) & `object` \| `object`\>

executeCall encapsalates the internal logic of running a call in the EVM

## Parameters

• **client**: `TevmNode`\<`"fork"` \| `"normal"`, `object`\>

• **evmInput**: `EVMRunCallOpts`

• **params**: [`CallParams`](../type-aliases/CallParams.md)\<`boolean`\>

## Returns

`Promise`\<[`ExecuteCallResult`](../type-aliases/ExecuteCallResult.md) & `object` \| `object`\>

## Throws

returns errors as values

## Defined in

[packages/actions/src/Call/executeCall.js:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/executeCall.js#L28)

[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / callHandlerResult

# Function: callHandlerResult()

> **callHandlerResult**(`evmResult`, `txHash`, `trace`, `accessList`): [`CallResult`](../type-aliases/CallResult.md)\<[`TevmCallError`](../type-aliases/TevmCallError.md)\>

## Parameters

• **evmResult**: `RunTxResult`

• **txHash**: `undefined` \| \`0x$\{string\}\`

• **trace**: `undefined` \| [`DebugTraceCallResult`](../type-aliases/DebugTraceCallResult.md)

• **accessList**: `undefined` \| `Map`\<`string`, `Set`\<`string`\>\>

returned by the evm

## Returns

[`CallResult`](../type-aliases/CallResult.md)\<[`TevmCallError`](../type-aliases/TevmCallError.md)\>

## Defined in

[packages/actions/src/Call/callHandlerResult.js:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/callHandlerResult.js#L14)

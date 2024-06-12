---
editUrl: false
next: false
prev: false
title: "callHandlerResult"
---

> **callHandlerResult**(`evmResult`, `txHash`, `trace`, `accessList`): [`CallResult`](/reference/tevm/actions/type-aliases/callresult/)\<[`TevmCallError`](/reference/tevm/actions/type-aliases/tevmcallerror/)\>

Creates an CallHandler for handling call params with Ethereumjs EVM

## Parameters

• **evmResult**: [`RunTxResult`](/reference/tevm/vm/interfaces/runtxresult/)

• **txHash**: `undefined` \| \`0x$\{string\}\`

• **trace**: `undefined` \| [`DebugTraceCallResult`](/reference/tevm/actions/type-aliases/debugtracecallresult/)

• **accessList**: `undefined` \| `Map`\<`string`, `Set`\<`string`\>\>

returned by the evm

## Returns

[`CallResult`](/reference/tevm/actions/type-aliases/callresult/)\<[`TevmCallError`](/reference/tevm/actions/type-aliases/tevmcallerror/)\>

## Source

[packages/actions/src/Call/callHandlerResult.js:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/callHandlerResult.js#L12)

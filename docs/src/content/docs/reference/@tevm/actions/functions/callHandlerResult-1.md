---
editUrl: false
next: false
prev: false
title: "callHandlerResult"
---

> **callHandlerResult**(`evmResult`, `txHash`, `trace`, `accessList`): [`CallResult`](/reference/tevm/actions/type-aliases/callresult-1/)\<[`TevmCallError`](/reference/tevm/actions/type-aliases/tevmcallerror-1/)\>

Creates an CallHandler for handling call params with Ethereumjs EVM

## Parameters

• **evmResult**: [`RunTxResult`](/reference/tevm/vm/interfaces/runtxresult/)

• **txHash**: `undefined` \| \`0x$\{string\}\`

• **trace**: `undefined` \| [`DebugTraceCallResult`](/reference/tevm/actions/type-aliases/debugtracecallresult-1/)

• **accessList**: `undefined` \| `Map`\<`string`, `Set`\<`string`\>\>

returned by the evm

## Returns

[`CallResult`](/reference/tevm/actions/type-aliases/callresult-1/)\<[`TevmCallError`](/reference/tevm/actions/type-aliases/tevmcallerror-1/)\>

## Source

[packages/actions/src/Call/callHandlerResult.js:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/callHandlerResult.js#L12)

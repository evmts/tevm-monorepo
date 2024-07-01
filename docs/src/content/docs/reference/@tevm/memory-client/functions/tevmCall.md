---
editUrl: false
next: false
prev: false
title: "tevmCall"
---

> **tevmCall**(`client`, `params`): `Promise`\<[`CallResult`](/reference/tevm/actions/type-aliases/callresult/)\<[`TevmCallError`](/reference/tevm/actions/type-aliases/tevmcallerror/)\>\>

## Parameters

• **client**: `Client`\<[`TevmTransport`](/reference/tevm/memory-client/type-aliases/tevmtransport/)\<`string`\>, `undefined` \| `Chain`, `undefined` \| `Account`, `undefined`, `undefined` \| `object`\>

The viem client configured with TEVM transport.

• **params**: [`CallParams`](/reference/tevm/actions/type-aliases/callparams/)\<`boolean`\>

Parameters for the call, including the target address, call data, sender address, gas limit, gas price, and other options.

## Returns

`Promise`\<[`CallResult`](/reference/tevm/actions/type-aliases/callresult/)\<[`TevmCallError`](/reference/tevm/actions/type-aliases/tevmcallerror/)\>\>

The result of the call.

## Defined in

[packages/memory-client/src/tevmCall.js:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmCall.js#L47)

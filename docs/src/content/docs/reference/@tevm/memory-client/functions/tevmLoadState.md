---
editUrl: false
next: false
prev: false
title: "tevmLoadState"
---

> **tevmLoadState**(`client`, `params`): `Promise`\<[`LoadStateResult`](/reference/tevm/actions/type-aliases/loadstateresult/)\<[`InternalError`](/reference/tevm/errors/classes/internalerror/)\>\>

## Parameters

• **client**: `Client`\<[`TevmTransport`](/reference/tevm/memory-client/type-aliases/tevmtransport/)\<`string`\>, `undefined` \| `Chain`, `undefined` \| `Account`, `undefined`, `undefined` \| `object`\>

The viem client configured with TEVM transport.

• **params**: [`LoadStateParams`](/reference/tevm/actions/type-aliases/loadstateparams/)\<`boolean`\>

The state to load into TEVM.

## Returns

`Promise`\<[`LoadStateResult`](/reference/tevm/actions/type-aliases/loadstateresult/)\<[`InternalError`](/reference/tevm/errors/classes/internalerror/)\>\>

The result of loading the state.

## Defined in

[packages/memory-client/src/tevmLoadState.js:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmLoadState.js#L42)

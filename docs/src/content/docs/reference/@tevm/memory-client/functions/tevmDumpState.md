---
editUrl: false
next: false
prev: false
title: "tevmDumpState"
---

> **tevmDumpState**(`client`): `Promise`\<[`DumpStateResult`](/reference/tevm/actions/type-aliases/dumpstateresult/)\<[`TevmDumpStateError`](/reference/tevm/actions/type-aliases/tevmdumpstateerror/)\>\>

## Parameters

• **client**: `Client`\<[`TevmTransport`](/reference/tevm/memory-client/type-aliases/tevmtransport/)\<`string`\>, `undefined` \| `Chain`, `undefined` \| `Account`, `undefined`, `undefined` \| `object`\>

The viem client configured with TEVM transport.

## Returns

`Promise`\<[`DumpStateResult`](/reference/tevm/actions/type-aliases/dumpstateresult/)\<[`TevmDumpStateError`](/reference/tevm/actions/type-aliases/tevmdumpstateerror/)\>\>

The dump of the TEVM state.

## Defined in

[packages/memory-client/src/tevmDumpState.js:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmDumpState.js#L41)

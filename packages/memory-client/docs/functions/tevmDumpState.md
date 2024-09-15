[**@tevm/memory-client**](../README.md) • **Docs**

***

[@tevm/memory-client](../globals.md) / tevmDumpState

# Function: tevmDumpState()

> **tevmDumpState**(`client`): `Promise`\<`DumpStateResult`\<`TevmDumpStateError`\>\>

## Parameters

• **client**: `Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `undefined` \| `Chain`, `undefined` \| `Account`, `undefined`, `undefined` \| `object`\>

The viem client configured with TEVM transport.

## Returns

`Promise`\<`DumpStateResult`\<`TevmDumpStateError`\>\>

The dump of the TEVM state.

## Defined in

[packages/memory-client/src/tevmDumpState.js:41](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/memory-client/src/tevmDumpState.js#L41)

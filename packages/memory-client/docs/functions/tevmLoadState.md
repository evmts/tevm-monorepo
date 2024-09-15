[**@tevm/memory-client**](../README.md) • **Docs**

***

[@tevm/memory-client](../globals.md) / tevmLoadState

# Function: tevmLoadState()

> **tevmLoadState**(`client`, `params`): `Promise`\<`LoadStateResult`\<`InternalError`\>\>

## Parameters

• **client**: `Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `undefined` \| `Chain`, `undefined` \| `Account`, `undefined`, `undefined` \| `object`\>

The viem client configured with TEVM transport.

• **params**: `LoadStateParams`\<`boolean`\>

The state to load into TEVM.

## Returns

`Promise`\<`LoadStateResult`\<`InternalError`\>\>

The result of loading the state.

## Defined in

[packages/memory-client/src/tevmLoadState.js:42](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/memory-client/src/tevmLoadState.js#L42)

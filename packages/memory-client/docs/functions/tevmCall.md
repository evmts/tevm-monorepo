[**@tevm/memory-client**](../README.md) • **Docs**

***

[@tevm/memory-client](../globals.md) / tevmCall

# Function: tevmCall()

> **tevmCall**(`client`, `params`): `Promise`\<`CallResult`\<`TevmCallError`\>\>

## Parameters

• **client**: `Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `undefined` \| `Chain`, `undefined` \| `Account`, `undefined`, `undefined` \| `object`\>

The viem client configured with TEVM transport.

• **params**: `CallParams`\<`boolean`\>

Parameters for the call, including the target address, call data, sender address, gas limit, gas price, and other options.

## Returns

`Promise`\<`CallResult`\<`TevmCallError`\>\>

The result of the call.

## Defined in

[packages/memory-client/src/tevmCall.js:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmCall.js#L47)

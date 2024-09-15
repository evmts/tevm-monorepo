[**@tevm/memory-client**](../README.md) • **Docs**

***

[@tevm/memory-client](../globals.md) / tevmReady

# Function: tevmReady()

> **tevmReady**(`client`): `Promise`\<`true`\>

## Parameters

• **client**: `Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `undefined` \| `Chain`, `undefined` \| `Account`, `undefined`, `undefined` \| `object`\>

The viem client configured with TEVM transport.

## Returns

`Promise`\<`true`\>

Resolves when ready, rejects if VM fails to initialize.

## Defined in

[packages/memory-client/src/tevmReady.js:43](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/memory-client/src/tevmReady.js#L43)

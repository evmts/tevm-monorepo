[**@tevm/memory-client**](../README.md) • **Docs**

***

[@tevm/memory-client](../globals.md) / tevmGetAccount

# Function: tevmGetAccount()

> **tevmGetAccount**(`client`, `params`): `Promise`\<`GetAccountResult`\<`TevmGetAccountError`\>\>

## Parameters

• **client**: `Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `undefined` \| `Chain`, `undefined` \| `Account`, `undefined`, `undefined` \| `object`\>

The viem client configured with TEVM transport.

• **params**: `GetAccountParams`\<`boolean`\>

Parameters for retrieving the account information.

## Returns

`Promise`\<`GetAccountResult`\<`TevmGetAccountError`\>\>

The account information.

## Defined in

[packages/memory-client/src/tevmGetAccount.js:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmGetAccount.js#L45)

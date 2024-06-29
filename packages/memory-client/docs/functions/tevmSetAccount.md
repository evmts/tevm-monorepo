[**@tevm/memory-client**](../README.md) • **Docs**

***

[@tevm/memory-client](../globals.md) / tevmSetAccount

# Function: tevmSetAccount()

> **tevmSetAccount**(`client`, `params`): `Promise`\<`SetAccountResult`\<`TevmSetAccountError`\>\>

## Parameters

• **client**: `Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `undefined` \| `Chain`, `undefined` \| `Account`, `undefined`, `undefined` \| `object`\>

The viem client configured with TEVM transport.

• **params**: `SetAccountParams`\<`boolean`\>

Parameters for setting the account.

## Returns

`Promise`\<`SetAccountResult`\<`TevmSetAccountError`\>\>

The result of setting the account.

## Defined in

[packages/memory-client/src/tevmSetAccount.js:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmSetAccount.js#L50)

---
editUrl: false
next: false
prev: false
title: "tevmSetAccount"
---

> **tevmSetAccount**(`client`, `params`): `Promise`\<[`SetAccountResult`](/reference/tevm/actions/type-aliases/setaccountresult/)\<[`TevmSetAccountError`](/reference/tevm/actions/type-aliases/tevmsetaccounterror/)\>\>

## Parameters

• **client**: `Client`\<[`TevmTransport`](/reference/tevm/memory-client/type-aliases/tevmtransport/)\<`string`\>, `undefined` \| `Chain`, `undefined` \| [`Account`](/reference/tevm/utils/type-aliases/account/), `undefined`, `undefined` \| `object`\>

The viem client configured with TEVM transport.

• **params**: [`SetAccountParams`](/reference/tevm/actions/type-aliases/setaccountparams/)\<`boolean`\>

Parameters for setting the account.

## Returns

`Promise`\<[`SetAccountResult`](/reference/tevm/actions/type-aliases/setaccountresult/)\<[`TevmSetAccountError`](/reference/tevm/actions/type-aliases/tevmsetaccounterror/)\>\>

The result of setting the account.

## Defined in

[packages/memory-client/src/tevmSetAccount.js:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmSetAccount.js#L50)

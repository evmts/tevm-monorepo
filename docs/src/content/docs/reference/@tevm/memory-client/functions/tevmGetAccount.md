---
editUrl: false
next: false
prev: false
title: "tevmGetAccount"
---

> **tevmGetAccount**(`client`, `params`): `Promise`\<[`GetAccountResult`](/reference/tevm/actions/type-aliases/getaccountresult/)\<[`TevmGetAccountError`](/reference/tevm/actions/type-aliases/tevmgetaccounterror/)\>\>

## Parameters

• **client**: `Client`\<[`TevmTransport`](/reference/tevm/memory-client/type-aliases/tevmtransport/)\<`string`\>, `undefined` \| `Chain`, `undefined` \| [`Account`](/reference/tevm/utils/type-aliases/account/), `undefined`, `undefined` \| `object`\>

The viem client configured with TEVM transport.

• **params**: [`GetAccountParams`](/reference/tevm/actions/type-aliases/getaccountparams/)\<`boolean`\>

Parameters for retrieving the account information.

## Returns

`Promise`\<[`GetAccountResult`](/reference/tevm/actions/type-aliases/getaccountresult/)\<[`TevmGetAccountError`](/reference/tevm/actions/type-aliases/tevmgetaccounterror/)\>\>

The account information.

## Defined in

[packages/memory-client/src/tevmGetAccount.js:45](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/memory-client/src/tevmGetAccount.js#L45)

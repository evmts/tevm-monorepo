---
editUrl: false
next: false
prev: false
title: "tevmGetAccount"
---

> **tevmGetAccount**(`client`, `params`): `Promise`\<[`GetAccountResult`](/reference/tevm/actions/type-aliases/getaccountresult/)\<[`TevmGetAccountError`](/reference/tevm/actions/type-aliases/tevmgetaccounterror/)\>\>

A tree-shakeable version of the `tevmGetAccount` action for viem.
Retrieves the account information from TEVM.

This function allows you to retrieve information about an account, including its address and optionally its contract storage.
The `returnStorage` parameter determines whether the contract storage should be returned. Note that it only returns the storage that is cached in the VM.
In fork mode, if the storage hasn't been cached yet, it will not be returned. This defaults to `false`.
Be aware that returning storage can be very expensive if a contract has a lot of storage.

## Parameters

• **client**: `Client`\<[`TevmTransport`](/reference/tevm/memory-client/type-aliases/tevmtransport/)\<`string`\>, `undefined` \| `Chain`, `undefined` \| [`Account`](/reference/tevm/utils/type-aliases/account/), `undefined`, `undefined` \| `object`\>

The viem client configured with TEVM transport.

• **params**: [`GetAccountParams`](/reference/tevm/actions/type-aliases/getaccountparams/)\<`boolean`\>

Parameters for retrieving the account information.

## Returns

`Promise`\<[`GetAccountResult`](/reference/tevm/actions/type-aliases/getaccountresult/)\<[`TevmGetAccountError`](/reference/tevm/actions/type-aliases/tevmgetaccounterror/)\>\>

The account information.

## Example

```typescript
import { tevmGetAccount } from 'tevm/actions'
import { createClient, http } from 'viem'
import { optimism } from 'tevm/common'
import { createTevmTransport } from 'tevm'

const client = createClient({
  transport: createTevmTransport({
    fork: { transport: http('https://mainnet.optimism.io')({}) }
  }),
  chain: optimism,
})

async function example() {
  const account = await tevmGetAccount(client, {
    address: '0x123...',
    returnStorage: true,
  })
  console.log(account)
}

example()
```

## See

 - [GetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountparams/) for options reference.
 - [GetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountresult/) for return values reference.
 - [TEVM Actions Guide](https://tevm.sh/learn/actions/)

## Defined in

[packages/memory-client/src/tevmGetAccount.js:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmGetAccount.js#L45)

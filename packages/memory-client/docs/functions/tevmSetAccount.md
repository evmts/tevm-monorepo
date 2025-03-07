[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / tevmSetAccount

# Function: tevmSetAccount()

> **tevmSetAccount**(`client`, `params`): `Promise`\<`SetAccountResult`\<`TevmSetAccountError`\>\>

Defined in: [packages/memory-client/src/tevmSetAccount.js:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmSetAccount.js#L50)

A tree-shakeable version of the `tevmSetAccount` action for viem.
Sets the account in TEVM.

This function allows you to set various properties of an account in TEVM, such as its balance, nonce, contract deployedBytecode, and storage state.
It is a powerful tool for setting up test environments and manipulating accounts for advanced scenarios.

## Parameters

### client

`Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `undefined` \| `Chain`, `undefined` \| `Account`, `undefined`, `undefined` \| \{ `[key: string]`: `unknown`;  `account`: `undefined`; `batch`: `undefined`; `cacheTime`: `undefined`; `ccipRead`: `undefined`; `chain`: `undefined`; `key`: `undefined`; `name`: `undefined`; `pollingInterval`: `undefined`; `request`: `undefined`; `transport`: `undefined`; `type`: `undefined`; `uid`: `undefined`; \}\>

The viem client configured with TEVM transport.

### params

`SetAccountParams`\<`boolean`\>

Parameters for setting the account.

## Returns

`Promise`\<`SetAccountResult`\<`TevmSetAccountError`\>\>

The result of setting the account.

## Example

```typescript
import { tevmSetAccount } from 'tevm/actions'
import { createClient, http } from 'viem'
import { optimism } from 'tevm/common'
import { createTevmTransport } from 'tevm'
import { numberToHex } from '@tevm/utils'
import { SimpleContract } from 'tevm/contract'

const client = createClient({
  transport: createTevmTransport({
    fork: { transport: http('https://mainnet.optimism.io')({}) }
  }),
  chain: optimism,
})

async function example() {
  await tevmSetAccount(client, {
    address: `0x${'0123'.repeat(10)}`,
    balance: 100n,
    nonce: 1n,
    deployedBytecode: SimpleContract.deployedBytecode,
    state: {
      [`0x${'0'.repeat(64)}`]: numberToHex(420n),
    },
  })
  console.log('Account set')
}

example()
```

## See

 - [SetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountparams/) for options reference.
 - [SetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountresult/) for return values reference.
 - [TEVM Actions Guide](https://tevm.sh/learn/actions/)

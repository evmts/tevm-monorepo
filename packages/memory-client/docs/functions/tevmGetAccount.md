[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / tevmGetAccount

# Function: tevmGetAccount()

> **tevmGetAccount**(`client`, `params`): `Promise`\<`GetAccountResult`\<`TevmGetAccountError`\>\>

Defined in: [packages/memory-client/src/tevmGetAccount.js:78](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmGetAccount.js#L78)

A tree-shakeable version of the `tevmGetAccount` action for viem.
Retrieves detailed account information from the TEVM state, including balance, nonce, code, and optionally storage.

This function provides a comprehensive view of an Ethereum account's state within the TEVM environment.
It returns account properties including:
- Address (the requested account address)
- Balance (in wei)
- Nonce (transaction count)
- Code (bytecode for contract accounts)
- Storage (optionally, contract storage slots and values)

The `returnStorage` parameter controls whether the contract's storage is included in the response:
- When `false` (default): Only basic account information is returned, which is more efficient
- When `true`: Contract storage slots and values are also returned

**Important fork mode considerations:**
In fork mode, the function only returns storage slots that have already been accessed and cached in the local state.
If a storage slot hasn't been previously accessed in your TEVM session, it won't appear in the results even with
`returnStorage: true`. To ensure all relevant storage is included, you may need to interact with the contract first.

**Performance note:** Requesting storage for contracts with many storage slots can be computationally expensive
and produce large response objects. Use `returnStorage: true` judiciously for contracts with known limited storage.

## Parameters

### client

`Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `undefined` \| `Chain`, `undefined` \| `Account`, `undefined`, `undefined` \| \{[`key`: `string`]: `unknown`; `account?`: `undefined`; `batch?`: `undefined`; `cacheTime?`: `undefined`; `ccipRead?`: `undefined`; `chain?`: `undefined`; `key?`: `undefined`; `name?`: `undefined`; `pollingInterval?`: `undefined`; `request?`: `undefined`; `transport?`: `undefined`; `type?`: `undefined`; `uid?`: `undefined`; \}\>

The viem client configured with TEVM transport.

### params

`GetAccountParams`\<`boolean`\>

Parameters for retrieving the account information.

## Returns

`Promise`\<`GetAccountResult`\<`TevmGetAccountError`\>\>

The account information, including address, balance, nonce, code, and optionally storage.

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
  // Get EOA (externally owned account) information
  const userAccount = await tevmGetAccount(client, {
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  })
  console.log(`Balance: ${userAccount.balance}`)
  console.log(`Nonce: ${userAccount.nonce}`)

  // Get contract account with storage
  const contractAccount = await tevmGetAccount(client, {
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // UNI token
    returnStorage: true,
  })
  console.log(`Contract bytecode: ${contractAccount.code}`)
  console.log(`Storage slots: ${Object.keys(contractAccount.storage || {}).length}`)

  // Storage is a mapping of hex slot keys to hex values
  // Both are represented as hex strings
  if (contractAccount.storage) {
    for (const [slot, value] of Object.entries(contractAccount.storage)) {
      console.log(`Slot ${slot}: ${value}`)
    }
  }
}

example()
```

## See

 - [GetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountparams/) for options reference.
 - [GetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountresult/) for return values reference.
 - [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 - [tevmSetAccount](https://tevm.sh/reference/tevm/actions/functions/setaccounthandler/) for modifying account state

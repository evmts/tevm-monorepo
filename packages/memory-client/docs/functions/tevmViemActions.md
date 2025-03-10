[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / tevmViemActions

# Function: tevmViemActions()

> **tevmViemActions**(): (`client`) => [`TevmViemActionsApi`](../type-aliases/TevmViemActionsApi.md)

Defined in: [packages/memory-client/src/tevmViemActions.js:81](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmViemActions.js#L81)

A viem extension that adds TEVM actions to a viem client.

This function creates a viem extension that adds the full set of TEVM-specific actions to any viem client
that has been configured with the TEVM transport. These actions provide direct access to the Ethereum
Virtual Machine's capabilities, including:

- Low-level EVM execution (`tevmCall`)
- Contract interaction with ABI encoding/decoding (`tevmContract`)
- Contract deployment (`tevmDeploy`)
- Block mining (`tevmMine`)
- Account state management (`tevmGetAccount`, `tevmSetAccount`)
- State persistence (`tevmDumpState`, `tevmLoadState`)
- Direct VM access (`tevm` for advanced usage)

The viem client must already have TEVM support via a `createTevmTransport` transport.

Note: If you are building a frontend application, you should use the tree-shakable API instead to optimize bundle size.

## Returns

`Function`

A viem extension function that adds TEVM actions

### Parameters

#### client

`Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `undefined` \| `Chain`, `undefined` \| `Account`, `undefined`, `undefined` \| \{ `[key: string]`: `unknown`;  `account`: `undefined`; `batch`: `undefined`; `cacheTime`: `undefined`; `ccipRead`: `undefined`; `chain`: `undefined`; `key`: `undefined`; `name`: `undefined`; `pollingInterval`: `undefined`; `request`: `undefined`; `transport`: `undefined`; `type`: `undefined`; `uid`: `undefined`; \}\>

### Returns

[`TevmViemActionsApi`](../type-aliases/TevmViemActionsApi.md)

## Throws

If the client doesn't have a TEVM transport configured

## Example

```typescript
import { createClient, http } from 'viem'
import { optimism } from 'tevm/common'
import { createTevmTransport, tevmViemActions } from 'tevm'

// Create a basic viem client with TEVM transport
const client = createClient({
  transport: createTevmTransport({
    fork: {
      transport: http('https://mainnet.optimism.io')({})
    }
  }),
  chain: optimism,
})

// Extend the client with TEVM actions
const tevmClient = client.extend(tevmViemActions())

async function example() {
  // Wait for the client to be ready
  await tevmClient.tevmReady()

  // Set up an account with ETH
  await tevmClient.tevmSetAccount({
    address: '0x1234567890123456789012345678901234567890',
    balance: 1000000000000000000n // 1 ETH
  })

  // Get account state including storage
  const account = await tevmClient.tevmGetAccount({
    address: '0x1234567890123456789012345678901234567890',
    returnStorage: true,
  })
  console.log('Account:', account)

  // Deploy a contract
  const deployResult = await tevmClient.tevmDeploy({
    bytecode: '0x608060405234801561001057600080fd5b50610150806100206000396000f3fe...',
    abi: [...],
    createTransaction: true // Create an actual transaction, not just a call
  })

  // Mine the transaction to include it in state
  await tevmClient.tevmMine()

  console.log('Contract deployed at:', deployResult.createdAddress)
}

example()
```

## See

 - [TEVM Actions Guide](https://tevm.sh/learn/actions/) - Complete documentation of all TEVM actions
 - [Viem Client Guide](https://viem.sh/docs/clients/) - Viem client documentation
 - [TevmViemActionsApi](../type-aliases/TevmViemActionsApi.md) - The API interface this extension implements

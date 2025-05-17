[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / tevmDumpState

# Function: tevmDumpState()

> **tevmDumpState**(`client`): `Promise`\<`DumpStateResult`\<`TevmDumpStateError`\>\>

Defined in: [packages/memory-client/src/tevmDumpState.js:120](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmDumpState.js#L120)

A tree-shakeable version of the `tevmDumpState` action for viem.
Exports the entire blockchain state from TEVM into a serializable JavaScript object.

This function captures a complete snapshot of the current blockchain state, including:
- All account balances, nonces, and storage
- Smart contract bytecode
- Transaction receipts
- Block headers and history
- Current blockchain parameters (latest block, gas price, etc.)

The returned state object can be used for:
- Persisting state between application sessions
- Backing up blockchain state before running test scenarios
- Transferring state between different TEVM instances
- Creating reproducible environments for debugging
- Defining pre-configured test fixtures

This function works in conjunction with `tevmLoadState` to provide a complete state
serialization and restoration system. The output is serializable using standard
JSON.stringify() though you may need to handle BigInt conversion depending on your
platform (see the example below).

## Parameters

### client

`Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `undefined` \| `Chain`, `undefined` \| `Account`, `undefined`, `undefined` \| \{[`key`: `string`]: `unknown`; `account?`: `undefined`; `batch?`: `undefined`; `cacheTime?`: `undefined`; `ccipRead?`: `undefined`; `chain?`: `undefined`; `key?`: `undefined`; `name?`: `undefined`; `pollingInterval?`: `undefined`; `request?`: `undefined`; `transport?`: `undefined`; `type?`: `undefined`; `uid?`: `undefined`; \}\>

The viem client configured with TEVM transport.

## Returns

`Promise`\<`DumpStateResult`\<`TevmDumpStateError`\>\>

A serializable object containing the complete blockchain state.

## Examples

```typescript
import { tevmDumpState, tevmLoadState } from 'tevm/actions'
import { createClient, http, parseEther } from 'viem'
import { optimism } from 'tevm/common'
import { createTevmTransport } from 'tevm'
import fs from 'fs/promises'

const client = createClient({
  transport: createTevmTransport({
    fork: { transport: http('https://mainnet.optimism.io')({}) }
  }),
  chain: optimism,
})

async function saveAndRestoreState() {
  // Set up initial state
  await client.setBalance({
    address: '0x1234567890123456789012345678901234567890',
    value: parseEther('100')
  })
  await client.mine() // Mine a block to update state

  // Dump the entire blockchain state
  const state = await tevmDumpState(client)

  // Serialize state to JSON (handling BigInt conversion)
  const serializedState = JSON.stringify(state, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  )

  // Save to file
  await fs.writeFile('blockchain-snapshot.json', serializedState)
  console.log('State saved to blockchain-snapshot.json')

  // Later, in another session or process:

  // Read the state from file
  const savedState = JSON.parse(
    await fs.readFile('blockchain-snapshot.json', 'utf8'),
    (_, value) => {
      // Restore BigInt values
      if (typeof value === 'string' && /^\d+n$/.test(value)) {
        return BigInt(value.slice(0, -1))
      }
      return value
    }
  )

  // Create a new client with the saved state
  const newClient = createClient({
    transport: createTevmTransport(),
    chain: optimism,
  })

  // Load the saved state
  await tevmLoadState(newClient, savedState)

  // Verify the state was restored
  const balance = await newClient.getBalance({
    address: '0x1234567890123456789012345678901234567890'
  })
  console.log('Restored balance:', balance) // Should be 100 ETH
}
```

```typescript
// Using with the SyncStoragePersister for automatic persistence
import { createMemoryClient, createSyncPersister } from 'tevm'

// Create a persister that saves to localStorage (in browser)
// or to a file (in Node.js)
const persister = createSyncPersister({
  storage: localStorage, // or use a file-based storage adapter
  key: 'tevm-state'      // storage key
})

// Create a client with automatic persistence
const client = createMemoryClient({
  persister,
  // State will be automatically loaded from storage on startup
  // and saved to storage periodically and on shutdown
})
```

## See

 - [DumpStateResult](https://tevm.sh/reference/tevm/actions/type-aliases/dumpstateresult/) for return value structure.
 - [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 - [tevmLoadState](https://tevm.sh/reference/tevm/actions/functions/tevmloadstate/) for restoring the state.
 - [SyncStoragePersister](https://tevm.sh/reference/tevm/sync-storage-persister/functions/createsyncpersister/) for automatic state persistence.

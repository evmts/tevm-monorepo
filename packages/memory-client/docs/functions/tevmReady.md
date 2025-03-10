[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / tevmReady

# Function: tevmReady()

> **tevmReady**(`client`): `Promise`\<`true`\>

Defined in: [packages/memory-client/src/tevmReady.js:86](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmReady.js#L86)

A tree-shakeable version of the `tevmReady` action for viem.
Checks if TEVM is ready and waits for initialization to complete.

This function ensures that the TEVM is fully initialized and ready for operations.
It resolves to `true` if the TEVM is ready, and throws an error if the VM fails to initialize.

Important aspects of initialization include:
- Setting up the EVM and bytecode execution environment
- Initializing the blockchain state, accounts, and storage
- Establishing fork connections and synchronizing state if forking from a network
- Preparing the transaction pool and receipt management system
- Loading persisted state if a persister is configured

Note: It is not necessary to explicitly call `tevmReady` because all actions implicitly wait for TEVM to be ready.
However, this can be useful if you want to isolate initialization from the action, for example, when running benchmark tests.

## Parameters

### client

`Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `undefined` \| `Chain`, `undefined` \| `Account`, `undefined`, `undefined` \| \{ `[key: string]`: `unknown`;  `account`: `undefined`; `batch`: `undefined`; `cacheTime`: `undefined`; `ccipRead`: `undefined`; `chain`: `undefined`; `key`: `undefined`; `name`: `undefined`; `pollingInterval`: `undefined`; `request`: `undefined`; `transport`: `undefined`; `type`: `undefined`; `uid`: `undefined`; \}\>

The viem client configured with TEVM transport.

## Returns

`Promise`\<`true`\>

Resolves when ready, rejects if VM fails to initialize.

## Throws

If the VM fails to initialize.

## Examples

```typescript
import { tevmReady } from 'tevm/actions'
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
  try {
    await tevmReady(client)
    console.log('TEVM is ready')
  } catch (error) {
    // Handle the error appropriately, e.g., retry or use a fallback
    console.error('Failed to initialize TEVM:', error)
  }
}

example()
```

```typescript
// Using with memory client for benchmark timing
import { createMemoryClient } from 'tevm'
import { parseEther } from 'viem'

async function benchmark() {
  const client = createMemoryClient({
    fork: {
      url: 'https://mainnet.optimism.io',
    }
  })

  // Measure initialization time separately
  console.time('Initialization')
  await client.tevmReady()
  console.timeEnd('Initialization')

  // Now measure operation time
  console.time('Operations')

  // Run your benchmark operations
  for (let i = 0; i < 100; i++) {
    const balance = await client.getBalance({
      address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
    })
  }

  console.timeEnd('Operations')
}

benchmark()
```

## See

 - [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 - [Forking Guide](https://tevm.sh/learn/forking/) for more information about fork initialization.

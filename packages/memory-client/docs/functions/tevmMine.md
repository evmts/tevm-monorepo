[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / tevmMine

# Function: tevmMine()

> **tevmMine**(`client`, `params`?): `Promise`\<`MineResult`\>

Defined in: [packages/memory-client/src/tevmMine.js:122](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmMine.js#L122)

A tree-shakeable version of the `tevmMine` action for viem.
Mines new blocks in the TEVM blockchain, finalizing pending transactions and updating blockchain state.

In TEVM, transactions (like contract deployments, transfers, or contract calls with `createTransaction: true`)
are processed immediately but don't affect the blockchain state until they're included in a mined block.
This function advances the blockchain by mining blocks containing any pending transactions.

**Key Mining Concepts:**
- Mining finalizes transactions and updates the canonical blockchain state
- All pending transactions are included in blocks when mining
- Block timestamps advance according to the specified interval
- Mining creates new blocks regardless of whether there are pending transactions
- The returned block hashes can be used to query block information or transaction receipts

**Mining Modes in TEVM:**
1. **Manual Mining**: Default mode where you explicitly call `tevmMine` to mine blocks
2. **Auto Mining**: When enabled, automatically mines after every transaction
3. **Interval Mining**: When enabled, mines blocks at a specified time interval

The manual mining mode gives you precise control over when state changes take effect, making it
ideal for step-by-step testing and debugging scenarios.

## Parameters

### client

`Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `undefined` \| `Chain`, `undefined` \| `Account`, `undefined`, `undefined` \| \{ `[key: string]`: `unknown`;  `account`: `undefined`; `batch`: `undefined`; `cacheTime`: `undefined`; `ccipRead`: `undefined`; `chain`: `undefined`; `key`: `undefined`; `name`: `undefined`; `pollingInterval`: `undefined`; `request`: `undefined`; `transport`: `undefined`; `type`: `undefined`; `uid`: `undefined`; \}\>

The viem client configured with TEVM transport.

### params?

`MineParams`\<`boolean`\>

Optional parameters for mining blocks.

## Returns

`Promise`\<`MineResult`\>

The result of mining blocks, including an array of block hashes.

## Examples

```typescript
import { tevmMine } from 'tevm/actions'
import { createClient, http, parseEther } from 'viem'
import { optimism } from 'tevm/common'
import { createTevmTransport } from 'tevm'

const client = createClient({
  transport: createTevmTransport({
    fork: { transport: http('https://mainnet.optimism.io')({}) },
    mining: { auto: false } // Explicit manual mining mode
  }),
  chain: optimism,
})

async function example() {
  // Set up two accounts
  const sender = '0x1234567890123456789012345678901234567890'
  const recipient = '0x0987654321098765432109876543210987654321'

  // Give sender some ETH
  await client.setBalance({
    address: sender,
    value: parseEther('10')
  })

  // Send transaction (processed but not yet in state)
  const txHash = await client.sendTransaction({
    from: sender,
    to: recipient,
    value: parseEther('1')
  })

  // Balances don't reflect the transfer yet
  console.log('Pre-mine recipient balance:',
    await client.getBalance({ address: recipient })) // 0n

  // Mine a single block to include the transaction
  const result = await tevmMine(client)
  console.log('Mined block hash:', result.blockHashes[0])

  // Now balances reflect the transfer
  console.log('Post-mine recipient balance:',
    await client.getBalance({ address: recipient })) // 1000000000000000000n (1 ETH)

  // Get transaction receipt after mining
  const receipt = await client.getTransactionReceipt({ hash: txHash })
  console.log('Transaction mined in block:', receipt.blockNumber)

  // Mine multiple blocks with custom timestamp intervals
  const moreBlocks = await tevmMine(client, {
    blockCount: 5,        // Mine 5 blocks
    interval: 10          // 10 second intervals between blocks
  })

  // Block timestamps will be 10 seconds apart
  for (const hash of moreBlocks.blockHashes) {
    const block = await client.getBlock({ blockHash: hash })
    console.log(`Block ${block.number}: timestamp ${block.timestamp}`)
  }
}
```

```typescript
// Configure different mining modes when creating the client
import { createMemoryClient, http } from 'tevm'

// Auto-mining mode (mines after every transaction)
const autoMineClient = createMemoryClient({
  mining: { auto: true },
  fork: { transport: http('https://mainnet.optimism.io')({}) }
})

// Interval mining mode (mines every 5 seconds)
const intervalMineClient = createMemoryClient({
  mining: { interval: 5000 }, // milliseconds
  fork: { transport: http('https://mainnet.optimism.io')({}) }
})

// Manual mining mode (explicit mining required)
const manualMineClient = createMemoryClient({
  mining: { auto: false, interval: 0 }, // explicitly disable auto modes
  fork: { transport: http('https://mainnet.optimism.io')({}) }
})
```

## See

 - [MineParams](https://tevm.sh/reference/tevm/actions/type-aliases/mineparams/) for options reference.
 - [MineResult](https://tevm.sh/reference/tevm/actions/type-aliases/mineresult/) for return values reference.
 - [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 - [createMemoryClient](https://tevm.sh/reference/tevm/memory-client/functions/creatememoryclient/) for configuring mining modes.

# SimulateCall

The `simulateCall` action allows you to simulate transaction execution at a specific block in the blockchain history. It's similar to `debug_traceTransaction` but provides more flexibility in specifying the target transaction and block, along with customizing transaction parameters.

## Key Features

- Simulate transactions at specific block heights or block hashes
- Simulate after specific transactions in a block (by index or hash)
- Override parameters of existing transactions
- Full EVM execution with identical trace results as real transactions

## Usage Examples

### Simulating a Call at a Specific Block

```typescript
import { createMemoryClient, http } from 'tevm'
import { optimism } from 'tevm/common'

const client = createMemoryClient({
  fork: {
    transport: http('https://mainnet.optimism.io')({})
  }
})

// Simulate a call on a specific block
const result = await client.tevmSimulateCall({
  blockNumber: 1000000n,
  to: '0x1234567890123456789012345678901234567890',
  data: '0xabcdef',
  value: 1000000000n,
  skipBalance: true,
})

console.log('Simulation result:', result)
```

### Simulating After a Specific Transaction

```typescript
import { createMemoryClient, http } from 'tevm'
import { mainnet } from 'tevm/common'

const client = createMemoryClient({
  fork: {
    transport: http('https://mainnet.ethereum.io')({})
  }
})

// Simulate a call after the 3rd transaction (index 2) in block 15000000
const result = await client.tevmSimulateCall({
  blockNumber: 15000000n,
  transactionIndex: 2,
  to: '0xabcdef1234567890abcdef1234567890abcdef12',
  data: '0x123456',
  value: 1n,
})

console.log('Gas used:', result.executionGasUsed)
console.log('Return data:', result.rawData)
```

### Overriding an Existing Transaction

```typescript
import { createMemoryClient, http } from 'tevm'
import { optimism } from 'tevm/common'

const client = createMemoryClient({
  fork: {
    transport: http('https://mainnet.optimism.io')({})
  }
})

// Override parameters of an existing transaction
const result = await client.tevmSimulateCall({
  blockHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  transactionHash: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  value: 1000000000n, // Override the original transaction's value
})

// Check results
if (result.executionGasUsed > 1000000n) {
  console.log('High gas usage detected:', result.executionGasUsed)
}
```

## API Reference

### Parameters

The `simulateCall` function accepts the following parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| `blockTag` | `string` | Block tag to simulate on ('latest', 'earliest', 'pending', 'safe', 'finalized') |
| `blockNumber` | `number | bigint` | Block number to simulate on |
| `blockHash` | `0x${string}` | Block hash to simulate on |
| `transactionIndex` | `number | bigint` | Transaction index in the block to simulate after (optional) |
| `transactionHash` | `0x${string}` | Transaction hash in the block to simulate. If provided, will override the transaction with the given parameters |
| ...CallParams | `object` | Standard transaction parameters (to, from, data, value, gas, etc.) |

Note: At least one of `blockTag`, `blockNumber`, or `blockHash` must be provided.

### Return Value

The function returns a `SimulateCallResult` object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `executionGasUsed` | `bigint` | Amount of gas used during execution |
| `rawData` | `0x${string}` | Raw return data from the call |
| `data` | `any` | Decoded return data (if ABI was provided) |
| `trace` | `object[]` | Execution trace (if `createTrace` was set to true) |
| `blockNumber` | `bigint` | Block number used for simulation |
| `errors` | `Error[]` | Array of errors (if any occurred) |
| `txHash` | `0x${string}` | Transaction hash (if `createTransaction` was set to true) |

## Use Cases

- Debugging historical transactions by simulating them with different parameters
- Gas optimization by testing the same transaction with different inputs
- Testing complex sequences of transactions by simulating them one after another
- Auditing contract security by analyzing historical transaction behaviors
- Testing "what-if" scenarios for failed transactions
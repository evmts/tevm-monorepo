[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / simulateCallHandler

# Function: simulateCallHandler()

> **simulateCallHandler**(`client`, `options`?): [`SimulateCallHandler`](../type-aliases/SimulateCallHandler.md)

Defined in: [packages/actions/src/SimulateCall/simulateCallHandler.js:55](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/SimulateCall/simulateCallHandler.js#L55)

Simulates a call in the context of a specific block, with the option to simulate after
specific transactions in the block.

This is similar to `debug_traceTransaction` but allows more flexibility in specifying
the target transaction and block, as well as customizing the transaction parameters.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{\}\>

The TEVM node instance

### options?

Optional parameters.

#### throwOnFail?

`boolean` = `true`

Whether to throw an error on failure.

## Returns

[`SimulateCallHandler`](../type-aliases/SimulateCallHandler.md)

The simulate handler function.

## Throws

If `throwOnFail` is true and simulation fails.

## Example

```typescript
import { createTevmNode } from 'tevm/node'
import { simulateCallHandler } from 'tevm/actions'

const client = createTevmNode()

const simulateCall = simulateCallHandler(client)

// Simulate a call on a specific block after a specific transaction
const res = await simulateCall({
  blockNumber: 1000000n,
  transactionIndex: 2, // simulate after 3rd transaction (0-indexed)
  to: `0x${'69'.repeat(20)}`,
  value: 420n,
  skipBalance: true,
})

// Or override a specific transaction's parameters
const res2 = await simulateCall({
  blockHash: '0xabcdef...',
  transactionHash: '0x123456...',
  value: 1000n, // override the original transaction's value
})
```

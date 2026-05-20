# ExEx-Like Execution Extension API

Tevm exposes an ExEx-style hook API on `TevmNode` for subscribing to execution lifecycle events.

## Registration

Register hooks when creating a node:

```ts
import { createTevmNode } from 'tevm/node'

const node = createTevmNode({
  exExHooks: [async (event) => {
    if (event.type === 'block' && event.phase === 'imported') {
      // custom extension logic
    }
  }],
})
```

Or register dynamically:

```ts
const off = node.registerExExHook((event) => {
  // handle event
})

// later
off()
```

## Event Types

`ExExEvent` currently includes:
- `block.imported`
- `transaction.executed`
- `receipt.created`
- `log.created`
- `state.committed`
- `canonical.headChanged`
- `enginePayload.received`
- `enginePayload.validated`

## Error Handling and Backpressure

- Hooks are awaited serially in registration order.
- If a hook throws, Tevm logs the error and continues invoking remaining hooks.
- This makes slow hooks apply backpressure to the mining/import path by design.

## Mining and Engine API

ExEx hooks are emitted during block lifecycle processing and Engine API payload procedures.
They are exercised in tests across manual, automine, interval-mode configuration, and Engine API calls.

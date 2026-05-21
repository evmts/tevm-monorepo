# ExEx-Like Execution Extension API

`TevmNode` exposes ExEx-style hooks for subscribing to execution lifecycle events.

## Registration

At node creation:

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

Dynamically (returns unregister fn):

```ts
const off = node.registerExExHook((event) => { /* handle event */ })
off()
```

## Event types

`ExExEvent` includes: `block.imported`, `transaction.executed`, `receipt.created`, `log.created`, `state.committed`, `canonical.headChanged`, `enginePayload.received`, `enginePayload.validated`.

## Semantics

- Hooks awaited serially in registration order.
- Throws are logged; remaining hooks still run.
- Slow hooks apply backpressure to the mining/import path by design.
- Emitted during block lifecycle and Engine API payload procedures. Exercised in tests across manual, automine, interval-mining, and Engine API calls.

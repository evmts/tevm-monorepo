[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / tevmViemActions

# Function: tevmViemActions()

> **tevmViemActions**(): (`client`) => [`TevmViemActionsApi`](../type-aliases/TevmViemActionsApi.md)

Defined in: [packages/memory-client/src/tevmViemActions.js:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmViemActions.js#L22)

Viem extension that attaches the full set of TEVM actions to a viem client built with
[createTevmTransport](createTevmTransport.md). Prefer the tree-shakeable actions directly in frontend bundles.

## Returns

viem extension function.

(`client`) => [`TevmViemActionsApi`](../type-aliases/TevmViemActionsApi.md)

## Throws

If the client doesn't have a TEVM transport configured.

## Example

```typescript
import { createClient } from 'viem'
import { createTevmTransport, tevmViemActions } from 'tevm'

const client = createClient({ transport: createTevmTransport() })
const tevmClient = client.extend(tevmViemActions())
await tevmClient.tevmReady()
```

## See

[TEVM Actions Guide](https://tevm.sh/learn/actions/)

[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [decorators](../README.md) / LogTopic

# Type Alias: LogTopic

> **LogTopic**: [`Hex`](../../index/type-aliases/Hex.md) \| [`Hex`](../../index/type-aliases/Hex.md)[] \| `null`

Defined in: packages/decorators/dist/index.d.ts:458

Event log topic for Ethereum event filtering.
Can be a single topic, array of alternative topics, or null for wildcard matching.

## Example

```typescript
import { LogTopic } from '@tevm/decorators'

// Match specific topic
const singleTopic: LogTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

// Match any of several topics (OR condition)
const multipleTopic: LogTopic = [
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer
  '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'  // Approval
]

// Wildcard - match any topic
const wildcardTopic: LogTopic = null
```

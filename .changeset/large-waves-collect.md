---
"@tevm/actions": minor
"@tevm/node": minor
"@tevm/memory-client": minor
"tevm": minor
---

Added support for automining.

```typescript
const tevm = createMemoryClient({
  miningConfig: {
    type: "auto",
  },
});
```

---
"@tevm/actions": patch
"@tevm/base-client": patch
"@tevm/memory-client": minor
"tevm": patch
---

Added support for automining.

```typescript
const tevm = createMemoryClient({
  miningConfig: {
    type: "auto",
  },
});
```

---
"@tevm/state": minor
"@tevm/node": minor
"@tevm/memory-client": minor
---

feat: add chainId override option to ForkOptions

Added ability to override the chain ID when forking a network. This is useful to avoid wallet confusion (especially with MetaMask) when working with forked chains that have the same chain ID as the original network.

Usage:
```typescript
const client = createMemoryClient({
  fork: {
    transport: http('https://mainnet.optimism.io'),
    chainId: 1337 // Override to custom chain ID
  }
})
```

Priority order for chain ID resolution:
1. fork.chainId (highest priority)
2. common.id
3. auto-detected from RPC
4. default chain ID

Fixes #1595

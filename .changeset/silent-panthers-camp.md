---
"@tevm/memory-client": minor
"@tevm/base-client": minor
"@tevm/chains": minor
"tevm": minor
---

Breaking: Removed chainId property in favor of `TevmChain` from `@tevm/chains`. TevmChain extends ViemChain and ethereumjs Common for a common interface for specifying chain/common info
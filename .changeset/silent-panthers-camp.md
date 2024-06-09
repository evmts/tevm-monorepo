---
"@tevm/memory-client": minor
"@tevm/base-client": minor
"tevm": minor
---

Breaking: Removed the chainId property in favor of `TevmChain` from `@tevm/common`. TevmChain extends ViemChain and ethereumjs Common for a common interface for specifying chain/common info

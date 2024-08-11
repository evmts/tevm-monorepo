---
"@tevm/memory-client": minor
"@tevm/node": minor
---

[Breaking] Removed the chainId property in favor of a getChainId property. Removed vm property in favor of a getVm property. These changes allow the tevm memory client and base client to be instanciated syncronously.

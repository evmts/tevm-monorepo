---
"@tevm/bundler": minor
---

Added persistent cache support. When passed in an optional cache object to the bundler solc results are persisted across compilations. This is important to add before Tevm vm is added as it will require bytecode. Compiling bytecode can be as much as 80 times slower. This will improve performance in following situations:

1. Importing the same contract in multiple places. With the cache the contract will only be compiled once
2. Compiling in dev mode. Now if contracts don't change previous compilations will be cached

In future the cache will offer ability to persist in a file. This will allow the cache to persist across different processes

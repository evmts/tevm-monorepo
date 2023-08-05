---
"@evmts/config": patch
---

Fixed bug with swallowing error when tsconfig is missing

- Previously the underlying error when EVMts was unable to find the tsconfig was never logged. 
- Now if EVMts cannot find the tsconfig the underlying error will be logged before logging the normal EVMts error and exiting

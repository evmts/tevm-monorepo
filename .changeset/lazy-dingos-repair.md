---
"@evmts/core": patch
---

Fixed bug with write() typescript type falsely not returning functionName. This would previously cause issues where typescript would falsely think functionName was not provided even though it was there at runtime.

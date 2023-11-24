---
"@evmts/resolutions": patch
---

EVMts will run in "loose" mode when it comes to respecting pragmas via using latest version of solc and always compiling if pragma specified is lower than current compiler version. This improves general compatibility while still failing early if the pragma version is too early

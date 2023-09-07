---
"@evmts/config": patch
---

Fixed bug with evmts failing to load JSONc (JSON with comments). Previously if a tsconfig had comments in it or trailign commas json parsing would failing. Now EVMts will load these jsons correctly via using node-jsonc-parser instead of JSON.parse

---
"@evmts/cli": patch
---

Fixed bug with @evmts/cli where build:dist command was never added. This caused the package publishing to never find the cli package and thus never actually build it's javascript outputs

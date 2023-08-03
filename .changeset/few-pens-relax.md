---
"@evmts/bundler": patch
---

Fixed a bug with stack too deep error. Error happens when recursive contract imports (e.g. contract a imports contract b which imports contract c etc.) go over the total amount of stack frames allowed by JS. When this happens the process would fail with a "stack too deep error".

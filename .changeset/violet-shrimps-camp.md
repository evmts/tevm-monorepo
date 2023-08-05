---
"@evmts/bundler": patch
---

Fixed another stack too deep bug from a recursive function in bundler

- A previous fix fixed a stack too deep error but another one was discovered. 
- Fixed via refactoring a recursive internal function to iterative. 
- This bug affected projects importing solidity that imports other solidity deep enough to make the stack too deep


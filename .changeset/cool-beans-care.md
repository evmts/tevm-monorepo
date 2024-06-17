---
"@tevm/contract": minor
---

Big revamp of tevm contracts

- Now can pass in an address at construction time. Along with bytecode options.
- createScript and Script are removed in favor of Contract covering both use cases
- Contracts now automatically will encode constructor args and optionally contract args

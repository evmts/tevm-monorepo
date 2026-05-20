---
id: 012
status: todo
priority: P2
area: rpc
---

# tevm_* Canonical Namespace And Optional zevm_* Aliases

## Problem

Tevm should use `tevm_*` as its canonical extension namespace. Some ZEVM method names may be useful as compatibility aliases, but Tevm should not make `zevm_*` the primary API.

## Scope

- Audit existing generated Anvil/Hardhat/Ganache/EVM/Tevm aliases.
- Define canonical `tevm_*` methods for Tevm-specific controls.
- Decide which `zevm_*` aliases are low-risk compatibility aliases.
- Avoid aliasing methods that have materially different semantics.
- Ensure alias docs do not imply Tevm is the ZEVM binary/client.

## Acceptance Criteria

- Namespace policy is documented.
- Runtime aliases have tests.
- Incompatible aliases are intentionally rejected or omitted with a documented reason.


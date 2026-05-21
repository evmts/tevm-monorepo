---
id: 015b
status: done
priority: P1
area: hardforks
depends_on: [015]
---

# Document Verkle As Unsupported

## Problem

Tevm should not claim or attempt Verkle/state-witness execution support. EIP-6800-family execution is intentionally outside current Tevm scope.

## Scope

- Document Verkle/EIP-6800 witness execution as unsupported.
- Ensure VM block execution rejects EIP-6800 activation explicitly.
- Keep block-level witness parsing/types separate from any execution-support claim.
- Do not add a Verkle-aware state manager path.

## Acceptance Criteria

- Verkle execution is called out as unsupported in parity docs.
- EIP-6800 block execution fails with a typed unsupported-parameter error.
- State manager APIs do not expose a placeholder Verkle witness initializer.
- Non-Verkle execution behavior remains unchanged.

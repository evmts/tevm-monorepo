---
id: 016
status: done
priority: P1
area: hardforks
---

# Unsupported EIPs Followups For Frontier Through Osaka

## Problem

Some hardfork-scoped EIP behaviors still need real upstream-vector parity validation.

## Scope

- Add upstream state and execution vectors for each hardfork boundary.
- Add per-EIP assertions for transaction envelope validation, header field gating, and precompile activation.
- Track upstream fixture gaps for supported Frontier-through-Osaka EIPs only.

## Blocking Notes

- This blocks full EIP-level parity claims across Frontier through Osaka.
- It does not block hardfork configuration selection itself.
- Verkle/EIP-6800 witness execution is intentionally unsupported and should not be tracked as a parity gap.

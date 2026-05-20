---
id: 016
status: done
priority: P1
area: hardforks
---

# Unsupported EIPs Followups For Frontier Through Osaka

## Problem

Some hardfork-scoped EIP behaviors are still represented by simplified conformance fixtures and need deeper upstream-vector parity validation.

## Scope

- Replace arithmetic smoke vectors with upstream state and execution vectors for each hardfork boundary.
- Add per-EIP assertions for transaction envelope validation, header field gating, and precompile activation.
- Track known gaps in Osaka/Verkle transition vectors when upstream fixtures evolve.

## Blocking Notes

- This blocks full EIP-level parity claims across Frontier through Osaka.
- It does not block hardfork configuration selection itself.

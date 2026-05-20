---
id: 015a
status: done
priority: P1
area: hardforks
blocked_by: [015b, 015c]
depends_on: [015]
---

# Unsupported EIPs Blocking Full Frontier→Osaka Parity

The hardfork-gating path is implemented via `@evmts/zevm/common` feature activation.
The following remains blocked for full execution parity in Tevm:

- Verkle/state-witness execution paths (e.g. EIP-6800 family) are not supported in current Tevm VM/state pipeline.

## Follow-up Tickets Required

- [015b](./015b-verkle-state-manager-and-witness-handling.md): Add Verkle-aware state manager and block witness handling.
- [015c](./015c-verkle-transition-conformance-vectors.md): Add conformance vectors for Verkle transitions once execution support is available.

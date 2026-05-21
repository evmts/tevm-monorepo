---
id: 015a
status: done
priority: P1
area: hardforks
depends_on: [015]
---

# Unsupported EIPs Blocking Full Frontier→Osaka Parity

The hardfork-gating path is implemented via `@evmts/zevm/common` feature activation.
The following is intentionally outside Tevm execution parity scope:

- Verkle/state-witness execution paths (e.g. EIP-6800 family) are not supported in current Tevm VM/state pipeline.

## Decision

Do not implement Verkle-aware state execution, Verkle witness application, or Verkle conformance vectors in this repo. If EIP-6800 is activated accidentally, Tevm should return an explicit unsupported error instead of partial execution.

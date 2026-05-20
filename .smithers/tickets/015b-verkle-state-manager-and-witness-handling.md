---
id: 015b
status: todo
priority: P1
area: hardforks
depends_on: [015]
---

# Verkle-Aware State Manager And Block Witness Handling

## Problem

Tevm currently parses Verkle witness payload shapes in block types, but the VM/state pipeline does not execute with Verkle-aware state transitions. This blocks EIP-6800-family execution parity for Osaka-era paths.

## Scope

- Add a Verkle-aware state manager implementation path for VM execution.
- Implement execution witness ingestion/validation hooks for block processing.
- Wire block-level execution witness data through execution entry points where required.
- Ensure feature-gating is aligned with `@evmts/zevm/common` hardfork/EIP activation.
- Return explicit, typed errors when Verkle execution is requested but unsupported prerequisites are missing.

## Acceptance Criteria

- Verkle execution paths can be enabled via hardfork/EIP feature activation without fallback to unsupported behavior.
- Block witness data required for EIP-6800-family execution is validated and applied in the state pipeline.
- Tests cover success and failure paths for witness handling and state transition integration.
- Non-Verkle execution behavior remains unchanged.

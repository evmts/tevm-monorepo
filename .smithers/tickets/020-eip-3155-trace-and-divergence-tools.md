---
id: 020
status: todo
priority: P1
area: testing
depends_on: [019]
---

# EIP-3155 Trace And Divergence Tools

## Problem

Tevm has debug trace APIs, but the ZEVM/Guillotine Mini testing workflow uses EIP-3155 trace capture and comparison to identify execution divergences.

## Scope

- Add EIP-3155 trace output support or a converter from Tevm's internal trace format.
- Add trace comparison tooling against reference traces.
- Add an isolate-test command for one failing state test.
- Capture program counter, opcode, gas, stack, memory, storage, and return data differences.

## Acceptance Criteria

- A command can run one test and emit an EIP-3155 trace.
- A command can compare Tevm output with a reference trace and show first divergence.
- Trace tooling works across multiple hardforks.
- Debug trace API behavior remains backward compatible.


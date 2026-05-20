---
id: 015c
status: todo
priority: P1
area: testing
depends_on: [015, 015b, 019]
---

# Verkle Transition Conformance Vectors

## Problem

After Verkle execution support lands, Tevm still needs conformance vectors to verify Verkle transition correctness across hardfork boundaries and witness-driven execution paths.

## Scope

- Add Verkle-focused vectors to the existing hardfork conformance harness.
- Cover state transition cases that require execution witness inputs.
- Include negative vectors for malformed/invalid witness data.
- Add Osaka-era filtering/grouping so Verkle vectors can be run independently or with broader parity suites.
- Capture failure outputs in a format suitable for Smithers debugging workflows.

## Acceptance Criteria

- A documented command runs Verkle transition vectors through Tevm.
- Vectors include both valid and invalid witness cases.
- Results are attributable to hardfork/EIP context and integrate with existing parity reporting.
- CI or Smithers workflow includes at least a scoped Verkle subset once execution support is available.

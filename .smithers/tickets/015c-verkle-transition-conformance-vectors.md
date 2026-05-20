---
id: 015c
status: done
priority: P1
area: testing
depends_on: [015, 015b, 019]
---

# Remove Verkle Transition Conformance Vectors

## Problem

Tevm should not ship synthetic or placeholder Verkle conformance coverage because Verkle/EIP-6800 execution is intentionally unsupported.

## Scope

- Remove `test:conformance:verkle` entry points.
- Remove local Verkle transition vectors and known-gap files.
- Remove Verkle artifacts from parity suite aggregation.
- Document unsupported Verkle coverage policy.

## Acceptance Criteria

- No package or Smithers script references `test:conformance:verkle`.
- No local Verkle conformance vector is included in parity runs.
- Parity docs state that Verkle/EIP-6800 witness execution is unsupported.

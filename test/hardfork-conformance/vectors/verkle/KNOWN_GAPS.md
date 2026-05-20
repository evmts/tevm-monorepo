# Osaka/Verkle Upstream Gap Registry

This file tracks known conformance gaps between Tevm vectors and upstream fixtures for Osaka/Verkle transitions.

## Update Process

1. When upstream Osaka/Verkle fixtures change, run:
   - `pnpm test:conformance:verkle:all`
   - `pnpm test:conformance:gst:all`
   - `pnpm test:conformance:execspec:all`
2. For each failing Osaka/Verkle vector, add or update an entry below with:
   - upstream fixture reference
   - first observed date
   - expected behavior
   - current Tevm behavior
   - blocking ticket
3. Remove entries only after a green run confirms parity.

## Known Gaps

### VG-001: Osaka witness semantic parity (EIP-6800 family)

- Status: open
- Upstream ref: `ethereum/execution-spec-tests#osaka/*` witness transition cases (as adopted)
- First observed: 2026-05-20
- Expected: Full witness-aware state transition parity during Osaka activation boundaries.
- Current: Tevm tracks fixture-level transition vectors and validation scaffolding, but full upstream witness transition parity remains blocked by Verkle execution support follow-ups.
- Blocking tickets: `.smithers/tickets/015b-verkle-state-manager-and-witness-handling.md`, `.smithers/tickets/015c-verkle-transition-conformance-vectors.md`

### VG-002: Upstream Osaka vector churn tracking

- Status: open
- Upstream ref: `ethereum/tests` + `execution-spec-tests` Osaka fixture revisions
- First observed: 2026-05-20
- Expected: Fixture updates are reflected without stale local assumptions.
- Current: Local conformance vectors include Osaka coverage metadata and hardfork gating checks, with manual registry updates required on upstream revisions.
- Blocking tickets: `.smithers/tickets/015-unsupported-eips-blockers.md`

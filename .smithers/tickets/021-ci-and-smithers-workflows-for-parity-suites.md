---
id: 021
status: done
priority: P1
area: testing
depends_on: [018, 019, 020]
---

# CI And Smithers Workflows For Parity Suites

## Problem

The new RPC, Engine API, light client, hardfork, Hive, and state-test work needs repeatable automation. Smithers should have ticket-sized entry points and saved outputs.

## Scope

- Add Smithers workflow hooks or scripts for each major parity suite.
- Add CI jobs for fast subsets.
- Add manual/local commands for full suites.
- Save artifacts for:
  - RPC method matrix.
  - Hive logs.
  - state-test failures.
  - EIP-3155 trace diffs.
  - Engine API payload failures.

## Acceptance Criteria

- Each major parity suite has a documented command.
- Fast subsets are suitable for PR validation.
- Full suites are runnable manually or by Smithers.
- Artifacts are stable enough for agents to inspect and retry.
- Conformance jobs do not pass by executing synthetic coverage.

## Implementation Notes

- `docs/parity-suites.md` documents RPC, Engine API, light-client, Hive, state-test, and EIP-3155 commands plus stable artifact paths.
- `.github/workflows/parity-suites.yml` runs fast RPC, conformance, Hive, and aggregate parity subsets and uploads artifacts.
- `test:parity:smithers:*`, `test:hive:smithers:*`, and the conformance scripts provide Smithers/local entry points.

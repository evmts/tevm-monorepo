---
id: 021
status: todo
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

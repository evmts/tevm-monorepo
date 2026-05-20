---
id: 018
status: todo
priority: P0
area: testing
depends_on: [006]
---

# Hive Test Harness

## Problem

Tevm should be testable with Hive-style Ethereum execution-client test suites, matching the testing direction used by ZEVM.

## Scope

- Add repo tooling to run Hive suites against Tevm.
- Provide a Tevm node adapter/container or process wrapper usable by Hive.
- Include Engine API, JSON-RPC, devp2p/sync placeholders as appropriate.
- Document required local dependencies.
- Add a focused initial suite that can run in CI or a manual Smithers workflow.

## Acceptance Criteria

- A documented command runs at least one Hive suite against Tevm.
- Failures produce saved logs/artifacts.
- The harness can target a local Tevm server.
- CI/Smithers integration is possible without requiring external secrets.


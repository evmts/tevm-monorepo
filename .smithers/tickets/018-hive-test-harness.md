---
id: 018
status: done
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

## Evidence

- `test/hive/run-hive.sh` provides the Hive-style runner, artifact capture, local Tevm startup, and external RPC targeting via `START_LOCAL_TEVM=false TEVM_RPC_URL=...`.
- `test/hive/scripts/tevm-hive-node.sh`, `test/hive/client/Dockerfile`, and `test/hive/client/entrypoint.sh` provide process and container adapters.
- `test/hive/README.md` documents dependencies, smoke and `rpc-compat` commands, artifacts, local server targeting, and current devp2p/sync placeholders.
- `.github/workflows/parity-suites.yml` and `.smithers/package.json` expose CI/Smithers smoke commands without external secrets.
- Verified on 2026-05-20 with `pnpm test:hive:smoke`; it passed `web3_clientVersion`, `eth_chainId`, `eth_blockNumber`, and `engine_exchangeCapabilities` checks and wrote `test/hive/artifacts/tevm-hive-smoke.{log,json}`.
